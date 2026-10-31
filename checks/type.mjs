// Typefaces, weights and sizes on the computed styles of the rendered page, in every mode.

import { PRINT_PAGE } from '../tools/load.mjs';

export default [
  {
    // Nunito for everything; JetBrains Mono only inside code and file names. Labels and chips stay
    // Nunito even inside a code block, as the language tag in the spec's own code bar does.
    name: 'font-family', level: 'fail', source: 'SPEC §1 rule 5',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const CODE = 'code, .cm-code, .cm-code__file';
      for (const { el, pseudo, cs } of H.textItems()) {
        if (H.exempt(el, check)) continue;
        const want = el.closest(CODE) && !H.isLabel(el, pseudo) ? 'JetBrains Mono' : 'Nunito';
        const got = H.family(cs);
        if (got !== want) out.push({ where: H.where(el, pseudo), value: `font-family ${got} (expected ${want})` });
      }
      for (const { el, cs, where } of H.chartText()) {
        if (H.exempt(el, check)) continue;
        const got = H.family(cs);
        if (got !== 'Nunito') out.push({ where, value: `font-family ${got} (expected Nunito)` });
      }
      return out;
    },
  },

  {
    name: 'font-weight', level: 'fail', source: 'SPEC §1 rule 4',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const OK = ['300', '400', '600', '700', '800', '900'];
      for (const { el, pseudo, cs } of H.textItems()) {
        if (!H.exempt(el, check) && !OK.includes(cs.fontWeight)) out.push({ where: H.where(el, pseudo), value: `font-weight ${cs.fontWeight}` });
      }
      for (const { el, cs, where } of H.chartText()) {
        if (!H.exempt(el, check) && !OK.includes(cs.fontWeight)) out.push({ where, value: `font-weight ${cs.fontWeight}` });
      }
      return out;
    },
  },

  {
    // Running text never below 13px, except where small text is ruled: the label tier, role tags and
    // table sort arrows (section 4) and the elements record 056 kept at their own sizes (buttons,
    // timeline dates, footnote markers, printed source URLs, chart text). A citation is set as a
    // footnote marker (section 8.21). Mono is held only to the type floor (type-floor).
    name: 'type-size', level: 'fail', source: 'SPEC §4; records 056, 058',
    inPage: ({ check, mode }) => {
      const H = window.__cm, out = [];
      const small = (el, pseudo) => H.isLabel(el, pseudo)
        || (pseudo && el.matches('.cm-table th button'))
        || !!el.closest('.cm-props sup')
        || !!el.closest('.cm-btn, .cm-timeline__date, .cm-fn, .cm-cite')
        || (mode === 'print' && pseudo === '::after' && el.matches('.cm-sources a'));
      for (const { el, pseudo, cs } of H.textItems()) {
        if (H.exempt(el, check)) continue;
        const px = H.px(cs.fontSize), mono = H.family(cs) === 'JetBrains Mono';
        if (px < 13 && !mono && !small(el, pseudo)) out.push({ where: H.where(el, pseudo), value: `font-size ${px}px (running text floor 13px)` });
      }
      return out;
    },
  },

  {
    // The type floor: no text renders below 11px, measured as drawn, after every transform that
    // scales it (a diagram scaled to fit the printed column) and, for chart text, after the chart's
    // drawing is stretched or shrunk to its box. Superscript and subscript markers and visually
    // hidden text are exempt. Print is measured at the printed column's width, where a chart drawn
    // for print fills its box as it does on paper; the viewport is set back afterwards.
    name: 'type-floor', level: 'fail', source: 'SPEC §4; record 086', phone: true,
    run: async ({ page, mode }) => {
      const before = page.viewportSize();
      if (mode === 'print') { await page.setViewportSize(PRINT_PAGE); await page.waitForTimeout(300); }
      const out = await page.evaluate(check => {
        const H = window.__cm, out = [], FLOOR = 11;
        H.rescale();
        const report = (el, pseudo, px, text) => out.push({ where: `${H.where(el, pseudo)} text "${text.replace(/\s+/g, ' ').trim().slice(0, 24)}"`, value: `${+px.toFixed(2)}px as drawn (floor ${FLOOR}px)` });
        const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const range = document.createRange();
        for (let n = walk.nextNode(); n; n = walk.nextNode()) {
          if (!n.nodeValue.trim()) continue;
          const el = n.parentElement;
          if (!el || H.ignored(el) || el.closest('.cm-sr, sup, sub') || !H.shown(el) || H.exempt(el, check)) continue;
          range.selectNodeContents(n);
          if (![...range.getClientRects()].some(r => r.width > 0 && r.height > 0)) continue;
          const px = H.px(getComputedStyle(el).fontSize) * H.scale(el);
          if (px < FLOOR - 0.01) report(el, '', px, n.nodeValue);
        }
        for (const { el, pseudo, cs } of H.textItems()) {
          if (!pseudo || el.closest('sup, sub') || H.exempt(el, check)) continue;
          const px = H.px(cs.fontSize) * H.scale(el);
          if (px < FLOOR - 0.01) report(el, pseudo, px, H.pseudoText(el, pseudo).replace(/"/g, ''));
        }
        for (const { el, cs, where } of H.chartText()) {
          if (H.exempt(el, check)) continue;
          const m = el.getScreenCTM(), px = H.px(cs.fontSize) * (m ? Math.hypot(m.a, m.b) : 1);
          if (px < FLOOR - 0.01) out.push({ where, value: `${+px.toFixed(2)}px as drawn (floor ${FLOOR}px)` });
        }
        return out;
      }, 'type-floor');
      if (mode === 'print') { await page.setViewportSize(before); await page.waitForTimeout(300); }
      return out;
    },
  },

  {
    // Text in the label tier renders at exactly 11px, weight 800, capitals, +0.06em; chips are the
    // same. A diagram scaled to fit the printed column sets its labels larger so they print at 11px
    // (section 8.20): there the size is measured as drawn, within 2%. The breadcrumb keeps three
    // weights: links 700, the current page 900, separators 300. Text with no lower-case letters (rail
    // and step numbers, appendix letters) needs no transform. A delta keeps the case it is written
    // in, so its units read as written ("−50s", not "−50S").
    name: 'label-type', level: 'fail', source: 'SPEC §4; records 056, 058, 086',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const SIZE = 11, TRACK = 0.06;
      H.rescale();
      const weight = el => !el.closest('.cm-crumbs') ? '800'
        : el.closest('[aria-current]') ? '900' : el.closest('.sep') ? '300' : '700';
      for (const { el, pseudo, cs } of H.textItems()) {
        if (!H.isLabel(el, pseudo) || H.exempt(el, check)) continue;
        const px = H.px(cs.fontSize), w = weight(el), drawn = px * H.scale(el);
        const scaled = !!el.closest('.cm-diagram__canvas') && Math.abs(drawn - px) > 0.01;
        const text = pseudo ? H.pseudoText(el, pseudo) : H.ownText(el);
        const ls = cs.letterSpacing === 'normal' ? 0 : H.px(cs.letterSpacing);
        const bad = [];
        if (scaled ? drawn < SIZE - 0.01 || drawn > SIZE * 1.02 : px !== SIZE) bad.push(scaled ? `${+drawn.toFixed(2)}px as drawn` : `font-size ${px}px`);
        if (cs.fontWeight !== w) bad.push(`font-weight ${cs.fontWeight}`);
        const asWritten = !!el.closest('.cm-delta');
        if (asWritten ? cs.textTransform !== 'none' : /[a-z]/.test(text) && cs.textTransform !== 'uppercase') bad.push(`text-transform ${cs.textTransform}`);
        if (Math.abs(ls - TRACK * px) > 0.05) bad.push(`letter-spacing ${cs.letterSpacing}`);
        if (bad.length) out.push({ where: H.where(el, pseudo), value: `${bad.join(', ')} (expected ${SIZE}px, ${w}, ${asWritten ? 'as written' : 'uppercase'}, ${TRACK}em)` });
      }
      return out;
    },
  },

  {
    // When Google Fonts is unreachable the page falls back to system faces: computed families still
    // read Nunito, but sizes and gaps are measured on a different face.
    name: 'fonts-loaded', level: 'warn', source: 'SPEC §2',
    inPage: () => {
      const loaded = fam => [...document.fonts].some(f => f.family.replace(/["']/g, '') === fam && f.status === 'loaded');
      return ['Nunito', 'JetBrains Mono']
        .filter(f => f === 'Nunito' ? !loaded(f) : document.querySelector('code, .cm-code') && !loaded(f))
        .map(f => ({ where: 'document.fonts', value: `${f} did not load; system faces were measured` }));
    },
  },
];
