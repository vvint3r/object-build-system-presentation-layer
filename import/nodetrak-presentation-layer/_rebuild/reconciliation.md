# Value reconciliation — census against tokens

Source: `_rebuild/value-census.json`, taken across all 35 pages before any rebuild edits.
Snapshot of the pre-rebuild library: `_archive/pre-rebuild/`.

**9,429 inline style declarations. 2,994 of them (32%) use a value the system does not ratify.**

That is the mechanical answer to why per-page correction never converged: every sweep was
matching a subset of a population three times larger than the specification.

## Off-token declarations, by kind

| Kind | Ratified | Distinct in use | Off-token declarations |
|---|---|---|---|
| Spacing | 17 values, two scales | 39 | **1,293** |
| Letter-spacing | 4 | 12 | **885** |
| Line-height | 6 | 25 | **408** |
| Font size | 11 | 22 | **348** |
| Radius | 8 | 14 | 43 |
| Shadow | 8 | 20 | 9 |
| Color | 24 | 28 | 8 |
| Weight | 6 | 6 | 0 |

Weight is the one clean axis, which is consistent with it being the mechanism the system
actually leans on. Colour is nearly clean: four stray tint opacities (`.28`, `.2`, `.18`, `.2`
where the ratified values are `.3`, `.22`, `.16`, `.22`), 8 declarations total.

## The four largest populations

**Spacing, 1,293 off-scale.** Concentrated in `5px` (337), `7px` (239), `18px` (231),
`26px` (110), `22px` (92), `11px` (72). Neither `5` nor `7` nor `11` nor `18` nor `22`
exists on either scale. This is the single biggest number in the census and it is the
same finding as "everything is cramped": the interior spacing of most containers was
never drawn from a scale at all.

**Letter-spacing, 885 off-token.** Almost entirely `.08em` (569) and `.09em` (112) — the
old label tracking. The label rule was applied to 7 pages; the other 28 still carry it.

**Line-height, 408 off-token.** `1.4` (160), `1.6` (63), `1.5` (49), `1.65` (27), `1.35` (26).
Every one of these sits under the 1.75 floor for 14px prose.

**Font size, 348 off-token.** `15px` (197) is the retired container heading, still standing on
28 pages. `16px` (98) is an intermediate that no tier defines.

## Four specification gaps — all four now decided

These are not violations. They are values that proliferated because **no rule covers them**,
which is why sweeping never caught them and why they will come back if the tokens ship as-is.

**1 · No display or figure scale.** The tiers cover headings and body. Nothing covers a large
metric figure or a masthead variant, so nine sizes appeared: 20, 24, 26, 30, 34, 40, 44, 52, 56.
**Decided:** three only — 24 / 34 / 44, as `--size-figure-sm|md|lg`.

**2 · No display leading.** Same cause, same axis: 1.05, 1.06, 1.08, 1.1, 1.12, 1.2, 1.25 all
appear on large type. **Decided:** 1.15 for anything at or above 28px, one value.

**3 · No joined-edge radius.** Segmented controls and bar caps need partial radii; nothing
names them, so five variants appeared (`3px 3px 0 0`, `6px 0 0 6px`, `0 6px 6px 0`, and two
one-off corners). **Decided:** two cases only — segmented-control end caps and vertical bar caps, both derived
from the existing radii as `--r-seg-start|end` and `--r-bar-cap`. Nothing else takes a
one-sided radius.

**4 · The body size is fiction.** The rules say reading prose is 15.5px and 14px is the floor
for captions and secondary text. In practice: **1,950 declarations at 14px against 358 at 15.5px.**
Fourteen is doing most of the reading in this library.

**Decided: two reading sizes, both named.** `--size-body` 15.5px is prose on the page canvas;
`--size-body-in` 14px is prose inside a container — card, table, callout, list. The library was
already doing this; the rules named only the first, so 1,950 legitimate declarations read as
violations of a floor. Nunito's x-height is small relative to its cap height, so 15.5px is right
for long-form measure and 14px is right in a dense container. The caption size is also 14px and
is separated from container prose by role and by the hairline clearance rule, never by size.

## What the tokens cover

`styles.css` imports four files: `tokens/typography.css`, `colors.css`, `spacing.css`,
`depth.css`. Every value in them is in use in the library today; nothing is aspirational.
The four gaps above are resolved in the token files, so the component layer has no open questions
to bake in.

## Not done, deliberately

No page has been edited. The token layer is extraction only — it changes nothing on screen
until pages are rebuilt as compositions against it, which waits on the external audit.
