# Type floor, phone width and diagram fit

- **Date:** 2026-10-30
- **Source:** the orchestrating session's brief for three kit-wide repairs: an 11px type floor, checks
  at a 390px phone width, and friction items 38 to 40 from the design-bundle round trip (record 090);
  choices taken by the session under the delegation in record 075
- **Status:** in force

---

## Rules

| Rule | Spec | Check |
| --- | --- | --- |
| No text under 11px, measured as drawn after every scale, on screen and on paper; footnote markers and screen-reader text are exempt | §4 | `type-floor`, failure, every mode and the phone pass |
| Labels, chips, tags, deltas, table heads and role tags at 11px; the label tier at 800, capitals, +0.06em | §4 | `label-type`, failure |
| Running text never under 13px | §4 | `type-size`, failure (existing) |
| At 390px the page never scrolls sideways; only a table, a code block or a diagram scrolls, inside its own box | §5 | `page-width`, failure, every mode and the phone pass |
| No text runs out of its box or is cut off by a box that clips | §5 | `text-clip`, failure, every mode and the phone pass |
| Below 640px a chip, tag or delta wraps its words inside the outline | §8.18 | `page-width` and `text-clip`, phone pass |
| A tag is a 20px box, as tall as a chip | §4 | `type-floor` |
| Tables print with 12px gutters and heads that wrap | §8.11, §12 | `page-width`, print |
| A screen diagram wider than its box takes the narrow layout, then scales to the box down to 80%; past that it scrolls in its box | §8.20 | `diagram-layout`, failure, at 1440px and in the phone pass |
| Diagram text in a scaled drawing is set larger by the inverse of the scale, up to 125% | §8.20, §12 | `type-floor`; `label-type` within 2% as drawn |
| The printed column is 638px | §8.20, §12 | `diagram-layout`, print |
| A node widens to hold its emphasis chip | §8.20 | `text-clip` |
| `col` counts across and `row` down in either direction; more edges move forward than back | §8.20 | `diagram-direction`, failure |
| Every step and decision has an edge out; a terminal has edges in or out, not both | §8.20 | `diagram-ends`, failure |
| A labelled gap counts as a column against the flow's ceiling | §8.20 | None; the print check fails a diagram that does not fit |

The phone pass loads each page 390px wide in the light theme. It runs only the checks marked for it:
`type-floor`, `page-width`, `text-clip` and `diagram-layout`. Its lines carry the mode `phone`.

## Measured values

Print is measured on a real A4 page: 16 by 14mm margins leave a 688px column and a 1001px page body.
A figure's box inside that column is 638px: 688px less 24px of padding and 1px of border on each side.

| Value | Measure | Reason |
| --- | --- | --- |
| 11px | Type floor | The brief's floor; sup and sub markers and screen-reader text are its only exceptions |
| +0.06em | Label tracking at 11px | Eight kit labels run 7.1% wider than at 10px and +0.08em; +0.08em at 11px runs 10.2% wider |
| 20px | Tag height | At 18px, 11px capitals fill the box; 20px is the chip's height, already in the kit |
| 638px | Printed column for a diagram | The figure box on A4; the 632px in record 077 left 6px unused |
| 125% | Largest text factor in a diagram | The inverse of the 80% floor, so text at the floor prints at its own size |
| 12px | Table gutter in print | With heads that wrap, the sample report's team table prints 670px wide in a 686px box; at 16px it runs to 703px |

A screen diagram scales only when the narrow layout is still wider than its box. Box widths at the
desktop windows the brief names:

| Window | Box |
| --- | --- |
| 1440px | 996px |
| 1200px | 792px |
| 1151px | 743px, the narrowest, just above the 1150px rail break |
| 1000px | 872px |

A diagram within its capacity draws at most 797px wide in the narrow layout, so it fits every desktop
box at 93% or more. The five-column legal flow of item 38 fits at all four windows. It fails print,
needing 699px at 80%, so it is split as the capacity rule says.

## Capacity

Each row is one fixture printed at the A4 column: 24-character labels, 40-character detail lines and
three-word edge labels unless the row says otherwise. "Over" means the fixture needs less than 80%.

