# Print and phone

- **Date:** 2026-10-31
- **Source:** the blind visual pass of the 2.0 release candidate in light, dark, a 390px phone width
  and A4 print, through the orchestrating session's brief; choices taken by the session under the
  delegation in record 075
- **Status:** in force

---

## Rules

| Rule | Spec | Check |
| --- | --- | --- |
| A table, a code block or a diagram that scrolls sideways shows the cue "Scroll sideways →" above its content, in the label style. A box that fits shows none, and no cue prints | §5, §8.11, §8.17, §8.20 | `scroll-cue`, failure, phone pass included |
| No chart text covers another, and no text sits on a reference line | §9 | `chart-label-clear`, failure, phone pass included |
| A bar's value label that would sit on a reference line moves inside the bar's end. On a bar too short to hold it, the label moves 6px past the line | §9 | `chart-label-clear` |
| A y-axis title that would meet the label at the top of a vertical reference line rises one label row, 22px | §9 | `chart-label-clear` |
| In a guide's Steps the procedure comes first. A diagram of the steps follows it, and each message or node that shows a step carries that step's number, `step` | §7.3, §8.20 | `guide-step-diagram`, failure; `sequence-json` and `diagram-json` read the field |
| Printed pages carry "Page N of M" in the bottom margin | §12 | None; `npm run print` reports it |
| Headings, kickers and labels keep with what follows. A section lede keeps with its first block and does not split. The footer keeps with the page before it | §12 | None; `npm run print` reports what ends a page |
| A figure with a data table or a text version may break before it; its title, drawing and caption stay together | §8.10, §12 | None |
| A figure whose drawing prints taller than 500px does not hold a section lede back | §12 | None |
| A card of findings or actions and a definition block break between items, and stay whole at three findings, two actions or three terms | §12 | None |
| A printed table repeats its header row, prints its total row once at the end, and never breaks after its first row | §8.11, §12 | None |
| Sort arrows and footnote back-links do not print; a sort button prints as its plain label, so a repeated header row names every column | §8.11, §12 | None |
| Screen-only text sits in `.cm-noprint`; an instruction to use a control of the page does not print | §8.11, §12 | `print-screen-only`, failure |

`checks/test.mjs` holds a copy of the sample report whose sort instruction sits outside
`.cm-noprint`; it fails `print-screen-only` and no other check. The 1.2 sample report prints that
instruction, so section 15's migration lists the repair as item 10. No 1.2 page fails the other new
checks: the kit draws the cue, moves the labels and raises the title itself.

## Calls

| Decision | Reason |
| --- | --- |
| Page numbers read "Page N of M", at the bottom right, in the label style, with its values written out in the `@page` rule | Chromium 141, the tools' build, draws `@page` margin boxes. Print is always light, so the page rule needs no theme token |
| One cue for all three kinds of box, drawn by `::before` on the box, above the content so the reader meets it before the cut-off, from `data-cm-scroll`, which the script sets from the box's width | The page's markup, text versions and checks see no new element. A pseudo-element with empty alternative text keeps screen readers off it. Rule 11 rules out a fade or shadow |
| The cue stays in view with `position: sticky` | A reader who scrolls the box still sees it |
| A value label moves inside its bar whenever the bar holds it with 4px to spare, and past the line otherwise | Inside, the number stays on its own bar and clear of the line; past the line is the only room left on a short bar |
| The y-axis title rises only where the drawn texts overlap across, with 10px of air | Every other chart keeps its padding, so no chart that was clear changes |
| `step` is a whole number, drawn zero-padded before the label as `03 · Records the charge`; the text version adds "Procedure step 3" | The procedure numbers its steps `01` to `09`, so the drawing and the list read alike. The flow text version already uses "step" for its own numbering |
| The message that starts the task carries no number; the guide's messages carry steps 4 to 7 | Record 095 orders the steps; steps 1 to 3 send no message on a ticket that escalates, as the figure's note says |
| Figures may break before their data table or text version | Whole figures with their tables ran past half a page and left the largest gaps |
| Short, for a card or definition block, is counted: three findings, two actions, three terms | CSS cannot measure height; these counts stay under about half a printed page |
| A figure is tall when its drawing prints over 500px, half the 1001px page body, measured from the drawing's own print size | A section head, a lede and such a figure exceed one page, and Chromium then splits the drawing. The window's width does not change the measure |
| A lede does not split | Chromium otherwise leaves one line on each page, since it breaks an avoid before it breaks orphans and widows |
| Section bodies, stacks, disclosure bodies and `cm-print-stack` grids lay out as blocks in print | Chromium breaks block flow where the keeps allow; a flex or grid container kept whole blocks together |
| Screen-only text uses the existing `.cm-noprint` class | No new component |
| `print-screen-only` looks for select, click, tap or press with one of the page's controls | A guide's steps tell an agent to select things in a helpdesk; those print |
| The print measure is `npm run print`, not a page check | It needs PyMuPDF, and its numbers move with fonts and the Chromium build |
| The reference's lineage and flow diagram are left as record 095 set them | Record 095 runs the lineage from `tickets_fact` to the median query, as the diagram does |

