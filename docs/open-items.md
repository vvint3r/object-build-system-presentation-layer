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

## 4. Code syntax colours

- **Spec:** text is black or white (`SPEC.md` line 25). The code token spans `k`, `s`, `n`, `f` and
  `c` are listed with no colours (line 376).
- **Code:** `cm-report.css` colours three of them: keyword #6a3ea1, string #0e7a5f and number
  #a3441a in light and print (line 34); #c3a6f5, #5fe0bb and #ffab7a in dark (line 56); applied at
  lines 414 to 416.
- **Now:** the text colour check fails on every keyword, string and number span, in all three modes.
- **Question:** are syntax colours an exception to black or white text (the spec then says so), or
  should code tokens be ranked by weight only?

## 5. Weight 600

- **Spec:** the weight scale is 300, 400, 700, 800 and 900 (`SPEC.md` line 25). The type table sets
  code in JetBrains Mono 600 (line 86).
- **Code:** `cm-report.css`: `code` 600 (line 75), `.cm-code__file` 600 (line 411), callable spans
  `.f` 600 (line 417). `cm-report.js`: chart axis labels 600 (line 62).
- **Now:** the font weight check fails on inline code, file names, callables and every chart axis
  label, in all three modes.
- **Question:** is 600 a code weight (the scale then lists it), and should chart axis labels move to
  a weight on the scale?

## 6. 2px corners

- **Spec:** "No corners outside the radius set: 4 chip/tag, 6 code chip, 8 input/slot, 12
  table/tile, 14 card, 999 pill." (`SPEC.md` line 31). The checks also accept square corners.
- **Code:** `cm-report.css` rounds five thin bars to 2px: the meter fill (line 211), the
  property-sheet divider (line 258), the ends of the recommended-column bar (lines 325 and 326) and
  the table row flag (line 328).
- **Now:** the radius check fails on the row flags in the sample, and on the meter, property sheet,
  row flags and recommended column in the gallery, in all three modes.
- **Question:** should 2px join the radius set for thin bars, or should these bars be square?

## 7. Dashed timeline rail

- **Spec:** a planned timeline item has a "dashed marker and rail" (`SPEC.md` line 322). Rule 11
  forbids gradients (line 32).
- **Code:** `cm-report.css` draws the dashed rail with `repeating-linear-gradient` (line 355).
- **Now:** the gradient check fails on each planned item, in all three modes.
- **Question:** is a gradient that draws a dashed line allowed (the rule then names it), or should the
  rail be drawn another way?

## 8. Numbers at 12px

- **Spec:** Nunito is never below 13px for running text; the 10px floor covers labels, chips, tags,
  deltas, role tags and table sort arrows (`SPEC.md` line 88). Record 056 lists the label classes.
- **Code:** `cm-report.css`: contents rail numbers `.cm-toc a .n` at 12px, weight 800 (line 119);
  process step numbers `.cm-step__n` at 12px, weight 800 (line 371).
- **Now:** the type size check fails on both (the rail is hidden in print).
- **Question:** are these numbers labels (10px, 800, caps, +0.08em), or running text (13px)?

## 9. Breadcrumb weights

- **Spec:** record 056 puts `.cm-crumbs` in the label tier: 10px, weight 800, caps, +0.08em
  (`SPEC.md` line 84).
- **Code:** `cm-report.css`: crumb links at weight 700 (line 125), the current page at 900 (line 126),
  the separator at 300 (line 127). Size, case and tracking match the tier.
- **Now:** the label type check fails on each link, separator and current page, in all three modes.
- **Question:** should the breadcrumb keep three weights (the label tier then notes it), or use 800
  throughout?

## 10. Verdict chip text in dark mode

- **Spec:** text is black or white (`SPEC.md` line 25). The verdict chip is "solid ink with a crit
  offset" (line 380).
- **Code:** `.cm-chip--verdict` sets the text to the paper colour on an ink fill (`cm-report.css`
  line 181). Dark paper is #0d0d0d, so in dark mode the chip text is #0d0d0d, not black.
- **Now:** the text colour check fails on the verdict chip in dark mode only, on both pages.
- **Question:** should the paper colour count as black text on a solid ink fill, or should the
  verdict text be black in dark mode?

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
