// Tables: title, numeric columns, raw values and caption. Read on the page as written. A table
// inside a figure's data fallback (.cm-data) is that figure's text alternative, not a numbered
// table, and is left out. Each in-page function is self-contained, so helpers are repeated inside
// it.

export default [
  {
    // A header row, a title (kind label "Table N" plus title text) that aria-labelledby points at,
    // and a caption after the table with a source line: a .cm-caption__line that opens "Source:".
    name: 'table-anatomy', level: 'fail', source: 'SPEC §8.11; §14 item 6', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, d = H.source(), out = [];
      for (const t of d.querySelectorAll('table.cm-table')) {
        if (t.closest('.cm-data') || H.exempt(t, check)) continue;
        if (!t.tHead) out.push({ where: H.path(t), value: 'no <thead>' });
        const id = t.getAttribute('aria-labelledby');
        const title = id && d.getElementById(id);
        if (!title) out.push({ where: H.path(t), value: id ? `aria-labelledby="${id}" points at nothing` : 'no aria-labelledby' });
        else if (!title.matches('.cm-table-title')) out.push({ where: H.path(title), value: 'the title is not a .cm-table-title' });
        else {
          const kind = title.querySelector('.cm-table-title__kind');
          if (!kind || !/^Table \S+$/.test(H.text(kind))) out.push({ where: H.path(title), value: `kind "${kind ? H.text(kind) : ''}" (Table N)` });
          const rest = H.text(title).slice(kind ? H.text(kind).length : 0).trim();
          if (!rest) out.push({ where: H.path(title), value: 'no title text' });
        }
        const group = (t.closest('.cm-table-wrap') || t).parentElement;
        const cap = group && [...group.children].find(c => c.matches('.cm-caption'));
        if (!cap) out.push({ where: H.path(t), value: 'no .cm-caption after the table' });
        else if (![...cap.querySelectorAll('.cm-caption__line')].some(l => /^Source:\s/.test(H.text(l)))) out.push({ where: H.path(cap), value: 'caption has no source line (a .cm-caption__line opening "Source:")' });
      }
      return out;
    },
  },

  {
    // Tables are numbered 1, 2, 3 in order. The spec numbers figures this way and shows tables
    // numbered the same way, so a gap or a non-integer number is a warning.
    name: 'table-numbers', level: 'warn', source: 'SPEC §8.11', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      let expected = 1;
      for (const k of H.source().querySelectorAll('.cm-table-title__kind')) {
        if (H.exempt(k, check)) continue;
        const m = H.text(k).match(/^Table (\S+)$/);
        if (!m) continue;
        if (m[1] !== String(expected)) out.push({ where: H.path(k), value: `"${H.text(k)}" where Table ${expected} comes next` });
        expected = /^\d+$/.test(m[1]) ? Number(m[1]) + 1 : expected + 1;
      }
      return out;
    },
  },

  {
    // A body cell whose text is a formatted number ("17,940", "37.2%", "1h 42m") carries the raw
    // number in data-value; negatives use the minus sign, not a hyphen. The totals row (tfoot) is
    // not sorted and follows the spec's own example, which gives its cells no data-value.
    name: 'table-values', level: 'fail', source: 'SPEC §8.11; §14 item 6', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const PLAIN = /^[−-]?\d+(\.\d+)?$/;
      for (const t of H.source().querySelectorAll('table.cm-table')) {
        if (t.closest('.cm-data') || H.exempt(t, check)) continue;
        for (const td of t.querySelectorAll('tbody td.num, tbody th.num')) {
          const text = H.text(td);
          if (/^-\d/.test(text)) out.push({ where: H.path(td), value: `"${text}" (negatives use − U+2212)` });
          if (!text || text === '\u2014' || PLAIN.test(text) || !/\d/.test(text)) continue;
          const v = td.getAttribute('data-value');
          if (v == null) out.push({ where: H.path(td), value: `"${text}" with no data-value` });
          else if (v.trim() === '' || !Number.isFinite(Number(v))) out.push({ where: H.path(td), value: `"${text}" with data-value="${v}"` });
        }
      }
      return out;
    },
  },

  {
    // A column whose body cells are all numbers carries .num on its header and on every cell.
    name: 'table-num', level: 'fail', source: 'SPEC §8.11; §14 item 6', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const NUMERIC = /^[−+-]?[$€£]?\d[\d,]*(\.\d+)?\s*(%|pp|pts?|[kKmMbB]|ms|s|h|d|x|×)?$|^\d+h( ?\d+m)?$|^\d+m$/;
      for (const t of H.source().querySelectorAll('table.cm-table')) {
        if (t.closest('.cm-data') || H.exempt(t, check) || !t.tHead || !t.tBodies.length) continue;
        const head = t.tHead.rows[t.tHead.rows.length - 1];
        if (!head || [...head.cells].some(c => c.colSpan > 1)) continue;
        const rows = [...t.tBodies].flatMap(b => [...b.rows]).filter(r => ![...r.cells].some(c => c.colSpan > 1));
        [...head.cells].forEach((th, i) => {
          const cells = rows.map(r => r.cells[i]).filter(c => c && H.text(c) && H.text(c) !== '\u2014');
          if (!cells.length || !cells.every(c => NUMERIC.test(H.text(c)))) return;
          if (!th.classList.contains('num')) out.push({ where: H.path(th), value: `numeric column "${H.text(th)}" header without .num` });
          const bare = cells.filter(c => !c.classList.contains('num'));
          if (bare.length) out.push({ where: H.path(bare[0]), value: `${bare.length} numeric cell(s) in "${H.text(th)}" without .num` });
        });
      }
      return out;
    },
  },

  {
    name: 'table-sortable', level: 'warn', source: 'SPEC §8.11', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const t of H.source().querySelectorAll('table.cm-table')) {
        if (t.closest('.cm-data') || H.exempt(t, check)) continue;
        const n = [...t.tBodies].reduce((s, b) => s + b.rows.length, 0);
        if (n >= 5 && !t.hasAttribute('data-sortable')) out.push({ where: H.path(t), value: `${n} body rows without data-sortable` });
        if (t.hasAttribute('data-sortable') && t.tHead) {
          for (const th of t.tHead.querySelectorAll('th')) {
            if (/^status$/i.test(H.text(th)) && !th.hasAttribute('data-nosort')) out.push({ where: H.path(th), value: 'status column without data-nosort' });
          }
        }
      }
      return out;
    },
  },
];
