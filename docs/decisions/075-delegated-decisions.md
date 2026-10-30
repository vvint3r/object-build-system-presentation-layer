# Delegated decisions

- **Date:** 2026-10-30
- **Source:** the owner, in session, on 30 Oct 2026: "Let's just finish this, and then we'll iterate
  at this point. I want us to reach the end of this without having to stop at each point, unless
  there are no more tokens left." and "Make decisions to the best of your ability."
- **Status:** in force

---

## Ruling

Decisions the owner has not made are taken by the orchestrating session. Each one is recorded in a
decision record and listed in the session's report. The owner reverses any of them on review.

Only what a tool or platform gates on the owner stays with the owner: a `/design-sync` to Claude
Design, which the owner starts, and anything made public, such as GitHub Pages.

## Answers

The five items left in `docs/open-items.md` on 30 Oct 2026 take these answers.

| Item | Answer | Reason |
| --- | --- | --- |
| Focus on one mark | Record 069's ruling covers bars, lines and areas. Scatter points and other point marks keep their series colour | Grey points measure 1.41:1 against the figure surface, so each would need a value label |
| Bold labels before a colon | No bold label runs into the text that follows it. A label that stays takes its own line, a heading, a table row or a definition-list term. A caption's source and note lines are lines of their own, not bold | A bold label run into a sentence reads as one of its bold phrases, which the writing rules hold to one or two |
| Heading case | Headings stay in sentence case | The rule as written; every kit page already follows it |
| TL;DR and the section lede | A TL;DR keeps its own limit of 40 words and stands in for the section lede. It carries no bold phrase; its label marks it | A TL;DR and a lede fill one slot (section 7), so the slot keeps one limit |
| Bold claim sentences | A key finding and a recommended action keep their claim sentence on a line of its own, at the card's claim weight, with the evidence or reason on the next line | Bold then never marks a whole sentence in running text, so that rule holds without an exception |

## Calls

- **Captions.** A figure's title and one sentence are its title and description, above the chart. A
  table's title sits above it. The caption under either holds the source line, then any note or flags
  line, each a `cm-caption__line` of its own. "Source:" opens its line in the caption's regular weight.
- **Caption lines are 4px apart,** the smallest step of the component scale, so two lines read as
  two entries rather than one wrapped sentence.
- **Claim lines.** The claim is a `cm-findings__claim` span at 800, the weight the claim had, set
  6px above its evidence: the gap between a definition's term and its explanation. It is not
  `<strong>`, so neither bold check needs an exception for it.
- **TL;DR label.** The label is a `cm-label` on its own line, 12px above the sentence, as a callout's
  label sits above its body. It reads "TL;DR" with no colon, like every other label in the kit.
- **Run-in labels check.** `bold-labels` fails two cases, each only when more text follows on the
  same rendered line. The first is bold text ending in a colon, anywhere in `<main>`, tables
  included. The second is a bold phrase that opens a unit of prose: a paragraph, list item,
  definition, answer, callout body or caption.
- **Labels count as bold phrases.** A bold label before a colon is no longer set apart from the bold
  phrases a paragraph may carry, or from a section lede's key phrase. Run-in labels fail on their own.
- **Claim-line check.** `claim-lines` fails an item of any findings list, in the summary or the
  recommendations card, without exactly one claim line opening it. The count of three to five
  findings stays a warning in `findings`.
- **Bold in a TL;DR.** `tldr-length` warns on a bold phrase inside a TL;DR, so the TL;DR keeps no
  bold beyond its label.
- **Unused rules removed.** `cm-report.css` drops the 800 weight for bold inside a caption and for a
  TL;DR's opening `<strong>`; no kit markup uses either. Bold in a finding's evidence keeps 800, as
  in a callout body.
- **Section ledes.** Two of the sample report's ledes opened with their bold key phrase. Each now
  carries the phrase later in its first sentence.
- **Gallery helper layer.** The three rules in the gallery's "Kept from Foundations" box take a title
  line each (`cm-t5`). The chart rules list becomes plain sentences. The spacing property sheet
  splits its scale into two rows with sub-labels.
- **Agent brief.** Its summary of the writing rules and its kit version follow the spec. Its commit
  pins stay, and move after the merge.
- **Changed in 1.2.** Section 15 of the spec gives each change one line. Focus on one mark takes a
  single line for records 069 and 075 together, since both set one rule.
- **Reference files.** The two files in `docs/reference/` name the Report Kit without a version, so
  they hold across releases.
- **One session.** The five answers and the 1.2 release run as one change in one session, one commit
  per group, as the orchestrating session's brief set.

## Changed

| File | Change |
| --- | --- |
| `kit/report-kit/SPEC.md` | Section 4: claim lines join the T5 tier. Section 8.1: the TL;DR label. Section 8.3 and 8.19: the claim line. Section 8.5: an example is a sentence of its own. Sections 8.10 and 8.11: caption lines. Section 8.14: no item opens with a bold label. Section 9: caption lines in the anatomy, and the scope of focus on one mark. Section 13.1: the TL;DR stands in for the lede. Section 13.2: the bold rules. Section 14: items 5 and 9. Section 15: changed in 1.2 |
| `kit/report-kit/cm-report.css` | `cm-section__tldr` label, `cm-findings__claim`, `cm-caption__line`; the caption and TL;DR bold weights removed; version 1.2 in the header |
| `kit/report-kit/cm-report.js` | Version 1.2 in the header |
| `kit/Report Kit - Spec & Gallery.html` | TL;DR, findings, recommendations, callouts, definitions, lists, captions, chart rules, property sheet, the "Kept from Foundations" box, the checklist and descriptions follow the rules; version 1.2, last updated 2026-10-30 |
| `kit/Sample Report - Q3 Support Review.html` | TL;DRs, findings, recommendations, captions and two section ledes follow the rules; version 1.2 |
| `kit/report-kit/template.html` | TL;DR, findings and captions follow the rules; version 1.2 |
| `kit/agent-brief.md` | Writing rules and kit version |
| `checks/writing.mjs` | `bold-labels` added; `bold-phrases` and `section-lede` count every bold phrase, and `bold-phrases` keeps no exception for claims |
| `checks/judgment.mjs` | `bold-colon` removed; `findings` counts findings only; `tldr-length` reads the label and warns on bold |
| `checks/structure.mjs` | `claim-lines` added; `footer` names kit 1.2 |
| `checks/figures.mjs`, `checks/tables.mjs` | A caption needs a line opening "Source:" |
| `checks/markup.mjs` | `head-order` expects `cm-kit` 1.2 |
| `docs/decision-framework.md` | The owner level states the delegation |
| `docs/open-items.md` | The five items deleted; no item is open |
| `docs/plan.md`, `README.md`, `CLAUDE.md`, `docs/adoption.md` | Kit 1.2 released; step 6's direction set by the orchestrating session |
| `docs/subprojects/writing-rules.md` | Its state notes the questions answered |
| `docs/reference/library-open-items.md`, `docs/reference/library-rules.md` | The kit named without a version |

## Version

With these answers in the kit, every kit page passes the checks, and the kit becomes 1.2 (record 069).
