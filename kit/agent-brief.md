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

For diagrams, **Diagram structure and styling** in this brief takes precedence over conflicting
restrictions in a pinned specification, template, gallery example or legacy check. This includes
closed component lists, custom-layout prohibitions, glyph-only rules and fixed geometry. Other
document and chart rules remain in force. The pinned kit version does not change with this policy.

## Kit files

All links point at one commit of the kit, so every document built from this brief uses the same kit.

| File | Role | Link |
| --- | --- | --- |
| `SPEC.md` | The rules in force. Read in full before writing. | [SPEC.md](https://raw.githubusercontent.com/vvint3r/object-build-system-presentation-layer/bea8a453c89b02e468155ccc553a43dbf9d859de/kit/report-kit/SPEC.md) |
| `template.html` | The starting file for every document | [template.html](https://raw.githubusercontent.com/vvint3r/object-build-system-presentation-layer/bea8a453c89b02e468155ccc553a43dbf9d859de/kit/report-kit/template.html) |
| `cm-report.css` | Base tokens and standard component styling | [cm-report.css](https://raw.githubusercontent.com/vvint3r/object-build-system-presentation-layer/bea8a453c89b02e468155ccc553a43dbf9d859de/kit/report-kit/cm-report.css) |
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

A summary of section 1 of `SPEC.md`, with the diagram scope defined in this brief.

1. Documents start from `template.html` and compose from classes in `cm-report.css`, with scoped
   diagram authoring as defined below.
2. No added stylesheets, `<style>` blocks (other than the pasted kit stylesheet), custom classes or
   inline styles, except the custom properties the spec allows (`--h`, `--v`, `--t`, `--steps`) and
   the scoped diagram styles defined below.
3. No hex, rgb or named colours in markup. Chart JSON uses `$token` strings.
4. Text is black or white. No grey text and no lowered opacity; rank with weight.
5. Nunito for all text, labels, tables, chips and charts. JetBrains Mono only for code.
6. The accent is never text.
7. One `cm-featured` per document, at most one verdict chip per table or figure, one summary per
   document.
8. Colour never fills a label.
9. Meaning never rests on colour alone.
10. UI radii come from the kit's set. Semantic diagram shapes follow the rule below.
11. No decoration: no emoji, stock imagery, coloured left borders, drop caps or gradients beyond
    the spec. Meaningful diagram symbols follow the rule below; other icons remain kit glyphs.
12. No filler. Every number shown is sourced.

Charts are ECharts option JSON inside the kit's figure markup. The agent never calls `echarts.init`
and never writes chart JavaScript.

## Diagram structure and styling

The kit governs a diagram's **visual styling**, not its type, layout or number of parts. Examples
in the gallery and templates are reusable examples, not an exhaustive catalogue or a required
arrangement. A different diagram type or layout does not require a separate exception.

Choose the representation from the relationship the reader needs to understand. Hierarchies show
containment; relationship maps show associations; boundary diagrams show responsibility and location;
sequences show exchanges over time; decision flows show alternatives and stopping conditions. These
are examples, not an allowed list. Do not force unrelated subjects into a process strip or hub-and-spoke
layout. Do not omit a necessary branch or relation to meet a component's size limit.

Keep the surrounding document in the kit. Place the diagram inside its figure component, with a
descriptive subject title, a short explanation, a source caption and a text equivalent. The diagram
may use the kit's renderer when it fits, or authored SVG or semantic HTML when another structure is
clearer. Renderer-specific schemas, capacities, step counts and placement rules apply only when that
renderer or component is used. They do not limit what a document may explain.

Within the figure, scoped layout CSS, coordinates, paths and responsive arrangements are permitted.
They must not restyle the page or kit components outside the diagram. Keep the pinned stylesheet and
script unchanged. Use their color tokens, Nunito, supported weights, spacing scale and emphasis
rules. Text remains ink-colored, black in light mode and white in dark mode, at full opacity. Do not
invent a separate palette or use status color as decoration. Quantitative charts retain the kit's
ECharts method; this section does not authorize a replacement chart system.

Semantic shapes may use the geometry their meaning requires, including decisions, documents,
boundaries and data stores. UI boxes retain the kit's radii. Use one consistent symbol family for
objects or actions when symbols improve identification. Symbols inherit the ink color. Icons must have
a purpose, readable labels or accessible names, and the same visual weight; they are not decorative
additions to every box.

Every connection has a defined meaning. Label direction, conditions and transfers where they are not
obvious. Distinguish a logical association from a physical move, and a proposed capability from a
verified one. Pair status colors with words or shapes. Name reading direction when it matters.

Reflow or split dense diagrams without losing their relationships, branch conditions or end states.
Keep labels readable at narrow widths, without page-wide overflow, clipped text or lines crossing
labels. Provide a text equivalent that states the relationships and outcomes, not just node counts.
Check the actual diagram in the document at desktop and phone widths and in supported themes.
When an owner instruction prevents visual inspection, report that limitation separately; source
checks do not establish visual acceptance.

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

The following component examples are non-exhaustive. Diagram choice follows the subject:

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

Interactive filters, a PDF cover page and revision history remain outside the supplied components.
A missing component does not prohibit a diagram type or layout. Maps, network and hierarchy diagrams
follow **Diagram structure and styling** above. Use `cm-slot` only when the content needed to produce
a figure is unavailable, and name what is missing.

## Checks

**Diagram checks.** Check meaning and presentation separately. Confirm source accuracy, relationship
direction, branch coverage, status evidence, labels and the text equivalent. Then inspect readability,
spacing, connector routing and responsive behavior. Successful rendering alone is not acceptance.

Older automated checks can reject scoped diagram markup because they enforce a closed class set,
renderer schema or capacity. Those restrictions are superseded only for the diagram region described
above. Record the exact check, region and reason, and verify the replacement requirement directly.
Do not disable unrelated checks, change a result to passing, or claim that legacy checks cover a custom
diagram they do not inspect. A placeholder is for missing source content, not for a missing template.

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
