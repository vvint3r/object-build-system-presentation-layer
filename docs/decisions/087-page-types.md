# Page types: topic, glossary and module

- **Date:** 2026-10-30
- **Source:** the Page types and Learning rows of `docs/adoption.md` (library templates, record 040;
  learning rules, record 028), through the orchestrating session's brief for round 4 and the shared
  page-types contract; open choices taken by the session under the delegation in record 075
- **Status:** in force

---

## Rules

Section 7.6 of `SPEC.md` defines a page type: a recipe on one document kind, named by an optional
`cm-type` tag, with a recipe format and a selection table of all eleven types and kinds. Sections
7.7 to 7.9 hold the topic, the glossary and the module. Sections 2, 8.16, 12, 13.1, 14 (items 16 and
21) and 15 point at them.

| Rule | Spec | Check |
| --- | --- | --- |
| A `cm-type` tag is optional, at most one, in `<head>` straight after `cm-id`; its value comes from the closed set of nine, and the type's kind is the page's `cm-kind` | §2, §7.6 | `head-order`, failure |
| A type's checks run only on pages of that type; a page with no `cm-type` meets the kind's rules alone, as before | §7.6 | The runner's `types` filter; each type check also returns nothing on another type |
| A topic adds Subtopics (`subtopics`) after Definition and before Properties: a lede, then two or more groups, each an h3, a paragraph and a related list whose every link leaves the page | §7.7 | `type-topic`, failure |
| A topic may add Reading order (`reading-order`) after Subtopics and before Properties: an ordered list, each item a link out with its reason | §7.7 | `type-topic`, failure |
| A topic states rules and targets, never a period's results | §7.7 | Checklist, §14 item 15 |
| In a glossary, Terms (`terms`) takes the place of Properties, after Definition and before Relationships; a glossary has no Properties section | §7.8 | `kind-anatomy` and `type-glossary`, failure |
| Terms holds five or more terms in definition blocks; with more than one block, each sits under an h3; terms run A to Z within a block, and each is defined once on the page | §7.8 | `type-glossary`, failure |
| Each glossary definition cites the source it follows | §7.8, §8.21 | `type-glossary`, failure |
| A module adds Objectives (`objectives`) after Purpose and before Prerequisites: 2 to 5, each linking to the lesson that teaches it and the exercise that checks it; every exercise is linked from an objective | §7.9 | `type-module`, failure |
| A module's Steps part is titled Lessons, and each lesson has an id | §7.9 | `type-module`, failure |
| A module adds Exercises (`exercises`) after Lessons and before Exceptions and recovery: each exercise a group with an id, an h3, its task, and its answer in a closed collapsible labelled Answer | §7.9, §8.16 | `type-module`, failure |
| A module carries no form controls, scores or progress | §7.9 | `type-module`, failure |
| Print opens every answer | §8.16, §12 | `cm-report.js` opens every disclosure before print, unchanged |
| A typed page starts from `template-<type>.html`: the kind's template with the type's parts | §7.6 | The templates pass every check except the topbar and masthead placeholders, as the kind templates do |

The three checks are in `checks/types-core.mjs`. The `types` filter and the `cm-type` validation
apply to every type in the set, the roadmap and the case study included (record 089).

## Files

| File | Holds |
| --- | --- |
| `checks/page.mjs` | `H.TYPES`, the closed set of types with each one's kind, and `H.type()` |
| `checks/markup.mjs` | The `cm-type` tag in `head-order` |
| `checks/run.mjs` | The `types` filter; the core type checks registered |
| `checks/kinds.mjs` | Terms in the place of Properties on a glossary |
| `checks/types-core.mjs` | `type-topic`, `type-glossary` and `type-module` |
| `tools/bundle.mjs` | A type's template and example named with the kind it builds on in the bundle's file table |
| `kit/report-kit/template-topic.html`, `template-glossary.html`, `template-module.html` | The three starters |
| `kit/Reference - Service Levels.html` | Worked topic: first response time, resolution within SLA and specialist queue wait |
| `kit/Reference - Support Glossary.html` | Worked glossary: twelve terms in four groups |
| `kit/Guide - First Response Basics.html` | Worked module: three lessons and three exercises on first response time |
| `kit/agent-brief.md` | A Page types section: the tag, the selection table and the three recipes |

