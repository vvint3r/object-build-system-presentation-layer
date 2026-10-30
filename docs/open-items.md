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

## Concept terms and links

- **Spec:** `cm-concept` "underlines a key term at first use" (`SPEC.md` line 243).
- **Code:** a link is underlined in accent, 1.5px thick and 3px below the text, at the weight around
  it (`cm-report.css` line 70). A concept is bold and underlined in accent, 2px thick and 4px below
  (line 275).
- **Now:** a concept reads as a bold link. A link inside bold text differs from a concept by half a
  pixel of underline thickness and 1px of offset.
- **Question:** should concepts take a treatment that links never use, or should both stay as they
  are?

## Context marks

- **Spec:** `$context` is for comparison and background series (`SPEC.md` line 67) and greys the
  series beyond the fourth (line 426).
- **Code:** `$context` is #d9d9d9 in light and #4a4a4a in dark. Against the figure surface that is
  1.41:1 in light and 2.02:1 in dark.
- **Now:** a context mark without a value label is hard to read. WCAG 2.2 success criterion 1.4.11
  asks 3:1 for the parts of a graphic a reader needs. No rule requires a label on a context mark.
- **Question:** should a context mark the reader has to read carry a direct value label, or should
  `$context` darken to reach 3:1?

## Disclosures with more than one block

- **Spec:** "nothing sits closer than 24px to a distinct neighbouring block" (`SPEC.md` line 97). The
  collapsible's markup shows one `cm-collapse__body` (lines 359 to 364) and no rule for several blocks
  in it.
- **Code:** the body gives its children no spacing, and margins are reset (`cm-report.css` lines 65
  and 407). The block-gap check measures section bodies, stacks and grids, not disclosure bodies
  (`checks/judgment.mjs` line 205).
- **Now:** two blocks in a plain disclosure body render 0px apart, and no check warns. Every
  disclosure on the kit pages holds one block. A body that is also a `cm-stack` spaces its blocks
  32px apart and is checked.
- **Question:** should the spec name `cm-collapse__body cm-stack` for a body with several blocks, or
  should the body space its own children, as a section body does?

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
