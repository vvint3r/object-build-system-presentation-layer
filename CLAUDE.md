# content-morphia presentation layer

This repository is the source of truth for **content-morphia**, a design system for a knowledge index:
structured knowledge and learning content, built for reference density and long-form reading comfort.
Claude Design consumes it; it is not edited there. See `docs/plan.md`.

## Read before working

- `docs/spec/rules.md`: the rules in force. The only place rules are stated.
- `docs/spec/open-items.md`: conflicts awaiting the owner. Never resolve one on your own.
- `docs/plan.md`: operating model, migration steps and their state.
- `docs/decisions/`: one record per past ruling. Read a record only when you need the reason for a rule.
- `import/`: the two original exports. **Read-only.** Never edit, move or delete anything in it.

## Where things live

| Path | Contents |
| --- | --- |
| `docs/spec/` | Current rules and open items |
| `docs/decisions/` | Historical rulings, verbatim, one per file, with an index |
| `docs/plan.md` | How the system is built and the migration order |
| `import/nodetrak-presentation-layer/` | content-morphia as exported from Claude Design |
| `import/kx-visualizations-index/` | The visualization kit offshoot as exported |

Planned folders (`tokens/`, `rules/`, `components/`, `viz/`, `content-schema/`, `library/`, `bundle/`)
are listed in `docs/plan.md`. Create one only when the migration step that needs it starts.

## How to work in this repository

- **One change per session.** One component, one rule, one page, or one migration step. Commit when
  it is done; the commit is the checkpoint. Start the next change in a fresh session.
- **Rules live in one place.** Change a rule in `docs/spec/rules.md` and record why in a new file in
  `docs/decisions/`, named `NNN-short-slug.md` with the next number. Never restate a rule in another
  file. The non-negotiables below are the one summary; change them in the same commit.
- **Decisions are the owner's.** When the rules, the tokens and the built pages disagree, add an item
  to `docs/spec/open-items.md` with both values and their sources. Do not pick one.
- **Values come from tokens.** Once `tokens/` exists, never write a raw hex, size, spacing, radius or
  shadow that a token carries.
- **A check asserts the rendered result.** Verify computed styles in a real browser, not the authored
  string. A check that cannot see every form a violation takes is not a check.
- **Measure, don't recall.** Counts and values in docs are generated from the files, never typed from
  memory.
- Use subagents for audits and wide searches so the main session holds only the change.

## Non-negotiables

These hold in every case. Details and the rest are in `docs/spec/rules.md`.

1. Text is `#000` or `#fff` only. Hierarchy is weight, never tinted ink.
2. The accent `#1bbd94` is never text, and is always redundant with a shape, label or position cue.
3. Nunito reads and displays; JetBrains Mono is meta only, always at 12px, and never a heading.
4. A heading is never smaller than the body it introduces, and no two tiers share a size on a page.
5. Every repeated part has exactly one implementation. Never hand-author a component's markup.
6. At most one reserved emphasis and at most one solid semantic per view.
7. Meaning never depends on colour alone. Labels come from the closed vocabulary.
8. Every interactive is a real element with a visible focus ring.
9. No em dash in page copy.
10. A documentation page holds rules, specifications, limits and specimens only. No history, status,
    options or reports.

## Reporting to the owner

- Lead with the outcome. Executive level: the call, the number behind it, the consequence.
- In chat, never use internal shorthand: no rule ids, round numbers, item codes or template ids.
  Say the thing in plain words. Codes belong in `docs/` only.
- Status updates: what is done, what is left, what needs a decision. No derivations.
- Do not apply generic aesthetic skills or directions. This system overrides them.

## Verify

No automated checks exist yet; they arrive with migration step 4. Until then, check a change against
`docs/spec/rules.md` by reading the rendered result, and say in the commit what was verified and how.
