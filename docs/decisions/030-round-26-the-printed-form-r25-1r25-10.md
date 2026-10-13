# Round 26 — the printed form (R25.1–R25.10)

- **Date:** not stated in source
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 756–785
- **Status:** historical record, copied verbatim. Current rules are in `docs/spec/rules.md`.

---

Closes **Q10**, the last item before v0.4. Deliverable: `content-morphia Print.dc.html`, in the Composition group (now five pages: Composition · Implementing · Selection · Anatomy · Print). Five sections — §01 what paper removes and the print contract · §02 one printed value per token, 26 tokens in five classes, filterable · §03 diagrams on paper by tier, switchable T1/T2/T3 · §04 every control resolved or removed · §05 the ten rules.

**Why print needed a page and not a stylesheet.** The queue item read "print states" as a per-visualization property, which is how it sat unbuilt for eleven rounds — there is no such property. Print removes three things (interaction, blurred depth, colour on a monochrome device) and every one of them is a system-wide substitution, not a per-component variant. Writing it per component would have produced 75 answers to one question.

**The contract, and why it was already met.** Rule 7 has always required a mono label beside every semantic fill, and rule 2 has always required an accent mark to be redundant with a shape or a position. The consequence, never previously stated: printed in greyscale this system loses emphasis and no information. That is the strongest claim on the page and it cost nothing — it was already true. The one place it forced a decision was semantic tints: five hues at 16–30% flatten to five indistinguishable greys, so all five print at one value (14% black) and the mono word carries the distinction, on paper as on screen.

**The tier-3 answer** (what Q10 actually named). A 25–80 node canvas has no legible printed scale. It decomposes by the level model it already carries: worked against the live ecosystem canvas — sheet 1 L0 (9 nodes), sheet 2 L1 (23, at the tier-2 ceiling), sheet 3 L2 (12), sheet 4 the 44-row node registry. No printed sheet exceeds 24 nodes; cross-sheet edges terminate in off-page connectors carrying a **sheet number and node name**, never a node id; the registry is not optional, because without it four levels are four unrelated pictures.

| Rule | Statement |
|---|---|
| R25.1 | Print resolves state, never freezes chrome. Every control renders in the state it held with that state stated in words, or it is removed. Nothing prints inert. |
| R25.2 | Blurred depth does not print. S1/S2/S3 → 0.5pt rule at 20% black; L1e, L2 and L3 print as drawn (solid ink); L1 is a hover state and has no printed form. |
| R25.3 | Greyscale is the design target, not a fallback. Every accent mark is redundant with a shape, a position or a label; every semantic fill carries its mono word. A mark that fails this is redrawn, not reprinted in colour. |
| R25.4 | One printed value per token, fixed in §02 and never chosen at print time. Printed measures are stated in points and percentages of black. |
| R25.5 | Type converts once at 0.75 and rounds to the point: body 11pt, T3 11pt bold, T2 21pt, T1 33pt, mono 7.5pt. Print floor 7pt, ticks and axis labels included. |
| R25.6 | Nothing breaks across a sheet that must be read as one object — figure with provenance, callout, code block, table row, diagram, step. A table that must break repeats its header and says it is continued. |
| R25.7 | A diagram is scaled only while every label holds 8pt. Past that it decomposes by the level model — never shrunk further, never cropped, never split anywhere but a level boundary. |
| R25.8 | No printed sheet carries more than the tier-2 ceiling of 24 nodes; a decomposed diagram prints its node registry. Off-page connectors carry the target sheet number and node name. |
| R25.9 | A printed link is text. Cross-references print §NN and sheet number in mono; the teal underline drops with the interaction. Nothing prints a URL. |
| R25.10 | The L2 ration is per document, not per sheet. The running footer carries title, §NN and sheet n of m on every sheet including the first. |

Two rules that cost something and were kept anyway: code wraps on paper with a 2ch hanging indent and a ↳ marker (screen code does not wrap, and clipping loses the line), and the `#fafafa` page canvas prints white while `#fafafa` zebra rows and recessed canvases print at 4% — the same token with two printed values, because on screen it is a background and inside a card it is a step.

Page conformance: one L2 (the print contract), zero solids, five sections, register rows as grid rows (never `<table>` + `sc-for`), all labels 9.5px. Tweaks: defaultTier, defaultClass, showWhy.

**Roadmap.** Layer 04 visualization 90 → 100 (nothing outstanding); weighted total **93.8 → 95.8, reads 96%**. Q10 flipped to done; phases B and C are now closed. v0.4 still open on layers 3, 6 and 7 (95/95/90), all three of which are held by deferred items — motion, icons, dark mode. Open rulings unchanged: stroke icon set, body at 15.5px, the ecosystem-map offer.
