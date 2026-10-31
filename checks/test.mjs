// The checks' own tests: a page that passes every check, and copies of it each broken in one way,
// which must fail the one check that guards that rule and no other.
//
// Usage:  npm test
//
// The sample report is the passing page. Each case writes its copy to a temporary folder beside this
// tree's report-kit/ stylesheet and script, runs checks/run.mjs on every page at once, and compares
// the checks each page fails with the checks the case expects.
//
//   sample report   no check fails
//   no cm-id        the cm-id tag removed: head-order fails, naming the missing tag (SPEC §2; §7)
//   wrapped claim   one key finding's claim and evidence wrapped in a <div>: claim-wrapper fails
//                   (SPEC §8.3)

import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SAMPLE = path.join(ROOT, 'kit', 'Sample Report - Q3 Support Review.html');
const sample = readFileSync(SAMPLE, 'utf8');

// Each case: a file name, the page's text, the checks it must fail, and a finding one of them must
// report.
function edit(text, from, to) {
  if (!from.test(text)) throw new Error(`the sample report has no ${from}`);
  return text.replace(from, to);
}
const CASES = [
  { file: 'sample.html', html: sample, fails: [] },
  {
    file: 'no-cm-id.html',
    html: edit(sample, /<meta name="cm-id" content="[^"]*">\n?/, ''),
    fails: ['head-order'],
    finding: 'missing: <meta name="cm-id">',
  },
  {
    file: 'wrapped-claim.html',
    html: edit(sample, /(<ol class="cm-findings">\s*<li>)([\s\S]*?)(<\/li>)/, '$1<div>$2</div>$3'),
    fails: ['claim-wrapper'],
    finding: 'the claim line sits in a <div>',
  },
];

const tmp = mkdtempSync(path.join(tmpdir(), 'cm-test-'));
mkdirSync(path.join(tmp, 'report-kit'));
for (const f of ['cm-report.css', 'cm-report.js']) cpSync(path.join(ROOT, 'kit', 'report-kit', f), path.join(tmp, 'report-kit', f));
for (const c of CASES) writeFileSync(path.join(tmp, c.file), c.html);

const r = spawnSync(process.execPath, [path.join(ROOT, 'checks', 'run.mjs'), ...CASES.map(c => path.join(tmp, c.file)), '--all'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 << 20 });
rmSync(tmp, { recursive: true, force: true });
if (r.status === 2 || r.error) { console.error(r.stderr || r.error); process.exit(2); }

// The checks each page fails, with their findings.
const failed = new Map(CASES.map(c => [c.file, new Map()]));
let cur = null;
for (const line of r.stdout.split('\n')) {
  const m = line.match(/^(ok|FAIL|warn|skip)\s+(\S+\.html)  \S+\s+(\S+)  \(/);
  if (m) {
    cur = m[1] === 'FAIL' ? { page: m[2], check: m[3] } : null;
    if (cur) failed.get(cur.page).set(cur.check, failed.get(cur.page).get(cur.check) || []);
    continue;
  }
  if (cur && /^ {8}\S/.test(line)) failed.get(cur.page).get(cur.check).push(line.trim());
}

let bad = 0;
for (const c of CASES) {
  const got = [...failed.get(c.file).keys()].sort();
  const want = [...c.fails].sort();
  const problems = [];
  if (got.join() !== want.join()) problems.push(`fails ${got.join(', ') || 'nothing'}; expected ${want.join(', ') || 'nothing'}`);
  if (c.finding && !c.fails.some(k => (failed.get(c.file).get(k) || []).some(f => f.includes(c.finding)))) problems.push(`no finding "${c.finding}"`);
  console.log(`${problems.length ? 'FAIL' : 'ok  '}  ${c.file}${problems.length ? `\n        ${problems.join('\n        ')}` : ''}`);
  if (problems.length) bad++;
}
process.exit(bad ? 1 : 0);
