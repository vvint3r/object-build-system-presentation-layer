// Entity relationship diagrams (SPEC section 8.20, Entity relationship): the JSON as written against
// the mode's schema, its relationships, capacity and label lengths, and the text version the kit
// wrote. What the kit drew (every relationship drawn, counts and names clear of lines, nodes and one
// another, clipping, print fit) is checked for every mode in checks/diagrams.mjs. Each in-page
// function is self-contained, so small helpers are repeated.

export default [
  {
    // The JSON parses and holds only the mode's fields, with the values each field allows: every
    // entity has a cell of its own and names its primary key, and every relationship states the
    // count at both ends in words.
    name: 'er-json', level: 'fail', source: 'SPEC §8.20, Entity relationship', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const TOP = ['nodes', 'edges'];
      const NODE = ['id', 'label', 'col', 'row', 'attributes'];
      const ATTR = ['name', 'key'];
      const KEYS = ['primary', 'foreign'];
      const EDGE = ['from', 'to', 'fromEnd', 'toEnd', 'label'];
      const ENDS = ['1', '0 or 1', '1 or more', '0 or more'];
      const pos = v => Number.isInteger(v) && v >= 1;
      const str = v => typeof v === 'string' && v.trim() !== '';
      for (const el of H.source().querySelectorAll('.cm-diagram[data-diagram="entity-relationship"]')) {
        if (H.exempt(el, check)) continue;
        const where = H.path(el), bad = v => out.push({ where, value: v });
        const s = el.querySelector('script[type="application/json"]');
        if (!s) { bad('no diagram JSON'); continue; }
        let d;
        try { d = JSON.parse(s.textContent); } catch (e) { bad(e.message); continue; }
        if (!d || typeof d !== 'object' || Array.isArray(d)) { bad('the JSON is not an object'); continue; }
        const extra = (o, keys, what) => Object.keys(o).filter(k => !keys.includes(k)).forEach(k => bad(`${what} has "${k}" (allowed: ${keys.join(', ')})`));
        extra(d, TOP, 'the diagram');
        if (!Array.isArray(d.nodes) || d.nodes.length < 2) { bad('fewer than 2 entities'); continue; }
        const ids = new Set(), cells = new Map();
        d.nodes.forEach((n, i) => {
          const w = `entity ${n && n.id != null ? `"${n.id}"` : i + 1}`;
          if (!n || typeof n !== 'object') { bad(`${w} is not an object`); return; }
          extra(n, NODE, w);
          if (!str(n.id)) bad(`${w}: id is not a non-empty string`);
          else if (ids.has(n.id)) bad(`${w}: id used twice`);
          else ids.add(n.id);
          if (!str(n.label)) bad(`${w}: no label`);
          if (!pos(n.col) || !pos(n.row)) bad(`${w}: col and row are whole numbers from 1`);
          else {
            const c = `${n.col},${n.row}`;
            if (cells.has(c)) bad(`${w}: shares column ${n.col}, row ${n.row} with entity "${cells.get(c)}"`);
            cells.set(c, n.id);
          }
          if (!Array.isArray(n.attributes) || !n.attributes.length) { bad(`${w}: no attributes`); return; }
          n.attributes.forEach((a, k) => {
            const aw = `${w} attribute ${k + 1}`;
            if (!a || typeof a !== 'object') { bad(`${aw} is not an object`); return; }
            extra(a, ATTR, aw);
            if (!str(a.name)) bad(`${aw}: no name`);
            if (a.key != null && !KEYS.includes(a.key)) bad(`${aw}: key "${a.key}" (${KEYS.join(', ')})`);
          });
          if (!n.attributes.some(a => a && a.key === 'primary')) bad(`${w}: names no primary key`);
        });
        if (!Array.isArray(d.edges) || !d.edges.length) { bad('no relationships'); continue; }
        d.edges.forEach((e, i) => {
          const w = `relationship ${i + 1}`;
          if (!e || typeof e !== 'object') { bad(`${w} is not an object`); return; }
          extra(e, EDGE, w);
          for (const end of ['fromEnd', 'toEnd']) if (!ENDS.includes(e[end])) bad(`${w}: ${end} "${e[end] == null ? '' : e[end]}" (${ENDS.join(', ')})`);
          if (e.label != null && !str(e.label)) bad(`${w}: label is not text`);
        });
      }
      return out;
    },
  },

  {
    // Every relationship joins two entities that exist and are not the same entity. A line leaves
    // each side of an entity at most once, so an entity takes part in 4 relationships at most.
    name: 'er-edges', level: 'fail', source: 'SPEC §8.20, Entity relationship', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of H.source().querySelectorAll('.cm-diagram[data-diagram="entity-relationship"]')) {
        if (H.exempt(el, check)) continue;
        let d;
        try { d = JSON.parse(el.querySelector('script[type="application/json"]').textContent); } catch (e) { continue; }
        const where = H.path(el), bad = v => out.push({ where, value: v });
        const nodes = (Array.isArray(d.nodes) ? d.nodes : []).filter(Boolean), edges = (Array.isArray(d.edges) ? d.edges : []).filter(Boolean);
        const ids = new Set(nodes.map(n => n.id));
        edges.forEach((e, i) => {
          if (!ids.has(e.from)) bad(`relationship ${i + 1}: from "${e.from}" is no entity`);
          if (!ids.has(e.to)) bad(`relationship ${i + 1}: to "${e.to}" is no entity`);
          if (e.from === e.to) bad(`relationship ${i + 1}: joins "${e.from}" to itself`);
        });
        for (const n of nodes) {
          const k = edges.filter(e => e.from === n.id || e.to === n.id).length;
          if (k > 4) bad(`entity "${n.id}" takes part in ${k} relationships (at most 4, one to a side)`);
        }
      }
      return out;
    },
  },

  {
    // The mode's capacity: 6 entities in 2 columns and 3 rows, 7 relationships, and 6 attributes to
    // an entity. A larger model splits into an overview and details.
    name: 'er-capacity', level: 'fail', source: 'SPEC §8.20, Entity relationship', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of H.source().querySelectorAll('.cm-diagram[data-diagram="entity-relationship"]')) {
        if (H.exempt(el, check)) continue;
        let d;
        try { d = JSON.parse(el.querySelector('script[type="application/json"]').textContent); } catch (e) { continue; }
        const where = H.path(el), nodes = (Array.isArray(d.nodes) ? d.nodes : []).filter(Boolean);
        const counts = [
          ['entities', nodes.length, 6], ['columns', Math.max(0, ...nodes.map(n => n.col || 0)), 2],
          ['rows', Math.max(0, ...nodes.map(n => n.row || 0)), 3],
          ['relationships', (Array.isArray(d.edges) ? d.edges : []).filter(Boolean).length, 7],
        ];
        for (const [what, n, max] of counts) if (n > max) out.push({ where, value: `${n} ${what} (at most ${max})` });
        for (const n of nodes) {
          const k = Array.isArray(n.attributes) ? n.attributes.length : 0;
          if (k > 6) out.push({ where, value: `entity "${n.id}" lists ${k} attributes (at most 6)` });
        }
      }
      return out;
    },
  },

  {
    // Entity relationship text keeps the flow diagram's limits: an entity name of 24 characters, an
    // attribute name of 24, and a relationship name of 1 to 3 words.
    name: 'er-labels', level: 'fail', source: 'SPEC §8.20, Entity relationship', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const words = s => s.trim().split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
      for (const el of H.source().querySelectorAll('.cm-diagram[data-diagram="entity-relationship"]')) {
        if (H.exempt(el, check)) continue;
        let d;
        try { d = JSON.parse(el.querySelector('script[type="application/json"]').textContent); } catch (e) { continue; }
        const where = H.path(el), bad = v => out.push({ where, value: v });
        for (const n of (Array.isArray(d.nodes) ? d.nodes : []).filter(Boolean)) {
          if (typeof n.label === 'string' && n.label.trim().length > 24) bad(`entity "${n.id}" label "${n.label}" is ${n.label.trim().length} characters (at most 24)`);
          for (const a of (Array.isArray(n.attributes) ? n.attributes : []).filter(Boolean)) {
            if (typeof a.name === 'string' && a.name.trim().length > 24) bad(`entity "${n.id}" attribute "${a.name}" is ${a.name.trim().length} characters (at most 24)`);
          }
        }
        (Array.isArray(d.edges) ? d.edges : []).filter(Boolean).forEach((e, i) => {
          if (typeof e.label === 'string' && words(e.label) > 3) bad(`relationship ${i + 1} label "${e.label}" is ${words(e.label)} words (at most 3)`);
        });
      }
      return out;
    },
  },

  {
    // The text version the kit wrote has one item for every entity and one for every relationship.
    name: 'er-text', level: 'fail', source: 'SPEC §8.20, Entity relationship',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of document.querySelectorAll('.cm-diagram[data-diagram="entity-relationship"]')) {
        if (H.exempt(el, check)) continue;
        const g = el._cmDiagram, fig = el.closest('figure') || el.parentElement;
        const text = fig && fig.querySelector('details[data-cm-diagram-text]');
        if (!g || !text) continue;
        const items = text.querySelectorAll('li').length, want = g.nodes.length + g.edges.length;
        if (items !== want) out.push({ where: H.path(el), value: `text version lists ${items} items (${g.nodes.length} entities and ${g.edges.length} relationships make ${want})` });
      }
      return out;
    },
  },
];
