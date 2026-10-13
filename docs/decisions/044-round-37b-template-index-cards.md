# Round 37b — template index cards

- **Date:** not stated in source
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 1042–1078
- **Status:** historical record from the original library, copied verbatim. The rules in force are in `kit/report-kit/SPEC.md`.

---

Wynt3r's three notes on the ss: 01 grid, from a marked-up screenshot.

**Glyph placement corrected.** The glyph sat inline before the title, pushing it right and leaving it out of alignment with the text beneath. It now sits on its own line above the title at **20px**, left edge flush with the whole text column. This is a general correction to rule 18's index-card placement, not a page fix: an index-card glyph is never inline with the title it labels.

**The featured card was set differently from its peers for no reason.** T1 carried its description to the right of the title while the other twelve carry it beneath; it now matches. Card descriptions 13 → 15.5px, interior rhythm opened to 22px before the glyph and the blocks line and 24px before the link, padding 26/28 → 28/30.

**The black pill is gone from the featured card.** It was the heaviest mark in the first screen and outranked the card it sat in, while the same action on the other twelve cards is a plain text link. T1 now uses that link too, so the featured card's emphasis comes only from its reserved offset shadow — which is what the shadow is for. Rule 7c's black-fill ration is unchanged; this card simply was not the place to spend it.

**Also fixed:** the header stated three inconsistent counts for the same grid — "eleven shells", "a tenth shape", "9 shells" — because T10 and T11 were added without updating them. All three now read against the twelve cards in the grid.

### Round 37c — geometry follows the type

The 14px sweep changed `font-size` and nothing else, so every hard-coded width tuned to the retired 10.5–12px mono became too small. Fixed, and the general rule: **a px width or grid track holding a mono label is a derived value, not a constant — when the type tier moves, it moves with it.**

| Where | Was | Now |
|---|---|---|
| Diagrams ss: 02 process lane tracks | `88 56 118 56 118 56 88 64 118 56 88`, min 920 | `96 80 126 80 126 80 96 80 126 80 96`, min 1066 |
| Diagrams ss: 03 user-flow tracks | `140 68 140 68 88 68 140`, min 730 | `140 92 140 92 88 92 140`, min 802 |
| Diagrams ss: 08 taxonomy long label | `max-width:230px` + nowrap + ellipsis | `max-width:300px`, wraps at 1.5 — a tree label is read, so it is never truncated |
| Diagrams II ss: 01 sequence | PW 150 · PP 194 · PH 56 · MY0 104 | PW 196 · PP 244 · PH 68 · MY0 116 |
| Diagrams II ss: 03 state machine | SNW 168 · SNH 58 | SNW 216 · SNH 70 |
| Diagrams II ss: 04 topology | TNW 172 · TNH 58 | TNW 220 · TNH 70 |
| Diagrams at Scale canvas | NW 196 · NH 62 | NW 228 · NH 70 (density-floor prose and the registry specimen updated with it) |
| Diagrams at Scale ss: 06 coverage | `1.5fr 1.1fr 82px` | `1.5fr 1.1fr max-content` — a chip track sizes to its chip |

Not changed: the system-flow row at `min-width:780px` overflows its dashed canvas by 9px, and that canvas carries `overflow-x:auto` — a scrolling diagram canvas is the specified behaviour, not a clip.

### Round 37d — the rest of the geometry

**R11.1 restated.** The lane canvas is **152px mono rail + 160px columns + 12px gutters at 1024px** (was 100 / 160 / 12 at 960). Two rail labels — "Touchpoints" and "Opportunities" — overflowed the 100px track into the first lane column; the other nine fitted only by wrapping to two lines. The blueprint's boundary-line chip offset and note width follow the rail: left 100 → 152, note 848 → 860. The prose at Diagrams III ss: 04 states the new number.

**Label columns raised with the tier.** Every `grid-template-columns:<n>px 1fr` between 40 and 100px — rule-id columns, ordinal columns, lane labels — raised by the same factor the type moved: 80 declarations across 18 pages. Columns at 26 and 34px hold a numeral or a bullet and are untouched; columns over 100px already had the room.

**max-content reverted on the coverage table.** `1.5fr 1.1fr max-content` is wrong in this system: every table here is built as one grid per row (the `<sc-for>`-in-`<table>` rule), so a content-sized track resolves per row and columns drift out of alignment between rows. It measured clean only because the chips happened to be near-identical widths. Back to a fixed 104px. **Standing consequence: never size a track to its content in a per-row grid — widen the fixed value instead.**
