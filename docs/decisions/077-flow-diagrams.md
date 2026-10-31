# Flow diagrams

- **Date:** 2026-10-30
- **Source:** the orchestrating session, under the owner's delegation in record 075; scope and values
  from record 076 and `docs/subprojects/visualization-build.md`
- **Status:** in force

---

## Rules

Section 8.20 of `SPEC.md` holds the rules; section 8.13 points to it, and section 14 gains item 17.
The kit's script draws the diagram and writes its text equivalent. Every new check is a failure, in
`checks/diagrams.mjs`.

| Rule | Source | Check |
| --- | --- | --- |
| The JSON holds `nodes`, `edges`, `groups` and `direction` only, with the values each field allows | Record 076, diagrams are data | `diagram-json` |
| Edges join existing nodes; every decision has two or more branches, each labelled, no two alike; lanes cover every row once | Record 076; §8.20 | `diagram-edges` |
| At most 24 nodes, 5 columns (4 with lanes), 5 rows, 5 lanes, 2 boundaries, 12 edge labels and 1 emphasised node | Library records 010 and 012; print measurements | `diagram-capacity` |
| Node label 24 characters, detail 40, edge label 1 to 3 words, emphasis 1 or 2 words, lane or boundary label 24 characters | Library record 010; §9 | `diagram-labels` |
| `role="img"`, a non-empty `aria-label`, and a text version with one item for each node | Record 076, the text equivalent | `diagram-text` |
| Every edge drawn; 3 line crossings at most | Library record 010 | `diagram-drawn` |
| No overlap; labels 8px clear; nothing outside the drawing or clipped; in print, 632px wide and 720px tall at most, at 80% or more | Record 076 values; §12 | `diagram-layout` |

The existing checks read the new markup: a diagram is a figure body like a chart, its emphasised
node counts toward the section's one `cm-emph`, its edge, lane and boundary labels are labels, and
the writing checks skip diagram text.

## Measured text

The checks read the diagram twice: the JSON as written, and the drawing as the kit made it in light,
dark and print. Edge lines come from the points the script drew them from; nodes and labels are
measured as drawn, and the print scale is undone before comparing.

| Scope | What counts | What does not |
| --- | --- | --- |
| Diagram text | Node labels and details, edge labels, emphasis chips, lane and boundary labels, each against its own limit | Prose limits, register and heading rules |
| Text version | One list item for each node, none empty | Its wording, which the script writes from the data |

## Calls

- **No canvas field.** The drawing sits on the figure's surface. A second field inside the figure
  would frame the drawing twice.
- **Node treatment.** Nodes take the surface colour and a 1px `--cm-field` outline. The decision,
  data store and external entity carry ink outlines so their shape reads at a glance.
- **Decision text.** The question always sits inside the rotated square, which grows to hold it.
  A decision carries no detail line.
- **Emphasis.** Only a step takes emphasis: `cm-emph` with a neutral chip naming why, as on a process
  step. A pill or a rotated square cannot carry the chip cleanly.
- **Edge labels.** In the label style, on the page colour, beside the line, above or left first and
  near the source. A label on the line would break the stroke.
- **Shared ports.** Edges leaving one side of a node share a trunk, and edges entering one side merge
  before it. Fanned anchors along a side would read as separate exits.
- **Through lines.** A line into one side and another out of the opposite side, across the reading
  direction, costs the router as much as a crossing, since the two read as one line through the node.
- **Key.** Shown above the drawing only when the diagram uses a data store, an external entity, a
  data edge or an optional edge. Pills, rectangles and solid lines need no key.
- **Lanes.** Each lane is a row band named on the left, divided by a 1px `--cm-field` rule across the
  full width. A filled band would compete with the nodes.
- **Capacity.** Nodes, boundaries, edge labels and crossings take the library's panel tier and
  crossing budget (record 010); lanes take the library's widest lane diagram (record 012). Columns
  and rows come from print, measured with steps carrying a detail line: six in a row do not fit the
  printed column at 80%, nor five with lanes, and six rows do not fit a printed page. A diagram near
  several ceilings at once can still fail the print check, which is final.
- **Label limits.** Node labels stop at 24 characters, where the library cut node names (record 010).
  A detail line stops at 40 characters, two lines at print width. Edge labels follow chart
  annotations, 1 to 3 words.
- **Print.** Gaps narrow to 40px between columns and 32px between rows, steps to 120px and terminals
  to 192px, so five steps fit in a row. The drawing then scales to fit the 632px column and 720px of page height, an A4 page body
  of 1001px less a figure's title, description and caption. The 80% floor keeps the 10px label style
  at 8px or more.
- **Narrow screens.** The diagram keeps its geometry and scrolls sideways in its own box. The kit has
  no narrow-screen cue for tables or charts, so diagrams add none.
- **Text version.** A `cm-data` disclosure after the caption, as a chart's data fallback, labelled
  "View as text". One numbered item for each node in reading order, with each branch and its step
  number and each loop as "Back to step N", so the list reads without the drawing.
- **Automatic summary.** An empty `aria-label` takes a summary from the data: steps, first and last,
  and the counts of lanes, decisions and loops. An author's label stays.
- **Sample report.** One diagram of ticket routing in Part 03, beside the chat routing change it
  explains, sourced to the helpdesk routing rules as a new source, S5.
- **Gallery.** A new Part 07, Diagrams, after Charts, with the rules, a table of the parts and two
  demos: a process flow with a rework loop and a swimlane.
- **Pilot.** The sample's diagram was judged beside the library's hand-drawn process and system flows
  in light, dark and print by a reviewer who had not read the spec. Verdict: at least as clear.

## Values

All within record 076 (strokes 1.5px and 2px, labels 8px clear, one emphasised node) except these:

| Value | Use | Reason |
| --- | --- | --- |
| 1px `--cm-field` | Node outlines, lane dividers, key swatches | The kit's hairline, as on printed surfaces; a 1.5px outline on every node would outweigh the edges |
| 12px | Elbow radius | The tile radius from the kit's set |
| 8px by 7px | Arrowhead | Long enough to read at 80% print scale |
| 16px | Spacing of parallel edges in one gap | Keeps two edges distinct at 80% print scale |
| 80% | Smallest print scale | Keeps the 10px label style at 8px |

## Owner questions

None. The orchestrating session reviews the values above under record 075.

## Version

The kit stays at 1.2. The version for this change is the orchestrating session's call.
