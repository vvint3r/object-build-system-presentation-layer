// The page as written: its head, stylesheets, classes, inline style and colours in markup. These
// read the file itself (H.source()), so what scripts add at run time is not judged.

export default [
  {
    name: 'html-lang', level: 'fail', source: 'SPEC §2', once: true,
    inPage: () => {
      const lang = window.__cm.source().documentElement.getAttribute('lang');
      return lang && lang.trim() ? [] : [{ where: 'html', value: 'no lang attribute' }];
    },
  },

  {
    // The required head, in order. Other elements may sit between the required ones. The kind tag,
    // when present, follows the kit tag and names one of the three kinds. A report's title carries
    // its period, or the omission comment in the head; a guide's or a reference's title is the
    // title alone (SPEC §2; §7).
    name: 'head-order', level: 'fail', source: 'SPEC §2; §7', once: true,
    inPage: () => {
      const H = window.__cm, d = H.source(), kit = H.cfg.kit;
      const same = (a, b) => a.replace(/\r\n/g, '\n').trim() === b.replace(/\r\n/g, '\n').trim();
      const attr = (el, a) => el.getAttribute(a) || '';
      const ECHARTS = 'https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js';
      const out = [];
      const metas = H.kindMeta();
      if (metas.length > 1) out.push({ where: 'head', value: `${metas.length} cm-kind tags (at most 1)` });
      for (const m of metas) {
        const v = attr(m, 'content').trim();
        if (!H.KINDS.includes(v)) out.push({ where: H.path(m), value: `cm-kind "${v}" (report, guide or reference)` });
        if (m.parentElement !== d.head) out.push({ where: H.path(m), value: 'cm-kind tag outside <head>' });
      }
      const report = H.kind() === 'report';
      const noPeriod = !report || H.omitted(d.head, 'title-period');
      const want = [
        ['<meta charset="utf-8">', el => el.matches('meta[charset]') && /^utf-8$/i.test(attr(el, 'charset'))],
        ['<meta name="viewport">', el => el.matches('meta[name="viewport"]') && attr(el, 'content').replace(/\s/g, '') === 'width=device-width,initial-scale=1'],
        noPeriod
          ? ['<title>{title}</title>', el => el.matches('title') && el.textContent.trim() !== '']
          : ['<title>{title} · {period}</title>, or the period left out with cm-omit title-period', el => el.matches('title') && / · \S/.test(el.textContent)],
        ['<meta name="cm-kit" content="1.2">', el => el.matches('meta[name="cm-kit"]') && attr(el, 'content') === '1.2'],
        ...(metas.length ? [['<meta name="cm-kind">, after cm-kit', el => el.matches('meta[name="cm-kind"]')]] : []),
        ['theme pre-paint script', el => el.matches('script:not([src])') && same(el.textContent, kit.prepaint)],
        ['preconnect to fonts.googleapis.com', el => el.matches('link[rel="preconnect"]') && attr(el, 'href') === 'https://fonts.googleapis.com'],
        ['preconnect to fonts.gstatic.com, crossorigin', el => el.matches('link[rel="preconnect"][crossorigin]') && attr(el, 'href') === 'https://fonts.gstatic.com'],
        ['Google Fonts stylesheet', el => el.matches('link[rel="stylesheet"]') && attr(el, 'href') === kit.fonts],
        ['kit CSS (cm-report.css, linked or pasted)', el => (el.matches('link[rel="stylesheet"]') && /(^|\/)cm-report\.css$/.test(attr(el, 'href'))) || (el.matches('style') && same(el.textContent, kit.css))],
        ['ECharts 5.5.1', el => el.matches('script') && attr(el, 'src') === ECHARTS],
      ];
      const kids = [...d.head.children];
      let last = -1, lastName = '';
      for (const [name, test] of want) {
        const at = kids.findIndex(test);
        if (at < 0) { out.push({ where: 'head', value: `missing: ${name}` }); continue; }
        if (at < last) out.push({ where: H.path(kids[at]), value: `out of order: ${name} comes before ${lastName}` });
        else { last = at; lastName = name; }
      }
      // Kit JS: linked in the head after ECharts, or pasted as the last element of the body.
      const linked = kids.findIndex(el => el.matches('script') && /(^|\/)cm-report\.js$/.test(attr(el, 'src')));
      const lastEl = d.body.lastElementChild;
      const pasted = lastEl && lastEl.matches('script:not([src])') && same(lastEl.textContent, kit.js);
      if (linked < 0 && !pasted) out.push({ where: 'head', value: 'missing: kit JS (cm-report.js in the head, or pasted as the last element of the body)' });
      else if (linked >= 0 && linked < last) out.push({ where: H.path(kids[linked]), value: `out of order: kit JS comes before ${lastName}` });
      return out;
    },
  },

  {
    name: 'stylesheets', level: 'fail', source: 'SPEC §1 rule 2', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, d = H.source(), out = [];
      const same = (a, b) => a.replace(/\r\n/g, '\n').trim() === b.replace(/\r\n/g, '\n').trim();
      for (const l of d.querySelectorAll('link[rel~="stylesheet"]')) {
        const href = l.getAttribute('href') || '';
        if (!href.startsWith('https://fonts.googleapis.com/') && !/(^|\/)cm-report\.css$/.test(href) && !H.exempt(l, check)) out.push({ where: H.path(l), value: `stylesheet ${href}` });
      }
      for (const s of d.querySelectorAll('style')) {
        if (!same(s.textContent, H.cfg.kit.css) && !H.exempt(s, check)) out.push({ where: H.path(s), value: `<style> block of ${s.textContent.trim().split('\n').length} lines that is not cm-report.css` });
      }
      return out;
    },
  },

  {
    name: 'classes', level: 'fail', source: 'SPEC §1 rule 1', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, known = new Set(H.cfg.classes), out = [];
      for (const el of H.source().querySelectorAll('[class]')) {
        if (el.closest('svg') || H.exempt(el, check)) continue;
        for (const c of el.classList) if (!known.has(c)) out.push({ where: H.path(el), value: `class "${c}" is not in cm-report.css` });
      }
      return out;
    },
  },

  {
    name: 'inline-styles', level: 'fail', source: 'SPEC §1 rule 2', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of H.source().querySelectorAll('[style]')) {
        if (el.closest('svg') || H.exempt(el, check)) continue;
        for (const [p, v] of H.decls(el.getAttribute('style'))) {
          const ok = ['--h', '--v', '--t', '--steps'].includes(p)
            || (p === 'align-items' && /^(center|start)$/.test(v) && [...el.classList].some(c => c.startsWith('cm-grid')));
          if (!ok) out.push({ where: H.path(el), value: `style="${p}:${v}"` });
        }
      }
      return out;
    },
  },

  {
    // Hex and colour functions anywhere in an attribute; named colours where a colour is expected.
    // Custom property names are not colours (var(--cm-field) names a token). Link targets and ids
    // are skipped (#fn-1 is a fragment, not a colour). Text content is not
    // checked: the gallery prints token values as text.
    name: 'markup-colours', level: 'fail', source: 'SPEC §1 rule 3', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/;
      const FN = /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i;
      const NAMED_IN = ['style', 'data-color', 'fill', 'stroke', 'color', 'bgcolor'];
      const NOT_COLOUR = ['transparent', 'currentcolor', 'inherit', 'initial', 'unset', 'revert'];
      for (const el of H.source().querySelectorAll('*')) {
        if (H.exempt(el, check)) continue;
        for (const a of el.attributes) {
          if (['href', 'src', 'id'].includes(a.name)) continue;
          const v = a.value;
          const hit = (v.match(HEX) || v.match(FN) || [])[0]
            || (NAMED_IN.includes(a.name) && (a.name === 'style' ? H.decls(v).map(d => d[1]).join(' ') : v)
              .replace(/--[\w-]+/g, ' ').split(/[^a-zA-Z]+/).find(w => w && !NOT_COLOUR.includes(w.toLowerCase()) && H.isColour(w)));
          if (hit) out.push({ where: H.path(el), value: `${a.name}="${v.length > 60 ? v.slice(0, 60) + '…' : v}" (${hit})` });
        }
      }
      return out;
    },
  },
];
