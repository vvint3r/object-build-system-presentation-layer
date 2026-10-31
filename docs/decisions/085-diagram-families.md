# Diagram families: journey map, system and data flow, layer stack, hierarchy

- **Date:** 2026-10-30
- **Source:** the orchestrating session, under the owner's delegation in record 075; families and
  values from record 076; the flow mode from record 077
- **Status:** in force

---

## Rules

Section 8.20 of `SPEC.md` gains four subsections: journey map, system and data flow, layer stack and
hierarchy. The first two are families of the flow mode; the last two are drawing modes of their own,
`data-diagram="layer-stack"` and `data-diagram="hierarchy"`. The edge label rule of the flow mode
changes for every flow. Every new check is a failure.

| Rule | Source | Check |
| --- | --- | --- |
| An edge label stands on its line where it leaves its node, centred on it, and the line starts 8px past the label | This record, superseding record 077's beside placement | `diagram-label-inline` |
| The flow JSON adds `experience`, `level` and phase groups | Record 076, journey map | `diagram-json` |
| A journey scale has 3 to 5 words of 12 characters at most; with a scale every node has a level and a column of its own; phases cover every column once | This record | `journey-json` |
| Phase frames, the experience line and its words stand 8px clear of nodes, edges and each other | Record 076 values | `journey-layout` |
| An external entity stands outside every boundary; a data store joins only steps, by data edges; an edge crossing a boundary is labelled; boundaries share no cell | Data flow diagram convention; this record | `system-flow-json` |
| A layer stack holds `layers` and `edges` only; ids unique; one component a column in each layer; no edge labels | Record 076, diagrams are data | `layer-stack-json` |
| A dependency runs down to a lower layer | This record | `layer-stack-edges` |
| At most 5 layers and 4 components a layer; flow label lengths | Print measurements | `layer-stack-capacity` |
| Every component inside its layer's frame; a text version with one item for each component | Record 076, the text equivalent | `layer-stack-drawn` |
| A hierarchy holds `nodes` only; one root; every parent exists; no cycle | Record 076, diagrams are data | `hierarchy-json` |
| At most 4 levels and 12 leaves; flow label lengths | Print measurements | `hierarchy-capacity` |
| Each level one aligned column; children in written order; no arrowheads; the text version nests every node under its parent | This record | `hierarchy-drawn` |

The checks are in `checks/flow-families.mjs`, `checks/layer-stack.mjs` and `checks/hierarchy.mjs`.
The shared checks in `checks/diagrams.mjs` accept the two new modes, and the label tier
(`checks/page.mjs`) gains phase names and level words. Overlap, clearance, clipping and print fit are
checked for every mode by the shared `diagram-layout` and `diagram-drawn`.

## Measured text

Phase names and experience words are labels, measured by the label tier. Diagram text keeps the
limits of record 077; a phase label stops at 24 characters, as a lane's.

## Calls

- **Edge labels on the line.** Record 077 set labels beside their line, as the library's record 013
  does: above a horizontal line, left of a vertical one. The pilot showed the same relation reading
  two ways. A label now stands on the line at its start, for every exit, and the line starts 8px past
  it. On the line is where the owner picked the decision tree's branch selectors (library record
  013), and one placement is checkable.
- **Side of its own.** A labelled edge leaves its node by a side no other edge uses, so no line runs
  where its label stands. A boundary name moves to the right end of its top line when an edge crosses
  where it would stand.
- **Family from the data.** The flow mode reads the family from the JSON: an experience scale makes a
  journey map; a store, external entity, boundary or data edge makes a system and data flow. Each takes
  its own summary and text version, so an author names no family.
- **Journey without a rail.** The scale is named by a word under each run and by the key, not by a
  rail of level names on the left: a rail would take a column's width and leave four steps.
- **Low point.** Every step at the lowest level is marked, when the levels differ. A flat journey has
  no low point.
- **Store rules.** "Double-ruled" in record 076 reads as one 2px rule above and one below, as the
  library draws a data store (record 010) and as the flow mode already does.
- **Upward dependencies.** A layer stack draws only downward dependencies. An upward or same-layer one
  is left undrawn with a console warning, and the checks fail the page: drawing it would show a stack
  that is not one.
- **Layer stack on the flow grid.** Layers are rows of the flow grid and components its cells, so a
  layer stack inherits routing, standoffs, print scaling and the shared checks.
- **Hierarchy layout.** Record 076 names the hierarchy as "the ECharts tree" and rules out a layout
  engine of the kit's own. The ECharts tree layout places the nodes once, off screen; the kit draws
  every box and line in its own classes. Placement here is the only placement not the author's. The
  kit's drawing keeps hierarchy boxes like flow boxes and lets every shared check run on it.
- **Hierarchy lines.** No arrowheads: a line in a hierarchy means "part of", not a step.
- **Hierarchy without ECharts.** The text version stands alone and the drawing is skipped, as a
  chart's is.
- **Mode names.** `layer-stack` and `hierarchy` follow the family names in §15, as
  `entity-relationship` does.

## Values

All within record 076 (strokes 1.5px and 2px, labels 8px clear) and record 077, plus these:

| Value | Use | Reason |
| --- | --- | --- |
| 2px `--cm-accent` | Experience line | A chart mark in the accent, never text; the words under it carry the meaning |
| 16px | Level spacing on the experience line | Five levels in 64px; levels stay distinct at 80% print scale |
| 32px | Gap from the grid's foot to the experience line's top level | Twice the level spacing, so the line reads apart from the steps |
| 20px | Gap from the phase frames to the grid | The flow mode's 20px reach from a node to the first line in a gap |
| `--cm-track` fill, 8px by 12px padding, input radius | Phase frames | The track fill the kit keeps for grouping surfaces; a frame, not a card |
| `--cm-track` fill, card radius, 16px inset | Layer frames | Same reading as phases: a band that groups, not a surface |
| 24px | Least distance from an edge label to a boundary side its line goes on to cross | The 8px label air and 16px of line before the side |
| 16px | Gap between sibling boxes in a hierarchy | The edge track spacing of record 077 |

Capacity, measured in print:

| Family | Ceiling | Measured |
| --- | --- | --- |
| Journey map | 5 columns | Five 24-character steps with phases print at 81%; six columns of the shortest labels need less than 80% |
| Layer stack | 5 layers | Five layers of 24-character labels print at 83%; six print at 80%, with nothing to spare |
| Layer stack | 4 components a layer | Four 24-character components print at 83%; five of the shortest labels print at 81% |
| Hierarchy | 4 levels | Four levels of 24-character labels print at 100%; five need 81% |
| Hierarchy | 12 leaves | Twelve leaves in three groups print at 83%; in four groups of three they need less than 80% |

## Owner questions

None. The orchestrating session reviews the label rule change and the hierarchy layout reading under
record 075.

## Version

The kit stays at 1.2. The version for this change is the orchestrating session's call.
