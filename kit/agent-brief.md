# Content Morphia agent brief

Instructions for an agent in any environment (Claude, Codex or another) that produces a document,
report or reference page as an HTML artifact for the owner of content-morphia. **Content Morphia
Report Kit 1.2** is the design system for every such artifact.

This brief lives at
<https://github.com/vvint3r/object-build-system-presentation-layer/blob/main/kit/agent-brief.md>.
An agent that cannot fetch links receives its contents pasted into the prompt, with the kit files
attached.

## Precedence

The kit replaces every other design system the agent would otherwise apply: its own defaults, a
house style, an aesthetic or front-end design skill, a host's page-design guidance, Tailwind, a
component library, or the look of an earlier project. Where the kit and taste disagree, the kit wins.

The kit's specification governs everything this brief does not settle. This brief adds what an agent
outside the kit's repository needs: where the files are, how to package the output, how to check it,
and how documents other than data reports use the kit.

## Kit files

All links point at one commit of the kit, so every document built from this brief uses the same kit.

| File | Role | Link |
| --- | --- | --- |
| `SPEC.md` | The rules in force. Read in full before writing. | [SPEC.md](https://raw.githubusercontent.com/vvint3r/object-build-system-presentation-layer/6f3ecb4a496b123b826c9b18d0f879b25c71af8f/kit/report-kit/SPEC.md) |
| `template.html` | The starting file for every report | [template.html](https://raw.githubusercontent.com/vvint3r/object-build-system-presentation-layer/6f3ecb4a496b123b826c9b18d0f879b25c71af8f/kit/report-kit/template.html) |
| `template-guide.html` | The starting file for every guide | [template-guide.html](https://raw.githubusercontent.com/vvint3r/object-build-system-presentation-layer/6f3ecb4a496b123b826c9b18d0f879b25c71af8f/kit/report-kit/template-guide.html) |
| `template-reference.html` | The starting file for every reference | [template-reference.html](https://raw.githubusercontent.com/vvint3r/object-build-system-presentation-layer/6f3ecb4a496b123b826c9b18d0f879b25c71af8f/kit/report-kit/template-reference.html) |
| `cm-report.css` | Tokens and every component class; the only stylesheet | [cm-report.css](https://raw.githubusercontent.com/vvint3r/object-build-system-presentation-layer/6f3ecb4a496b123b826c9b18d0f879b25c71af8f/kit/report-kit/cm-report.css) |
| `cm-report.js` | Theme toggle, chart theme and drawing, diagram drawing and text versions, sortable tables, contents rail, print | [cm-report.js](https://raw.githubusercontent.com/vvint3r/object-build-system-presentation-layer/6f3ecb4a496b123b826c9b18d0f879b25c71af8f/kit/report-kit/cm-report.js) |
| Sample report | A finished report built on the kit: the reference output for reports | [Sample Report - Q3 Support Review.html](https://raw.githubusercontent.com/vvint3r/object-build-system-presentation-layer/6f3ecb4a496b123b826c9b18d0f879b25c71af8f/kit/Sample%20Report%20-%20Q3%20Support%20Review.html) |
| Sample guide | A finished guide: the reference output for guides | [Guide - Billing Escalation.html](https://raw.githubusercontent.com/vvint3r/object-build-system-presentation-layer/6f3ecb4a496b123b826c9b18d0f879b25c71af8f/kit/Guide%20-%20Billing%20Escalation.html) |
| Sample reference | A finished reference: the reference output for references | [Reference - First Response Time.html](https://raw.githubusercontent.com/vvint3r/object-build-system-presentation-layer/6f3ecb4a496b123b826c9b18d0f879b25c71af8f/kit/Reference%20-%20First%20Response%20Time.html) |
| Spec and gallery | Every component as a live example, with its markup | [Report Kit - Spec & Gallery.html](https://raw.githubusercontent.com/vvint3r/object-build-system-presentation-layer/6f3ecb4a496b123b826c9b18d0f879b25c71af8f/kit/Report%20Kit%20-%20Spec%20%26%20Gallery.html) |

An agent with git can clone the whole kit instead:
`git clone https://github.com/vvint3r/object-build-system-presentation-layer`.

An agent that can reach none of these asks the owner for the files. The stylesheet, script and
template are never rebuilt from memory, from a description, or from another design system.

## Reading order

1. This brief.
2. `SPEC.md`, in full.
3. The sample of the document's kind (report, guide or reference), for what a finished document
   looks like.
4. The gallery, for the markup of each component the document needs.
5. The template for the kind, which becomes the document.

## Inputs from the owner

The masthead and top bar name a publisher (the wordmark, lowercase and hyphenated), a series, an
author or team, and an audience. When the request does not give them, the agent asks before building
rather than inventing them. The top bar carries a print button only when the request asks for one.

## Packaging

**Self-contained, the default.** One HTML file that opens anywhere, including hosted artifact
environments that refuse external stylesheets:

1. Start from the template for the document's kind.
2. Replace `<link rel="stylesheet" href="cm-report.css">` with a `<style>` element holding the full
   contents of `cm-report.css`.
3. Delete `<script src="cm-report.js" defer></script>` from the head, and place a `<script>` element
   holding the full contents of `cm-report.js` as the last element in `<body>`.
4. Keep the Google Fonts links and the ECharts 5.5.1 script from jsDelivr exactly as the template has
   them.

The pasted kit code is never edited, shortened or reformatted.

**Linked**, for a page served from a site that allows external stylesheets. The kit's two links point
at jsDelivr, pinned to the same commit:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/vvint3r/object-build-system-presentation-layer@6f3ecb4a496b123b826c9b18d0f879b25c71af8f/kit/report-kit/cm-report.css">
<script src="https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/vvint3r/object-build-system-presentation-layer@6f3ecb4a496b123b826c9b18d0f879b25c71af8f/kit/report-kit/cm-report.js" defer></script>
```

Links to `raw.githubusercontent.com` do not work in a page: that host serves the files as plain
text, and browsers refuse them as a stylesheet or script.

Where the agent's own environment blocks Google Fonts or jsDelivr, the document still carries those
links unchanged; the reader's browser loads them. ECharts is never inlined, replaced or moved to
another version, and TLS verification is never disabled to reach a blocked host.

## Non-negotiable rules

A summary of section 1 of `SPEC.md`. The spec governs.

1. Documents start from the template for their kind (`template.html`, `template-guide.html` or
   `template-reference.html`) and compose only from classes in `cm-report.css`.
2. No added stylesheets, `<style>` blocks (other than the pasted kit stylesheet), custom classes or
   inline styles, except the custom properties the spec allows (`--h`, `--v`, `--t`, `--steps`).
3. No hex, rgb or named colours in markup. Chart JSON uses `$token` strings.
4. Text is black or white. No grey text and no lowered opacity; rank with weight.
5. Nunito for all text, labels, tables, chips and charts. JetBrains Mono only for code.
6. The accent is never text.
7. One `cm-featured` and one summary per report (no featured card when a report with no actions
   leaves Recommendations out); none of either in a guide or a reference. At most one verdict chip
   per table or figure.
8. Colour never fills a label.
9. Meaning never rests on colour alone.
10. Radii only from the kit's set; the CSS applies them.
11. No decoration: no emoji, stock imagery, icons beyond the kit's glyphs, coloured left borders,
    drop caps, or gradients except the two the spec names.
12. No filler. Every number shown is sourced.

Charts are ECharts option JSON inside the kit's figure markup. The agent never calls `echarts.init`
and never writes chart JavaScript. Diagrams are JSON too (section 8.20 of `SPEC.md`). A flow
diagram, journey map or system and data flow places nodes by column and row, with edges between
them. A layer stack lists layers from the top down, each dependency running down. A hierarchy names
each node's parent. The kit draws them; the agent writes no coordinates, SVG or styles.

## Writing rules

Section 13 of `SPEC.md` holds every writing rule; the spec governs. Prose is the running text of
`<main>`: paragraphs, list items, definitions, questions and answers, callout bodies, captions and
process-step bodies. Code, tables, and chart and diagram data are not prose.

| Item | Limit |
| --- | --- |
| Paragraph | 3 sentences and 60 words at most |
| Sentence | 25 words as the target and 30 at most; 18 words or fewer on average |
| List item | 2 sentences and 40 words at most |
| Prose between headings | 150 words at most |
| Section lede | 45 words at most, with its key phrase in bold |
| Caption | 30 words at most |

Components keep their own limits as well, such as a figure title of 10 words. A TL;DR stands in for
the section lede, under its own limit of 40 words and with no bold phrase.

- A document is neutral and third person, written for any reader. No "you", "your", "we" or "our"
  in the body; it is never a message to the owner.
- No chat-style labels such as "Done so far", "Your part" or "Next up". A person's action appears as
  a role-named item ("Owner approval of the shortlist") with what it does and what it unblocks.
- Numbers that will change never sit inside definitions of steps or rules. They go in one dated
  status block, `cm-status` (section 8.22 of `SPEC.md`).
- No em dashes or en dashes in prose.
- Plain, factual sentences with the number, the comparison and the period; plain words. Each section
  leads with its finding. No signposting, hype, rhetorical questions or history of how the document
  was made.
- Bold marks the phrase that carries a sentence, one or two per paragraph, never a whole sentence.
  The claim of a key finding or a recommended action is a line of its own, not bold running text.
- No bold label runs into the text that follows it, and no bold phrase opens a paragraph, list item
  or callout body. A label takes its own line, a heading, a table row or a definition-list term. A
  caption's source and note lines are lines of their own, not bold.
- A heading is the plainest noun phrase that names what sits under it, in sentence case: no
  articles, questions, framing words or arguing adjectives, and no verbs unless the section is a
  procedure. Headings never skip a level.

## Document kinds

The kit builds three kinds of document, each with its own required parts (section 7 of `SPEC.md`).
A `cm-kind` tag in the head, straight after `cm-kit`, names the kind; a page without it is a report.

```html
<meta name="cm-kit" content="1.2">
<meta name="cm-kind" content="guide">
```

| Kind | Use for | Type chip | Required parts, in order |
| --- | --- | --- | --- |
| Report | What the numbers show and what to do: a review, an analysis, a briefing | Analysis, Report or Brief | Executive summary; body parts; Recommendations (recommended); Methodology (when numbers are computed); Notes & sources |
| Guide | One task carried out step by step: a procedure, a runbook, a how-to | Guide | Purpose; Prerequisites; Steps; Exceptions and recovery; Related documents; Notes & sources |
| Reference | One thing looked up: a metric, a dataset, a system, a term | Reference | Definition; Properties; Relationships; Examples; Notes & sources |

- Every kind has the top bar, contents rail, masthead, Notes & sources and footer.
- Guides and references carry no executive summary, KPI strip, summary card, recommendations
  card or Period. Each required part is a section with a fixed id: `purpose`, `prerequisites`,
  `steps`, `exceptions`, `related`; `definition`, `properties`, `relationships`, `examples`. Sections
  of the document's own may sit between them.
- A guide's steps go in a procedure (`cm-procedure`): 3 to 9 steps, each with an imperative title,
  what to do, and its outcome.
- A guide's related documents and a reference's relationships go in a related list (`cm-related`): a tag, a link and one
  sentence per item.
- A briefing without measured numbers is a report with the type chip Brief. Its executive summary
  holds the lede and three to five key points, each a full sentence that stands on its own.

A required block a document has no content for is left out, with an omission comment where it would
be. Nothing is invented to fill a block. The comment starts `cm-omit`, names the block, and gives the
reason after a colon:

```html
<!-- cm-omit kpi-strip: The briefing reports no measured numbers. -->
```

These blocks, and no others, are left out this way (section 7.5 of `SPEC.md`):

| Block | Kind | Left out when | Name | Where the comment sits |
| --- | --- | --- | --- | --- |
| KPI strip | Report | The document reports no measured numbers | `kpi-strip` | In the executive summary section |
| Masthead Period field | Report | The document covers no period | `period` | In `dl.cm-mast__meta` |
| Period in the title | Report | The document covers no period | `title-period` | In `<head>`, after `<title>` |
| Recommendations section, with its featured card | Report | The document has no actions | `recommendations` | In `<main>`, after the body sections |
| Prerequisites section | Guide | Nothing needs to be in place before the first step | `prerequisites` | In `<main>`, where the section would be |
| Exceptions and recovery section | Guide | No case departs from the steps | `exceptions` | In `<main>`, where the section would be |
| Related documents section | Guide | No other document bears on the task | `related` | In `<main>`, where the section would be |
| Relationships section | Reference | The thing connects to nothing else that is documented | `relationships` | In `<main>`, where the section would be |
| Examples section | Reference | The thing has no case to work through | `examples` | In `<main>`, where the section would be |

Content maps onto existing components:

| Content | Component | Spec section |
| --- | --- | --- |
| Terms and their meanings | Definition block, `cm-def` | 8.5 |
| Questions a reader would ask, with answers | Questions block, `cm-qa` | 8.6 |
| Facts about one thing: a company, a role, a system | Property sheet, `cm-props` | 8.7 |
| Dated events in order | Timeline, `cm-timeline` | 8.12 |
| Stages in sequence, seen at a glance | Process diagram, `cm-process` | 8.13 |
| A process with branches, loops or hand-offs between roles | Figure with a flow diagram, `cm-diagram` | 8.20 |
| One person's steps across the phases of an experience, and how each feels | Figure with a journey map, `cm-diagram` | 8.20 |
| Systems, where their data rests and what moves between them | Figure with a system and data flow, `cm-diagram` | 8.20 |
| The layers of a system and what each part depends on | Figure with a layer stack, `cm-diagram` | 8.20 |
| A whole and the parts it divides into | Figure with a hierarchy, `cm-diagram` | 8.20 |
| Steps a reader carries out, each with its outcome | Procedure, `cm-procedure` | 8.23 |
| Other documents, or places in them, and how each relates | Related list, `cm-related` | 8.24 |
| Work passed between roles, stage by stage, with who acts and what hands it on | Workflow, `cm-workflow` | 8.25 |
| The parts that together cover a subject, and what each covers | Framework, `cm-framework` | 8.26 |
| A claim about how parts relate, with when it holds and when it breaks | Model, `cm-model` | 8.27 |
| A repeatable technique that ends in a decision | Method, `cm-method` | 8.28 |
| A rule, why it exists and how a reviewer checks it | Requirement, `cm-req` | 8.29 |
| One subject scored against weighted criteria, ending in a verdict | Evaluation, `cm-eval` | 8.29 |
| What one measure counts: formula, unit, direction, thresholds, owner | Metric detail, `cm-metric` | 8.30 |
| Options compared on the same attributes | Table, with the recommended column marked | 8.11 |
| A point that must not be missed, a caveat, a worked example | Callout, from its closed set | 8.4 |
| Items | Lists, `cm-list` and `cm-olist` | 8.14 |
| Verbatim words from a person or source | Pull quote, `cm-quote` | 8.9 |
| Numbers over time or across categories | Figure with a chart | 8.10, 9 |
| Code, queries, file contents | Code block, `cm-code` | 8.17 |
| The sources a claim rests on | Citation and source register, `cm-cite` and `cm-sources` | 8.21 |
| Two sources giving different values for one quantity | Disagreement block, `cm-disagree` | 8.21 |
| Numbers that will change | Status block, `cm-status` | 8.22 |
| Changes since an earlier version | Change log and revision history, `cm-changes` and `cm-versions` | 8.22 |
| Three or more limits of the document | Limitation register, `cm-limits` | 8.22 |

## Kit gaps

Maps, sequence, state, entity relationship and network diagrams, interactive filters and a PDF
cover page. A document that
needs one uses a figure holding a `cm-slot` placeholder and names the gap in an HTML
comment. The agent does not draw its own diagram, icon or layout to fill the gap.

## Checks

**Before handing over:** the pre-publish checklist in section 14 of `SPEC.md`, and the document
opened in light, dark and print preview with no console errors.

**Automated, for an agent with git and Node.js.** The kit's checks run on any HTML file, in either
packaging:

```
git clone https://github.com/vvint3r/object-build-system-presentation-layer
cd object-build-system-presentation-layer
npm install
npx playwright install chromium
npm run check -- /absolute/path/to/document.html
```

The run prints one line per check and mode (`ok`, `FAIL` with the element and computed value,
`warn`, `skip`) and exits 1 on any failure. Failures are fixed in the document, never in the kit or
the checks. A block left out with its omission comment passes; a required block missing without one
fails.
