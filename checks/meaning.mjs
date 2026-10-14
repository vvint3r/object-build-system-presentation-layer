// Colour never carries meaning alone: status chips and flagged rows carry a word, and the
// recommended column carries a star. Read on the page as written.

export default [
  {
    name: 'status-words', level: 'fail', source: 'SPEC §1 rule 9', once: true,
    inPage: ({ check }) => {
      const H = window.__cm;
      const SEL = '.cm-chip--ok, .cm-chip--warn, .cm-chip--crit, .cm-chip--info, .cm-chip--note, .cm-chip--verdict';
      return [...H.source().querySelectorAll(SEL)]
        .filter(el => !H.exempt(el, check) && !/\p{L}{2,}/u.test(el.textContent))
        .map(el => ({ where: H.path(el), value: `status chip with no word: "${H.text(el)}"` }));
    },
  },

  {
    // A flagged row has a cell with a status word (letters, no digits) besides its first cell, and
    // the table's caption explains the colours after "Flags:".
    name: 'flag-words', level: 'fail', source: 'SPEC §1 rule 9; §8.11', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [], explained = new Set();
      for (const tr of H.source().querySelectorAll('tr[data-flag]')) {
        if (H.exempt(tr, check)) continue;
        const cells = [...tr.cells].slice(1).map(c => H.text(c));
        if (!cells.some(t => /\p{L}{2,}/u.test(t) && !/\d/.test(t))) out.push({ where: H.path(tr), value: `data-flag="${tr.dataset.flag}" with no status word in the row` });
        const table = tr.closest('table');
        if (explained.has(table)) continue;
        explained.add(table);
        const group = (table.closest('.cm-table-wrap') || table).parentElement;
        const caption = group && [...group.children].find(c => c.matches('.cm-caption'));
        if (!caption || !/Flags:/.test(caption.textContent)) out.push({ where: H.path(table), value: 'flagged rows, but no caption explains the flags ("Flags:")' });
      }
      return out;
    },
  },

  {
    name: 'rec-star', level: 'fail', source: 'SPEC §1 rule 9', once: true,
    inPage: ({ check }) => {
      const H = window.__cm;
      return [...H.source().querySelectorAll('th.is-rec')]
        .filter(el => !H.exempt(el, check) && !el.textContent.includes('★'))
        .map(el => ({ where: H.path(el), value: `recommended column "${H.text(el)}" has no ★` }));
    },
  },
];
