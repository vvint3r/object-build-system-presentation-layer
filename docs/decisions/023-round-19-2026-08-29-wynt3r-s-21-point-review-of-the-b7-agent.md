# Round 19 (2026-08-29) — Wynt3r's 21-point review of the B7 agent build → 11 corrections

- **Date:** 2026-08-29
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 406–484
- **Status:** historical record from the original library, copied verbatim. The rules in force are in `kit/report-kit/SPEC.md`.

---

Source: 21 annotated screenshots of the agent-restyled B7 document (`uploads/Screenshot 2026-08-28 *.png`, one 165149). Verbatim feedback captured in chat message m0008. Triage below maps every observation to a cause and a fix. Deliverable page: `content-morphia Corrections.dc.html` (5 sections, executive level per R18.12).

### Counts taken off the screenshots (defensible, not estimated)
- **Image 10** (Money Staircase card): 14 black fills (6 right-edge value chips + 8 inline arithmetic chips) + 2 yellow ILLUSTRATIVE chips + 6 mono step labels + 6 numbered circles + 5 dotted row dividers = **25 emphasis devices in one container**.
- **Image 1** (title block): 1 black UNIT chip + 4 outlined status chips + 1 teal CASE chip + 6 alias chips + 1 black IMPORTANT chip = **13 devices above the first sentence of content**.
- 21 observations → 11 causes → **6 amend locked rules, 5 fill gaps**.

### Observation → cause map
| # | Wynt3r's point | Cause |
|---|---|---|
| 1 | label count/logic overwhelming in title block | A1 semantic+chip budget |
| 2 | module headings too small; unclear when a box gets a black outline | A2 module-title tier; also R8 L1e/L2 reservation was never stated in usage terms |
| 3 | teal bullets overwhelming, text too small, mono sub-lines drown | A6 teal ration + A2 (mono sub-lines) |
| 4 | yellow label + black bars overwhelm the row label | A6 bar geometry |
| 5 | quote-mark + labels dropped into 3 columns at random | G1 containment + G2 prose-before-containers |
| 6 | cramped Q&A; black formula no padding; underline too tight; arrow AND underline | A4 formula ration, A5 link marker, G3 divider abuse |
| 7 | black-on-black label loud; unstyled scrollbar; eye has nowhere to rest | A1, G5 chrome spec |
| 8 | heading → 4 containers with no text; grey line; random blockquotes | G2 (his own proposal), G3, G1 |
| 9 | red/green labels blend with black text; outline inside outline | A1 tint/solid split |
| 10 | why containerise a numbered list; dotted lines between items; list headings smaller than body; black chips loud | G1, G3, A2, A4 |
| 11 | table → list → container → 3 containers → shadowed container → black banner, no prose between | G1 (nesting), G2, A4 |
| 12 | diagram text overflowing nodes, arrows overlapping, tiny heading, is the border needed | G4 fixed diagram layouts |
| 13 | link underline spacing; callout inside container inside divider sandwich; random blockquotes | A5, G3, G1 |
| 14 | two figures with no title, no description, no provenance, no transition | G5 figure spec |
| 15 | IMPORTANT → CAUTION → KEY POINT stacked, unaligned, no prose between | A1 budget, G2 |
| 16 | small container heading; black formula banner; purple bar unexplained; NOTE used as a heading; grey line | A2, A4, A1 (semantic-as-heading ban), G3 |
| 17 | black bars loud; stray 70%-width italic block outside its container; KEY POINT with no transition; diagram arrows a mess | A4, G1, G2, G4 |
| 18 | PART 2 OF 4 · PRACTITIONER rendered at 9.5px — a quarter-document transition invisible | A3 part-transition tier |
| 19 | black backgrounds + containers + callouts overwhelming in Reference Implementation | A4, A1 |
| 20 | table: label as column heading, six saturated semantic labels, unstyled scrollbar, whole rows bolded | A1 (incl. semantic-as-heading ban), G5 |
| 21 | sticky TOC occupies half the viewport and travels with the reader | G5 rail cap |

