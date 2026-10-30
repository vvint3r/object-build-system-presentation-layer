// How many of each emphasised component a report or a section may hold, counted on the page as
// written. Each in-page function is self-contained, so helpers are repeated inside it.

export default [
  {
    // Exactly one featured card, or none when the Recommendations section is left out with its
    // omission comment in <main> (SPEC §7).
    name: 'featured', level: 'fail', source: 'SPEC §1 rule 7; §6; §7', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, d = H.source();
      const n = [...d.querySelectorAll('.cm-featured')].filter(el => !H.exempt(el, check));
      if (n.length === 1 || (n.length === 0 && H.omitted(d.querySelector('main') || d.body, 'recommendations'))) return [];
      return [{ where: 'body', value: `${n.length} .cm-featured (exactly 1, or none with cm-omit recommendations)` }];
    },
  },
  {
    name: 'summary', level: 'fail', source: 'SPEC §1 rule 7; §6', once: true,
    inPage: ({ check }) => {
      const H = window.__cm;
      const n = [...H.source().querySelectorAll('.cm-summary')].filter(el => !H.exempt(el, check));
      return n.length === 1 ? [] : [{ where: 'body', value: `${n.length} .cm-summary (exactly 1)` }];
    },
  },
  {
    name: 'verdict', level: 'fail', source: 'SPEC §1 rule 7', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const groups = new Map();
      for (const el of H.source().querySelectorAll('.cm-chip--verdict')) {
        if (H.exempt(el, check)) continue;
        const g = el.closest('table, figure');
        if (g) groups.set(g, (groups.get(g) || 0) + 1);
      }
      for (const [g, n] of groups) if (n > 1) out.push({ where: H.path(g), value: `${n} verdict chips (at most 1 per table or figure)` });
      return out;
    },
  },
  {
    name: 'emph', level: 'fail', source: 'SPEC §6', once: true,
    inPage: ({ check }) => {
      const H = window.__cm;
      const els = [...H.source().querySelectorAll('.cm-emph')].filter(el => !H.exempt(el, check));
      const section = el => el.closest('section') || el.ownerDocument.body;
      const groups = new Map();
      for (const el of els) groups.set(section(el), (groups.get(section(el)) || 0) + 1);
      return [...groups].filter(([, n]) => n > 1).map(([g, n]) => ({ where: H.path(g), value: `${n} .cm-emph (at most 1 per section)` }));
    },
  },
  {
    // Callout and pull-quote limits per section (SPEC §8.4, §8.9).
    name: 'section-limits', level: 'fail', source: 'SPEC §8.4; §8.9', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const section = el => el.closest('section') || el.ownerDocument.body;
      for (const [sel, what] of [['.cm-callout--important', '.cm-callout--important'], ['.cm-quote', 'pull quotes']]) {
        const groups = new Map();
        for (const el of H.source().querySelectorAll(sel)) {
          if (H.exempt(el, check)) continue;
          groups.set(section(el), (groups.get(section(el)) || 0) + 1);
        }
        for (const [g, n] of groups) if (n > 1) out.push({ where: H.path(g), value: `${n} ${what} (at most 1 per section)` });
      }
      return out;
    },
  },
  {
    name: 'card-nesting', level: 'fail', source: 'SPEC §6', once: true,
    inPage: ({ check }) => {
      const H = window.__cm;
      return [...H.source().querySelectorAll('.cm-card .cm-card')].filter(el => !H.exempt(el, check))
        .map(el => ({ where: H.path(el), value: 'a .cm-card inside a .cm-card' }));
    },
  },
];
