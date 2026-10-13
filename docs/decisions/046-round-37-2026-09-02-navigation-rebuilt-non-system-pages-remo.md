# Round 37 (2026-09-02) — navigation rebuilt, non-system pages removed

- **Date:** 2026-09-02
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 1176–1192
- **Status:** historical record from the original library, copied verbatim. The rules in force are in `kit/report-kit/SPEC.md`.

---

**The complaint.** Selecting a menu item changed the options inside that menu: each page carried an ad-hoc `ALSO IN <GROUP>` strip listing a different subset of siblings, so the same parent appeared to hold different children depending on where you stood. The page's own section list also sat inside the menu container, making a table of contents look like site navigation.

**R37.1 — the menu is fixed, the dropdown is the group.** Five groups (Programme retired): Foundations · Components · Diagrams · Templates · Composition. Each pill carries a hover/focus dropdown listing every page in that group, same order, on every page. Current group = active-tab pill; current page = #f1f1f1 pill at 700 inside its own dropdown, not a link. Dropdown items Nunito 400/14 + teal underline; pills stay mono caps and unmarked. `ALSO IN <GROUP>` retired.

**R37.2 — the table of contents is not navigation.** `ON THIS PAGE` moved to its own non-sticky #fafafa strip below the menu bar with a bottom hairline. Anchor targets 126 → 78px. One sanctioned helmet exception: `[data-nav-group] [data-nav-menu]{display:none}` + `:hover,:focus-within{display:block}` — a descendant hover cannot be expressed inline.

**R37.3 — dashed frames are diagram canvases only.** 54 `1px dashed #d9d9d9` frames audited in context; 27 converted to borderless white + S1, 27 kept. Kept: the twelve scrolling drawing canvases (Diagrams II ×5, III ×3, IV ×4, at Scale ×1), the seven diagram specimens on the library page, the cycle diagram on Learning, and the three small annotation frames (Anatomy, Equivalents, Print). Converted: every case where the frame existed only because a container held shadowed children — the frame was solving a problem created by nesting a tile inside a card. Matrices and register grids that had been framed as canvases (Structured, T2, T8, Learning) are tables and lost the frame with the rest. A redundant corner bracket inside a newly enclosed card is dropped.

**Pages removed.** `Review` (inspection findings) and `Options` (visual-direction explorations) on the user's instruction; `Depth & Density` on the same principle — a proposal record written in second person about the user's marks, whose rules are locked in CLAUDE.md and specified at Foundations ss: 04. `Roadmap` and `Taxonomy Audit` were kept by the user but sit outside all five groups: they carry the standard menu with no active pill and appear in no dropdown.

**Reporting stripped from system pages.** Diagrams at Scale ss: 06 turned from a built/queued/parked coverage table into a **family index** (family → page carrying its specimen, Built rows only, state column and the wave-plan block gone). Diagrams III/IV: wave framing out of both mastheads and footers, "Rules added" → "Rules", the coverage-after-wave and still-open cards deleted. Foundations: masthead status row (IN REVIEW · depth language · updated Aug) and the v0.1 footer stamp gone; page chip dropped where it merely repeated the active group pill (Foundations, Composition).

**Standing rule.** A page in this project contains rules, specifications, limits and specimens. Round numbers, coverage percentages, ratification status, queue state and anything addressed to the user belong here, not in a page. The test: would an agent building a new document need this to build it correctly?
