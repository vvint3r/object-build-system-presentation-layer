# Round 15 (2026-08-07) — Q01 taxonomy audit (the v0.3 gate)

- **Date:** 2026-08-07
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 282–301
- **Status:** historical record, copied verbatim. Current rules are in `docs/spec/rules.md`.

---

`uploads/contenttaxonomychecklist.md` scored item by item against the live inventory. New page `content-morphia Taxonomy Audit.dc.html` (§01 verdict · §02 method + scope boundary · §03 scorecard by level · §04 the 691-row filterable ledger · §05 what it adds to the queue · §06 the one ruling). Data is generated into `taxonomy-audit-data.js` and loaded from the helmet; the page is the view, the file is the record.

**Two corrections to the record.** The checklist holds **907 checkboxes, not 1083** — that figure was the file's line count. And §13 (216 items) is a condensed restatement of §§1–3, so scoring it would inflate numerator and denominator together.

**Denominator.** 907 − 216 restated − 140 in ten out-of-scope groups − 45 items ruled out individually = **506 scored**. Result: **228 built (45.1%) · 82 partial (16.2%) · 196 missing (38.7%)**; 61% counting partials at half.

**Method (RATIFIED).** Four verdicts — BUILT / PARTIAL / MISSING / OUT OF SCOPE. A BUILT verdict must name the component, page or section that earns it; the default for an unnamed item is MISSING, so silence counts against the system. Existence and rule-compliance only — quality is the round-6 review's job, not this one's.

**Scope boundary (pending ruling R-f).** Out: the commercial funnel (§1.4, §2.7), community and UGC (§1.9), corporate/legal pages (§1.11), the classification, purpose, funnel, SEO and analytics model layers (§0, §5, §8, §9, §10), and other channels (§11 email/social/sales/downloads — print overlaps and stays as Q10). 185 items total. Confirming settles the denominator; reopening a group is new work.

**Shape of the result** (built ÷ scored, out-of-scope excluded). Nano objects 66% · content structures 64% · blueprint steps 54% · CMS fields 52% · meso modules 49% · micro components 40% · macro containers 19%. The system is deep where it is built and narrow across container types: nine page templates against forty-plus named page types.

**§14 conformance — 8 of 10 built, 1 partial.** The taxonomy's own test is whether a model keeps macro / meso / micro / nano apart; ours does, and the SPEC is organised on exactly that split. Only "nano level defined and applied" is partial: atoms render but are not documented as a field family (Q18).

**Queue effect.** Q01 closes. The 196 missing items collapse into eight families, added as **Q25–Q32** (prose primitives · question-and-answer · glossary + definition template T10 · change and status · case study T11 · API reference blocks · troubleshooting and recovery · authorship and governance). Three existing items gained a count behind them: Q09 charts (17 of 25 visualisation components), Q11/Q12 search and facets (11 items), Q20 icons (three levels of the taxonomy at once). Queue 24 → 31.


---
