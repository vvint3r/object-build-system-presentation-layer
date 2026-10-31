# Structured components

- **Date:** 2026-10-30
- **Source:** record 076 and `docs/subprojects/kit-features.md`, through the orchestrating session's
  brief for round 3; open choices taken by the session under the delegation in record 075
- **Status:** in force

---

## Rules

Section 8 of `SPEC.md` sets the shared anatomy, and sections 8.25 to 8.30 hold each component;
section 13.1 gains their limits and section 14 gains item 18. Every new check is a failure, in
`checks/structured.mjs`.

| Component | Rule | Check |
| --- | --- | --- |
| Every structured component | A card with its kind class, opening with its kind label and a T3 title; no `cm-emph`, `cm-featured` or verdict chip inside; stages, criteria, bands and the matrix only in their own component | `structured-anatomy` |
| Facts | `dl.cm-facts`, 1 to 5 facts as `div > dt + dd`; keys of 1 to 3 words; values of 12 words at most | `facts` |
| Parts | `li.cm-tile` with a name of 3 words at most and one sentence of 25 words at most; a matrix is an `ol` of exactly four cells, each opening with its position label | `parts` |
| Scope | One or two lists, `Use when` then `Not for`, or `Holds when` then `Breaks when`; 1 to 3 items of one sentence | `scope` |
| Workflow | One-sentence lede; 3 to 6 stages in `ol.cm-stages`; each stage opens with a heading `.cm-procedure__title` one level below the card title, 4 words at most, then one sentence of 20 words at most and its facts; keys from Actor, Takes in, Produces, Hands on when; Actor on every stage, Hands on when on all but the last; Exceptions with 1 to 3 items | `workflow` |
| Framework | One-sentence lede; one parts list of 3 to 6 parts; a scope, when present, has `Use when` | `framework` |
| Model | A claim in `p.cm-t5`, one sentence of 30 words at most; one paragraph of 2 sentences at most; 2 to 5 parts; one matrix at most; a scope with `Holds when` and `Breaks when` | `model` |
| Method | One-sentence objective; a scope with `Use when`; Steps of 3 to 7, one sentence of 20 words at most each; a Decision of 1 or 2 sentences, never a question | `method` |
| Requirement | Kind label `Requirement` and a key such as `REQ-04`; card id the key in lower case; statement and rationale; Level, Status and Owner with Level and Status chips from their sets; 1 to 5 acceptance criteria of one sentence | `requirement` |
| Evaluation | One-sentence lede; 2 to 6 criteria, each `N of M` on one scale, a name of 4 words at most, one sentence of evidence and `weight N`; a weighted score equal to the weighted mean to one decimal; one status chip from Adopt, Hold, Reject with its offset; a paragraph after the result; a caption with a source line | `evaluation` |
| Metric detail | A definition of 15 to 60 words; a property sheet with Formula in `<code>`, Unit, Direction from its set, a cited Source and Owner; 2 to 4 threshold bands with one status chip from On track, At risk, Breach; related metrics as a related list of 1 to 4 items tagged Metric; no KPI, meter, spark, chart, delta or status block inside | `metric-detail` |

The existing checks read the new markup: a fact key is a label for type size, an evaluation score is
not prose, a workflow stage title is a heading for the heading checks, and the related list check
reads a metric detail's related metrics.

## Calls

- **Card form.** Each component is a card with its kind label and title, read in order and printed
  whole. None is a figure, so none needs a figure number, a description line or a text version.
- **Shared parts.** Facts, parts and scope are three part forms shared by every component, so seven
  components add four list forms between them rather than one each.
- **Facts.** A facts row sets key over value as the status block does, with the key a label. A
  property sheet stays the form for the facts about a section's subject.
- **Register anatomy.** Evaluation criteria and threshold bands take the register list of the
  limitation register: a hairline between rows, the chip column on the right, one column on a phone.
- **Procedure reuse.** Workflow stages take the procedure's numbered list, gutter and step title
  class. The list keeps its own class, `cm-stages`, because a stage closes with its actor and its
  hand-off where a procedure step closes with an outcome, and the procedure check requires the
  outcome. A stage title is a noun phrase; a step title is an instruction.
- **Stage titles as headings.** A reader looks up one stage, and the heading lets a reader jump to
  it. Each stage then starts its own count of the 150 words between headings, and the heading rules
  keep the title a noun phrase.
- **Workflow and diagrams.** The workflow is text; the flow diagram (section 8.20) is the picture.
  A page may carry both with the same stage names, the diagram first.
- **Verdict chip.** The evaluation's verdict is a status chip with its offset. The solid verdict chip
  stays with tables and figures, so the one-per-table-or-figure rule is unchanged.
- **Requirement status.** The status chip uses the masthead's words, Draft, In review and Final, so a
  document carries one set of status words.
- **No met marks.** Acceptance criteria carry no met or unmet marks. Whether a criterion is met
  changes, so a result belongs in the status block or an evaluation.
- **No current value.** A metric detail defines a measure and holds no number that will change. The
  value for a period sits in the KPI strip of a report or the status block of a reference.
- **Related metrics.** A metric detail's related metrics are a related list with the Metric tag, so
  every related item in the kit has one form.
- **Matrix.** A two by two is an ordered list with a position label on each cell, so it reads the
  same stacked on a phone. Any other schematic is a figure.
- **Prose limits.** A component's prose shares the 150 words allowed between headings; its own
  limits hold as well.
- **No emphasis.** A component carries no `cm-emph` or `cm-featured` and takes no place in the
  emphasis budget.
- **Sample report.** Unchanged. Its escalation path stays a process diagram, the overview a report
  needs, and no other block in it is a structured component shown in a weaker form.
- **Gallery checklist.** The gallery's agent checklist has no line for structured components. Its
  cards sit at the limit of prose between headings, and section 14 of the spec is the full list.

## Deferred

The roadmap board waits for the page types, where a roadmap is a page of its own. Comparison cards
stay out, since the comparison table covers options compared on the same dimensions. The swimlane
view is the flow diagram's. The vertical stepper, the compact step summary, difficulty dots and a
confidence chip stay out of the kit. A metric's progress to target and its breakdown by source are
current values and go in the KPI strip, the status block or a chart. The learning module stays with
the Learning row of `docs/adoption.md`.

## Version

The kit stays at 1.2. The version for this change is the orchestrating session's call.
