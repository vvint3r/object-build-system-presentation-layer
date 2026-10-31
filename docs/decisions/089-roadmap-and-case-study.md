# Roadmap and case study

- **Date:** 2026-10-30
- **Source:** the Page types row of `docs/adoption.md` (library templates T8 and T11, record 040),
  through the orchestrating session's brief for round 4 and the shared page-types contract; open
  choices taken by the session under the delegation in record 075
- **Status:** in force

---

## Rules

Sections 7.14 and 7.15 of `SPEC.md` hold the two recipes. Both are page types on the report kind: a
page declares one with `<meta name="cm-type">` after `cm-id`, keeps every part of §7.2, and adds its
own parts between the executive summary and Recommendations. Sections 13.1, 14 (item 20) and 15
point at them.

| Rule | Spec | Check |
| --- | --- | --- |
| A roadmap adds Goal (`goal`), Milestones (`milestones`) and Out of scope (`out-of-scope`), in that order, after the executive summary and before Recommendations and the appendices | §7.14 | `type-roadmap`, failure |
| The goal opens its section as a paragraph with its key phrase in bold, the year it is due, and a citation for its expected effect | §7.14 | `type-roadmap`, failure |
| Milestones opens with a lede and the dated status block, then a timeline with one item per milestone | §7.14, §8.22 | `type-roadmap`, failure |
| Each milestone states its exit criteria in one sentence opening "Done when" and carries one status chip: Done (`ok`, on an `is-done` item), On track, At risk (`warn`), Late (`crit`), Planned | §7.14 | `type-roadmap`, failure |
| The milestone table has the columns Key, Milestone, Owner, Due, Depends on; keys are `M` and a number, unique; every row has an owner and an ISO due date in `<time datetime>` | §7.14 | `type-roadmap`, failure |
| A dependency is `None` or keys of other milestones in the table, each due no later than the milestone that depends on it | §7.14 | `type-roadmap`, failure |
| The table and the timeline list the same milestones in the same order, names and dates | §7.14 | `type-roadmap`, failure |
| Out of scope holds a list of what the roadmap leaves alone | §7.14 | `type-roadmap`, failure |
| A case study adds Situation (`situation`), Intervention (`intervention`), Results (`results`), Confounds (`confounds`) and Failures (`failures`), in that order, after the executive summary and before Recommendations and the appendices | §7.15 | `type-case-study`, failure |
| The situation opens with a cited paragraph; the intervention holds a timeline of its dated changes | §7.15 | `type-case-study`, failure |
| Results names Before and After periods in a property sheet: the same number of days, After starting after Before ends | §7.15 | `type-case-study`, failure |
| The results table has the columns Measure, Before, After, Change, Direction; Direction is Better, No change or Worse; A.1 defines No change | §7.15 | `type-case-study`, failure |
| A claim of effect cites its source: each key finding, each paragraph of Results, the results table's caption | §7.15, §8.21 | `type-case-study`, failure |
| Confounds and Failures each hold at least one entry, as list items or table rows | §7.15 | `type-case-study`, failure |
| At least one limitation: a limitation callout, or the register in the methodology appendix | §7.15, §8.22 | `type-case-study`, failure |
| A roadmap's KPI strip shows its goal's measures at their baseline; a case study's shows measures after, with the change against before | §7.14, §7.15 | Not checked: a SHOULD |
| A case study's key findings name the measures that did not improve or got worse | §7.15 | Not checked: the table's Direction column carries every measure, and is checked |

The two checks are in `checks/types-report.mjs`. Each carries `types` and also returns nothing on a
page of another type, so it is inert on every other page whether or not the runner filters by type.

## Files

| File | Holds |
| --- | --- |
| `kit/report-kit/template-roadmap.html` | The roadmap starter: report parts plus Goal, Milestones and Out of scope as placeholders |
| `kit/report-kit/template-case-study.html` | The case study starter: report parts plus Situation, Intervention, Results, Confounds and Failures as placeholders |
| `kit/Report - Email Routing Roadmap.html` | Worked roadmap: intent routing for email and web form, Q4 2026 |
| `kit/Report - APAC Weekend Pilot.html` | Worked case study: four staffed APAC weekends against the four before |
| `checks/types-report.mjs` | `type-roadmap` and `type-case-study` |

## Calls

| Decision | Reason |
| --- | --- |
| Exit criteria sit in the timeline item's body, opening "Done when"; the milestone table holds key, owner, due date and dependencies only | A sentence column in the table squeezed the date column until ISO dates broke at their hyphens, and the table could not be read at 390px. The timeline already gives each milestone a body |
| The milestone status is a chip word from a closed set of five, with the colour offsets of the document status chips | The word carries the meaning, as in the limitation register; colour stays an offset (§1 rule 8) |
| Milestones have keys (`M1`, `M2`) and dependencies name keys | A dependency needs a stable name to point at; keys let the check confirm each one exists and falls due first |
| A dependency due after the milestone that depends on it fails | It is a plan error a reader would not spot in a sorted table, and a check can |
| Due dates in the table are `<time datetime>` with non-breaking hyphens in the text | The machine value stays in `datetime`; the text no longer wraps inside a date in a narrow column. No kit CSS changes |
| The status block is required in Milestones, straight after the lede | §8.22 already places it after the lede of the section whose work it tracks; a roadmap's changing figures are its progress |
| No board or Gantt chart | The adoption backlog keeps the roadmap board out by design; the timeline and the table carry the same plan without interactivity |
| Before and After are property-sheet keys with ISO periods | Comparable periods become something a check can measure: equal length, no overlap |
| Direction is a closed set of three words, and A.1 defines No change | A reader cannot tell a result from noise without a stated threshold; a fixed word lets the check confirm every measure is classed |
| Citations are required on key findings, Results paragraphs and the results table caption | These are where a claim of effect sits; the rest of the page falls under the existing source rules (§8.21) |
| Confounds and Failures accept a list or a table | Three short confounds read as a list; failures with a date each read as a table. The check counts entries in either |
| At least one limitation is required, placed as §8.22 sets | A comparison of before and after cannot rule out every other cause; §8.22 already decides callout or register by count |
| The goal must carry a year | "Reach the goal" without a date is not a plan; a year is the least a check can confirm without parsing every date form |
| Both type checks are failures, not warnings | Each rule is structural and measurable; a page that breaks one does not have the type's parts |
| The templates carry a Recommendations card and no footnote, spark line or flagged row | A copied template then starts with only the masthead and top-bar placeholder failures, as the guide and reference templates do |
| The worked examples follow on from the sample report: routing email (its first recommendation) and staffing APAC weekends (its weekend gap) | The set reads as one organisation; overlapping facts are the sample's (55%, 88.3%, 86.9%, 96.1%, 27%, 9h 40m, the 95% target, Billing v4 raising billing contacts 31%, the 2 November specialist date, the pilot starting 16 September), and the Monday queue's fall from 212 to 96 is the gallery's |
| The pilot begins on 16 September and its first staffed weekend is 19 September | The sample dates the pilot from 16 September; the case study keeps that date and names the first weekend, so the two documents agree |
| Figures the sample does not hold are new to the examples, each with its own fictional source, under the Sample data chip | The page-types contract allows new facts that contradict none of the existing documents |
| The subsections sit after §7.5 as §7.14 and §7.15 | The page-types contract fixes the numbers; §7.6 to §7.13 come from the other sessions |

## Version

The kit stays at 1.2. A page type adds rules only for pages that declare it, so no existing page
changes.
