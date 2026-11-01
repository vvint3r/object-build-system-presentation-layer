// Measure a migration between kit versions: every kit page as it stood at a released commit, checked
// with the checks in this working tree. Section 15 of SPEC.md lists the result as the migration note.
//
// Usage:  npm run migration [-- <commit>] [--all]
//
// The commit defaults to 22e0fb2, the Report Kit 1.2 release. Each HTML page under kit/ at that
// commit is written to a temporary folder in the same layout, beside this tree's report-kit/
// stylesheet and script: the place a document sits once its kit folder is replaced. checks/run.mjs
// runs on those pages, and the output lists each check that fails or warns, with the pages, modes
// and findings behind it.
//
// A template carries placeholders that fail some checks by design. A finding on a template that this
// tree's template of the same name also returns, in the same check and with the same value apart from
// its numbers, is a placeholder, not a change to make; such findings are listed apart. The link check
// (npm run links) is left out: it reads a document set's folder, and a released page belongs to no set.
//
// Findings on one page that share a check and a value are listed once, with their count, modes and
// first element; at most five values are listed per page and check, and --all lists every one.

import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const all = args.includes('--all');
const ref = args.find(a => !a.startsWith('--')) || '22e0fb2';
const LIMIT = 5;

const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 << 20 });
const version = html => (html.match(/<meta name="cm-kit" content="([^"]+)">/) || [])[1] || '?';

// The released pages, in the layout they had under kit/.
const files = git('ls-tree', '-r', '--name-only', ref, 'kit/').split('\n')
  .filter(f => (f.endsWith('.html') && !f.startsWith('kit/report-kit/')) || /^kit\/report-kit\/template[^/]*\.html$/.test(f));
if (!files.length) { console.error(`no kit pages at ${ref}`); process.exit(2); }
const tmp = mkdtempSync(path.join(tmpdir(), 'cm-migration-'));
mkdirSync(path.join(tmp, 'report-kit'));
for (const f of ['cm-report.css', 'cm-report.js']) cpSync(path.join(ROOT, 'kit', 'report-kit', f), path.join(tmp, 'report-kit', f));
const placed = files.map(f => {
  const to = path.join(tmp, f.replace(/^kit\//, ''));
  writeFileSync(to, git('show', `${ref}:${f}`));
  return { file: f, at: to, name: path.basename(f), template: f.startsWith('kit/report-kit/') };
});
const from = version(readFileSync(placed.find(p => p.name === 'template.html')?.at || placed[0].at, 'utf8'));
const to = version(readFileSync(path.join(ROOT, 'kit', 'report-kit', 'template.html'), 'utf8'));

// One run of the checks: { check → { level, source, findings: [{ page, mode, where, value }] } }.
function check(pages) {
  const r = spawnSync(process.execPath, [path.join(ROOT, 'checks', 'run.mjs'), ...pages, '--all'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 << 20 });
  if (r.status === 2 || r.error) throw new Error(`checks/run.mjs: ${r.stderr || r.error}`);
  const out = new Map();
  let cur = null;
  for (const line of r.stdout.split('\n')) {
    const m = line.match(/^(ok|FAIL|warn|skip)\s+(.+?\.html)  (\S+)\s+(\S+)  \((.*)\)$/);
    if (m) {
      const [, status, page, mode, name, source] = m;
      cur = status === 'FAIL' || status === 'warn' ? { page, mode, name } : null;
      if (cur && !out.has(name)) out.set(name, { level: status, source, findings: [] });
      continue;
    }
    if (cur && /^ {8}\S/.test(line)) {
      const body = line.slice(8), cut = body.indexOf('  ');
      out.get(cur.name).findings.push({ page: cur.page, mode: cur.mode, where: cut < 0 ? body : body.slice(0, cut), value: cut < 0 ? '' : body.slice(cut + 2) });
    }
  }
  return out;
}

const found = check(placed.map(p => p.at));
// This tree's templates, for the placeholder findings they share with the released ones.
const current = placed.filter(p => p.template).map(p => path.join(ROOT, p.file));
const own = current.length ? check(current) : new Map();
// Values compare with their numbers taken out, since a placeholder's word count differs between the
// two templates.
const bare = v => v.replace(/\d+(\.\d+)?/g, '#');
const shared = (name, f) => placed.find(p => p.name === f.page)?.template
  && (own.get(name)?.findings || []).some(o => o.page === f.page && bare(o.value) === bare(f.value));

const changes = [], placeholders = [];
for (const [name, c] of found) {
  const real = c.findings.filter(f => !shared(name, f));
  const held = c.findings.filter(f => shared(name, f));
  if (real.length) changes.push({ name, ...c, findings: real });
  if (held.length) placeholders.push({ name, ...c, findings: held });
}
const order = (a, b) => (a.level === b.level ? 0 : a.level === 'FAIL' ? -1 : 1);
changes.sort(order);

// One line per page and finding value: how many elements return it, in which modes, and the first
// element's path.
const list = c => {
  const out = [];
  for (const page of [...new Set(c.findings.map(f => f.page))]) {
    const groups = new Map();
    for (const f of c.findings.filter(x => x.page === page)) {
      const g = groups.get(f.value) || { value: f.value, where: f.where, n: 0, modes: new Set() };
      g.n++;
      g.modes.add(f.mode);
      groups.set(f.value, g);
    }
    const rows = [...groups.values()];
    const shown = all ? rows : rows.slice(0, LIMIT);
    out.push(`      ${page}`);
    for (const g of shown) out.push(`        ${g.value || '(no value)'}  ×${g.n} (${[...g.modes].join(', ')})\n          at ${g.where}`);
    if (rows.length > shown.length) out.push(`        and ${rows.length - shown.length} more; --all lists every one`);
  }
  return out.join('\n');
};

console.log(`Migration from Report Kit ${from} (${ref}) to Report Kit ${to} (this tree)`);
console.log(`Pages: ${placed.map(p => p.file.replace(/^kit\//, '')).join(', ')}`);
console.log(`Checks that fail or warn: ${changes.length}\n`);
for (const c of changes) {
  const pages = [...new Set(c.findings.map(f => f.page))];
  console.log(`${c.level.padEnd(4)}  ${c.name}  (${c.source})  ${c.findings.length} finding${c.findings.length === 1 ? '' : 's'} on ${pages.join(', ')}`);
  console.log(list(c));
}
if (placeholders.length) {
  console.log(`\nTemplate placeholders, returned by this tree's template too: ${placeholders.map(c => c.name).join(', ')}`);
}
rmSync(tmp, { recursive: true, force: true });
