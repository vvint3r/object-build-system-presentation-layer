# Framework, process, metric and comparison

- **Date:** 2026-10-30
- **Source:** the Page types row of `docs/adoption.md` (library templates T2, T3, T6 and T7, record
  040), through the orchestrating session's brief for round 4 and the shared page-types contract; open
  choices taken by the session under the delegation in record 075
- **Status:** in force

---

## Rules

Sections 7.10 to 7.13 of `SPEC.md` hold the four recipes. All four are page types on the reference
kind: a page declares one with `<meta name="cm-type">` after `cm-id`, keeps every part of §7.4, and
adds its own parts between Properties and the first of Relationships, Examples and Notes & sources.
Sections 2 (kit files), 7.6 (selection table), 13.1, 14 (item 22) and 15 point at them, and the
agent brief's page types section summarises them.

| Rule | Spec | Check |
| --- | --- | --- |
| A framework page adds Rationale (`rationale`), Parts (`parts`), Application (`application`) and Limits (`limits`), in that order, after Properties | §7.10 | `type-framework`, failure |
| Parts holds one framework card named as the page is, with both scope lists, `Use when` and `Not for` | §7.10, §8.26 | `type-framework`, failure |
| Application holds a numbered list of 3 to 7 steps, or a method | §7.10, §8.28 | `type-framework`, failure |
| Limits holds 1 to 4 cases, one h3 each | §7.10 | `type-framework`, failure |
| A process page adds Flow (`flow`) and Stages (`stages`), in that order, after Properties | §7.11 | `type-process`, failure |
| Flow holds a flow diagram; Stages holds one workflow named as the page is, and every stage title is a node label of the diagram | §7.11, §8.20, §8.25 | `type-process`, failure |
| A process page carries no procedure | §7.11, §8.23 | `type-process`, failure |
| A metric page holds the metric detail in Properties, named as the page is, with no related metrics inside the card | §7.12, §8.30 | `type-metric`, failure |
| A metric page adds Status (`status`), and may add Measurement (`measurement`) after it | §7.12 | `type-metric`, failure |
| Status holds a status block with a value under the metric's name | §7.12, §8.22 | `type-metric`, failure |
| A comparison page adds Options (`options`), Criteria (`criteria`), Comparison (`comparison`), Recommendation (`recommendation`) and Change conditions (`conditions`), in that order, after Properties | §7.13 | `type-comparison`, failure |
| The comparison table has 2 to 4 option columns, exactly one starred `is-rec` column, and a measure in every cell | §7.13, §8.11 | `type-comparison`, failure |
| Each option has an h3 named as its column; each table row is a criterion stated as a term under Criteria | §7.13 | `type-comparison`, failure |
| The recommendation's first paragraph names the starred option in bold | §7.13 | `type-comparison`, failure |
| Change conditions hold 1 to 4 list items, each naming an option | §7.13 | `type-comparison`, failure |
| Properties of a process, metric or comparison page names the facts its recipe lists, each cited | §7.11 to §7.13 | Not checked: the kind check covers the property sheet; the keys vary |
| Evidence rules: stage measures and a metric's value sit in the status block; thresholds only when the owner set them; the recommendation states where its option is weaker | §7.11 to §7.13 | Not checked: each needs a reader's judgment |

The four checks are in `checks/types-reference.mjs`. Each carries `types` and also returns nothing on
a page of another type, so it is inert on every other page whether or not the runner filters by type.
Each check fails a broken copy of its worked example: 19 broken copies, every one caught.

## Files

