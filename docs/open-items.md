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

## Jump targets under the top bar

- **Spec:** "scroll offsets of 58 and 80px clear the sticky top bar" (`SPEC.md` line 96).
- **Code:** the top bar is sticky (`cm-report.css` line 106). Sections get the 58px offset (line 136)
  and notes the 80px one (line 389). Footnote markers in the text (`a.cm-fn`), table titles, figures
  and disclosures get none.
- **Now:** on the sample report, every footnote's back link puts its marker under the top bar, at
  1440px and at 390px. At 570px wide and below the bar wraps to 94 to 124px, so notes stopping at
  80px are hidden too. The kit pages link no table, figure or disclosure.
- **Question:** should every linked target clear the top bar by an offset that follows the bar's
  height, or should the bar keep to one row at every width, with the fixed offsets extended to the
  targets that lack one?

## Contents strip on narrow screens

- **Spec:** "scroll offsets of 58 and 80px clear the sticky top bar" (`SPEC.md` line 96).
- **Code:** at 1150px wide and below, the contents rail becomes a wrapping strip of links above the
  first section (`cm-report.css` lines 427 to 435). The current section's link turns bold (line
  120), which widens it.
- **Now:** on the sample report, the strip's height depends on the bold link at 370, 460, 480 and
  820px (4 of 84 widths, 320 to 1150px), by 34px. A jump that changes the current section
  moves the page below the strip: at 480px, footnotes 1 and 2 stop at 45.3px, not 80px. The current
  link's background is 1.13:1 against the page in light, 1.28:1 in dark.
- **Question:** should the current link keep normal weight in the narrow strip and gain a cue that
  leaves its width unchanged, or keep the bold and reserve each link's bold width?

## Focus on one mark

- **Spec:** one series takes the default `$c1`, which is the accent (`SPEC.md` lines 66 and 424). The
  accent also marks a focal series (line 63), and `$context` greys comparison series (line 67).
- **Now:** in a one-series chart the accent means both "the only series" and "the one to look at".
  The spec has no rule for picking out one mark within a series.
- **Question:** should the spec say that a picked-out mark keeps the default colour while the rest of
  its series take `$context`, or should focus have a colour of its own?
