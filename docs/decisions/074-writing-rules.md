# Writing rules

- **Date:** 2026-10-30
- **Source:** the owner's approval of step 7, record 069, and the writing rules listed in
  `docs/subprojects/writing-rules.md`
- **Status:** in force

---

## Rules

Section 13 of `SPEC.md` holds every writing rule, in three groups: limits (13.1), register (13.2) and
headings (13.3). A rule a page can be measured against fails the checks; a rule that needs a reader's
judgment warns. The new checks are in `checks/writing.mjs`.

| Rule | Source | Check |
| --- | --- | --- |
| Paragraph: 3 sentences and 60 words at most | Brief, limits | `paragraph-length`, failure |
| Sentence: 30 words at most | Brief, limits | `sentence-length`, failure |
| Sentence: 25 words as the target | Brief, limits | `sentence-target`, warning |
| Sentences average 18 words or fewer | Brief, limits | `sentence-average`, failure |
| List item: 2 sentences and 40 words at most | Brief, limits | `list-item-length`, failure |
| Prose between headings: 150 words at most | Brief, limits | `prose-between-headings`, failure |
| Section lede: 45 words at most, key phrase in bold | Brief, limits | `section-lede`, failure |
| Caption: 30 words at most | Brief, limits | `caption-length`, failure |
| Headings never skip a level | Brief, limits; spec §4 | `headings`, failure (existing) |
| Plain words: "use", not "utilize"; "so", not "in order to" | Brief, register | `plain-words`, failure |
| No emoji | Brief, register; spec §1 rule 11 | `emoji`, failure (existing) |
| Neutral third person | Agent brief | `person`, failure |
| No chat-style labels | Agent brief | `chat-labels`, failure |
| No em dashes or en dashes in prose | Agent brief | `dashes`, failure |
| Bold: one or two phrases per paragraph, never a whole sentence | Brief, register | `bold-phrases`, failure |
| Text before a leading colon is bold | Spec §13 | `bold-colon`, warning (existing) |
| No signposting | Brief, register | `signposting`, warning |
| No rhetorical questions | Spec §13 | `questions`, warning |
| No "this isn't X, it's Y" | Spec §13 | `not-x-but-y`, warning |
| The number, the comparison and the period | Spec §13 | `unquantified`, warning |
| Heading: no article, question or arguing adjective | Brief, headings | `heading-form`, failure |
| Heading: no framing words; no verbs outside a procedure | Brief, headings | `heading-words`, warning |
| Sentence case for headings | Spec §13 | `sentence-case`, warning |
| Lead with the finding; figure titles describe what is shown | Spec §13 | Checklist, §14 item 14 |
| No hype; no history of the work; changing numbers in one dated status block | Spec §13; brief; agent brief | Checklist, §14 item 14 |
| Dates, durations and percentage points in their forms | Spec §13 | Checklist; metadata dates by `masthead` |

Section 13 also lists the component limits set elsewhere in the spec (report title, dek, executive
summary lede, TL;DR, key finding, definition, answer, property key, step title, figure title, chart
annotation), each with its section. Section 14 gains item 14, a writing item.

## Measured text

The checks read the live page once, after fonts load.

| Scope | What counts | What does not |
| --- | --- | --- |
| Text | Every word in `<main>`, including headings, labels and metadata, and text in a closed disclosure | Code blocks, tables, chart internals and data fallbacks, screen-reader-only and aria-hidden text, the gallery's markup listings, template placeholders |
| Prose | Paragraphs (including ledes, TL;DRs, deks, figure descriptions and timeline bodies), list items, definitions, questions and answers, callout bodies, captions, process-step bodies, and any other block whose own text ends a sentence | Labels, chips, tags, footnote markers, metadata, property sheets, sources lists, item titles |
| Headings | `h1` to `h6`, and table titles without their kind label | Timeline and step titles, terms, questions |

A word is counted as in §7. Inline code inside a sentence counts as one word; a placeholder such as
`{{ Section title }}` counts as none, so the template's placeholders trip no limit. A sentence ends
at a full stop, question mark or exclamation mark followed by a space and a capital, a digit or an
opening quote; common abbreviations (e.g., i.e., vs., est.) do not end one.

Limits, bold, dashes, signposting, questions and contrasts are read on prose. Person, plain words and
chat-style labels are read on all text. The heading rules are read on headings.

## Calls

- **Failure or warning.** A numeric limit, or a word or phrase every use of which breaks the rule,
  fails. A pattern that finds candidates for a reader to judge warns: one rule, kept whole, without a
  list of exceptions.
- **Section lede.** The lede is the paragraph that opens a section body. A section with a TL;DR has
  the TL;DR in that place, under its own limit (§8.1), since §7 offers a TL;DR or a lede for one slot.
- **Caption.** The 30-word limit applies to `.cm-caption`, under a figure or a table: the kit's caption
  element, so like things are measured alike.
- **Definitions and answers.** Each is measured as a paragraph, which agrees with the 60-word top of
  §8.5 and the three sentences of §8.6.
- **Bold labels.** A bold label before a colon is a label, not one of the paragraph's bold phrases, so
  a caption's "Source:" and "Note:" leave room for the phrases the rule counts.
- **Bold claims.** The claim sentence that opens a key finding or a recommended action stays bold, as
  §8.3 and §8.19 set it, while the owner rules on it. Every other whole sentence in bold fails.
- **Pull quotes.** Verbatim words (§8.9) are not the document's voice: person, dashes, plain words,
  signposting and the other register checks skip them. Their length still counts.
- **Person.** Every first and second person form fails, not only the four words the agent brief
  names; "US" in capitals is the country.
- **Dashes.** Read on prose only, as the rule states. Tables keep the em dash that marks a value that does not apply
  (§8.11). Record 090 replaces that dash with `n/a`.
- **Average sentence length.** Taken over all the prose of a page.
- **Prose between headings.** Counted from one heading to the next, table titles included, whatever
  sits between them.
- **Verbs in headings.** Only a heading that opens with an "-ing" word and a determiner ("Using the
  kit") is flagged; other verbs are left to the reader. Framing is flagged through the words that open
  a clause (what, where, when, why, how, who, which).
- **Sentence case.** Proper nouns cannot be told from title case, so a heading warns only when two or
  more of its later words of four letters or more are capitalised and they make up most of them.
- **Word lists.** Plain words, chat-style labels and arguing adjectives hold the examples the brief
  and the agent brief give, and nothing more. The signposting and unquantified-change warnings use
  short patterns built on the examples in §13.
- **Em-dash chains.** "No em-dash chains" gives way to "no em dashes or en dashes in prose", which
  covers it.
- **Template.** The comment above the key findings asks for one evidence sentence after the claim, so
  a finding stays within two sentences.

## Owner questions

Four items in `docs/open-items.md`: bold labels before a colon, heading case, the TL;DR and the
section lede, and bold claim sentences. The spec's current rule holds on each, and the checks follow
it, until the owner answers.

## Version

The kit stays at 1.1 for now. The version for this change is the owner's call.
