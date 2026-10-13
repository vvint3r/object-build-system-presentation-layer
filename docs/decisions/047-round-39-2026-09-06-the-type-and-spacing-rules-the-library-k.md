# Round 39 (2026-09-06) — the type and spacing rules the library kept failing

- **Date:** 2026-09-06
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 1193–1289
- **Status:** historical record from the original library, copied verbatim. The rules in force are in `kit/report-kit/SPEC.md`.

---

Twelve marks from the user across Structured ss: 06–09 and Foundations ss: 08–16. Every one was a rule defect, not an instance defect, so each is ratified in CLAUDE.md before any page was touched. Pages rebuilt this round: **Structured** (Metric, Comparison, Requirement & evaluation, Learning) and **Foundations** (Callouts, Tables, Media, Code, Prose, Extension points). The remaining 32 pages are queued.

### Ratified

**R36.1 labels recede by weight and tracking, not by size.** First pass authored every label at 10px; the render environment floors font-size at 12px (probe: 8/9/10/11/11.9px all compute to 12px, 13px computes to 13px), so 234 declarations changed and nothing moved on screen. Size is not the lever available. LABEL is now 12px/**600**/caps/ls **.05em** against the previous 12px/700/ls .08–.1em: the tracked caps string was optically wider and blacker than the 15.5px prose it annotated, and dropping weight one step while more than halving tracking pulls it back without touching the caps signal. IDENTIFIER stays 12px/600 verbatim, no tracking; case and tracking carry the role split, as R34.2 intended. Standing consequence: **a size claim in this system must be verified against computed style, not the authored value** — 238 label declarations across the two pages now match what they paint.

**R36.2 heading tiers, and the floor under them.** T3 was 700/15 against 15.5px body: a container heading set *smaller* than its own contents. Now T3 800/19 lh 1.3 ls −.01em, with T3b 700/16 for the corner-bracket sub-block. 45 headings raised; 6 corner-bracket titles converted from mono caps to Nunito (R35.4 was already law and still being broken).

**R36.3 label never on the heading's line.** The metric card read `METRIC | Pipeline freshness | PUBLISHED` on one row, and the evaluation card `EVALUATION | Orchestrator selection | MED CONFIDENCE`. Both now run label row → heading → body. This was the user's most specific structural complaint and had been raised before.

**R36.2 breathing floors raised.** Container padding ≥28 (primary 32), sub-section separation 28px + inset hairline, label→content 12, card grid gaps 20, list item gaps 12, row padding-y 16, line-height ≥1.75 at 14px. The compare card is the reference case: label row, heading, description, **rule**, pro/con, **rule**, best-for label + value.

**R36.4 no one-sided fence.** The callout summary box and the two technology reference labels carried a left accent border. Retired: emphasis is L1e (offset below and to the right), and the accent enters the reference header as a 44×3 bar under the heading.

**R36.5 grey retired as a surface.** Table header rows, row hover washes and subtle-fill buttons lose #f1f1f1. Header rows are white under a 1.5px black rule; hover is rgba(29,233,182,.12); the quiz option is white + 1px #ebebeb. #f1f1f1 survives as a track and as the figure/video placeholder zone only.

**R36.6 code is colour-coded.** Five token roles: keyword #6a3ea1/700, string #0e7a5f, numeral #a3441a, callable #000/600, comment #000/300 italic. Contrast on white is 5.3:1 or better for every hue. Weight still carries structure, so the palette is additive. This is the single exemption from the black/white ink law, and it is scoped to a code surface.

**R36.7 black fill ration tightened.** Retired: black status chips, the black code surface, the black display slab, the black inline-code chip. Kept: primary button, the one selected control in a set, the current step marker, diagram terminals, chart axis/threshold lines. The display slab becomes white with a 1.5px black border.

**R36.8 tables carry no outline.** Borderless white at S1 radius 12, title above as a label with no rule beneath it, header row white under one 1.5px black rule, rows on #ebebeb hairlines at 16px padding.

**R36.9 no em dash in page copy.** 53 instances removed across the two pages: colon where the second clause explains, comma where it qualifies, full stop where it is a second statement. Attribution takes a mono label, never a dash. En dash survives in numeric ranges.

**R36.10 code split from media.** Foundations ss: 14 is Media (figure + video, each now with a T3 title and a one-line description above the slot per R19.11); ss: 15 is Code, carrying the block, the token palette, inline code, the language badge and the technology reference header. Prose moved to ss: 16, Extension points to ss: 17.