## Calls

| Decision | Reason |
| --- | --- |
| The masthead's type chip stays the kind's; the top bar's series chip may name the type | The masthead check, the index page's tags and the related-list tag set all work by kind; the series chip already names a series, so the type shows without a new chip rule |
| File name and id follow the kind (`Reference - Support Glossary.html`) | §8.31 names files by kind and the index tags entries by kind; a type prefix would give one set two naming schemes |
| §1 rule 1 stays as written | A type's template is its kind's template with the type's parts, so starting from it still starts from the kind's template; the non-negotiable lists stay in step without a change |
| A type check is skipped by the runner on every other page, so each page gains three `skip` lines per type module | The same mechanism as `kinds`; the skip line shows why the check did not run |
| Topic or index page: the index is generated and lists a folder; a topic is written and explains each part, with a reason for each link | The index page explains nothing by design (§8.31); a reader new to a subject needs the explanation |
| Topic or plain reference: a reference describes one thing whose facts fit one property sheet | A subject of several parts has no single unit, owner or source to put in one sheet |
| A subtopic's links leave the page | A subtopic routes the reader to the document that covers the part; text that stays in the page is a section of a reference |
| A topic states rules and targets, never a period's results | A topic has no period, so a period's figures go stale in it and repeat the report that measures them; results stay behind a link or in a dated status block |
| A topic's Properties holds facts the subtopics do not state | A sheet that restates the subtopics, the byline and the sources is filler (§1 rule 12) |
| Glossary: Terms takes the place of Properties, the one substitution a type makes | Properties holds the facts a reader looks up about one thing, and in a glossary those facts are the terms. A property sheet about the glossary repeated its byline, masthead and sources and kept two facts of its own, scope and change rule, which fit the Definition paragraph |
| `kind-anatomy` accepts Terms in Properties' place only when `cm-type` is `glossary` | The substitution is the type's, so a plain reference without Properties still fails |
| A glossary holds five or more terms | Fewer terms belong in a definition block of the document that uses them (§8.5), where the reader meets them |
| A glossary of more than one block groups its terms under h3s named for what they describe | The 150-word limit on prose between headings counts definitions; groups keep a glossary of any size within it, and give a reader a way in |
| Each glossary term is defined once on the page, A to Z within its group, and cites its source | Two definitions of one term can disagree; A to Z is the lookup order; the citation names what changes a definition |
| A module's Steps keeps the id `steps` and takes the title Lessons | The guide's part ids are fixed and never change once published (§8.31); the title is what the reader sees |
| Each objective links to its lesson and its exercise, and every exercise is linked | Coverage is visible at the start and checkable, which the library's comprehension summary gave only at the end |
| Answers sit in closed collapsibles, the one collapsible outside an appendix; print opens them | An open answer gives itself away before the reader tries; the collapsible is the kit's only disclosure, and its print behaviour already opens it |
| A module has no form controls, scores, progress tracking or resume point | Each needs a record of the reader or script state, which a static single-file document does not keep; a task with a worked answer covers the library's reflection check |
| A module's Objectives part needs no lede | The list states the objectives and the links; a lede would repeat it |
| The worked examples reuse the sample's facts and add their own under the Sample data chip | The set reads as one organisation. New facts (business hours of 08:00 to 18:00 on weekdays, the specialist desks, the routing queues) contradict none of the existing documents |
| The type templates fail only the topbar and masthead placeholders and warn on reading time | The same baseline as the guide and reference templates, so a copied template starts clean |
| The selection table gives every type and both untyped kinds, guide and reference, one row each | A reader picks by question; the neighbour column separates the four close pairs the contract names: topic or index page, process or guide, glossary or reference, metric or metric detail |

## Left out

- A gallery part for page types: the worked examples carry them this round.
- Framework, process, metric and comparison: their recipes are sections 7.10 to 7.13, from the
  reference session.
- The comprehension summary and the learning cycle (record 028): still to adopt, in the Learning row.
- Single choice, multi-select and true or false checks, scores, progress markers and resume points:
  kept out by design, as the Learning row of `docs/adoption.md` states.

## Version

The kit stays at 1.2. A page type adds rules only for pages that declare it, so no existing page
changes.
