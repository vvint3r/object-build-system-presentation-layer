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

## Context marks

- **Spec:** `$context` is for comparison and background series (`SPEC.md` line 67) and greys the
  series beyond the fourth (line 426).
- **Code:** `$context` is #d9d9d9 in light and #4a4a4a in dark. Against the figure surface that is
  1.41:1 in light and 2.02:1 in dark.
- **Now:** a context mark without a value label is hard to read. WCAG 2.2 success criterion 1.4.11
  asks 3:1 for the parts of a graphic a reader needs. No rule requires a label on a context mark.
- **Question:** should a context mark the reader has to read carry a direct value label, or should
  `$context` darken to reach 3:1?

## Chart text starting with a dollar sign

- **Spec:** "any string value beginning with `$` is replaced with the current theme's token"
  (`SPEC.md` line 421).
- **Code:** `cm-report.js` line 45 replaces such a string only when the rest names a token or a
  `--cm-` variable. Any other string, such as the label "$50", stays as written.
- **Now:** currency labels in chart settings render because of that fallback, which the spec does not
  state. A label that matches a variable name, such as "$s1", renders the variable's value instead.
- **Question:** should the spec say that a `$` string is a token only when the rest names a token,
  and is text otherwise, or should currency in chart settings be written another way?

## Focus on one mark

- **Spec:** one series takes the default `$c1`, which is the accent (`SPEC.md` lines 66 and 424). The
  accent also marks a focal series (line 63), and `$context` greys comparison series (line 67).
- **Now:** in a one-series chart the accent means both "the only series" and "the one to look at".
  The spec has no rule for picking out one mark within a series.
- **Question:** should the spec say that a picked-out mark keeps the default colour while the rest of
  its series take `$context`, or should focus have a colour of its own?

## Page opened at a fragment address

- **Spec:** a link within the page stops its target 24px below the sticky top bar (`SPEC.md` §5).
- **Code:** scrolling is smooth (`cm-report.css` line 63). A page opened at an address that ends in
  a fragment, such as `#teams`, scrolls smoothly to its target, and the scroll's end point is fixed
  when it starts.
- **Now:** on the sample report from 390 to 820px wide, Nunito arrives during that scroll and the
  page grows shorter, so the scroll ends past its target. Opened at `#teams`, the section's top
  ends 437.5px above the bar's bottom edge at 390px and 91.2px above it at 820px. At 1440px, and at
  every width under reduced motion, where the scroll is instant, targets stop 24px below the bar.
  Links followed within the page are not affected.
- **Question:** should the script return to the fragment's target once the fonts have loaded, when
  the reader has not scrolled, or should smooth scrolling start only after the page has loaded, so
  that a page opened at a fragment jumps at once?
