// Read a folder of kit pages: what the index page lists (tools/index.mjs) and what the link check
// verifies (checks/links.mjs). Each HTML file in the folder, not its subfolders, is parsed by
// Chromium's DOMParser through Playwright, so entities, attribute order and whitespace read as a
// browser reads them. Nothing runs: scripts in the pages stay inert.
//
// A kit page carries <meta name="cm-kit">. Its kind is the cm-kind tag (a page without one is a
// report); report, guide and reference are documents, and index is the generated index page
// (SPEC.md section 8.31). Other HTML files, such as the gallery, are read only as link targets.

import { chromium } from 'playwright';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

export const DOCUMENT_KINDS = ['report', 'guide', 'reference'];
export const STATES = ['Draft', 'In review', 'Final'];

// A name or file name as an id: lowercase, accents dropped, a hyphen for each run of other
// characters. "Guide - Billing Escalation" gives guide-billing-escalation.
export const slug = s => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// A file name as it is written in an href: spaces as %20, an ampersand as %26.
export const fileHref = file => encodeURIComponent(file);

// Runs in the page: everything the index and the link check need from one file.
function extract(src) {
  const d = new DOMParser().parseFromString(src, 'text/html');
  const text = el => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
  const metas = name => [...d.querySelectorAll(`meta[name="${name}"]`)];
  const content = name => { const m = metas(name)[0]; return m ? (m.getAttribute('content') || '').trim() : null; };
  const field = label => {
    const dt = [...d.querySelectorAll('.cm-mast__meta dt')].find(x => text(x) === label);
    return dt && dt.nextElementSibling ? dt.nextElementSibling : null;
  };
  const crumbs = d.querySelector('.cm-mast .cm-crumbs');
  const steps = crumbs ? [...crumbs.children].filter(el => !el.classList.contains('sep')).map(el => ({
    tag: el.localName,
    text: text(el),
    href: el.getAttribute('href'),
    current: el.getAttribute('aria-current'),
  })) : [];
  const status = field('Status');
  const chips = status ? [...status.querySelectorAll('.cm-chip')].map(text) : [];
  const mark = d.querySelector('.cm-topbar .cm-wordmark');
  // Where a link sits: the nearest element with an id, then the link's own text.
  const where = a => {
    const host = a.parentElement && a.parentElement.closest('[id]');
    return `${host ? `${host.localName}#${host.id}` : 'body'} > a "${text(a).slice(0, 40)}"`;
  };
  return {
    kit: content('cm-kit'),
    kindTag: content('cm-kind'),
    id: content('cm-id'),
    idTags: metas('cm-id').length,
    title: text(d.querySelector('h1.cm-mast__title')),
    dek: text(d.querySelector('.cm-mast__dek')),
    crumbs: steps,
    publisher: text(mark),
    wordmarkHref: mark ? mark.getAttribute('href') : null,
    chips,
    published: text(field('Published')),
    ids: [...d.querySelectorAll('[id]')].map(el => el.id),
    sections: [...d.querySelectorAll('section[id]')].map(el => el.id),
    links: [...d.querySelectorAll('body a[href]')].map(a => ({ href: a.getAttribute('href'), where: where(a) })),
    stylesheet: (d.querySelector('head link[rel="stylesheet"][href$="cm-report.css"]') || { getAttribute: () => null }).getAttribute('href'),
    script: (d.querySelector('head script[src$="cm-report.js"]') || { getAttribute: () => null }).getAttribute('src'),
  };
}

// Every HTML file in the folder, in file-name order, with its kind: a document kind, 'index', or
// null for a page that is not a kit page.
export async function readFolder(folder) {
  const files = readdirSync(folder)
    .filter(f => f.toLowerCase().endsWith('.html') && statSync(path.join(folder, f)).isFile())
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const pages = [];
    for (const file of files) {
      const src = readFileSync(path.join(folder, file), 'utf8');
      const rec = await page.evaluate(extract, src);
      const kind = rec.kit ? (rec.kindTag || 'report') : null;
      pages.push({ file, kind, ...rec });
    }
    return pages;
  } finally {
    await browser.close();
  }
}

// Parse one file outside the folder, for a link that points there.
export async function readFile(file) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    return await page.evaluate(extract, readFileSync(file, 'utf8'));
  } finally {
    await browser.close();
  }
}
