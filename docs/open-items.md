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

The first five items were answered on 13 Oct 2026 (decision record 055), the rest on 16 Oct 2026
(records 058 to 063).

## Documents without measured numbers

- **Spec:** section 7 makes the KPI strip, the masthead's Period field and the period in the title
  required, says required blocks are never omitted, and makes the Recommendations section
  recommended; section 1 rule 7 requires exactly one `cm-featured`. Section 1 rule 12 forbids filler
  and requires every number shown to be sourced.
- **Checks:** `summary-anatomy` fails a page with no KPI strip, `masthead` one with no Period field,
  `head-order` one whose title has no period, and `featured` one with no featured card.
- **Agent brief:** `kit/agent-brief.md` tells agents building a document without measured numbers (a
  briefing, a guide, interview preparation) to leave out a required block whose content does not
  exist, state the omission in an HTML comment, and treat those four failures as expected.
- **Question:** confirm the brief's reading, so that section 7 of the spec states it and the four
  checks accept a commented omission; or rule otherwise.
