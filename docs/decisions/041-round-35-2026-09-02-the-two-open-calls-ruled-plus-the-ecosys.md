# Round 35 (2026-09-02) — the two open calls ruled, plus the ecosystem offer closed

- **Date:** 2026-09-02
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 982–999
- **Status:** historical record, copied verbatim. Current rules are in `docs/spec/rules.md`.

---

Wynt3r's three answers, in his words: icons approved, body at 15.5px, and the NodeTrak example stays because there is no real ecosystem data to share yet. All three were open rulings on the Roadmap (R-c, R-d, R-e); all three are now closed and none remains open.

**R33.1 — icons.** Treatment C (partial fill) is adopted. One 24px outline family, black at 1.5px, with a solid twin per shape; the accent enters as a fill above a waterline at **13 of 24**, one constant for the whole family, drawn by clipping the solid twin under the unchanged outline. It was chosen over outline-only (no accent at all, so the reference image's effect is lost) and full-fill (every glyph becomes an accent mark, which spends the reservation). Cost per glyph is zero because the twin already knocks its own interior detail out.

The ration, now locked as rule 18: fill at 20px and above only (at 16px the band is under 9px and reads as a printing error) · at most one filled glyph per view, at the same altitude as the reserved offset shadow · four allowed placements, and where two meet in one view the fill goes to the higher — callout label 20 (fill) · empty state 32 (fill) · index or hub card 24 (outline only, because a grid of peers filling every card is the texture the ration forbids) · register row label 20 (outline only) · never in a sentence, a nav pill or tab, a table cell, a status chip, a button, or a list bullet.

**R33.2 — body at 15.5px.** Swept across every live page: **320 body declarations** (313 weighted `400/15`, 7 unweighted at 1.85 leading), plus the Foundations type ladder annotation, the Composition T4 row, the Anatomy reading-column and body-field rows, and the Print token table's screen value. Only the body tier moved. A 15px string at weight 700 is a T3 module title and a 15px string at 800 is a card title; both were left alone, which is why the sweep keyed on `font-size:15px;font-weight:400` rather than on the size. R28.4 (a T3 heading outranks its own rows) now reads "at body size" instead of naming 15px, since the collision it guarded against no longer exists — T3 700/15 against body 400/15.5.

**R-e — the ecosystem map.** Declined for now, at his call. The tier-3 canvas at Diagrams at Scale ss: 05 keeps the invented NodeTrak analytics platform (9 / 23 / 12 nodes). The offer stands for when real data exists; the value would be proving the capacity ceilings against node counts that were not designed to fit them.

**Page changes.** `content-morphia Icons and body size.dc.html` is deleted and replaced by `content-morphia Icons.dc.html` — a rules page, not a decision sheet, per the page-genre rule: ss: 01 the set and its treatment (both states on seven glyphs, how the fill is drawn, where the fill starts on the 16/20/24/32 ladder) · ss: 02 the ration and the three conditions it was set against · ss: 03 the four allowed placements as a register, plus the six placements that never carry a glyph. The A/B/C comparison and the 15-versus-15.5 measurement block are gone: both were decision aids, and a deliverable page carries the outcome. Foundations group is now four pages; the strip on Foundations and Equivalents carries Icons.

**Roadmap.** R-c, R-d and R-e closed; **zero rulings open** for the first time, so ss: 05 carries an empty state naming the condition. Q20 turns from a deferred build into the next sweep — the treatment is specified, so what remains is pulling the working glyphs the four placements need and replacing the interim two-letter glyph tiles. Layer 01 Foundations 95 → 97; weighted total 96.0%.

**Debt created.** Two items, both deliberate. (1) The glyph-tile sweep (Q20) is queued, not done — Foundations ss: 14 and every other interim tile still stands. (2) `content-morphia Depth & Density.dc.html` has no ALSO IN FOUNDATIONS strip at all, so Icons is not reachable from it; it predates the nav sweep and needs the second header row added. Also noted in passing and not fixed: Implementing ss: 02 sets two numeric cells in mono at 15px, which is neither of R27.1's two role sizes.
