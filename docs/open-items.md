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

## 3. Classes named in the spec with no rule in the CSS

- **Spec:** the callout variants are a closed set that includes `note` (`SPEC.md` line 191;
  `template.html` line 155 uses `cm-callout--note`). The timeline states include `is-done`, a hollow
  ink marker (line 322; markup at line 311).
- **Code:** `cm-report.css` has no `.cm-callout--note` or `.is-done` rule. Both looks come from the
  base rules: `.cm-callout` (line 226) and `.cm-timeline__mark`, a hollow ink circle (line 358).
- **Pages:** sample lines 189 and 379 to 381; gallery lines 315, 435 and 436.
- **Now:** the class check accepts only classes `cm-report.css` defines, so both pages fail it.
- **Question:** should the class check also accept the classes the spec names, or should
  `cm-report.css` name both classes in a rule?

## 11. Formatted cells without `data-value`

- **Spec:** "`data-value` holds the raw number whenever the cell text is formatted" (`SPEC.md`
  line 303; checklist item 6, line 483).
- **Pages:** the sample's team table (Table 1) has two percentage columns with no `data-value`, ten
  cells in all; for example line 308: `<td class="num strong">87.4%</td><td class="num">85.2%</td>`.
  The gallery's table demo has one such column (lines 400 to 402: 94.6%, 87.4%, 82.6%). The other
  formatted cells in both tables carry `data-value`.
- **Now:** the table values check fails on both pages.
- **Question:** should these cells gain `data-value`, or does a percentage not count as formatted?

## 12. Footnote 3 in the sample

- **Spec:** footnotes link both ways: the reference carries `id="fnref-N"` and the note ends with a
  back link (`SPEC.md` line 345; checklist item 11, line 488).
- **Page:** the reference in the team table caption has no id (sample line 317), and note 3 has no
  back link (line 491). Notes 1 and 2 link both ways (lines 205, 489 and 490).
- **Now:** the footnote check fails on reference 3 and note 3.
- **Question:** should the sample gain the missing id and back link?

## 13. Figure 5 point label

- **Spec:** text is black or white with no lowered opacity (`SPEC.md` line 25); chart text colours
  are applied automatically (line 403).
- **Page and code:** Figure 5 in the gallery labels one scatter point "Billing" through a per-point
  `label` (line 711). `cm-report.js` themes series labels only (line 114), so this label renders in
  the ECharts default: fill #333333 at opacity 0.8, in all three modes.
- **Now:** the text colour check fails on that label.
- **Question:** should `cm-report.js` theme per-point labels too, or should the figure label the
  point another way?
