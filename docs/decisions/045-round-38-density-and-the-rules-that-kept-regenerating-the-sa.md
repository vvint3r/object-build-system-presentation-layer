# Round 38 — density, and the rules that kept regenerating the same defects (2026-09-02)

- **Date:** 2026-09-02
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 1079–1175
- **Status:** historical record from the original library, copied verbatim. The rules in force are in `kit/report-kit/SPEC.md`.

---

Wynt3r's fifth complaint about compactness. Reading the previous four back, every one was answered as a local fix to the thing he pointed at, so the rule that produced it stayed in force and produced it again somewhere else. This round changes the rules.

**R35.1 — mono sets at 12px.** The 14px floor (R34.1) is a *reading* floor. JetBrains Mono runs optically larger than Nunito at the same nominal size, so applying one number to both made every label shout. Mono is 12px, the optical match for 14px Nunito. **2,192 declarations.**

**R35.2 — mono is scoped by section, not sprinkled per element.** The old rule 3 said mono for "ALL labels/meta/timestamps/tables/badges/code", which licensed a mono string anywhere a word could be called a label. On the journey map that produced a view where mono outnumbered Nunito: phase numbers, lane names, touchpoint chips, mood words and axis ticks were all mono. New rule: a section picks the CLASS of thing that is mono — its table, its code, its identifiers, its one label column — and everything else is Nunito. A chip carrying a word a reader reads is Nunito; a chip carrying a code, unit or id is mono.

**R35.3 — zebra is retired.** Rows are separated by space and a 1px #ebebeb hairline. Table row padding floor raised 8 → 14px. **24 alternating fills removed, 282 row paddings raised.** A table that needs a stripe to be legible is a table with too little air in it.

**R35.4 — the title after a corner bracket is Nunito, never mono caps.** Rule 6 has said the sub-block title is Nunito 700/15 since round 28, and 28 sub-blocks across seven pages were still mono. This was the single most repeated breach in the library, and it is why "BOUNDARY LINES" read as smaller than the rows beneath it: a module title in 12px mono cannot outrank a 15px Nunito row, so the hierarchy inverted every time it appeared.

**R35.5 — a dashed canvas never contains another dashed canvas.** Two live cases: the label-discipline specimen sat in a dashed frame, inside a corner-bracket sub-block, inside a dashed section canvas; the blueprint's lane canvas sat in a dashed frame inside another dashed frame. Each frame looked reasonable where it was added, which is why the rule has to be about counting rather than judgement: before adding a frame, count the frames already above the thing you are framing.

**The L2 ecosystem canvas.** Edge labels were placed at the horizontal midpoint of the column gap, and the gap was 64px while a label is around 110px wide — so with four edges converging, every label spilled across the node boxes on both sides. Column gap 64 → 176, row gap 26 → 34. The published density floor states the new numbers. The old ones were written when labels were 10.5px mono and were never re-derived when the type moved — the same class of error as round 37c.

**Why this kept happening.** Four of the five defects were already forbidden by rules this system had written down. The gap was not knowledge, it was that nothing in the build loop checks a page against the rules before shipping it — the pre-flight gate exists at Selection ss: 03 and had not been run on any page built since it was written, and was itself broken for seven rounds. Passes 1–3 are ship-blocking; they need to run.

### Round 38b — R35.2 actually applied, and the sweep hole that let mono through

**Two mono literals survived the 12px sweep** because the size sat in a *separate concatenation* from the family: `… + MONO + 'font-size:14px;…'`. The regex matched the family-then-size order and skipped this one. Three blueprint boundary-line chips and one taxonomy mark were left at 14px beside 99 siblings at 12px — and the boundary-line chip is the element Wynt3r's arrow pointed at. Fixed, and the scan now checks the 320 characters preceding every `font-size:14px` for a mono family or a mono style constant, not just the adjacent declaration.

**R35.2 was written and not applied.** Halving mono's size does not answer "we mix and match too much". On the journey map — the page named in the round-38 entry — mono still outnumbered Nunito 102 to 91 because only the size had changed. Re-scoped: the ten touchpoint chips, the five mood words and the three emotion axis ticks are Nunito (chips 14/600 in a pill, moods 14/600, ticks 14/400). Mono keeps this section's genuine label and unit class: the lane rail, the `ss: NN` markers, the phase and step ordinals, the tier chips and the Sankey volume figures. Nunito now leads 109 to 84.

**Rule stated for the next section built:** writing a scoping rule is not applying it. A rule that redistributes two typefaces has to be executed per section, because only a section knows which of its own strings are codes and which are words.

### Round 38c — two elements doing one job, and a contradiction they were hiding

