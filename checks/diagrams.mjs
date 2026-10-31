// Diagrams (SPEC section 8.20): the JSON as written against the flow mode's schema, its capacity
// and label lengths, and what the kit drew from it in each mode, for every drawing mode: every node
// and edge drawn, nothing overlapping or crossing more than the budget, labels clear of lines and
// nodes, nothing clipped, and the text version in place. The other modes check their own JSON in
// their own modules. Each in-page function is self-contained, so small helpers are
// repeated inside it.
//
// Rendered geometry comes from the page: nodes and labels are measured as drawn, and edge lines are
// the points cm-report.js drew them from (element._cmDiagram), in the canvas's own pixels. Print
// scales the canvas, so measured boxes are turned back into canvas pixels before comparing.

export default [
  {
    // The drawing mode is one the kit has. A flow diagram's JSON parses and holds only the flow
    // mode's fields, with the values each field allows. An author writes no coordinates, classes or
    // styles: any other field fails.
    name: 'diagram-json', level: 'fail', source: 'SPEC §8.20', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const TOP = ['nodes', 'edges', 'groups', 'direction'];
      const NODE = ['id', 'type', 'label', 'detail', 'col', 'row', 'emphasis'];
      const EDGE = ['from', 'to', 'kind', 'label'];
      const LANE = ['type', 'label', 'row', 'rows'];
      const BOUND = ['type', 'label', 'col', 'row', 'cols', 'rows'];
      const TYPES = ['terminal', 'step', 'decision', 'store', 'external'];
      const KINDS = ['flow', 'data', 'optional'];
      const MODES = ['flow', 'sequence', 'state', 'entity-relationship'];
      const pos = v => Number.isInteger(v) && v >= 1;
      const str = v => typeof v === 'string' && v.trim() !== '';
      for (const el of H.source().querySelectorAll('.cm-diagram')) {
        if (H.exempt(el, check)) continue;
        const where = H.path(el), bad = v => out.push({ where, value: v }), mode = el.getAttribute('data-diagram');
        if (!MODES.includes(mode)) { bad(`data-diagram="${mode || ''}" (${MODES.join(', ')})`); continue; }
        if (mode !== 'flow') continue;
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
          extra(n, NODE, w);
          if (!str(n.id)) bad(`${w}: id is not a non-empty string`);
          else if (ids.has(n.id)) bad(`${w}: id used twice`);
          else ids.add(n.id);
          if (!TYPES.includes(n.type)) bad(`${w}: type "${n.type}" (${TYPES.join(', ')})`);
          if (!str(n.label)) bad(`${w}: no label`);
          if (n.detail != null && !str(n.detail)) bad(`${w}: detail is not text`);
          if (n.detail != null && n.type === 'decision') bad(`${w}: a decision carries its question only, no detail`);
          if (n.emphasis != null && (!str(n.emphasis) || n.type !== 'step')) bad(`${w}: emphasis is a short reason on a step`);
          if (!pos(n.col) || !pos(n.row)) bad(`${w}: col and row are whole numbers from 1`);
          else {
            const c = `${n.col},${n.row}`;
            if (cells.has(c)) bad(`${w}: shares column ${n.col}, row ${n.row} with node "${cells.get(c)}"`);
            cells.set(c, n.id);
          }
        });
        if (d.edges != null && !Array.isArray(d.edges)) bad('edges is not a list');
        (Array.isArray(d.edges) ? d.edges : []).forEach((e, i) => {
          const w = `edge ${i + 1}`;
          if (!e || typeof e !== 'object') { bad(`${w} is not an object`); return; }
          extra(e, EDGE, w);
          if (e.kind != null && !KINDS.includes(e.kind)) bad(`${w}: kind "${e.kind}" (${KINDS.join(', ')})`);
          if (e.label != null && !str(e.label)) bad(`${w}: label is not text`);
        });
        if (d.groups != null && !Array.isArray(d.groups)) bad('groups is not a list');
        (Array.isArray(d.groups) ? d.groups : []).forEach((g, i) => {
          const w = `group ${i + 1}`;
          if (!g || typeof g !== 'object') { bad(`${w} is not an object`); return; }
          if (g.type === 'lane') { extra(g, LANE, `${w} (lane)`); if (!pos(g.row)) bad(`${w}: row is a whole number from 1`); }
          else if (g.type === 'boundary') { extra(g, BOUND, `${w} (boundary)`); if (!pos(g.col) || !pos(g.row)) bad(`${w}: col and row are whole numbers from 1`); }
          else { bad(`${w}: type "${g.type}" (lane or boundary)`); return; }
          if (!str(g.label)) bad(`${w}: no label`);
          ['rows', 'cols'].forEach(k => { if (g[k] != null && !pos(g[k])) bad(`${w}: ${k} is a whole number from 1`); });
        });
      }
      return out;
    },
  },

  {
    // Edges join two different nodes that exist. A decision has two or more branches, each with a
    // label, and no two alike. Lanes cover every row once, one band each, in a left-to-right flow.
    name: 'diagram-edges', level: 'fail', source: 'SPEC §8.20', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of H.source().querySelectorAll('.cm-diagram[data-diagram="flow"]')) {
        if (H.exempt(el, check)) continue;
        let d;
        try { d = JSON.parse(el.querySelector('script[type="application/json"]').textContent); } catch (e) { continue; }
        const where = H.path(el), nodes = Array.isArray(d.nodes) ? d.nodes : [], edges = Array.isArray(d.edges) ? d.edges : [];
        const byId = new Map(nodes.filter(n => n && n.id != null).map(n => [n.id, n]));
        edges.forEach((e, i) => {
          if (!e) return;
          if (!byId.has(e.from)) out.push({ where, value: `edge ${i + 1}: from "${e.from}" is no node` });
          if (!byId.has(e.to)) out.push({ where, value: `edge ${i + 1}: to "${e.to}" is no node` });
          if (e.from === e.to) out.push({ where, value: `edge ${i + 1}: joins "${e.from}" to itself` });
        });
        for (const n of nodes) {
          if (!n || n.type !== 'decision') continue;
          const outs = edges.filter(e => e && e.from === n.id);
          if (outs.length < 2) out.push({ where, value: `decision "${n.id}" has ${outs.length} branch${outs.length === 1 ? '' : 'es'} (2 or more)` });
          const labels = outs.map(e => (typeof e.label === 'string' ? e.label.trim().toLowerCase() : ''));
          if (labels.some(l => !l)) out.push({ where, value: `decision "${n.id}" has a branch with no label` });
          if (new Set(labels.filter(Boolean)).size < labels.filter(Boolean).length) out.push({ where, value: `decision "${n.id}" has two branches with one label` });
        }
        const lanes = (Array.isArray(d.groups) ? d.groups : []).filter(g => g && g.type === 'lane');
        if (lanes.length) {
          if (d.direction === 'down') out.push({ where, value: 'lanes are rows, so a diagram with lanes flows right' });
          const rows = Math.max(...nodes.map(n => (n && Number.isInteger(n.row) ? n.row : 1)));
          const seen = new Map();
          lanes.forEach((l, i) => {
            for (let r = l.row; r < l.row + (l.rows || 1); r++) {
              if (seen.has(r)) out.push({ where, value: `row ${r} is in lane ${seen.get(r) + 1} and lane ${i + 1}` });
              seen.set(r, i);
            }
          });
          for (let r = 1; r <= rows; r++) if (!seen.has(r)) out.push({ where, value: `row ${r} is in no lane` });
        }
      }
      return out;
    },
  },

  {
    // The flow mode's capacity: 24 nodes, 5 columns (4 with lanes, whose names take a column's
    // width), 5 rows, 5 lanes, 2 boundaries and 12 edge labels in one diagram, and one emphasised
    // node. A diagram past a ceiling splits into an overview and details.
    name: 'diagram-capacity', level: 'fail', source: 'SPEC §8.20', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of H.source().querySelectorAll('.cm-diagram[data-diagram="flow"]')) {
        if (H.exempt(el, check)) continue;
        let d;
        try { d = JSON.parse(el.querySelector('script[type="application/json"]').textContent); } catch (e) { continue; }
        const where = H.path(el), nodes = (Array.isArray(d.nodes) ? d.nodes : []).filter(Boolean);
        const edges = (Array.isArray(d.edges) ? d.edges : []).filter(Boolean), groups = (Array.isArray(d.groups) ? d.groups : []).filter(Boolean);
        const cols = Math.max(0, ...nodes.map(n => n.col || 0), ...groups.filter(g => g.type === 'boundary').map(g => (g.col || 1) + (g.cols || 1) - 1));
        const rows = Math.max(0, ...nodes.map(n => n.row || 0), ...groups.map(g => (g.row || 1) + (g.rows || 1) - 1));
        const lanes = groups.filter(g => g.type === 'lane').length;
        const counts = [
          ['nodes', nodes.length, 24], [lanes ? 'columns with lanes' : 'columns', cols, lanes ? 4 : 5], ['rows', rows, 5],
          ['lanes', lanes, 5], ['boundaries', groups.filter(g => g.type === 'boundary').length, 2],
          ['edge labels', edges.filter(e => typeof e.label === 'string' && e.label.trim()).length, 12],
          ['emphasised nodes', nodes.filter(n => n.emphasis).length, 1],
        ];
        for (const [what, n, max] of counts) if (n > max) out.push({ where, value: `${n} ${what} (at most ${max})` });
      }
      return out;
    },
  },

  {
    // Diagram text is not prose: it has its own limits. A node label is 1 to 24 characters and its
    // detail line 40 at most; an edge label is 1 to 3 words; an emphasis chip is 1 or 2 words; a
    // lane or boundary label is 24 characters at most.
    name: 'diagram-labels', level: 'fail', source: 'SPEC §8.20', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const words = s => s.trim().split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
      for (const el of H.source().querySelectorAll('.cm-diagram[data-diagram="flow"]')) {
        if (H.exempt(el, check)) continue;
        let d;
        try { d = JSON.parse(el.querySelector('script[type="application/json"]').textContent); } catch (e) { continue; }
        const where = H.path(el), bad = v => out.push({ where, value: v });
        for (const n of (Array.isArray(d.nodes) ? d.nodes : []).filter(Boolean)) {
          if (typeof n.label === 'string' && n.label.trim().length > 24) bad(`node "${n.id}" label "${n.label}" is ${n.label.trim().length} characters (at most 24)`);
          if (typeof n.detail === 'string' && n.detail.trim().length > 40) bad(`node "${n.id}" detail is ${n.detail.trim().length} characters (at most 40)`);
          if (typeof n.emphasis === 'string' && words(n.emphasis) > 2) bad(`node "${n.id}" emphasis "${n.emphasis}" is ${words(n.emphasis)} words (1 or 2)`);
        }
        (Array.isArray(d.edges) ? d.edges : []).filter(Boolean).forEach((e, i) => {
          if (typeof e.label === 'string' && words(e.label) > 3) bad(`edge ${i + 1} label "${e.label}" is ${words(e.label)} words (at most 3)`);
        });
        (Array.isArray(d.groups) ? d.groups : []).filter(Boolean).forEach((g, i) => {
          if (typeof g.label === 'string' && g.label.trim().length > 24) bad(`group ${i + 1} label "${g.label}" is ${g.label.trim().length} characters (at most 24)`);
        });
      }
      return out;
    },
  },

  {
    // role="img" as written; in each mode a non-empty aria-label (the author's, or the summary the
    // kit writes) and the text version, with no empty item. A flow's text version has one item for
    // every node; the other modes count theirs in their own modules.
    name: 'diagram-text', level: 'fail', source: 'SPEC §8.20',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const src = [...H.source().querySelectorAll('.cm-diagram')];
      [...document.querySelectorAll('.cm-diagram')].forEach((el, i) => {
        if (H.exempt(el, check)) return;
        const where = H.path(el), s = src[i];
        if (s && s.getAttribute('role') !== 'img') out.push({ where, value: `role="${s.getAttribute('role') || ''}" (role="img")` });
        if (!(el.getAttribute('aria-label') || '').trim()) out.push({ where, value: 'no aria-label' });
        const g = el._cmDiagram, fig = el.closest('figure') || el.parentElement;
        const text = fig && fig.querySelector('details[data-cm-diagram-text]');
        if (!text) { out.push({ where, value: 'no text version' }); return; }
        const items = [...text.querySelectorAll('li')];
        if (g && el.getAttribute('data-diagram') === 'flow' && items.length !== g.nodes.length) out.push({ where, value: `text version lists ${items.length} of ${g.nodes.length} nodes` });
        if (items.some(li => !H.text(li))) out.push({ where, value: 'text version has an empty item' });
      });
      return out;
    },
  },

  {
    // Every node and edge was drawn in this mode, and the drawn lines cross three times at most.
    name: 'diagram-drawn', level: 'fail', source: 'SPEC §8.20; §14 item 17',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of document.querySelectorAll('.cm-diagram')) {
        if (!H.shown(el) || H.exempt(el, check)) continue;
        const g = el._cmDiagram, where = H.path(el);
        if (!g) { out.push({ where, value: 'not drawn' }); continue; }
        if (g.routed !== g.total) out.push({ where, value: `${g.total - g.routed} of ${g.total} edges not drawn` });
        if (el.querySelectorAll('.cm-diagram__edge').length !== g.edges.length) out.push({ where, value: 'edge layer does not match the edges drawn' });
        const segs = g.edges.map(e => e.points.slice(1).map((p, i) => [e.points[i], p]));
        const crosses = (s, t) => {
          const sh = s[0][1] === s[1][1], th = t[0][1] === t[1][1];
          if (sh === th) return false;
          const h = sh ? s : t, v = sh ? t : s, x = v[0][0], y = h[0][1];
          return x > Math.min(h[0][0], h[1][0]) + 1 && x < Math.max(h[0][0], h[1][0]) - 1
            && y > Math.min(v[0][1], v[1][1]) + 1 && y < Math.max(v[0][1], v[1][1]) - 1;
        };
        let n = 0;
        for (let a = 0; a < segs.length; a++) for (let b = a + 1; b < segs.length; b++) for (const s of segs[a]) for (const t of segs[b]) if (crosses(s, t)) n++;
        if (n > 3) out.push({ where, value: `${n} crossings (at most 3)` });
      }
      return out;
    },
  },

  {
    // As drawn in this mode: no node overlaps another; no line passes within 8px of a node it does
    // not join; every edge, lane and boundary label stands 8px clear of every node, edge, divider,
    // lifeline and activation bar, and of every other label (a boundary label sits on its own line); nothing lies outside the canvas; and in print
    // the diagram fits the printed column (632px) and a page (720px tall) at 80% or more.
    name: 'diagram-layout', level: 'fail', source: 'SPEC §8.20; §12',
    inPage: ({ check, mode }) => {
      const H = window.__cm, out = [], CLEAR = 7.5;
      for (const el of document.querySelectorAll('.cm-diagram')) {
        if (!H.shown(el) || H.exempt(el, check)) continue;
        const g = el._cmDiagram, cv = el.querySelector('.cm-diagram__canvas');
        if (!g || !cv) continue;
        const where = H.path(el), bad = v => out.push({ where, value: v });
        const c = cv.getBoundingClientRect(), k = g.scale || 1;
        // a drawn box in canvas pixels
        const box = e => { const r = e.getBoundingClientRect(); return { l: (r.left - c.left) / k, t: (r.top - c.top) / k, r: (r.right - c.left) / k, b: (r.bottom - c.top) / k }; };
        const grow = (r, d) => ({ l: r.l - d, t: r.t - d, r: r.r + d, b: r.b + d });
        const meet = (a, b) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;
        const hits = (s, r) => Math.min(s[0][0], s[1][0]) < r.r && Math.max(s[0][0], s[1][0]) > r.l && Math.min(s[0][1], s[1][1]) < r.b && Math.max(s[0][1], s[1][1]) > r.t;
        const nodes = g.nodes.map(n => {
          const e = n.el, b = box(e);
          // a decision is drawn as a diamond inside its box; its box is what it occupies
          return { id: n.id, b };
        });
        const lines = [];
        g.edges.forEach(e => e.points.slice(1).forEach((p, i) => lines.push({ e, s: [e.points[i], p] })));
        g.lines.filter(l => l.points).forEach(l => lines.push({ e: null, kind: l.kind, s: l.points }));
        for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
          if (meet(nodes[i].b, nodes[j].b)) bad(`node "${nodes[i].id}" overlaps node "${nodes[j].id}"`);
        }
        for (const { e, s } of lines) {
          if (!e) continue;
          for (const n of nodes) if (hits(s, grow(n.b, CLEAR - 0.5))) bad(`edge ${e.from} to ${e.to} passes within 8px of node "${n.id}"`);
        }
        const labels = [];
        g.edges.forEach(e => { if (e.labelEl) labels.push({ name: `edge label "${e.label}"`, b: box(e.labelEl) }); });
        g.lanes.forEach(l => labels.push({ name: `lane label "${l.label}"`, b: box(l.el) }));
        g.lines.filter(l => l.kind === 'boundary').forEach(l => labels.push({ name: `boundary label "${l.label.textContent}"`, b: box(l.label), own: box(l.el) }));
        labels.forEach((L, i) => {
          const air = grow(L.b, CLEAR);
          for (const n of nodes) if (meet(air, n.b)) bad(`${L.name} is within 8px of node "${n.id}"`);
          for (const { e, kind, s } of lines) if (hits(s, air)) { bad(`${L.name} is within 8px of ${e ? `the edge ${e.from} to ${e.to}` : kind === 'divider' ? 'a lane divider' : `a ${kind}`}`); break; }
          for (let j = i + 1; j < labels.length; j++) if (meet(air, labels[j].b)) bad(`${L.name} is within 8px of ${labels[j].name}`);
        });
        // inside the canvas
        const inside = r => r.l >= -0.5 && r.t >= -0.5 && r.r <= g.W + 0.5 && r.b <= g.H + 0.5;
        nodes.forEach(n => { if (!inside(n.b)) bad(`node "${n.id}" lies outside the diagram`); });
        labels.forEach(L => { if (!inside(L.b)) bad(`${L.name} lies outside the diagram`); });
        g.edges.forEach(e => { if (e.points.some(p => p[0] < 0 || p[1] < 0 || p[0] > g.W || p[1] > g.H)) bad(`edge ${e.from} to ${e.to} runs outside the diagram`); });
        // the box shows the whole height; sideways it scrolls on screen and fits the column in print
        const er = el.getBoundingClientRect();
        if (c.bottom > er.bottom + 0.5 && getComputedStyle(el).overflowY !== 'visible') bad(`clipped: ${Math.round(c.bottom - er.bottom)}px of the diagram below its box`);
        if (mode === 'print') {
          if (k < 0.8 - 1e-6) bad(`printed at ${Math.round(k * 100)}% (at least 80%)`);
          if (c.width > 632.5) bad(`${Math.round(c.width)}px wide in print (the printed column is 632px)`);
          if (c.height > 720.5) bad(`${Math.round(c.height)}px tall in print (720px fits a page with the figure's title and caption)`);
        }
      }
      return out;
    },
  },
];
