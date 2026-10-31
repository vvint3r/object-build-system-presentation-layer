// Write the index page of a document set: index.html in the set's folder, built from kit components
// (SPEC.md section 8.31). It lists every document in the folder by area, the second step of each
// document's breadcrumb; within an area, reports newest first, then guides and references A to Z.
// Each entry is a related-list item: the kind as its tag, the title as its link, the dek as its
// sentence, and a meta line with the status and the published date.
//
// Usage:  npm run index -- <folder>
//
// The page is written only when every document carries what the index needs: an id, a title, a
// dek, a status chip, a published date, and a breadcrumb from the set (index.html) to its area
// (index.html#area-id). Otherwise the problems are listed and nothing is written. The output
// depends only on the documents, so a second run writes the same file; checks/links.mjs compares
// the page on disk with a fresh build.

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFolder, slug, fileHref, DOCUMENT_KINDS, STATES } from './set.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KIT = path.join(ROOT, 'kit', 'report-kit');
const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TAG = { report: 'Report', guide: 'Guide', reference: 'Reference' };
// The index page's prose is its own dek and the deks of its documents, so they keep within SPEC.md
// section 13.1: 150 words at most between two headings, and 18 words a sentence on average.
const AREA_WORDS = 150;
const AVERAGE = 18;
const DEK = 'Every document in the set by area, with its kind, purpose, status and published date.';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const words = s => s.split(' ').filter(w => /[\p{L}\p{N}]/u.test(w)).length;
const byText = (a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }) || (a < b ? -1 : a > b ? 1 : 0);

// The head the kit's report template prescribes: its theme pre-paint script and Google Fonts URL.
function kitHead() {
  const template = readFileSync(path.join(KIT, 'template.html'), 'utf8');
  const head = template.slice(0, template.indexOf('</head>')).replace(/<!--[\s\S]*?-->/g, '');
  return {
    prepaint: (head.match(/<script>([\s\S]*?)<\/script>/) || [])[1] || '',
    fonts: (head.match(/href="(https:\/\/fonts\.googleapis\.com\/css2[^"]*)"/) || [])[1] || '',
  };
}