**Twelve duplicate tier chips removed.** The Q02 badge sweep (round 25b) added a tier chip to specimens that already carried one, so twelve specimens across Diagrams II, III and IV ran two chips side by side stating the same fact. Wynt3r's complaint about overutilised components, in its plainest form.

**Three of the pairs did not agree.** Diagrams II's sequence, ERD and state-machine specimens were labelled `Tier 1` by the original chip and `T2` by the sweep. Checked against the published ceilings at Diagrams at Scale ss: 01 (T1 ≤7 nodes · T2 8–24 · T3 25–80): 5 lifelines, 5 entities and 6 states are all T1, so the sweep's badge was wrong and had been shipped for thirteen rounds. Corrected to T1. Topology at 9 nodes and layered at 6 layers were already right. **The duplication is what concealed the error — one chip contradicting another is only visible when you read both, and nothing was reading either.**

**Instruction sentences are Nunito.** Four control-row hints ("Click a phase to isolate its column" and its siblings) were mono caps. An instruction is the clearest case R35.2 covers; mono stays on the label beside it.

### Round 38d — the sweeps were matching literals, not generators

**Root cause, stated once.** Every density fix so far has been a search-and-replace over literal style strings. Anything produced by a differently-written code path — a row generator that composes its background separately, a title written as a `div` rather than after a corner bracket, a legend built from a type map — was invisible to the pattern and survived. That is why the same three complaints kept reappearing on pages reported as fixed. The fix is to edit the generator, not the string it happens to emit.

**Diagrams II, re-scoped at the generator.** This page's mono class is declared: field names, PK/FK chips, port numbers, message ordinals, node ids and layer numbers. Everything else is Nunito.

| Generator | Was | Now |
|---|---|---|
| ERD field row | `padding:3px 12px`, `i % 2 ? ';background:#fafafa'`, EROW 22 | `padding:8px 14px`, top hairline, EROW 36 · EW 190 → 214, EHEAD 34 → 40 (entity height derives from these, so the box and its SVG anchors follow) |
| Four specimen titles | mono 12/700 caps in a `div` | `<h3>` Nunito 700/15 sentence case |
| ERD and state legends | mono caps — Primary, Foreign, Initial, Terminal | Nunito 14/600 |
| Topology legend + zone chips | mono caps via the type map and `MONO` constant | Nunito 14/600 |
| Layer capability lists | mono 12/400 | Nunito 14/400 — these are prose lists, not identifiers |

**Deliberately not changed: button labels.** `← Prev`, `Next →`, `Show all`, `Reset` are mono on every page in the library, and R35.2 would make them Nunito. Changing them on one page would make that page inconsistent with thirty-nine others, so this is a system-wide call, not a page fix — recorded as open rather than half-applied.

### Round 38e — stripping the family is not converting the label

**R35.6.** Mono's family and mono's treatment are one thing. Deleting the `MONO` constant from a composed style leaves 12px, 700, caps and .08em tracking behind, which produces a Nunito string set as a mono label — a third typographic role the system does not have, breaking the 14px Nunito floor and the case-and-tracking definition of the two mono roles at the same time. **Converting a label to Nunito means replacing the whole treatment: 14px, 600, no letter-spacing, no text-transform.**

Fixed at the two sites where last round's edit stripped only the family: the topology zone chips (`Public edge`, `Application subnet`, `Data subnet`) and the ss: 05 cross-cutting column label, which had been left mono while the layer names beside it moved. `Layer 01`–`Layer 06` are numerals and stay mono.

**Where the page's mono now sits, checked rather than assumed.** 135 mono to 75 Nunito, and the remainder is accounted for: the declared code class (ports, field names, PK/FK/N chips, message ordinals, state ids, node type-and-id pairs, layer numbers, tier chips, `ss: NN`), around 22 nav and footer strings that locked rule 17 *requires* to be mono pills, and the five button labels deferred as a system-wide call. A raw mono-to-Nunito ratio is therefore not the test — R35.2 is about whether each string is a code or a word, and a page whose codes genuinely outnumber its prose will read mono-heavy and be correct.

### Round 38f — R35.5 enforced by scan, not by instance

Three rounds running, a pattern rule was applied only where it had been pointed out. R35.5 was written in round 38 and fixed at the two places that appeared in Wynt3r's screenshots; a third nested canvas survived on Diagrams II ss: 05 (two identical #fafafa / 1px dashed #d9d9d9 frames 27px apart) and two more on Diagrams IV and Diagrams at Scale.

**Enforced properly.** A depth-aware pass over every page now walks `div`/`section` open and close tags, tracks nesting, and flags any element carrying the canvas signature that sits inside another one. Three outer frames stripped; the scan re-runs to zero. The inner element is the one kept in each case, because it is the `role="img"` diagram canvas carrying the accessible label.

