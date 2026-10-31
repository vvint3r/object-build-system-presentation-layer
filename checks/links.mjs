// Link integrity across a document set: the folder that holds a set's documents and its index page
// (SPEC.md section 8.31). Run on the folder, not on one page:
//
//   npm run links -- <folder>
//
// One line per check, in the form the page checks use (checks/run.mjs): ok or FAIL, the folder,
// "all", the check and its source, then one indented line per finding. Exit code 1 on any failure.
//
//   doc-ids        every kit page carries one cm-id, lowercase words joined by hyphens, and no two
//                  pages share one; the index page's id is "index"
//   set-links      every document's breadcrumb runs set, area, document: the set step links to
//                  index.html, the area step to index.html#{area id}, and the wordmark to index.html
//   links          every link in every page of the folder resolves: a fragment to an id in the same
//                  page; a file to a file that exists; a file and a fragment to a section id in that file
//   index-current  index.html exists and matches what `npm run index` writes from the documents now
//
// Links to other sites (http:, https:, mailto: and any other scheme) are not followed. Pages
// without a cm-kit tag, such as the gallery, have their links checked but carry no id or breadcrumb.

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { readFolder, readFile, slug, DOCUMENT_KINDS } from '../tools/set.mjs';
import { buildIndex } from '../tools/index.mjs';

const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SOURCE = 'SPEC §8.31';

const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error('Usage: npm run links -- <folder>');
  process.exit(2);
}
const folder = args[0];
const name = folder.replace(/\/+$/, '') || folder;
const pages = await readFolder(folder);
const kitPages = pages.filter(p => p.kind);
const docs = kitPages.filter(p => DOCUMENT_KINDS.includes(p.kind));
const byFile = new Map(pages.map(p => [p.file, p]));

function docIds() {
  const out = [], seen = new Map();
  for (const p of kitPages) {
    if (p.idTags !== 1) { out.push({ where: p.file, value: `${p.idTags} cm-id tags (exactly 1)` }); continue; }
    if (!ID.test(p.id)) out.push({ where: p.file, value: `cm-id "${p.id}" (lowercase words joined by hyphens)` });
    if (p.kind === 'index' && p.id !== 'index') out.push({ where: p.file, value: `the index page's cm-id is "${p.id}" ("index")` });
    if (p.kind !== 'index' && p.id === 'index') out.push({ where: p.file, value: 'cm-id "index" belongs to the index page' });
    if (seen.has(p.id)) out.push({ where: p.file, value: `cm-id "${p.id}" is also the id of ${seen.get(p.id)}` });
    else seen.set(p.id, p.file);
  }
  return out;
}

function setLinks() {
  const out = [], sets = new Map();
  if (!byFile.has('index.html')) out.push({ where: name, value: 'no index page (index.html); npm run index -- <folder> writes it' });
  for (const p of docs) {
    const [set, area, here] = p.crumbs;
    if (p.wordmarkHref !== 'index.html') out.push({ where: `${p.file} wordmark`, value: `href="${p.wordmarkHref}" (index.html)` });
    if (p.crumbs.length !== 3 || !here || here.current !== 'page') {
      out.push({ where: `${p.file} breadcrumb`, value: `${p.crumbs.length} steps; three are set, area and document, ending with the document (aria-current="page")` });
      continue;
    }
    if (set.tag !== 'a' || set.href !== 'index.html') out.push({ where: `${p.file} breadcrumb`, value: `set step "${set.text}" does not link to index.html` });
    const id = slug(area.text);
    if (area.tag !== 'a' || area.href !== `index.html#${id}`) out.push({ where: `${p.file} breadcrumb`, value: `area step "${area.text}" links to ${area.href || 'nothing'} (index.html#${id})` });
    sets.set(set.text, [...(sets.get(set.text) || []), p.file]);
  }
  if (sets.size > 1) out.push({ where: name, value: `the breadcrumbs name ${sets.size} sets: ${[...sets].map(([s, f]) => `"${s}" in ${f.join(', ')}`).join('; ')}` });
  return out;
}

async function links() {
  const out = [];
  const outside = new Map();
  const target = async file => {
    const base = path.basename(file);
    if (path.resolve(path.dirname(file)) === path.resolve(folder) && byFile.has(base)) return byFile.get(base);
    if (!outside.has(file)) outside.set(file, await readFile(file));
    return outside.get(file);
  };
  for (const p of pages) {
    for (const { href, where } of p.links) {
      const at = `${p.file} ${where}`;
      const h = (href || '').trim();
      if (/^[a-z][a-z0-9+.-]*:/i.test(h)) continue;
      if (!h || h === '#') { out.push({ where: at, value: `href="${h}" points at nothing` }); continue; }
      const hash = h.indexOf('#');
      let file = hash < 0 ? h : h.slice(0, hash), frag = hash < 0 ? '' : h.slice(hash + 1);
      try { file = decodeURIComponent(file); frag = decodeURIComponent(frag); } catch (e) {
        out.push({ where: at, value: `href="${h}" is not a valid address` });
        continue;
      }
      if (!file) {
        if (!p.ids.includes(frag)) out.push({ where: at, value: `href="${h}": no element #${frag} in the page` });
        continue;
      }
      if (file.startsWith('/')) { out.push({ where: at, value: `href="${h}": an absolute path; a link to another page is its file name` }); continue; }
      const full = path.join(folder, file);
      if (!existsSync(full)) { out.push({ where: at, value: `href="${h}": no file ${file}` }); continue; }
      if (!frag) continue;
      if (!/\.html$/i.test(file)) continue;
      const t = await target(full);
      if (!t.ids.includes(frag)) out.push({ where: at, value: `href="${h}": no element #${frag} in ${file}` });
      else if (!t.sections.includes(frag)) out.push({ where: at, value: `href="${h}": #${frag} is not a section id in ${file}; links between pages name sections only` });
    }
  }
  return out;
}

function indexCurrent() {
  const { html, errors } = buildIndex(pages);
  if (errors.length) return errors.map(e => ({ where: name, value: e }));
  const file = path.join(folder, 'index.html');
  if (!existsSync(file)) return [{ where: name, value: 'no index.html; npm run index -- <folder> writes it' }];
  return readFileSync(file, 'utf8') === html ? [] : [{ where: file, value: 'differs from what the documents give now; npm run index -- <folder> rewrites it' }];
}

const CHECKS = [
  { name: 'doc-ids', run: docIds },
  { name: 'set-links', run: setLinks },
  { name: 'links', run: links },
  { name: 'index-current', run: indexCurrent },
];

let failed = false;
for (const check of CHECKS) {
  let found;
  try { found = await check.run(); } catch (e) { found = [{ where: '(check error)', value: String(e.message).split('\n')[0] }]; }
  const status = found.length ? 'FAIL' : 'ok  ';
  if (found.length) failed = true;
  console.log(`${status}  ${name}  all    ${check.name}  (${SOURCE})`);
  for (const f of found) console.log(`        ${f.where}  ${f.value}`);
}
const skipped = pages.filter(p => !p.kind).map(p => p.file);
if (skipped.length) console.log(`skip  ${name}  all    doc-ids, set-links on pages that are not kit pages (links checked): ${skipped.join(', ')}`);
process.exit(failed ? 1 : 0);