// Check each document and gather the set. Returns { set, publisher, areas, docs, errors }.
export function readSet(pages) {
  const errors = [];
  const docs = [];
  const sets = new Map(), publishers = new Map(), areaNames = new Map();
  for (const p of pages.filter(x => DOCUMENT_KINDS.includes(x.kind) && x.file !== 'index.html')) {
    const bad = msg => errors.push(`${p.file}: ${msg}`);
    if (p.idTags !== 1) bad(`${p.idTags} cm-id tags (exactly 1)`);
    else if (!ID.test(p.id) || p.id === 'index') bad(`cm-id "${p.id}" (lowercase words joined by hyphens; "index" is the index page's)`);
    if (!p.title) bad('no title (h1.cm-mast__title)');
    if (!p.dek) bad('no dek (.cm-mast__dek), the purpose line the index shows');
    const status = p.chips.find(c => STATES.includes(c));
    if (!status) bad(`no status chip (${STATES.join(', ')})`);
    if (!DATE.test(p.published)) bad(`Published "${p.published}" (YYYY-MM-DD)`);
    const [set, area, here] = p.crumbs;
    if (p.crumbs.length !== 3 || !here || !here.current) {
      bad('the breadcrumb is not three steps, set, area and document, ending with the document (aria-current="page")');
      continue;
    }
    if (set.tag !== 'a' || set.href !== 'index.html') bad(`the set step "${set.text}" does not link to index.html`);
    const areaId = slug(area.text);
    if (area.tag !== 'a' || area.href !== `index.html#${areaId}`) bad(`the area step "${area.text}" does not link to index.html#${areaId}`);
    if (areaId === 'top' || !areaId) bad(`the area name "${area.text}" gives the id "${areaId}", which the index page cannot use`);
    sets.set(set.text, [...(sets.get(set.text) || []), p.file]);
    publishers.set(p.publisher, [...(publishers.get(p.publisher) || []), p.file]);
    if (areaNames.has(areaId) && areaNames.get(areaId) !== area.text) bad(`the area "${area.text}" and the area "${areaNames.get(areaId)}" share the id ${areaId}`);
    else areaNames.set(areaId, area.text);
    docs.push({ file: p.file, kind: p.kind, id: p.id, title: p.title, dek: p.dek, status, published: p.published, area: area.text, areaId, stylesheet: p.stylesheet, script: p.script });
  }
  if (!docs.length && !errors.length) errors.push('no documents in the folder (pages with <meta name="cm-kit">)');
  if (sets.size > 1) errors.push(`the documents name ${sets.size} sets in their breadcrumbs: ${[...sets].map(([s, f]) => `"${s}" (${f.join(', ')})`).join('; ')}`);
  if (publishers.size > 1) errors.push(`the documents name ${publishers.size} publishers in their wordmarks: ${[...publishers].map(([s, f]) => `"${s}" (${f.join(', ')})`).join('; ')}`);
  const ids = new Map();
  for (const d of docs) ids.set(d.id, [...(ids.get(d.id) || []), d.file]);
  for (const [id, files] of ids) if (files.length > 1) errors.push(`the id "${id}" is used by ${files.join(', ')}`);

  const areas = [...areaNames].map(([id, name]) => ({ id, name, docs: docs.filter(d => d.areaId === id) }))
    .sort((a, b) => byText(a.name, b.name));
  for (const a of areas) {
    a.docs.sort((x, y) => DOCUMENT_KINDS.indexOf(x.kind) - DOCUMENT_KINDS.indexOf(y.kind)
      || (x.kind === 'report' && y.published !== x.published ? (y.published < x.published ? -1 : 1) : 0)
      || byText(x.title, y.title));
    const n = a.docs.reduce((sum, d) => sum + words(d.dek), 0);
    if (n > AREA_WORDS) errors.push(`the area "${a.name}" holds ${n} words of purpose lines (at most ${AREA_WORDS}, SPEC.md section 13.1); split it into two areas`);
  }
  const total = docs.reduce((sum, d) => sum + words(d.dek), words(DEK));
  if (docs.length && total / (docs.length + 1) > AVERAGE) {
    const long = docs.filter(d => words(d.dek) > AVERAGE).map(d => `${d.file} (${words(d.dek)})`);
    errors.push(`the deks average ${(total / (docs.length + 1)).toFixed(1)} words a sentence on the index page (at most ${AVERAGE}, SPEC.md section 13.1); shorten the longest: ${long.join(', ')}`);
  }
  return { set: [...sets.keys()][0] || '', publisher: [...publishers.keys()][0] || '', areas, docs, errors };
}

