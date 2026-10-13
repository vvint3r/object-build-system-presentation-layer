# 4c — lane-flow connector and label system

## What this is

`Obsidian Diagrams.dc.html`, panel `id="4c"` — the last and hardest panel of a dark
design-system documentation page. It is a **process diagram: 24 steps, 5 owner lanes,
one continuous day axis** ("Enterprise onboarding, first sixty days"). Inline SVG,
`width="1152" height="740" viewBox="0 0 1152 740"`.

Reference images for the intended curve style live in the project root and are shown on
`Canvas.dc.html`:
`pasted-1788395522187-0-mtksioj7-fb2r.png`, `pasted-1788395544271-0-mtksj5kv-j2b2.png`.
Take the **line behaviour** from them, not the visual style.

Two coupled systems are in play, and they compete for the same space:

1. **Label placement** — every step bar carries a text caption.
2. **Handoff connectors** — 16 curves joining consecutive steps across lanes.

Every change to one breaks the other. That coupling is the whole problem.

## The goal

- **All 16 handoffs drawn.** Currently 14. The flow must read as continuous.
- **Curves that read as free-form and fluid**, per the reference: a long single sweep,
  large or small as the travel needs, never a cornered or plumbed route, never leaving a
  bar from a "random corner".
- **Every label unambiguously attached to its own bar**, with the preferred side chosen
  by where the row actually has room — not a fixed side.
- **Nothing touches anything.** No curve crosses a bar, label or leader; no leader
  touches label ink; no two arrowheads land on the same point.

## Geometry (authoritative — measure, don't recall)

Lane name column occupies the left edge: **x < 112 is forbidden** to all content.
Right bound **x = 1128**. Bars are all **22px tall**.

Row Y positions: `106, 162, 218, 274, 330, 442, 498, 554, 610`
Pitch 56 throughout, except a **112px lane break** between 330 and 442.
Gutter between rows = 34px. Waypoint corridors are gutter midlines: `(rowY + 22 + nextRowY) / 2`.

24 bars as `[x, y, width]`:

```
[140,330,16] [156,106,80] [236,330,80] [316,106,16] [332,218,32] [364,218,112]
[476,330,16] [492,442,64] [556,330,80] [636,554,80] [716,554,32] [748,442,32]
[780,330,32] [812,442,48] [860,554,96] [956,554,16] [972,442,16] [988,330,64]
[1052,442,32] [1084,330,16] [172,162,112] [972,274,96] [860,498,96] [556,610,112]
```

The last four are **dashed queue bars** — they carry no handoffs by design. The other 20
are solid step bars.

16 handoffs as `[fromX, fromY, toX, toY]`:

```
[140,330,156,106]  [156,106,332,218]  [236,330,316,106]  [316,106,332,218]
[364,218,476,330]  [476,330,492,442]  [492,442,556,330]  [556,330,636,554]
[716,554,748,442]  [748,442,780,330]  [780,330,812,442]  [812,442,860,554]
[956,554,972,442]  [972,442,988,330]  [988,330,1052,442] [1052,442,1084,330]
```

