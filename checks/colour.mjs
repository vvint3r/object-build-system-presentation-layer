// Text colour and fills behind labels, on the computed styles of the rendered page, in every mode.

export default [
  {
    // Every piece of text, including what the chart library draws, is the theme's ink, black or
    // white, at full opacity on itself and every ancestor. Two exceptions (record 059): keywords,
    // strings and numbers in code take their syntax colour, and the verdict chip's text is the paper
    // colour on its ink fill.
    name: 'text-colour', level: 'fail', source: 'SPEC §1 rule 4; record 059',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const ok = new Set([H.tokens().ink, '#000000', '#ffffff'].filter(Boolean).map(H.norm));
      const root = getComputedStyle(document.documentElement);
      const SYNTAX = { k: '--cm-code-kw', s: '--cm-code-str', n: '--cm-code-num' };
      const allowed = el => {
        const tok = el.closest('.cm-code .k, .cm-code .s, .cm-code .n');
        if (tok) return H.norm(root.getPropertyValue(SYNTAX[[...tok.classList].find(c => SYNTAX[c])]).trim());
        if (el.closest('.cm-chip--verdict')) return H.norm(H.tokens().paper || '');
        return null;
      };
      const faded = (el, pseudo) => {
        if (pseudo && parseFloat(getComputedStyle(el, pseudo).opacity) < 1) return el;
        for (let n = el; n && n.nodeType === 1; n = n.parentElement) if (parseFloat(getComputedStyle(n).opacity) < 1) return n;
        return null;
      };
      for (const { el, pseudo, cs } of H.textItems()) {
        if (H.exempt(el, check)) continue;
        const c = H.norm(cs.color);
        if (!ok.has(c) && c !== allowed(el)) out.push({ where: H.where(el, pseudo), value: `color ${c}` });
        const f = faded(el, pseudo);
        if (f) out.push({ where: H.where(el, pseudo), value: `opacity ${getComputedStyle(f).opacity} on ${f === el ? 'itself' : H.path(f)}` });
      }
      for (const { el, cs, where } of H.chartText()) {
        if (H.exempt(el, check)) continue;
        const c = H.norm(cs.fill);
        if (!ok.has(c)) out.push({ where, value: `fill ${c}` });
        const op = parseFloat(cs.fillOpacity) * parseFloat(cs.opacity);
        if (op < 1) out.push({ where, value: `opacity ${op}` });
      }
      return out;
    },
  },

  {
    name: 'accent-text', level: 'fail', source: 'SPEC §1 rule 6',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const accent = H.norm(H.tokens().accent || '');
      for (const { el, pseudo, cs } of H.textItems()) {
        if (!H.exempt(el, check) && H.norm(cs.color) === accent) out.push({ where: H.where(el, pseudo), value: `color ${accent} (accent)` });
      }
      for (const { el, cs, where } of H.chartText()) {
        if (!H.exempt(el, check) && H.norm(cs.fill) === accent) out.push({ where, value: `fill ${accent} (accent)` });
      }
      return out;
    },
  },

  {
    // No coloured fill behind a chip, tag or label: on the label itself or on the nearest filled box
    // it sits on. Black, white and greys are not colour.
    name: 'label-fills', level: 'fail', source: 'SPEC §1 rule 8',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of document.querySelectorAll(H.LABEL)) {
        if (H.ignored(el) || !H.shown(el) || H.exempt(el, check)) continue;
        const cs = getComputedStyle(el);
        if (cs.backgroundImage !== 'none') { out.push({ where: H.path(el), value: `background-image ${cs.backgroundImage.slice(0, 60)}` }); continue; }
        if (H.chromatic(cs.backgroundColor)) { out.push({ where: H.path(el), value: `background ${H.norm(cs.backgroundColor)}` }); continue; }
        if (H.filled(cs.backgroundColor)) continue;
        for (let n = el.parentElement; n && n !== document.documentElement; n = n.parentElement) {
          const bg = getComputedStyle(n);
          if (bg.backgroundImage !== 'none' && /gradient|url/.test(bg.backgroundImage)) { out.push({ where: H.path(el), value: `sits on ${H.path(n)} with background-image` }); break; }
          if (!H.filled(bg.backgroundColor)) continue;
          if (H.chromatic(bg.backgroundColor)) out.push({ where: H.path(el), value: `sits on ${H.path(n)} with background ${H.norm(bg.backgroundColor)}` });
          break;
        }
      }
      return out;
    },
  },
];
