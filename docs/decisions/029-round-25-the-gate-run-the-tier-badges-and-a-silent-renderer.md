# Round 25 — the gate run, the tier badges, and a silent renderer bug

- **Date:** not stated in source
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 734–755
- **Status:** historical record from the original library, copied verbatim. The rules in force are in `kit/report-kit/SPEC.md`.

---

**Q04 — the pre-flight gate, run as a static scan over all 30 live pages** (not the four diagram pages the item named). Passes 1–3 are token passes, so they can be measured rather than eyeballed. Findings and fixes:

| Finding | Count | Fix |
|---|---|---|
| `#f7f7f7` hover wash — off the sanctioned grey set | 16 (Diagrams §10, Foundations §11 + tables) | → `#f1f1f1`, which rule 4 already names as the hover wash |
| `#e6e6e6` control hover | 7 (tabs, subtle buttons, tree reset) | Inactive tabs on an `#f1f1f1` track hover to `#fff`; subtle-fill controls take the L1 lift instead of a darker fill |
| Mono labels at 9px against the 9.5 floor | 85 across 11 pages | Swept to 9.5. Ticks may sit at 9 but 9.5 is legal there too, so the sweep is uniform |
| Hover lift at `rgba(0,0,0,.25)` | 1 (Foundations secondary button) | → `.18`, the R8 L1 value |
| Second untagged L2 on Diagrams | 1 (§03 user-flow emphasis) | → L1e. R12.2 always required emphasis to be L1e, not the reserved teal; the §01 token specimen keeps its dashed SPEC SPECIMEN tag |
| `#e4e4e4` on Implementing | 1 | Confirmed false positive — it is a checklist row whose *text* names the retired token |

Remaining solid semantic fills (Foundations 6, T6 3, Taxonomy Audit 3, T8 2, Structured 2, Diagrams III 2) were vetted in R20 as token swatches, data marks and one-verdict pages; not re-litigated. Off-palette hexes: zero after the sweep.

**Q02 — tier badges.** 21 specimens across the five diagram pages now carry a mono chip stating tier and node count: Diagrams §02 7 nodes · §03 5 · §04 L0 4 / L1 7 · §05 5 · §06 8 + 4 boundaries · §07 6 nodes / 5 edges · §08 20 rows / 4 groups · §09 5 stages; Diagrams II 5 participants / 5 entities / 6 states / 9 nodes / 5 layers; III 5×5 phases-lanes, 5×4 steps-lanes, 14 nodes / 17 flows; IV 20 nodes / 3 sets + 7 regions / 19 nodes / 8 nodes + 3 lanes; At Scale §05 9 · 23 · 12. The §07/§08 half of Q02 needed no work: both were already node/edge data rendered through `sc-for` (the concept map computes edge geometry from a six-node registry; the tree renders 20 rows from a group/item structure). Counts were read from the data, not estimated.

**A silent renderer bug, found while building Anatomy — and it had shipped.** `<sc-for>` placed inside `<table>`/`<thead>`/`<tbody>` is foster-parented out of the table by the HTML parser, so every hole inside the loop resolves to nothing and the rows render blank. Affected, live, unnoticed: **Implementing §02 the 25-row adjacency table, §04 density ceilings, §05 shape→component, §07 composition spine · Composition §01 type tiers, §02 device limits, §03 depth positions · Interaction §02 the sortable register.** Eight blocks — the entire evidential content of the implementer guide. All eight rebuilt as grid rows (one `grid-template-columns` repeated per row, zebra and radius on the row); all four pages now load with zero runtime warnings. Rule added to CLAUDE.md's environment section, because nothing in the visual language caused it and nothing in the visual language would have caught it.

**Roadmap re-baselined.** Layer completion re-scored against what R23/R24 actually shipped: foundations 95 · core 100 · structured 95 · visualization 90 · templates 100 · nav 95 · interaction 90 · docs 80 → weighted **93.8 → 94%** (was 80%). Queue: 17 items flipped to done with their evidence named (Q02–Q09, Q11–Q19), Q10 narrowed to print states only, three rulings closed on the tracker (R-a code hue, R-b non-teal underlines, R-i the 11 corrections). v0.3's three gates are met; v0.4 is in progress. Open rulings: three — stroke icon set, body at 15.5px, and the ecosystem-map offer.
