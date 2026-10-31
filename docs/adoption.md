# Adoption backlog

Report Kit 1.2 is the kit in force. The original 35-page content-morphia library is the reference: it
holds more components, page types and diagram families than the kit, and they are adopted into the kit
over time. This file maps the library against the kit and records what is left to adopt.

**How to adopt a feature**

1. Read the library page and its decision record (columns below) to learn what the feature does and why.
2. Rebuild it in the kit's terms: classes in `cm-report.css`, behaviour in `cm-report.js`, canonical
   markup and rules in `SPEC.md`, a live example in the gallery page. The library's inline-style markup
   is never copied.
3. Where the library and the kit disagree on a value, the kit wins. If the feature needs a value the
   kit does not have, add an item to `docs/open-items.md`.
4. Update this table in the same change.

**Status:** *Covered*, the kit does this. *Partial*, the kit has part of it. *Not in kit*, nothing yet.
Decision record numbers refer to `docs/decisions/`.

---

## Map

| Library area | Library page | Kit today | Status | What is left to adopt | Decision records |
| --- | --- | --- | --- | --- | --- |
| Tokens: colour, type, depth, radius | Foundations | Tokens in `cm-report.css`, light and dark | Covered | Nothing; kit values win | 000, 053 |
| Inputs and fields | Foundations | Buttons only | Not in kit | Text, select and search fields, filter chips, error and disabled states | 006 |
| Icons | Icons | Glyphs drawn in CSS for callouts, definitions and questions | Partial | The 24px icon family and its closed register. The kit forbids icons beyond its own glyphs, so this needs a ruling first | 041, 042 |
| Print | Print | Print and PDF rules | Covered | Print states for each visualization type | 030 |
| Non-visual equivalents | Equivalents | Chart `aria-label` and data-table fallback; summary and text version for flow, sequence, state and entity relationship diagrams, written from the diagram's data | Partial | Equivalents for the other diagram modes and other non-chart visuals | 031, 032, 077, 084 |
| Structured components | Structured | Process diagram, timeline, KPI strip, recommended table column; workflow, framework, model, method, requirement, evaluation and metric detail | Covered | Nothing. Kept out by design: the roadmap board, a page type; comparison cards, which the comparison table covers; the swimlane view, which the flow diagram draws; the vertical stepper and the compact step summary; difficulty dots; the confidence chip (record 079); met or unmet marks on acceptance criteria; a metric's current value, progress to target and breakdown by source, which go in the KPI strip, the status block or a chart. The learning module stays with the Learning row | 000, 047, 082 |
| Prose primitives | Prose | Highlights, key-term underline, pull quote, lists | Partial | The remaining prose primitives | 034 |
| Wayfinding | Wayfinding | Contents rail; related list (`cm-related`); breadcrumb from set to area to document; generated index page by area | Covered | Nothing in the kit's scope. Search, faceted browse, ranked entry and the version selector with diff need a server and are left out (records 076, 083) | 027, 076, 078, 083 |
| Provenance | Provenance | Footnotes, source register, citations that link both ways, evidence dates, disagreement block, caption source line; a closed set of source date words; omission comments for an unrecorded publisher or locator, and a note for a number without a source | Covered | The aggregation header, agreement and spread, and the confidence qualifier, once an acceptance document uses them (record 079) | 027, 079, 090 |
| Charts | Charts | ECharts method and recipes by question; bar, line, area, stacked bar, donut, scatter and heatmap, plus bullet, slope, strip, box, interval band and error bars; value labels with separators at the chart's precision; light, dark and print | Covered | The library's empty-state conditions for charts | 028, 081, 090 |
| Interaction | Interaction | Sortable tables, collapsible appendix | Partial | Filtering, overview and detail, definitions in place, recently viewed | 028 |
| Learning | Learning | Nothing | Not in kit | Objectives, knowledge checks, comprehension summary, learning cycle, model | 028 |
| Questions | Questions | Questions block | Partial | FAQ list ordered by frequency, said-and-actual corrections, confusion table | 038 |
| Change and status | Change | Dated status block, change log, revision history, limitation register, correction and limitation callouts, document status chips | Covered | The six node states and the notice each one obliges, outside round 2's scope. The per-node diff stays out with the version selector (record 076) | 039, 079 |
| Diagrams | Diagrams, Diagrams at Scale, Diagrams II, III, IV | Process diagram; flow diagram for process and decision flows, swimlanes, journey maps and system and data flows; sequence, state and entity relationship diagrams; layer stack; hierarchy; each with its capacity ceilings | Partial | The other families (deployment, service blueprint, Sankey, mind map, sets, cause and effect, process notation, decision tree and others), their capacity ceilings and the level model | 010–014, 077, 084, 085 |
| Diagram build logic | Visualization kit (`import/kx-visualizations-index/`) | Flow mode: grid placement, five node types, three edge kinds, right-angle routing with rounded elbows, labels in line with their edges, lanes and boundaries. Sequence mode: lifelines, ordered messages, activation bars. State mode on the flow grid: start and end markers, self-transition loops. Entity relationship mode on the flow grid: attribute lists, plain lines, a count at each end. Layer stack mode on the flow grid: layers as bands, dependencies running down. Hierarchy mode: the ECharts tree layout, drawn in kit boxes and lines | Partial | The node types, connectors and routing of the other diagram modes | 077, 084, 085; see `scraps/4c-brief.md` |
| Page types | Templates, T1 to T11 | Three document kinds (report, guide, reference), each with its template, anatomy check and sample document | Partial | Topic, framework, process, guide, module, metric, comparison, roadmap, reference, glossary and case study as templates on the three kinds | 037, 040, 076, 078 |
| Composition rules | Composition, Anatomy, Selection, Implementing, Exemplar | Report anatomy and the pre-publish checklist | Partial | Layout primitives, the component anatomy register and field contract, the selection matrix, implementer guidance, a reference build | 023–026, 028 |
| Multi-page navigation | Every page (menu bar) | Document ids and file-name addresses; a breadcrumb and wordmark that link to the set's index page; `npm run index` writes the index; `npm run links` checks every link across a folder | Covered | Nothing in the kit's scope. The library's fixed menu with a list of pages for each group gives way to the index page and breadcrumb; search, faceted browse and the version selector with diff need a server and are left out (record 083) | 046, 083 |

The kit's own spec lists its gaps as maps, diagram modes other than flow, sequence, state and entity
relationship, network diagrams, interactive filters and a PDF cover page. All but maps and the cover
page appear in the table above.

## Order

Set by the owner on 30 Oct 2026 (record 069), from the library's product context: a deep knowledge
index where provenance and freshness carry weight. Items 2 to 5 are step 8 of `docs/plan.md`.

1. **Diagrams, charts and visualizations.** Not adopted from the library: they get a build of their
   own in migration step 6 (`docs/plan.md`), from the owner's reference set. The Diagrams, Charts and
   Diagram build logic rows above are references for it. The flow mode is built (record 077), and the
   sequence, state and entity relationship modes (record 084).
2. **Provenance.** Core to a knowledge index. Covered (record 079).
3. **Change and status.** Covered (record 079); the node states remain.
4. **Wayfinding and multi-page navigation.** Needed once there is more than one document. Covered
   (record 083).
5. **Structured components, then page types.** Each page type is a composition of the components
   above, so they come after.
6. **Learning, inputs and icons**, and the rows not named above, as the content calls for them,
   outside the plan.
