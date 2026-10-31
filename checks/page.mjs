// In-page helpers shared by every check. install() runs inside the page (page.evaluate) and puts
// the helpers on window.__cm, so each check's in-page function can use them. It must stay
// self-contained: nothing outside this function exists in the page.
//
// cfg carries what the page cannot know by itself: the exempt regions for this page, the class
// names the kit defines, the kit files themselves, and the page as written. Scripts change the live
// document (the kit removes chart JSON and wraps sortable headers, the chart library writes inline
// styles), so checks on authored markup read H.source(), a parsed copy of the file.

export function install(cfg) {
  const H = { cfg };

  // A short CSS path: from the nearest ancestor with an id, tag plus up to two classes per step,
  // with :nth-of-type where siblings share the tag.
  H.path = el => {
    const parts = [];
    for (let n = el; n && n.nodeType === 1 && n !== n.ownerDocument.documentElement; n = n.parentElement) {
      let part = n.localName;
      if (n.id && parts.length) { parts.unshift(`${part}#${n.id}`); break; }
      if (n.id) part += `#${n.id}`;
      const cls = [...n.classList].slice(0, 2);
      if (cls.length) part += '.' + cls.join('.');
      const same = n.parentElement ? [...n.parentElement.children].filter(c => c.localName === n.localName) : [];
      if (same.length > 1 && !n.id) part += `:nth-of-type(${same.indexOf(n) + 1})`;
      parts.unshift(part);
      if (n.id) break;
    }
    return parts.join(' > ');
  };
  H.where = (el, pseudo) => H.path(el) + (pseudo || '');

  // Exempt regions apply to the checks they name, or to every check with '*' (checks/exempt.mjs).
  // A region with `outside` covers only what is not inside that selector.
  H.exempt = (el, check) => cfg.exempt.some(x => x.selector && (x.checks.includes('*') || x.checks.includes(check))
    && el.closest(x.selector) && !(x.outside && el.closest(x.outside)));

  // Chart internals are drawn by the chart library, not authored; the container itself is checked.
  H.inChart = el => !!(el.parentElement && el.parentElement.closest('.cm-chart, [data-spark]'));
  H.ignored = el => H.inChart(el) || !!el.closest('head, script, style, template, noscript, svg');
  H.elements = () => [...document.body.querySelectorAll('*')].filter(el => !H.ignored(el));

  // Rendered in this mode: no display:none on the element or an ancestor, and not hidden.
  H.shown = el => {
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) if (getComputedStyle(n).display === 'none') return false;
    return getComputedStyle(el).visibility !== 'hidden';
  };

  H.ownText = el => [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.nodeValue).join('').trim();
  H.text = el => (el.textContent || '').replace(/\s+/g, ' ').trim();

  // A pseudo-element carries text when its content is a non-empty string, a counter or an attr().
  H.pseudoText = (el, pseudo) => {
    const c = getComputedStyle(el, pseudo).content;
    if (!c || c === 'none' || c === 'normal') return '';
    return /"[^"]+"|counter|attr\(/.test(c) ? c : '';
  };
  H.pseudoDrawn = (el, pseudo) => {
    const c = getComputedStyle(el, pseudo).content;
    return !!c && c !== 'none' && c !== 'normal';
  };

  // Everything that renders text in this mode: shown elements with a direct text node, and
  // ::before / ::after with text content. Visually hidden text (.cm-sr) is left out.
  H.textItems = () => {
    const out = [];
    for (const el of H.elements()) {
      if (!H.shown(el) || el.closest('.cm-sr')) continue;
      if (H.ownText(el)) out.push({ el, pseudo: '', cs: getComputedStyle(el) });
      for (const p of ['::before', '::after']) if (H.pseudoText(el, p)) out.push({ el, pseudo: p, cs: getComputedStyle(el, p) });
    }
    return out;
  };

  // Text the chart library drew (axis labels, legends, series labels). It is SVG text: its colour is
  // the fill, and it is reported against the chart container.
  H.chartText = () => [...document.querySelectorAll('.cm-chart svg text, [data-spark] svg text')]
    .filter(t => t.textContent.trim() && H.shown(t))
    .map(t => ({ el: t, cs: getComputedStyle(t), where: `${H.path(t.closest('.cm-chart, [data-spark]'))} text "${t.textContent.trim().slice(0, 24)}"` }));

  // The label tier: 10px, weight 800, capitals, +0.08em; chips are the same at 9px. SPEC.md
  // section 4 names most of it; records 056 and 058 add the rest. The collapse toggle's "Open +" is
  // a label drawn by ::after.
  H.LABEL = '.cm-label, .cm-crumbs, .cm-mast__meta dt, .cm-byline dt, .cm-kpi__label, .cm-callout__label, '
    + '.cm-def__label, .cm-qa__label, .cm-props dt, .cm-status dt, .cm-quote footer b, .cm-figure__kind, .cm-slot b, '
    + '.cm-data>summary, .cm-table-title__kind, .cm-table th, .cm-toc a .n, .cm-step__n, .cm-chip, .cm-tag, .cm-delta, '
    + '.cm-diagram__edge-label, .cm-diagram__lane, .cm-diagram__boundary-label';
  // A property-sheet key's sub-label (<dt>Rule<small>(per ticket)</small></dt>, SPEC.md section 8.7)
  // is plain running text inside the label, not part of it. A table head's sort arrow is a glyph.
  H.isLabel = (el, pseudo) => (!!el.closest(H.LABEL) && !el.closest('.cm-props dt small')
      && !(pseudo && el.matches('.cm-table th button')))
    || (pseudo === '::after' && el.matches('.cm-collapse>summary'));

  // Any CSS colour to one canonical form (#rrggbb, or rgba(...) when not opaque).
  const ctx = document.createElement('canvas').getContext('2d');
  H.norm = c => { ctx.fillStyle = '#010203'; ctx.fillStyle = c; return ctx.fillStyle; };
  H.isColour = c => typeof c === 'string' && CSS.supports('color', c);
  H.rgba = c => {
    const n = H.norm(c);
    if (n[0] === '#') return [1, 3, 5].map(i => parseInt(n.slice(i, i + 2), 16)).concat(1);
    const m = n.match(/[\d.]+/g).map(Number);
    return [m[0], m[1], m[2], m.length > 3 ? m[3] : 1];
  };
  H.filled = c => H.rgba(c)[3] > 0;
  // Chromatic: visibly coloured rather than black, white or a grey.
  H.chromatic = c => { const [r, g, b, a] = H.rgba(c); return a > 0 && Math.max(r, g, b) - Math.min(r, g, b) > 12; };

  H.family = cs => (cs.fontFamily.split(',')[0] || '').trim().replace(/^["']|["']$/g, '');
  H.px = v => parseFloat(v) || 0;

  // Inline declarations as [property, value] pairs.
  H.decls = style => (style || '').split(';').map(d => d.trim()).filter(Boolean)
    .map(d => { const i = d.indexOf(':'); return [d.slice(0, i).trim().toLowerCase(), d.slice(i + 1).trim()]; });

  // The page as written, parsed once; its scripts do not run.
  let source;
  H.source = () => source || (source = new DOMParser().parseFromString(cfg.src, 'text/html'));

  // The page's kind, from <meta name="cm-kind"> in the page as written: report, guide or reference for
  // a document (SPEC.md section 7), index for a set's generated index page (section 8.25). A page
  // without the tag is a report; head-order fails a value outside the four, and the other checks then
  // read the page as a report.
  H.DOCUMENTS = ['report', 'guide', 'reference'];
  H.KINDS = [...H.DOCUMENTS, 'index'];
  H.kindMeta = () => [...H.source().querySelectorAll('meta[name="cm-kind"]')];
  H.kind = () => {
    const m = H.kindMeta()[0];
    const v = m ? (m.getAttribute('content') || '').trim() : 'report';
    return H.KINDS.includes(v) ? v : 'report';
  };

  // An omission comment inside root: <!-- cm-omit {name}: {reason} -->, with a reason after the
  // colon. A document marks a required block of its kind that it has no content for this way
  // (SPEC.md section 7.5); the checks for that block accept the comment in place of the block.
  H.omitted = (root, name) => {
    if (!root) return false;
    const re = new RegExp(`^\\s*cm-omit ${name}:\\s*\\S`);
    const walk = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) if (re.test(n.nodeValue)) return true;
    return false;
  };

  H.tokens = () => (window.CM && window.CM.tokens ? window.CM.tokens() : {});

  // Every chart as written, paired with the live container it became (same order in both).
  H.charts = () => {
    const live = [...document.querySelectorAll('.cm-chart')];
    return [...H.source().querySelectorAll('.cm-chart')].map((src, i) => {
      const script = src.querySelector('script[type="application/json"]');
      let json = null, error = script ? '' : 'no chart JSON';
      if (script) try { json = JSON.parse(script.textContent); } catch (e) { error = e.message; }
      return { src, live: live[i], json, error, where: H.path(src) };
    });
  };
  H.list = v => (Array.isArray(v) ? v : v ? [v] : []);

  window.__cm = H;
}
