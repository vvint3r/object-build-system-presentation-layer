// Page types built on the reference and guide kinds: topic (SPEC.md section 7.7), glossary (7.8)
// and module (7.9). Each type keeps every required part of its kind, which checks/kinds.mjs holds
// it to (a glossary's Terms stands in Properties' place), and adds parts of its own: top-level sections with fixed ids, at fixed places among the
// kind's parts. One check per type, read once on the page as written. A check with `types` runs only
// on a page of that type (checks/run.mjs); each also returns nothing on a page of another type.
//
// The shared reading below is installed in the page once (window.__cmt), as the writing checks do.

function prepare() {
  if (window.__cmt) return;
  const H = window.__cm, d = H.source();
  const main = d.querySelector('main') || d.body;
  // The document's top-level sections, in order, and the position of each id among them.
  const sections = [...main.querySelectorAll('section.cm-section')].filter(s => !s.parentElement.closest('section'));
  const pos = id => sections.findIndex(s => s.id === id);
  const section = id => sections.find(s => s.id === id) || null;
  const body = s => (s ? s.querySelector(':scope > .cm-section__body') : null);
  const kids = el => (el ? [...el.children] : []);
  // A part of the type: present, or a finding; placed after every part named in `after` and before
  // every part named in `before`, where those parts are present.
  const part = (out, id, name, after, before) => {
    const s = section(id);
    if (!s) { out.push({ where: 'main', value: `no ${name} section (section#${id})` }); return null; }
    const at = pos(id);
    for (const a of after) if (pos(a) > at) out.push({ where: H.path(s), value: `${name} comes before section#${a} (after it)` });
    for (const b of before) if (pos(b) >= 0 && pos(b) < at) out.push({ where: H.path(s), value: `${name} comes after section#${b} (before it)` });
    if (!body(s) || !body(s).firstElementChild) { out.push({ where: H.path(s), value: `the ${name} section is empty` }); return null; }
    return s;
  };
  // The groups of a part: each a .cm-stack child of the section body that opens with an h3.
  const groups = s => kids(body(s)).filter(c => c.matches('.cm-stack'));
  const opensWithH3 = g => !!g.firstElementChild && g.firstElementChild.localName === 'h3' && !!H.text(g.firstElementChild);
  const prose = g => kids(g).find(c => c.matches('.cm-prose') && c.querySelector('p') && H.text(c));
  const leavesPage = a => { const h = (a.getAttribute('href') || '').trim(); return !!h && h[0] !== '#'; };
  const plain = t => t.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
  window.__cmt = { H, d, main, sections, pos, section, body, kids, part, groups, opensWithH3, prose, leavesPage, plain };
}

const inTypes = (name, type, source, fn) => ({
  name, level: 'fail', source: `SPEC ${source}`, once: true, types: [type],
  run: async ({ page }) => {
    await page.evaluate(prepare);
    return page.evaluate(fn, { check: name, type });
  },
});

