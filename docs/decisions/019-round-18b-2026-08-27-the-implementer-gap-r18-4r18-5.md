# Round 18b (2026-08-27) — the implementer gap (R18.4–R18.5)

- **Date:** 2026-08-27
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 360–367
- **Status:** historical record from the original library, copied verbatim. The rules in force are in `kit/report-kit/SPEC.md`.

---

Wynt3r ran an agent build on a reference document using this system as-written. The result was poor, and the diagnosis is not a missing component: **this spec fully determines appearance and says almost nothing about selection or composition.** Queued as Q34 (spacing decision table) and Q35 (selection rules), both Phase A, both ahead of Phase B.

**R18.4 — floors are not defaults.** Spacing exists here as a legal set (4/8/12/16/24/32/48/96) and a set of minimums (breathing floors, R8). Neither answers "how far apart are these two specific things." An implementer reading "module interior padding ≥24" builds everything at 24, and an implementer with a legal scale and no adjacency rule picks by feel — both happened. What is needed is a lookup keyed on the *pair*: heading → intro, intro → first module, module → module, card → card within a grid, grid → next heading, label → its content, figure → caption, table → note. One number per adjacency, no ranges, floors retained as the violation check underneath.

**R18.5 — a component library without selection rules is not usable by an agent.** Nothing in the system maps a content shape to a component, so an agent presented with prose picks by keyword association. Four things are missing and none is per-component documentation: (1) content-shape → component mapping, read from the shape of the source material, not its topic; (2) precedence when several components fit — the comparison table vs. the comparison cards vs. the criteria matrix problem; (3) a density ceiling per view, since nothing currently forbids stacking nine modules; (4) a default composition order for each template. Q18's per-component pages remain useful for anatomy and states, but the usage half moves here — a page-per-component reference does not help an implementer who has already chosen the wrong component.
