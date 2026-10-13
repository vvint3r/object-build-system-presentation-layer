# Round 40d (2026-09-07) — the correction pass, applied without further questions

- **Date:** 2026-09-07
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 1435–1459
- **Status:** historical record from the original library, copied verbatim. The rules in force are in `kit/report-kit/SPEC.md`.

---

Reviewer's note, recorded because it changes how this work is reported: the previous three rounds were
reported as machinery (passes, counts, declarations) and closed with a form asking him to arbitrate
technical scope. Both were wrong. **The rules and the component layer exist so these decisions are made
here, not escalated.** Progress is shown as pages, not as counts.

Applied across all 35 pages:
- **114 container headings** were set at 15px/700, smaller than the 15.5px prose beneath them, which is the
defect R36.2 exists to prevent. Now T3: 21px/800 at 1.3.
- **613 mono labels** still carried the retired wide tracking (.06–.09em). Now .02em.
- **624 spacing values** sat off both scales (5, 7, 11, 15, 18, 22, 26px). Stepped onto the nearest legal
value. Gaps on the five diagram pages were left alone: their connector geometry derives from them.
- **93 prose blocks** were leading under the floor (1.4–1.6). Now 1.75 at 14px, 1.85 at 15.5px.
- **21 grey header rows** (#f1f1f1, retired by R36.5) are white under a 1.5px black rule.
- **130 mono chips at 700** are 600. A chip already carries a fill or a border; weight has nothing left to mark.
- **Six black-filled chips** that mark nothing actionable: four `Published` status chips now take the ok
tint, two `Reference build` badges are neutral. Rule 7c retired both.
- **One full-sentence claim** at 19px/800 on T11 is prose at 15.5/400. Weight marks a phrase, never a sentence.
- **The menu bar and section strip wrapped badly under ~1040px**, orphaning the last pill on an indented
second line. Both rows now break to full width, so the pills start at the left margin. Fixed once, in the
two components.

Still authored by hand and queued: the sticky rail, the label chips as instances, container surfaces.
Neither blocks anything; both are maintenance now that the values live in one place.
