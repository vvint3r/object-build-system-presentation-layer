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

## 2. Gallery held to report rules

- **Spec:** `SPEC.md` describes a report: the required head with the `cm-kit` meta (section 2), only
  `cm-report.css` classes, no `<style>` and no inline style beyond the listed custom properties
  (section 1, rules 1 and 2), and the full report anatomy (section 7: masthead fields and byline, a
  summary with a KPI strip and findings, a notes and sources appendix, a footer naming the kit, a top
  bar holding the wordmark, one series chip, the theme toggle and the print button). Tables carry a
  source caption, `.num` on numeric columns and `data-sortable` from five rows (section 8.11).
- **Page:** `Report Kit - Spec & Gallery.html` has a helper layer and an anatomy of its own: a
  `<style>` block (line 14); `g-sw` and `g-comp` classes; inline styles for swatches and spacing
  (from line 79); no `cm-kit` meta; a masthead with Status, Version, Last updated and Agent-readable
  spec, no byline and no type chip (lines 65 to 70); a usage summary with no KPI strip and no
  findings; no sources appendix; a footer that does not name the kit (line 834); a "Sample report"
  button in the top bar (line 35); Tables 2.1, 4.1 and 6.1 (lines 112, 232, 574) with no caption or
  `data-sortable`; a "#" column without `.num` in Table 4.1 (line 235); a recommended-column demo
  whose caption has no source (line 423).
- **Now:** the checks exempt two regions of the gallery (`checks/exempt.mjs`): the markup listings
  (`.g-src`) from every check, and each demo (`[data-demo]`) from the counts and order that apply
  across a whole report. Everything listed above fails or warns.
- **Question:** should the checks hold the gallery to report rules (the page changes), or exempt its
  helper layer and report anatomy (more entries in `checks/exempt.mjs`)?
