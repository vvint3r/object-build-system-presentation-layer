# Build direction

- **Date:** 2026-10-30
- **Source:** the orchestrating session, under the owner's delegation in record 075, after independent
  reviews of the plan by three models
- **Status:** in force

---

## Ruling

Steps 6, 8 and 9 of `docs/plan.md` run in five rounds of parallel sessions. Kit 2.0 at the end of
round 5 is the first complete output, the version the owner reviews and iterates on.

### Visualization build

- **Diagrams are data.** An author writes a JSON block inside `.cm-diagram[data-diagram="<mode>"]`
  in a figure: nodes with stable ids, grid placement by column and row, groups, and labelled edges.
  The kit's script computes the geometry and draws the diagram; the author writes no coordinates,
  classes or styles.
- **Placement is the author's; geometry is the kit's.** No automatic layout engine and no Mermaid:
  neither can meet the kit's label, spacing and colour rules.
- **Nine families** make the first release, from six drawing modes: flow (process and decision
  flow, swimlane, journey map, system and data flow), sequence, state, layer stack (layered
  architecture), hierarchy (the ECharts tree) and entity relationship.
- **Node types differ by shape**: pill terminal, rectangle step, rotated-square decision,
  double-ruled store, heavy-bordered external entity. The kit adds no icon set.
- **The text equivalent comes from the data.** The same JSON yields the figure's `aria-label`
  summary and a visible text version, as charts do with `.cm-data`.
- **Each family has its own semantics.** A message, a transition and a dependency are different
  edges, and each mode states its capacity. A diagram past its capacity splits into an overview and
  details.
- **The first mode is a pilot.** The flow mode is judged beside a hand-drawn reference from the
  library or the visualization kit, in light, dark and print, by a reviewer who has not read the
  spec. The other modes start when it is at least as clear.
- **Charts stay on ECharts.** Recipes by question join the chart section, with four additions:
  bullet (actual against target), slope, distribution and uncertainty. The forbidden forms stay.
- **Deferred** until a document needs them: a diagram editor, infographics, large network views and
  Sankey flows.

### Values

The visualization build uses the kit's existing tokens, type sizes, radii and spacing. Strokes are
1.5px and 2px; a label stands 8px clear of any line; one emphasised node per diagram. A session that
needs a value outside this set adds it, states it in its pull request, and the orchestrating session
lists it in its report.

### Kit features

- **Provenance** is a data contract first: a source register with stable ids, dates and locators,
  citations that tie a claim to its sources, and disagreement between sources. Source count never
  implies confidence.
- **Change and status**: change log, revision history, limitation register and a dated status block.
- **Navigation**: stable document addresses, breadcrumbs, a related-documents block and a generated
  index. Search, faceted browse and a version selector with diff need a server and stay out of a
  single-file kit.
- **Document kinds**: report, guide and reference, each with its own required parts, set by
  `<meta name="cm-kind">`. The eleven page types are templates on these kinds. An omission comment
  stays for an exception, not for a missing kind.
- **Offline packaging** joins the other packaging modes in round 2: fonts and ECharts bundled into
  the file.

### Acceptance

Three acceptance documents judge the kit: the sample report, a process guide and a reference page.
Each passes the checks at desktop and phone width and in print, and an independent reader answers
its key questions from it. In round 5, an agent given only the design bundle composes an unseen
document that passes the checks.

### Claude Design hand-off

The target is a Design System artifact in Claude, the form Claude Design takes inside Claude, built
by a bundle tool from the kit. A first round trip runs in round 2; the full hand-off runs in round 5.
The re-import of the original standalone project keeps its own date, before 14 Dec 2026.

## Reading

- The owner's reference set informs the build without setting its outline: the taxonomy checks
  coverage, the diagram guides list mechanisms readers want explained, the journey and process maps
  add the journey family, and the dashboards folder is out of scope.
- The library and the visualization kit contribute measured values (standoffs, capacity ceilings,
  label placement), never markup.

## Changed

| File | Change |
| --- | --- |
| `docs/subprojects/visualization-build.md` | The brief for step 6 |
| `docs/subprojects/kit-features.md` | The brief for step 8 |
| `docs/plan.md` | Steps 6, 8 and 9 take this direction and their rounds |
| `docs/adoption.md` | Search, faceted browse and the version selector leave the Wayfinding row; document kinds join the Page types row |
