# Round 20 (2026-08-30) — tranche 2 swept, three deliverables shipped, four new rules

- **Date:** 2026-08-30
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 521–563
- **Status:** historical record from the original library, copied verbatim. The rules in force are in `kit/report-kit/SPEC.md`.

---

Tranche 1 (mechanical) closed last round. This round closes tranche 2 and ships the three R20 deliverables. Four new rules came out of Wynt3r's review comments on Composition / Structured / T2 / Diagrams, all of them generalisations of things he had already said once about diagram pages only.

### R19.1 sweep — 172 solid semantic fills → tints
Swept by style attribute across 19 pages plus the four runtime chip generators (Taxonomy Audit `CHIP`/`CHIP_X`, Roadmap `fills`/`rulChip`, Implementing `flagStyle`/`overStyle`, Diagrams at Scale `CHIP`). Tint carries no border; the neutral `#fff` fallback keeps its 1px black. Six pages keep exactly one solid verdict — T6 `Below target`, T8 `High`, T4 `High`, T3 `Critical`, T9 `Deprecated`, Composition `Resolved` — each upgraded to the 1.5px black border the solid form requires. Structured's one solid is the quiz result dot, which only ever renders one state at a time. Every other page now runs at zero, which is legal.

**Two exemptions, both stated rather than discovered later.**
- **Token swatch.** A swatch that names its own hex value (Foundations §01) is the palette, not a semantic fill. Same class of exemption as the dashed SPEC SPECIMEN tag on L2.
- **Data mark.** A chart bar, a legend square, a lane-rail swatch or a progress segment is a mark, not a chip: no label sits inside it, and its meaning comes from the legend. Marks keep the solid hue. Chips, callout labels and status pills do not.
- **Interactive control.** A tint chip that is also an on-canvas control (the decision-tree YES/NO) keeps its 1px black border — there the border is the affordance, not the semantic marker.

### R19.2 sweep — 55 mono container headings promoted to T3
A mono label directly inside a card, shadowed surface or hairline frame was, in 55 places, that container's only heading. All are now `<h3>` at Nunito 700/15/sentence case, keeping their authored casing (the caps came from `text-transform`, so the source strings were already sentence case). Skipped deliberately: metric-card labels above a 900-weight number (the label names the unit, the number is the content), diagram node captions, and spacing-scale specimen labels.

### R20.1 — repeated outlines on the canvas are noise
Wynt3r, on the §07 comparison cards: it is already a container because it is a different colour from the background. What he pointed at was a *grid of three identical outlined boxes*, so the rule is scoped to that: **a grid of peer cards sitting on the #fafafa page canvas is borderless white plus S1.** A single standalone card may keep its hairline, and a card on a white parent always does — which preserves the R8 60/40 mix rather than retiring the hairline. Swept: 86 peer-grid cards across 13 pages (of 133 hairline cards in the library; the other 47 are standalone or nested and are untouched). Depth nesting re-verified at zero afterwards.

### R20.2 — R12.4 was never page-scoped
`#f1f1f1` was retired as a node fill in round 12.4, but the sweep ran on the four diagram pages only. Sixty grey content tiles survived on Structured, T2, T5, T8, T1, T3 and Foundations, and three of Wynt3r's five review comments are about exactly those. Rule now reads for the whole system: **#f1f1f1 is a track and nothing else** — rails, progress and magnitude bars, segmented-control tracks, subtle-fill buttons, table header rows, hover washes, wireframe placeholder zones. A content tile is borderless `#fff` + S1, and its container takes the R12.5 dashed frame. Eleven containers were converted this round (Structured ×5, T2, T5, T8, Diagrams II, III, IV, at Scale) and the whole library now measures **zero depth-nesting violations**.

### R20.3 — the solid black banner is retired
Wynt3r: *"We have to do away with these solid black banners — way too overwhelming."* Black fill survives in five places and no others: chips and pills, the primary button, code surfaces, the one black display slab per section (R19.4), and diagram terminals. A full-width emphasis strip is now either a **corner-bracket sub-block** (KEY TAKEAWAY, Foundations §12 and T2) or **white with a 1.5px black border** (the pillar-framework base, Structured §03). The black table header on Diagrams at Scale §06 went back to the `#f1f1f1` track every other table uses.

### R20.4 — branch controls sit above the line
Round 12.4 put interactive branch controls *on* the line with a 4px white halo. Wynt3r's follow-up: the YES / NO labels still are not visible; place them above or below. Rule: **an edge label sits beside the line, and a branch control sits above it** — `translate(-50%,-100%)` at 8px clearance, no halo. The halo convention is withdrawn.

### Header wrap
The two-row header wrapped its group pills into a line with no row gap, so at ~900px the sixth pill overlapped the second row. `row-gap:6px` on the nav and `row-gap:10px` on the header row, swept across all 22 pages.

### Deliverable — `content-morphia Selection.dc.html` (new page, Composition group)
Three sections, one job: which label, which component, and what must be true before it ships.

- **§01 Label vocabulary — closed.** Seven callouts (NOTE · TIP · IMPORTANT · WARNING · REQUIREMENT · EXAMPLE · LIMITATION), each with its fill intensity, its use condition, and **the nearest label it is not** — because every wrong label observed in the B7 build was a near miss, not a wild one. Plus the six status chips, the three requirement levels, and a ten-row mapping of labels that are *not* in the vocabulary (CAUTION, KEY POINT, RULE, INFO, PRO TIP, BEST PRACTICE, GOTCHA, REMEMBER, KEY TAKEAWAY, DEPRECATED) to the sanctioned label each resolves to. This is the direct answer to R19's finding that there were no rules to break.
- **§02 Component selection matrix — 56 components, four fields each** (when · when not · what goes inside · what never does), filterable by family: containers, sequences, sets, quantities, learning, structures, diagrams, wayfinding. Extends Implementing §05 from 20 source shapes to the full shipped inventory. Three rows name unbuilt components (comprehension summary, cyclical framework, model), each carrying the warn-tint NOT BUILT marker and the substitute to use meanwhile, per the R18.9 precedent.
- **§03 Pre-flight gate — 39 checks in six passes**, ordered to be run against finished output rather than read before starting: count it · tokens · depth · hierarchy and labels · composition · chrome and access. Every item names a number or a boolean, so a pass is a fact. Passes 1–3 are ship-blocking; 4–6 are corrected in place. Interactive, with a progress track, so a run can actually be recorded. Replaces the ten-line checklist below, which predated R12, R18 and R19 and was never run.

### Deferred out of R20
R19.4 (formula ration) and R19.6 (bar geometry) still need a per-section read on the pages that carry maths and magnitude bars — neither pattern is mechanically detectable and neither blocks R21. Recorded here rather than silently dropped.


---
