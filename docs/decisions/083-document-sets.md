# Document sets

- **Date:** 2026-10-30
- **Source:** record 076 and the Navigation scope in `docs/subprojects/kit-features.md`, through the
  orchestrating session's brief for round 3; open choices taken by the session under the delegation
  in record 075
- **Status:** in force

---

## Rules

Section 8.31 of `SPEC.md` holds the rules: addresses, the breadcrumb, the index page and the link
check. Sections 2, 7, 7.1, 8.24, 14 (item 19) and 15 point at it.

| Rule | Spec | Check |
| --- | --- | --- |
| Every page carries one `<meta name="cm-id">` after `cm-kind`: lowercase words joined by hyphens | §2, §8.31 | `head-order`, failure |
| The file name is the kind, a spaced hyphen and a short title; the id is the file name in lowercase with hyphens; neither changes once published | §8.31 | Not checked: a published name is kept as it stands |
| No two pages in a set share an id; the index page's id is `index` | §8.31 | `doc-ids` (links), failure |
| A link to another document is its file name, `%20` for a space; a place in it is a section id | §8.31, §8.24 | `links` (links), failure |
| The breadcrumb runs set, area, document; set and area steps link to `index.html` and `index.html#{area id}`, or are spans outside a set; the last step is the page itself | §7.1, §8.31 | `masthead`, failure; `set-links` (links), failure |
| In a set, the wordmark links to `index.html`; elsewhere, and on the index page, to `#top` | §7.1, §8.31 | `topbar`, failure; `set-links` (links), failure |
| The index page carries the kind `index`; Status (Index), Documents and Updated; no byline, no sources | §7, §8.31 | `head-order`, `masthead`, `report-anatomy`, failure |
| One section per area, A to Z, holding one related list; each entry closes with a meta line of status and published date | §8.24, §8.31 | `index-anatomy`, failure |
| The index page matches what `npm run index` writes from the documents | §8.31 | `index-current` (links), failure |
| A set's deks keep the index within §13.1: 150 words an area, 18 words a sentence on average | §8.31, §13.1 | `npm run index` refuses; the page's writing checks |

Checks marked "(links)" are in `checks/links.mjs` and run on a folder with `npm run links --
<folder>`. The rest run on each page with `npm run check`.

## Files

| File | Holds |
| --- | --- |
| `tools/set.mjs` | Reads a folder's pages through Chromium's parser: kind, id, title, dek, status, dates, breadcrumb, ids, sections, links |
| `tools/index.mjs` | `npm run index -- <folder>`: writes `index.html`, or lists what stops it |
| `checks/links.mjs` | `npm run links -- <folder>`: `doc-ids`, `set-links`, `links`, `index-current` |
| `kit/index.html` | The kit folder's index page, generated from its three documents |

The three documents carry ids and set breadcrumbs. The templates carry an id placeholder, the set
breadcrumb and a note on documents outside a set. The gallery shows the breadcrumb (5.35) and the
index entry (5.36).

## Calls

| Decision | Reason |
| --- | --- |
| The index page is a fourth value of `cm-kind`, `index`, with its own anatomy check; it is not a document kind | It is generated, never written, and has no sources or byline. A kind lets the checks hold it to its own parts without a page exemption |
| The file name stays the address; the id is separate from it | A static page can only link to a file. The id gives each document an identity a tool can rely on and a uniqueness rule a check can enforce |
| The id is the file name in lowercase with hyphens, set at first publication | An agent derives it without tooling; the index page's id, `index`, follows the same rule |
| The kit's three files keep their names, and the sample report keeps the word "Sample" | A published file name never changes. The sample report's name predates the naming rule; its id still follows the id rule |
| Links between documents name section ids only | Section ids are fixed or stable by rule; figure, table, note and citation ids change as a document grows |
| The area is read from the breadcrumb, not from a second tag | The breadcrumb already names the area; one source cannot disagree with itself. The area id is the name in lowercase with hyphens, so link and name stay in step |
| The breadcrumb's last step is the short title; no step links to the page itself | Every step is either a way out or the reader's position. The earlier `#top` steps went nowhere |
| Outside a set, set and area steps are spans | A step links only where a page exists; a single document handed over alone has no index |
| The wordmark links to the index page in a set | The top bar stays on screen, so the index is one step away anywhere in a document. It stands in for the library's fixed menu bar, which the kit's top bar cannot hold |
| The index groups by area, A to Z | A reader looks for a subject first. The breadcrumb's area step lands on its section, so the trail and the index share one structure |
| Within an area, reports newest first, then guides, then references, A to Z | Reports are dated and a returning reader wants the latest; guides and references are looked up by name. The kinds follow the spec's order |
| Each entry is a related-list item with a meta line | Like things alike: a list of documents looks the same in a guide and on the index. The meta line mirrors the dated line of a source entry |
| The meta line shows the status as a word, not a chip | Forty status chips with colour offsets would crowd the list; the masthead of each document keeps its chip |
| Documents leave the meta line out of their related lists | A date copied from another document goes stale; the index is rewritten from the documents |
| The purpose line is the dek | It is one sentence by rule. The Purpose and Definition paragraphs run to 60 words and would break the list item limit |
| The kit's three deks are shortened to 18 words or fewer | The index page's prose is its deks, and §13.1 holds it to 18 words a sentence on average. The deks ran 20, 21 and 23 words |
| `npm run index` refuses a set whose deks break §13.1 on the index | The generated page must pass the checks; the script names the deks to shorten or the area to split |
| Updated is the newest published date among the documents, not the date the script runs | The output depends only on the documents, so `index-current` can compare a fresh build with the page on disk |
| The kit's documents form one set, Support operations, in two areas: Billing, and Service performance | The publisher is Support Operations. The review and the first response reference share a subject; the escalation guide stands apart |
| Breadcrumb rules sit in the `masthead` check, not a new check | The breadcrumb is a masthead part (§7.1). The gallery already skips `masthead`, so no exemption is added |
| `cm-id` is required on every document, standalone or in a set | One rule whole: every document has an identity. Templates accept a placeholder, as the writing checks do |
| The `links` check runs on every page in the folder, the gallery among them; ids and breadcrumbs are checked on kit pages only | The gallery's demos link to the kit's documents, as the metric detail does; an agent copies that markup, so its links must resolve |
| The link check also resolves links within a page | No page check catches an in-page link to a missing id outside the rail, footnotes, citations and related list |
| The page checks treat `index` as a kind: `sources` and `summary-anatomy` skip it; `title-length` allows 1 to 10 words | The index page's title is the set's name, as a reference's is the name of its subject |
| The rules live in a new §8.31 | The brief for step 8 puts new rules under section 8; sections 2, 7 and 8.24 point at it |

## Left out

Search, faceted browse, ranked entry and the version selector with diff need a server, as record
076 sets out. The index page and breadcrumb are the way into a set; the change log and revision
history (§8.22) say what changed in a document. A list of recently published documents was not
built: the meta line dates each entry, and reports run newest first within an area.

## Version

The kit stays at 1.2. A document built on 1.2 without a `cm-id` tag now fails `head-order` until it
adds one. The version for this change is the orchestrating session's call.
