// Corner radii on everything that draws a box, in every mode.

export default [
  {
    // Every corner of a visible box (fill, border, shadow or clipped content), and of a drawn
    // ::before or ::after, is one of the kit's radii. Square corners are allowed. Chart internals
    // are the chart library's and are not checked.
    name: 'radius', level: 'fail', source: 'SPEC §1 rule 10',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const OK = [0, 4, 6, 8, 12, 14, 999];
      const CORNERS = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius'];
      const visible = (cs, clip) => H.filled(cs.backgroundColor) || cs.backgroundImage !== 'none' || cs.boxShadow !== 'none'
        || ['Top', 'Right', 'Bottom', 'Left'].some(s => H.px(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== 'none' && H.filled(cs[`border${s}Color`]))
        || (clip && cs.overflow !== 'visible');
      const bad = cs => [...new Set(CORNERS.flatMap(c => cs[c].split(' ')))]
        .filter(v => !(v.endsWith('px') && OK.includes(H.px(v))) && v !== '0px');
      for (const el of H.elements()) {
        if (!H.shown(el) || H.exempt(el, check)) continue;
        const cs = getComputedStyle(el);
        const b = bad(cs);
        if (b.length && visible(cs, true)) out.push({ where: H.path(el), value: `border-radius ${b.join(' ')}` });
        for (const p of ['::before', '::after']) {
          if (!H.pseudoDrawn(el, p)) continue;
          const ps = getComputedStyle(el, p);
          const pb = bad(ps);
          if (pb.length && ps.display !== 'none' && visible(ps, false)) out.push({ where: H.where(el, p), value: `border-radius ${pb.join(' ')}` });
        }
      }
      return out;
    },
  },
];
