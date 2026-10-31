# Sequence, state and entity relationship diagrams

- **Date:** 2026-10-30
- **Source:** the orchestrating session, under the owner's delegation in record 075; scope from
  record 076 and `docs/subprojects/visualization-build.md`; the flow contract of record 077
- **Status:** in force

---

## Rules

Section 8.20 of `SPEC.md` holds the rules, one level-4 subsection to a mode: Sequence, State and
Entity relationship. The kit's script draws each mode from `data-diagram` and writes its text
equivalent. Every new check is a failure, in `checks/sequence.mjs`, `checks/state.mjs` and
`checks/entity-relationship.mjs`; the shared checks in `checks/diagrams.mjs` read every mode.

| Rule | Source | Check |
| --- | --- | --- |
| `data-diagram` names a mode the kit has: flow, sequence, state or entity relationship | §8.20 | `diagram-json` |
| Sequence JSON: `nodes` and `edges` only; a message kind is message, reply or optional; `activate` is true or false | Record 076, diagrams are data | `sequence-json` |
| Every message joins participants and carries a label; a bar opens on a participant with none open, from another participant | §8.20, Sequence | `sequence-edges` |
| At most 4 participants and 12 messages | Print measurement; library record 010 | `sequence-capacity` |
| Participant label 24 characters, detail 40, message 1 to 3 words | Record 077 limits | `sequence-labels` |
| The text version lists every message | Record 076, the text equivalent | `sequence-text` |
| State JSON: start, state and end nodes, one to a cell; exactly one start | Record 076, diagrams are data | `state-json` |
| One unnamed transition out of the start, none in; none out of an end; every other transition named, no event twice out of one state | §8.20, State | `state-edges` |
| At most 24 nodes, 4 columns, 5 rows, 12 transitions and 1 emphasised state | Print measurement; record 077 ceilings | `state-capacity` |
| State label 24 characters, detail 40, event 1 to 3 words, emphasis 1 or 2 words | Record 077 limits | `state-labels` |
| The text version lists every state | Record 076, the text equivalent | `state-text` |
| Entity relationship JSON: entities with attributes, one to a cell, each naming a primary key; both ends of every relationship counted in words | Record 076, diagrams are data | `er-json` |
| A relationship joins two different entities, its `from` entity first in reading order; at most 4 relationships to an entity | §8.20, Entity relationship | `er-edges` |
| At most 6 entities, 2 columns, 3 rows, 7 relationships and 6 attributes to an entity | Print measurement | `er-capacity` |
| Entity label and attribute name 24 characters, relationship name 1 to 3 words | Record 077 limits | `er-labels` |
| The text version lists every entity and every relationship | Record 076, the text equivalent | `er-text` |
| Labels a mode sets beside a line, such as a count, stand 8px clear of every line, node and label; a lifeline and an activation bar count as lines | Record 076 values | `diagram-layout` |

## Measured text

The checks read each diagram twice, as record 077 does: the JSON as written, and the drawing as the
kit made it in light, dark and print.

| Scope | What counts | What does not |
| --- | --- | --- |
| Diagram text | Participant, state and entity labels, details, attribute names, message labels, events, relationship names and counts, each against its own limit | Prose limits, register and heading rules |
| Text version | One item for each message, each state, or each entity and relationship, none empty | Its wording, which the script writes from the data |

## Calls

- **Dispatch.** Each mode is a block of its own in `cm-report.js`, entered by `data-diagram`. State
  and entity relationship diagrams reuse the flow grid and router through hooks; a sequence diagram
  has a geometry of its own, since order places everything.
- **Sequence labels.** A message label stands above its arrow in the gap beside the sender, so no
  label sits on a lifeline. A label on a lifeline would break it, or read as that lifeline's.
- **Sequence lines.** A reply is dotted, as the brief sets; an optional message is dashed, as an
  optional flow edge. Lifelines take the field colour at 1.5px, so they read as structure.
- **Activation.** A message marked `activate` opens a bar on its receiver, closed by its next reply
  or by the last message. One bar at a time to a participant keeps nesting out.
