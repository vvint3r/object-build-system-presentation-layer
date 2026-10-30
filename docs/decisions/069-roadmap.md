# Roadmap

- **Date:** 2026-10-30
- **Source:** the owner, in session. On 29 Oct 2026, of the recommended answers to the kit's open
  items: "Yes, I'll approve the recommendations." Of the open pull requests: "You can merge the drafts
  (if that's what you think is best - I'm not the best source for that decision)." Of the writing
  rules: "Yes, you may start on that before the diagrams and charts work." On 30 Oct 2026, of the
  roadmap and its recommended answers: "Yes, it's approved with your recommendations, so please
  continue."
- **Status:** in force

---

## Ruling

The plan ends when step 9 is done: a document composed in Claude Design from the synced bundle
passes the kit's checks. Each step in `docs/plan.md` states when it is done.

Steps 7 to 9 run in that order and do not wait for step 6. Step 6 starts on the owner's direction
for it.

Step 8 adopts provenance; change and status; wayfinding and multi-document navigation; structured
components, then page types; and adds the offline packaging mode. The other rows of
`docs/adoption.md`, learning, inputs and icons among them, are adopted when content calls for them,
outside the plan.

The orchestrating session merges a pull request once it has reviewed it. Syncing to Claude Design
and publishing stay with the owner.

## Answers

The twelve items open in `docs/open-items.md` on 30 Oct 2026 take these answers. Each is fixed in
the kit, and its item deleted, by the change that implements it.

| Item | Answer |
| --- | --- |
| Jump targets under the top bar | Every linked target clears the top bar by an offset that follows the bar's height |
| Contents strip on narrow screens | The current link keeps its normal weight and is marked in a way that keeps its width |
| Category axis titles | A named category axis title gets the same room as a value axis title |
| Plot padding set by hand | The chart script works out plot padding; the padding set by hand on the two kit pages is removed |
| Emphasis demo | The gallery's demo splits over two paragraphs so each keeps to three highlights, and a check enforces the limit |
| Concept terms and links | Key terms take a treatment links never use, such as a dotted underline |
| Context marks | A grey context mark a reader needs to read carries a direct value label; the grey stays |
| Disclosures with more than one block | A disclosure body spaces its own blocks, and the block-gap check covers it |
| Chart text starting with a dollar sign | The spec states that only token names resolve as colours; other text starting with `$` stays text |
| Print button | Optional; a document shows it only when it asks for it |
| Focus on one mark | A picked-out mark keeps the default colour, and the rest of its series takes `$context` |
| Documents without measured numbers | The agent brief's reading stands: a required block with no content is left out with a comment saying why; section 7 of the spec states it, and the four checks accept the commented omission |

## Reading

- The fixes run as parallel changes grouped by the files they touch, one commit per item. This
  departs from one open item per session, so that no two changes edit the same code at once.
- The agent brief's kit links move once, with the 1.2 release, rather than after each fix merges.

## Changed

| File | Change |
| --- | --- |
| `docs/plan.md` | The migration states the end point, a condition for done on each step, and that steps 7 to 9 do not wait for step 6. Kit 1.2 is added. Step 8 names what it adopts. The layout lists `docs/subprojects/` |
| `docs/adoption.md` | The suggested order becomes the order, with items 2 to 5 as step 8 |
| `docs/decision-framework.md` | Merging a reviewed pull request moves from the owner level to the reported level |
| `docs/decisions/068-sub-projects.md` | Its first open question is marked answered |
| `docs/subprojects/writing-rules.md` | The brief for step 7 |
| `README.md` | The status |

## Version

The kit stays at 1.1 until the twelve answers are in the kit and every kit page passes the checks.
It then becomes 1.2.
