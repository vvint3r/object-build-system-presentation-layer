# Round 32 (2026-09-01) — Change and status (Q28)

- **Date:** 2026-09-01
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 945–964
- **Status:** historical record from the original library, copied verbatim. The rules in force are in `kit/report-kit/SPEC.md`.

---

**What it settles.** What a node says about itself. A node re-aggregates on a cadence and is never deleted, so state and movement are load-bearing; until now the six status chips existed with no rule for what each one obliges the node to tell a reader, and index-wide change had no surface at all.

`content-morphia Change.dc.html`, ninth page of the Components group.

- ss: 01 **State on a node** — the six closed chips mapped to meaning, what the node must say, and reachability. Draft is unreachable; in review and approved are direct-link only; deprecated and archived stay in the index because other nodes point at them. Live specimen: a six-way segmented control swapping the notice, with **published showing no notice at all**.
- ss: 02 **The index change log** — every change across the index, newest first, filterable by kind with counts. Distinct from the per-node diff at Wayfinding ss: 04, which stays the release-notes answer.
- ss: 03 **Correction** — the notice in place beside its permanent register row, and the one-question test against a revision: was the statement wrong when it was published?
- ss: 04 **Known limitations** — the LIMITATION callout for one limit, the register past three, every row carrying a reason and a date or "no date".
- ss: 05 **Six rules (R31.1–R31.6)** — nothing is removed · only a non-published state draws chrome · absolute dates only · a row exists only where meaning changed · a correction is never silent · a limitation names a reason and a date or no date.

**Vocabulary addition — CORRECTION, the eighth callout.** Crit tint, nearest neighbour "not REVISED — a revision replaced material that was right at the time; only a correction carries a date." The change log therefore takes **four** kinds where a diff takes three (R22.5 unchanged: three kinds inside a diff). Selection ss: 01 intro re-counted to eight callouts / seventeen labels, with Do and Do not stated as paired-list markers outside the count.

**Selection ss: 02** gains a **Change** family, four rows (state notice · index change log · correction notice · limitation register). Also fixed in the same pass: the family chip list had never been updated for rounds 30–31, so the Questions and Glossary rows were unreachable by filter — chips now read fifteen families.

**Nav.** The Components strip was ragged — Prose listed six siblings, Questions five, Charts seven. Normalised across all nine pages to one canonical order: Structured · Charts · Learning · Wayfinding · Provenance · Interaction · Prose · Questions · Change, each page omitting itself.

---
