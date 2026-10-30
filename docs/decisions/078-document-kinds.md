# Document kinds

- **Date:** 2026-10-30
- **Source:** record 076 and `docs/subprojects/kit-features.md`, through the orchestrating session's
  brief for round 2; open choices taken by the session under the delegation in record 075
- **Status:** in force

---

## Rules

The kit builds three kinds of document: a report, a guide and a reference. Section 7 of `SPEC.md`
sets the anatomy of each. Section 7.1 holds the blocks every kind shares, 7.2 to 7.4 the parts of
each kind, and 7.5 the blocks a document may leave out with an omission comment.

| Rule | Spec | Check |
| --- | --- | --- |
| `<meta name="cm-kind">` after `cm-kit` names the kind: `report`, `guide` or `reference`. No tag means a report | §2, §7 | `head-order`, failure |
| Every kind has the top bar, contents rail, masthead, Notes & sources and footer | §7.1 | `topbar`, `masthead`, `report-anatomy`, `footer` |
| The masthead's type chip names the kind: Analysis, Report or Brief for a report; Guide; Reference | §7.1 | `masthead`, failure |
| A Period field and a period in the title belong to reports only | §2, §7.1 | `masthead`, `head-order`, failure |
| A report keeps its executive summary, body parts, recommendations, methodology and sources | §7.2 | `summary-anatomy`, `methodology`, reports only |
| A guide holds Purpose, Prerequisites, Steps, Exceptions and recovery, Related documents, Notes & sources, in that order, each a section with a fixed id | §7.3 | `kind-anatomy`, failure |
| A reference holds Definition, Properties, Relationships, Examples, Notes & sources, in that order, each a section with a fixed id | §7.4 | `kind-anatomy`, failure |
| The purpose of a guide and the definition of a reference open the document as one paragraph | §7.3, §7.4 | `kind-anatomy`, failure |
| A guide's Steps hold a procedure; its Prerequisites a list; its Related documents a related list. A reference's Properties hold a property sheet | §7.3, §7.4 | `kind-anatomy`, failure |
| A guide or a reference carries no summary card, featured card or KPI strip | §1 rule 7, §6, §7 | `summary`, `featured`, `kind-anatomy`, failure |
| Prerequisites, Exceptions and recovery, Related documents, Relationships and Examples may be left out with an omission comment | §7.5 | `kind-anatomy`, failure |
| A procedure is an `ol`; each step opens with its title as a heading and closes with its outcome: the label "Outcome" on its own line, then a sentence | §8.20 | `procedure`, failure |
| A procedure has 3 to 9 steps, step titles of 8 words at most, and one-sentence outcomes | §8.20, §13.1 | `procedure-length`, warning |
| A related list item has a tag from a closed set, a link with its title, and one sentence on how it relates | §8.23 | `related`, failure |
| A reference's title is the name of its subject, 1 to 10 words | §7.1, §13.1 | `title-length`, warning |

A check may name the kinds it applies to. The runner prints `skip` for that check on a page of
another kind.

## Files

| File | Holds |
| --- | --- |
| `kit/report-kit/template-guide.html` | The guide starter |
| `kit/report-kit/template-reference.html` | The reference starter |
| `kit/Guide - Billing Escalation.html` | The guide acceptance document |
| `kit/Reference - First Response Time.html` | The reference acceptance document |
| `checks/kinds.mjs` | `kind-anatomy`, `procedure` and `related` |

The report template and the sample report carry `<meta name="cm-kind" content="report">`. The
gallery's Part 04 shows the three kinds side by side; components 5.26 and 5.27 show the procedure
and the related list.

## Calls

| Decision | Reason |
| --- | --- |
| Section 7 states the shared blocks once, then one subsection per kind, then one omission table for all kinds | One rule kept whole: the masthead and closing blocks have one definition, and every omission is in one place |
| The Guide type chip leaves the report kind and names the guide kind | Like things alike: the type chip names the kind, and a report about a task is a guide |
| Guides and references carry no Period | Neither covers a period; a dated figure sits in its sentence with its source |
| Notes & sources closes a guide and a reference as it closes a report | Every number on a kit page is sourced, and the closing block is shared |
| Purpose, Steps, Definition and Properties are never left out; the other parts of the two kinds may be | A task without steps or a subject without facts is not a guide or a reference; the rest depends on the subject |
| Each required part has a fixed section id | The anatomy can be checked, and links to a part stay stable across documents |
| A guide or a reference may add sections between its required parts | Room to grow, such as the reference's Measurement section, without a new kind |
| The procedure is a new component | The process diagram stops at 6 steps with 3-word titles and shows flow at a glance; a list has no place for an outcome |
| The related list is a new component | The source register records what a claim rests on; a related item needs a link and a sentence on how it relates |
| The related list's tags are a closed set: Report, Guide, Reference, Metric, Dataset, System | Closed sets keep tags comparable across documents |
| A procedure warns outside 3 to 9 steps and over 8 words a title | Limits a reader can follow; a longer task splits into stages, and a warning leaves room for judgment |
| The sample report states its kind | The reference output shows the tag every document carries |
| The brief's new rows link at the brief's current commit pin | Pins move only when a kit change merges; the rows resolve at the next pin move |
| The acceptance documents cite internal policies and the Q3 review for every limit and figure, through the source register and citations; their footnotes only explain | The sample report's sources and dates stay the single account of the support organisation, and every number traces to a dated entry |
| The rules for the source register and the change blocks name the Notes & sources appendix, not Appendix B | Notes & sources is Appendix A in a guide or a reference; one wording holds for every kind |
| The procedure is §8.20 and the related list §8.23 | Sources and citations hold §8.21 and Status and change §8.22; §8.20 was free and §8.23 is next, so no existing section number moves |
| The reference's worked examples use illustrative tickets, said so in the section's lede | Examples show the clock rules; the only measured figures in them come from the Q3 review |
| The Wayfinding row of `docs/adoption.md` lists the related list | It is the related-documents block that row names |

## Version

The kit stays at 1.2. The change adds two kinds and two components. A report built on 1.2 passes as
before, unless its type chip is Guide: that document is a guide and takes the guide's anatomy.
