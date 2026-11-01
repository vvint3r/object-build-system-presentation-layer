// Width: the page never scrolls sideways, only the boxes the spec lets scroll do, and no text is cut
// off by its container. Run at the desktop window, at the printed column's width in print, and in
// the phone pass at 390px (SPEC sections 5 and 12).

import { PRINT_PAGE } from '../tools/load.mjs';

// The boxes that scroll sideways inside themselves on a narrow screen (SPEC §8.11, §8.17, §8.20).
const SCROLLERS = '.cm-table-wrap, .cm-code pre, .cm-diagram';

// Run an in-page measure at the width the mode lays out at: in print, the printed column.
async function atWidth(page, mode, fn, arg) {
  const before = page.viewportSize();
  if (mode === 'print') { await page.setViewportSize(PRINT_PAGE); await page.waitForTimeout(300); }
  const out = await page.evaluate(fn, arg);
  if (mode === 'print') { await page.setViewportSize(before); await page.waitForTimeout(300); }
  return out;
}

export default [
  {
    // The page is no wider than the window: nothing reaches past its right edge outside a box that
    // scrolls. A box that scrolls sideways is a table, a code block or a diagram, which the spec
    // lets scroll inside their own box; in print they hold their width, so nothing is wider than
    // the printed column.
    name: 'page-width', level: 'fail', source: 'SPEC §5, §8.11, §8.17, §8.20, §12; record 086', phone: true,
    run: ({ page, mode }) => atWidth(page, mode, ({ check, SCROLLERS }) => {
      const H = window.__cm, out = [], de = document.documentElement, W = de.clientWidth;
      const scrolls = el => { const o = getComputedStyle(el).overflowX; return o === 'auto' || o === 'scroll'; };
      if (de.scrollWidth > W + 0.5) {
        out.push({ where: 'html', value: `the page is ${de.scrollWidth}px wide in a ${W}px window` });
        // the outermost elements that reach past the edge, outside any box that scrolls
        const wide = H.elements().filter(el => {
          if (!H.shown(el) || H.exempt(el, check) || el.getBoundingClientRect().right <= W + 0.5) return false;
          for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
            if (scrolls(a) || a.getBoundingClientRect().right > W + 0.5) return false;
          }
          return true;
        });
        wide.slice(0, 20).forEach(el => out.push({ where: H.path(el), value: `reaches ${Math.round(el.getBoundingClientRect().right)}px` }));
      }
      for (const el of H.elements()) {
        if (!scrolls(el) || el.scrollWidth <= el.clientWidth + 1 || !H.shown(el) || H.exempt(el, check)) continue;
        if (!el.matches(SCROLLERS)) out.push({ where: H.path(el), value: `scrolls sideways, ${el.scrollWidth}px in ${el.clientWidth}px (only tables, code and diagrams scroll in their box)` });
      }
      return out;
    }, { check: 'page-width', SCROLLERS }),
  },

  {
    // A table, code block or diagram wider than its box scrolls inside it and shows the cue above its
    // content: the box carries data-cm-scroll and draws the cue. A box that fits carries no cue. In
    // print nothing scrolls and no cue prints.
    name: 'scroll-cue', level: 'fail', source: 'SPEC §5, §8.11, §8.17, §8.20, §12; record 096', phone: true,
    run: ({ page, mode }) => atWidth(page, mode, ({ check, SCROLLERS, mode }) => {
      const H = window.__cm, out = [];
      for (const el of document.querySelectorAll(SCROLLERS)) {
        if (!H.shown(el) || H.exempt(el, check)) continue;
        const wide = el.scrollWidth > el.clientWidth + 1, cs = getComputedStyle(el, '::before');
        const drawn = H.pseudoDrawn(el, '::before') && cs.display !== 'none';
        const marked = el.hasAttribute('data-cm-scroll');
        if (mode === 'print') { if (marked && drawn) out.push({ where: H.path(el), value: 'prints a scroll cue' }); continue; }
        if (wide && !(marked && drawn)) out.push({ where: H.path(el), value: `scrolls sideways, ${el.scrollWidth}px in ${el.clientWidth}px, with no cue` });
        if (!wide && marked) out.push({ where: H.path(el), value: 'fits its box but shows a scroll cue' });
      }
      return out;
    }, { check: 'scroll-cue', SCROLLERS, mode }),
  },

  {
    // No text is cut off: every line of text lies inside each ancestor that hides what overflows it,
    // and inside the box of the element that holds it. Text in a box that scrolls is reached by
    // scrolling, so it counts as inside. Visually hidden text is exempt.
    name: 'text-clip', level: 'fail', source: 'SPEC §5; record 086', phone: true,
    run: ({ page, mode }) => atWidth(page, mode, check => {
      const H = window.__cm, out = [], range = document.createRange(), seen = new Set();
      const block = el => { for (let n = el; n; n = n.parentElement) { const d = getComputedStyle(n).display; if (d !== 'inline' && d !== 'contents') return n; } return el; };
      const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = walk.nextNode(); n; n = walk.nextNode()) {
        if (!n.nodeValue.trim()) continue;
        const el = n.parentElement;
        if (!el || H.ignored(el) || el.closest('.cm-sr') || !H.shown(el) || H.exempt(el, check)) continue;
        range.selectNodeContents(n);
        const rects = [...range.getClientRects()].filter(r => r.width > 0 && r.height > 0);
        if (!rects.length) continue;
        const l = Math.min(...rects.map(r => r.left)), r = Math.max(...rects.map(r => r.right));
        const t = Math.min(...rects.map(r => r.top)), b = Math.max(...rects.map(r => r.bottom));
        const text = `"${n.nodeValue.replace(/\s+/g, ' ').trim().slice(0, 24)}"`;
        // the box of the element that holds the text, unless that box scrolls to show it
        const own = block(el), ob = own.getBoundingClientRect();
        if (!/auto|scroll/.test(getComputedStyle(own).overflowX) && (l < ob.left - 1 || r > ob.right + 1)) {
          const key = H.path(own);
          if (!seen.has(key)) { seen.add(key); out.push({ where: `${key} text ${text}`, value: `runs ${Math.round(Math.max(ob.left - l, r - ob.right))}px out of its box` }); }
          continue;
        }
        // every ancestor that hides its overflow, up to the first box that scrolls, where the text is
        // reached by scrolling
        for (let a = el; a && a !== document.documentElement; a = a.parentElement) {
          const cs = getComputedStyle(a), hx = /hidden|clip/.test(cs.overflowX), hy = /hidden|clip/.test(cs.overflowY);
          const scrolls = /auto|scroll/.test(cs.overflowX + ' ' + cs.overflowY);
          if (hx || hy) {
            const ab = a.getBoundingClientRect(), k = H.scale(a);
            const cl = ab.left + a.clientLeft * k, cr = cl + a.clientWidth * k, ct = ab.top + a.clientTop * k, cb = ct + a.clientHeight * k;
            if ((hx && (l < cl - 1 || r > cr + 1)) || (hy && (t < ct - 1 || b > cb + 1))) {
              const key = H.path(el) + '|' + H.path(a);
              if (!seen.has(key)) { seen.add(key); out.push({ where: `${H.path(el)} text ${text}`, value: `cut off by ${H.path(a).split(' > ').pop()}` }); }
              break;
            }
          }
          if (scrolls) break;
        }
      }
      return out;
    }, 'text-clip'),
  },
];
