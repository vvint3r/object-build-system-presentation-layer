# Rounded shapes

- **Date:** 2026-10-16
- **Source:** the owner's answers on corners and on the recommended-column bar, in session
- **Status:** in force

---

## Rulings

| Item | Ruling | Changed |
| --- | --- | --- |
| 2px corners | Allowed: 2px is the radius for thin bars | `SPEC.md` rule 10 and `CLAUDE.md` add 2 to the set. The meter fill, property-sheet divider, row flags and recommended-column bars keep 2px |
| Square corners | Every drawn shape is rounded, though not always by the same amount; a squarer shape uses 2px | `SPEC.md` rule 10: square corners belong only to lines (rules, dotted connectors, the timeline rail), masked icons and the full-width top bar. `cm-report.css`: the link hover highlight takes the chip radius |
| Recommended-column bar | One segment per row, centred on the row, so a single highlighted cell reads the same as a whole column | `cm-report.css` `td.is-rec::before`: 12px from the top and bottom of each cell, 2px radius, the same insets as the row flags. `SPEC.md` section 8.11 describes the bar in place of a wash the code never drew. Gallery caption updated |

## Checks

`checks/radius.mjs` accepts 2px and fails square corners on any painted shape. A box with no fill and
at most one border side (a rule, a clipping container) is not a shape. `tools/load.mjs` parks the
pointer outside the viewport, so no element is measured in its hover state.

## Version

The kit stays at 1.1.
