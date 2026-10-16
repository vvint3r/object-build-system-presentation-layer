// Decoration the kit rules out: emoji, gradients, coloured left borders on cards and callouts, and
// drop caps.

export default [
  {
    // Emoji in the text as written. Plain symbols the kit uses (★, ↩, →, ▲) are not emoji.
    name: 'emoji', level: 'fail', source: 'SPEC §1 rule 11', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const EMOJI = /\p{Emoji_Presentation}|\p{Extended_Pictographic}️/u;
      const d = H.source();
      const walk = d.createTreeWalker(d.body, NodeFilter.SHOW_TEXT);
      for (let n = walk.nextNode(); n; n = walk.nextNode()) {
        const el = n.parentElement;
        if (el.closest('script, style') || H.exempt(el, check)) continue;
        const m = n.nodeValue.match(EMOJI);
        if (m) out.push({ where: H.path(el), value: `emoji ${m[0]}` });
      }
      return out;
    },
  },

  {
    name: 'gradients', level: 'fail', source: 'SPEC §1 rule 11',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const grad = cs => [cs.backgroundImage, cs.borderImageSource].find(v => v && /gradient\(/.test(v));
      for (const el of H.elements()) {
        if (!H.shown(el) || H.exempt(el, check)) continue;
        const g = grad(getComputedStyle(el));
        if (g) out.push({ where: H.path(el), value: g.slice(0, 70) });
        for (const p of ['::before', '::after']) {
          if (!H.pseudoDrawn(el, p)) continue;
          const pg = grad(getComputedStyle(el, p));
          if (pg) out.push({ where: H.where(el, p), value: pg.slice(0, 70) });
        }
      }
      return out;
    },
  },

  {
    // A left border that differs from the right one in width or colour, on a card, tile or callout.
    name: 'left-borders', level: 'fail', source: 'SPEC §1 rule 11',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const BOXES = '.cm-card, .cm-tile, .cm-sub, .cm-float, .cm-summary, .cm-featured, .cm-emph, .cm-callout, .cm-kpi, .cm-def, .cm-qa';
      for (const el of document.querySelectorAll(BOXES)) {
        if (H.ignored(el) || !H.shown(el) || H.exempt(el, check)) continue;
        const cs = getComputedStyle(el);
        const w = H.px(cs.borderLeftWidth);
        if (!w || cs.borderLeftStyle === 'none' || !H.filled(cs.borderLeftColor)) continue;
        const rw = cs.borderRightStyle === 'none' ? 0 : H.px(cs.borderRightWidth);
        if (w !== rw || H.norm(cs.borderLeftColor) !== H.norm(cs.borderRightColor)) {
          out.push({ where: H.path(el), value: `border-left ${w}px ${H.norm(cs.borderLeftColor)}, border-right ${rw}px ${H.norm(cs.borderRightColor)}` });
        }
      }
      return out;
    },
  },

  {
    // A first letter set larger than its paragraph, or floated.
    name: 'drop-caps', level: 'fail', source: 'SPEC §1 rule 11', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of document.querySelectorAll('p, li, dd, blockquote')) {
        if (H.ignored(el) || !H.shown(el) || H.exempt(el, check)) continue;
        const fl = getComputedStyle(el, '::first-letter'), cs = getComputedStyle(el);
        if (fl.float !== 'none' || H.px(fl.fontSize) > 1.2 * H.px(cs.fontSize)) {
          out.push({ where: H.where(el, '::first-letter'), value: `font-size ${fl.fontSize}, float ${fl.float}` });
        }
      }
      return out;
    },
  },
];