Label ink widths (Nunito, as rendered — `getBBox` these, don't trust the table):

```
Signature 63.79 · Counter-signature 104.65 · Kickoff 50.17 · Source access 84.01
Mapping sign-off 99.72 · UAT 38.51 · Go live 50.66 · Redline review 88.4
Execution 64.15 · PO issued 65.62 · Payment terms queue 122.09 · Schema mapping 100.07
Field validation 90.99 · Migration dry run 100.65 · Smoke tests 76.12 · Training 56.93
Security review 91 · Sandbox load 83.24 · Cutover window queue 128.34
Production cutover 107.63 · DPA addendum 92.85 · Invoice reconciliation 116.91
Runbook drafting 100.72 · Infra pre-provision 106.08
```

Caption box: **14.04px of ink + 2px knockout halo each side = 18.04px painted**;
baseline sits at `boxTop + 12.53`.

## Current state, measured from the drawn paths

**Connectors: 14 of 16.**
- Catmull-Rom spline through invisible waypoints, C1-smooth, emitted as chained cubics.
- All **28 endpoints sit exactly at an edge midpoint** (max offset 0.00px).
- 22px perpendicular stub along the edge normal before the first waypoint.
- 1 direct (3 cubic segments), 13 with one waypoint (4 segments).
- 12 side-edge anchors across 9 connectors; the rest top/bottom.
- Detour: **median 1.15×** direct distance, **max 1.76×**. Hard cap 2.6×.
- Clearance floor **8px** from every bar, label, leader and the lane column.

**Labels: 24 placed, 0 overlaps.**
- 19 above/below, 5 beside. 7 leaders — 5 horizontal, 2 vertical.
- 17 unleadered, each overlapping its own bar by ≥16px and ≥61.6% of that bar's width
  (worst: Infra pre-provision, 69.08 of 112), with 7.97–7.99px painted air to the bar.
- 5 of the 17 are slid along the bar (8px steps, up to 40px off centre) to clear a
  reserved connector stub.

**Undrawn: `780@330 → 812@442` and `956@554 → 972@442`.**
Routes exist at 6.66× and 4.55× direct — rejected as detours, not connectors.
Four bars lose edges as a result: 812@442 and 972@442 have no inbound, 780@330 and
956@554 no outbound, and **956@554 ends with no edges at all** — the only solid step bar
in that condition.

## Why those two fail

Arithmetic, not judgement. A bar narrower than `labelWidth + 2 × 20px stub` has no side
left for its label, so the label must overhang the bar on both sides and seals every
approach — including the side edges.

- `812@442` is 48px wide, carries a 100.65px label, and has anchors on both top and bottom.
- `956@554` is 16px wide (a **4px** usable anchor span — it cannot hold two anchors on one
  edge at all) and carries a 107.63px label.

At 24 steps in 1152px, four bars are in this condition. **This is a width problem, not a
routing problem.** Estimated inner width that clears it: ~1229px. The alternatives are
shorter labels, or accepting 14/16 with the loss documented.

I was asked to decide and I'd widen the panel: 14/16 with an edgeless step bar is a
content failure, and every other lever trades away either the label text or the 8px floor.

## Rules that must survive any rewrite

These were each learned by breaking them. Regressions here are what most of the work went on.

**Anchors**
- The midpoint must **outrank path length** in the scoring, not merely be offered as one
  candidate among `mid ± 6/12/18`. Score on length alone and anchors wander to a bar's
  corner to save 2–3px of arc — that is the "random corner" read, and it survives every
  clearance check.
- Anchors come from a **shared registry**, allocated as you route, **narrowest bars first**.
  Two anchors on one edge must sit ≥12px apart or the arrowheads coincide and one vanishes.
- Where an edge is already claimed, the second handoff moves to a **different edge** and
  takes that midpoint — never sits off-centre on the shared one.
- A side edge at mid-height is legal only where the bar carries no beside-label.

**Labels**
- Preference order **above, below, then beside** — not beside first.
- Attribution without a leader is **horizontal, never by distance**: the label must sit
  over the bar it names, with no other bar of that row beneath the words. A distance
  margin is unreachable by construction — an above/below label sits ~10px off its own bar
  while a same-row neighbour is only 2–8px further.
- Anything that cannot sit over its bar takes a **leader**, and the leader is what
  licenses a deep-gutter placement where proximity would attribute it to the wrong row.
- Reserve every connector's departure and arrival stub **before** placing labels — the
  space directly above a bar is the space its handoff needs. Where both compete, a label
  may intrude on a stub *reservation* but never on drawn geometry.

**Row pitch**
- `h + 34` where a label sits in the gutter; geometric floor `h + 30`; `h` is the bar above.
- Measure air from the **painted** extent (halo included) and split the surplus. Do not add
  a term for the depth rect — it is offset `+4,+4`, so it consumes room below and right of
  a bar, never above.

## How to verify — this is where the time went

**Derive every number from the drawn paths, never from the router's logs or from memory.**
Parse the `d` strings out of the file (or `getPointAtLength` in the live DOM), rebuild the
obstacle set from the rendered `<rect>`/`<text>` boxes, and recompute. Specific traps, all
of which cost a round:

- A predicate that cannot fail. `overlap >= Math.min(barW, overlap) - 0.1` is a tautology;
  it reported "16/16 full width covered" and tested nothing.
- `toFixed` on a **floor** bound rounds *up* — 61.68 → "62%" excluded the very label that
  set the bound. Use `Math.floor(x * 10) / 10`.
- Router pre-sampling reads the detour ratio ~0.04 low. Re-measure on the written path at
  ≤0.5px steps.
- Excluding endpoint obstacles by object identity fails if you rebuilt the obstacle array —
  compare by value, or the "min clearance" you report is just each path's own standoff.
- Counts go stale the moment edges change: side-anchor counts, segment counts, casualty
  counts, leader counts. Generate the sentence, don't type it.
- Casualties must be computed as **in/out degree per bar**, and a flow origin with no
  inbound by design is not a casualty.

Useful invariants to assert after every run: no two endpoints <12px apart; every endpoint
exactly at an edge midpoint; min clearance ≥8px to non-endpoint obstacles; no label
overlapping a bar it does not name; detour ratio ≤2.6×.

## Working data

`scraps/4c-plan.json` — anchors + label placements (`label, bar, side, x, y, leader`).
`scraps/4c-splines.json` — per-pair route: `d`, waypoint count, detour ratio, clearance.
`scraps/4c-measured.json` — last measured detour median/max.

The router that produced the current state: allocate anchors while routing (narrow bars
first); for each pair try direct, then one waypoint on each nearby gutter midline swept in
12px steps, then two; score `(sourceOffset + targetOffset) × 1000 + arcLength` so the
midpoint dominates; feasibility-check the densely sampled spline at 8.5px then 8.0px.
