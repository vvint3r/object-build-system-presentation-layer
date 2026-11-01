"""Measure printed kit pages (A4 PDFs written by tools/print.mjs).

usage: python3 tools/print-measure.py <dir> [name ...]   (each name has <name>.pdf and <name>.json)

For each PDF: the page count; pages less than half used, other than the last; a last page less than
15% used; texts from the page's heading, kicker and label lists that start in the bottom tenth of a
page; a heading, label or section lede that is the last text on a page; and whether the pages carry
numbers. A page's used height runs from the top margin to the lowest text, rule, fill or image,
leaving out white fills and the bottom margin, where the page number prints. Exit code 3 when
PyMuPDF is missing.
"""
import json
import os
import re
import sys

try:
    import fitz
except ImportError:
    sys.exit(3)

MM = 72 / 25.4
TOP = BOT = 16 * MM  # the kit's @page margin, top and bottom
norm = lambda s: re.sub(r'\s+', ' ', s).strip().lower()

out_dir = sys.argv[1]
names = sys.argv[2:] or sorted(f[:-4] for f in os.listdir(out_dir) if f.endswith('.pdf'))
for name in names:
    meta = json.load(open(os.path.join(out_dir, name + '.json')))
    labels = [(m['kind'], norm(m['text'])) for m in meta['marks'] if m['kind'] != 'lede']
    ledes = [norm(m['text']) for m in meta['marks'] if m['kind'] == 'lede']

    def kind_of(t):
        t = norm(t)
        if len(t) < 2:
            return None
        for k, s in labels:
            if t == s or (len(t) >= 6 and s.startswith(t)):
                return k
        return None

    doc = fitz.open(os.path.join(out_dir, name + '.pdf'))
    n = doc.page_count
    sparse, last_page, foot, ends, numbered = [], None, [], [], False
    for i, pg in enumerate(doc):
        H = pg.rect.height
        top, bot = TOP, H - BOT
        numbered = numbered or any(b[1] >= bot - 1 and 'page' in b[4].lower() for b in pg.get_text('blocks'))
        lines = []
        for b in pg.get_text('dict')['blocks']:
            for ln in b.get('lines', []):
                t = ''.join(s['text'] for s in ln['spans']).strip()
                if t and ln['bbox'][1] < bot - 1:
                    lines.append((ln['bbox'], t))
        ys = [bb[3] for bb, _ in lines]
        for dr in pg.get_drawings():
            r = dr['rect']
            if (r.width > pg.rect.width * 0.9 and r.height > H * 0.9) or r.y0 >= bot - 1:
                continue
            f = dr.get('fill')
            if dr.get('color') is None and f is not None and min(f) > 0.99:
                continue
            ys.append(r.y1)
        for im in pg.get_images(full=True):
            ys.extend(r.y1 for r in pg.get_image_rects(im[0]))
        used = max(0.0, min(1.0, ((max(ys) if ys else top) - top) / (bot - top)))
        if i < n - 1 and used < 0.5:
            sparse.append(f'{i + 1} ({used:.0%})')
        if i == n - 1 and used < 0.15:
            last_page = f'{i + 1} ({used:.0%})'
        for bb, t in lines:
            if bb[1] > top + 0.9 * (bot - top) and kind_of(t):
                foot.append(f'{i + 1} "{t[:40]}"')
        if i < n - 1 and lines:
            low = max(bb[3] for bb, _ in lines)
            last = [t for bb, t in lines if bb[3] > low - 4]
            k = next((kind_of(t) for t in last if kind_of(t)), None)
            if not k and any(norm(t) and any(L.endswith(norm(t)) for L in ledes) for t in last):
                k = 'lede'
            if k:
                ends.append(f'{i + 1} {k} "{" ".join(last)[:40]}"')
    print(f'{name}: {n} pages, numbered: {"yes" if numbered else "no"}')
    print(f'    less than half used: {", ".join(sparse) or "none"}')
    print(f'    nearly empty last page: {last_page or "no"}')
    print(f'    labels in the bottom tenth: {", ".join(foot) or "none"}')
    print(f'    a heading, label or lede ends the page: {", ".join(ends) or "none"}')
