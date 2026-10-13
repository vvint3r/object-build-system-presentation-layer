# Round 21 (2026-08-30) — the reference exemplar

- **Date:** 2026-08-30
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 564–586
- **Status:** historical record, copied verbatim. Current rules are in `docs/spec/rules.md`.

---

`content-morphia Exemplar.dc.html`. The B7 source document ("Power, Sample Size & Duration", 22 h2 sections / 48 h3 / 671k chars) rebuilt as **one page type done exhaustively** — a method leaf. Seventeen pages describe the system; this is the first that shows an agent what correct output looks like. Points at it first, spec second.

**Why a method page.** The source material is a statistical method with four parameters, one defining equation, a costed design, a registered timeline, and five failure patterns. The template set had no method leaf, and the R20 matrix exposed the gap. It is also the shape that exercises the hardest R19/R20 rules at once: the formula ration, the density ceilings, the figure spec, the containment test, and the one-verdict rule.

**Structure — 6 sections against a ceiling of 8.** §01 what sizing decides (the anchor, one S2 module with an inset divider) · §02 four dials, one equation (the section's one black slab + a four-tile S1 peer grid + an IMPORTANT callout) · §03 what the design costs (the itemised invoice table + a magnitude-bar figure at the R19.6 geometry, with the full R19.11 three-part treatment) · §04 the registered timeline (the page's single L2, holding two corner-bracket sub-blocks) · §05 reading a null (its own slab + two compared peer cards + a LIMITATION callout) · §06 how it goes wrong (a numbered list sitting on the page with no containers at all, plus a NOTE).

**Measured gate run, recorded on Selection §03.** 6 sections · 1 surface cluster per section against a ceiling of 2 · 1 untagged L2 · 1 solid semantic fill (pitfall 2's `8.7× under-sized`, the document's sharpest verdict) · 1 black slab in each of two sections and none elsewhere · 0 depth-nesting breaches · 0 grey or teal text · 0 type below 9.5px · radii {4, 6, 12, 14} · 0 clickable divs · h1 ×1, h2 ×6, aria-current present. The run ships on the gate page as "a cleared run" so an implementer can see what passing looks like in numbers.

**Contrast with the agent build it replaces.** 22 sections → 6. 82 shadowed modules → 5 surfaces. 102 corner brackets → 2. 120 dotted dividers → 0. 19 tables → 1. The material is the same material; what changed is selection and quantity, which is exactly what R18.6 predicted no appearance rule could fix.

**Type-floor sweep, caught by the gate's own pass 2.** Running the gate on the exemplar surfaced 173 mono labels at 9px across 15 pages — page badges, related-card relationship lines, pager labels — all below rule 3's 9.5px floor and all pre-existing. Raised in the same pass; 9px survives only where rule 3 allows it, on chart ticks and axes. The gate found a library-wide defect on its first real run, which is the argument for it existing.

**Two gate-mechanics notes, from running it for real.**
- **Probe against the host scale, not against the authored value.** The first run reported `brackets: 0` on a page that renders two. The probe tested `borderLeftWidth === '2px'`, but the host applies a ~0.877 scale to the frame, so the computed value is 1.754px. Any pass-1 or pass-3 check written as an equality on a computed length is unreliable; compare against the authored value scaled, or test `> 1`.
- **A one-surface module with a vertical inset divider needs its own stack rule.** The exemplar shipped without one, so below 640px the divider stayed as a 144px hairline pointing at nothing with an orphan 28px indent. The per-module `@media(max-width:640px)` block that rotates the divider to `border-top` is not optional and is now on `#x1-anchor`. T1 already carried its equivalent on `#t1-intro-split`; those two are the only vertical inset dividers in the library. Added to pass 6 in practice: check 640 on any module that divides vertically.

**Cross-links.** Templates hub gains a REFERENCE BUILD card (L1e, so it reads as the emphasised entry without claiming the hub's reserved teal); the T1→T9 pager chain extends T9 → Exemplar → hub; the exemplar footer links back to the gate run.


---
