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

Items answered on 13 Oct 2026 (decision record 055), 16 Oct 2026 (records 058 to 063) and 30 Oct
2026 (records 070 to 073) are no longer listed.

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