### A — six amendments to LOCKED rules (need Wynt3r's word, R-h precedent)
- **A1 (rule 7) — semantic fills get two intensities.** TINT default: hue at 16–30% on white, black text, NO border (ok rgba(0,230,118,.2) · warn rgba(255,214,0,.3) · crit rgba(255,82,82,.16) · info rgba(64,196,255,.22) · note rgba(179,136,255,.22)). SOLID (full fill + 1.5px black border) reserved for a verdict, ≤1 per view. A semantic label may NEVER serve as a heading (kills img 16's NOTE-as-heading and img 20's label-as-column-header). Title blocks ≤3 status chips; aliases past 4 collapse behind a disclosure. Note: the failure is not WCAG ratio — black on #ff5252 computes ~7:1 — it is 9.5px mono on a saturated field adjacent to black body text.
- **A2 (rules 1, 3) — module-title tier.** Nunito 700 / 15px / #000 / sentence case. Root cause: rule 1 bans grey and rule 3 puts all labels at 9.5px mono, leaving mono caps as the ONLY sub-heading device. Mono is now meta-only (units, IDs, timestamps, table headers, chip text). A mono label may never be a container's sole heading. A bullet's explanatory sub-line is body 13.5px, never mono.
- **A3 (rule 9) — part/pillar transition tier.** Full-width surface, part name 900/28px, pillar + section range in mono beneath, 96px clearance above. Outranks every section title within it.
- **A4 (rules 4, 8) — formula ration.** ONE black display slab per section, ≥24px padding, only the section's defining equation. All other math inline: mono on white, 1px #ebebeb hairline, radius 6. Raw arithmetic in a sentence takes NO chip — a chip means the token is named again elsewhere. This is the deepest sweep (judgement per section).
- **A5 (rule 2) — one marker per link.** Underline 1.5px, offset 3px (was 2px/1px). Arrow prefix restricted to standalone jump lists.
- **A6 (rule 2) — teal marker ration + bar balance.** Teal bullet only in a scannable list of ≤5 peers at body size; longer/nested take a 3px black square. Magnitude bars 6px (from 10px), row label at 700, no chip inside a bar row — provenance goes below the figure.

