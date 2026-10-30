// Typefaces, weights and sizes on the computed styles of the rendered page, in every mode.

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
    // Nunito never below 9px for chips and 10px anywhere else, and never below 13px except where
    // small text is ruled: the label tier, role tags and table sort arrows (section 4) and the
    // elements record 056 kept at their own sizes (buttons, timeline dates, footnote markers, printed
    // source URLs, chart text). A citation is set as a footnote marker (section 8.21). Mono has the
    // 10px floor only.
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
        const floor = el.closest('.cm-chip') ? 9 : 10;
        if (px < floor) out.push({ where: H.where(el, pseudo), value: `font-size ${px}px (floor ${floor}px)` });
        else if (px < 13 && !mono && !small(el, pseudo)) out.push({ where: H.where(el, pseudo), value: `font-size ${px}px (running text floor 13px)` });
      }
      for (const { el, cs, where } of H.chartText()) {
        const px = H.px(cs.fontSize);
        if (!H.exempt(el, check) && px < 10) out.push({ where, value: `font-size ${px}px (floor 10px)` });
      }
      return out;
    },
  },

  {
    // Text in the label tier renders at exactly 10px (chips 9px), weight 800, capitals, +0.08em. The
    // breadcrumb keeps three weights: links 700, the current page 900, separators 300. Text with no
    // lower-case letters (rail and step numbers, appendix letters) needs no transform.
    name: 'label-type', level: 'fail', source: 'SPEC §4; records 056, 058',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const weight = el => !el.closest('.cm-crumbs') ? '800'
        : el.closest('[aria-current]') ? '900' : el.closest('.sep') ? '300' : '700';
      for (const { el, pseudo, cs } of H.textItems()) {
        if (!H.isLabel(el, pseudo) || H.exempt(el, check)) continue;
        const px = H.px(cs.fontSize), size = el.closest('.cm-chip') ? 9 : 10, w = weight(el);
        const text = pseudo ? H.pseudoText(el, pseudo) : H.ownText(el);
        const ls = cs.letterSpacing === 'normal' ? 0 : H.px(cs.letterSpacing);
        const bad = [];
        if (px !== size) bad.push(`font-size ${px}px`);
        if (cs.fontWeight !== w) bad.push(`font-weight ${cs.fontWeight}`);
        if (/[a-z]/.test(text) && cs.textTransform !== 'uppercase') bad.push(`text-transform ${cs.textTransform}`);
        if (Math.abs(ls - 0.08 * px) > 0.05) bad.push(`letter-spacing ${cs.letterSpacing}`);
        if (bad.length) out.push({ where: H.where(el, pseudo), value: `${bad.join(', ')} (expected ${size}px, ${w}, uppercase, 0.08em)` });
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
