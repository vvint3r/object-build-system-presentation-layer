// Hierarchies (SPEC section 8.20, Hierarchy): the JSON as written against the hierarchy's schema,
// its tree, capacity and label lengths, and the levels and text version the kit drew. What the kit
// drew for every mode (every edge drawn, overlap, clearance, clipping, print fit) is checked in
// checks/diagrams.mjs. Each in-page function is self-contained, so small helpers are repeated
// inside it.

export default [
  {
    // The JSON parses and holds only the hierarchy's fields. The nodes form one tree: one root with
    // no parent, every other node's parent a node that exists, and no node its own ancestor.
    name: 'hierarchy-json', level: 'fail', source: 'SPEC §8.20, Hierarchy', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const TOP = ['nodes'], NODE = ['id', 'label', 'detail', 'parent'];
      const str = v => typeof v === 'string' && v.trim() !== '';
      for (const el of H.source().querySelectorAll('.cm-diagram[data-diagram="hierarchy"]')) {
        if (H.exempt(el, check)) continue;
        const where = H.path(el), bad = v => out.push({ where, value: v });
        const s = el.querySelector('script[type="application/json"]');
        if (!s) { bad('no diagram JSON'); continue; }
        let d;
        try { d = JSON.parse(s.textContent); } catch (e) { bad(e.message); continue; }
        if (!d || typeof d !== 'object' || Array.isArray(d)) { bad('the JSON is not an object'); continue; }
        const extra = (o, keys, what) => Object.keys(o).filter(k => !keys.includes(k)).forEach(k => bad(`${what} has "${k}" (allowed: ${keys.join(', ')})`));
        extra(d, TOP, 'the diagram');
        if (!Array.isArray(d.nodes) || !d.nodes.length) { bad('no nodes'); continue; }
        const byId = new Map();
        d.nodes.forEach((n, i) => {
          const w = `node ${n && n.id != null ? `"${n.id}"` : i + 1}`;
          if (!n || typeof n !== 'object') { bad(`${w} is not an object`); return; }
          extra(n, NODE, w);
          if (!str(n.id)) bad(`${w}: id is not a non-empty string`);
          else if (byId.has(n.id)) bad(`${w}: id used twice`);
          else byId.set(n.id, n);
          if (!str(n.label)) bad(`${w}: no label`);
          if (n.detail != null && !str(n.detail)) bad(`${w}: detail is not text`);
        });
        const roots = [...byId.values()].filter(n => n.parent == null);
        if (roots.length !== 1) bad(`${roots.length} roots (exactly 1 node with no parent)`);
        for (const n of byId.values()) {
          if (n.parent == null) continue;
          if (!byId.has(n.parent)) { bad(`node "${n.id}": parent "${n.parent}" is no node`); continue; }
          const seen = new Set([n.id]);
          for (let p = byId.get(n.parent); p; p = p.parent == null ? null : byId.get(p.parent)) {
            if (seen.has(p.id)) { bad(`node "${n.id}" is its own ancestor`); break; }
            seen.add(p.id);
          }
        }
      }
      return out;
    },
  },

  {
    // Capacity and labels: 4 levels and 6 leaves (nodes with no children), with the flow mode's
    // label lengths: a label is 1 to 24 characters and a detail line 40 at most. A larger tree
    // splits into an overview and details; whether the drawn tree fits a printed page is checked
    // with every diagram.
    name: 'hierarchy-capacity', level: 'fail', source: 'SPEC §8.20, Hierarchy', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const long = (v, max) => typeof v === 'string' && v.trim().length > max;
      for (const el of H.source().querySelectorAll('.cm-diagram[data-diagram="hierarchy"]')) {
        if (H.exempt(el, check)) continue;
        let d;
        try { d = JSON.parse(el.querySelector('script[type="application/json"]').textContent); } catch (e) { continue; }
        const where = H.path(el), bad = v => out.push({ where, value: v });
        const nodes = (Array.isArray(d && d.nodes) ? d.nodes : []).filter(n => n && n.id != null);
        const byId = new Map(nodes.map(n => [n.id, n]));
        const depth = n => { let k = 1; for (let p = n, guard = 0; p && p.parent != null && guard < nodes.length; guard++) { p = byId.get(p.parent); if (p) k++; } return k; };
        const levels = Math.max(0, ...nodes.map(depth));
        const leaves = nodes.filter(n => !nodes.some(m => m.parent === n.id)).length;
        if (levels > 4) bad(`${levels} levels (at most 4)`);
        if (leaves > 6) bad(`${leaves} leaves (at most 6)`);
        nodes.forEach(n => {
          if (long(n.label, 24)) bad(`node "${n.id}" label "${n.label}" is ${n.label.trim().length} characters (at most 24)`);
          if (long(n.detail, 40)) bad(`node "${n.id}" detail is ${n.detail.trim().length} characters (at most 40)`);
        });
      }
      return out;
    },
  },

  {
    // As drawn: each level in one column, left to right, its boxes one width; children top to bottom
    // in the order written; lines with no arrowhead; and a text version that nests every node under
    // its parent.
    name: 'hierarchy-drawn', level: 'fail', source: 'SPEC §8.20, Hierarchy',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of document.querySelectorAll('.cm-diagram[data-diagram="hierarchy"]')) {
        if (!H.shown(el) || H.exempt(el, check)) continue;
        const g = el._cmDiagram, cv = el.querySelector('.cm-diagram__canvas'), where = H.path(el), bad = v => out.push({ where, value: v });
        if (!g || !cv) { bad('not drawn'); continue; }
        const c = cv.getBoundingClientRect(), k = g.scale || 1;
        const box = e => { const r = e.getBoundingClientRect(); return { l: (r.left - c.left) / k, t: (r.top - c.top) / k, r: (r.right - c.left) / k, b: (r.bottom - c.top) / k }; };
        const at = new Map(g.nodes.map(n => [n.id, box(n.el)]));
        const kids = new Map();
        g.edges.forEach(e => { if (!kids.has(e.from)) kids.set(e.from, []); kids.get(e.from).push(e.to); });
        const root = g.nodes.find(n => !g.edges.some(e => e.to === n.id));
        const col = new Map();
        const walk = (id, lv) => {
          const b = at.get(id), x = col.get(lv);
          if (!x) col.set(lv, b);
          else if (Math.abs(x.l - b.l) > 0.5 || Math.abs(x.r - b.r) > 0.5) bad(`node "${id}" is not aligned with level ${lv + 1}`);
          const ks = kids.get(id) || [];
          ks.forEach((kid, i) => {
            const kb = at.get(kid);
            if (kb.l <= b.r) bad(`node "${kid}" does not stand right of its parent "${id}"`);
            if (i && kb.t < at.get(ks[i - 1]).b) bad(`node "${kid}" stands above "${ks[i - 1]}", written before it`);
            walk(kid, lv + 1);
          });
        };
        if (root) walk(root.id, 0);
        if (el.querySelectorAll('.cm-diagram__head').length) bad('a hierarchy line carries an arrowhead');
        const fig = el.closest('figure'), text = fig && fig.querySelector('details[data-cm-diagram-text]');
        const top = text && text.querySelector('ul');
        const items = text ? text.querySelectorAll('li').length : 0;
        if (items !== g.nodes.length) bad(`text version lists ${items} of ${g.nodes.length} nodes`);
        const deep = li => 1 + Math.max(0, ...[...li.querySelectorAll(':scope > ul > li')].map(deep));
        const nested = top ? Math.max(0, ...[...top.querySelectorAll(':scope > li')].map(deep)) : 0;
        if (nested !== col.size) bad(`text version nests ${nested} levels; the tree has ${col.size}`);
      }
      return out;
    },
  },
];
