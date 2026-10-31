// State diagrams (SPEC section 8.20, State): the JSON as written against the state mode's schema,
// its transitions, capacity and label lengths, and the text version the kit wrote. What the kit drew
// (every edge drawn, overlap, clearance, clipping, print fit) is checked for every mode in
// checks/diagrams.mjs. Each in-page function is self-contained, so small helpers are repeated.

export default [
  {
    // The JSON parses and holds only the state mode's fields, with the values each field allows:
    // a start and an end carry no label, and every node has a cell of its own.
    name: 'state-json', level: 'fail', source: 'SPEC §8.20, State', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const TOP = ['nodes', 'edges', 'direction'];
      const NODE = ['id', 'type', 'label', 'detail', 'col', 'row', 'emphasis'];
      const MARK = ['id', 'type', 'col', 'row'];
      const EDGE = ['from', 'to', 'label'];
      const TYPES = ['initial', 'state', 'final'];
      const pos = v => Number.isInteger(v) && v >= 1;
      const str = v => typeof v === 'string' && v.trim() !== '';
      for (const el of H.source().querySelectorAll('.cm-diagram[data-diagram="state"]')) {
        if (H.exempt(el, check)) continue;
        const where = H.path(el), bad = v => out.push({ where, value: v });
        const s = el.querySelector('script[type="application/json"]');
        if (!s) { bad('no diagram JSON'); continue; }
        let d;
        try { d = JSON.parse(s.textContent); } catch (e) { bad(e.message); continue; }
        if (!d || typeof d !== 'object' || Array.isArray(d)) { bad('the JSON is not an object'); continue; }
        const extra = (o, keys, what) => Object.keys(o).filter(k => !keys.includes(k)).forEach(k => bad(`${what} has "${k}" (allowed: ${keys.join(', ')})`));
        extra(d, TOP, 'the diagram');
        if (d.direction != null && !['right', 'down'].includes(d.direction)) bad(`direction "${d.direction}" (right or down)`);
        if (!Array.isArray(d.nodes) || !d.nodes.length) { bad('no nodes'); continue; }
        const ids = new Set(), cells = new Map();
        d.nodes.forEach((n, i) => {
          const w = `node ${n && n.id != null ? `"${n.id}"` : i + 1}`;
          if (!n || typeof n !== 'object') { bad(`${w} is not an object`); return; }
          if (!TYPES.includes(n.type)) bad(`${w}: type "${n.type}" (${TYPES.join(', ')})`);
          extra(n, n.type === 'state' ? NODE : MARK, w);
          if (!str(n.id)) bad(`${w}: id is not a non-empty string`);
          else if (ids.has(n.id)) bad(`${w}: id used twice`);
          else ids.add(n.id);
          if (n.type === 'state' && !str(n.label)) bad(`${w}: no label`);
          if (n.detail != null && !str(n.detail)) bad(`${w}: detail is not text`);
          if (n.emphasis != null && !str(n.emphasis)) bad(`${w}: emphasis is not text`);
          if (!pos(n.col) || !pos(n.row)) bad(`${w}: col and row are whole numbers from 1`);
          else {
            const c = `${n.col},${n.row}`;
            if (cells.has(c)) bad(`${w}: shares column ${n.col}, row ${n.row} with node "${cells.get(c)}"`);
            cells.set(c, n.id);
          }
        });
        const starts = d.nodes.filter(n => n && n.type === 'initial').length;
        if (starts !== 1) bad(`${starts} starts (exactly 1 node of type "initial")`);
        if (d.edges != null && !Array.isArray(d.edges)) bad('edges is not a list');
        (Array.isArray(d.edges) ? d.edges : []).forEach((e, i) => {
          const w = `edge ${i + 1}`;
          if (!e || typeof e !== 'object') { bad(`${w} is not an object`); return; }
          extra(e, EDGE, w);
          if (e.label != null && !str(e.label)) bad(`${w}: label is not text`);
        });
      }
      return out;
    },
  },

  {
    // Transitions join nodes that exist. The start has one transition out, unnamed, and none in; an
    // end has none out. Every other transition is named by its event, and no two transitions out of
    // one state share an event.
    name: 'state-edges', level: 'fail', source: 'SPEC §8.20, State', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of H.source().querySelectorAll('.cm-diagram[data-diagram="state"]')) {
        if (H.exempt(el, check)) continue;
        let d;
        try { d = JSON.parse(el.querySelector('script[type="application/json"]').textContent); } catch (e) { continue; }
        const where = H.path(el), bad = v => out.push({ where, value: v });
        const nodes = (Array.isArray(d.nodes) ? d.nodes : []).filter(Boolean), edges = (Array.isArray(d.edges) ? d.edges : []).filter(Boolean);
        const byId = new Map(nodes.filter(n => n.id != null).map(n => [n.id, n]));
        const label = e => (typeof e.label === 'string' ? e.label.trim().toLowerCase() : '');
        edges.forEach((e, i) => {
          if (!byId.has(e.from)) bad(`edge ${i + 1}: from "${e.from}" is no node`);
          if (!byId.has(e.to)) bad(`edge ${i + 1}: to "${e.to}" is no node`);
          const f = byId.get(e.from);
          if (f && f.type !== 'initial' && !label(e)) bad(`edge ${i + 1}: the transition from "${e.from}" names no event`);
        });
        for (const n of nodes) {
          const outs = edges.filter(e => e.from === n.id), ins = edges.filter(e => e.to === n.id);
          if (n.type === 'initial') {
            if (outs.length !== 1) bad(`start "${n.id}" has ${outs.length} transitions out (exactly 1)`);
            if (ins.length) bad(`start "${n.id}" has ${ins.length} transition${ins.length === 1 ? '' : 's'} in (none)`);
            if (outs.some(label)) bad(`start "${n.id}": its transition carries no event`);
            if (outs.some(e => byId.has(e.to) && byId.get(e.to).type !== 'state')) bad(`start "${n.id}" leads to no state`);
          }
          if (n.type === 'final' && outs.length) bad(`end "${n.id}" has ${outs.length} transition${outs.length === 1 ? '' : 's'} out (none)`);
          if (n.type === 'state') {
            const names = outs.map(label).filter(Boolean);
            if (new Set(names).size < names.length) bad(`state "${n.id}" has two transitions out with one event`);
          }
        }
      }
      return out;
    },
  },

  {
    // The state mode's capacity: 24 nodes, 4 columns, 5 rows, 12 transitions and one emphasised
    // state. A larger diagram splits into an overview and details.
    name: 'state-capacity', level: 'fail', source: 'SPEC §8.20, State', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of H.source().querySelectorAll('.cm-diagram[data-diagram="state"]')) {
        if (H.exempt(el, check)) continue;
        let d;
        try { d = JSON.parse(el.querySelector('script[type="application/json"]').textContent); } catch (e) { continue; }
        const where = H.path(el), nodes = (Array.isArray(d.nodes) ? d.nodes : []).filter(Boolean);
        const edges = (Array.isArray(d.edges) ? d.edges : []).filter(Boolean);
        const counts = [
          ['nodes', nodes.length, 24], ['columns', Math.max(0, ...nodes.map(n => n.col || 0)), 4],
          ['rows', Math.max(0, ...nodes.map(n => n.row || 0)), 5], ['transitions', edges.length, 12],
          ['emphasised states', nodes.filter(n => n.emphasis).length, 1],
        ];
        for (const [what, n, max] of counts) if (n > max) out.push({ where, value: `${n} ${what} (at most ${max})` });
      }
      return out;
    },
  },

  {
    // State text keeps the flow diagram's limits: a label of 24 characters, a detail of 40, an event
    // of 1 to 3 words and an emphasis chip of 1 or 2 words.
    name: 'state-labels', level: 'fail', source: 'SPEC §8.20, State', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const words = s => s.trim().split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
      for (const el of H.source().querySelectorAll('.cm-diagram[data-diagram="state"]')) {
        if (H.exempt(el, check)) continue;
        let d;
        try { d = JSON.parse(el.querySelector('script[type="application/json"]').textContent); } catch (e) { continue; }
        const where = H.path(el), bad = v => out.push({ where, value: v });
        for (const n of (Array.isArray(d.nodes) ? d.nodes : []).filter(Boolean)) {
          if (typeof n.label === 'string' && n.label.trim().length > 24) bad(`state "${n.id}" label "${n.label}" is ${n.label.trim().length} characters (at most 24)`);
          if (typeof n.detail === 'string' && n.detail.trim().length > 40) bad(`state "${n.id}" detail is ${n.detail.trim().length} characters (at most 40)`);
          if (typeof n.emphasis === 'string' && words(n.emphasis) > 2) bad(`state "${n.id}" emphasis "${n.emphasis}" is ${words(n.emphasis)} words (1 or 2)`);
        }
        (Array.isArray(d.edges) ? d.edges : []).filter(Boolean).forEach((e, i) => {
          if (typeof e.label === 'string' && words(e.label) > 3) bad(`edge ${i + 1} event "${e.label}" is ${words(e.label)} words (at most 3)`);
        });
      }
      return out;
    },
  },

  {
    // The text version the kit wrote has one item for every state; the start and the ends are named
    // on the states they join.
    name: 'state-text', level: 'fail', source: 'SPEC §8.20, State',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of document.querySelectorAll('.cm-diagram[data-diagram="state"]')) {
        if (H.exempt(el, check)) continue;
        const g = el._cmDiagram, fig = el.closest('figure') || el.parentElement;
        const text = fig && fig.querySelector('details[data-cm-diagram-text]');
        if (!g || !text) continue;
        const states = g.nodes.filter(n => n.type === 'state').length, items = text.querySelectorAll('li').length;
        if (items !== states) out.push({ where: H.path(el), value: `text version lists ${items} of ${states} states` });
      }
      return out;
    },
  },
];
