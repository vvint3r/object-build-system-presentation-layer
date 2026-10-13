# Round 17 (2026-08-08) — the audit model replaced (R17.1–R17.5)

- **Date:** 2026-08-08
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 323–342
- **Status:** historical record from the original library, copied verbatim. The rules in force are in `kit/report-kit/SPEC.md`.

---

Wynt3r's challenge: the ledger's item names carried no meaning in our context. "Feature Page", "Landing Page", "Short Video" were read literally out of the reference checklist and scored as if each were a deliverable, and the in/out boundary was a pile of judgement calls papering over the mismatch. Diagnosis: **two vocabularies were being scored against each other.** The checklist names content *genres*; this system ships presentation *surfaces*. "Is Landing Page built?" has no answer — landing, product and feature pages are the same blocks in different arrangements.

**R17.1 — Capabilities are the unit of account, not genres.** The audit scores 256 presentation capabilities, each named for what it is (criteria comparison table, step sequence, metric with trend) and carrying a level: nano · micro · chart · meso · macro · struct. A BUILT verdict still must name the page or section that earns it; silence is MISSING. This is the only number the roadmap carries forward.

**R17.2 — The checklist is a test corpus, never a roadmap.** All 691 rows stay verbatim for traceability, and every row's status is *derived* from the capabilities it maps to: READY (all built) · GAPS (some partial/missing, which ones named) · BLOCKED (nothing exists). A row is never judged directly.

**R17.3 — Nothing is excluded; rows are classified.** OUT OF SCOPE is retired. A row translates into capabilities, or it is a stated fact about the row: 58 classification axes, 27 content-model fields or off-platform artefacts, 8 roll-ups, 10 §14 conformance checks. Email and social resolve as **delivery channels** — same modules, a different rendering engine — not as things we refuse to build. R-f (the scope boundary) is therefore dissolved rather than settled.

**R17.4 — Ambiguity goes back to the user, it is not guessed.** Six rows are NEEDS RULING (Marketplace Directory, Generator, Live Blog, Live Event Page, User Showcase, Illustration), tracked as R-g. Guessing them would put a wrong number in the denominator and hide it behind a chip.

**R17.5 — Two numbers cross-check each other.** Capability coverage (50%) and corpus renderability (51%) are reported together. A wide gap in either direction is the defect signal: capabilities ahead means the list is padded with surfaces nothing needs; corpus ahead means the list missed something the corpus depends on. Within a point, both can be trusted.

**Findings.** Chart types compressed 25 → 10 families (the design question is which shape of data we can draw). Missing capabilities cluster into eight families, not 83 scattered items: charts beyond one bar strip · forms and inputs · media playback · browse and search · proof and testimonial · authorship and governance · commerce shapes · page shells for glossary, status, event and profile. **18 capabilities have zero corpus demand, 17 of them built** (frameworks, learning modules, journey maps, sequence, ERD, state machines, topology, set relations, BPMN, roadmap board, maturity, progress; the eighteenth, empty state, is an unbuilt phase-B gap and is tagged as such rather than counted with them) — the sharpest evidence that the reference doc describes a marketing site and this system is not one, and the reason it must stay a corpus.

**Standing rule on user-supplied reference documents.** Uploaded lists, checklists and inventories are directional raw material, not literal specifications. Translate them into this system's vocabulary before scoring or building against them; carry the source names for traceability only. Taking one literally is what produced the round 15/16 ledger.

---
