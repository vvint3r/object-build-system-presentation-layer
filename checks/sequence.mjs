// Sequence diagrams (SPEC section 8.20, Sequence): the JSON as written against the sequence mode's
// schema, its messages, capacity and label lengths, and the text version the kit wrote. What the kit
// drew (every message drawn, labels clear of lifelines and bars, clipping, print fit) is checked for
// every mode in checks/diagrams.mjs. Each in-page function is self-contained, so small helpers are
// repeated.

export default [
  {
    // The JSON parses and holds only the sequence mode's fields, with the values each field allows.
    // Order places participants and messages, so a node has no column or row.
    name: 'sequence-json', level: 'fail', source: 'SPEC §8.20, Sequence', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const TOP = ['nodes', 'edges'];
      const NODE = ['id', 'label', 'detail'];
      const EDGE = ['from', 'to', 'label', 'kind', 'activate'];
      const KINDS = ['message', 'reply', 'optional'];
      const str = v => typeof v === 'string' && v.trim() !== '';
      for (const el of H.source().querySelectorAll('.cm-diagram[data-diagram="sequence"]')) {
        if (H.exempt(el, check)) continue;
        const where = H.path(el), bad = v => out.push({ where, value: v });
        const s = el.querySelector('script[type="application/json"]');
        if (!s) { bad('no diagram JSON'); continue; }
        let d;
        try { d = JSON.parse(s.textContent); } catch (e) { bad(e.message); continue; }
        if (!d || typeof d !== 'object' || Array.isArray(d)) { bad('the JSON is not an object'); continue; }
        const extra = (o, keys, what) => Object.keys(o).filter(k => !keys.includes(k)).forEach(k => bad(`${what} has "${k}" (allowed: ${keys.join(', ')})`));
        extra(d, TOP, 'the diagram');
        if (!Array.isArray(d.nodes) || d.nodes.length < 2) { bad('fewer than 2 participants'); continue; }
        const ids = new Set();
        d.nodes.forEach((n, i) => {
          const w = `node ${n && n.id != null ? `"${n.id}"` : i + 1}`;
          if (!n || typeof n !== 'object') { bad(`${w} is not an object`); return; }
          extra(n, NODE, w);
          if (!str(n.id)) bad(`${w}: id is not a non-empty string`);
          else if (ids.has(n.id)) bad(`${w}: id used twice`);
          else ids.add(n.id);
          if (!str(n.label)) bad(`${w}: no label`);
          if (n.detail != null && !str(n.detail)) bad(`${w}: detail is not text`);
        });
        if (!Array.isArray(d.edges) || !d.edges.length) { bad('no messages'); continue; }
        d.edges.forEach((e, i) => {
          const w = `message ${i + 1}`;
          if (!e || typeof e !== 'object') { bad(`${w} is not an object`); return; }
          extra(e, EDGE, w);
          if (e.kind != null && !KINDS.includes(e.kind)) bad(`${w}: kind "${e.kind}" (${KINDS.join(', ')})`);
          if (e.activate != null && typeof e.activate !== 'boolean') bad(`${w}: activate is true or false`);
        });
      }
      return out;
    },
  },

  {
    // Every message joins participants that exist and carries a label. An activation opens on a
    // participant with no bar open, from another participant, and only a reply closes it.
    name: 'sequence-edges', level: 'fail', source: 'SPEC §8.20, Sequence', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const str = v => typeof v === 'string' && v.trim() !== '';
      for (const el of H.source().querySelectorAll('.cm-diagram[data-diagram="sequence"]')) {
        if (H.exempt(el, check)) continue;
        let d;
        try { d = JSON.parse(el.querySelector('script[type="application/json"]').textContent); } catch (e) { continue; }
        const where = H.path(el), bad = v => out.push({ where, value: v });
        const ids = new Set((Array.isArray(d.nodes) ? d.nodes : []).filter(n => n && n.id != null).map(n => n.id));
        const open = new Set();
        (Array.isArray(d.edges) ? d.edges : []).forEach((e, i) => {
          if (!e) return;
          const w = `message ${i + 1}`;
          if (!ids.has(e.from)) bad(`${w}: from "${e.from}" is no participant`);
          if (!ids.has(e.to)) bad(`${w}: to "${e.to}" is no participant`);
          if (!str(e.label)) bad(`${w}: no label`);
          if (e.kind === 'reply' && e.from !== e.to) open.delete(e.from);
          if (e.activate === true) {
            if (e.from === e.to) bad(`${w}: a message to oneself opens no bar`);
            else if (open.has(e.to)) bad(`${w}: "${e.to}" already has a bar open`);
            else open.add(e.to);
          }
        });
      }
      return out;
    },
  },

  {
    // The sequence mode's capacity: 4 participants and 12 messages. A longer exchange splits into
    // an overview and details.
    name: 'sequence-capacity', level: 'fail', source: 'SPEC §8.20, Sequence', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of H.source().querySelectorAll('.cm-diagram[data-diagram="sequence"]')) {
        if (H.exempt(el, check)) continue;
        let d;
        try { d = JSON.parse(el.querySelector('script[type="application/json"]').textContent); } catch (e) { continue; }
        const counts = [['participants', (Array.isArray(d.nodes) ? d.nodes : []).filter(Boolean).length, 4],
          ['messages', (Array.isArray(d.edges) ? d.edges : []).filter(Boolean).length, 12]];
        for (const [what, n, max] of counts) if (n > max) out.push({ where: H.path(el), value: `${n} ${what} (at most ${max})` });
      }
      return out;
    },
  },

  {
    // Sequence text keeps the flow diagram's limits: a participant label of 24 characters and a
    // detail of 40, and a message label of 1 to 3 words.
    name: 'sequence-labels', level: 'fail', source: 'SPEC §8.20, Sequence', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const words = s => s.trim().split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
      for (const el of H.source().querySelectorAll('.cm-diagram[data-diagram="sequence"]')) {
        if (H.exempt(el, check)) continue;
        let d;
        try { d = JSON.parse(el.querySelector('script[type="application/json"]').textContent); } catch (e) { continue; }
        const where = H.path(el), bad = v => out.push({ where, value: v });
        for (const n of (Array.isArray(d.nodes) ? d.nodes : []).filter(Boolean)) {
          if (typeof n.label === 'string' && n.label.trim().length > 24) bad(`participant "${n.id}" label "${n.label}" is ${n.label.trim().length} characters (at most 24)`);
          if (typeof n.detail === 'string' && n.detail.trim().length > 40) bad(`participant "${n.id}" detail is ${n.detail.trim().length} characters (at most 40)`);
        }
        (Array.isArray(d.edges) ? d.edges : []).filter(Boolean).forEach((e, i) => {
          if (typeof e.label === 'string' && words(e.label) > 3) bad(`message ${i + 1} label "${e.label}" is ${words(e.label)} words (at most 3)`);
        });
      }
      return out;
    },
  },

  {
    // The text version the kit wrote has one item for every message.
    name: 'sequence-text', level: 'fail', source: 'SPEC §8.20, Sequence',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of document.querySelectorAll('.cm-diagram[data-diagram="sequence"]')) {
        if (H.exempt(el, check)) continue;
        const g = el._cmDiagram, fig = el.closest('figure') || el.parentElement;
        const text = fig && fig.querySelector('details[data-cm-diagram-text]');
        if (!g || !text) continue;
        const items = text.querySelectorAll('li').length;
        if (items !== g.edges.length) out.push({ where: H.path(el), value: `text version lists ${items} of ${g.edges.length} messages` });
      }
      return out;
    },
  },
];