export default [
  inTypes('type-topic', 'topic', '§7.7', ({ type }) => {
    // A topic: Subtopics after Definition and before Properties. It holds two or more subtopics, each
    // a group under an h3 with a paragraph that explains that part of the subject and a related list
    // whose every link leaves the page. An optional Reading order follows Subtopics: an ordered list
    // of links out, each with its reason.
    const T = window.__cmt, H = T.H, out = [];
    if (H.type() !== type) return out;
    const LATER = ['properties', 'relationships', 'examples', 'sources'];
    const subs = T.part(out, 'subtopics', 'Subtopics', ['definition'], LATER);
    if (subs) {
      const gs = T.groups(subs);
      if (gs.length < 2) out.push({ where: H.path(subs), value: `${gs.length} subtopics (at least 2, each a .cm-stack under its h3)` });
      for (const g of gs) {
        const at = H.path(g);
        if (!T.opensWithH3(g)) out.push({ where: at, value: 'the subtopic does not open with its name (an h3)' });
        if (!T.prose(g)) out.push({ where: at, value: 'no paragraph that explains the subtopic (.cm-prose)' });
        const list = T.kids(g).find(c => c.matches('ul.cm-related'));
        if (!list || !list.children.length) { out.push({ where: at, value: 'no related list of the documents that cover it (ul.cm-related)' }); continue; }
        for (const a of list.querySelectorAll(':scope > li > a')) if (!T.leavesPage(a)) out.push({ where: H.path(a), value: `href="${a.getAttribute('href')}" stays in the page (a subtopic links to the documents that cover it)` });
      }
      for (const c of T.kids(T.body(subs))) if (!c.matches('.cm-stack') && !(c === T.body(subs).firstElementChild && c.matches('.cm-prose'))) out.push({ where: H.path(c), value: 'Subtopics holds a lede, then subtopic groups (.cm-stack), and nothing else' });
    }
    const order = T.section('reading-order');
    if (order && T.part(out, 'reading-order', 'Reading order', ['subtopics'], LATER)) {
      const ol = T.body(order).querySelector(':scope > ol.cm-olist');
      if (!ol || !ol.children.length) out.push({ where: H.path(order), value: 'no ordered list of documents (ol.cm-olist)' });
      else for (const li of ol.children) {
        const a = li.querySelector('a[href]');
        if (!a || !T.leavesPage(a)) out.push({ where: H.path(li), value: 'the item does not link to a document' });
        else if (H.text(li) === H.text(a)) out.push({ where: H.path(li), value: 'the item gives no reason after its link' });
      }
    }
    return out;
  }),

  inTypes('type-glossary', 'glossary', '§7.8', ({ type }) => {
    // A glossary: Terms in the place of Properties, after Definition and before Relationships, and no
    // Properties section (checks/kinds.mjs holds Terms to that place). Terms holds definition blocks
    // of five or more terms in all, each definition citing the policy or dataset it follows. A term
    // is defined once on the page. Within a block, terms run A to Z. A Terms part of more than one
    // block puts each under its group's h3.
    const T = window.__cmt, H = T.H, out = [];
    if (H.type() !== type) return out;
    const props = T.section('properties');
    if (props) out.push({ where: H.path(props), value: 'a Properties section in a glossary (Terms takes its place)' });
    const terms = T.part(out, 'terms', 'Terms', ['definition'], ['relationships', 'examples', 'sources']);
    if (!terms) return out;
    const blocks = [...terms.querySelectorAll('aside.cm-def')];
    if (!blocks.length) { out.push({ where: H.path(terms), value: 'no definition block (aside.cm-def)' }); return out; }
    let n = 0;
    for (const b of blocks) {
      const dts = [...b.querySelectorAll(':scope > dl > div > dt')];
      n += dts.length;
      dts.forEach((dt, i) => {
        if (i && dts[i - 1].textContent.trim().localeCompare(dt.textContent.trim(), 'en', { sensitivity: 'base' }) > 0) out.push({ where: H.path(dt), value: `"${H.text(dt)}" comes after "${H.text(dts[i - 1])}" (A to Z within a group)` });
        const dd = dt.nextElementSibling;
        if (!dd || dd.localName !== 'dd' || !dd.querySelector('a.cm-cite')) out.push({ where: H.path(dt), value: `"${H.text(dt)}" cites no source (a.cm-cite in its definition)` });
      });
      if (blocks.length > 1) {
        const g = b.parentElement;
        if (!g.matches('.cm-stack') || g.parentElement !== T.body(terms) || !T.opensWithH3(g)) out.push({ where: H.path(b), value: 'the definition block is not in a group under its h3 (.cm-stack opening with an h3)' });
      }
    }
    if (n < 5) out.push({ where: H.path(terms), value: `${n} terms (at least 5; fewer belong in a definition block of the document that uses them)` });
    const seen = new Map();
    for (const dt of T.d.querySelectorAll('aside.cm-def dl > div > dt')) {
      const k = T.plain(dt.textContent);
      if (seen.has(k)) out.push({ where: H.path(dt), value: `"${H.text(dt)}" is defined twice (once, in Terms)` });
      else seen.set(k, dt);
    }
    return out;
  }),

  inTypes('type-module', 'module', '§7.9', ({ type }) => {
    // A module: Objectives after Purpose and before Prerequisites; Steps titled Lessons; Exercises
    // after the steps and before Exceptions and recovery. Each objective links to the lesson that
    // teaches it and the exercise that checks it, and every exercise checks an objective. Each
    // exercise is a group under its h3: the task, then its answer in a closed collapsible labelled
    // Answer. The page carries no form controls, scores or progress.
    const T = window.__cmt, H = T.H, out = [];
    if (H.type() !== type) return out;
    const objectives = T.part(out, 'objectives', 'Objectives', ['purpose'], ['prerequisites', 'steps', 'exceptions', 'related', 'sources']);
    const exercises = T.part(out, 'exercises', 'Exercises', ['steps'], ['exceptions', 'related', 'sources']);
    const steps = T.section('steps');
    const h2 = steps && steps.querySelector(':scope > .cm-section__head > h2');
    if (h2 && H.text(h2) !== 'Lessons') out.push({ where: H.path(h2), value: `the Steps section is titled "${H.text(h2)}" (Lessons)` });
    const lessons = steps ? [...steps.querySelectorAll('ol.cm-procedure > li')] : [];
    for (const li of lessons) if (!li.id) out.push({ where: H.path(li), value: 'the lesson has no id (lesson-1, lesson-2 …), so no objective can point at it' });

    const tasks = exercises ? T.groups(exercises) : [];
    for (const g of tasks) {
      const at = H.path(g);
      if (!g.id) out.push({ where: at, value: 'the exercise has no id (exercise-1, exercise-2 …), so no objective can point at it' });
      if (!T.opensWithH3(g)) out.push({ where: at, value: 'the exercise does not open with its name (an h3)' });
      if (!T.prose(g)) out.push({ where: at, value: 'no task (.cm-prose) before the answer' });
      const last = g.lastElementChild;
      const det = last && last.matches('.cm-bleed') ? last.querySelector(':scope > details.cm-collapse') : null;
      if (!det) { out.push({ where: at, value: 'the exercise does not close with its answer (div.cm-bleed > details.cm-collapse)' }); continue; }
      if (det.hasAttribute('open')) out.push({ where: H.path(det), value: 'the answer is open (closed until the reader opens it)' });
      const label = det.querySelector(':scope > summary .cm-label');
      if (!label || H.text(label) !== 'Answer') out.push({ where: H.path(det), value: 'the answer\'s summary has no "Answer" label (.cm-label)' });
      const ans = det.querySelector(':scope > .cm-collapse__body');
      if (!ans || !H.text(ans)) out.push({ where: H.path(det), value: 'the answer is empty (.cm-collapse__body)' });
    }
    if (exercises) for (const c of T.kids(T.body(exercises))) if (!c.matches('.cm-stack') && !(c === T.body(exercises).firstElementChild && c.matches('.cm-prose'))) out.push({ where: H.path(c), value: 'Exercises holds a lede, then exercise groups (.cm-stack), and nothing else' });

    if (objectives) {
      const ol = T.body(objectives).querySelector(':scope > ol.cm-olist');
      const items = ol ? [...ol.children] : [];
      if (items.length < 2 || items.length > 5) out.push({ where: H.path(ol || objectives), value: `${items.length} objectives (2 to 5, in an ol.cm-olist)` });
      const linked = new Set();
      for (const li of items) {
        const targets = [...li.querySelectorAll('a[href^="#"]')].map(a => T.d.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)))).filter(Boolean);
        if (!targets.some(t => lessons.includes(t))) out.push({ where: H.path(li), value: 'the objective does not link to the lesson that teaches it' });
        const ex = targets.filter(t => tasks.includes(t));
        if (!ex.length) out.push({ where: H.path(li), value: 'the objective does not link to the exercise that checks it' });
        ex.forEach(t => linked.add(t));
      }
      for (const g of tasks) if (!linked.has(g)) out.push({ where: H.path(g), value: 'no objective links to this exercise (each exercise checks a stated objective)' });
    }
    for (const el of T.main.querySelectorAll('input, select, textarea, form, button, progress, meter')) out.push({ where: H.path(el), value: `<${el.localName}> in a module (no form controls, scores or progress)` });
    return out;
  }),
];
