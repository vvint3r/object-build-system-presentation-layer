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

## Version

The kit stays at 1.1 until the twelve answers are in the kit and every kit page passes the checks
(record 069).
