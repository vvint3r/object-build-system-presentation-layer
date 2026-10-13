# Component census — what repeats, and how often

Taken across all 35 pages of the pre-rebuild snapshot. Counts are structural matches on the
authored source, so they are a floor: a component whose markup varies between pages undercounts.

| Instances | Pages | Component |
|---|---|---|
| 2622 | 35 | Label chip / status pill: mono in a radius 999 or 4 shape |
| 496 | 35 | Container / card: radius-14 surface |
| 280 | 35 | Menu bar: brand + 5 group pills, each with a dropdown |
| 162 | 35 | Progress / magnitude bar: track + fill |
| 152 | 26 | Section header: teal bar + ss: NN + title |
| 145 | 26 | Table row: grid row carrying padding or a separator |
| 58 | 35 | Footer strip |
| 51 | 16 | Corner-bracket sub-block |
| 45 | 5 | Callout row: glyph + label chip + body |
| 8 | 4 | Sticky rail or in-page section list |
| 5 | 4 | Code or slab surface: mono block, leading 2+ |
| 2 | 1 | Figure / media mat with a placeholder zone |

## Reading

Every instance above is hand-authored on the page it appears on. There is no shared implementation
of anything in this table.

The menu bar is the clearest case: **280 authored dropdown groups across 35 pages.** It is one component by
specification — identical on every page, by locked rule — and 35 copies in fact. That is why the
navigation rebuild took a full-library sweep, and why a dropdown whose contents drifted by page was
possible at all.

The label chip is the largest population at 2622 instances. It is also the component whose
type rules changed most often, which is the arithmetic behind the label defects: one rule change,
2622 sites, applied by string match.

## Rebuild target

One implementation each, with a props contract and a usage note, so a change to any row of this
table is a single edit. Priority follows the table: chips and containers first, then section
headers and table rows, then the rest.
