# Kit spec and code brought into line

- **Date:** 2026-10-13
- **Source:** the owner's answers to the five open items about Report Kit 1.1
- **Status:** in force

---

## Rulings

| Item | Ruling | Changed |
| --- | --- | --- |
| Chart colours three and four | Use the deeper pair the spec names | `cm-report.css`: `--cm-c3` `#2d6fdc`, `--cm-c4` `#8a4fd6` (light and print); `#5b9af2`, `#a982f0` (dark) |
| Smallest type size | Labels in chips and tags are 10px; 10px is the floor | `SPEC.md`: floor 10px, with chips listed as their own row in the type table. `cm-report.css`: table sort arrows 9px → 10px, the only text below the floor |
| Label letter-spacing | 0.08em | `cm-report.css`: all 17 label rules `.06em` → `.08em` |
| Spacing | The spacing in the stylesheet is correct; the larger spacing was requested | `SPEC.md` and the gallery's spacing table now list the values in use, split into between-block and inside-component scales |
| Offline mode | Wanted, later. For now, serve the chart library | Logged as a to-do in `docs/plan.md`. `tools/preview.mjs` serves ECharts 5.5.1 from npm for previews |

## Spacing fix

The owner marked the gallery's section-header example as too compact under its description. The same
32px gap sat under every example in the gallery; it read as cramped wherever the example has no card
around it: section header, callouts, definition, questions, property sheet, data table, footnotes.

The gallery's helper style now puts each example 56px under its description, the distance a section
header keeps from its body. Measured after the change: 56 to 60px on every example, 91px on the pull
quote, which starts with its own accent bar.

## Interpretation to confirm

"Labels need to be 10px" was applied to chips and tags, which were already 10px, and set as the floor.
Other labels (`.cm-label`, KPI labels, figure and table kinds, metadata keys) stay at 11px. If every
label is meant to be 10px, that is a further change.

## Version

The kit stays at 1.1. Two rulings bring the code in line with what the spec already said (colours,
tracking); two bring the spec in line with the code (type floor, spacing).
