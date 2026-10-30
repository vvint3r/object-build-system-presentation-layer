# Emphasis, key terms and disclosures

- **Date:** 2026-10-30
- **Source:** the owner's approval of the recommended answers, record 069
- **Status:** in force

---

## Rulings

| Item | Ruling | Changed |
| --- | --- | --- |
| Emphasis demo | The gallery's inline emphasis demo splits over two paragraphs so each keeps to three highlights, and a check enforces the limit | Gallery: the demo's first sentence is its own paragraph, with two highlights; the second paragraph holds the other three and the key term. `checks/budgets.mjs`: the `highlights` check fails a paragraph with more than three |
| Concept terms and links | A key term takes a treatment links never use: a dotted underline | `cm-report.css`: `cm-concept` underlines with `dotted`, keeping its 700 weight, accent colour, 2px thickness and 4px offset; links keep their solid underline. `SPEC.md` section 8.8 and the gallery's inline emphasis description name the dotted underline |
| Disclosures with more than one block | A disclosure body spaces its own blocks, and the block-gap check covers it | `cm-report.css`: `cm-collapse__body` lays its children out in a column 32px apart. `SPEC.md` sections 5 and 8.16 state it. `checks/judgment.mjs`: `block-gap` measures disclosure bodies while open, so print, which opens every disclosure, measures them all |

## Calls

- **A key term is not a highlight.** The limit counts the five washes (`cm-hl`) and not the key-term
  mark (`cm-concept`). Section 8.8 of the spec lists the five highlight roles, then the key term
  apart from them, and the five tones of the demo are the five washes.
- **A paragraph is the nearest block that holds the highlight:** a `p`, a list item, a definition
  term or value, a table cell, a caption, or a `div` such as a callout body. Inline wrappers such as
  `strong` do not start a new count.
- **The limit fails a page.** The highlight limit is written like the pull-quote limit in section
  8.9, which the `section-limits` check fails, so the two limits carry the same level.
- **Only the line style changes on a key term.** Its weight, accent colour, thickness and offset
  stay, so the key term changes as little as the answer allows; the dotted line is a style the kit
  already draws in its definition and question rules, property-sheet groups and table totals.
- **Blocks in a disclosure body are 32px apart.** The value is the one `cm-stack` already gives a
  disclosure body with several blocks, and the one a section body takes in print, so a body with
  several blocks looks the same whichever markup an author chose.
- **The body spaces its blocks with a column gap, as a section body does.** A body with one block
  renders as before: on the gallery, the sample report and the template, every disclosure body and
  its block keep their position and size in light, dark and print.
- **A closed disclosure is measured in print only.** The browser still lays out the contents of a
  closed disclosure, so the check skips a body while its disclosure is closed rather than measure
  blocks the reader cannot see.
- **The gallery's disclosure demo stays as it is.** Each of its disclosures holds one block, so the
  spacing has nothing to show there.

## Version

The kit stays at 1.1 until the twelve answers are in the kit and every kit page passes the checks
(record 069).
