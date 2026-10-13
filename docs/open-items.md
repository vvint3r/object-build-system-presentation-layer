# Open items

Questions for the owner about Report Kit 1.1, the baseline. Each item names what the kit's
specification says, what its code does, and the question to answer. Until an item is answered, the
kit's code is what renders, and nothing in it is changed.

When an item is answered: change the kit (`kit/report-kit/`), keep `SPEC.md`, `cm-report.css`,
`cm-report.js` and the gallery page in step, add a decision record in `docs/decisions/`, and delete the
item from this file.

Inconsistencies inside the original library are tracked separately in
`docs/reference/library-open-items.md`. They matter only when the feature they touch is adopted.

---

The first five items were answered on 13 Oct 2026; see decision record 055.

## 1. Table head type

- **Spec (before record 056):** `SPEC.md` section 4 listed table heads in the Label tier: 11–12px,
  weight 800, uppercase, +0.08em tracking.
- **Code:** `cm-report.css`, `.cm-table th`: 15px, weight 900, no uppercase, no tracking.
- **Now:** record 056 set the Label tier to 10px and removed table heads from it, so the spec states
  no table-head size. The code still renders 15 / 900.
- **Question:** should table heads stay as the code renders them (15 / 900, sentence case), or
  become labels (10 / 800 / caps / +0.08em)?
