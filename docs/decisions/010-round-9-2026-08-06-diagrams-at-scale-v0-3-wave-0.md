# Round 9 (2026-08-06) — Diagrams at scale (v0.3 wave 0)

- **Date:** 2026-08-06
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 169–202
- **Status:** historical record, copied verbatim. Current rules are in `docs/spec/rules.md`.

---

Research pass (Eraser 5 families · Mermaid ~29 types · Lucidchart catalogue · C4 · DFD levelling) established that our diagram library was complete on *grammar* and empty on *scale*: 10 built types, all T1/T2, no T3 specimen despite the tier claim.

**Decisions taken (agent-owned, user answered "decide for me"):** order = scale before breadth · levels UI = breadcrumb-style level strip, descend from a node, crumb to return · page split = Diagrams (grammar + core types) / Diagrams at Scale (rules + T3 canvas) / Diagrams II (extended families, wave 1–2) · all three round-8 rulings stay STRICT — code syntax weight-only (option A), teal-only underlines, 2-letter glyph tiles retained. Rule 1 and rule 2 are not widened.

**New page `content-morphia Diagrams at Scale.dc.html`** — §01 capacity · §02 levels · §03 legend + registry · §04 edges · §05 live canvas · §06 coverage.

### Capacity ceilings (RATIFIED)
- T1 inline ≤7 nodes — text alternative; one edge kind; no groups.
- T2 panel 8–24 — + legend at ≥3 node types; ≤2 groups; edge labels only while ≤12 edges.
- T3 canvas 25–80 — + level switcher, node registry, focus mode, fit control, collapsible groups.
- **80+ is illegal in a single view.** Decompose into levels.
- Node label truncates at 24ch (full name lives in the registry, never tooltip-only). One fixed node width per canvas — never content-sized.
- Density floor: node 196×62, column gap 64, row gap 26. Minimums, not suggestions.

### Level model (RATIFIED)
L0 context (5–12 nodes, no technology names) → L1 containers (15–40, lineage lives here) → L2 components (8–25, built selectively). Descent is initiated from a node carrying a descend chip; the crumb strip records the path, current crumb is the only bordered one (white pill + 1px black + 2px 2px 0 teal), earlier crumbs return and clear focus/filters.

### Legend + registry (RATIFIED)
Legend mandatory at ≥3 node types, pinned top-right of the panel on a #fafafa tile, never floating over the drawing. Node type set (5): actor (white/1.5 black/r4) · external system (white/1.5 dashed black/r12) · service (#f1f1f1/r12) · data store (#f1f1f1 + 2px black top+bottom rules/r0) · pipeline job (#f1f1f1 + 3px teal left bar/r12). Registry table required at T3: id · full name · type · layer · owner · in·out degree; zebra rows; focused row takes a teal .25 wash. Registry is the source of truth, canvas is the view. Ids double as the off-page-connector vocabulary.

### Edges at scale (RATIFIED)
Orthogonal only, corners rounded 10px, one turn band per column gap; leave source right-centre, enter target left-centre. Return edges drop below the last row into a dedicated band (dashed 6/5). Weight encodes magnitude in exactly three steps — 1.5 / 2.5 / 4 — named in the legend; this is how lineage reads without a second colour. Crossing budget 3 per view, then reorder / group / cut to an off-page connector (black id chip). Edge labels only while ≤12 edges in view.

### Authoring model (RATIFIED)
Diagrams at T2/T3 are declared as node/edge JSON in the DCLogic class; geometry is computed deterministically from col/row (no DOM measurement) and rendered through `sc-for` into real template DOM — absolutely-positioned button nodes + one SVG path layer. Hand-inlined absolute divs are retired above ~15 nodes. Focus/filter/collapse/search are state, not markup.

### Live canvas §05
NodeTrak analytics platform, one map at three levels: L0 9 nodes / L1 23 nodes + 3 collapsible boundaries / L2 12 nodes. All seven requested interactions ship: level switcher, click-to-focus (neighbours stay, rest drop to .14), collapse/expand groups (edges remap to the group node), layer filter chips, fit-to-width toggle, paired registry table, search.

### Family coverage (§06, 27 families)
Built 13 · Queued 10 · Parked 4. Wave 1 (technical): sequence, entity relationship, state machine, architecture layers, deployment/network topology. Wave 2 (business/learning): journey map + service blueprint, Sankey, mind map, Venn, fishbone, BPMN subset. Parked pending content need: Gantt, git graph, kanban, class/code.
