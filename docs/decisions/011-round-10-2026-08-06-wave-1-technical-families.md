# Round 10 (2026-08-06) — Wave 1 technical families

- **Date:** 2026-08-06
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 203–220
- **Status:** historical record, copied verbatim. Current rules are in `docs/spec/rules.md`.

---

New page `content-morphia Diagrams II.dc.html`, all five built on the round-9 JSON authoring model (node/edge data in DCLogic, geometry computed from col/row, rendered via sc-for + one SVG path layer). Shared helpers now stable: `ortho(a,b)` picks exit/entry sides from relative position and returns an orthogonal path with 10px corners; `mid(a,b)` returns the label anchor; `grid()` maps col/row to pixels.

- **§01 Sequence** (T2, 5 lifelines / 9 messages). Only diagram where vertical position carries meaning, so lifelines are dotted #d9d9d9 rather than a node grid. Solid = call, dashed 6/5 = return, self-message turns right and returns (never a loop over the lifeline). Numbered mono chips. Live step-through: prev / next / show-all, current message chip takes a 1px black border, future messages drop to .12.
- **§02 Entity relationship** (T2, 5 entities / 24 fields). Entities are field tables, not named boxes: black mono header bar + zebra field rows + PK (black fill) / FK (white + 1px black) key chips. Cardinality chips (1 / N) at both ends of every relationship — crow's-foot notation deliberately not adopted, it does not survive the mono/geometric vocabulary. Star schema layout does the explaining.
- **§03 State machine** (T2, 6 states / 7 transitions). Initial = 14px black dot, terminal = double border via inset box-shadow. Dashed transitions are reversals. Click-to-isolate a state (in/out transitions stay, rest to .16) with a live prose note under the canvas.
- **§04 Deployment topology** (T2, 9 nodes / 3 zones). Trust boundaries drawn first, nodes inside. Every boundary-crossing edge carries its port; zone chips sit top-RIGHT of the zone (moved from top-left to stop colliding with incoming edges).
- **§05 Layered architecture** (T1, 6 layers). No edges at all — vertical order is the argument. Template markup, not data-driven. Cross-cutting concerns in a dashed column: "applies at every layer, owned at none."

Coverage after wave 1: **17 built / 6 queued / 4 parked**. Remaining queue is wave 2 — journey map + service blueprint, Sankey, mind map, Venn, fishbone, BPMN subset.

### Edge anchoring (R10 addendum, RATIFIED)
Anchoring every edge at the midpoint of a node side is wrong as soon as two edges share that side — reciprocal pairs collapse into one visual and fanned relationships stack their labels. Rule: **anchors fan along the side they share.** `anchorSet(pos, edges)` groups edge ends by node+side and distributes them across 22%–78% of that side's extent (single edge stays at 50%); paths and labels both derive from the fanned anchor, never from the node box. Corner radius clamps to half the shorter leg so short offsets do not produce reversed arc segments. ### Obstacle-aware routing (R10 addendum, RATIFIED)
Turning at the midpoint between two anchors is only safe for adjacent columns. Across a gap, the leg runs through whatever sits between — and because nodes paint above the SVG layer, the edge is *hidden* rather than visibly crossing, which is worse than a crossing: the reader sees a fragment emerging from the wrong box and infers a relationship that does not exist. Rule: **the turn band is chosen, not assumed.** `pickBand` scores candidate bands (midpoint, six span fractions, and the centre of every clear gap between blocking boxes) by how much of the resulting three-leg path lies inside a node box, and takes the lowest-penalty band, breaking ties toward the midpoint. Source and target boxes are excluded from their own obstacle set. Edge labels anchor on the chosen band (`labelA`), never between the node anchors, so a re-routed edge keeps its label on the line. Corner radii clamp to both legs.

Shared helper set for all data-driven diagrams: `sideOf` · `anchorSet` · `segHit` · `pickBand` · `pathA` · `labelA` · `midA` · `offA` · `obstacles`.
