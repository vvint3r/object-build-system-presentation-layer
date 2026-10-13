# Round 37 — the 14px type floor (2026-09-02)

- **Date:** 2026-09-02
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 1030–1041
- **Status:** historical record from the original library, copied verbatim. The rules in force are in `kit/report-kit/SPEC.md`.

---

Wynt3r's ruling, answered on a three-question form: the floor is 14px, it covers mono labels as well as reading text, 14px is caption and source size, and the sweep runs across all pages now.

**R34.1 — one floor, 14px, no exceptions.** Every size below it is retired: 9 · 10 · 10.5 · 11 · 11.5 · 12 · 12.5 · 13.5 all move to 14. The former exceptions go with them — axis and tick labels at 9–9.5 and the 10.5 hard floor for labels are both gone. **3,139 declarations across all 40 pages.**

**R34.2 — mono is one size in two roles, replacing R27.1.** The two mono role sizes (LABEL 10.5, IDENTIFIER 12) collapse to 14px, and the roles are now told apart by case and tracking alone: LABEL 700 caps ls .08–.1em for strings that are scanned, IDENTIFIER 600 verbatim case no tracking for strings that are read. The `ss: NN` section number, previously the one sanctioned value between the role sizes at 11px, is 14px/400 at ls .1em — it keeps its own treatment but no longer its own size, so the named exception in R27.1 dissolves rather than being restated. A mono string distinguished from its neighbour by size is now a violation in the same way a sub-floor size is.

**Reading text versus the floor.** 14px is the caption tier — a source line under a figure or table, an attribution, a specimen note. Reading prose is never set at the floor, so the 13px card and description paragraphs (those carrying `font-weight:400` and a leading of 1.7–1.85) went to **15.5px body**, 18 of them, rather than to 14. Specimen commentary and bullet sub-lines, which are commentary rather than prose, sit at 14.

**Consequence to expect.** Chips, badges, table headers and nav pills grow by roughly a third. The six group pills plus brand and version chip now wrap sooner in a narrow viewport; that is the cost of the ruling, not a defect.