## Measured print

A4, printed backgrounds, the kit's own margins, measured with PyMuPDF on 2026-10-31: main at
a5fcee5 against this change. A page counts as less than half used when its lowest text, rule or fill
sits above the middle of its body.

| Page | Pages | Less than half used | Near-empty last page | Labels in the bottom tenth | Label or lede ending a page |
| --- | --- | --- | --- | --- | --- |
| Sample report | 20 → 20 | p6 30% → p6 49%, p18 43% | p20 7% → none | 0 → 0 | 4 → 0 |
| Guide, billing escalation | 8 → 9 | p2 34% → p4 45% | none | 0 → 0 | 3 → 0 |
| Reference, first response time | 10 → 10 | p3 24% → none | p10 2% → none | 3 → 0 | 4 → 0 |
| Guide, first response basics | 7 → 7 | none | p7 7% → none | 0 → 0 | 1 → 0 |
| Index | 3 → 3 | none | none | 0 → 0 | 0 → 0 |
| Reference, APAC weekend coverage | 7 → 7 | none | none | 0 → 0 | 2 → 0 |
| Reference, service levels | 5 → 6 | none | none | 0 → 0 | 1 → 0 |
| Reference, support glossary | 6 → 6 | none | none | 0 → 0 | 1 → 0 |
| Reference, quality pillars | 6 → 7 | none | none | 1 → 0 | 3 → 0 |
| Reference, ticket escalation | 7 → 7 | p2 46% → p2 46% | none | 0 → 0 | 1 → 1 |
| Report, APAC weekend pilot | 12 → 13 | p2 49% → none | none | 1 → 0 | 2 → 0 |
| Report, email routing roadmap | 8 → 9 | none | none | 1 → 0 | 2 → 0 |
| Gallery | 68 → 64 | p58 9%, p62 14%, p64 28% → p60 38% | none | 8 → 4 | 6 → 0 |
| All 13 pages | 167 → 168 | 8 → 5 | 3 → 0 | 14 → 4 | 30 → 1 |

Every page carries its numbers after the change and none before. The gallery's four labels in the
bottom tenth each have their block after them on the same page. The one lede that ends a page is the
ticket escalation reference's Flow lede, ahead of a diagram that prints 720px tall.

## Left for 2.1

- A whole drawing or code block can still leave part of a page empty: the guide's p4 before its
  diagram, the sample report's p6 before Figure 3 and p18 before its query, the gallery's p60.
- Keeps add a page to five documents.
- A value label past the line can read as a value beyond it on a short bar at phone width.
- The reference's flow diagram names its source "Helpdesk", and its lineage "Helpdesk API".
