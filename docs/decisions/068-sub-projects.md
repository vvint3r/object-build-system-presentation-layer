# Sub-projects

- **Date:** 2026-10-29
- **Source:** the owner, in session, choosing all four sub-projects offered ("Visualization build,
  Writing rules, Kit features, Claude Design hand-off") in the order offered, and "Run from here"
  (each sub-project started from an orchestrating session) for how their sessions run
- **Status:** in force

---

## Ruling

After the baseline, the work runs as four sub-projects in this order: the visualization build, the
writing rules, the kit features and the Claude Design hand-off.

An orchestrating session briefs each sub-project, splits it into changes and starts each change in its
own working session, on its own branch. Each change returns as a draft pull request. The orchestrating
session reviews it and brings the owner the owner-level calls that `docs/decision-framework.md` sets.

## Reading

A sub-project is a series of working sessions, each holding one change, as `CLAUDE.md` sets it.

The re-import of changes made in the original Claude Design project keeps its date from record 067,
before 14 Dec 2026. It does not wait for the hand-off's turn in the order.

## Changed

| File | Change |
| --- | --- |
| `docs/plan.md` | The migration table splits into the baseline (steps 1 to 5) and the sub-projects (steps 6 to 9). The visualization build moves from step 7 to 6, and the writing rules become step 7. Library adoption moves from step 6 to 8 and takes in page types and the offline mode; the kit to-do list that held the offline mode is removed. The sync moves from step 8 to 9. The operating model and the layout note point to step 9, and the layout note adds `docs/subprojects/` |
| `docs/adoption.md` | The first item of the suggested order points to step 6 |
| `README.md` | The status names steps 6 to 9 as sub-projects and step 6 as next |

## Open

- Whether a later sub-project may start while an earlier one waits on the owner.
- The offline mode adds a packaging mode to section 2 of the spec; its rules come to the owner when
  step 8 reaches it.

## Version

The kit stays at 1.1.
