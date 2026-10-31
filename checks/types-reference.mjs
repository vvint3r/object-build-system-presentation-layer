// Page types on the reference kind: framework, process, metric and comparison (SPEC.md sections 7.10
// to 7.13). Read once, on the page as written. A page names its type with <meta name="cm-type"> in
// its head; each check here belongs to one type and finds nothing on a page of any other type. The
// kind's own parts (Definition, Properties, Relationships, Examples, Notes & sources) stay with the
// kind check (checks/kinds.mjs), and the components a type uses keep their own checks
// (checks/structured.mjs, checks/diagrams.mjs, checks/tables.mjs).
//
// A type's own parts are top-level sections with fixed ids, in the recipe's order, between the
// kind's Properties and the first of Relationships, Examples and Notes & sources. A template
// placeholder ({{ … }}) counts as present and matches anything.

function prepare() {
  if (window.__cmt) return;
  const H = window.__cm, d = H.source();
  const PH = /\{\{[\s\S]*?\}\}/;
  const ph = el => !!el && PH.test(el.textContent || '');
  const norm = s => (s || '').replace(/★/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
  const same = (a, b) => norm(a) === norm(b);

  const meta = d.querySelector('head meta[name="cm-type"]');
  const type = meta ? (meta.getAttribute('content') || '').trim() : '';
  const main = d.querySelector('main') || d.body;
  const sections = check => [...main.querySelectorAll('section.cm-section')]
    .filter(s => !H.exempt(s, check) && !s.parentElement.closest('section'));
  const body = s => (s ? s.querySelector(':scope > .cm-section__body') : null);
  const h1 = d.querySelector('h1.cm-mast__title');

  // The type's parts: present unless optional, in order, after Properties and before the kind's
  // closing parts. Returns the findings and the sections found, by id.
  const LATER = { relationships: 'Relationships', examples: 'Examples', sources: 'Notes & sources' };
  const place = (check, parts) => {
    const out = [], secs = sections(check), ids = secs.map(s => s.id), found = {};
    const props = ids.indexOf('properties');
    const later = ids.findIndex(i => i in LATER);
    let prev = -1, prevName = '';
    for (const p of parts) {
      const at = ids.indexOf(p.id);
      if (at < 0) { if (!p.optional) out.push({ where: 'main', value: `no ${p.name} section (section#${p.id})` }); continue; }
      const s = secs[at];
      found[p.id] = s;
      if (props >= 0 && at < props) out.push({ where: H.path(s), value: `${p.name} comes before Properties (a type's parts follow Properties)` });
      if (later >= 0 && at > later) out.push({ where: H.path(s), value: `${p.name} comes after ${LATER[ids[later]]} (a type's parts come before it)` });
      if (at < prev) out.push({ where: H.path(s), value: `${p.name} comes before ${prevName}` });
      else { prev = at; prevName = p.name; }
      const b = body(s);
      if (!b || !b.firstElementChild) out.push({ where: H.path(s), value: `the ${p.name} section is empty` });
    }
    const props_ = props >= 0 ? secs[props] : null;
    return { out, found, properties: props_ };
  };

  // The one component of a kind in a section, whose title names the page.
  const one = (out, s, sel, what) => {
    if (!s) return null;
    const cards = [...s.querySelectorAll(sel)];
    if (cards.length !== 1) { out.push({ where: H.path(s), value: `${cards.length} ${what} (exactly 1)` }); return cards[0] || null; }
    const card = cards[0], t = card.querySelector(':scope > .cm-card__title');
    if (t && h1 && !ph(t) && !ph(h1) && !same(H.text(t), H.text(h1))) out.push({ where: H.path(t), value: `${what} titled "${H.text(t)}" on a page titled "${H.text(h1)}" (the same name)` });
    return card;
  };

  window.__cmt = { H, d, type, ph, norm, same, body, place, one };
}

const typeCheck = (type, source, fn) => ({
  name: `type-${type}`, level: 'fail', source: `SPEC ${source}`, once: true, types: [type],
  run: async ({ page }) => {
    await page.evaluate(prepare);
    return page.evaluate(fn, { check: `type-${type}`, type });
  },
});

export default [
  typeCheck('framework', '§7.10', ({ check, type }) => {
    // Rationale, Parts, Application and Limits. Parts holds the framework, named as the page is, with
    // both lists of its scope. Application is an ordered list of 3 to 7 steps or a method. Limits
    // holds 1 to 4 cases, one h3 each.
    const T = window.__cmt, H = T.H, out = [];
    if (T.type !== type) return out;
    const { out: o, found } = T.place(check, [
      { id: 'rationale', name: 'Rationale' },
      { id: 'parts', name: 'Parts' },
      { id: 'application', name: 'Application' },
      { id: 'limits', name: 'Limits' },
    ]);
    out.push(...o);
    const card = T.one(out, found.parts, '.cm-framework', 'framework (.cm-framework)');
    if (card) {
      const scope = card.querySelector(':scope > .cm-scope');
      const labels = scope ? [...scope.querySelectorAll(':scope > div > .cm-label')].map(l => H.text(l)) : [];
      for (const l of ['Use when', 'Not for']) if (!labels.includes(l)) out.push({ where: H.path(card), value: `the framework's scope has no "${l}" list` });
    }
    const app = found.application;
    if (app) {
      const lists = [...app.querySelectorAll('ol.cm-olist')].filter(l => !l.closest('.cm-method'));
      const methods = app.querySelectorAll('.cm-method');
      if (!lists.length && !methods.length) out.push({ where: H.path(app), value: 'no steps (ol.cm-olist) and no method (.cm-method)' });
      for (const l of lists) {
        const n = l.querySelectorAll(':scope > li').length;
        if (n < 3 || n > 7) out.push({ where: H.path(l), value: `${n} steps (3 to 7)` });
      }
    }
    const lim = found.limits;
    if (lim) {
      const n = lim.querySelectorAll('h3').length;
      if (n < 1 || n > 4) out.push({ where: H.path(lim), value: `${n} cases (1 to 4, one h3 each)` });
    }
    return out;
  }),

  typeCheck('process', '§7.11', ({ check, type }) => {
    // Flow, then Stages. Flow holds a flow diagram; Stages holds the workflow, named as the page is,
    // and every stage title is the label of a node in the diagram. A process page holds no
    // procedure: the steps one role carries out are a guide.
    const T = window.__cmt, H = T.H, out = [];
    if (T.type !== type) return out;
    const { out: o, found } = T.place(check, [
      { id: 'flow', name: 'Flow' },
      { id: 'stages', name: 'Stages' },
    ]);
    out.push(...o);
    const labels = [];
    if (found.flow) {
      const diagrams = [...found.flow.querySelectorAll('.cm-diagram[data-diagram="flow"]')];
      if (!diagrams.length) out.push({ where: H.path(found.flow), value: 'no flow diagram (.cm-diagram[data-diagram="flow"])' });
      for (const el of diagrams) {
        const s = el.querySelector('script[type="application/json"]');
        try { for (const n of JSON.parse(s.textContent).nodes || []) labels.push(T.norm(n.label)); } catch (e) { /* diagram-json reports it */ }
      }
    }
    const card = T.one(out, found.stages, '.cm-workflow', 'workflow (.cm-workflow)');
    if (card && labels.length) {
      for (const t of card.querySelectorAll(':scope > ol.cm-stages > li > .cm-procedure__title')) {
        if (!T.ph(t) && !labels.includes(T.norm(H.text(t)))) out.push({ where: H.path(t), value: `stage "${H.text(t)}" is not a node in the flow diagram (the same stage names)` });
      }
    }
    for (const p of T.d.querySelectorAll('.cm-procedure')) {
      if (!H.exempt(p, check)) out.push({ where: H.path(p), value: 'a procedure on a process page (the steps one role carries out are a guide, linked from Relationships)' });
    }
    return out;
  }),

  typeCheck('metric', '§7.12', ({ check, type }) => {
    // Properties holds the metric detail, named as the page is, without related metrics (the page's
    // Relationships holds them). Status follows, with a status block that gives the metric's value
    // under the metric's name. Measurement, when present, comes after Status.
    const T = window.__cmt, H = T.H, out = [];
    if (T.type !== type) return out;
    const { out: o, found, properties } = T.place(check, [
      { id: 'status', name: 'Status' },
      { id: 'measurement', name: 'Measurement', optional: true },
    ]);
    out.push(...o);
    const card = T.one(out, properties, '.cm-metric', 'metric detail (.cm-metric)');
    if (card) {
      for (const sub of card.querySelectorAll(':scope > .cm-sub')) {
        const l = sub.querySelector(':scope > .cm-label');
        if (l && H.text(l) === 'Related metrics') out.push({ where: H.path(sub), value: 'related metrics inside the metric detail (the page lists them under Relationships)' });
      }
    }
    if (found.status) {
      const blocks = [...found.status.querySelectorAll('.cm-status')];
      if (!blocks.length) out.push({ where: H.path(found.status), value: 'no status block (.cm-status)' });
      const name = card && card.querySelector(':scope > .cm-card__title');
      if (blocks.length && name && !T.ph(name)) {
        const keys = blocks.flatMap(b => [...b.querySelectorAll('dt')]);
        if (!keys.some(k => T.ph(k) || T.same(H.text(k), H.text(name)))) out.push({ where: H.path(blocks[0]), value: `no value under the metric's name "${H.text(name)}" (a <dt> of the status block)` });
      }
    }
    return out;
  }),

  typeCheck('comparison', '§7.13', ({ check, type }) => {
    // Options, Criteria, Comparison, Recommendation and Change conditions. The comparison table has
    // a column for each option and a row for each criterion, a measure in every cell, and one
    // recommended column with its star. The options are the columns, the criteria are the rows, the
    // recommendation names the starred option and each change condition names an option.
    const T = window.__cmt, H = T.H, out = [];
    if (T.type !== type) return out;
    const { out: o, found } = T.place(check, [
      { id: 'options', name: 'Options' },
      { id: 'criteria', name: 'Criteria' },
      { id: 'comparison', name: 'Comparison' },
      { id: 'recommendation', name: 'Recommendation' },
      { id: 'conditions', name: 'Change conditions' },
    ]);
    out.push(...o);
    let options = [], rec = null, rows = [];
    if (found.comparison) {
      const tables = [...found.comparison.querySelectorAll('table.cm-table')].filter(t => !t.closest('.cm-data'));
      if (tables.length !== 1) out.push({ where: H.path(found.comparison), value: `${tables.length} comparison tables (exactly 1)` });
      const t = tables[0];
      if (t) {
        const head = [...t.querySelectorAll(':scope > thead > tr:last-child > th')];
        const cols = head.slice(1);
        options = cols.map(th => ({ th, name: T.norm(H.text(th)), text: H.text(th).replace(/★/g, '').trim() }));
        if (cols.length < 2 || cols.length > 4) out.push({ where: H.path(t), value: `${cols.length} option columns (2 to 4, after the criterion column)` });
        const recs = cols.filter(th => th.matches('.is-rec'));
        if (recs.length !== 1) out.push({ where: H.path(t), value: `${recs.length} recommended columns (exactly 1, th.is-rec)` });
        else if (!T.ph(recs[0]) && !/★/.test(H.text(recs[0]))) out.push({ where: H.path(recs[0]), value: 'the recommended column has no ★ in its header' });
        rec = recs.length === 1 ? options[cols.indexOf(recs[0])] : null;
        const EMPTY = /^(—|-|–|n\/a|na|none|tbd)?$/i;
        for (const tr of t.querySelectorAll(':scope > tbody > tr')) {
          const cells = [...tr.children];
          if (cells.length !== head.length) { out.push({ where: H.path(tr), value: `${cells.length} cells in a row of ${head.length} columns` }); continue; }
          rows.push(cells[0]);
          cells.slice(1).forEach((c, i) => {
            if (!T.ph(c) && EMPTY.test(H.text(c))) out.push({ where: H.path(c), value: `no measure for "${options[i] ? options[i].text : i + 1}" on "${H.text(cells[0])}" (every option has one)` });
          });
        }
      }
    }
    if (found.options && options.length) {
      const heads = [...found.options.querySelectorAll('h3')].filter(h => !T.ph(h));
      const names = heads.map(h => T.norm(H.text(h)));
      for (const op of options) if (!T.ph(op.th) && !names.includes(op.name)) out.push({ where: H.path(found.options), value: `no h3 for the option "${op.text}"` });
      for (const h of heads) if (!options.some(op => op.name === T.norm(H.text(h)) || T.ph(op.th))) out.push({ where: H.path(h), value: `option "${H.text(h)}" is not a column of the comparison table` });
    }
    if (found.criteria && rows.length) {
      const terms = [...found.criteria.querySelectorAll('.cm-def dt')];
      if (!terms.length) out.push({ where: H.path(found.criteria), value: 'no criteria stated (a definition block, .cm-def)' });
      else for (const r of rows) if (!T.ph(r) && !terms.some(dt => T.ph(dt) || T.same(H.text(dt), H.text(r)))) out.push({ where: H.path(r), value: `criterion "${H.text(r)}" is not stated under Criteria (a <dt>)` });
    }
    if (found.recommendation && rec && !T.ph(rec.th)) {
      const b = T.body(found.recommendation);
      const p = b && b.querySelector('p');
      const strong = p && p.querySelector('strong, b');
      if (!strong || !(T.ph(strong) || T.norm(H.text(strong)).includes(rec.name))) out.push({ where: p ? H.path(p) : H.path(found.recommendation), value: `the opening paragraph does not name the starred option "${rec.text}" in bold` });
    }
    if (found.conditions) {
      const items = [...found.conditions.querySelectorAll('ul.cm-list > li')];
      if (items.length < 1 || items.length > 4) out.push({ where: H.path(found.conditions), value: `${items.length} conditions (ul.cm-list, 1 to 4)` });
      if (options.length) for (const li of items) {
        if (!T.ph(li) && !options.some(op => T.ph(op.th) || T.norm(H.text(li)).includes(op.name))) out.push({ where: H.path(li), value: 'the condition names no option it would favour' });
      }
    }
    return out;
  }),
];
