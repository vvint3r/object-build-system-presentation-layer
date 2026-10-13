# Every label at 10px

- **Date:** 2026-10-13
- **Source:** the owner, in session, confirming the reading record 055 left open
- **Status:** in force

---

## Ruling

Every label is 10px. Record 055 applied "labels need to be 10px" to chips and tags only and kept the
other labels at 11px. The owner confirmed the wider reading: all labels go to 10px.

## Changed

`cm-report.css`: `font-size` 11px → 10px in the 13 all-caps label rules.

| Selector |
| --- |
| `.cm-label` |
| `.cm-crumbs` |
| `.cm-mast__meta dt`, `.cm-byline dt` |
| `.cm-kpi__label` |
| `.cm-callout__label` |
| `.cm-def__label`, `.cm-qa__label` |
| `.cm-props dt` |
| `.cm-quote footer b` |
| `.cm-figure__kind` |
| `.cm-slot b` |
| `.cm-data>summary` |
| `.cm-table-title__kind` |
| `.cm-collapse>summary::after` |

`SPEC.md` section 4: the Label and Chip rows are one tier at 10 / 800 / caps / +0.08em, and the type
floor sentence lists labels among the 10px uses. "Table heads" is removed from the Label row; see
below.

Gallery: the type specimen reads `Label · 10 / 800 / caps / +0.08em`.

## Not changed

| Element | Size | Reason |
| --- | --- | --- |
| `.cm-btn` | 12px | A control, not a label |
| `.cm-timeline__date` | 12px | A date, not a label |
| `.cm-fn` footnote marker | 11px | A reference number, not a label |
| Print source URL (`.cm-sources a::after`) | 11px | Running text in print, not a label |
| Chart text (`cm-report.js`) | 12–13px | Outside the label tier |
| `.cm-table th` | 15px / 900, no caps | The spec listed table heads as labels; the code does not render them as labels. Logged in `docs/open-items.md` for a ruling |

## Version

The kit stays at 1.1.
