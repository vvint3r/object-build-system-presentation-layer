# R27.1 — mono at content size (2026-08-31)

- **Date:** 2026-08-31
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 833–847
- **Status:** historical record, copied verbatim. Current rules are in `docs/spec/rules.md`.

---

Rule 3 sets mono labels at 9.5–10px. That floor is for **labels**: units, table headers, chip text, timestamps, provenance. It was being applied to mono that carries **content** — a metric identifier in a matrix cell, a worked example's input and output lines — and at 10px those are unreadable. Wynt3r found it twice on one page.

**The rule.** Mono has two sizes by role, and the role is decided by whether the string is read or scanned.
- **Label mono** — 9.5–10px, 700, caps, letter-spacing .08–.1em. Unchanged.
- **Identifier mono** — 12px, 600, sentence or verbatim case, no letter-spacing. Any mono string a reader has to actually read: metric identifiers in a cell, code-adjacent values in prose blocks, worked-example lines, field values in a register.

**One named exception, and only one.** **Section-number mono** — the `§NN` that sits beside a section title: 11px, 400, letter-spacing .1em, no caps transform because it is already a numeral. It is neither scanned meta nor read content; it is page chrome, sized against the 28px title it pairs with. At label size it stops reading as part of the title; at identifier size it competes with it. This is the single most-repeated mono token in the library, on every one of the thirty-plus pages, and the first draft of R27.1 declared it illegal — corrected here rather than in the pages.

Nothing else sits between the two role sizes. A mono string at 10.5px, or an 11px mono that is not a section number, is one of the two roles set wrongly.

**Applied.** T2 §the five dimensions (metric row, five cells) and §worked example (input and output bodies). **Owed:** Structured §04 uses the same matrix pattern and needs the same read; queued as Q36.
