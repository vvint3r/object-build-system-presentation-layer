# Round 11 (2026-08-07) — Wave 2a: experience & magnitude

- **Date:** 2026-08-07
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 221–243
- **Status:** historical record, copied verbatim. Current rules are in `docs/spec/rules.md`.

---

New page `content-morphia Diagrams III.dc.html`. Three families that the node/edge grammar could not carry, all of them **lane diagrams**: a fixed 100px mono rail on the left, fixed 160px phase columns across the top, 12px gutters — one 960px canvas grammar shared by all three, so the three specimens align column-for-column.

- **§01 Journey map** (T2, 5 phases / 5 lanes). One person, one arc. Lanes: actions (white S1 tiles) · touchpoints (neutral chips) · emotion · pain · opportunities (both borderless text, marked once in the rail). Click a phase to isolate its column — focused header takes the reserved L2 teal offset, every other column drops to .24. **Sentiment is drawn as position**: a 3-tick labelled axis (HIGH / MID / LOW, dotted #d9d9d9), a 2px black polyline, white dots with 2px black rims, plus a mono mood word per phase. No colour, no faces.
- **§02 Service blueprint** (T2, 5 steps / 4 lanes / 3 lines). Same columns as §01; the three boundary lines are the subject. Solid black = line of interaction · dashed black = line of visibility · dotted black = line of internal interaction. Each line carries a mono label knocked out of the surface, sitting on the line. "Explain each line" toggle drops a dashed annotation frame under each line describing what the crossing means (the lane row below reflows down by 60px rather than being overlapped).
- **§03 Magnitude flow** (T2, 14 nodes / 17 flows, 92M events/day). Sankey. Band width is the quantity, cubic-curved, #f1f1f1 at rest. Nodes are black 13px bars (real buttons, label beside them; last column mirrors with row-reverse). Click a node to trace: its bands go teal wash rgba(.42), everything else drops to rgba(0,0,0,.045), and a mono readout reports value plus in/out counts. Legend states scale (1px = 0.31M/day), column total and smallest band.

**Rules added (R11, folded into the grammar):**
- **R11.1 Lane rail** — lane diagrams carry a fixed 100px mono rail; lane names never sit inside the first content column.
- **R11.2 Proportional magnitude** — magnitude flow is the sole exemption from the 3-step edge-weight rule: continuously proportional width on one scale across all columns, scale + column total always stated in the legend. Every column must sum to the same total.
- **R11.3 Boundary lines are labelled** — solid = interaction, dashed = visibility, dotted = internal; no boundary line is drawn unlabelled.
- **R11.4 Sentiment is position** — emotion on a labelled 3-tick axis plus a mono mood word. Never colour, never face glyphs.

Coverage after wave 2a: **19 built / 4 queued / 4 parked**. Remaining queue: mind map, Venn, fishbone, BPMN subset — all four shipped in wave 2b (R13).

### R11 density pass (review feedback, RATIFIED)
Wynt3r's review of the first cut: the blueprint and flow canvases were crowded and the repeated semantic chips were too loud when zoomed out. Three corrections, all generalisable:
- **R11.5 Mark the lane, not every cell.** A semantic that is true for a whole lane is declared once in the rail — a 10px swatch (1px black border) beside the mono lane label — never repeated as a chip in every cell. Ten bright chips became two swatches. The chip form stays correct for cell-level semantics that vary within a lane.
- **R11.6 Boundaries do the work, tiles do not.** Where labelled boundary lines already structure a canvas (service blueprint), cells are borderless text blocks on the shared surface — no white tile, no S1 shadow. Enclosure on top of an existing boundary is the "heavy UI" failure mode. Journey keeps tiles on the actions lane only, where no line separates the columns.
- **R11.7 Magnitude canvases get height before they get nodes.** Sankey canvas 300→372px and node gaps 14→24px; the crossing count came down by one flow (Revenue now feeds Reverse ETL only). Band tangle is a spacing problem first and a data problem second.
Blueprint vertical rhythm also raised: 16→36/44px above each boundary line, cell line-height 1.55→1.7.
