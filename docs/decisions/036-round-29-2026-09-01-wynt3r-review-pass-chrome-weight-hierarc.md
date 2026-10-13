# Round 29 (2026-09-01) — Wynt3r review pass: chrome weight, hierarchy, breathing

- **Date:** 2026-09-01
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 887–909
- **Status:** historical record from the original library, copied verbatim. The rules in force are in `kit/report-kit/SPEC.md`.

---

Ten comments across Prose, Learning, Structured and Foundations. Five became rules.

**R28.1 — a link is drawn as a link.** Every in-page and cross-page anchor now carries the 1.5px teal underline at 3px offset: on-this-page strips, sticky-rail TOCs, also-in-group lists. Swept across 24 pages. One exemption stays unmarked because it is a tabset, not a link list: the six group pills (rule 17). The scroll-spy indicator bar is retired from every on-this-page strip — it marked one anchor of five and left the rest bare, and the two strip designs made identical navigation look different page to page. Every strip is now the same: underlined mono anchors at 5px 9px, no bar.

**R28.2 — progress markers carry teal as a rail, not a disc.** The vertical stepper's completed steps were 28px teal-filled discs with black borders; four of them in a column outweighed the step text. Completed is now a 22px white circle, 1.5px black border, black check, with the connector beneath it in 1.5px solid #1de9b6. Teal stays redundant with the check glyph and with position. Ahead steps take the same circle with a mono numeral; the current step keeps the single black fill plus reserved teal offset. All circles down 28 → 22px, numerals now LABEL mono 10.5/700.

**R28.3 — no third boundary inside a container's child.** The stepper's INPUTS / OUTPUTS pair sat in 12×12 corner brackets, three boundary levels deep inside a card inside a step. Brackets dropped: a labelled pair inside a step, cell or card is a mono label with its value beneath, at 28px column gap.

**R28.4 — a T3 heading must outrank its own rows.** The module-summary table set both its heading and its row text at 15/700, so the heading read as another row. Rows to 400; the heading keeps 700. Where a container's body rows share the heading's size they are always the lighter weight.

**R28.5 — specimen commentary is separated, attribution binds up.** In the quotation specimen, quote, attribution and commentary all sat 12–16px apart at three sizes, so the attribution line could be read as belonging to either neighbour. Attribution now sits 6px under the quote with an em-dash prefix; commentary sits 28px below behind a 1px #ebebeb rule. Answers the standing question about why commentary is 13.5px: it describes the specimen rather than being it.

**Learning ss: 04 rebuilt.** The placement model was four container levels deep — S2 card → dashed figure frame → tile grid, with a bracketed detail panel and two more bracketed sub-blocks below. Now one container: the dashed figure frame holding the 2×2 tiles, with title, description, axis legend and provenance on the page around it per rule 16. The detail column is a bare definition list; HOLDS WHEN / BREAKS WHEN became two sentences with bold lead-ins under R27.8. Body text in the section up from 14 to 15px throughout.

**Breathing.** Structured: stage-card padding 16 → 20, card gap 12 → 18, stage titles 13.5 → 15/800, descriptions 12 → 13.5, stepper step clearance 22 → 34, sibling modules 16 → 28. Prose: sibling list cards 16 → 28, list row gaps up one step, paired-column gap 28 → 32. Learning: quadrant tile gap 16 → 20.

**Open.** ALSO IN GROUP strip on the nine new template pages; icons blocked on a Figma file.


---
