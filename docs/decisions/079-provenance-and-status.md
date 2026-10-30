# Provenance and status

- **Date:** 2026-10-30
- **Source:** the orchestrating session, under the owner's delegation in record 075; scope from
  record 076 and `docs/subprojects/kit-features.md`
- **Status:** in force

---

## Rules

Sections 8.21 and 8.22 of `SPEC.md` hold the rules; section 14 gains item 15. Every new check is a
failure, in `checks/provenance.mjs`.

| Component | Rule | Check |
| --- | --- | --- |
| Source entry | Key `SN` in `.cm-id` and id `src-N`, stable and in order; title, publisher, type tag, locator, dated `<time>` | `source-entries`; `sources` for the type set |
| Citation | `a.cm-cite` after punctuation, reading the key, with an id, pointing at an entry | `citations` |
| Back link | A cited entry has one back link, to its first citation; a listed entry has none | `source-backlinks` |
| Evidence date | "as of" and a `<time>`; every `<time>` carries an ISO `datetime` | `dates` |
| Disagreement | Label, quantity line, two or three cited values, a closing reason | `disagreement` |
| Status block | One per document at most; a dated head; key and value entries | `status-block` |
| Change log | A kind from Added, Revised, Removed, Correction; a link; a date; newest first | `change-log` |
| Revision history | `vX.Y`, summary, owner and date; newest first; the newest matches the masthead | `revisions` |
| Limitation register | Name, effect, one status chip from Open, By design, Resolved with its offset; other chips plain | `limitations` |

The existing checks read the new markup: a citation is a marker like a footnote reference for type
size, prose, headings and summary numbers, and a status key is a label.

## Calls

- **Source type.** The type tag names what the source is: Dataset, Report, Interview, Document or
  System export. It replaces the origin and format tags (Int, Ext, PDF, Web, API), since the locator
  already shows both. One closed set is easier to apply than two.
- **Key and id.** A visible key, `S4`, keeps a citation short and readable in print; the id `src-4`
  carries the same number. Keys never change between versions, so a citation in an old copy still
  names the right source.
- **Citation marker.** Styled as the footnote reference, at the same 11px size, so the text carries
  one kind of marker. A claim with several sources carries a marker for each, side by side.
- **Back link.** One back link per entry, which the script points at the citation followed. Static
  links for every citation would crowd the entry; the footnote back link is single too.
- **Cited or listed.** An entry no claim cites stays in the register with no back link. A document
  can rest on a source it does not quote.
- **Lists, not tables.** The four registers are lists with one shared row anatomy. They reflow on a
  phone and carry no table anatomy (kind, title, caption) that a register does not need.
- **Order.** The change log and the revision history run newest first, for a returning reader. The
  timeline keeps oldest first, since it tells a sequence.
- **Change link.** Each change links the section, figure or table it changed, so a reader can check
  the change in place.
- **Limitation status.** Open (warn offset), By design (note offset) and Resolved (ok offset), plus an
  optional plain chip for a planned fix date. The word carries the meaning.
- **Callout or register.** One or two limits stay limitation callouts, three or more move to the
  register in Appendix A under A.2. Two callouts are a section's limit (§7). No check counts limits
  across a document, since the gallery shows both forms.
- **Disagreement block.** No icon and no surface: a label, the quantity, a dotted rule, the values in
  24px at weight 900, and the reason. It reads as part of the argument, not a callout.
- **Status block.** An S2 surface, one per document; the budget is in §6 and the check enforces it.
- **Sample report.** Citations on the evidence of the four key findings, to existing sources. No
  status block, since a closed quarter's numbers do not change. No limitation register, since the
  report states one limitation and keeps its callout. No disagreement block, since no two sources
  differ in it.
- **Adoption status.** The Provenance and Change and status rows of `docs/adoption.md` read Covered,
  since the change builds the scope `docs/subprojects/kit-features.md` sets for each. The library
  parts outside that scope stay listed in each row.
- **Template.** The source entry takes the register form with placeholders, and no citation, so it
  reads as listed. The new checks accept placeholders, as the writing checks do (record 074).

## Deferred

The library's aggregation header, agreement and spread, and confidence qualifier wait for an
acceptance document that uses them, as `docs/subprojects/kit-features.md` sets out. The library's six
node states, with the notice each one obliges, are outside this change. The per-node diff stays out
of the kit with the version selector (record 076).

## Version

The kit stays at 1.2. The version for this change is the orchestrating session's call.
