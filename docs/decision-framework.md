# Decision framework

How decisions about content-morphia are made: the order in which sources settle a question, the
principles behind the kit's rules, which decisions a working session takes and which wait for the
owner, and how to choose between options. `kit/report-kit/SPEC.md` states the rules; this file holds
the reasons and the decision rights.

## Authority order

When sources disagree, the higher one wins.

1. **`kit/report-kit/SPEC.md`**, the rules in force.
2. **Decision records** in `docs/decisions/`, for why a rule exists and how it is read. A record and
   the spec never disagree; where they do, that is an open item. Records 000 to 053 describe the
   original library and do not bind the kit.
3. **The principles below**, for questions the spec and the records do not settle.
4. **The library reference** in `docs/reference/`, only while adopting a library feature, and only
   where the kit has no value of its own.
5. **Taste**, last.

Applying a rule is not a decision. A question the spec or a record answers is answered.

## Principles

**Built for reading and reference.** The kit makes the documents of a knowledge index: long reports
that are read closely and returned to. Reference density and comfort over long reading outrank visual
interest. An option that makes a page more striking but slower to read or scan is the wrong
option.

**Weight ranks, colour means.** Text is black or white, and importance is shown with weight, never with
grey or lowered opacity. Colour is kept for meaning: status, a chart series, the accent. So colour never
fills a label, the accent is never text, a gradient appears only where it carries meaning, and meaning
never rests on colour alone.

**Emphasis is rare.** Emphasis works only while there is little of it: one featured card and one summary
per report, at most one verdict chip per table or figure, at most one emphasised block per section. A
new component that emphasises draws on these budgets; it does not bring its own.

**Small closed sets.** The kit uses a few values and uses them everywhere: one family for text and one
for code, the weights it loads, one label tier, seven radii, the classes its stylesheet defines. A new
need is met from these sets first. A value outside them is the owner's call. Nothing goes into the kit
that no page or rule uses.

**Like things look alike.** An element looks the same wherever it appears and however many there are:
a single highlighted cell reads like a highlighted column, a label on one chart point is styled like
every other value label, and every label is the same size.

**Every element earns its place.** No decoration and no filler: an optional block is left out rather
than padded. Every number is sourced, stated with its comparison and period, and every number in a
summary appears again in the body beside its evidence.

**Findings first, in plain words.** A section leads with its finding, then the evidence. Sentences are
plain and factual, with the number in place of the adjective.

**One rule over a rule with exceptions.** Where two fixes both work, the one that keeps a rule whole
wins: every formatted cell carries a raw value, rather than a narrower rule about which cells need
one; the stylesheet stays the one list of allowed classes, rather than a second list kept in step with
it. An exception the kit does allow is named in the spec with its reason, and the checks accept that
case and nothing like it.

**The kit's own pages follow the kit.** The gallery and the sample report are held to the rules they
show. The gallery is exempt only from the report anatomy it does not have.

## Decision levels

Every decision sits at one of three levels.

### Session decides

The session makes the call; the commit is the record.

- Wording and order of prose, within the writing rules.
- Resolving a warning from the checks on a kit page, on the page.
- Code and tooling that leave the rendered pages and what the checks accept unchanged: structure of
  the checks, the preview, helper scripts.
- Bookkeeping: indexes, regenerated counts, links between documents.

### Session decides and reports

The session makes the call, records it and names it in its report in plain words. The owner can
overturn it.

- **A reading of the spec where it leaves a choice.** For example, the weight scale as the weights
  the kit loads, rather than every weight Nunito offers.
- **Where a fix lives**, when it could live in more than one place. For example, a wrongly styled
  label on one chart point fixed in the kit's chart script, which every page inherits, rather than in
  the one figure.
- **A choice between fixes that both meet the rules.** For example, sort values added to formatted
  cells rather than a narrower rule; the note and done classes defined in the stylesheet rather than
  a second allowed list.
- **Routine design and plan calls** that come up inside a change and have a sensible default.

The record is the pull request's list of decisions taken without a ruling. A call that sets a
standing reading of the spec also gets a decision record.

### Owner rules

The session stops, states the question with the values and their sources, and builds nothing that
depends on the answer.

- A value outside a closed set: a colour, size, weight, radius, typeface, icon or glyph the kit does
  not have.
- Adding, removing or loosening a rule, or a new exception to one.
- The spec and the code disagreeing on a rendered value.
- A check failing on a kit page.
- A new exemption from the checks for a page or a region.
- A visible change to a component that no rule or ruling calls for.
- Scope and order of work: the plan, the adoption order, what a change includes.
- The kit's version.
- Merging to `main`, syncing to Claude Design, and anything published.

Questions about the kit go in `docs/open-items.md`; questions about the work are asked in session.

## Checks and the levels

The automated checks show the levels at work. A warning marks a judgment call: on a kit page it is
the session's to resolve, on the page, and the gallery and the sample carry none. A failure means a
page and a hard rule disagree, and which one gives way is the owner's call.

## Unclear cases

- A decision that could sit at two levels takes the higher one. The test: a decision that adds a
  value, a rule or an exception, or changes what the reader sees without a rule asking for it, is the
  owner's.
- An owner instruction that reads two ways: where the narrower reading is part of the wider one, apply
  the narrower and ask about the wider in the report. Where the readings pull in different directions,
  ask before building.

## Choosing between options

When the session decides, it prefers the option that:

1. keeps every set closed;
2. keeps one rule whole rather than adding an exception;
3. makes like things look alike;
4. fixes the cause: page content on the page, rendering in the kit's code that every page inherits,
   and never by loosening a check;
5. can be verified on the rendered page in light, dark and print.

Its record states in one sentence why the option won.
