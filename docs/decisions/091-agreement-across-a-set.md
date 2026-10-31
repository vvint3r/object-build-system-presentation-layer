# Agreement across a set

- **Date:** 2026-10-31
- **Source:** the orchestrating session's brief for a consistency read of every page in `kit/`, with
  two items from outside reviewers (ticket population, before-and-after wording) passed on through
  it; choices taken by the session under the delegation in record 075
- **Status:** in force

---

## Rules

Section 8.31 of `SPEC.md` holds the agreement rules, and item 19 of section 14 asks for them before
publishing. No check reads them: whether two documents agree needs a reader of both.

| Rule | Spec | Check |
| --- | --- | --- |
| A fact two documents share has one value in every place it appears: prose, KPI, chart data, table, diagram and text equivalent | §8.31 | Checklist, §14 item 19 |
| When two documents disagree, the less trusted side changes. Trust runs, highest first: the source the fact cites; the set's main report, when it has one; the document published first | §8.31 | Checklist |
| A fact with no source in the set is removed or marked as unsourced, never made up | §8.31, §8.21 | Checklist |
| A figure taken from another document names its population when it differs from the one the citing document defines | §8.31 | Checklist |
| A before-and-after comparison states a change seen after an event, not an effect of it | §8.31 | Checklist |
| A related item or index entry describes its target truly, in what it holds and how much | §8.31, §8.24 | Checklist |
| A document links only to documents published on or before its own date; the later document links back | §8.31 | Checklist |
| The gallery's demonstrations reuse the facts of the kit's documents | §8.31 | Checklist |
| A heatmap's description names its scale in words that hold in both themes, never "darker" | §9 | Checklist |
| A hierarchy holds at most 6 leaves | §8.20 | `hierarchy-capacity`, failure |

## Contradiction classes

Each class below is settled by the rule beside it.

| Class | Rule |
| --- | --- |
| A gallery demonstration states a number, name, total, threshold or schedule that differs from the sample report or a reference | Shared fact, one value; gallery reuses kit facts |
| A demonstration restates a reference's workflow, framework or model in other words that change its meaning | Shared fact, one value |
| A statement contradicts a rule a reference sets, such as where intent routing sends a ticket | Shared fact, one value |
| A demonstration states a fact found nowhere in the set and at odds with one that is, such as an escalation rate | Unsourced fact removed |
| Two documents report one metric over different ticket populations without saying so | Population named |
| A before-and-after comparison is worded as an effect: "cut", "removed", "came from" | Change seen after an event |
| A related item summarises its target wrongly, or a figure reference names the wrong figure | Target described truly |
| A document links to one published after it | Links reach earlier documents only |
| A demonstration states a decision as taken while the document it echoes holds it open | Shared fact, one value |
| A text equivalent states a value its chart data does not hold | Shared fact, one value |
| A colour-scale caption is true in one theme only | Scale words for both themes |
| A capacity ceiling's reason does not match what prints | Ceiling measured at the printed column |

## Hierarchy leaf ceiling

Each fixture is a hierarchy printed at the 638px column with the 11px floor: a 24-character root
and group labels, and leaves labelled "Refunds and credit notes", 24 characters of real words. Such a
label wraps to two lines in the 120px box. "Over" means the fixture needs less than 80%.

| Leaves | One group | Two groups | Three groups | Four or more groups |
| --- | --- | --- | --- | --- |
| 6 | 100% | 99% | 87% | Over, in five groups of 2-1-1-1-1 |
| 7 | 99% | 87% | Over | Over |
| 8 | 87% | Over | Over | Over |
| 9 to 14 | Over | Over | Over | Over |

| Fixture | Scale |
| --- | --- |
| Four levels, 6 leaves in groups of 3-3, 2-2-2 or 2-2 and 2 | 87% to 99% |
| Four levels, 7 or 8 leaves | Over |
| A 40-character detail line on each leaf, 2 to 4 leaves in one group | 100% |
| A detail line on each leaf, 4 leaves in two groups, or 5 or more leaves | Over |

Six is the most leaves that print in one, two or three groups. The ceiling was 12, with the reason
"twelve leaves in three groups print at 83%"; no grouping of twelve such leaves prints. Record 086
gave ten leaves in one group at 86%, a figure that holds only for labels that stay on one line. The
gallery's hierarchy (§7.9 of the gallery page) holds 6 leaves in groups of 2-2-2 and prints at 100%.

## Calls

| Decision | Reason |
| --- | --- |
| The leaf ceiling is 6, not 8 | Eight leaves print only as one flat group of 8; any second group runs past a page. Six prints in every grouping of up to three groups |
| A link to a later document is removed, not the publish dates moved | A published date is a fact about the document. The later document already links back where the two relate |
| A gallery demonstration takes the sample report's facts, not facts of its own | The gallery is read beside the sample; a second set of figures for the same operation contradicts it |
| The first response reference names the review's resolved-ticket population; the sample report keeps its own | The sample report ranks above the reference. The reference defines its reported value over created tickets, so the difference is stated where its figure reuses the review's medians |
| The gallery's metric thresholds follow its bullet bands: 90% or more on track, 85% to 89.9% at risk, below 85% breach | The bullet chart and the sample's team flags (93.0% on track) agree on these bands; the old thresholds contradicted both |
| The pilot's Monday queue change is quoted as 55% where a sentence states it | The pilot report's KPI and recommendation already give 55%; "more than half" left the claim without its number |
| The agreement rules stay unchecked | A check could compare published dates on links, but values shared across documents need a reader; one rule set, read by hand, is kept whole |