| File | Holds |
| --- | --- |
| `kit/report-kit/template-framework.html` | The framework starter: reference parts plus Rationale, Parts, Application and Limits as placeholders |
| `kit/report-kit/template-process.html` | The process starter: reference parts plus Flow and Stages as placeholders |
| `kit/report-kit/template-metric.html` | The metric starter: the metric detail in Properties, then Status and Measurement |
| `kit/report-kit/template-comparison.html` | The comparison starter: reference parts plus the five comparison parts |
| `kit/Reference - Support Quality Pillars.html` | Worked framework: the four pillars of support quality |
| `kit/Reference - Ticket Escalation.html` | Worked process: a ticket's path from Tier 1 to the specialists and engineering |
| `kit/Reference - First Response Time.html` | Worked metric: the existing reference document, with the metric type's parts |
| `kit/Reference - APAC Weekend Coverage.html` | Worked comparison: three ways to cover APAC weekends |
| `checks/types-reference.mjs` | `type-framework`, `type-process`, `type-metric` and `type-comparison` |

## Calls

| Decision | Reason |
| --- | --- |
| Every type's parts sit after Properties and before Relationships | One placement rule for the reference kind: what the thing is and its facts come first, links and worked cases after |
| The type's main component carries the page's title | One name for one thing; the check can tell the page's own component from others on the page |
| First response time becomes the metric worked example, at version 1.0 dated 2026-10-14 | A page about one measure is a metric page by §7.12, so a plain reference would contradict the kit. Every fact added was true on that date, since the Q3 review appeared on 2026-10-12 |
| The metric example carries no thresholds | Bands would be invented, and they could disagree with the Q3 review's team flags |
| Status is required on a metric page and comes before Measurement, which is optional | The value is what the page adds over the card, and a reader looks it up before the method |
| The metric detail on a metric page holds no related metrics | The page's Relationships section already lists them; one list, not two |
| A process page requires a flow diagram, not a process diagram | §8.13 sends hand-offs between roles to a flow diagram; other diagram families may follow as sections of the page's own |
| A process page carries no procedure | Steps for one reader are a guide (§7.3); the process page links to it |
| Workflow stage titles match the flow diagram's node labels | §8.25 asks the two to share names; a check can confirm it |
| A framework page requires both scope lists and a separate Limits part | The scope says which cases fit; Limits says where the framework fails inside them |
| Application accepts a numbered list or a method | A short framework applies in a few steps; a method (§8.28) suits one with its own decision |
| A comparison holds 2 to 4 options | More than four options is a survey, not a decision; the page compares a shortlist |
| Criteria are stated as definition terms named as the table rows | A reader meets each criterion before its measures, and the check ties every row to a stated criterion |
| No comparison cell reads `n/a`, although §8.11 allows it elsewhere | A criterion that does not apply to every option cannot compare them; it belongs in the option's description |
| The caption's note line explains ★ and est. | A cold reader could not tell what either marked, and meaning never rests on a symbol alone |
| With 5 or more criteria the table is sortable by criterion only | §8.11 asks for sorting at 5 rows; option columns mix units, so they carry `data-nosort` |
| The comparison example shares every overlapping fact with the APAC case study and the gallery's evaluation, and the two documents link to each other | Both describe the same pilot; the Wednesday measure that got worse joins the criteria |
| The process example names both end states "Ticket closes", with the lane naming the role | The printed diagram then fits the 632px column; the lane already says who closes |
| New areas Ticket handling and Staffing hold the process and comparison examples | Neither fits Service performance, the only existing area besides Billing |
| The recipes list parts in tables, with no bold label run into text | The kit's writing rule on run-in labels applies to the spec as to pages |
| The selection table's and the agent brief's rows for the four types take the recipes' questions and neighbours | The core session wrote the rows before the recipes existed; a reader choosing a type meets the same question in both places |
| The agent brief summarises the four recipes beside the core types; `CLAUDE.md` and the bundle's row text stay as they are | The brief already lists every type's parts; `CLAUDE.md` names only the kind templates, and the core session owns the bundle text |
| The Page types row of the adoption backlog reads Covered | All eleven types of the selection table now have a recipe, a template, a check and a worked example |

## Version

The kit stays at 1.2. A page type adds rules only for pages that declare it. Two existing pages
change: the first response time reference gains the metric type, and the APAC case study links to the
comparison.
