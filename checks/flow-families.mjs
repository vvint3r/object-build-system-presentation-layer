// Flow families (SPEC section 8.20, Journey map and System and data flow): what the journey map and
// the system and data flow add to the flow mode's JSON, and how the kit draws what they add: the
// phase frames, the experience line and its words, and each edge label in line with the start of
// its edge. The flow schema, capacity and the clearance of nodes, edges, lanes and boundaries are
// checked in checks/diagrams.mjs. Each in-page function is self-contained, so small helpers are
// repeated inside it.

export default [
  {
    // A journey map's scale is 3 to 5 words of 12 characters at most, lowest first. With a scale,
    // every node has a level on it and a column of its own; without one, no node has a level.
    // Phases cover every column once.
    name: 'journey-json', level: 'fail', source: 'SPEC §8.20, Journey map', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of H.source().querySelectorAll('.cm-diagram[data-diagram="flow"]')) {
        if (H.exempt(el, check)) continue;
        let d;
        try { d = JSON.parse(el.querySelector('script[type="application/json"]').textContent); } catch (e) { continue; }
        if (!d || typeof d !== 'object') continue;
        const where = H.path(el), bad = v => out.push({ where, value: v });
        const nodes = (Array.isArray(d.nodes) ? d.nodes : []).filter(n => n && typeof n === 'object');
        const phases = (Array.isArray(d.groups) ? d.groups : []).filter(g => g && g.type === 'phase');
        const scale = d.experience;
        if (scale != null) {
          const n = Array.isArray(scale) ? scale.length : 0;
          if (n < 3 || n > 5) bad(`the experience scale has ${n} words (3 to 5, lowest first)`);
          (Array.isArray(scale) ? scale : []).forEach((w, i) => {
            if (typeof w !== 'string' || !w.trim()) bad(`experience word ${i + 1} is not text`);
            else if (w.trim().length > 12) bad(`experience word "${w}" is ${w.trim().length} characters (at most 12)`);
          });
          const cols = new Map();
          nodes.forEach(x => {
            if (!(Number.isInteger(x.level) && x.level >= 1 && x.level <= n)) bad(`node "${x.id}": level ${x.level == null ? 'missing' : x.level} (a whole number from 1 to ${n})`);
            if (cols.has(x.col)) bad(`node "${x.id}" shares column ${x.col} with node "${cols.get(x.col)}" (one step per column)`);
            cols.set(x.col, x.id);
          });
        } else {
          nodes.filter(x => x.level != null).forEach(x => bad(`node "${x.id}" has a level, and the diagram has no experience scale`));
        }
        if (phases.length) {
          const last = Math.max(1, ...nodes.map(x => (Number.isInteger(x.col) ? x.col : 1)));
          const seen = new Map();
          phases.forEach((p, i) => {
            if (!Number.isInteger(p.col)) return;
            for (let c = p.col; c < p.col + (Number.isInteger(p.cols) ? p.cols : 1); c++) {
              if (seen.has(c)) bad(`column ${c} is in phase ${seen.get(c) + 1} and phase ${i + 1}`);
              seen.set(c, i);
            }
          });
          for (let c = 1; c <= last; c++) if (!seen.has(c)) bad(`column ${c} is in no phase`);
          [...seen.keys()].filter(c => c > last).forEach(c => bad(`a phase covers column ${c}, past the last node`));
        }
      }
      return out;
    },
  },

  {
    // A system and data flow keeps the meaning of its shapes: an external entity stands outside
    // every boundary; a data store connects only to steps, by data edges; an edge that crosses a
    // boundary names what crosses it; and boundaries do not overlap.
    name: 'system-flow-json', level: 'fail', source: 'SPEC §8.20, System and data flow', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of H.source().querySelectorAll('.cm-diagram[data-diagram="flow"]')) {
        if (H.exempt(el, check)) continue;
        let d;
        try { d = JSON.parse(el.querySelector('script[type="application/json"]').textContent); } catch (e) { continue; }
        if (!d || typeof d !== 'object') continue;
        const where = H.path(el), bad = v => out.push({ where, value: v });
        const nodes = (Array.isArray(d.nodes) ? d.nodes : []).filter(n => n && typeof n === 'object');
        const edges = (Array.isArray(d.edges) ? d.edges : []).filter(e => e && typeof e === 'object');
        const byId = new Map(nodes.map(n => [n.id, n]));
        const bounds = (Array.isArray(d.groups) ? d.groups : []).filter(g => g && g.type === 'boundary' && Number.isInteger(g.col) && Number.isInteger(g.row))
          .map(g => ({ label: g.label, c0: g.col, c1: g.col + (g.cols || 1) - 1, r0: g.row, r1: g.row + (g.rows || 1) - 1 }));
        const inside = (n, b) => n.col >= b.c0 && n.col <= b.c1 && n.row >= b.r0 && n.row <= b.r1;
        nodes.filter(n => n.type === 'external').forEach(n => bounds.filter(b => inside(n, b)).forEach(b => bad(`external "${n.id}" stands inside boundary "${b.label}"`)));
        edges.forEach((e, i) => {
          const a = byId.get(e.from), b = byId.get(e.to);
          if (!a || !b) return;
          const named = typeof e.label === 'string' && e.label.trim();
          if (a.type === 'store' || b.type === 'store') {
            const other = a.type === 'store' ? b : a;
            if ((other.type || 'step') !== 'step') bad(`edge ${i + 1} joins data store "${a.type === 'store' ? a.id : b.id}" to ${other.type === 'external' ? 'an external entity' : `a ${other.type}`} (a store connects only to steps)`);
            if (e.kind !== 'data') bad(`edge ${i + 1} to or from a data store is ${e.kind ? `a ${e.kind}` : 'a flow'} edge (a data edge)`);
          }
          bounds.forEach(x => { if (inside(a, x) !== inside(b, x) && !named) bad(`edge ${i + 1} crosses boundary "${x.label}" with no label`); });
        });
        for (let i = 0; i < bounds.length; i++) for (let j = i + 1; j < bounds.length; j++) {
          const p = bounds[i], q = bounds[j];
          if (p.c0 <= q.c1 && q.c0 <= p.c1 && p.r0 <= q.r1 && q.r0 <= p.r1) bad(`boundaries "${p.label}" and "${q.label}" share a cell`);
        }
      }
      return out;
    },
  },

  {
    // Every edge label stands on the line of its edge's first run, centred on it, and the line
    // starts 8px past the label: one placement for a line that leaves sideways and one that leaves
    // up or down.
    name: 'diagram-label-inline', level: 'fail', source: 'SPEC §8.20',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of document.querySelectorAll('.cm-diagram[data-diagram="flow"]')) {
        if (!H.shown(el) || H.exempt(el, check)) continue;
        const g = el._cmDiagram, cv = el.querySelector('.cm-diagram__canvas');
        if (!g || !cv) continue;
        const where = H.path(el), c = cv.getBoundingClientRect(), k = g.scale || 1;
        const box = e => { const r = e.getBoundingClientRect(); return { l: (r.left - c.left) / k, t: (r.top - c.top) / k, r: (r.right - c.left) / k, b: (r.bottom - c.top) / k }; };
        g.edges.filter(e => e.labelEl).forEach(e => {
          const [a, b] = e.points, L = box(e.labelEl), hz = a[1] === b[1];
          const off = Math.abs((hz ? (L.t + L.b) / 2 : (L.l + L.r) / 2) - (hz ? a[1] : a[0]));
          if (off > 1.5) out.push({ where, value: `edge label "${e.label}" stands ${Math.round(off)}px off the line it names` });
          const u = hz ? Math.sign(b[0] - a[0]) : Math.sign(b[1] - a[1]);
          const far = hz ? (u > 0 ? L.r : L.l) : (u > 0 ? L.b : L.t);
          const gap = ((hz ? a[0] : a[1]) - far) * u;
          if (gap < 6.5 || gap > 9.5) out.push({ where, value: `the edge ${e.from} to ${e.to} starts ${Math.round(gap)}px past its label "${e.label}" (8px)` });
        });
      }
      return out;
    },
  },

  {
    // A journey map as drawn: each phase frame clear of the steps and of the other frames; the
    // experience line under the steps; and each word under it, and the low point label, 8px clear
    // of every node, edge, run of the line and other label, inside the diagram.
    name: 'journey-layout', level: 'fail', source: 'SPEC §8.20, Journey map',
    inPage: ({ check }) => {
      const H = window.__cm, out = [], CLEAR = 7.5;
      for (const el of document.querySelectorAll('.cm-diagram[data-diagram="flow"]')) {
        if (!H.shown(el) || H.exempt(el, check)) continue;
        const g = el._cmDiagram, cv = el.querySelector('.cm-diagram__canvas');
        if (!g || !cv || (!g.phases && !g.experience)) continue;
        const where = H.path(el), bad = v => out.push({ where, value: v });
        const c = cv.getBoundingClientRect(), k = g.scale || 1;
        const box = e => { const r = e.getBoundingClientRect(); return { l: (r.left - c.left) / k, t: (r.top - c.top) / k, r: (r.right - c.left) / k, b: (r.bottom - c.top) / k }; };
        const grow = (r, d) => ({ l: r.l - d, t: r.t - d, r: r.r + d, b: r.b + d });
        const meet = (a, b) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;
        const hits = (s, r) => Math.min(s[0][0], s[1][0]) < r.r && Math.max(s[0][0], s[1][0]) > r.l && Math.min(s[0][1], s[1][1]) < r.b && Math.max(s[0][1], s[1][1]) > r.t;
        const inside = r => r.l >= -0.5 && r.t >= -0.5 && r.r <= g.W + 0.5 && r.b <= g.H + 0.5;
        const nodes = g.nodes.map(n => ({ id: n.id, b: box(n.el) }));
        const phases = (g.phases || []).map(p => ({ name: `phase "${p.label}"`, b: box(p.el) }));
        phases.forEach((P, i) => {
          nodes.forEach(n => { if (meet(grow(P.b, CLEAR), n.b)) bad(`${P.name} is within 8px of node "${n.id}"`); });
          phases.slice(i + 1).forEach(Q => { if (meet(P.b, Q.b)) bad(`${P.name} overlaps ${Q.name}`); });
          if (!inside(P.b)) bad(`${P.name} lies outside the diagram`);
        });
        if (!g.experience) continue;
        const pts = g.experience.points, runs = pts.slice(1).map((p, i) => [pts[i], p]);
        const lowest = Math.max(...nodes.map(n => n.b.b));
        if (Math.min(...pts.map(p => p[1])) < lowest + CLEAR) bad('the experience line runs within 8px of a step, or above one');
        const edges = [];
        g.edges.forEach(e => e.points.slice(1).forEach((p, i) => edges.push([e.points[i], p])));
        const words = g.experience.labels.map(L => ({ name: L.label === 'Low point' ? 'the low point label' : `the level word "${L.label}"`, b: box(L.el) }));
        words.forEach((W, i) => {
          const air = grow(W.b, CLEAR);
          nodes.forEach(n => { if (meet(air, n.b)) bad(`${W.name} is within 8px of node "${n.id}"`); });
          if (edges.some(s => hits(s, air))) bad(`${W.name} is within 8px of an edge`);
          if (runs.some(s => hits(s, air))) bad(`${W.name} is within 8px of the experience line`);
          phases.forEach(P => { if (meet(air, P.b)) bad(`${W.name} is within 8px of ${P.name}`); });
          words.slice(i + 1).forEach(V => { if (meet(air, V.b)) bad(`${W.name} is within 8px of ${V.name}`); });
          if (!inside(W.b)) bad(`${W.name} lies outside the diagram`);
        });
      }
      return out;
    },
  },
];