### G — five gaps where the system was silent (take effect next build unless objected)
- **G1 containment test.** Wrap only if: one of ≥2 compared peers · a skippable aside · an interactive surface. Sequential prose, numbered lists, single passages sit on the page. Never two container levels; a container may not be a container's first child.
- **G2 heading → prose → containers.** Wynt3r's proposal, adopted. ≥1 sentence naming the group before a container group **that directly follows a heading**. A heading is never followed immediately by cards. A group following prose or another container already has context and needs no lead. (Scope narrowed from "any container group" after the verifier found the Composition page violating its own rule three times — the original wording caught pairs of sibling rule cards nested inside prose, which was never the failure in img 8. The precise rule is about the heading adjacency, not about containers in general.)
- **G3 dividers separate siblings only.** Legal only between two sibling sections sharing one surface (rule 6's inset hairline). Never heading-to-own-body, never between list items, never directly above/below a container. It was being used as a substitute for spacing.
- **G4 diagrams use three fixed layouts.** Single-column ladder · two-column with one join · decision gate. Nodes size to text; arrows run on layout axes only. No absolute positioning. Material fitting none of the three becomes a table.
- **G5 figure + chrome spec.** Figures: module-tier title, one-line description above, provenance in mono below. Scrollbars: 8px, black thumb, #f1f1f1 track (legal — it IS a track under rule 4). Sticky rail: ≤260px wide, ≤60vh with internal scroll, collapses to top strip at 1150px per rule 12.

### Cost
Cheap (A1, A5, A6 + G5 chrome): one token pass, no layout change. Moderate (A2, A3): every container heading and part transition across 17 pages. Deep (A4): per-section judgement. Options put to Wynt3r: A ratify+sweep now (2 rounds) · **B ratify now, sweep opportunistically as roadmap rounds touch each page (recommended, ~0.5 round)** · C gaps only (free, leaves ~half the complaints).

### Standing note
Two of his questions are answered by existing rules that were never written in usage terms, which is itself the finding: "when does a box get a black outline" (img 2) is R8's L1e/L2 reservation, and "why is there a purple bar" (img 16) is rule 7's note semantic. The specs existed; nothing told an implementer when to reach for them. Same shape as the Q35 gap.

### Round 19 verifier catches (fixed same round)
- §05 recommended card had a 1.5px black border welded to soft S2 `0 4px 14px` — neither depth family. Now clean L1e (`6px 6px 0 rgba(0,0,0,.08)`). Worth noting: the page arguing against unsanctioned treatments shipped one, which is evidence for how easy R8's two families are to cross by accident. Candidate for a future amendment: name the illegal combinations explicitly, not just the legal ones.
- Header status chip and §04 tier labels were pre-applying the *unratified* A1 tint outside a specimen frame. Reverted to currently-locked rule 7 (chip: #ffd600 + 1px black border; tier labels: neutral white + 1px black border). Standing discipline: an unratified amendment may only appear inside a dashed specimen frame, never as live page chrome.
- Header second-row `padding-bottom:11` — off both ratified scales, inherited from the Implementing shell. Fixed here to 12; **the same 11 exists across the library's header shells and belongs in the A1/A5/A6 token sweep.**

- §01's three count cards were all S2 in one peer cluster — rule 5 allows one primary per cluster. Dropped to S1, matching §04/§05 and the library's peer-grid convention. **Third rule-5 crossing caught by the verifier in one page, all three by accident.** That is now a pattern, not a coincidence: rule 5 lists five legal shadow recipes and no illegal combinations, and says "one primary container per cluster" without saying what a cluster is. Recommend a seventh amendment, A7 — state rule 5 as a decision (peer grid → S1 · the one primary container in a section → S2 · hero/chart/code frame or sticky rail → S3 · hard families only on hover or reserved emphasis) and name the two illegal mixes outright: blurred shadow + border, and two S2 peers side by side.

### Round 19 correction — the deliverable was a memo, not a spec (Wynt3r, 2026-08-29)
`content-morphia Corrections.dc.html` was deleted and replaced by **`content-morphia Composition.dc.html`**, a design-system reference page. His objection: sections like "Why the agent cannot be blamed for most of it", "Six amendments to locked rules", the cost breakdown and the A/B/C options are all *conversation addressed to him*, not documentation an implementer reads. A design-system page carries rules, specs, limits and specimens — nothing else.

Now rule "Deliverable pages are the design system, not a report on it" in CLAUDE.md, with the test: would an agent building a new document need this block to build correctly? If no, it does not go in the page. Banned from pages: diagnosis, blame/defence, cost, ratification status, options for Wynt3r, round numbers, change history.

Note this is the second reporting correction in two rounds (R18.12 was "too long"; this is "wrong genre"). R18.12 was under-read: shortening a memo still leaves a memo. The corrected understanding is that the page is not a report at any length.

**Composition page contents** (all 11 corrections restated as implementable rules, plus A7): §01 Hierarchy — T1/T2/T3/T4/Meta tier table, mono-is-never-a-heading, part-transition tier · §02 Emphasis — tint/solid semantic split with values, six-row per-view limit table (solid label 1 · title chips 3 · L2 1 · black slab 1/section · teal marker ≤5 · successive callouts 1) · §03 Containment — three-condition wrap test, no nesting, heading→prose→containers, dividers separate siblings only, depth-by-position table naming the two illegal mixes (A7) · §04 Math and links — one slab per section, inline math is not a chip, one link marker · §05 Figures and chrome — three-part figure requirement, bar geometry, three fixed diagram layouts, scrollbar spec, rail caps.

Ratification of A1–A7 is still open and lives here, not on the page.

### Round 19, second verifier pass on Composition
- §05's diagram container carried S1 while its three children carried S1 — the exact nesting prohibition rendered in the page's own §03 depth table. Now `1px dashed #d9d9d9`. **Fourth accidental rule-5 crossing in two pages this round.** A7 is no longer a nice-to-have: four crossings by an implementer who had just written the rule down means the rule cannot be followed as stated. Recommend A7 be ratified first, before the sweep.
- The one black display slab — the specimen for §04's own rule — had a garbled subscript (U+208D read as "z1−α(2"). Now plain mono `z_(1−α/2)`. Standing note: a specimen that demonstrates a rationing rule is the only instance of that device on the page, so it gets proofread as content, not as decoration.
- G2 scope narrowed (see above).
