# Round 18 (2026-08-08) — product context established (R18.1–R18.3)

- **Date:** 2026-08-08
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 343–359
- **Status:** historical record from the original library, copied verbatim. The rules in force are in `kit/report-kit/SPEC.md`.

---

The R-g intent rulings returned two answers and one reframe. The reframe supersedes the questions.

**The product is a knowledge index, not a content marketing site.** Wynt3r: topics are nodes nested deeply; nodes, *and the relationships between nodes*, carry attached **context nodes**; each context node aggregates hundreds of sources and re-aggregates at intervals as net-new information comes into scope.

**R18.1 — the two answers, correctly scoped.** "Nothing updates live" means no live regions, no in-session mutation, no append-while-reading — it does **not** mean undated. Context nodes update between visits, so freshness state (last aggregated, cadence, staleness, what changed since) is load-bearing, not decorative. "No third-party content" means we host no foreign listings and no user submissions — it does **not** mean unsourced. An aggregation of hundreds of sources makes provenance, citation density, and confidence qualifiers core grammar. Marketplace Directory and User Showcase are dropped; Live Blog and Live Event Page are dropped; Generator output renders in-surface as a context-node result view, never as a file handoff.

**R18.2 — imagery ruling.** Diagrams and figures only. A node/relationship index is diagrammatic by nature; illustration slots and user-submitted showcase are out of scope. Existing figure/caption mats stay for supplied diagrams and screenshots.

**R18.3 — the demand column is invalid under this product.** Demand scores were derived from the 691-row marketing-genre corpus and rank the wrong things. Two clusters, measured against the 256 capabilities:

- **Navigate a deep index — 6 built / 2 partial / 7 missing.** Every miss is primary navigation for this product and every one is under-weighted: Faceted browsing (demand 4), Facets (1), Internal search module (1), Search results page (1), Popular & recently updated (2), Diff block (1), Version selector (1). A deeply nested index whose only wayfinding is breadcrumbs plus a partial search bar cannot be browsed.
- **Provenance & freshness — 9 built / 6 partial / 0 missing.** Nothing is absent, but all six partials are exactly the ones that carry "hundreds of sources": inline citation, data qualifier (confidence, sample size), person attribution, research finding module, library/resource centre, release notes. They were built as single-source decoration and must become aggregation-density grammar (source counts, agreement/spread, confidence, last-aggregated).

Consequence for the roadmap: **search + faceted browse and the provenance-density pass displace the Phase B queue.** Corpus rows whose only demand came from marketing genres no longer justify build order. Coverage percentages are unchanged — this reweights priority, not scoring.
