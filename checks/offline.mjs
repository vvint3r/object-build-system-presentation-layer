// The offline packaging mode (SPEC §2): the page renders with no network at all. These run only on
// a page in that mode, which the loader opens with every request outside the file refused.

export default [
  {
    // Every request the page tried to make in this mode. The loader refused each one, so a request
    // here is something the page would miss without a network.
    name: 'offline-network', level: 'fail', source: 'SPEC §2', offline: true,
    run: ({ blocked }) => [...new Set(blocked)].map(u => ({ where: 'network', value: `request to ${u}` })),
  },

  {
    // The text is set in the kit's own faces, loaded from the file. Every face the template's font
    // link names is in the file; every one of them the page renders is loaded; a weight or style the
    // kit ships no face for (its 300 italic code comments) is drawn from a loaded face of that
    // family; no face failed; and the page's text family resolves to Nunito.
    name: 'offline-fonts', level: 'fail', source: 'SPEC §1 rule 5; §2', offline: true,
    inPage: () => {
      const H = window.__cm, out = [];
      const kitFaces = H.cfg.kit.offline.faces;
      const families = [...new Set(kitFaces.map(f => f.family))];
      const fam = f => f.family.replace(/["']/g, '');
      const faces = [...document.fonts].filter(f => families.includes(fam(f)));
      const find = (family, weight, style) => faces.find(f => fam(f) === family && f.weight === weight && f.style === style);
      const first = cs => cs.fontFamily.split(',')[0].trim().replace(/["']/g, '');
      if (first(getComputedStyle(document.body)) !== 'Nunito') out.push({ where: 'body', value: `font-family ${getComputedStyle(document.body).fontFamily}` });
      for (const k of kitFaces) if (!find(k.family, k.weight, k.style)) out.push({ where: 'document.fonts', value: `${k.family} ${k.weight} ${k.style} is not in the file` });
      for (const f of faces) if (f.status === 'error') out.push({ where: 'document.fonts', value: `${fam(f)} ${f.weight} ${f.style} failed to load` });
      const used = new Map();
      for (const el of [...document.body.querySelectorAll('*')]) {
        if (el.closest('script, style, template') || !H.shown(el) || !H.ownText(el)) continue;
        const cs = getComputedStyle(el);
        const family = first(cs);
        if (!families.includes(family)) continue;
        const style = cs.fontStyle === 'normal' ? 'normal' : 'italic';
        const key = `${family}|${cs.fontWeight}|${style}`;
        if (!used.has(key)) used.set(key, { family, weight: cs.fontWeight, style, el });
      }
      for (const u of used.values()) {
        const shipped = kitFaces.some(k => k.family === u.family && k.weight === u.weight && k.style === u.style);
        const face = find(u.family, u.weight, u.style);
        const loaded = shipped ? !!face && face.status === 'loaded' : faces.some(f => fam(f) === u.family && f.status === 'loaded');
        if (!loaded) out.push({ where: H.path(u.el), value: `${u.family} ${u.weight} ${u.style} is not loaded from the file` });
      }
      if (!faces.some(f => fam(f) === 'Nunito' && f.status === 'loaded')) out.push({ where: 'document.fonts', value: 'no Nunito face loaded' });
      return out;
    },
  },
];
