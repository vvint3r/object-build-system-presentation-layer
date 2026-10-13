# B7 "Power, Sample Size & Duration" — content-morphia build output

Produced 2026-08-27 by the Learnalytics Phase-3 pipeline. This is the format-v2 pilot
document restyled onto the content-morphia design system, as published at the artifact.

## Files
- B7--power-sample-size-duration.html — the COMPLETE standalone page (CSS + JS inline,
  as morphia artboards are authored: helmet <style> block + inline style="" attributes).
  Open directly in a browser; this is the canonical file.
- b7-artifact-variant.html — the same page with the outer <!doctype>/<html>/<head>/<body>
  wrappers stripped (the claude.ai artifact runtime supplies its own skeleton). This exact
  content is what is published at the artifact URL.
- extracted-styles.css — every <style> block concatenated (helmet: font link target,
  resets, focus ring, structural @media, slider vendor pseudo-elements, print CSS).
  NOTE: the bulk of the visual system is INLINE style attributes per morphia's
  "inline styles only" rule — this file is only the helmet layer.
- extracted-scripts.js — every <script> block concatenated: the lab math (invNorm,
  phiCdf, nArm, ladders), DOM wiring, and window.B7_SELFTEST() (16-check verification
  of the labs against the document's registered numbers).

## Notes for Claude Design
- Fonts: <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,600;0,700;0,800;0,900;1,400&amp;family=JetBrains+Mono:wght@400;600;700&amp;display=swap" rel="stylesheet">
- Light-only per the system lock (dark deferred in content-morphia SPEC).
- Two proposed morphia extensions used here, awaiting ratification: the range-slider
  control (synthesized from the #f1f1f1 track token + white black-bordered node thumb +
  mono readout) and the atomic four-part FORMULA container (S2 parent, depthless children
  per R12.5).
- Diagram figures follow the system's architecture: absolutely-positioned HTML nodes under
  a transparent SVG edge overlay; three figures are full Path-B rebuilds.
