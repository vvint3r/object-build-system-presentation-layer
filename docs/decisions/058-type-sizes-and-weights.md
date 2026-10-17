# Type sizes and weights

- **Date:** 2026-10-16
- **Source:** the owner's answers to the open items on type, and their review of the gallery, in session
- **Status:** in force

---

## Rulings

| Item | Ruling | Changed |
| --- | --- | --- |
| Table heads | Labels: 10 / 800 / caps / +0.08em | `cm-report.css` `.cm-table th`: 15px / 900 / no caps → 10px / 800 / caps / .08em. `SPEC.md` section 4 lists table heads in the Label row |
| Contents rail and process step numbers | 10px | `cm-report.css` `.cm-toc a .n` 12px → 10px, spacing .04em → .08em, baseline-aligned with the link text; `.cm-step__n` 12px → 10px. Listed in the Label row |
| Weights | Every weight the kit loads is on the scale: Nunito 300, 400, 600, 700, 800, 900 | `SPEC.md` rule 4 lists 600 (code, chart axis labels) |
| Breadcrumb | Keeps three weights: links 700, current page 900, separators 300 | `SPEC.md` section 4 states it; no code change |
| Chips | 9px, text centred in the pill | `cm-report.css` `.cm-chip`: 10px → 9px, line height 10px. `SPEC.md` section 4: own Chip row; the floor is 9px for chips. Tags and deltas stay 10px |
| Property-sheet role tags | 10px, weight 700, sentence case | `cm-report.css` `.cm-props sup`: no caps, no tracking, 800 → 700. `SPEC.md` section 4: own Role tag row |
| Inline emphasis | 1px smaller than the text around it | `cm-report.css` `.cm-hl`: `font-size: calc(1em - 1px)`. `SPEC.md` section 8.8 and the gallery description say so |

## Chip centring

At 9px with a line height of 1, the text box is 9px tall inside an 18px interior, so it sits on a half
pixel and the browser rounds it up or down by position: measured up to 1.4px above centre across zoom
levels 100 to 200%. A 10px line height puts it on a whole pixel: measured within 0.3px of centre at
every zoom level and position.

## Gallery

The type tiers card shows a chip specimen under the label specimen.

## Version

The kit stays at 1.1.
