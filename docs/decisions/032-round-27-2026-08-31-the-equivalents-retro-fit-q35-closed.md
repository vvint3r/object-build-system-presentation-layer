# Round 27 (2026-08-31) — the equivalents retro-fit (Q35 closed)

- **Date:** 2026-08-31
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 812–832
- **Status:** historical record from the original library, copied verbatim. The rules in force are in `kit/report-kit/SPEC.md`.

---

R26 was specified in round 26b and the shipped specimens predated it. This sweep applies it. Scope was decided by the rules rather than by a count of visuals: **R26.4** puts a table under every chart, **R26.5** exempts any mark whose value is already written beside it, and **R26.3** requires the four-part description on every diagram.

**Tables added (4).**
- Charts §02 trend — 8 rows × 3 populations. Carries all three series regardless of which are toggled on, closing R26.6 against the series switcher.
- Charts §03 distribution — 10 buckets with count, share and cumulative. This is the readout R26.6 named: those numbers were reachable only by clicking a bar.
- T6 §01 hero trend strip — 12 weeks with value and distance from target. Built as a native `<details>` because T6 is template-only with no logic class; the disclosure chrome matches the scripted one.
- Wayfinding §03 most read — the union of the three windows, 8 nodes × 7/30/90 days, em dash where a node is outside that window's top five. The window switcher was the only path to two thirds of the numbers.

**Exempt under R26.5, verified not added.** Charts §03 share bar (legend writes count and percentage per segment) · Provenance §02 agreement bar (legend writes the count per segment) and spread band (min, IQR bounds and max all written on the axis) · every magnitude bar row across the library, which carries its value at 700 beside the label.

**Descriptions added (6).** Diagrams §05 decision tree, §07 concept map, §08 taxonomy tree · Diagrams II §03 state machine, §05 layered architecture · Diagrams at Scale §05 ecosystem canvas. The last is computed rather than static: the canvas switches level, so the description names the current level, its node and edge counts, and points at the register beneath.

**One description rewritten.** Diagrams §06 system flow read "marked by dashed group borders" — appearance, which R26.3 forbids. It now names the three boundaries and the rule that no component appears in two systems.

**One token breach found and fixed in passing.** T6's hero trend strip drew its twelve weekly bars in solid black with the current week in teal — inverted against R23.7, which reserves black for emphasis and draws populations in the accent. Now: population teal, the breach week crit, the current week the single black selected mark the rule allows.

**Number that does not reconcile, left alone.** T6's hero carries a chip reading "+0.9 pp / 4 wk". Derived from the bar geometry the four-week movement is −0.6 pp, and on a trailing four-week mean +0.4 pp. The table states the twelve weekly values as drawn; the chip is pre-existing copy and was not rewritten. Wynt3r to rule whether the chip or the series changes.
