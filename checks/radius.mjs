// Corner radii on everything that draws a box, in every mode.

export default [
  {
    // Every corner of a visible box (fill, border, shadow or clipped content), and of a drawn
    // ::before or ::after, is one of the kit's radii. Square corners belong only to what draws no
    // shape: lines (one border side and nothing else), masked icons, the timeline rail, the
    // full-width top bar, and boxes that only clip and paint nothing (record 060). Chart internals
    // are the chart library's and are not checked.
    name: 'radius', level: 'fail', source: 'SPEC §1 rule 10; record 060',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const OK = [2, 4, 6, 8, 12, 14, 999];
      const SIDES = ['Top', 'Right', 'Bottom', 'Left'];
      const sides = cs => SIDES.filter(s => H.px(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== 'none').length;
      const fill = cs => H.filled(cs.backgroundColor) || cs.backgroundImage !== 'none' || cs.boxShadow !== 'none';
      const icon = cs => [cs.maskImage, cs.webkitMaskImage].some(v => v && v !== 'none');
      const square = (el, p, cs) => (!fill(cs) && sides(cs) <= 1) || icon(cs) || (!p && el.matches('.cm-topbar'))
        || (p === '::before' && el.matches('.cm-timeline>li'));
      const CORNERS = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius'];
      const visible = (cs, clip) => H.filled(cs.backgroundColor) || cs.backgroundImage !== 'none' || cs.boxShadow !== 'none'
        || SIDES.some(s => H.px(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== 'none' && H.filled(cs[`border${s}Color`]))
        || (clip && cs.overflow !== 'visible');
      const bad = (el, p, cs) => [...new Set(CORNERS.flatMap(c => cs[c].split(' ')))]
        .filter(v => !(v.endsWith('px') && OK.includes(H.px(v))) && !(v === '0px' && square(el, p, cs)));
      for (const el of H.elements()) {
        if (!H.shown(el) || H.exempt(el, check)) continue;
        const cs = getComputedStyle(el);
        const b = bad(el, '', cs);
        if (b.length && visible(cs, true)) out.push({ where: H.path(el), value: `border-radius ${b.join(' ')}` });
        for (const p of ['::before', '::after']) {
          if (!H.pseudoDrawn(el, p)) continue;
          const ps = getComputedStyle(el, p);
          const pb = bad(el, p, ps);
          if (pb.length && ps.display !== 'none' && visible(ps, false)) out.push({ where: H.where(el, p), value: `border-radius ${pb.join(' ')}` });
        }
      }
      return out;
    },
  },
];
