# Round 40b (2026-09-07) — first batch of five, and the pass that does it

- **Date:** 2026-09-07
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 1348–1380
- **Status:** historical record from the original library, copied verbatim. The rules in force are in `kit/report-kit/SPEC.md`.

---

Icons · Print · Equivalents · Structured · Prose rebuilt as compositions. **376,570 → 294,057 chars across
the six pages now on the component layer** (Foundations included), between 23% and 45% off each page, no
content removed. `cm-footer` added as a twelfth component.

**The pass is a pass, not a set of page edits.** `_rebuild/compose.js` records the patterns; every page is
converted by the same routine, which asserts before it writes — nav and on-this-page bounds found, at least
one anchor in the strip, a section header row under every teal bar, `<dc-import>` and `<section>` tags
balanced. A page that fails any assertion is reported and left untouched. That is the discipline round 38f
named and never had: a rule expressed as a pattern needs a check expressed as a pattern.

**Four off-token values normalised by the components rather than by hand**, which is the whole return on the
shared layer:
- section rhythm 88px → 96px (rule 9), on the four pages that had drifted
- page-header top padding 40 / 48 / 72 / 88 → one value, 48px, on the structural scale
- page title 40 / 44px at 1.06 / 1.08 leading → 44px at 1.15 (the decided display leading)
- page lede 16px / 1.8 / 68ch → 15.5px / 1.85 / 70ch (the page-canvas body tier)

None of these can drift again on a rebuilt page: the value exists once, inside the component.

**One mislabelling found:** `Structured`'s footer strip carried `data-screen-label="Expansion notes"`, so a
comment on the footer arrived tagged as a section that does not exist. The footer row also underlined its
link with `border-bottom` rather than the canonical `text-decoration` underline (R28.1); `cm-footer` uses
the canonical treatment. **The other 33 pages carry footer variants the pattern does not match** — they
convert as each page is rebuilt, not in a sweep.

### Queued next
Batch two: Wayfinding · Provenance · Charts · Interaction · Learning. Then Questions · Change · the four
Composition pages. Templates and the eleven T-pages last, since they carry the sticky rail (R36.13) and a
page badge, neither of which is in the component set yet.
