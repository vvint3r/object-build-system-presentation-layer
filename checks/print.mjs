// Print: what a printed page leaves out. An instruction that only works on screen, such as one
// that tells the reader to select a column header to sort a table, sits in .cm-noprint, so the
// printed page never asks the reader to use a control it does not have (SPEC.md section 12).

export default [
  {
    // In print, no shown sentence tells the reader to select, click, tap or press one of the page's
    // own controls: a table header, a sort, a disclosure or a button.
    name: 'print-screen-only', level: 'fail', source: 'SPEC §12; record 096',
    inPage: ({ check, mode }) => {
      if (mode !== 'print') return [];
      const H = window.__cm, out = [];
      const ASK = /\b(select|click|tap|press)\b[^.!?]*\b(column header|header|to sort|view data|view as text|toggle|button)\b/i;
      for (const el of document.querySelectorAll('main p, main li, main dd, main .cm-caption__line')) {
        if (!H.shown(el) || H.exempt(el, check) || el.querySelector('p, li, dd, .cm-caption__line')) continue;
        for (const s of el.innerText.split(/(?<=[.!?])\s+/)) {
          if (ASK.test(s)) out.push({ where: H.path(el), value: `prints "${s.trim().slice(0, 60)}" (screen-only text goes in .cm-noprint)` });
        }
      }
      return out;
    },
  },
];
