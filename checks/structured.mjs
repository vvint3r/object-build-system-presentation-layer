// Structured components: SPEC.md section 8 (their shared anatomy) and sections 8.25 to 8.30. Read
// once, on the page as written. Each component is a card with its kind class; the checks find it by
// that class and test its required parts, counts and word limits. Prose limits that apply to every
// paragraph (section 13.1) stay with the writing checks.
//
// The shared reading below is installed in the page once (window.__cms) and used by every check, as
// the writing checks do. A template placeholder ({{ … }}) counts as no words, and a field holding
// one counts as present.

function prepare() {
  if (window.__cms) return;
  const H = window.__cm, d = H.source();
  const PH = /\{\{[\s\S]*?\}\}/g;
  const KINDS = { 'cm-workflow': 'Workflow', 'cm-framework': 'Framework', 'cm-model': 'Model', 'cm-method': 'Method',
    'cm-req': 'Requirement', 'cm-eval': 'Evaluation', 'cm-metric': 'Metric' };
  const SEL = Object.keys(KINDS).map(k => `.${k}`).join(', ');

  // The words of an element as a reader reads them: inline code is one word, citation and footnote
  // markers are none.
  const read = (el, drop) => {
    if (!el) return '';
    const c = el.cloneNode(true);
    c.querySelectorAll('a.cm-cite, a.cm-fn, a.cm-back, script' + (drop ? `, ${drop}` : '')).forEach(n => n.remove());
    c.querySelectorAll('code').forEach(n => n.replaceWith('X'));
    c.querySelectorAll('br, p, li, div, dt, dd').forEach(n => n.after(' '));
    return c.textContent.replace(PH, ' ').replace(/\s+/g, ' ').trim();
  };
  const words = s => s.split(' ').filter(w => /[\p{L}\p{N}]/u.test(w)).length;
  const ABBR = /\b(e\.g|i\.e|vs|etc|est|approx|cf|Fig|No)\.(?=\s)/g;
  const sentences = s => s.replace(ABBR, (m, a) => a + '․')
    .split(/(?<=[.!?…]["”’)]?)\s+(?=[\p{Lu}\p{N}"“‘(])/u)
    .map(x => x.replace(/․/g, '.').trim()).filter(x => words(x));
  const placeholder = el => !!el && /\{\{[\s\S]*?\}\}/.test(el.textContent);

  const kids = el => (el ? [...el.children] : []);
  const label = el => {
    const l = el && el.querySelector(':scope > .cm-label');
    return l ? H.text(l) : '';
  };
  // A labelled part: a .cm-sub child of the card whose first child is a .cm-label with this text.
  const sub = (card, text) => kids(card).find(c => c.matches('.cm-sub') && c.firstElementChild
    && c.firstElementChild.matches('.cm-label') && H.text(c.firstElementChild) === text);
  // A facts row as { key: dd } pairs, in order.
  const facts = dl => kids(dl).filter(x => x.localName === 'div').map(x => ({
    el: x, dt: x.querySelector(':scope > dt'), dd: x.querySelector(':scope > dd'),
  })).map(f => ({ ...f, key: f.dt ? H.text(f.dt) : '', value: f.dd ? read(f.dd) : '' }));
  // The scope of a card: { label: [items] } for each list under its label.
  const scope = card => {
    const box = kids(card).find(c => c.matches('.cm-scope'));
    const out = {};
    for (const div of kids(box)) out[label(div)] = [...div.querySelectorAll(':scope > ul > li')];
    return { box, lists: out };
  };
  // The card's paragraphs after its title, up to its first part that is not a paragraph.
  const after = card => {
    const all = kids(card);
    const t = all.findIndex(c => c.matches('.cm-card__title'));
    const out = [];
    for (const c of all.slice(t + 1)) { if (c.localName !== 'p') break; out.push(c); }
    return out;
  };
  // One sentence of at most n words; returns a finding's text or ''.
  const oneSentence = (el, n, what) => {
    if (!el) return `no ${what}`;
    if (placeholder(el)) return '';
    const t = read(el), s = sentences(t), w = words(t);
    if (!w) return `no ${what}`;
    if (s.length !== 1) return `${what}: ${s.length} sentences (one)`;
    if (n && w > n) return `${what}: ${w} words (at most ${n})`;
    return '';
  };
  const cards = cls => [...d.querySelectorAll(`.${cls}`)];
  const chipMods = c => [...c.classList].filter(x => x.startsWith('cm-chip--')).sort().join(' ');

  window.__cms = { H, d, KINDS, SEL, read, words, sentences, placeholder, kids, label, sub, facts, scope, after, oneSentence, cards, chipMods };
}

// A check that runs in the page with the shared reading above.
const inStructured = (name, source, fn) => ({
  name, level: 'fail', source: `SPEC ${source}`, once: true,
  run: async ({ page }) => {
    await page.evaluate(prepare);
    return page.evaluate(fn, { check: name });
  },
});

export default [
  inStructured('structured-anatomy', '§8; §6; §14 item 17', ({ check }) => {
    // Every structured component is a card that opens with its kind label, then its title; it
    // carries no emphasis. Stages, criteria and bands live only in their own component; a step title
    // only in a procedure step or a workflow stage.
    const S = window.__cms, H = S.H, out = [];
    for (const [cls, kind] of Object.entries(S.KINDS)) {
      for (const card of S.cards(cls)) {
        if (H.exempt(card, check)) continue;
        const at = H.path(card);
        if (!card.matches('.cm-card')) out.push({ where: at, value: `.${cls} is not a .cm-card` });
        const [first, second] = S.kids(card);
        const k = first && first.matches('.cm-label.cm-card__kicker') ? H.text(first) : null;
        const want = kind === 'Requirement' ? /^Requirement\s+\S/ : new RegExp(`^${kind}$`);
        if (k === null) out.push({ where: at, value: `does not open with its kind label (span.cm-label.cm-card__kicker "${kind}")` });
        else if (!S.placeholder(first) && !want.test(k)) out.push({ where: H.path(first), value: `kind label "${k}" (${kind}${kind === 'Requirement' ? ' and its key' : ''})` });
        if (!second || !second.matches('.cm-card__title') || !/^h[2-6]$/.test(second.localName) || !H.text(second)) out.push({ where: at, value: 'no title (h3.cm-card__title) after the kind label' });
        const emph = [card, ...card.querySelectorAll('*')].filter(e => e.matches('.cm-emph, .cm-featured, .cm-chip--verdict'));
        for (const e of emph) out.push({ where: H.path(e), value: `${[...e.classList].find(c => /cm-(emph|featured|chip--verdict)/.test(c))} inside a structured component` });
      }
    }
    for (const [sel, home] of [['.cm-stages', '.cm-workflow'], ['.cm-criteria', '.cm-eval'], ['.cm-bands', '.cm-metric'], ['.cm-parts--matrix', '.cm-model'], ['.cm-procedure__title', '.cm-procedure > li, .cm-stages > li']]) {
      for (const el of S.d.querySelectorAll(sel)) {
        if (!H.exempt(el, check) && !el.closest(home)) out.push({ where: H.path(el), value: `${sel} outside ${home}` });
      }
    }
    return out;
  }),

  inStructured('facts', '§8', ({ check }) => {
    // One to five facts, each key over value: a key of 1 to 3 words, a value of 12 words at most.
    const S = window.__cms, H = S.H, out = [];
    for (const dl of S.d.querySelectorAll('dl.cm-facts')) {
      if (H.exempt(dl, check)) continue;
      const fs = S.facts(dl);
      if (fs.length < 1 || fs.length > 5 || S.kids(dl).some(c => c.localName !== 'div')) out.push({ where: H.path(dl), value: `${fs.length} facts as div > dt + dd (1 to 5)` });
      for (const f of fs) {
        if (!f.dt || !f.dd) { out.push({ where: H.path(f.el), value: 'fact without a key (dt) and a value (dd)' }); continue; }
        const kw = S.words(f.key);
        if (!S.placeholder(f.dt) && (kw < 1 || kw > 3)) out.push({ where: H.path(f.dt), value: `key "${f.key}": ${kw} words (1 to 3)` });
        const vw = S.words(f.value);
        if (!S.placeholder(f.dd) && !vw) out.push({ where: H.path(f.dd), value: `no value for "${f.key}"` });
        if (vw > 12) out.push({ where: H.path(f.dd), value: `value of "${f.key}": ${vw} words (at most 12)` });
      }
    }
    return out;
  }),

  inStructured('parts', '§8', ({ check }) => {
    // Each part is a tile with a name of 3 words at most and one sentence of 25 words at most. A
    // matrix has exactly four cells, each opening with its position label.
    const S = window.__cms, H = S.H, out = [];
    for (const list of S.d.querySelectorAll('.cm-parts')) {
      if (H.exempt(list, check)) continue;
      const matrix = list.matches('.cm-parts--matrix');
      if (matrix && list.localName !== 'ol') out.push({ where: H.path(list), value: 'a matrix is an ol, its cells in reading order' });
      const items = S.kids(list);
      if (matrix && items.length !== 4) out.push({ where: H.path(list), value: `${items.length} cells (exactly 4)` });
      for (const li of items) {
        const at = H.path(li);
        if (li.localName !== 'li' || !li.matches('.cm-tile')) { out.push({ where: at, value: 'part is not li.cm-tile' }); continue; }
        const ps = S.kids(li).filter(c => c.localName === 'p');
        const lead = S.kids(li)[0];
        if (matrix && !(lead && lead.matches('.cm-label') && H.text(lead))) out.push({ where: at, value: 'matrix cell without its position label (.cm-label first)' });
        const name = ps[0] && ps[0].matches('.cm-t5') ? ps[0] : null;
        if (!name) { out.push({ where: at, value: 'no name (p.cm-t5)' }); continue; }
        const nw = S.words(S.read(name));
        if (!S.placeholder(name) && (nw < 1 || nw > 3)) out.push({ where: H.path(name), value: `name "${H.text(name)}": ${nw} words (3 at most)` });
        if (ps.length !== 2) { out.push({ where: at, value: `${ps.length - 1} descriptions (one p after the name)` }); continue; }
        const f = S.oneSentence(ps[1], 25, 'description');
        if (f) out.push({ where: H.path(ps[1]), value: f });
      }
    }
    return out;
  }),

  inStructured('scope', '§8', ({ check }) => {
    // One or two lists under their labels, from a pair: Use when and Not for, or Holds when and
    // Breaks when. One to three items, one sentence each.
    const S = window.__cms, H = S.H, out = [];
    const PAIRS = [['Use when', 'Not for'], ['Holds when', 'Breaks when']];
    for (const box of S.d.querySelectorAll('.cm-scope')) {
      if (H.exempt(box, check)) continue;
      const divs = S.kids(box);
      const labels = divs.map(S.label);
      const pair = PAIRS.find(p => p.includes(labels[0]));
      if (!divs.length || divs.length > 2 || divs.some(x => x.localName !== 'div')) out.push({ where: H.path(box), value: `${divs.length} lists (1 or 2, each a div)` });
      if (!pair || labels.some(l => !pair.includes(l)) || (labels.length === 2 && labels[0] !== pair[0])) out.push({ where: H.path(box), value: `labels "${labels.join('", "')}" (Use when, Not for; or Holds when, Breaks when, in that order)` });
      for (const div of divs) {
        const items = [...div.querySelectorAll(':scope > ul.cm-list > li')];
        if (items.length < 1 || items.length > 3) out.push({ where: H.path(div), value: `${items.length} items under "${S.label(div)}" (ul.cm-list, 1 to 3)` });
        for (const li of items) { const f = S.oneSentence(li, 0, 'item'); if (f) out.push({ where: H.path(li), value: f }); }
      }
    }
    return out;
  }),

  inStructured('workflow', '§8.25', ({ check }) => {
    const S = window.__cms, H = S.H, out = [];
    const KEYS = ['Actor', 'Takes in', 'Produces', 'Hands on when'];
    for (const card of S.cards('cm-workflow')) {
      if (H.exempt(card, check)) continue;
      const at = H.path(card);
      const lede = S.after(card)[0];
      const f = S.oneSentence(lede, 30, 'lede');
      if (f) out.push({ where: lede ? H.path(lede) : at, value: f });
      const ol = S.kids(card).find(c => c.matches('ol.cm-stages'));
      if (!ol) { out.push({ where: at, value: 'no stages (ol.cm-stages)' }); continue; }
      const stages = S.kids(ol);
      if (stages.length < 3 || stages.length > 6) out.push({ where: H.path(ol), value: `${stages.length} stages (3 to 6)` });
      const ct = card.querySelector(':scope > .cm-card__title');
      const level = ct && /^h[2-6]$/.test(ct.localName) ? Number(ct.localName[1]) + 1 : 0;
      stages.forEach((li, i) => {
        const sat = H.path(li);
        const title = S.kids(li)[0];
        const body = S.kids(li).find(c => c.localName === 'p');
        if (!title || !title.matches('.cm-procedure__title') || !/^h[3-6]$/.test(title.localName)) out.push({ where: sat, value: 'the stage does not open with its title (a heading, .cm-procedure__title)' });
        else {
          if (level && title.localName !== `h${level}`) out.push({ where: H.path(title), value: `stage title is <${title.localName}> (h${level}, one level below the card title)` });
          if (!S.placeholder(title) && S.words(S.read(title)) > 4) out.push({ where: H.path(title), value: `stage title "${H.text(title)}": ${S.words(S.read(title))} words (4 at most)` });
        }
        const g = S.oneSentence(body, 20, 'stage body');
        if (g) out.push({ where: body ? H.path(body) : sat, value: g });
        const dl = li.querySelector(':scope > dl.cm-facts');
        if (!dl) { out.push({ where: sat, value: 'no facts (dl.cm-facts with Actor)' }); return; }
        const keys = S.facts(dl).map(x => x.key);
        for (const k of keys) if (!KEYS.includes(k)) out.push({ where: H.path(dl), value: `key "${k}" (${KEYS.join(', ')})` });
        if (!keys.includes('Actor')) out.push({ where: H.path(dl), value: 'no Actor' });
        if (i < stages.length - 1 && !keys.includes('Hands on when')) out.push({ where: H.path(dl), value: 'no Hands on when (every stage but the last)' });
      });
      for (const s of S.kids(card).filter(c => c.matches('.cm-sub'))) {
        if (S.label(s) !== 'Exceptions') { out.push({ where: H.path(s), value: `part "${S.label(s)}" (Exceptions)` }); continue; }
        const n = s.querySelectorAll(':scope > ul.cm-list > li').length;
        if (n < 1 || n > 3) out.push({ where: H.path(s), value: `${n} exceptions (ul.cm-list, 1 to 3)` });
      }
    }
    return out;
  }),

  inStructured('framework', '§8.26', ({ check }) => {
    const S = window.__cms, H = S.H, out = [];
    for (const card of S.cards('cm-framework')) {
      if (H.exempt(card, check)) continue;
      const at = H.path(card);
      const lede = S.after(card)[0];
      const f = S.oneSentence(lede && !lede.matches('.cm-t5') ? lede : null, 30, 'lede');
      if (f) out.push({ where: lede ? H.path(lede) : at, value: f });
      const parts = S.kids(card).filter(c => c.matches('.cm-parts'));
      if (parts.length !== 1 || parts[0].matches('.cm-parts--matrix')) { out.push({ where: at, value: `${parts.length} part lists (one ul.cm-parts, or ol.cm-parts for layers)` }); continue; }
      const n = S.kids(parts[0]).length;
      if (n < 3 || n > 6) out.push({ where: H.path(parts[0]), value: `${n} parts (3 to 6)` });
      const { box, lists } = S.scope(card);
      if (box && !('Use when' in lists)) out.push({ where: H.path(box), value: 'scope without Use when' });
    }
    return out;
  }),

  inStructured('model', '§8.27', ({ check }) => {
    const S = window.__cms, H = S.H, out = [];
    for (const card of S.cards('cm-model')) {
      if (H.exempt(card, check)) continue;
      const at = H.path(card);
      const [claim, more, extra] = S.after(card);
      if (!claim || !claim.matches('.cm-t5')) out.push({ where: at, value: 'no claim (p.cm-t5 after the title)' });
      else { const f = S.oneSentence(claim, 30, 'claim'); if (f) out.push({ where: H.path(claim), value: f }); }
      if (more && S.sentences(S.read(more)).length > 2) out.push({ where: H.path(more), value: `${S.sentences(S.read(more)).length} sentences after the claim (2 at most)` });
      if (extra) out.push({ where: H.path(extra), value: 'more than one paragraph after the claim' });
      const parts = S.kids(card).filter(c => c.matches('ul.cm-parts'));
      if (parts.length !== 1) out.push({ where: at, value: `${parts.length} part lists (one ul.cm-parts)` });
      else { const n = S.kids(parts[0]).length; if (n < 2 || n > 5) out.push({ where: H.path(parts[0]), value: `${n} parts (2 to 5)` }); }
      if (S.kids(card).filter(c => c.matches('.cm-parts--matrix')).length > 1) out.push({ where: at, value: 'more than one matrix' });
      const { box, lists } = S.scope(card);
      if (!box || !('Holds when' in lists) || !('Breaks when' in lists)) out.push({ where: at, value: 'no scope with Holds when and Breaks when' });
    }
    return out;
  }),

  inStructured('method', '§8.28', ({ check }) => {
    const S = window.__cms, H = S.H, out = [];
    for (const card of S.cards('cm-method')) {
      if (H.exempt(card, check)) continue;
      const at = H.path(card);
      const lede = S.after(card)[0];
      const f = S.oneSentence(lede && !lede.matches('.cm-t5') ? lede : null, 30, 'objective');
      if (f) out.push({ where: lede ? H.path(lede) : at, value: f });
      const { lists } = S.scope(card);
      if (!('Use when' in lists)) out.push({ where: at, value: 'no scope with Use when' });
      const steps = S.sub(card, 'Steps');
      const items = steps ? [...steps.querySelectorAll(':scope > ol.cm-olist > li')] : [];
      if (!steps) out.push({ where: at, value: 'no Steps part (.cm-sub with ol.cm-olist)' });
      else if (items.length < 3 || items.length > 7) out.push({ where: H.path(steps), value: `${items.length} steps (ol.cm-olist, 3 to 7)` });
      for (const li of items) { const g = S.oneSentence(li, 20, 'step'); if (g) out.push({ where: H.path(li), value: g }); }
      const dec = S.sub(card, 'Decision');
      const p = dec && dec.querySelector(':scope > p');
      if (!p) { out.push({ where: at, value: 'no Decision part (.cm-sub with one p)' }); continue; }
      const t = S.read(p), n = S.sentences(t).length;
      if (!S.placeholder(p) && (n < 1 || n > 2)) out.push({ where: H.path(p), value: `decision: ${n} sentences (1 or 2)` });
      if (/\?/.test(t)) out.push({ where: H.path(p), value: 'decision written as a question (a condition)' });
    }
    return out;
  }),

  inStructured('requirement', '§8.29', ({ check }) => {
    const S = window.__cms, H = S.H, out = [];
    const LEVEL = { Required: '', Recommended: 'cm-chip--dashed', Optional: 'cm-chip--dashed' };
    const STATUS = { Draft: '', 'In review': 'cm-chip--warn', Final: 'cm-chip--ok' };
    const chip = (f, set, what) => {
      const c = f && f.dd ? f.dd.querySelectorAll('.cm-chip') : [];
      if (!f) return [`no ${what}`];
      if (c.length !== 1 || !(H.text(c[0]) in set)) return [`${what}: one chip from ${Object.keys(set).join(', ')}`];
      const want = set[H.text(c[0])], got = S.chipMods(c[0]);
      return got === want ? [] : [`${what} "${H.text(c[0])}" with ${got || 'no modifier'} (${want || 'a plain chip'})`];
    };
    for (const card of S.cards('cm-req')) {
      if (H.exempt(card, check)) continue;
      const at = H.path(card);
      const kicker = card.querySelector(':scope > .cm-card__kicker');
      const m = kicker && H.text(kicker).match(/^Requirement\s+(\S+)$/);
      if (kicker && !S.placeholder(kicker)) {
        if (!m || !/^[A-Z]+-\d{2,}$/.test(m[1])) out.push({ where: H.path(kicker), value: `"${H.text(kicker)}" (Requirement and a key such as REQ-04)` });
        else if (card.id !== m[1].toLowerCase()) out.push({ where: at, value: `id "${card.id}" (${m[1].toLowerCase()}, the key in lower case)` });
      }
      const [statement, rationale] = S.after(card);
      if (!statement || !statement.matches('.cm-t5')) out.push({ where: at, value: 'no statement (p.cm-t5 after the title)' });
      else { const f = S.oneSentence(statement, 30, 'statement'); if (f) out.push({ where: H.path(statement), value: f }); }
      const rn = rationale ? S.sentences(S.read(rationale)).length : 0;
      if (!rationale || (!S.placeholder(rationale) && (rn < 1 || rn > 2))) out.push({ where: rationale ? H.path(rationale) : at, value: `rationale: ${rn} sentences (a p of 1 or 2 after the statement)` });
      const dl = S.kids(card).find(c => c.matches('dl.cm-facts'));
      const fs = dl ? S.facts(dl) : [];
      const get = k => fs.find(f => f.key === k);
      for (const v of chip(get('Level'), LEVEL, 'Level').concat(chip(get('Status'), STATUS, 'Status'))) out.push({ where: dl ? H.path(dl) : at, value: v });
      if (!get('Owner')) out.push({ where: dl ? H.path(dl) : at, value: 'no Owner' });
      const crit = S.sub(card, 'Acceptance criteria');
      const items = crit ? [...crit.querySelectorAll(':scope > ol.cm-olist > li')] : [];
      if (!crit) out.push({ where: at, value: 'no Acceptance criteria part (.cm-sub with ol.cm-olist)' });
      else if (items.length < 1 || items.length > 5) out.push({ where: H.path(crit), value: `${items.length} criteria (1 to 5)` });
      for (const li of items) { const f = S.oneSentence(li, 0, 'criterion'); if (f) out.push({ where: H.path(li), value: f }); }
    }
    return out;
  }),

  inStructured('evaluation', '§8.29', ({ check }) => {
    // Criteria on one scale with whole-number weights; the weighted score is their weighted mean to
    // one decimal; one status chip carries the verdict; a caption gives the source.
    const S = window.__cms, H = S.H, out = [];
    const VERDICT = { Adopt: 'cm-chip--ok', Hold: 'cm-chip--warn', Reject: 'cm-chip--crit' };
    const SCORE = /^(\d+(?:\.\d+)?) of (\d+)$/;
    for (const card of S.cards('cm-eval')) {
      if (H.exempt(card, check)) continue;
      const at = H.path(card);
      const lede = S.after(card)[0];
      const f = S.oneSentence(lede, 30, 'lede');
      if (f) out.push({ where: lede ? H.path(lede) : at, value: f });
      const ol = S.kids(card).find(c => c.matches('ol.cm-criteria'));
      const rows = ol ? S.kids(ol) : [];
      if (!ol) out.push({ where: at, value: 'no criteria (ol.cm-criteria)' });
      else if (rows.length < 2 || rows.length > 6) out.push({ where: H.path(ol), value: `${rows.length} criteria (2 to 6)` });
      let sum = 0, total = 0, scale = null, numeric = !!rows.length;
      for (const li of rows) {
        const rat = H.path(li);
        const sc = li.querySelector(':scope > .cm-criteria__score');
        const ms = sc && H.text(sc).match(SCORE);
        if (!ms) { numeric = false; if (!S.placeholder(sc)) out.push({ where: rat, value: `score "${sc ? H.text(sc) : ''}" (N of M in .cm-criteria__score)` }); }
        const name = li.querySelector('b');
        if (!name || !H.text(name)) out.push({ where: rat, value: 'no criterion name (<b>)' });
        else if (S.words(H.text(name)) > 4) out.push({ where: H.path(name), value: `name "${H.text(name)}": ${S.words(H.text(name))} words (4 at most)` });
        const body = name && name.parentElement !== li ? name.parentElement : null;
        const ev = body ? S.read(body, 'b') : '';
        const ns = S.sentences(ev).length;
        if (!S.placeholder(body) && ns !== 1) out.push({ where: rat, value: `evidence: ${ns} sentences (one, after the name)` });
        const w = li.querySelector(':scope > .cm-meta');
        const mw = w && H.text(w).match(/^weight (\d+)$/);
        if (!mw) { numeric = false; if (!S.placeholder(w)) out.push({ where: rat, value: `weight "${w ? H.text(w) : ''}" ("weight N" in .cm-meta)` }); }
        if (ms && mw) {
          if (scale !== null && ms[2] !== scale) out.push({ where: rat, value: `scale "of ${ms[2]}" after "of ${scale}" (one scale)` });
          scale = scale === null ? ms[2] : scale;
          sum += Number(ms[1]) * Number(mw[1]); total += Number(mw[1]);
        }
      }
      const res = S.kids(card).find(c => c.matches('.cm-eval__result'));
      if (!res) { out.push({ where: at, value: 'no result (.cm-eval__result)' }); continue; }
      if (S.label(res) !== 'Weighted score') out.push({ where: H.path(res), value: `label "${S.label(res)}" (Weighted score)` });
      const v = res.querySelector(':scope > .cm-figure-s');
      const mv = v && H.text(v).match(SCORE);
      if (!mv) { if (!S.placeholder(v)) out.push({ where: H.path(res), value: `value "${v ? H.text(v) : ''}" (N of M in .cm-figure-s)` }); }
      else if (numeric && total) {
        const want = Math.round(sum * 10 / total + 1e-9) / 10;
        if (Math.abs(Number(mv[1]) - want) > 1e-9) out.push({ where: H.path(v), value: `${mv[1]}, but the weighted mean of the criteria is ${want.toFixed(1)}` });
        if (mv[2] !== scale) out.push({ where: H.path(v), value: `of ${mv[2]}, but the criteria are scored of ${scale}` });
      }
      const chips = [...res.querySelectorAll('.cm-chip')];
      if (chips.length !== 1 || !(H.text(chips[0]) in VERDICT)) out.push({ where: H.path(res), value: `${chips.length} verdict chips (exactly 1 of ${Object.keys(VERDICT).join(', ')})` });
      else if (S.chipMods(chips[0]) !== VERDICT[H.text(chips[0])]) out.push({ where: H.path(chips[0]), value: `"${H.text(chips[0])}" with ${S.chipMods(chips[0]) || 'no modifier'} (${VERDICT[H.text(chips[0])]})` });
      const next = res.nextElementSibling;
      const nn = next && next.localName === 'p' ? S.sentences(S.read(next)).length : 0;
      if (!S.placeholder(next) && (nn < 1 || nn > 2)) out.push({ where: H.path(res), value: 'no paragraph of 1 or 2 sentences after the result' });
      const cap = S.kids(card).find(c => c.matches('.cm-caption'));
      if (!cap || ![...cap.querySelectorAll('.cm-caption__line')].some(l => /^Source:/.test(H.text(l)))) out.push({ where: at, value: 'no caption with a source line' });
    }
    return out;
  }),

  inStructured('metric-detail', '§8.30; §8.24; §13.2', ({ check }) => {
    // Definition, the property sheet's required keys, thresholds from the closed set, and no
    // current value inside the definition.
    const S = window.__cms, H = S.H, out = [];
    const NEED = ['Formula', 'Unit', 'Direction', 'Source', 'Owner'];
    const DIRECTION = ['Higher is better', 'Lower is better', 'Nearer the target is better'];
    const BAND = { 'On track': 'cm-chip--ok', 'At risk': 'cm-chip--warn', Breach: 'cm-chip--crit' };
    for (const card of S.cards('cm-metric')) {
      if (H.exempt(card, check)) continue;
      const at = H.path(card);
      const def = S.after(card)[0];
      const dw = def ? S.words(S.read(def)) : 0;
      if (!def || def.matches('.cm-t5')) out.push({ where: at, value: 'no definition (p after the title)' });
      else if (!S.placeholder(def) && (dw < 15 || dw > 60)) out.push({ where: H.path(def), value: `definition: ${dw} words (15 to 60)` });
      const props = S.kids(card).find(c => c.matches('.cm-props'));
      const keys = new Map();
      if (props) for (const dt of props.querySelectorAll('dt')) keys.set(H.text(dt.cloneNode(true)).replace(/\s*\(.*\)$/, ''), dt.nextElementSibling);
      if (!props) out.push({ where: at, value: 'no property sheet (.cm-props)' });
      else {
        for (const k of NEED) if (!keys.has(k)) out.push({ where: H.path(props), value: `no ${k}` });
        const fdd = keys.get('Formula');
        if (fdd && !fdd.querySelector('code') && !S.placeholder(fdd)) out.push({ where: H.path(fdd), value: 'formula not in <code>' });
        const dir = keys.get('Direction');
        if (dir && !S.placeholder(dir) && !DIRECTION.includes(H.text(dir))) out.push({ where: H.path(dir), value: `direction "${H.text(dir)}" (${DIRECTION.join(', ')})` });
        const src = keys.get('Source');
        if (src && !S.placeholder(src) && !src.querySelector('a.cm-cite')) out.push({ where: H.path(src), value: 'source without a citation (a.cm-cite)' });
      }
      const th = S.sub(card, 'Thresholds');
      if (th) {
        const bands = [...th.querySelectorAll(':scope > ul.cm-bands > li')];
        if (bands.length < 2 || bands.length > 4) out.push({ where: H.path(th), value: `${bands.length} bands (ul.cm-bands, 2 to 4)` });
        for (const li of bands) {
          const b = li.querySelector('b');
          if (!b || !H.text(b)) out.push({ where: H.path(li), value: 'no range (<b>)' });
          const body = b && b.parentElement !== li ? b.parentElement : null;
          const ns = body ? S.sentences(S.read(body, 'b')).length : 0;
          if (!S.placeholder(body) && ns !== 1) out.push({ where: H.path(li), value: `response: ${ns} sentences (one, after the range)` });
          const chips = [...li.querySelectorAll('.cm-chip')];
          if (chips.length !== 1 || !(H.text(chips[0]) in BAND)) out.push({ where: H.path(li), value: `${chips.length} status chips (exactly 1 of ${Object.keys(BAND).join(', ')})` });
          else if (S.chipMods(chips[0]) !== BAND[H.text(chips[0])]) out.push({ where: H.path(chips[0]), value: `"${H.text(chips[0])}" with ${S.chipMods(chips[0]) || 'no modifier'} (${BAND[H.text(chips[0])]})` });
        }
      }
      const rel = S.sub(card, 'Related metrics');
      if (rel) {
        const items = [...rel.querySelectorAll(':scope > ul.cm-related > li')];
        if (items.length < 1 || items.length > 4) out.push({ where: H.path(rel), value: `${items.length} related metrics (ul.cm-related, 1 to 4)` });
        for (const li of items) {
          const tag = li.querySelector(':scope > .cm-tag');
          if (tag && !S.placeholder(tag) && H.text(tag) !== 'Metric') out.push({ where: H.path(tag), value: `tag "${H.text(tag)}" (Metric)` });
        }
      }
      for (const el of card.querySelectorAll('.cm-kpi, .cm-kpis, .cm-meter, [data-spark], .cm-status, .cm-chart, .cm-delta')) {
        out.push({ where: H.path(el), value: 'a current value inside a metric detail (it goes in the KPI strip or the status block)' });
      }
    }
    return out;
  }),
];