**The signature matters.** The filter is `background:#fafafa` **and** `1px dashed #d9d9d9` together. Dashed borders that are diagram *marks* must survive and do: the topology zone boundaries at 1.5px dashed #000, the external-system node type, and the blueprint's dashed boundary lines. A rule about frames must not catch strokes.

**Method note, which is the real output of this round.** A rule expressed as a pattern needs a check expressed as a pattern. Every time one of these was implemented as "fix the reported element", the next round found it again somewhere else — nesting (three rounds), mono size (two rounds), mono scope (three rounds), duplicate chips (one round). The pre-flight gate at Selection ss: 03 is where these belong as executable checks.

### Round 38g — the strip should have been a conversion

The nested-canvas scan removed `background`, `border` and `border-radius` from each redundant outer frame. On three of them that element was doing **two** jobs — the specimen card *and* the canvas frame — and only the frame job was redundant, so stripping properties left a wrapper with 26–28px of padding and no surface. On Diagrams II ss: 05 that made one section the only one of five peers with no container.

**Converted, not stripped.** All three outer wrappers now carry the S3 specimen card their sibling sections use: `background:#fff;border-radius:14px;padding:26–28px;box-shadow:0 14px 28px -6px rgba(0,0,0,.11)`. A white card is not a canvas, so R35.5 stays satisfied and the stack is card → dashed canvas → lifted tiles, which is what every other specimen on those pages already did.

**Rule for the next pattern sweep.** Removing a treatment is only safe when the element has one job. When a container is both a surface and a frame, the sweep has to name what the element becomes, not what it loses — and the check is peer comparison: if four sibling sections wrap their specimen the same way, the fifth is wrong, not novel.

### Round 38h — enumerate by ancestry, not by string

**The pattern that missed on six consecutive rounds, and why.** Every mono and zebra sweep matched a *string shape*: `font-size:14px` inside a style attribute that also contained the mono family, `(i % 2 ? ';background:#fafafa;border-radius:6px' : '')`, and so on. Two forms defeated it. Mono size is frequently declared on a **child that inherits the family from a grid parent** — `<div style="…;font-family:'JetBrains Mono',monospace">` with children carrying only `font-size` — and `#fafafa` is written with a leading semicolon, without a radius, or as a bare inline value on a template span. Both were visible in an early grep of Diagrams at Scale and deferred as "less common"; they accounted for the majority.

**Replaced with enumeration.** A depth-aware walk now resolves the *inherited* font family for every element and corrects any mono descendant whose size is not 12px, at whichever element declares it; and `background:#fafafa` is removed everywhere it is not accompanied by a dashed frame. **219 mono sizes and 51 stray fills across 14 pages** — none of which the six previous sweeps had reached. Re-scan leaves four cases, all resolved or deliberate:

- Two `Implementing` ss: 02 metric cells at 15px (the open debt carried since round 35) → 12px, IDENTIFIER role.
- One `Exemplar` display slab at 17px → kept, and the rule now bounds itself (below).
- One `Diagrams IV` edge label using `background:#fafafa` as a knockout so the connector does not run through the text → kept; that is a functional mask on a canvas, not a row fill.

**R34.2 bounded.** "Mono is one size, 12px" governs mono in its **meta** roles — labels and identifiers. The one black display slab per section (rule 7b) is content, not meta, and sets its equation at 17px as part of that component's spec. Stating the boundary is better than either forcing a display equation to label size or reopening the size-based role distinction R34.2 closed.

### Round 38i — padding raised by value, and the coverage table re-scoped

**Same failure, eighth round: a fixed list of literal pairs.** The round-38 padding raise mapped eight specific `padding:<v>px <h>px` strings. `9px 14px` was not among them, so the ss: 06 coverage table's 27 rows stayed at 9px — 5px tighter than their own header — while rule 10 said ≥14px.

**Replaced with a value parse, bounded structurally.** Two passes, neither matching a literal pair: cells that are direct children of a **per-row grid table** (identified as a `grid-template-columns` value repeated three or more times in the file, which is this system's table signature) and cells rendering a template hole. Any vertical padding under 14 is raised to 14, horizontal to at least 14. **279 + 5 cells across twelve pages.** Chips, pills and buttons are untouched because neither pass reaches them.

**The coverage table's mono class decided rather than left over.** The whole table inherited mono from its frame, including a Family column of prose names ("Process flow / process map", "Concept map") and a State column reading Built / Queued / Parked. Under R35.2 those are words: Family is Nunito 14/400, the State chip is a Nunito 14/600 pill, and mono keeps the `Where` column, which is a reference (`Diagrams ss: 02`). Mono on the frame is no longer doing the deciding.
