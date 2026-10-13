/* content-morphia mechanical sweep.
   Applies the R36 rule set to a page source. Returns { src, log }.
   What it CANNOT do safely is listed at the bottom and must be hand-fixed per page:
   black reading surfaces, one-sided fences, label-on-heading rows, container rhythm.
   Usage: eval(await readFile('sweep.js')); const {src, log} = sweepPage(await readFile(p)); */

function sweepPage(input) {  // requires dc-inherit.js in scope
  let s = input;
  const L = [];
  const rep = (a, b, name) => { const c = s.split(a).length - 1; if (c) { s = s.split(a).join(b); L.push(`${name} ×${c}`); } return c; };

  /* 1. mono LABEL: 12px / 600 / caps / ls .02em (R36.1).
        Resolved through the element tree, because a label can inherit
        font-family from an ancestor and never name it in its own style. */
  const fixes = monoLabelFixes(s);
  let lbl = 0;
  for (const [a, b] of fixes) { const c = s.split(a).length - 1; if (c) { s = s.split(a).join(b); lbl += c; } }
  if (lbl) L.push(`mono labels ×${lbl}`);

  /* 2. headings (R36.2): T3 21/800, T3b 17/700, h3 bottom margin 18 */
  rep("font-family:'Nunito',sans-serif;font-size:15px;font-weight:700;line-height:1.4", "font-family:'Nunito',sans-serif;font-size:21px;font-weight:800;line-height:1.3;letter-spacing:-.01em", 'T3');
  rep("font-family:'Nunito',sans-serif;font-size:16px;font-weight:700;line-height:1.4", "font-family:'Nunito',sans-serif;font-size:21px;font-weight:800;line-height:1.3;letter-spacing:-.01em", 'T3 (16px)');
  for (const m of ['10px', '12px', '14px', '16px']) rep(`margin:0 0 ${m};font-family:'Nunito'`, "margin:0 0 18px;font-family:'Nunito'", 'h3 margin');
  rep('font-weight:800;font-size:16px;line-height:1.4', 'font-weight:800;font-size:21px;line-height:1.3;letter-spacing:-.01em', 'inline card title');

  /* 3. corner-bracket sub-block titles -> Nunito 700/17 (R35.4) */
  let cb = 0;
  s = s.replace(/(border-top:2px solid #000"><\/(?:span|div)>\s*<div style=")font-family:'JetBrains Mono',monospace;font-size:1[02]px;font-weight:(?:600|700);letter-spacing:\.\d+em;text-transform:uppercase;margin-bottom:1[02]px(")/g,
    (m, a, b) => { cb++; return a + "font-family:'Nunito',sans-serif;font-size:17px;font-weight:700;line-height:1.3;margin-bottom:12px" + b; });
  if (cb) L.push(`corner-bracket titles ×${cb}`);

  /* 4. grey retired as a surface (R36.5, R12.4, R35.3) */
  let gh = 0;
  s = s.replace(/style-hover="([^"]*)"/g, (m, st) => {
    if (!/background:#f1f1f1|background:#fafafa/.test(st)) return m;
    gh++; return 'style-hover="' + st.replace(/background:#(f1f1f1|fafafa)/, 'background:rgba(29,233,182,.12)') + '"';
  });
  if (gh) L.push(`grey hovers ×${gh}`);
  let th = 0;
  s = s.replace(/style="([^"]*)"/g, (m, st) => {
    if (!st.includes('grid-template-columns')) return m;
    let o = st;
    if (/background:#f1f1f1/.test(o)) { o = o.replace(/background:#f1f1f1;?/, ''); o = o.replace(/border-bottom:1px solid #ebebeb/, 'border-bottom:1.5px solid #000'); if (!o.includes('border-bottom')) o += ';border-bottom:1.5px solid #000'; th++; }
    else if (/background:#fafafa/.test(o)) { o = o.replace(/background:#fafafa;?/, ''); o += ';border-top:1px solid #ebebeb'; th++; }
    return o === st ? m : 'style="' + o + '"';
  });
  if (th) L.push(`grey table rows ×${th}`);
  rep('background:#f1f1f1;border-radius:999px;padding:7px 14px', 'background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.06);border-radius:999px;padding:7px 14px', 'grey nodes');
  rep('border-radius:999px;background:#f1f1f1;white-space:nowrap', 'border-radius:999px;border:1px solid #000;background:#fff;white-space:nowrap', 'grey pills');

  /* 5. black-filled status chips -> neutral chip (R7c) */
  let bc = 0;
  s = s.replace(/style="([^"]*)"/g, (m, st) => {
    if (!/background:#000/.test(st) || !/color:#fff/.test(st)) return m;
    if (!/border-radius:(999px|4px|6px)/.test(st) || !st.includes('text-transform:uppercase')) return m;
    bc++; return 'style="' + st.replace('background:#000;color:#fff', 'background:#fff;border:1px solid #000') + '"';
  });
  if (bc) L.push(`black chips ×${bc}`);
  const bf = blackFillFixes(s);
  let bfn = 0;
  for (const [a, b] of bf.fixes) { const c = s.split(a).length - 1; if (c) { s = s.split(a).join(b); bfn += c; } }
  if (bfn) L.push(`black mono chips ×${bfn}`);
  if (bf.flags.length) L.push(`HAND: ${bf.flags.length} black mono surfaces`);

  /* 6. tables lose the outline (R36.8) */
  rep('border:1px solid #ebebeb;border-radius:12px;overflow:hidden', 'box-shadow:0 1px 2px rgba(0,0,0,.06);border-radius:12px;overflow:hidden', 'table outline');

  /* 7. breathing floors (R10) */
  rep('border-radius:14px;padding:24px', 'border-radius:14px;padding:28px', 'pad 24');
  rep('border-radius:14px;padding:20px', 'border-radius:14px;padding:28px', 'pad 20');
  rep('border-radius:14px;padding:22px', 'border-radius:14px;padding:28px', 'pad 22');
  // 26 retired: a primary container (S2/S3) takes 32, everything else 28
  let p26 = 0;
  s = s.replace(/style="([^"]*border-radius:14px;padding:26px[^"]*)"/g, (m, st) => {
    p26++; const primary = /box-shadow:0 (4px 14px|14px 28px)/.test(st);
    return 'style="' + st.replace('padding:26px', 'padding:' + (primary ? 32 : 28) + 'px') + '"';
  });
  if (p26) L.push(`pad 26→${'28/32'} ×${p26}`);
  rep('gap:16px;margin-top:28px', 'gap:20px;margin-top:28px', 'grid gap');
  for (const g of ['6px', '7px', '8px', '9px']) rep(`flex-direction:column;gap:${g}`, 'flex-direction:column;gap:12px', 'col gap');
  for (const g of ['10px', '11px']) rep(`flex-direction:column;gap:${g}`, 'flex-direction:column;gap:14px', 'col gap b');
  rep('padding:14px 14px', 'padding:3px 9px', 'chip padding');
  rep('line-height:1.65', 'line-height:1.75', 'lh');
  rep('line-height:1.55', 'line-height:1.7', 'lh b');
  s = s.replace(/line-height:1\.6(?![0-9])/g, 'line-height:1.75');
  s = s.replace(/(font-size:1[45](\.5)?px[^"]*?)line-height:1\.5(?![0-9])/g, '$1line-height:1.7');

  /* 8. em dash out of page copy (R36.9).
        A tail that itself contains a comma is a list, so it takes a colon;
        a tail opening with a qualifier takes a comma; otherwise a colon. */
  const QUAL = /^(never|not|confirmed|quiet|trailing|completed|plus|and|so|then|without|with|from|unless|one|the one|a |an )/i;
  let dash = 0;
  s = s.replace(/ — ([^<.;:—]*)/g, (m, tail) => {
    dash++;
    const isList = /,/.test(tail);
    return (!isList && QUAL.test(tail) ? ', ' : ': ') + tail;
  });
  if (dash) L.push(`em dashes ×${dash}`);
  // a bare dash standing in for missing data is not a punctuation mark, it is a value
  const bare = s.split('>—<').length - 1;
  if (bare) { s = s.split('>—<').join('>n/a<'); L.push(`no-data dashes ×${bare}`); }

  /* 9. full-sentence bold -> lead-in only (R30.7) */
  let sb = 0;
  s = s.replace(/(<span style="font-weight:700">)([^<]{45,}?)(<\/span>)/g, (m, a, txt, c) => {
    if (!/[.!?]\s*$/.test(txt) || txt.split(' ').length < 8) return m;
    const cut = txt.indexOf(': ') >= 0 ? txt.indexOf(': ') + 1 : (txt.indexOf(', ') >= 0 ? txt.indexOf(', ') + 1 : -1);
    if (cut < 0) { sb++; return '<span style="font-weight:400">' + txt + c; }
    sb++;
    return '<span style="font-weight:400">' + a + txt.slice(0, cut) + c + txt.slice(cut) + c;
  });
  if (sb) L.push(`sentence bold ×${sb}`);

  return { src: s, log: L };
}
