// The design bundle's cover, components/Cover/preview.html: the kit's colours as blocks, its chip as
// the pattern, and the name. Every fill and radius is a class bound to a token of tokens.json, so
// the cover follows the theme the page shows it in. Used by tools/bundle.mjs.

const USED = ['cm-ink', 'cm-paper', 'cm-accent', 'cm-field', 'cm-ok', 'cm-note', 'cm-r-card', 'block-24', 'block-40', 'inset-8', 'inset-10', 'inset-16'];

// Pills in rows on the ink slab, each [width, offset colour or null]; a row fills the slab's inner
// width (192px) with inset-8 gaps, and the rows sit block-24 inside the slab, block-40 apart.
const ROWS = [
  [[72, 'ok'], [56, null], [48, null]],
  [[96, null], [88, 'note']],
  [[48, null], [64, null], [64, 'ok']],
  [[120, 'note'], [64, null]],
  [[56, null], [64, null], [56, null]],
];

export function cover({ tokens, readme }) {
  const names = new Set([...tokens.color.tokens, ...tokens.radius.tokens, ...tokens.spacing.tokens].map(t => t.name));
  const missing = USED.filter(n => !names.has(n));
  if (missing.length) throw new Error(`the cover uses tokens tokens.json lacks: ${missing.join(', ')}`);
  const first = readme.split('\n')[0];
  const lead = first.slice(0, first.indexOf(':')).replace(/^Content Morphia publishes /, '');
  const tagline = `${lead[0].toUpperCase()}${lead.slice(1)}.`;

  const pills = [];
  ROWS.forEach((row, r) => {
    let x = 104;
    const y = 40 + r * 40;
    for (const [w, offset] of row) {
      if (offset) pills.push(`<rect class="${offset} pill" x="${x + 3}" y="${y + 3}" width="${w}" height="20"/>`);
      pills.push(`<rect class="paper pill" x="${x}" y="${y}" width="${w}" height="20"/>`);
      x += w + 8;
    }
  });

  return `<!-- @dsCard height=288 -->
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Content Morphia</title>
<style>
  html, body { margin:0; }
  body { overflow:hidden; }
  .cover { position:relative; width:960px; height:288px; overflow:hidden; background:var(--cm-paper); color:var(--cm-ink); font-family:var(--font-text); }
  .art { position:absolute; top:0; left:480px; width:480px; height:288px; }
  .art svg { display:block; }
  .ink { fill:var(--cm-ink); }
  .accent { fill:var(--cm-accent); }
  .field { fill:var(--cm-field); }
  .paper { fill:var(--cm-paper); }
  .ok { fill:var(--cm-ok); }
  .note { fill:var(--cm-note); }
  .slab { rx:var(--cm-r-card); }
  /* a 20px chip: rx is half its height */
  .pill { rx:var(--inset-10); }
  .words { position:absolute; left:var(--block-40); bottom:var(--block-40); max-width:440px; }
  .name { margin:0; font-size:96px; line-height:.95; font-weight:900; letter-spacing:-.01em; }
  .tag { margin:var(--inset-16) 0 0; font-size:14px; line-height:20px; font-weight:400; }
</style>
</head>
<body>
<div class="cover">
<div class="art" aria-hidden="true">
<svg viewBox="0 0 480 288" width="480" height="288">
<!--
  blocks      cm-ink 240x224 slab; cm-accent 240x224 behind it; cm-field 112x160 bled off the top and right edges
  arrangement one slab with its hard offset shadow, as cm-l2 offsets the featured card, offset one block-24 step down and right
  pattern     the chip: a 20px pill with its status colour offset (cm-ok, cm-note), because status colour is a chip offset (rule 8)
  scales      block-24 offset and slab inset, block-40 row pitch, inset-8 gaps, cm-r-card on the slabs, pills rx inset-10 (half of 20)
-->
<rect class="field slab" x="368" y="-14" width="126" height="174"/>
<rect class="accent slab" x="104" y="40" width="240" height="224"/>
<rect class="ink slab" x="80" y="16" width="240" height="224"/>
${pills.join('\n')}
</svg>
</div>
<div class="words">
<h1 class="name">Content<br>Morphia</h1>
<p class="tag">${tagline}</p>
</div>
</div>
</body>
</html>
`;
}
