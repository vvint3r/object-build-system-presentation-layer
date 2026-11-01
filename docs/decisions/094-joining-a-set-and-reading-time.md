# Joining a set, reading time and stated forms

- **Date:** 2026-10-31
- **Source:** a guide built by an agent from the design bundle alone, on a subject outside the
  support operation the kit's examples describe, its friction items and its check results, through
  the orchestrating session's brief; choices taken by the session under the delegation in record 075
- **Status:** in force

---

## Rules

Each gap the agent met gets one closed form: an omission comment, a stated rule or an example. No
rule is loosened.

| Rule | Spec |
| --- | --- |
| A finished document drops the template's opening comment and the guidance in its other comments; a comment that only names a part may stay, and every omission comment stays | §2 |
| A heading's element sets its level and its class its tier: the Notes and Sources headings are `h3.cm-h4` | §4, §7.1 |
| Every document, in a set or standing alone, takes its file name and id from its kind | §7.1 |
| A knowledge index and its areas are not sets; a source that files a document only in an area names no set | §7.1, §7.5 |
| A word is a run of characters between spaces or element edges; each element's text counts apart, so citation keys, footnote numbers, chips, and field labels and values are words | §7.1, §14 |
| Published is never a date of a source the document cites | §7.1, §7.5 |
| Version is the document's own, never a cited source's; with none in the source, the first version is `1.0` | §7.1, §7.5 |
| Readers given only as a condition give Distribution the group the condition is drawn from; the condition goes where the document names its reader | §7.1, §7.5 |
| Prerequisites is a lede, then a list of what is in place before the event that starts the task; what the reader does from that event on is a step | §7.3 |
| A guide's status block follows the Steps lede | §7.3 |
| Where another role acts between a guide's steps, the reader's step is to hand the work on or wait, and its outcome names the state the other role leaves | §7.3 |
| Between a guide and a process page, the subject's actor decides: one reader's task is a guide, the work across its roles is a process page; with material for one document, the subject picks it and the other is not made | §7.6, §7.11 |
| A note has one mark; a later passage on the same point names the place that carries it | §8.15 |
| A report people wrote is a `Report`; a saved report a system produces is a `System export` | §8.21 |
| A nested place in a locator names each level from the top, with ` / ` between them | §8.21 |
| A fact the material does not tie to a source cites the one listed source of its kind; with none or several, or when the material says its origin is not recorded, it carries the no-source note | §7.5, §8.21 |
| A number without its unit or currency is written as given; one note says the source records none, marked at the first such number and naming the numbers it covers | §7.5, §8.21 |
| A period is named as a reader names it: `September 2026`, `Q3 2026`, `H1 2026`, `2026`; any other span gives its dates | §7.2, §8.22, §13.2 |
| A document that stood alone joins a set in four steps, in order: set step, area step, wordmark with the set's publisher, then the index script and the link check | §7.1, §8.31, §14 |
| Item 13 of the checklist needs a browser; an author without one leaves it to the checks | §14 |

Section 15 lists each rule among the 2.0 changes.

## Reading time

The check joined the text of neighbouring elements whenever the markup held no space between them.
So `Prepared by` and its value, a footnote number and the word before it, and the Outcome label and
its sentence each read as one word. No reader can count that way from the page.

| Page | Joined count | Count by element | Stated before | Stated |
| --- | --- | --- | --- | --- |
| Guide on expense claims, as composed | 641 | 678 | 4 min | 4 min |
| First response time reference | 874 | 930 | 4 min | 5 min |
| APAC weekend pilot report | 1,265 | 1,399 | 6 min | 7 min |
| Email routing roadmap | 852 | 949 | 4 min | 5 min |
| Sample report | 1,526 | 1,659 | 7 min | 8 min |

Each count by element is the check's own, and an independent count of the markup gives the same numbers. The other kit pages keep their stated times.

## Checks

| Check | Level | Reads |
| --- | --- | --- |
| `reading-time` | warning | The words of `<main>`, each element's text apart from its neighbours' |
| `footnotes` | failure | A note with a second mark |
| `kind-anatomy` | failure | A guide's Prerequisites opens with one paragraph, its lede |

`npm test` adds one case: the sample report with note 1 marked a second time fails `footnotes`.

## Kit pages

| Page | Change |
| --- | --- |
| First response time reference, APAC weekend pilot report, email routing roadmap, sample report | Reading time stated by the count by element |
| Guide and module templates | A Prerequisites lede placeholder |
| Every template | Notes on the file name and id in or out of a set, joining a set, dropping the notes for the author, the Published and Version forms, Distribution for readers given as a condition and the nested locator |
| Guide template | Notes on another role's step, the status block's place and a note's one mark |

## Calls

| Decision | Reason |
| --- | --- |
| The reading-time check counts each element's text apart, and the spec says so | The spec counts every word a reader sees; a count joined across markup cannot be made by hand, so the check misread the spec. The guide's composer counted 678 by hand, which the check now gives |
| The subject's actor decides between a guide and a process page | Both rules applied to a task with other roles' gates at its end; the subject sentence is in every source and settles the case without a list of exceptions |
| A note has one mark | One mark keeps one back link true, needs no change to the kit's script, and a passage that names the place keeps every number beside its note |
| A fact not tied to a source cites the one listed source of its kind | A note on every limit would bury the rules a single listed policy holds; with no single candidate, no source is guessed, as record 090 holds |
| One note covers every number without its unit | A mark on each amount adds clutter and no meaning; the note names what it covers |
| A half year reads `H1 2026` | It sits beside `Q3 2026` in the same form, so like periods look alike |
| A nested locator separates its levels with ` / ` | The breadcrumb uses the same separator for the same kind of path |
| A system's saved report is a `System export` | The tag names where the source comes from, and a tool's report is that tool's output, dated by its export |
| Version `1.0` with no version in the source | The templates and all eleven kit documents start there |
| Distribution names the group a condition is drawn from | The field names a group; the condition stays in the text that names the reader, so nothing is lost |
| Prerequisites has a lede | Both guide examples carry one, and Steps and Exceptions open the same way |
| `h3.cm-h4` stays and the spec names it | Headings never skip a level, and 23 kit files use the form; the spec now says what the class sets |
| The template's notes for the author go, part names may stay | The examples drop the notes and keep part names; a document carries no notes about its making |
| On joining, the wordmark takes the set's publisher | The index script refuses a folder whose wordmarks name two publishers, and §7.1 holds one publisher across a set |
