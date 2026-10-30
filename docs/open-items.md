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

## Bold labels before a colon

- **Spec:** "Text before a colon is bold when it leads a sentence, list item, caption or callout body"
  (`SPEC.md` section 13.2). The caption anatomy is `<b>Source:</b>` then `<b>Note:</b>` (section 9),
  and a list item that leads with a term and a colon bolds the term (section 8.14).
- **Writing rules brief:** "No bold label run into the text that follows it", and a figure caption is
  "a title and one sentence" (`docs/subprojects/writing-rules.md`, "Register and headings" and
  "Limits").
- **Now:** the `bold-colon` check warns when a leading label is not bold, and no check looks for
  run-in labels. Every caption on the kit pages opens with a bold "Source:", and the gallery's lists,
  definitions and callouts lead with bold labels.
- **Question:** should a label before a colon stay bold, or should run-in bold labels go, with
  captions recast as a title and one sentence and labelled terms set as headings or table rows?

## Heading case

- **Spec:** "Sentence case for all headings and labels; CSS uppercases labels" (`SPEC.md` section
  13.3).
- **Owner's heading examples:** "Primary Pillars" and "Type Register", in title case
  (`docs/subprojects/writing-rules.md`, "Owner-level calls").
- **Now:** the `sentence-case` check warns on a heading in title case. Every heading on the kit pages
  is in sentence case, including the sample report's title, "Customer support operations review, Q3
  2026".
- **Question:** should headings stay in sentence case, or take title case, and if title case, at
  which tiers?

## TL;DR and the section lede

- **Spec:** a section opens with a "TL;DR or lede stating the finding" (`SPEC.md` section 7), and a
  TL;DR is "one or two sentences, 40 words at most" (section 8.1).
- **Writing rules brief:** a section lede is "45 words at most, with its key phrase in bold"
  (`docs/subprojects/writing-rules.md`, "Limits").
- **Now:** the `section-lede` check holds the paragraph that opens a section body to 45 words with a
  bold key phrase. In a section with a TL;DR, the TL;DR stands in the lede's place under its own 40
  words (`tldr-length`), with no bold key phrase beyond its "TL;DR:" label.
- **Question:** does a TL;DR count as the section's lede, taking 45 words and a bold key phrase, or
  keep its own limit?

## Bold claim sentences

- **Spec:** a key finding opens with its claim, a full sentence, in `<strong>` (`SPEC.md` section 8.3),
  and a recommended action opens with an imperative sentence in `<strong>` (section 8.19).
- **Writing rules brief:** bold is "never a whole sentence" (`docs/subprojects/writing-rules.md`,
  "Register and headings").
- **Now:** the `bold-phrases` check fails a whole sentence in bold anywhere except the claim that
  opens a key finding or a recommended action, which section 13.2 names as the one bold sentence.
- **Question:** should findings and actions keep a bold claim sentence, or bold only the key phrase
  inside it?
