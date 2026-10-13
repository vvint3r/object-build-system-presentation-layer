# Round 40 (2026-09-07) — the shared component layer, and the pilot rebuild

- **Date:** 2026-09-07
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 1290–1347
- **Status:** historical record, copied verbatim. Current rules are in `docs/spec/rules.md`.

---

**Four calls answered on a form:** start the rebuild now rather than hold for an outside audit (none had
arrived in the project) · **Foundations is the pilot page** · **one shared component file per part, imported
by every page** · **button labels stay mono caps** · the technology reference header is signed off for
library-wide application.

### R37.1 — control labels are mono caps, by exemption
R35.2 asks whether a string is a code or a word, and by that test a button label is a word. Ruled the other
way: a control label is mono 12/600 caps with .02em tracking on every page. The label of a control is not
prose about the control, it is the control's identity, and the system has 40 pages of buttons that read as one
family only because they share that treatment. This is the second standing exemption to R35.2 after the
rule 17 nav pills. It closes the open item carried since round 38d.

### R37.2 — a repeated part has exactly one implementation
The component census counted 2,622 label chips, 496 containers, 280 authored menu bars and 152 section
headers, every one hand-written on the page it appears on. Nine shared Design Components now exist and are
the only legal way to author those parts:

| File | Part | Props |
|---|---|---|
| `cm-nav.dc.html` | rule 17 menu bar, closed group/page registry in its logic | page, badge |
| `cm-toc.dc.html` | the on-this-page strip for library pages | items (JSON), current |
| `cm-mast.dc.html` | masthead: bar + page title at 900/44/1.15 | title |
| `cm-section.dc.html` | teal bar + `ss: NN` + T2 900/28 title | n, id, title, label, padBottom |
| `cm-container.dc.html` | the eight legal surfaces (card, hairline, primary, float, canvas, emphasis, reserved, tile) | variant, pad |
| `cm-chip.dc.html` | label chip / status pill, thirteen tones, three roles | tone, role, shape |
| `cm-callout.dc.html` | callout row: glyph + label chip + body, closed eight-label vocabulary | label, fill |
| `cm-table.dc.html` | rule R36.8 table: label title, white header under a 1.5px rule, hairline rows, ≥16px cells | cols, head (JSON), title, mono |
| `cm-bar.dc.html` / `cm-bracket.dc.html` / `cm-code.dc.html` | magnitude bar, corner-bracket sub-block, code surface | pct/label/value · title · file/lang |

**Page prose stays on the page.** Verified before building: template children pass through a
`<dc-import>` to `{{ children }}`, so a container, callout, table cell or section body is authored as page
markup inside the component. The component owns geometry, type and depth; the page owns words. That is what
makes the shared model compatible with in-place editing, and it is why the components take no body-text props.

**The registry is the point.** `cm-nav` holds rule 17c group membership as data, so the defect rule 17
exists to prevent — a dropdown whose contents vary by page — is now unrepresentable rather than forbidden.

### Pilot: Foundations rebuilt as a composition
17 sections, masthead, nav and on-this-page strip all now mount shared components; the 8 callouts and both
table specimens are component instances. **141,625 → 116,982 chars, a 17% cut with no content removed**,
almost all of it the 14,385-char authored menu bar. Two off-token values fixed in passing: the masthead title
52px → 44px at 1.15 leading (the decided figure scale), its lede 17px → 15.5px at 70ch. One labelling defect
found and fixed: `sec-blocks` carried `data-screen-label="Core blocks"` with no section number, so a comment
on ss: 12 could not be placed.

**Deliberately not converted:** the chip specimens at ss: 06. That section's job is to display raw token
values, so it is the one place the literals belong. Chips convert on pages that *use* them.

**Token files stay documentation.** `styles.css` and `tokens/*.css` record the ratified values; the runtime
mechanism is the inline literal inside each shared component, one copy per part.

### Queued next
Batch of five pages against the component layer: Icons, Print, Equivalents, Structured, Prose. Then the
technology reference header applied library-wide, now that it is signed off.