- **State markers.** The start is a filled dot and an end a ringed dot, each in a cell of its own, as
  in common state notation. A state is a flow step's rounded rectangle.
- **Self-transitions.** A loop on the first side of the state, in reading order, that no other
  transition uses, with the event beyond it. The grid gap on that side grows to hold loop and label.
- **Counts in words.** Entity relationship counts are written as 1, 0 or 1, 1 or more and 0 or more,
  not as crow's feet. Words need no notation and pass the label checks; crow's feet need a key of
  four marks and read poorly at 80% print scale.
- **Count placement.** A count stands beside the entity it counts, below a line across or right of a
  line down, with the name on the other side. Two counts on one straight line stand 24px apart, so
  each reads with its own end. The key says a count tells how many of the entity beside it.
- **Reading order.** A relationship's `from` entity comes first in reading order, so its verb reads
  left to right or top to bottom, the way the drawing is read.
- **Plain relationship lines.** No arrowhead, and the line runs on to meet the entity box. One
  relationship to a side of an entity, so every line ends at its own place.
- **Entity size.** An entity takes the width of its longest attribute and the height of its list.
  Entities in one column share a width; heights stay their own.
- **Capacity.** Ceilings come from print, measured with the longest text each limit allows. A state
  diagram of 5 columns draws 972px wide and prints at 778px at 80%, over the 632px column. A sequence
  of 5 participants with three-word messages draws 924px wide, 739px at 80%. An entity relationship
  diagram of 3 columns draws 920px wide, 736px at 80%; 4 rows of six-attribute entities draw 1048px
  tall, 838px at 80%, over the 720px page height; 2 columns and 3 rows of six 24-character
  attributes print at 93% and exactly 720px tall.
- **Text versions.** A sequence lists messages in time order, naming replies, self-messages and the
  message that closes each bar. A state diagram lists states from the start, each event with where
  it leads. An entity relationship diagram lists entities with their keys, then each relationship
  with the count at each end, such as "Ticket per Customer: 0 or more".
- **Shared flow code.** `dgMeasure` sizes state and entity boxes; `dgCost` keeps one relationship to
  an entity side; `dgLabels` places a loop's event and widens a gap where a crossing line cuts the
  run a label needs; `dgLayout` takes a mode's gaps, label placer, loops and gap growth; `dgDraw`
  draws lines with no arrowhead and places a mode's extra labels. Flow output is unchanged.
- **Pages.** One gallery example to a mode in Part 07 (7.3 to 7.5), with copy-paste JSON. The guide
  gains one sequence figure in Part 03, cited to its policy source. The sample report and the
  reference document are unchanged.
- **Review.** Light, dark, print and 390px screenshots of every new diagram were judged by a
  reviewer who had not read the spec. The reverse-reading relationship name and the unexplained
  counts it found are fixed by the reading-order rule and the key.

## Values

All within record 076 (strokes 1.5px and 2px, labels 8px clear) and record 077 except these:

| Value | Use | Reason |
| --- | --- | --- |
| 16px dot | State start | Reads as a marker beside 15px state names |
| 22px ring, 1.5px, with a 13px dot | State end | The start's dot inside a ring, as common notation draws it |
| 32px out, 32px across | Self-transition loop | Clears the 12px elbow radius twice at 80% print scale |
| 12px wide, radius 2, 1.5px ink | Activation bar | Narrow enough to read as a mark on a lifeline, wide enough to see at 80% |
| 40px by 24px | Message to oneself | Room for an arrowhead on the way back |
| 16px | From the participants to the first message label | The kit's 16px step |
| 24px | From the last arrow to the end of the lifelines | Shows that the lifelines run on past the last message |
| 64px, 40px in print | Least gap between participants | The flow column gap |
| 16px, 8px in print | Added between message rows | Separates a label from the arrow above it |
| 96px by 72px, 64px by 56px in print | Least gaps between entities | Every line carries a count at each end |
| 24px | Least space between two counts on one line | Three times the label clearance, so the counts read apart |

## Owner questions

None. The orchestrating session reviews the values above under record 075.

## Version

The kit stays at 1.2. The version for this change is the orchestrating session's call.
