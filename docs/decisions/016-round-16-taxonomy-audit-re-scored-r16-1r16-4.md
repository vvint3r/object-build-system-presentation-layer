# Round 16 — taxonomy audit re-scored (R16.1–R16.4)

- **Date:** not stated in source
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 302–322
- **Status:** historical record from the original library, copied verbatim. The rules in force are in `kit/report-kit/SPEC.md`.

---

The round-15 boundary was challenged and did not survive. The parse was faithful — all 907 rows come verbatim from `uploads/contenttaxonomychecklist.md` — but the scoring model on top of it had three faults. These four rules replace the round-15 scope note.

**R16.1 — A verdict class per kind of row.** Six classes, not four. BUILT / PARTIAL / MISSING score. **OUT OF SCOPE** is a surface this system will not draw. **NOT A SURFACE** is a classification axis — a dimension content is tagged with (`§0` dimensions, `§5` purpose, `§8` funnel, `§9` SEO role, `§10` measurement, and the `funnel_stage` / `conversion_goal` / `measurement_events` fields). Scoring an axis as built or missing is a category error; it is neither. **CROSS-REF** is the same item listed a second time elsewhere in the source. Only the first three enter the denominator.

**R16.2 — The scope line is content, not subject matter.** If a thing can be published as an artifact it is in, whatever domain it comes from: comparisons, alternatives, competitor battlecards, personas, industries, integrations, tool profiles, downloadables. If its job is to convert, collect or distribute rather than to inform it is out: pricing and plans, landing and lead-magnet pages, signup and lead forms, conversion modules, community and UGC, email, social, sales enablement. Ruling out a whole group is only legal when every row in it fails that test — §1.4 failed this and took seven real page types with it.

**R16.3 — Score once, show the parent path.** An item that appears in several sections is scored at its primary and marked CROSS-REF everywhere else, naming where the primary is. Rollup rows ("blueprint complete") are never items. Every ledger row displays its full parent path — the source lists Checklist as a page (§1.3), a component (§3.2) and a blueprint step, and only the path distinguishes them. Level-distinct namesakes (a §2.4 module and its §3.3 component, a §3.7 component and its §4.3 atom) are separate items, not duplicates.

**R16.4 — §13 is not carried.** The condensed master list restates §§1–3 in shorter words. It is dropped from the ledger entirely rather than held as an unscored mirror.

**Corrected result.** 907 rows − 216 (§13) − 61 axes − 19 cross-refs − 94 out of scope = **517 scored: 224 built · 80 partial · 213 missing · 43% built, 51% with partials at half.** The score fell from 45%: 29 items were reclaimed and most are unbuilt, and the old figure was flattered by axes that could never fail.

**Shape restated** (built ÷ scored): nano objects 66% · blueprint steps 61% · content structures 56% · CMS fields 52% · meso modules 49% · micro components 39% · macro containers 17% · distribution formats 0%. Macro coverage is worse than round 15 reported, because the reclaimed page types are all missing.

**Queue effect.** **Q33 Comparison and profile pages** joins Phase F — alternatives, battlecard, persona, industry and integration pages plus the profile shape behind the product/plan/review/customer cards. Nine families now, Q25–Q33; queue 31 → 32. R-f is settled and closed.


---
