# Round 26b — non-visual equivalents (R26.1–R26.6)

- **Date:** not stated in source
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 786–811
- **Status:** historical record from the original library, copied verbatim. The rules in force are in `kit/report-kit/SPEC.md`.

---

**How this was found.** v0.4's gate reads "no pattern in the brief without a live specimen", so the brief was re-read end to end against the live inventory rather than against the coverage index. Everything it names as a component exists — including the four core blocks (overview, prerequisite, example, use-case) at Foundations §12, which the audit had previously read as gaps. One requirement did not: the brief asks for a **text or table alternative** in two separate places — under "for every visualization, provide" and again under accessibility, where it is stated twice more as "text alternatives for diagrams" and "data-table alternatives for charts", and closed with "do not use a diagram or interactive visual as the only way to access information". Nothing in the system answered it. Diagrams carried ad-hoc `role="img"` labels on some SVG layers; the four charts carried none and no tables.

Deliverable: `content-morphia Equivalents.dc.html`, third page of the Foundations group. Four sections — §01 the three forms and what needs none · §02 the four-part description with two worked examples and three failure modes · §03 the chart table, live over the ten-bucket distribution with its disclosure · §04 the six rules.

**The three forms, and why three.** Description for diagrams (structure is describable in a sentence), table for charts without exception (values are not), register for T2/T3 canvases (a population too large for either). The exemption that keeps the rule from becoming noise: a mark whose value is already written beside it — magnitude bar, progress track, legend swatch, status chip — has its equivalent, and adding a table under a 6px bar restates a number that was never hidden.

**The four-part description** — type · population · relation · notice, in that order. The three failure modes are the ones that show up in practice: naming the picture ("diagram showing the data pipeline architecture"), restating the title, and describing the styling. The last is the interesting one — colour, shape and position are the *encoding*; a description that lists them has decoded nothing.

| Rule | Statement |
|---|---|
| R26.1 | Nothing is reachable only by looking. Every diagram, chart and canvas carries one non-visual equivalent: a description, a data table or a node register. |
| R26.2 | The form follows what is encoded, not size. Diagrams take a description; charts take a table without exception; T2/T3 canvases take a register as well as their description. |
| R26.3 | A description is one sentence in four parts — type, population, relation, notice. It states what the visual shows, never what it looks like. |
| R26.4 | A chart's table carries every mark's value in axis order plus every value a selection would have revealed, in a closed disclosure beneath the chart with its row count in the header. |
| R26.5 | A mark whose value is written beside it already has its equivalent. Magnitude bars, progress tracks, legend swatches and status chips take no second one. |
| R26.6 | An interaction is not an equivalent. If selecting, hovering or stepping is the only way to reach a number, that number belongs in the table. |

R26.6 is the one with teeth, and it indicts existing work: the Charts §03 distribution readout and the Wayfinding ranked-entry bars both hold values reachable only by clicking. It also chains to R25.1 — the print rule already required that every value a readout would have given appear on the axis or in a table, which was the same requirement arriving from the other direction.

**Debt created deliberately.** The rules are specified; the existing specimens predate them. Queue item **Q35** (phase B, next): every chart on Charts, T6, Provenance and Wayfinding takes its table, every diagram its four-part accessible name. One sweep after the rules stop moving, per the standing "one sweep, not one per build" discipline. v0.4's third gate was rewritten to name it: *every chart carries its table and every diagram its description*.

Page conformance: one L2 (the never-only-by-looking rule), zero solids, four sections, one interactive (the table disclosure, R24.1 marker), all labels 9.5px. Tweaks: tableOpen, showFailures. Foundations group is now three pages.
