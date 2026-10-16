# Gallery as a catalogue

- **Date:** 2026-10-16
- **Source:** the owner's answer to the open item on holding the gallery to report rules, in session
- **Status:** in force

---

## Ruling

The gallery is a catalogue, not a report. The checks skip its helper layer and its report anatomy;
every component it shows is held to the same rules as in a report. The page changes only where a
component breaks one of those rules.

## Exemptions

Kept in `checks/exempt.mjs`, each entry with its reason.

| Region | Exempt from | Reason |
| --- | --- | --- |
| `.g-src` | every check | The markup listing under each demo is source code shown as text. |
| `[data-demo]` | counts and order across a report: one featured card, one summary, emphasis and section budgets, callouts per section, figure and table numbering, where the sources list sits | A demo shows one component on its own, out of report order. |
| `head > style` | stylesheets | The gallery's helper stylesheet lays out the catalogue. |
| `.g-sw` outside `[data-demo]` | every check | Colour swatches are specimens of tokens, not components. |
| The page outside `[data-demo]` | classes, inline styles, block gap, table numbering | The scaffolding around the demos uses helper classes and inline spacing and numbers its own tables by section (Table 2.1). Inside a demo, markup meets every rule, since readers copy it. |
| The whole page | head order, top bar, masthead, summary anatomy, report anatomy, footer, methodology | The gallery has no kit meta, report masthead, summary with KPIs, sources appendix, methodology or report footer, and its top bar links to the sample report. |

## Checks

- An exempt region may name `outside`, a selector whose contents it does not cover.
- An entry for the whole page skips the checks it lists. The run prints `skip` for each of them.
- Callouts are two checks: `callout-variants` (the closed set and the label, held inside demos too)
  and `callouts` (at most two per section and in a row, one "important"), which leaves exempt
  callouts out of each section's count.

## Page

| Place | Change |
| --- | --- |
| Tables 2.1, 4.1 and 6.1 | Source caption and `data-sortable`. The "#" column of Table 4.1 is numeric (`.num`) and marked as the initial sort |
| Recommended-column demo | Its caption names the source |
| Callouts and chips demos | The spacing between specimens is set in the helper stylesheet, so the copyable markup carries no inline style |
| Summary demo | Three findings, the smallest count the spec allows |
| Figure 2 | 280px tall, the smallest height for a full-width chart |

## Alternative not taken

Holding the gallery to report rules would have meant a report masthead, a summary with KPIs, a sources
appendix and a report footer on a page that documents the kit.

## Version

The kit stays at 1.1.
