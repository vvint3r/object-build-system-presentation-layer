# Writing rules

Step 7 of `docs/plan.md`: the rules for the words in a document built on the kit, written into the
spec and enforced by the checks.

| Date | State |
| --- | --- |
| 2026-10-30 | In progress |
| 2026-10-30 | In review |

## Scope

Section 13 of `kit/report-kit/SPEC.md` holds **every writing rule a document follows**: word limits,
register and per-heading constraints. A rule a page can be measured against becomes a check; a rule
that needs judgment becomes a warning.

The step is done when section 13 holds the rules, the checks enforce them, every kit page passes, and
`kit/agent-brief.md` agrees with the spec. Words inside diagrams and charts, other than captions,
belong to step 6.

## Inputs

### Rules in force

- Section 13 of the spec, and the writing items of its pre-publish checklist in section 14.
- The four owner rules in the "Writing rules" section of `kit/agent-brief.md`.

### Limits

| Item | Limit |
| --- | --- |
| Paragraph | 3 sentences and 60 words at most |
| Sentence | 25 words as the target and 30 at most; 18 words or fewer on average |
| List item | 2 sentences and 40 words at most |
| Prose between headings | 150 words at most |
| Section lede | 45 words at most, with its key phrase in bold |
| Figure caption | 30 words at most: a title and one sentence |
| Heading levels | No level skipped |

### Register and headings

- Plain words: "use", not "utilize"; "so", not "in order to". No emoji.
- A heading is the plainest noun phrase that names what sits under it. No articles or framing words,
  no questions, no verbs unless the section is a procedure, and no adjectives that argue, such as
  proposed, honest, current, revised or improved.
- Bold marks the phrase that carries a sentence's meaning, one or two per paragraph, never a whole
  sentence. No bold label run into the text that follows it.
- No signposting, such as "this section describes", "note that" or "as shown below".
- A document describes its subject as it stands. It carries no history of how it was made and no
  notes about the work.

## Owner-level calls

The inputs disagree in two places. Each goes to `docs/open-items.md` as a question, and the spec's
current rule holds until it is answered.

- Section 13 makes the text before a leading colon bold, as in `<b>Source:</b>`. The register rules
  forbid a bold label run into the text that follows it.
- Section 13 sets sentence case for headings and labels. The owner's heading examples, such as
  "Primary Pillars" and "Type Register", are in title case.

A rule or value not in the inputs above, and a new exemption from the checks for a page or a region,
is also the owner's call.

## Changes

One working session and one pull request, with one commit per group:

1. Section 13 rewritten to hold the rules, grouped into limits, register and headings, with section
   14 and the agent brief in step.
2. A checks module for the rules, registered in `checks/run.mjs`.
3. The gallery, the sample report and the template brought within the rules.
