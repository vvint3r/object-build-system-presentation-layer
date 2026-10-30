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

## Focus on one mark

- **Ruling:** a picked-out mark keeps the default colour, and the rest of its series takes
  `$context` (record 069).
- **Gallery:** the scatter demo (6.5) picks out one point in `$c1` and keeps the other four in `$c2`,
  black. Its description says "the rest stay `$c2`".
- **Now:** under the ruling, the four points turn grey. `$context` measures 1.41:1 in light and 2.02:1
  in dark against the figure surface, and the context-mark rule would then ask for a value label on
  each of them.
- **Question:** does the ruling apply to the scatter, so its other points turn grey, or does it cover
  bars and lines only, so the scatter keeps its black points?

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
