# Imports

The three Claude Design exports this repository started from, exactly as received. **Read-only.**
Nothing here is edited; anything that moves into the system is rebuilt elsewhere in the repository.

| Folder | Export | What it is |
| --- | --- | --- |
| `nodetrak-presentation-layer/` | `NodeTrak (Presentation Layer).zip` | content-morphia, the main design system: 35 documentation pages, 12 shared components, token files, rulebook, spec history, lint and sweep scripts, the original brief, the content taxonomy checklist, reference material |
| `kx-visualizations-index/` | `KX (Design UIX) Obsidian Medium Visualizations Index.zip` | The visualization kit offshoot: diagram node kit, connectors and terminators, seventeen charts, a handoff page, and the lane-flow routing brief with its working data |
| `report-kit-1.1/` | Claude Design project "Objective (Artifact) Development System" | Content Morphia Report Kit 1.1, **the baseline**: spec, stylesheet, script, template, gallery page, sample report and uploads. The working copy is `kit/` |

The first two were exported from Claude Design as zip files on 28 Sep 2026. The report kit was read
file by file from its Claude Design project on 13 Oct 2026; every file is byte-exact except one upload,
noted below.

## Where to look first

**content-morphia**
- `CLAUDE.md`: the locked rules as of round 40d. Superseded in part; see `docs/reference/library-rules.md`.
- `CONTINUATION.md`: session log and plans. The only record of rounds 40e and 40f.
- `content-morphia-SPEC.md`: the full history, now split into `docs/decisions/`.
- `cm-*.dc.html`: the twelve shared components. The most accurate record of current values.
- `_rebuild/component-census.md`, `_rebuild/reconciliation.md`: the census of hand-authored parts and
  off-token values.
- `lint.js`, `sweep.js`, `dc-inherit.js`: the rule checker and sweeper, written for the Claude Design
  script runtime.
- `uploads/Claude-Design-Instructions.md`: the original implementation brief.
- `uploads/contenttaxonomychecklist.md`: the 907-item taxonomy checklist, used as a test corpus.

**Visualization kit**
- `scraps/4c-brief.md`: the lane-flow connector and label problem, with geometry, rules and the
  invariants to assert.
- `scraps/4c-*.json`: the router's plan, routes, splines and measurements.
- `Obsidian Diagrams.dc.html`, `Obsidian Charts.dc.html`, `Obsidian Handoff.dc.html`: the kit pages.
  The kit's dark palette is incidental; it takes content-morphia's styling when adopted.

**Report kit**
- `report-kit/SPEC.md`: the agent specification. The working copy at `kit/report-kit/SPEC.md` is the
  rules in force.
- `Report Kit - Spec & Gallery.html`: every component live, with copy-paste markup.
- `Sample Report - Q3 Support Review.html`: a complete report built on the kit.

## Notes

- `.dc.html` files are Claude Design canvas documents. They load `support.js`, a generated runtime.
- `uploads/Design-Systems-Collection/` holds third-party design-system descriptions and previews
  collected as reference. They are third-party material, not part of the system.
- One reference preview contains base64 font data that a secret scanner may flag as an AWS key
  pattern. It is not a credential.
- `report-kit-1.1/uploads/cm_source-1791807965825-t8sk.html` is incomplete: it was cut off at the import
  tool's 256 KB limit. It is a bundled copy of a library page; the complete library is in
  `nodetrak-presentation-layer/`. A zip export of the Claude Design project would recover it.
