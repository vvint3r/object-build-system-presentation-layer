/* content-morphia rule checker.
   Scans a .dc.html source for CLASSES of violation, not known literals.
   Usage inside run_script:
     eval(await readFile('lint.js'));
     const v = lintPage(name, await readFile(name));
   Every check names the CLAUDE.md rule it enforces. Ship-blocking checks are marked block:true.
   NOTE: this environment floors font-size at 12px (R36.1) — sizes below 12 are unreachable,
   so a "smaller" label must come from weight and tracking. Checks assert the painted reality. */

function lintPage(name, src) {
  const out = [];
  const add = (rule, block, msg, sample) => out.push({ rule, block, msg, sample: (sample || '').slice(0, 110) });

  // strip the shared nav/helmet so shell chrome is not double-counted per page
  const bodyStart = src.indexOf('<section');
  const s = bodyStart > 0 ? src.slice(bodyStart) : src;  // skip the shared nav shell

  const attrs = [...s.matchAll(/style="([^"]*)"/g)].map(m => m[1]);
  const lines = s.split('\n');
  const has = (a, ...k) => k.every(x => a.includes(x));
  const num = (a, prop) => { const m = a.match(new RegExp(prop + ':(-?[\\d.]+)px')); return m ? parseFloat(m[1]) : null; };
  const count = (pred) => attrs.filter(pred);

  /* ---- 1. mono labels, resolved through the tree (R36.1) ---- */
  const badLabel = [...monoLabelFixes(src).keys()];
  if (badLabel.length) add('R36.1', true, `${badLabel.length} mono caps label styles off spec (want 12px/600/ls .02em)`, badLabel[0]);

  /* ---- 2. a heading may never be smaller than the body it introduces (R36.2) ---- */
  const smallHead = count(a => has(a, "font-family:'Nunito'") && num(a, 'font-size') !== null && num(a, 'font-size') < 17 && /font-weight:(700|800|900)/.test(a));
  if (smallHead.length) add('R36.2', true, `${smallHead.length} Nunito headings under 17px`, smallHead[0]);
  const monoHead = [...s.matchAll(/<h[1-6][^>]*style="([^"]*)"/g)].map(m => m[1]).filter(a => a.includes('JetBrains'));
  if (monoHead.length) add('R19.2', true, `${monoHead.length} headings set in mono`, monoHead[0]);

  /* ---- 3. identity label sharing a line with its heading (R36.3) ---- */
  const inline = lines.filter(l => /text-transform:uppercase/.test(l) && !/<h2/.test(l) && /<(h[1-6]|span|div)[^>]*font-weight:800;font-size:21px/.test(l));
  if (inline.length) add('R36.3', false, `${inline.length} rows put a label on the heading's own line`, inline[0].trim());

  /* ---- 4. black fill outside the ration (R7c), resolved through the tree ---- */
  const bf = blackFillFixes(src);
  if (bf.fixes.size) add('R7c', true, `${bf.fixes.size} black-filled mono chips (want the white hairline chip)`, [...bf.fixes.keys()][0]);
  if (bf.flags.length) add('R7c', true, `${bf.flags.length} black-filled mono reading surfaces`, bf.flags[0]);

  /* ---- 4b. reserved teal offset never on a chart surface (R23.8) ---- */
  const l2 = l2Conflicts(src);
  for (const c of l2.conflicts) add('R23.8', true, `reserved teal offset on a surface carrying ${c.n} accent data marks`, c.sample);
  if (l2.count > 1) add('R5', false, `${l2.count} reserved teal offsets in one view (at most one untagged)`, '');

  /* ---- 5. grey as a surface (R36.5 / R12.4) ---- */
  const greyFill = count(a => /background:#f1f1f1/.test(a) && !/^height:\d+px;background:#f1f1f1;border-radius:\d+px$/.test(a) &&
    !/height:([2-9]|10)px/.test(a) && !/aspect-ratio/.test(a) && !/cursor:not-allowed/.test(a) &&
    !/width:1[0-8]px/.test(a) && !/border-radius:999px;overflow:hidden/.test(a) && !/inline-flex[^;]*;gap:4px|padding:4px/.test(a) &&
    !/^display:block;padding:8px 12px;border-radius:999px/.test(a) &&                 // rule 17 current-page pill
    !(/height:\d+px/.test(a) && !/font-size|padding/.test(a)));                        // bare swatch, bar or placeholder block
  if (greyFill.length) add('R36.5', true, `${greyFill.length} grey fills outside track/placeholder use`, greyFill[0]);
  const greyHover = [...s.matchAll(/style-hover="([^"]*)"/g)].map(m => m[1]).filter(a => /background:#f1f1f1|background:#fafafa/.test(a));
  if (greyHover.length) add('R36.5', false, `${greyHover.length} grey hover washes (want rgba(29,233,182,.12))`, greyHover[0]);

  /* ---- 6. one-sided fence on a container (R36.4) ---- */
  const fence = count(a => /border-(left|top):[\d.]+px solid (#1de9b6|#40c4ff|#000|rgba)/.test(a) && !/border-bottom|border-right/.test(a) && /padding/.test(a) && !/border-top:1(\.5)?px solid #ebebeb/.test(a) && !/border-radius:999px/.test(a));
  if (fence.length) add('R36.4', false, `${fence.length} containers fenced on one side`, fence[0]);

  /* ---- 7. tables: no outline, no grey header, no zebra (R36.8 / R35.3) ---- */
  const tblOutline = count(a => /border:1(\.5)?px solid #ebebeb/.test(a) && /border-radius:12px/.test(a) && /overflow:hidden/.test(a));
  if (tblOutline.length) add('R36.8', false, `${tblOutline.length} outlined table surfaces`, tblOutline[0]);
  const tblHead = count(a => /background:#f1f1f1/.test(a) && /grid-template-columns/.test(a));
  if (tblHead.length) add('R36.8', true, `${tblHead.length} grey table header rows`, tblHead[0]);
  const zebra = count(a => /background:#fafafa/.test(a) && /grid-template-columns/.test(a));
  if (zebra.length) add('R35.3', true, `${zebra.length} zebra rows`, zebra[0]);

  /* ---- 7b. positive half of the table rule (R36.8) ---- */
  for (const t of tableRowIssues(src)) add('R36.8', true, `${t.n} ${t.kind}`, t.sample);

  /* ---- 8. breathing floors (R36.2 / rule 10) ---- */
  const pad = count(a => /border-radius:14px;padding:(1\d|2[0-5])px(?![\d ])/.test(a) && !/align-items:center/.test(a));
  if (pad.length) add('R10', false, `${pad.length} containers padded under 28px`, pad[0]);
  const colGap = count(a => /flex-direction:column;gap:([5-9]|1[01])px/.test(a));
  if (colGap.length) add('R10', false, `${colGap.length} column stacks with gaps under 12px`, colGap[0]);
  const lh = count(a => /line-height:1\.[0-6](?![0-9])/.test(a) && /font-size:1[4-9]|font-size:15\.5/.test(a) && !/font-weight:(700|800|900)/.test(a) && !/JetBrains/.test(a));  // mono blocks set their own leading
  if (lh.length) add('R10', false, `${lh.length} body runs with line-height under 1.75`, lh[0]);
  const rowPad = count(a => /grid-template-columns/.test(a) === false && /padding:(\d|1[0-5])px (0|1[0-9]px)/.test(a) && /border-bottom:1px (dotted|solid)/.test(a));
  if (rowPad.length) add('R10', false, `${rowPad.length} divider rows with vertical padding under 16px`, rowPad[0]);

  /* ---- 9. radius scale (rule 8) ---- */
  const rad = count(a => /border-radius:(5|10)px/.test(a));
  if (rad.length) add('R8', true, `${rad.length} illegal 5px/10px radii`, rad[0]);

  /* ---- 10. chip padding from the structural scale (rule 9) ---- */
  const chipPad = count(a => /border-radius:(4|6|999)px/.test(a) && /padding:(1[2-9]|2\d)px (1[2-9]|2\d)px/.test(a) && /font-size:12px/.test(a));
  if (chipPad.length) add('R9', false, `${chipPad.length} chips padded off the component scale`, chipPad[0]);

  /* ---- 11. em dash in page copy (R36.9) ---- */
  const noScript = s.replace(/<script[\s\S]*?<\/script>/g, '');
  const dashText = [...noScript.matchAll(/>([^<]*—[^<]*)</g)].map(m => m[1]).filter(t => !/&mdash;/.test(t));
  if (dashText.length) add('R36.9', false, `${dashText.length} em dashes in rendered copy (spaced clause joiner or bare cell glyph)`, dashText[0].trim().slice(0, 60));

  /* ---- 12. full-sentence bold (R30.7 / rule 14d) ---- */
  const sentBold = [...s.matchAll(/font-weight:700[^"]*">([^<]{45,})</g)].map(m => m[1]).filter(t => /[.!?]\s*$/.test(t) && t.split(' ').length > 7);
  if (sentBold.length) add('R30.7', false, `${sentBold.length} whole sentences set at 700`, sentBold[0]);

  /* ---- 13. accent used as ink (rule 2) ---- */
  const accentInk = count(a => /(^|;)color:#1de9b6/.test(a));
  if (accentInk.length) add('R2', true, `${accentInk.length} runs of accent-coloured text`, accentInk[0]);
  const greyInk = count(a => /(^|;)color:#(?!fff|000|1de9b6)[0-9a-f]{3,6}/.test(a) && !/#6a3ea1|#0e7a5f|#a3441a/.test(a));
  if (greyInk.length) add('R1', true, `${greyInk.length} runs of non-black/white ink`, greyInk[0]);

  /* ---- 14. T2 must outrank T3 (R36.2) ---- */
  const tiers = headingTiers(src);
  if (tiers.h2max && tiers.h3max && tiers.h2max <= tiers.h3max)
    add('R36.2', true, `section title ${tiers.h2max}px does not outrank container heading ${tiers.h3max}px`, '');

  /* ---- 15. no scroll-spy bar in a section list (R28.1) ---- */
  const spy = count(a => /width:[23](\.5)?px/.test(a) && /height:1\dpx/.test(a) && /background:#1de9b6/.test(a));
  if (spy.length) add('R28.1', false, `${spy.length} scroll-spy bars in a section list`, spy[0]);

  /* ---- 16. section-list chrome: rail limits (R16) vs strip form (R17b) ---- */
  if (/id="page-toc"/.test(s)) {
    const rail = (src.match(/id="page-toc" style="([^"]*)"/) || [])[1] || '';
    if (!/max-height/.test(rail) || !/overflow/.test(rail)) add('R16', false, 'sticky rail without the \u226460vh internal-scroll limit', rail.slice(0, 80));
    // the cap belongs to the sticky state: the release must drop it, or it traps page content mid-flow
    const rel = (src.match(/#page-toc\{[^}]*\}/) || [''])[0];
    if (/max-height/.test(rail) && !(/max-height:none/.test(rel) && /overflow:visible/.test(rel)))
      add('R16', true, 'released rail keeps the 60vh cap and internal scroll', rel.slice(0, 90) || 'no release rule');
  }

  return { page: name, violations: out, blocking: out.filter(v => v.block).length };
}

function lintReport(results) {
  const rows = results.map(r => ({
    page: r.page.replace('content-morphia ', '').replace('.dc.html', ''),
    blocking: r.blocking,
    total: r.violations.length,
    rules: r.violations.map(v => v.rule).join(' ')
  })).sort((a, b) => b.blocking - a.blocking || b.total - a.total);
  return rows;
}
