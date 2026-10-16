// Figures: the anatomy every figure carries, and numbering across the report. Read on the page as
// written.

export default [
  {
    // Kind label "Figure N", title, description, the chart (or an image with alt text, or a
    // .cm-slot where material is missing), and a caption with "Source:".
    name: 'figure-anatomy', level: 'fail', source: 'SPEC §8.10; §9; §14 item 5', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const f of H.source().querySelectorAll('figure.cm-figure')) {
        if (H.exempt(f, check)) continue;
        const kind = f.querySelector('.cm-figure__kind');
        if (!kind) out.push({ where: H.path(f), value: 'no .cm-figure__kind' });
        else if (!/^Figure \d+$/.test(H.text(kind))) out.push({ where: H.path(kind), value: `kind "${H.text(kind)}" (Figure N)` });
        if (!f.querySelector('.cm-figure__title') || !H.text(f.querySelector('.cm-figure__title'))) out.push({ where: H.path(f), value: 'no .cm-figure__title' });
        if (!f.querySelector('.cm-figure__desc') || !H.text(f.querySelector('.cm-figure__desc'))) out.push({ where: H.path(f), value: 'no .cm-figure__desc' });
        const img = f.querySelector('img');
        if (img && !(img.getAttribute('alt') || '').trim()) out.push({ where: H.path(img), value: 'image with no alt text' });
        if (!f.querySelector('.cm-chart, img, .cm-slot')) out.push({ where: H.path(f), value: 'no .cm-chart, image or .cm-slot' });
        const cap = f.querySelector('figcaption.cm-caption');
        if (!cap) out.push({ where: H.path(f), value: 'no figcaption.cm-caption' });
        else if (![...cap.querySelectorAll('b, strong')].some(b => /^Source:$/.test(H.text(b)))) out.push({ where: H.path(cap), value: 'caption has no <b>Source:</b>' });
      }
      return out;
    },
  },

  {
    // Numbered 1, 2, 3 in order of appearance across the whole report.
    name: 'figure-numbers', level: 'fail', source: 'SPEC §8.10; §14 item 5', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      let expected = 1;
      for (const k of H.source().querySelectorAll('figure.cm-figure .cm-figure__kind')) {
        if (H.exempt(k, check)) continue;
        const m = H.text(k).match(/^Figure (\d+)$/);
        if (!m) continue;
        if (Number(m[1]) !== expected) out.push({ where: H.path(k), value: `"${H.text(k)}" where Figure ${expected} comes next` });
        expected = Number(m[1]) + 1;
      }
      return out;
    },
  },
];
