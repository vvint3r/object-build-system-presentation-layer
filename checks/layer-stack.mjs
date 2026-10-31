// Layer stacks (SPEC section 8.20, Layer stack): the JSON as written against the layer stack's
// schema, its dependencies, capacity and label lengths, and the frames and text version the kit
// wrote. What the kit drew (every edge drawn, overlap, clearance, clipping, print fit) is checked
// for every mode in checks/diagrams.mjs. Each in-page function is self-contained, so small helpers
// are repeated inside it.

export default [
  {
    // The JSON parses and holds only the layer stack's fields: layers from the top down, each with a
    // label and its components, and dependencies with no label. Ids are unique across the stack and
    // a column holds one component per layer.
    name: 'layer-stack-json', level: 'fail', source: 'SPEC §8.20, Layer stack', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const TOP = ['layers', 'edges'], LAYER = ['label', 'nodes'], NODE = ['id', 'label', 'detail', 'col'], EDGE = ['from', 'to'];
      const pos = v => Number.isInteger(v) && v >= 1;
      const str = v => typeof v === 'string' && v.trim() !== '';
      for (const el of H.source().querySelectorAll('.cm-diagram[data-diagram="layer-stack"]')) {
        if (H.exempt(el, check)) continue;
        const where = H.path(el), bad = v => out.push({ where, value: v });
        const s = el.querySelector('script[type="application/json"]');
        if (!s) { bad('no diagram JSON'); continue; }
        let d;
        try { d = JSON.parse(s.textContent); } catch (e) { bad(e.message); continue; }
        if (!d || typeof d !== 'object' || Array.isArray(d)) { bad('the JSON is not an object'); continue; }
        const extra = (o, keys, what) => Object.keys(o).filter(k => !keys.includes(k)).forEach(k => bad(`${what} has "${k}" (allowed: ${keys.join(', ')})`));
        extra(d, TOP, 'the diagram');
        if (!Array.isArray(d.layers) || d.layers.length < 2) { bad('a layer stack has two layers or more'); continue; }
        const ids = new Set();
        d.layers.forEach((l, i) => {
          const w = `layer ${i + 1}`;
          if (!l || typeof l !== 'object') { bad(`${w} is not an object`); return; }
          extra(l, LAYER, w);
          if (!str(l.label)) bad(`${w}: no label`);
          if (!Array.isArray(l.nodes) || !l.nodes.length) { bad(`${w}: no components`); return; }
          const cols = new Map();
          l.nodes.forEach((n, j) => {
            const v = `${w}, component ${n && n.id != null ? `"${n.id}"` : j + 1}`;
            if (!n || typeof n !== 'object') { bad(`${v} is not an object`); return; }
            extra(n, NODE, v);
            if (!str(n.id)) bad(`${v}: id is not a non-empty string`);
            else if (ids.has(n.id)) bad(`${v}: id used twice`);
            else ids.add(n.id);
            if (!str(n.label)) bad(`${v}: no label`);
            if (n.detail != null && !str(n.detail)) bad(`${v}: detail is not text`);
            if (!pos(n.col)) bad(`${v}: col is a whole number from 1`);
            else if (cols.has(n.col)) bad(`${v}: shares column ${n.col} with "${cols.get(n.col)}"`);
            else cols.set(n.col, n.id);
          });
        });
        if (d.edges != null && !Array.isArray(d.edges)) bad('edges is not a list');
        (Array.isArray(d.edges) ? d.edges : []).forEach((e, i) => {
          if (!e || typeof e !== 'object') { bad(`edge ${i + 1} is not an object`); return; }
          extra(e, EDGE, `edge ${i + 1}`);
        });
      }
      return out;
    },
  },

  {
    // A dependency joins two components that exist and runs down: from a component to one in a lower
    // layer. A dependency up or within a layer breaks the stack, and the kit does not draw it.
    name: 'layer-stack-edges', level: 'fail', source: 'SPEC §8.20, Layer stack', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of H.source().querySelectorAll('.cm-diagram[data-diagram="layer-stack"]')) {
        if (H.exempt(el, check)) continue;
        let d;
        try { d = JSON.parse(el.querySelector('script[type="application/json"]').textContent); } catch (e) { continue; }
        const where = H.path(el), layer = new Map();
        (Array.isArray(d && d.layers) ? d.layers : []).forEach((l, i) => (l && Array.isArray(l.nodes) ? l.nodes : []).forEach(n => { if (n && n.id != null) layer.set(n.id, i + 1); }));
        (Array.isArray(d && d.edges) ? d.edges : []).filter(Boolean).forEach((e, i) => {
          const a = layer.get(e.from), b = layer.get(e.to);
          if (!a) out.push({ where, value: `edge ${i + 1}: from "${e.from}" is no component` });
          if (!b) out.push({ where, value: `edge ${i + 1}: to "${e.to}" is no component` });
          if (a && b && b <= a) out.push({ where, value: `edge ${i + 1}: "${e.from}" depends on "${e.to}" ${b === a ? 'in its own layer' : 'in a higher layer'} (a dependency runs down)` });
        });
      }
      return out;
    },
  },

  {
    // Capacity and labels: 5 layers, 4 components in a layer, and the flow mode's label lengths: a
    // component label is 1 to 24 characters, its detail 40 at most, and a layer label 24 at most.
    // A larger stack splits into an overview and details.
    name: 'layer-stack-capacity', level: 'fail', source: 'SPEC §8.20, Layer stack', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const long = (v, max) => typeof v === 'string' && v.trim().length > max;
      for (const el of H.source().querySelectorAll('.cm-diagram[data-diagram="layer-stack"]')) {
        if (H.exempt(el, check)) continue;
        let d;
        try { d = JSON.parse(el.querySelector('script[type="application/json"]').textContent); } catch (e) { continue; }
        const where = H.path(el), bad = v => out.push({ where, value: v });
        const layers = (Array.isArray(d && d.layers) ? d.layers : []).filter(Boolean);
        if (layers.length > 5) bad(`${layers.length} layers (at most 5)`);
        layers.forEach((l, i) => {
          const nodes = (Array.isArray(l.nodes) ? l.nodes : []).filter(Boolean);
          if (nodes.length > 4) bad(`layer ${i + 1} has ${nodes.length} components (at most 4)`);
          nodes.forEach(n => { if (Number.isInteger(n.col) && n.col > 4) bad(`component "${n.id}" in column ${n.col} (at most 4)`); });
          if (long(l.label, 24)) bad(`layer ${i + 1} label "${l.label}" is ${l.label.trim().length} characters (at most 24)`);
          nodes.forEach(n => {
            if (long(n.label, 24)) bad(`component "${n.id}" label "${n.label}" is ${n.label.trim().length} characters (at most 24)`);
            if (long(n.detail, 40)) bad(`component "${n.id}" detail is ${n.detail.trim().length} characters (at most 40)`);
          });
        });
      }
      return out;
    },
  },

  {
    // As drawn: one frame for each layer, from the top down, each holding its components and its
    // name; and a text version with one item for every component.
    name: 'layer-stack-drawn', level: 'fail', source: 'SPEC §8.20, Layer stack',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of document.querySelectorAll('.cm-diagram[data-diagram="layer-stack"]')) {
        if (!H.shown(el) || H.exempt(el, check)) continue;
        const g = el._cmDiagram, cv = el.querySelector('.cm-diagram__canvas'), where = H.path(el), bad = v => out.push({ where, value: v });
        if (!g || !cv || !g.layers) { bad('not drawn'); continue; }
        const c = cv.getBoundingClientRect(), k = g.scale || 1;
        const box = e => { const r = e.getBoundingClientRect(); return { l: (r.left - c.left) / k, t: (r.top - c.top) / k, r: (r.right - c.left) / k, b: (r.bottom - c.top) / k }; };
        const holds = (o, i) => i.l >= o.l - 0.5 && i.r <= o.r + 0.5 && i.t >= o.t - 0.5 && i.b <= o.b + 0.5;
        const frames = g.layers.map(l => ({ label: l.label, b: box(l.el) }));
        frames.forEach((f, i) => { if (i && f.b.t < frames[i - 1].b.b) bad(`layer "${f.label}" overlaps the layer above it`); });
        g.lanes.forEach((l, i) => { if (frames[i] && !holds(frames[i].b, box(l.el))) bad(`the name "${l.label}" lies outside its layer`); });
        el.querySelectorAll('.cm-diagram__node').forEach(n => {
          if (!frames.some(x => holds(x.b, box(n)))) bad(`component "${n.getAttribute('data-node')}" lies outside every layer`);
        });
        const fig = el.closest('figure'), text = fig && fig.querySelector('details[data-cm-diagram-text]');
        const items = text ? text.querySelectorAll('li').length : 0;
        if (items !== g.nodes.length) bad(`text version lists ${items} of ${g.nodes.length} components`);
      }
      return out;
    },
  },
];
