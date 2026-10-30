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

Items answered on 13 Oct 2026 (decision record 055) and 16 Oct 2026 (records 058 to 063) are no
longer listed.

## Focus on one mark

- **Ruling:** a picked-out mark keeps the default colour, and the rest of its series takes
  `$context` (record 069).
- **Gallery:** the scatter demo (6.5) picks out one point in `$c1` and keeps the other four in `$c2`,
  black. Its description says "the rest stay `$c2`".
- **Now:** under the ruling, the four points turn grey. `$context` measures 1.41:1 in light and 2.02:1
  in dark against the figure surface, and the context-mark rule would then ask for a value label on
  each of them.
- **Question:** does the ruling apply to the scatter, so its other points turn grey, or does it cover
  bars and lines only, so the scatter keeps its black points?
