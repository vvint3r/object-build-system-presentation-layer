# Decision framework

How decisions about content-morphia are made: the order in which sources settle a question, the
principles behind the kit's rules, which decisions a working session takes and which sit at the
owner level, and how to choose between options. `kit/report-kit/SPEC.md` states the rules; this file holds
the reasons and the decision rights.

## Authority order

When written sources disagree, the higher one wins.

1. **`kit/report-kit/SPEC.md`**, the rules in force.
2. **Decision records** in `docs/decisions/`, for why a rule exists and how it is read. A record and
   the spec are kept in agreement; a disagreement between them is an open item. Records 000 to 053
   describe the original library and do not bind the kit.
3. **The principles below**, for questions the spec and the records do not settle.
4. **The library reference** in `docs/reference/`, only while adopting a library feature, and only
   where the kit has no value of its own.
5. **Taste**, last.

The owner is outside this order: an owner ruling changes the spec and adds a record. An owner-level
decision the orchestrating session takes does the same, and stands until the owner reverses it.
Applying a rule is not a decision.

## Principles

**Built for reading and reference.** The kit makes the documents of a knowledge index: long reports
that are read closely and returned to. Reference density and comfort over long reading outrank visual
interest. An option that makes a page more striking but slower to read or scan is the wrong option.

**Weight ranks, colour means.** Text is black or white, with the two exceptions the spec names, and
importance is shown with weight, never with grey or lowered opacity. Colour is kept for meaning:
status, a chart series, the accent. So colour never fills a label, the accent is never text, a gradient
appears only where it carries meaning, and meaning never rests on colour alone.

**Emphasis is rare.** Emphasis works only while there is little of it: one featured card and one summary
per report, at most one verdict chip per table or figure, at most one emphasised block per section. A
new component that emphasises takes a place in the spec's emphasis budget; it does not bring a budget
of its own.

**Small closed sets.** The kit uses a few values and uses them everywhere: one family for text and one
for code, the weights it loads, one label tier with chips and role tags as its named variants, seven
radii, the classes its stylesheet defines. A new need is met from these sets first, and a value
outside them is an owner-level call. The class set grows only through a new component built from the
kit's existing values. Nothing goes into the kit that no page or rule uses.

**Like things look alike.** An element looks the same wherever it appears and however many there are:
a single highlighted cell reads like a highlighted column, and a label on one chart point is styled
like every other value label.

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
show. The gallery is exempt only from what a catalogue cannot have: report anatomy, counts across a
report, and the helper layer around its demos. Inside a demo, every rule holds.

## Decision levels

### Session level

The session makes the call; the commit is the record.

- Wording and order of prose, within the writing rules.
- Resolving a warning from the checks on a kit page, on the page.
- Fixing a failure the session's own change introduces, in that change.
- Code and tooling that leave the rendered pages and what the checks accept unchanged: structure of
  the checks, the preview, helper scripts.
- Bookkeeping: indexes, regenerated counts, links between documents.

### Reported level

The session makes the call, records it and names it in its report in plain words. The owner can
overturn it.

- **A reading of the spec where it leaves a choice.** For example, the weight scale as the weights
  the kit loads, rather than every weight Nunito offers.
- **Where a fix lives**, when it could live in more than one place. For example, a wrongly styled
  label on one chart point fixed in the kit's chart script, which every page inherits, rather than in
  the one figure.
- **A choice between fixes that both meet the rules.** For example, sort values added to formatted
  cells rather than a narrower rule; two variant classes the spec named but the stylesheet lacked,
  defined in the stylesheet rather than listed in a second allowed list.
- **What a new component needs**, inside a step the owner has approved: its classes, markup, spec
  rules and checks, built from the kit's existing tokens, weights, radii and budgets. A value or an
  exception the component cannot do without is an owner-level call.
- **Routine design and plan calls** inside a change that leave what the change includes, the step
  order and the adoption order as they are.
- **A departure from a working rule in `CLAUDE.md`**, such as applying one owner ruling in several
  commits in one session, with the reason.
- **Merging a pull request to `main`** once the orchestrating session has reviewed it.

The call goes in the decision record of the change it belongs to, and the report names it. A change
with no record gets one when the call sets a standing reading of the spec; otherwise the commit
message carries it.

### Owner level

A working session stops, states the question with the values and their sources, and builds nothing
that depends on the answer.

- A value outside a closed set: a colour, size, weight, radius, typeface, icon or glyph the kit does
  not have.
- Adding, removing or loosening a rule, or a new exception to one.
- The spec and the code disagreeing on a rendered value.
- A check failing on a kit page as it stands in `main`.
- A new exemption from the checks for a page or a region.
- A visible change to an existing component that no rule or ruling calls for.
- The first finished example of a new component or family, before the rest is built.
- Scope: what a change includes and leaves out, which migration step runs next, the adoption order,
  and who a document is for.
- The kit's version.
- Syncing to Claude Design, and anything published.

These change what the reader sees, what the rules allow, or what leaves the repository. Questions
about the kit go in `docs/open-items.md`; questions about the work go to the orchestrating session.

**Delegation.** The owner has delegated these decisions to the orchestrating session (record 075).
It takes each one, records it in a decision record and lists it in its report. The owner reverses any
of them on review.

Only what a tool or platform gates on the owner stays with the owner: a `/design-sync` to Claude
Design, which the owner starts, and anything made public, such as GitHub Pages.

## Checks

A warning marks a judgment call: on a kit page it is the session's to resolve, on the page. A failure
on a page as it stands in `main` means the page and a hard rule disagree, and which one gives way is
an owner-level call.

## Unclear cases

- A decision that could sit at two levels takes the higher one.
- An owner instruction that reads two ways is asked about before building.

## Preference order

When the session decides, it prefers the option that:

1. keeps every set closed;
2. keeps one rule whole rather than adding an exception;
3. makes like things look alike;
4. fixes the cause: page content on the page, rendering in the kit's code that every page inherits,
   and never by loosening a check.

The option chosen is verified on the rendered page in light, dark and print, and its record states in
one sentence why it won.
