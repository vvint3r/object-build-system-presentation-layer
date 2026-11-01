# Visualization build

Step 6 of `docs/plan.md`: diagrams, charts and visualizations as a build of their own, styled from the
kit's tokens and enforced by the checks. Record 076 sets its direction.

| Date | State |
| --- | --- |
| 2026-10-30 | Direction set (record 076); round 2 starts with the flow mode |
| 2026-10-31 | Done: the nine families and the chart additions are in the kit (records 077, 081, 084, 085 and 086), and every kit page passes the checks |

## Scope

The kit gains a **diagram renderer** with six drawing modes, nine diagram families on them, and
chart recipes by question with four new chart types. Each family ships with its rules in the spec,
its checks, a gallery example and use in an acceptance document.

The step is done when the nine families and the chart additions are in the kit, each with rules,
checks and a gallery example, and every kit page passes the checks.

## Contract

- **Markup:** a figure holds `.cm-diagram[data-diagram="<mode>"]` with a JSON block, as a chart
  holds its option JSON. The figure keeps the chart anatomy: kind and number, title, description,
  caption, text alternative.
- **Data:** nodes with stable ids, a type, a label and an optional second line; grid placement by
  column and row; groups (lanes, phases, boundaries); edges with a kind and a label. The author
  writes no coordinates, classes or styles.
- **Rendering:** the script computes geometry from the grid and draws nodes and an edge layer. Edges
  route orthogonally with rounded elbows, labels stand beside the line they name, and arrowheads are
  part of the edge.
- **Text equivalent:** the script writes the `aria-label` summary and a visible text version from the
  same data.
- **Checks:** valid JSON against the mode's schema, the mode's capacity, labelled edges where the
  mode needs them, one emphasised node at most, no overlap or clipping in the rendered result, and a
  text equivalent present. Diagram labels are exempt from the prose checks and have their own length
  limit.

## Modes and families

| Mode | Families | Round |
| --- | --- | --- |
| Flow | Process and decision flow, swimlane | 2 |
| Flow | Journey map (phases and an experience line), system and data flow (boundaries, stores, external entities) | 3 |
| Sequence | Sequence | 3 |
| State | State | 3 |
| Layer stack | Layered architecture | 3 |
| Hierarchy | Hierarchy, through the ECharts tree | 3 |
| Entity relationship | Entity relationship | 3 |

Node types differ by shape: pill terminal, rectangle step, rotated-square decision, double-ruled
store, heavy-bordered external entity. Edge kinds differ by line: solid for control flow and
dependency, dotted for data and messages, dashed for an optional or planned path.

## Pilot

The flow mode is the pilot. Its first real use is a diagram of how tickets are routed, in the sample
report. A reviewer who has not read the spec compares it, in light, dark and print, with a
hand-drawn flow from the library's diagram pages. The other modes start when the pilot is at least
as clear.

## Charts

Section 9 of the spec gains recipes by question: comparison, change, distribution, uncertainty,
composition and relationship. Four chart types join the kit: bullet (actual against target), slope,
distribution (strip or box) and uncertainty (an interval band or error bars). The forbidden forms
stay.

## Inputs

- The library's diagram pages and the visualization kit, inventoried by family with their values.
  They supply standoffs, capacity ceilings and label placement, never markup.
- The owner's reference set, read for coverage and visual direction: orthogonal routing, phase
  frames, labelled edges and a type mark on each node.
- Section 9 of the spec, for the figure anatomy and the token rules a diagram shares with charts.

## Values

The kit's existing tokens, type sizes, radii and spacing; strokes of 1.5px and 2px; labels 8px clear
of any line. A session that needs a value outside this set adds it and states it in its pull
request.
