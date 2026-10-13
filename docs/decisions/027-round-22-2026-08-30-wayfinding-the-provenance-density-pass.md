# Round 22 (2026-08-30) — wayfinding + the provenance-density pass

- **Date:** 2026-08-30
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 587–626
- **Status:** historical record, copied verbatim. Current rules are in `docs/spec/rules.md`.

---

Two deliverables, both in the Components group, both built to the R20 gate: `content-morphia Wayfinding.dc.html` and `content-morphia Provenance.dc.html`. Between them they close the seven missing capabilities in "navigate a deep index" and convert the six "provenance & freshness" partials from single-source decoration into aggregation grammar (R18.3).

### Wayfinding — five components, R22.1–R22.6

§01 search (field + scope select + result rows + empty state, live over a 15-node sample index) · §02 faceted browse (three facet groups, counts recomputed against the other groups only, zero-count values disabled not removed, removable active-filter pills, disclosure past six values) · §03 ranked entry (most read over a switchable 7/30/90-day window with 6px magnitude bars; recently updated with what-changed lines) · §04 change over time (five-version selector + diff block, three kinds as tints, first-aggregation state) · §05 the rules.

| Rule | Statement |
|---|---|
| R22.1 | Search returns nodes, not pages. Every result states type, path and aggregation state; a result without a source count is not a result. |
| R22.2 | A facet is a fact about a node, never a topic. Counts recompute against other groups but never a facet's own group; a zero-count value stays visible at .55 and disabled. |
| R22.3 | Active filters are restated above the results as removable pills. Rail state alone does not count — the rail collapses at 1150px. |
| R22.4 | Rank is a mono ordinal in its own column, never a badge. A ranked list names its window; recency is an absolute date, never a NEW flag. |
| R22.5 | A diff names what changed, not how it looked. Three kinds only — added, removed, revised — each a tint with its mono label, anchored to a section reference. |
| R22.6 | Version is a control, not a chip. The selector names the current version with its date and what it compares against, and keeps superseded versions reachable. |

### Provenance — four components, R22.7–R22.12

§01 aggregation header (four facts in fixed order; staleness derived, demonstrated across fresh/due/stale) · §02 agreement and spread (three-segment agreement bar over 214 sources, IQR strip over the 96 that quantify, minority position with its shared cause) · §03 the confidence qualifier (three levels, three thresholds each, all must hold) · §04 citation at density (markers state their count and open a panel characterising the source set by class) · §05 the rules.

| Rule | Statement |
|---|---|
| R22.7 | Four facts open every context node — source count, last aggregated, cadence, next due — above the first sentence. Staleness is derived, never stated alone. |
| R22.8 | The source count is exact. Never a range, never rounded, never "hundreds of"; discards are reported in the panel, not netted off. |
| R22.9 | Agreement and spread are both stated and neither substitutes for the other. No-position sources are counted and shown. Agreement segments are label-free data marks, so solid semantic fills are legal under the rule-7 exemption. |
| R22.10 | A dissenting minority is reported with its explanation where the dissent clusters on a shared cause. |
| R22.11 | Confidence is derived, not asserted, and attaches to a claim rather than a page. All three thresholds must hold; failing one drops a level. |
| R22.12 | A citation marker states its count and opens a panel characterising the set. The panel is the resource centre — there is no separate library page. Attribution names the accountable role, never an author. |

### Rulings folded in without a new rule number
- **Release notes** resolve as the diff block plus the version selector (R22.5/R22.6); there is no separate release-notes component.
- **Library / resource centre** resolves as the source panel (R22.12). A standalone list of everything the index has read would be a second, worse index.
- **Person attribution** resolves as role attribution (R22.12), with named individuals appearing only inside the panel where a source is a person.

### Nav
Components group is now four pages — Structured · Wayfinding · Provenance · Charts — and all four carry the `ALSO IN COMPONENTS` strip listing the others.

---
