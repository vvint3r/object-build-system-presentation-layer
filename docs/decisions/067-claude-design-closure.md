# Claude Design closure

- **Date:** 2026-10-26
- **Source:** the owner, in session: "Yes, add the closing date and re-scoped last step."
- **Status:** in force

---

## Ruling

Standalone Claude Design (claude.ai/design) closes by 14 Dec 2026, and Claude Design now lives inside
Claude. The last migration step builds the design bundle and syncs it to Claude Design inside Claude;
the target project, the sync method and the bundle's form are settled when that step starts. The
design-system project set up in standalone Claude Design as the sync target closes with it. Changes
made in the original Claude Design project after 13 Oct 2026 are re-imported before 14 Dec 2026.

## Grounds

The notice of the Claude Design connection that `/design-sync` uses, read on 26 Oct 2026:
"Standalone Claude Design (claude.ai/design) closes by December 14, 2026. Claude Design now lives in
Claude."

## Changed

| File | Change |
| --- | --- |
| `docs/plan.md` | The operating model names Claude Design inside Claude as the consumer, gives the closing date, and sets it as the deadline for re-importing the original project; step 8 syncs to Claude Design inside Claude, with its target settled when it starts |
| `README.md` | The consumer line no longer names `/design-sync` or the standalone project; the status matches the migration table |

## Open

Step 8's target project, sync method and bundle form.

## Version

The kit stays at 1.1.
