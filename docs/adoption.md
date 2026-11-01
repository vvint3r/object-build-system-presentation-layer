# Adoption backlog

Report Kit 2.0 is the kit in force. The original 35-page content-morphia library is the reference: it
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

**Status:** *Covered*, the kit does this; what the row leaves out is named, with the record that keeps
it out. *Partial*, the kit has part of it. *Not in kit*, nothing yet.
Decision record numbers refer to `docs/decisions/`.

---

## Map

| Library area | Library page | Kit today | Status | What is left to adopt | Decision records |
| --- | --- | --- | --- | --- | --- |
| Tokens: colour, type, depth, radius | Foundations | Tokens in `cm-report.css`, light and dark; an 11px type floor on screen and in print, and a 390px phone pass in the checks | Covered | Nothing; kit values win | 000, 053, 086 |
| Inputs and fields | Foundations | Buttons only | Not in kit | Text, select and search fields, filter chips, error and disabled states | 006 |
| Icons | Icons | Glyphs drawn in CSS for callouts, definitions and questions | Partial | The 24px icon family and its closed register. The kit forbids icons beyond its own glyphs, so this needs a ruling first | 041, 042 |
| Print | Print | Print and PDF rules (SPEC §12); every chart and diagram prints, diagrams set their text larger as they scale, and tables hold to the printed column | Covered | Nothing for what the kit draws: the checks run every page in print. A diagram family adopted later brings its print rules with it | 030, 086 |
| Non-visual equivalents | Equivalents | A chart's `aria-label` and data table (`details.cm-data`); an image's `alt`; for every diagram mode, a summary and a text version written from the diagram's data: flow (process and decision flows, swimlanes, journey maps, system and data flows), sequence, state, entity relationship, layer stack and hierarchy | Partial | The node register for a canvas too large for a text version (record 031) | 031, 032, 077, 084, 085 |
| Structured components | Structured | Process diagram, timeline, KPI strip, recommended table column; workflow, framework, model, method, requirement, evaluation and metric detail | Covered | Nothing. Kept out by design: the roadmap board, a page type; comparison cards, which the comparison table covers; the swimlane view, which the flow diagram draws; the vertical stepper and the compact step summary; difficulty dots; the confidence chip (record 079); met or unmet marks on acceptance criteria; a metric's current value, progress to target and breakdown by source, which go in the KPI strip, the status block or a chart. The learning module stays with the Learning row | 000, 047, 082 |
| Prose primitives | Prose | Inline emphasis (highlights and key terms), pull quote, lists | Partial | The remaining prose primitives | 034 |
| Wayfinding | Wayfinding | Contents rail; related list (`cm-related`); breadcrumb from set to area to document; generated index page by area | Covered | Nothing in the kit's scope. Search, faceted browse, ranked entry and the version selector with diff need a server and are left out (records 076, 083) | 027, 076, 078, 083 |
| Provenance | Provenance | Footnotes; sources and citations (SPEC §8.21): the source register, citations that link both ways, evidence dates, the disagreement block, the caption's source line; a closed set of source date words; omission comments for an unrecorded publisher or locator, and a note for a number without a source | Covered | Nothing in the kit's scope. The aggregation header, agreement and spread, and the confidence qualifier join only when an acceptance document uses them (record 079) | 027, 079, 090 |
| Charts | Charts | ECharts method and recipes by question (SPEC §9); bar, line, area, stacked bar, donut, scatter and heatmap, plus bullet, slope, strip, box, interval band and error bars; value labels with separators at the chart's precision; light, dark and print | Covered | Nothing. The library's chart empty states stay out: a chart with no data is left out, never drawn empty (SPEC §1 rule 12) | 028, 081, 090 |
| Interaction | Interaction | Sortable tables, collapsible appendix | Partial | Filtering, overview and detail, definitions in place, recently viewed | 028 |
| Learning | Learning | The module page type (SPEC §7.9): objectives that each link to a lesson and an exercise, lessons as procedure steps, and exercises whose answers sit in closed collapsibles that print open; a reflection with a reference answer is an exercise. The model is a structured component (§8.27) | Partial | The comprehension summary and the learning cycle. Kept out by design (record 087): single choice, multi-select and true or false checks, scores, progress markers and resume points, since each needs form controls or a record of the reader | 028, 087 |
| Questions | Questions | Questions block | Partial | FAQ list ordered by frequency, said-and-actual corrections, confusion table | 038 |
| Change and status | Change | Status and change (SPEC §8.22): the dated status block, change log, revision history and limitation register; correction and limitation callouts; document status chips | Covered | Nothing in step 8's scope. The library's six node states and the notice each one obliges are not adopted (record 079); the per-node diff stays out with the version selector (record 076) | 039, 079 |
| Diagrams | Diagrams, Diagrams at Scale, Diagrams II, III, IV | Process diagram; flow diagram for process and decision flows, swimlanes, journey maps and system and data flows; sequence, state and entity relationship diagrams; layer stack; hierarchy; each with its capacity ceilings, the flow's width and branches counted from its JSON | Partial | The other families (deployment, service blueprint, Sankey, mind map, sets, cause and effect, process notation, decision tree and others), their capacity ceilings and the level model | 010–014, 077, 084, 085, 086, 091, 093 |
| Diagram build logic | Visualization kit (`import/kx-visualizations-index/`) | Flow mode: grid placement, five node types, three edge kinds, right-angle routing with rounded elbows, labels in line with their edges, lanes and boundaries. Sequence mode: lifelines, ordered messages, activation bars. State mode on the flow grid: start and end markers, self-transition loops. Entity relationship mode on the flow grid: attribute lists, plain lines, a count at each end. Layer stack mode on the flow grid: layers as bands, dependencies running down. Hierarchy mode: the ECharts tree layout, drawn in kit boxes and lines | Partial | The node types, connectors and routing of the other diagram modes | 077, 084, 085; see `scraps/4c-brief.md` |
| Page types | Templates, T1 to T11 | Three document kinds (report, guide, reference), each with its template, anatomy check and sample document; page types as recipes on the kinds, named by a `cm-type` tag, with a selection table of all eleven (SPEC §7.6); topic, glossary, framework, process, metric and comparison on the reference kind and module on the guide kind; roadmap and case study on the report kind; each type with its template, type check and worked example; a rule for material that answers two questions | Covered | Nothing | 037, 040, 076, 078, 087, 088, 089, 093 |
| Composition rules | Composition, Anatomy, Selection, Implementing, Exemplar | Report anatomy and the pre-publish checklist | Partial | Layout primitives, the component anatomy register and field contract, the selection matrix, implementer guidance, a reference build | 023–026, 028 |
| Multi-page navigation | Every page (menu bar) | Document ids and file-name addresses; a breadcrumb and wordmark that link to the set's index page; `npm run index` writes the index; `npm run links` checks every link across a folder; agreement rules for facts shared across a set, with a trust order for settling a disagreement | Covered | Nothing in the kit's scope. The library's fixed menu with a list of pages for each group gives way to the index page and breadcrumb; search, faceted browse and the version selector with diff need a server and are left out (record 083) | 046, 083, 091 |

The kit's own spec lists its gaps as maps, network diagrams, interactive filters and a PDF cover page
(SPEC §15). Network diagrams fall under the Diagrams row and interactive filters under the Interaction
row; maps and the cover page have no library page.

## Order

Set by the owner on 30 Oct 2026 (record 069), from the library's product context: a deep knowledge
index where provenance and freshness carry weight. Items 2 to 5 are step 8 of `docs/plan.md`.

1. **Diagrams, charts and visualizations.** Not adopted from the library: they get a build of their
   own in migration step 6 (`docs/plan.md`), from the owner's reference set. The Diagrams, Charts and
   Diagram build logic rows above are references for it. Its nine families are built (records 077,
   084 and 085).
2. **Provenance.** Core to a knowledge index. Covered (record 079).
3. **Change and status.** Covered (record 079); the library's node states are not adopted.
4. **Wayfinding and multi-page navigation.** Needed once there is more than one document. Covered
   (record 083).
5. **Structured components, then page types.** Each page type is a composition of the components
   above, so they come after. Both are covered (records 082 and 087 to 089).
6. **Learning, inputs and icons**, and the rows not named above, as the content calls for them,
   outside the plan.
