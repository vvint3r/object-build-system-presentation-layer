# Coverage index vs implementation brief (2026-08-02)

- **Date:** 2026-08-02
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 128–139
- **Status:** historical record, copied verbatim. Current rules are in `docs/spec/rules.md`.

---

Scope source: `uploads/Claude-Design-Instructions.md` (the 8-layer implementation scope), tracked here.

**1 Foundations — ✅ built.** Typography, spacing (breathing floors), layout, radius, color semantics, depth two-family ladder S1–S3 + L1–L3, interaction states, focus. Deferred: stroke iconography, motion spec, dark mode.
**2 Core content components — ✅ built.** Content header (full/compact), section header (collapsible), callouts (7), summary/key-concept/metric/related cards, checklist, definition + reference lists, tables (data/comparison), taxonomy labels, metadata group, status/requirement/difficulty indicators, tabs, buttons. Foundations §12: overview block (purpose/scope in-out/outcomes/audience/effort/related), prerequisite block (typed rows KNOWLEDGE/TOOL/TASK, met-circle + MET/OPEN mono, teal progress track), example block (collapsed + expanded states; INPUT/OUTPUT mono panels; black KEY TAKEAWAY strip — emphasis strips are black, never teal), use-case block (CONTEXT/PROBLEM/APPLICATION/PROCESS/OUTCOME field grid, inline numbered mini-stepper, 900-weight outcome metric).
**3 Structured-content components — mostly built.** ✅ Process (3 views + decisions), workflow (cards + swimlane), framework (pillar/layered/sequential/matrix), method, roadmap (phases × tracks), metric (detail + progress), comparison (cards; table in foundations), requirement, evaluation, learning objectives, knowledge check (single choice), learning progress. ⬜ Model component, cyclical framework, comprehension summary, knowledge-check variants (multi, T/F, reflection).
**4 Visualization library — ✅ built.** Diagram grammar + process flow, user flow, DFD L0/L1, decision tree, system flow, concept map, taxonomy tree, maturity model, selection guide (Diagrams page); swimlane/timeline/matrix/progress inline; 23 families over five pages with capacity tiers and the level model; the chart family and its four empty conditions (Charts). Empty and print states both closed — printed form per tier on the Print page (R25.7–R25.8). Nothing outstanding.
**5 Page templates — ✅ built.** Templates index page (§01 index cards, §02 shared anatomy, §03 nav specimens) + nine full sample pages: T1 topic overview (Experimentation), T2 framework detail (HEART), T3 process detail (A/B lifecycle), T4 implementation guide (platform rollout), T5 learning module (statistical inference), T6 metric detail (data freshness), T7 comparison (stats engine choice), T8 roadmap detail (platform FY27), T9 reference (event taxonomy). Complete — pager-chained T1→T9→hub.
**6 Navigation & discovery — mostly built.** ✅ Breadcrumbs (≤3 levels, spec + live on T1–T5), sticky section nav, tabs, local TOC rail (spec + live on T2), prev/next pager (all leaves), progress indicator, related-content strip, browse-by-type groups (T1), related-topic pills, learning-path resume ("you are here", T5). ⬜ Search results, faceted/filtering browse, recently viewed/saved.
**7 Interaction patterns — partial.** ✅ Expand/collapse, tabs, progress-enabled checklist, quiz feedback/retry. ⬜ Accordions, sorting, filtering, overview↔detail switch, definition popovers, diagram exploration.
**8 Documentation — partial.** ✅ This spec + inventories + assumptions. ⬜ Per-component anatomy/fields/usage docs.