### Pages removed
`Roadmap` and `Taxonomy Audit`, on the user's instruction: temporary working pages, outside all five groups, not product-level output. Three footer links to Roadmap (Interaction, Provenance, Wayfinding) removed; `taxonomy-audit-data.js` deleted. Library is 34 pages.

### Also removed
Foundations ss: 16 "Expansion notes" was half specification (remappable semantics, data-driven scales) and half roadmap ("Next components — priority order", "then page templates:"). The roadmap card is gone and the section is now **Extension points**, four rules on the page canvas with no container, per R19.7.

### Queued
The 32 remaining pages need the same six mechanical sweeps (mono 10px, T3 19/800, corner-bracket titles, spacing floors, grey surfaces, em dash) plus per-page checks for black fills, one-sided fences, table outlines and label-on-heading rows. Two open calls for the user: whether button labels move from mono to Nunito, and whether the technology reference header pattern is right before it is applied library-wide.


### Round 39b — the sweep was blind by construction, and two tiers collided

**The blind spot, named.** Three rounds running, mono labels survived a sweep that reported success: Foundations table cells, then Foundications chips, then T6's title-block chips and breadcrumb. One cause each time: both the sweep and the checker tested `style.includes('JetBrains Mono')` on the element's OWN attribute, and a label almost always inherits the family from its row and never names it. A check scoped that way structurally cannot see the violation it exists to catch.

Fixed at the cause. `dc-inherit.js` parses the page into a real tree and resolves `font-family`, `font-size`, `font-weight`, `letter-spacing` and `text-transform` through each element's ancestors; `sweep.js` and `lint.js` both consume it. A literal is only rewritten when **every** element carrying it resolves to a mono caps label, so a shared style string cannot be changed out from under a Nunito context. It found 19 labels across the seven finished pages that three prior string passes had missed.

**Tier collision (R36.11).** Raising T3 15 → 19 → 21 collided with pages whose section titles were authored at 800/21 (T6 Metric, T9 Reference: five each). Both tiers painted 21px/800, so a section title and a card heading were indistinguishable — the exact complaint the round was fixing, reintroduced one level up. Section titles raised to the ratified T2 900/28. The checker now asserts `max(h2) > max(h3)` per page; before this, a page could pass with both tiers equal.

**Scroll-spy bars (R36.12).** R28.1 banned the bar in on-this-page strips; T6 and T9 carried one in a sticky rail TOC, which the rule's wording did not reach. Scope widened to every section list, strip or rail: the current item is weight 700 and not a link, with no bar beside it.

**Checker false positives tuned out** so its counts are trustworthy: sanctioned segmented-control tracks, token swatches, the rule-17 current-page pill, the `ss: NN` + h2 section header (not a label on a heading), two-sided borders (not a fence), rows padded like rows, and deliberate label/value micro-pairs.

**Stale specification text.** Anatomy documented retired rules in its own field tables: zebra rows, grey header fills, white-on-black code, mono at 9/9.5/10px. Nine strings corrected. A page that specifies the old system to implementers is worse than one that merely looks wrong, and no visual sweep can find it — this class needs a content read, not a scan.

**State.** Seven pages at zero blocking findings: Foundations, Structured, T9 Reference, Diagrams, Anatomy, Diagrams II, T6 Metric. Twenty-eight queued, 78 blocking findings between them.


### Round 39c — black fill, checked as a class

Same blind spot, third instance, now closed by the same method. The black inline-code chip retired in R36.7 survived on seven pages the checker had passed at zero, because `sweep.js` matched one literal (`padding:.35em .8em`) and `lint.js` required either padding ≥12px (a surface) or `text-transform:uppercase` (a caps chip). A lowercase mono identifier at `padding:2px 8px` fell between all three tests.

**The rule, stated so it can be checked:** a black fill carrying **monospace** text is legal only on an interactive control. Black fill on Nunito is the sanctioned set (diagram terminal, current-step marker); black fill on mono is a chip, a slab or a code surface, all of which R36.7 retired. `blackFillFixes()` in `dc-inherit.js` resolves family and interactivity through the tree and returns chip corrections plus a hand-fix list for surfaces. Across the library it found **23 black mono chip styles and 4 black mono surfaces**, 17 of them on pages already reported clean.

**Consequences on the finished pages.** T9 Reference 6, Diagrams 3, T6 Metric 3, Foundations 2, Structured 1, Diagrams II 1. The Diagrams node legend drew its START terminal as mono on black; a terminal label is a node label, so it is now Nunito 700/14 like the Step node beside it, and the legend reads consistently: nodes and terminals in Nunito, only their type labels in mono.

