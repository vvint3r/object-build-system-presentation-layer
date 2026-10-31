# Stated forms, diagram width and checks away from the repository

- **Date:** 2026-10-31
- **Source:** a process page built by an agent from the design bundle alone, its 38 friction items
  and its three check results, through the orchestrating session's brief; choices taken by the
  session under the delegation in record 075
- **Status:** in force

---

## Rules

Each gap the agent met gets one closed form: an omission comment, a stated rule or an example. No
rule is loosened.

| Rule | Spec |
| --- | --- |
| A fact the source does not give takes one stated form: status Draft; Published the version's effective date, or the day the document is finished; the wordmark the team in Prepared by; the series chip the page type; Prepared by the owner; no Reviewed by field without a reviewer | §7.1, §7.5 |
| The publisher is the organisation or team that publishes the document, the same across a set | §7.1 |
| The masthead fields are the whole list; any other fact about the subject sits in the body | §7.1 |
| The byline runs Prepared by, Reviewed by when there is a reviewer, then Distribution | §7.1 |
| A document standing alone whose source names no set leaves the set step out with `cm-omit set` | §7.5, §8.31 |
| The notes list appears only when the document has notes, with no comment in its place | §7.1 |
| A guide's Purpose and a reference's Definition are their sections' ledes, 45 words at most | §7.3, §7.4, §13.1 |
| Relationships lists documents of the kit; a policy, dataset or system with no page is named in Properties and cited. The omission reads accordingly | §7.4, §7.5, §8.24 |
| Section numbers run over the sections present | §7.5 |
| Made-up examples say so with the word illustrative; a real case cites its source | §7.4 |
| Material that answers two questions takes the type for the question its subject names; the rest goes in that type's parts or a document of its own; readers never choose the type | §7.6 |
| A report is a process or metric page's neighbour, with its "choose it over" lines | §7.6, §7.11, §7.12 |
| A process page's Properties holds the targets and due times its policies set; results against them sit in the status block | §7.11 |
| A stage is a step node; a last stage may be the end terminal; a decision belongs to the stage before it; Exceptions cases are not drawn; past capacity, the main path is drawn | §7.11, §8.25 |
| A property key's sub-label is 1 to 3 words of its own | §8.7 |
| A branch label answers the decision's question in 1 to 3 words, a value or a role among them | §8.20 |
| A decision has at most 3 branches, 2 in the first or last row; more outcomes become two decisions in a row | §8.20 |
| The diagram width counts 5 at most, from the JSON: each column, the lane names, each labelled gap between columns (2 past 10 characters) | §8.20 |
| At most two columns hold a terminal label past 13 characters or a decision label past 12, and none at a width of 5 | §8.20 |
| Branches into one side of a node join on their last run; a step whose top takes two edges reaches the node below with a hook | §8.20 |
| A locator named in words is the system's name, then the place in `<code>`; a table is `schema.table` | §8.21 |
| A source entry's omission comment stands where the part would, taking the ` · ` with it; an entry may leave out publisher and locator both | §8.21 |
| A number from a record no reader can find again, such as one person's tally, carries a note and has no source entry | §8.21 |
| A status block over a period dates its head to the period's last day; its first value names the period | §8.22 |
| Status rows run in one list in stage order, measures of the whole first, never a table | §8.22 |
| A result against its target reads `1.1 business days, target 2` | §8.22 |
| A citation in a status block sources its row and the rows after it, up to the next citation or note mark | §8.22 |
| A word of change carries a number; a word of change used in another sense gives way to another word, such as refused | §13.2 |
| The checks run when a document returns to the repository; the counted items of the checklist name what to count | §14 |
| Reading time leaves out a chart's or a diagram's JSON | §7.1 |

## Width count

Print sets a diagram at 80% of its size or more into the 638px printed column, so its natural width
stays at 797px or under. Measured in print at the 80% floor, with text at 125%:

| Part | Width |
| --- | --- |
| Column of steps, labels to 24 characters | 120px |
| Gap between columns, no label | 40px |
| Lane names | 72px to 123px |
| Gap holding a label of 2 to 4 characters | 100px to 118px |
| Gap holding a label of 9 or 10 characters | 158px to 164px |
| Gap holding a label of 12, 15 or 19 characters | 184px, 216px, 252px |
| Terminal column, label of 13 characters or fewer | 124px at most |
| Terminal column, label of 14, 16, 20 or 24 characters | 146px, 162px, 186px, 192px |
| Decision column, label of 12 characters or fewer; of 24 | 120px at most; 154px |

Five columns of steps and the four gaps between them take 760px, inside the budget. So the count
gives each column, and anything as wide, 160px. A gap's label adds at most 144px through 12
characters, within one count, and 212px at 19 characters, within two. The count puts its step at 10
characters, on the safe side.

## Checks

| Check | Level | Reads |
| --- | --- | --- |
| `diagram-capacity` | failure | The width count, a decision's branches, and the columns widened by long terminal and decision labels, all from the JSON; placeholders are not measured |
| `masthead` | failure | A breadcrumb of area and document with `cm-omit set`; no field outside the list; byline fields in order, with no other |

## Kit pages

| Page | Change | Printed |
| --- | --- | --- |
| Ticket escalation reference | Tier 1's lane takes two rows, so the flow uses three columns and one labelled gap | 86.5% |
| First response time reference | Quarterly review sits below the helpdesk, so the median runs back along the second row | 100% |
| Sample report | Shorter terminal and decision labels in the routing flow | 93.8% |
| Gallery, process flow | Live sits below Publish, in four columns | 95.5% |
| Gallery, swimlane | Shorter terminal and decision labels | 94.9% |
| Gallery, sources | An entry with publisher and locator both left out | n/a |
| Templates | Notes on the stated forms in the top bar, breadcrumb, metadata, byline, notes, related parts and examples; the process template adds the width count | n/a |

## Calls

| Decision | Reason |
| --- | --- |
| The diagram width is counted, with labelled gaps and lane names in the count | A count from the JSON lets a document built away from the repository meet the ceiling before drawing; the print check stays the final test |
| The escalation example changes, not the rule | The example printed inside the column only by 7px through short labels; the count is what a composer can rely on |
| A long gap label counts 2 past 10 characters | The measured step falls between 12 and 15 characters; the lower bound keeps every counted diagram inside the column |
| A forward diagonal branch counts its gap unless a branch of the same node runs along its row | The router gives that side to the branch along the row; the rule is decidable from the JSON alone |
| A decision is no stage of its own | A stage title is a noun phrase and a decision holds a question; the stage before the decision names its branches |
| The last stage may be the end terminal | It saves a column the width count cannot spare, and the terminal already names the outcome |
| An unknown status reads Draft | Final is a claim of approval the source does not make |
| An effective date is the Published date | It is the date the version reaches its readers; a second date field would open the closed list |
| An unknown publisher takes the team in Prepared by | The team answerable for the document is the nearest named publisher, and the wordmark stays a name, not a placeholder |
| An unknown set takes an omission comment | A set is a folder with an index page; a name for one cannot be inferred |
| A status block has no row limit | No measured basis gives one; one ordered list in stage order answers how a long block reads |
| The hook and the merge stay as the router draws them | Both keep lines readable: the hook keeps one line from reading through a node, the merge keeps two paths to one stage from running side by side |
| §1 rule 1 and §15 are left to the release candidate | Both belong to that session's change |
