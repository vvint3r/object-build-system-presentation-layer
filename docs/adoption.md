# Adoption backlog

Report Kit 1.1 is the baseline. The original 35-page content-morphia library is the reference: it
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
| Non-visual equivalents | Equivalents | Chart `aria-label` and data-table fallback | Partial | Equivalents for diagrams and other non-chart visuals | 031, 032 |
| Structured components | Structured | Process diagram, timeline, KPI strip, recommended table column | Partial | Workflow, framework, model, method, requirement and evaluation, metric detail | 000, 047 |
| Prose primitives | Prose | Highlights, key-term underline, pull quote, lists | Partial | The remaining prose primitives | 034 |
| Wayfinding | Wayfinding | Contents rail | Partial | Search, faceted browse, ranked entry, version selector with diff | 027 |
| Provenance | Provenance | Footnotes, sources list, caption source line | Partial | Aggregation header, agreement and spread, confidence qualifier, citation markers that open a source panel | 027 |
| Charts | Charts | ECharts method, seven chart types, light and dark | Covered | The library's empty-state conditions for charts | 028 |
| Interaction | Interaction | Sortable tables, collapsible appendix | Partial | Filtering, overview and detail, definitions in place, recently viewed | 028 |
| Learning | Learning | Nothing | Not in kit | Objectives, knowledge checks, comprehension summary, learning cycle, model | 028 |
| Questions | Questions | Questions block | Partial | FAQ list ordered by frequency, said-and-actual corrections, confusion table | 038 |
| Change and status | Change | Correction and limitation callouts, document status chips | Partial | Change log, per-node diff, limitation register, revision history, the dated status block that section 13 of the spec calls for | 039 |
| Diagrams | Diagrams, Diagrams at Scale, Diagrams II, III, IV | Process diagram only | Partial | The diagram families (sequence, entity relationship, state, deployment, layered architecture, journey, service blueprint, Sankey, mind map, sets, cause and effect, process notation, data flow, decision tree and others), the level model and capacity ceilings | 010–014 |
| Diagram build logic | Visualization kit (`import/kx-visualizations-index/`) | Nothing | Not in kit | Node kit, connectors, terminators, the lane-flow router and its invariants | n/a; see `scraps/4c-brief.md` |
| Page types | Templates, T1 to T11 | One document type, the report | Partial | Topic, framework, process, guide, module, metric, comparison, roadmap, reference, glossary, case study | 037, 040 |
| Composition rules | Composition, Anatomy, Selection, Implementing, Exemplar | Report anatomy and the pre-publish checklist | Partial | Layout primitives, the component anatomy register and field contract, the selection matrix, implementer guidance, a reference build | 023–026, 028 |
| Multi-page navigation | Every page (menu bar) | Top bar and contents rail for one document | Not in kit | Navigation across many documents, for the knowledge index | 046 |

The kit's own spec lists its gaps as maps, network and hierarchy diagrams, interactive filters, a PDF
cover page and revision history. All but maps and the cover page appear in the table above.

## Order

Set by the owner on 30 Oct 2026 (record 069), from the library's product context: a deep knowledge
index where provenance and freshness carry weight. Items 2 to 5 are step 8 of `docs/plan.md`.

1. **Diagrams, charts and visualizations.** Not adopted from the library: they get a build of their
   own in migration step 6 (`docs/plan.md`), from the owner's reference set. The Diagrams, Charts and
   Diagram build logic rows above are references for it.
2. **Provenance.** Core to a knowledge index, and partly covered.
3. **Change and status.** Revision history is a named kit gap.
4. **Wayfinding and multi-page navigation.** Needed once there is more than one document.
5. **Structured components, then page types.** Each page type is a composition of the components
   above, so they come after.
6. **Learning, inputs and icons**, and the rows not named above, as the content calls for them,
   outside the plan.
