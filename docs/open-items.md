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

## Top bar height on narrow screens

- **Spec:** "scroll offsets of 58 and 80px clear the sticky top bar" (`SPEC.md` line 96).
- **Code:** the top bar is sticky (`cm-report.css` line 106). A followed footnote link stops the note
  80px below the top of the window (line 389), a section link stops the section 58px below (line 136).
- **Now:** at 570px wide and below, the top bar wraps onto more rows and is 94 to 124px tall. On the
  sample report at 390px, all three footnotes stop at 80px under a bar that ends at 94.4px, so the
  first line of each is hidden. Section headings stay clear, below the section's 128px top padding.
- **Question:** should the jump offsets follow the top bar's height on narrow screens, or should the
  top bar keep to one row at every width?

## Contents strip on narrow screens

- **Spec:** "scroll offsets of 58 and 80px clear the sticky top bar" (`SPEC.md` line 96).
- **Code:** at 1150px wide and below, the contents rail becomes a wrapping strip of links above the
  first section (`cm-report.css` lines 427 to 435). The link to the section in view turns bold
  (line 120), which widens it.
- **Now:** on the sample report, the strip's height depends on which link is bold at 4 of 84 widths
  tested (320 to 1150px, every 10px): 370, 460, 480 and 820px, by 34px. A jump that changes
  the section in view adds or removes a row, and the page below the strip moves. At 480px, footnotes
  1 and 2 stop at 45.3px instead of 80px.
- **Question:** should the link to the section in view keep normal weight in the narrow strip, shown
  by its background alone, or keep the bold and reserve each link's bold width?

## Category axis titles

- **Spec:** axis-title placement and plot top and bottom padding are applied automatically and never
  set by hand (`SPEC.md` line 405). A title is required on the value axis (line 415); the spec says
  nothing either way about a title on a category axis.
- **Code:** `cm-report.js` places a y-axis title above the plot, and reserves 26px for it, only when
  the axis is a value axis (lines 97 and 101). A category y-axis title keeps the ECharts default
  position.
- **Now:** a horizontal bar chart with `"yAxis": {"type": "category", "name": "Channel"}` draws the
  word 5.6px above the top of the chart, so its top is cut off. No kit page names a category axis,
  so no check fails.
- **Question:** should the chart script place and make room for a category y-axis title as it does
  for a value axis, or should the spec say that only value axes carry titles?

## Plot padding set by hand

- **Spec:** plot top and bottom padding are applied automatically: "do not set these" (`SPEC.md`
  line 405).
- **Pages:** the sample report sets `grid.top` on three charts (lines 169, 217 and 345) and
  `grid.bottom` on one (line 169). The gallery sets `grid.top` on two (lines 639 and 759) and
  `grid.bottom` on one (line 759).
- **Code:** `cm-report.js` sets the top padding only when the page has not (line 101), so a value set
  by hand also drops the room the script reserves for a legend and a y-axis title.
- **Now:** no check reads chart padding, so both pages pass.
- **Question:** should the spec allow plot padding set by hand, and say when, or should the pages drop
  it and the chart script compute what those charts need?

## Emphasis demo

- **Spec:** "≤ 3 highlights per paragraph" (`SPEC.md` line 243). Inside a gallery demo, every rule
  holds (`docs/decision-framework.md`, "The kit's own pages follow the kit").
- **Page:** the inline emphasis demo puts all five highlight tones in one paragraph (gallery
  line 384).
- **Now:** no check counts highlights per paragraph, so the page passes.
- **Question:** should the demo spread its five tones over two paragraphs, with a check for the limit
  added, or should the demo be exempt from the limit?
