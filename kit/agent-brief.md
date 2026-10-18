# Content Morphia agent brief

Instructions for an agent in any environment (Claude, Codex or another) that produces a document,
report or reference page as an HTML artifact for the owner of content-morphia. **Content Morphia
Report Kit 1.1** is the design system for every such artifact.

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
| `SPEC.md` | The rules in force. Read in full before writing. | [SPEC.md](https://raw.githubusercontent.com/vvint3r/object-build-system-presentation-layer/bea8a453c89b02e468155ccc553a43dbf9d859de/kit/report-kit/SPEC.md) |
| `template.html` | The starting file for every document | [template.html](https://raw.githubusercontent.com/vvint3r/object-build-system-presentation-layer/bea8a453c89b02e468155ccc553a43dbf9d859de/kit/report-kit/template.html) |
| `cm-report.css` | Tokens and every component class; the only stylesheet | [cm-report.css](https://raw.githubusercontent.com/vvint3r/object-build-system-presentation-layer/bea8a453c89b02e468155ccc553a43dbf9d859de/kit/report-kit/cm-report.css) |
| `cm-report.js` | Theme toggle, chart theme and drawing, sortable tables, contents rail, print | [cm-report.js](https://raw.githubusercontent.com/vvint3r/object-build-system-presentation-layer/bea8a453c89b02e468155ccc553a43dbf9d859de/kit/report-kit/cm-report.js) |
| Sample report | A finished document built on the kit: the reference output | [Sample Report - Q3 Support Review.html](https://raw.githubusercontent.com/vvint3r/object-build-system-presentation-layer/bea8a453c89b02e468155ccc553a43dbf9d859de/kit/Sample%20Report%20-%20Q3%20Support%20Review.html) |
| Spec and gallery | Every component as a live example, with its markup | [Report Kit - Spec & Gallery.html](https://raw.githubusercontent.com/vvint3r/object-build-system-presentation-layer/bea8a453c89b02e468155ccc553a43dbf9d859de/kit/Report%20Kit%20-%20Spec%20%26%20Gallery.html) |

An agent with git can clone the whole kit instead:
`git clone https://github.com/vvint3r/object-build-system-presentation-layer`.

An agent that can reach none of these asks the owner for the files. The stylesheet, script and
template are never rebuilt from memory, from a description, or from another design system.

## Reading order

1. This brief.
2. `SPEC.md`, in full.
3. The sample report, for what a finished document looks like.
4. The gallery, for the markup of each component the document needs.
5. `template.html`, which becomes the document.

## Inputs from the owner

The masthead and top bar name a publisher (the wordmark, lowercase and hyphenated), a series, an
author or team, and an audience. When the request does not give them, the agent asks before building
rather than inventing them.

## Packaging

**Self-contained, the default.** One HTML file that opens anywhere, including hosted artifact
environments that refuse external stylesheets:

1. Start from `template.html`.
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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/vvint3r/object-build-system-presentation-layer@bea8a453c89b02e468155ccc553a43dbf9d859de/kit/report-kit/cm-report.css">
<script src="https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/vvint3r/object-build-system-presentation-layer@bea8a453c89b02e468155ccc553a43dbf9d859de/kit/report-kit/cm-report.js" defer></script>
```

Links to `raw.githubusercontent.com` do not work in a page: that host serves the files as plain
text, and browsers refuse them as a stylesheet or script.

Where the agent's own environment blocks Google Fonts or jsDelivr, the document still carries those
links unchanged; the reader's browser loads them. ECharts is never inlined, replaced or moved to
another version, and TLS verification is never disabled to reach a blocked host.

## Non-negotiable rules

A summary of section 1 of `SPEC.md`. The spec governs.

1. Documents start from `template.html` and compose only from classes in `cm-report.css`.
2. No added stylesheets, `<style>` blocks (other than the pasted kit stylesheet), custom classes or
   inline styles, except the custom properties the spec allows (`--h`, `--v`, `--t`, `--steps`).
3. No hex, rgb or named colours in markup. Chart JSON uses `$token` strings.
4. Text is black or white. No grey text and no lowered opacity; rank with weight.
5. Nunito for all text, labels, tables, chips and charts. JetBrains Mono only for code.
6. The accent is never text.
7. One `cm-featured` per document, at most one verdict chip per table or figure, one summary per
   document.
8. Colour never fills a label.
9. Meaning never rests on colour alone.
10. Radii only from the kit's set; the CSS applies them.
11. No decoration: no emoji, stock imagery, icons beyond the kit's glyphs, coloured left borders,
    drop caps, or gradients except the two the spec names.
12. No filler. Every number shown is sourced.

Charts are ECharts option JSON inside the kit's figure markup. The agent never calls `echarts.init`
and never writes chart JavaScript.

## Writing rules

Section 13 of `SPEC.md` applies, with four further rules from the owner:

- A document is neutral and third person, written for any reader. No "you", "your", "we" or "our"
  in the body; it is never a message to the owner.
- No chat-style labels such as "Done so far", "Your part" or "Next up". A person's action appears as
  a role-named item ("Owner approval of the shortlist") with what it does and what it unblocks.
- Numbers that will change never sit inside definitions of steps or rules. They go in one dated
  status block.
- No em dashes or en dashes in prose.

## Documents without measured numbers

The kit's anatomy is written for data reports. A document without measured numbers (a briefing, a
guide, interview preparation, a reference page) follows the same anatomy and order, with these
readings:

- **Type chip:** Brief or Guide.
- **Blocks without content:** a required block whose content does not exist for the document is left
  out, and an HTML comment at its place says why. This covers the KPI strip when the document reports
  no measured numbers; the masthead's Period field, and the period in the title, when it covers no
  period; and the Recommendations section with its featured card when there are no actions. Nothing
  is invented to fill a block.
- **Executive summary:** the lede and three to five key points in `.cm-summary`, each a full sentence
  that stands on its own.
- **Kept as written:** Methodology appears when numbers are computed; Notes and sources are always
  present.

Content maps onto existing components:

| Content | Component | Spec section |
| --- | --- | --- |
| Terms and their meanings | Definition block, `cm-def` | 8.5 |
| Questions a reader would ask, with answers | Questions block, `cm-qa` | 8.6 |
| Facts about one thing: a company, a role, a system | Property sheet, `cm-props` | 8.7 |
| Dated events in order | Timeline, `cm-timeline` | 8.12 |
| Stages in sequence | Process diagram, `cm-process` | 8.13 |
| Options compared on the same attributes | Table, with the recommended column marked | 8.11 |
| A point that must not be missed, a caveat, a worked example | Callout, from its closed set | 8.4 |
| Items or steps | Lists, `cm-list` and `cm-olist` | 8.14 |
| Verbatim words from a person or source | Pull quote, `cm-quote` | 8.9 |
| Numbers over time or across categories | Figure with a chart | 8.10, 9 |
| Code, queries, file contents | Code block, `cm-code` | 8.17 |

## Kit gaps

Maps, network and hierarchy diagrams, interactive filters, a PDF cover page and revision history. A
document that needs one uses a figure holding a `cm-slot` placeholder and names the gap in an HTML
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
the checks. The one exception is a document with blocks left out as described above: these failures
are expected there, each only for a block an HTML comment states as omitted.

| Check | Finding |
| --- | --- |
| `summary-anatomy` | No KPI strip |
| `masthead` | No Period field |
| `head-order` | A title without a period |
| `featured` | No featured card |
