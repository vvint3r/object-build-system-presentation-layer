# Report Kit 1.1 adopted as the baseline

- **Date:** 2026-10-13
- **Source:** the owner, in the working session that set up this repository
- **Status:** in force

---

## Decision

Content Morphia Report Kit 1.1 is the baseline of the system. It is the most recent work and carries
the latest required changes. The original 35-page content-morphia library becomes the reference: an
extended set of components, page types and diagram families that are adopted into the kit over time.

## Consequences

- **The rules in force** are `kit/report-kit/SPEC.md`. The library's rules move to
  `docs/reference/library-rules.md` and apply only when adopting a library feature.
- **Where the kit and the library disagree, the kit wins.** The kit's changes from the library include:
  - JetBrains Mono for code only; labels, tables, chips and numbers in Nunito.
  - Chips outlined, with status colour in a 2px offset; no colour fill behind a label.
  - Section headers with a "Part 01 /" kicker and a 4px closing rule; rules under H3 and H4.
  - A larger spacing scale, a 24px floor between blocks, and 128px between sections.
  - Dark mode, print rules and an ECharts chart method.
  The full list is section 15 of `SPEC.md`.
- **The library's open items stop blocking work.** They move to `docs/reference/library-open-items.md`
  and are resolved only when the feature they touch is adopted.
- **The kit's code is the runtime.** Tokens are CSS custom properties, and pages compose from kit
  classes with no inline styles. This replaces the migration step that would have made the library's
  token files the runtime.
- **The Claude Design project where the kit was built**, "Objective (Artifact) Development System", is
  no longer where the kit is edited. The kit is edited in this repository. Changes made in that project
  after 13 Oct 2026 must be re-imported, or they are lost at the next sync.

## Snapshot

The kit was imported byte-exact from that project into `import/report-kit-1.1/` (13 files), and copied
to `kit/` as the working source. One upload, `uploads/cm_source-1791807965825-t8sk.html`, was cut off at
the import tool's 256 KB limit. It is a bundled copy of a library page; the complete library is in
`import/nodetrak-presentation-layer/`.