| Fixture | 10px labels, 632px column | 11px floor, 638px column |
| --- | --- | --- |
| Flow, 5 columns | 81% | 82% |
| Flow, 6 columns | Over | Over |
| Flow, 4 columns with lanes | 85% | 88% |
| Flow, 5 columns with lanes | Over | Over |
| Flow, 4 rows with detail lines | 98% | 98% |
| Flow, 5 rows with detail lines | Over, 742px tall | Over, 763px tall |
| Flow, 6 rows without detail lines | 100% | 100% |
| Flow, 4 columns, one labelled gap | 83% | 80% |
| Flow, 4 columns, one one-word labelled gap | 89% | 89% |
| Flow, 3 columns, two labelled gaps | 84% | Over |
| State, 4 columns | 86% | 81% |
| State, 5 columns | Over | Over |
| Sequence, 4 participants, messages of 20 characters | 93% | Over |
| Sequence, 4 participants, messages of 15 characters | 100% | 100% |
| Sequence, 5 participants of 9 to 12 characters, two-word messages | 84% | 84% |
| Entity relationship, 2 columns by 3 rows | 93% | 90% |
| Entity relationship, 3 columns or 4 rows | Over | Over |
| Journey map, 5 steps | 81% | 82% |
| Journey map, 6 steps | Over | Over |
| Layer stack, 5 layers of 4 | 85% | 83% |
| Layer stack, 4 layers of 5 | Over | Over |
| Layer stack, 4 layers of 4 with detail lines | 80%, 720px tall | Over, 736px tall |
| Hierarchy, 5 levels | 81% | 82% |

No ceiling in records 077, 084 and 085 changes. Three reasons in the spec move: four sequence
participants now need messages of about 15 characters, a labelled gap counts as a column, and four
layers with detail lines no longer fit a page. Five rows with detail lines did not fit a page at 10px
either; the spec's reason now says so.

The hierarchy's 12-leaf ceiling fits a page in no grouping measured, at either size. Ten leaves in one
group print at 86%; nine leaves in three groups, and eight in four, run past a page at 80%. Its reason
in the spec is unchanged.

Kit diagrams at print, after two node moves:

| Page | Diagram | Scale | Text factor |
| --- | --- | --- | --- |
| Gallery | Process flow | 81% | 1.23 |
| Gallery | Swimlane | 89% | 1.12 |
| Gallery | State | 80% | 1.25 |
| Gallery | Journey map | 82% | 1.22 |
| Gallery | Hierarchy | 86% | 1.17 |
| Gallery | Sequence, entity relationship, system and data flow, layer stack | 100% | 1 |
| Sample report | Chat routing | 87% | 1.16 |
| Reference: first response time | System and data flow | 86% | 1.18 |
| Guide: billing escalation | Sequence | 100% | 1 |

## Calls

- **One tracking for the tier.** Every label-tier class takes +0.06em, chips included. The tier stays
  one closed style, and its labels grow 7% rather than 10%.
- **Chips join the label tier.** Chips were the only 9px text. At 11px they share the label style, so
  the type table lists them in the Label row, without a row of their own.
- **Text set larger, not the floor raised.** A scaled diagram sets its text larger by the inverse of
  its scale. The 80% floor and every ceiling stay; no kit diagram splits.
- **The column measured.** The printed column is the 638px figure box. At 632px, three kit diagrams
  went past the column once their text was set larger.
- **Two node moves.** The gallery's system and data flow moves Customer to column 2, row 1, and the
  reference moves Quarterly review to column 4, row 1. Both ran past the column with their text set
  larger; one move each keeps every node and edge.
- **Shorter gallery emphasis.** The gallery's process flow names its emphasised step "Slowest". At
  "Bottleneck" the widened node took the flow past the printed column.
- **Narrow layout first on screen.** A diagram too wide for its box reuses the print gaps and nodes,
  then scales as print does. No new spacing value enters the kit.
- **Chips wrap on a phone only.** Below 640px a chip wraps inside its outline; wider, chips stay on
  one line. A chip in a diagram node never wraps, since the diagram scrolls in its own box.
- **Print tables narrow their gutters.** Nothing scrolls on paper, so a table gives up 4px a gutter
  and wraps its heads, rather than overflowing the page.
- **Direction counted, not guessed.** `diagram-direction` fails when as many edges move back as
  forward. A majority rule failed the gallery's system flow and swimlane, which move across as often
  as forward.
- **Ends with two exceptions.** `diagram-ends` skips a journey map, whose columns read as time, and
  lets a system and data flow end at a store or an external entity.
- **Labelled gaps as guidance.** The reference's flow has four columns and two labelled gaps and
  prints at 86%, so a hard count would fail a diagram that fits. The print check stays the test.
- **Phone pass in light only.** Width and clipping do not change with the theme, so the pass runs
  once, at 390 by 844px.