// The index page's HTML, or the errors that stop it.
export function buildIndex(pages) {
  const s = readSet(pages);
  if (s.errors.length) return { errors: s.errors };
  const { prepaint, fonts } = kitHead();
  // The kit's stylesheet and script as the documents carry them: linked at the same paths, or pasted
  // when the documents do not all link the same files.
  const pairs = new Set(s.docs.map(d => `${d.stylesheet}\u0000${d.script}`));
  const [css, js] = pairs.size === 1 ? [...pairs][0].split('\u0000') : [null, null];
  const linked = css && js && css !== 'null' && js !== 'null';
  const updated = s.docs.map(d => d.published).sort().pop();
  const n = s.docs.length;
  const pad = i => String(i + 1).padStart(2, '0');

  const entry = d => `          <li><span class="cm-tag">${TAG[d.kind]}</span><a href="${esc(fileHref(d.file))}">${esc(d.title)}</a><p>${esc(d.dek)}</p><span class="cm-meta">${esc(d.status)} · published <time datetime="${d.published}">${d.published}</time></span></li>`;
  const section = (a, i) => `    <section class="cm-section" id="${a.id}" aria-labelledby="${a.id}-t">
      <header class="cm-section__head">
        <span class="cm-section__num">Part ${pad(i)}</span>
        <h2 class="cm-section__title" id="${a.id}-t">${esc(a.name)}</h2>
      </header>
      <div class="cm-section__body">
        <ul class="cm-related">
${a.docs.map(entry).join('\n')}
        </ul>
      </div>
    </section>
`;

  const html = `<!doctype html>
<!--
  Content Morphia · Report Kit 2.0 · INDEX PAGE
  Generated from the documents in this folder by \`npm run index -- <folder>\` (tools/index.mjs).
  Regenerate it after adding or changing a document; never edit it by hand (SPEC.md §8.31).
-->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(s.set)}</title>
<meta name="cm-kit" content="2.0">
<meta name="cm-kind" content="index">
<meta name="cm-id" content="index">
<script>${prepaint}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fonts}">
${linked ? `<link rel="stylesheet" href="${esc(css)}">` : `<style>${readFileSync(path.join(KIT, 'cm-report.css'), 'utf8')}</style>`}
<script src="https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js" defer></script>
${linked ? `<script src="${esc(js)}" defer></script>\n` : ''}</head>
<body>

<header class="cm-topbar">
  <div class="cm-topbar__in">
    <a class="cm-wordmark" href="#top">${esc(s.publisher)}</a>
    <span class="cm-chip">Document index</span>
    <div class="cm-topbar__actions">
      <button class="cm-btn cm-btn--quiet cm-btn--sm" type="button" data-cm-theme-toggle>Dark mode</button>
    </div>
  </div>
</header>

<div class="cm-shell">
  <nav class="cm-rail" aria-label="Contents">
    <div class="cm-toc">
      <span class="cm-label">Contents</span>
      <ol>
${s.areas.map((a, i) => `        <li><a href="#${a.id}"><span class="n">${pad(i)}</span>${esc(a.name)}</a></li>`).join('\n')}
      </ol>
    </div>
  </nav>

  <main class="cm-main" id="top">

    <header class="cm-mast">
      <nav class="cm-crumbs" aria-label="Breadcrumb">
        <span aria-current="page">${esc(s.set)}</span>
      </nav>
      <div class="cm-bar" aria-hidden="true"></div>
      <h1 class="cm-mast__title">${esc(s.set)}</h1>
      <p class="cm-mast__dek">${DEK}</p>
      <dl class="cm-mast__meta">
        <div><dt>Status</dt><dd><span class="cm-chip">Index</span></dd></div>
        <div><dt>Documents</dt><dd>${n}</dd></div>
        <div><dt>Updated</dt><dd>${updated}</dd></div>
      </dl>
    </header>

${s.areas.map(section).join('\n')}
    <footer class="cm-footer">
      <span><b>${esc(s.set)}</b></span>
      <span>${n} document${n === 1 ? '' : 's'} · updated ${updated}</span>
      <span>${esc(s.publisher)}</span>
      <span>Content Morphia Report Kit 2.0</span>
    </footer>
  </main>
</div>
${linked ? '' : `<script>${readFileSync(path.join(KIT, 'cm-report.js'), 'utf8')}</script>\n`}</body>
</html>
`;
  return { html, set: s, errors: [] };
}

// Run from the command line: write the index page into the folder.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const folder = process.argv[2];
  if (!folder || process.argv.length > 3) {
    console.error('Usage: npm run index -- <folder>');
    process.exit(2);
  }
  const pages = await readFolder(folder);
  const { html, set, errors } = buildIndex(pages);
  if (errors.length) {
    console.error(`No index written. ${errors.length} problem${errors.length === 1 ? '' : 's'} in ${folder}:`);
    for (const e of errors) console.error(`  ${e}`);
    process.exit(1);
  }
  const out = path.join(folder, 'index.html');
  writeFileSync(out, html);
  console.log(`wrote ${out}: ${set.docs.length} documents in ${set.areas.length} areas`);
  const others = pages.filter(p => !DOCUMENT_KINDS.includes(p.kind) && p.file !== 'index.html').map(p => p.file);
  if (others.length) console.log(`not listed, since they are not documents of the kit: ${others.join(', ')}`);
}
