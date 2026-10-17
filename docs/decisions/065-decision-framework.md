# Decision framework

- **Date:** 2026-10-17
- **Source:** the owner, in session, asking for "a clear decision making framework to align with this
  design system, logic, approach, and overall philosophy"
- **Status:** in force

---

## Ruling

Decisions about the kit follow `docs/decision-framework.md`. It sets the order in which sources settle
a question, the principles behind the kit's rules, and three decision levels: what a session decides
alone, what it decides and reports, and what waits for the owner.

## Grounds

The principles and levels come from the rulings in force and the owner's standing working
preferences: routine design and plan calls are the session's, recorded and reported; scope, audience
and anything irreversible or outward-facing are the owner's; the first finished example of a rebuild
is reviewed by the owner before the rest is built; an instruction that reads two ways is asked about
before work starts.

| Part of the framework | Grounds |
| --- | --- |
| Authority order | `SPEC.md` introduction; `CLAUDE.md`; records 054 and 064 |
| Principles | `CLAUDE.md` introduction; `SPEC.md` rules 4 to 12, sections 6 and 13; records 056 and 058 to 064 |
| Session level | Record 064; `CLAUDE.md` checks section |
| Reported level | The decisions taken without a ruling on 16 Oct 2026, which the owner accepted on 17 Oct; records 057 (readings) and 062; `CLAUDE.md` on adopting features; the standing preferences |
| Owner level | `CLAUDE.md`; records 057 to 060 and 063; the standing preferences |
| Checks | Records 057 and 064 |
| Unclear cases | Records 055 and 056; the standing preferences |

## Decisions taken without a ruling

- A new component's classes, markup, rules and checks are a reported call inside a step the owner has
  approved, built from the kit's existing values.
- The first finished example of a new component or family goes to the owner before the rest is built.
- A failure a change introduces is fixed in that change, not logged as an open item.
- Applying one owner ruling in several commits in one session is a reported departure from the
  one-change-per-session rule.
- The kit's version is the owner's call.

## Changed

`CLAUDE.md`: the framework is listed under "Read before working", and the rule that every decision is
the owner's becomes a pointer to the framework's levels. Questions about the kit still go to
`docs/open-items.md`. A failing check goes there when the page as it stands in `main` fails; a
failure a change introduces is fixed in the change.

## Version

The kit stays at 1.1.