**T6's equation is the display slab, not a code surface.** The black→white conversion had treated it as code (borderless white, S3 float, mono 12px). Per R7b it is the section's defining equation: white, 1.5px black border, identifier mono at 17px, 26px padding. A code surface and a display slab are different components and the conversion should not have inherited across them.

**Checker note.** The body line-height floor now skips mono runs, since a slab or code block sets its own leading.


### Round 39d — the em dash as a value, and the rail question decided

**Dash check widened to the class.** `lint.js` counted ` — ` with surrounding spaces, so a bare em dash used as a **no-data glyph in a table cell** was invisible to it and T6 reported clean with one on screen. Foundations had already resolved this construct to `n/a` in its own tables; the rule had just never been stated. Now: a dash standing in for missing data is a value, not punctuation, and reads `n/a`. The check reads rendered copy with `<script>` blocks stripped (Anatomy's field tables use `"—"` as a programmatic sentinel that never renders) and catches both forms. Found: T6 ×1, T9 Reference ×1, Diagrams ×2 (an em dash used as an arrow shaft in a diagram's text alternative, now `→ request →` like the rest of that sentence, and a JS placeholder).

**R36.13 — which rule owns a page's section list.** Rules 16 and 17b both described "a page's section list" and neither said which artifact it governed, so T6's rail sat between them for two rounds. Decided: **17b governs library documentation pages** (the horizontal ON THIS PAGE strip under the menu bar, #fafafa, not sticky). **A template sample is a specimen of a delivered document, not a library page, so its in-page navigation is the rule 16 sticky rail** — ≤260px, ≤60vh with internal scroll, released to a static row at 1150px. The horizontal strip is library chrome a specimen does not carry. Both patterns mark the current item by weight alone (R28.1). T6 and T9 rails brought inside the 60vh internal-scroll limit; the checker now asserts it, so the twelve template pages inherit a decided pattern.

**Pattern across 39b, 39c and 39d.** Three consecutive defects had one shape: a check scoped narrower than the rule it enforced — family read from the element's own attribute, black fill gated on padding size and caps, dash matched only with spaces. Each was invisible to a passing checker. The standing correction: **a check asserts the resolved, rendered property, and it must be able to see every form the violation takes.** The three fixes live in `dc-inherit.js` and are shared by sweep and checker so a rule cannot drift between them.


### Round 39e — the rail cap belonged to the sticky state

Adding `max-height:60vh;overflow:auto` to `#page-rail` inline put the cap on the element instead of inside the sticky branch, so it survived the ≤1150px release: below that width the rail is `position:static`, full-width ordinary page content, still capped at 60vh with internal scroll. It did not clip at the review width (two cards side by side, scrollHeight = clientHeight) but would on any viewport under roughly 657px tall, once `flex-wrap` stacks the cards to ~394px — a nested scroll box trapping page content mid-flow.

The cap now lives in the media block alongside the release (`max-height:none!important;overflow:visible!important`) on both rail pages. The checker asserted only that the cap **exists**; it now also asserts the release **drops** it, and that assertion is ship-blocking, because a page could otherwise pass while carrying the trap.

**Rule for responsive state generally:** a constraint that belongs to one responsive state is authored in that state's block, never on the element. An inline constraint is unconditional by definition, and a media query that does not name it cannot undo it.


### Round 39f — the checker was only testing the negative half of a rule

R36.8 has two halves. The checker tested three prohibitions (no grey header, no zebra, no outline) and asserted **none of the requirements**, so a table with no row separators at all and cells at 3px padding passed at zero blocking. T6 carried two such tables while a register two blocks down on the same page had the hairlines, so one page showed two tabular components that did not match.

**Now asserted:** a run of sibling grid rows sharing one template is a table; every body row after the first carries a row separator (1px #ebebeb solid, or the dotted #d9d9d9 register variant), and rows are padded ≥16px vertically on the row or on its cells. Two refinements were needed before the count could be trusted: grouping by **parent identity** rather than a positional key (a weak key had collapsed unrelated grids into one 13-row phantom table and produced 151 false findings), and allowing the run's open edge (a bottom-based separator run legitimately omits its last row).

**Applied as a pass, not by hand.** `applyTableFixes()` works by source position, because rows in one group share a style literal and the first body row sits under the header rule and must not take a top hairline. Fixed this round: T9 Reference 11 hairlines, Diagrams 11 hairlines, plus cell padding raised from 3px and 14px to the 16px floor on four pages. The 12-week series table under T6's chart was the extreme case at 3px cell padding.

**Queue: 94 blocking findings across 28 pages, 47 of them table rows on 7 pages.** The count keeps rising as the checker learns to see; that is the intended direction.
