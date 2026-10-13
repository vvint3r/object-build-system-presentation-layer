# Round 36 — the glyph sweep (2026-09-02)

- **Date:** 2026-09-02
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 1000–1029
- **Status:** historical record, copied verbatim. Current rules are in `docs/spec/rules.md`.

---

Q20 closed. The treatment was ruled in round 35; this round pulls the working set, closes it as a register, and places it.

**Source correction.** The specimens were recorded as Iconex. The mounted file is **Basil Icons (community)** — 497 glyphs on a 24px grid, `Outline/<Category>/<Name>` with a `Solid/` twin per shape. The naming in the round-34 materialisation matches this file exactly, so the round-34 mount was the same file under the wrong name. Attribution corrected on the Icons page and in locked rule 18. No glyph geometry changed.

**R33.2 — a glyph enters only through a closed register.** Icons ss: 04: 23 concepts, one shape each — eight callout labels, three empty states, twelve index cards. Same closure as the label vocabulary: a concept absent from the register takes no glyph, and no two concepts share a shape.

**R33.3 — the fourth admission condition, found by building it.** The constant waterline at 13 of 24 only reads when the solid twin *floods an enclosed area* above it. On a glyph drawn as a stroke the solid twin is nearly identical to the outline, so the black outline covers the teal exactly and the fill is invisible at every size. Measured on the first working set: lightning, flask, lock, magnifier and check all showed no band. Five swaps followed — Important lightning → pin, Example flask → file, Limitation lock → cancel, nothing-matched magnifier → open folder, nothing-open check → box. The condition is now stated on the page: stroke-shaped glyphs stay out of the fill placements. The alternative — a per-glyph waterline — was rejected because rule 18 makes the waterline a constant of the family.

**Placement sweep.**
| Where | What | Treatment |
|---|---|---|
| Foundations ss: 08 | eight callout labels | 20px outline — eight shown together are a grid of peers, so no fill |
| Templates ss: 01 | eleven template cards + the reference build | 24px outline |
| Wayfinding ss: 01 | search with no results | 32px filled |
| Charts ss: 04 | the four empty conditions | 32px filled |
| Roadmap ss: 05 | nothing open | 32px filled |

**Two defects found while sweeping, both fixed.**
1. `Selection.dc.html` shipped with a missing comma in the callout array, so `CO` evaluated to seven entries with the last `undefined` and `renderVals()` threw — the whole page, including the ship-blocking pre-flight gate, was dead. Two occurrences of the same fault: one in the callout array (introduced when Correction was added in round 31) and one in the selection matrix after the Provenance citation-marker row. Neither was caught because the failure is a blank render, not a console-visible layout fault — the whole file must be scanned for the pattern, not just the line that surfaced it. Gate check 4.3 also still read "one of the seven in ss: 01"; corrected to eight.
2. Foundations ss: 08 carried seven callouts, not eight. Correction was added to the vocabulary in round 31 and never added to the specimen. Eighth row added with the freshness-metric correction sentence.

**Interim tiles removed.** The two two-letter technology tiles at Foundations ss: 14 are deleted rather than replaced: a tech reference label is not one of the four sanctioned placements, and the caption already ruled that technology is named in mono and never by logo.

**Not swept, and why.** Interaction ss: 02's filtered-to-zero state has no static markup — it renders only when the filter empties — so the funnel glyph has no placement and was dropped from the register rather than left in it unplaced. Register row labels remain an available placement with no entries: no family in the Anatomy, Change or Print registers is a closed-vocabulary name, so under condition one none of them earns a glyph.

**Files.** `icons/set/` — 35 composed SVGs, `<key>-o.svg` outline and `<key>-f.svg` partial fill, referenced by `<img src>`; the fill file clips the solid twin to `rect(0,0,24,13)` in #1de9b6 under the unchanged black outline. Composed files rather than a sprite because cross-root `<use>` is dropped by the screenshot and print pipelines. `icons/duo/` deleted (superseded, and each file carried ~9KB of provenance metadata). `icons/icon-data.js` regenerated at 35 entries.
