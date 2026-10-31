// Page types on the report kind: the roadmap (SPEC.md section 7.14) and the case study (section
// 7.15). Each check runs only on a page whose <meta name="cm-type"> names its type; the runner skips
// it elsewhere through `types`, and the check also returns nothing on a page of another type. Read on
// the page as written. Each in-page function is self-contained, so helpers are repeated inside it. A
// value that is still a template placeholder ({{ … }}) is not judged.

export default [
  {
    // A roadmap keeps every part of a report and adds three: Goal, Milestones and Out of scope, in
    // that order, after the executive summary and before Recommendations and the appendices. The goal
    // opens its section as one paragraph with its key phrase in bold, a date and a citation for its
    // expected effect. Milestones holds a lede, the dated status block straight after it, a timeline
    // with one item per milestone and a table of the same milestones. Each timeline item names a
    // milestone, states its exit criteria in one sentence ("Done when …") and carries one status chip.
    // Each table row gives the milestone's key, owner, due date and dependencies, in the timeline's
    // order and on its dates; a milestone depends only on milestones in the table that fall due no
    // later than it does. Out of scope holds a list.
    name: 'type-roadmap', level: 'fail', source: 'SPEC §7.14', once: true, types: ['roadmap'],
    inPage: ({ check }) => {
      const H = window.__cm, d = H.source(), out = [];
      const type = d.querySelector('meta[name="cm-type"]');
      if (!type || (type.getAttribute('content') || '').trim() !== 'roadmap') return out;
      const PH = /\{\{[\s\S]*?\}\}/;
      const main = d.querySelector('main') || d.body;
      const sections = [...main.querySelectorAll('section.cm-section')].filter(s => !H.exempt(s, check) && !s.parentElement.closest('section'));
      const at = id => sections.findIndex(s => s.id === id);
      const body = s => s && s.querySelector(':scope > .cm-section__body');

      // Parts and their order.
      const PARTS = [['goal', 'Goal'], ['milestones', 'Milestones'], ['out-of-scope', 'Out of scope']];
      let prev = at('summary'), prevName = 'the executive summary';
      for (const [id, name] of PARTS) {
        const i = at(id);
        if (i < 0) { out.push({ where: 'main', value: `no ${name} section (section#${id})` }); continue; }
        if (i < prev) out.push({ where: H.path(sections[i]), value: `${name} comes before ${prevName}` });
        else { prev = i; prevName = name; }
        if (!body(sections[i]) || !body(sections[i]).firstElementChild) out.push({ where: H.path(sections[i]), value: `the ${name} section is empty` });
      }
      for (const [id, name] of [['recommendations', 'Recommendations'], ['methodology', 'Methodology'], ['sources', 'Notes & sources']]) {
        const i = at(id), last = at('out-of-scope');
        if (i >= 0 && last >= 0 && i < last) out.push({ where: H.path(sections[i]), value: `${name} comes before Out of scope (the roadmap's parts sit between the summary and Recommendations)` });
      }

      // Goal: one opening paragraph, its key phrase in bold, with the date the goal is due.
      const goal = sections[at('goal')];
      if (goal && body(goal)) {
        const first = body(goal).firstElementChild;
        const p = first && first.matches('.cm-prose') ? first.querySelector(':scope > p') : null;
        if (!p) out.push({ where: H.path(first || goal), value: 'Goal does not open with a paragraph (.cm-prose > p)' });
        else {
          const t = H.text(p);
          if (!p.querySelector('strong, b') && !PH.test(t)) out.push({ where: H.path(p), value: 'the goal has no key phrase in bold' });
          if (!PH.test(t) && !/\b(19|20)\d{2}\b/.test(t)) out.push({ where: H.path(p), value: 'the goal names no date (a year it is due by)' });
          if (!PH.test(t) && !p.querySelector('a.cm-cite')) out.push({ where: H.path(p), value: 'the goal cites no source for its expected effect (a.cm-cite)' });
        }
      }

      // Milestones: lede, status block, timeline, table.
      const ms = sections[at('milestones')];
      if (ms && body(ms)) {
        const kids = [...body(ms).children];
        if (!kids[0] || !kids[0].matches('.cm-prose')) out.push({ where: H.path(kids[0] || ms), value: 'Milestones does not open with its lede (.cm-prose)' });
        else if (!kids[1] || !kids[1].matches('.cm-status')) out.push({ where: H.path(kids[1] || kids[0]), value: 'the dated status block (.cm-status) does not follow the Milestones lede' });

        const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const STATUS = { Done: 'cm-chip--ok', 'On track': '', 'At risk': 'cm-chip--warn', Late: 'cm-chip--crit', Planned: '' };
        const tl = ms.querySelector('ol.cm-timeline');
        const items = [];
        if (!tl) out.push({ where: H.path(ms), value: 'no timeline of the milestones (ol.cm-timeline)' });
        else for (const li of [...tl.children].filter(c => c.localName === 'li')) {
          const where = H.path(li);
          const date = li.querySelector('.cm-timeline__date');
          const title = li.querySelector('.cm-timeline__title');
          const bodyP = li.querySelector('.cm-timeline__body');
          const small = date && date.querySelector('small');
          const md = date ? [...date.childNodes].filter(n => n.nodeType === 3).map(n => n.nodeValue).join('').trim() : '';
          const m = md.match(/^([A-Z][a-z]{2}) (\d{2})$/);
          const year = small ? H.text(small) : '';
          let iso = '';
          if (m && MONTHS.includes(m[1]) && /^\d{4}$/.test(year)) iso = `${year}-${String(MONTHS.indexOf(m[1]) + 1).padStart(2, '0')}-${m[2]}`;
          else if (!PH.test(date ? date.textContent : '')) out.push({ where, value: `date "${date ? H.text(date) : ''}" (Mon DD with the year in <small>)` });
          const name = title ? H.text(title) : '';
          if (!name) out.push({ where, value: 'no milestone name (.cm-timeline__title)' });
          const exit = bodyP ? H.text(bodyP) : '';
          if (!PH.test(exit) && !/^Done when \S/.test(exit)) out.push({ where, value: `no exit criteria: the body does not open "Done when" ("${exit.slice(0, 40)}")` });
          else if (!PH.test(exit) && /[.!?]\s+\S/.test(exit)) out.push({ where, value: 'exit criteria of more than one sentence' });
          const chips = [...li.querySelectorAll('.cm-chip')];
          const placeholder = PH.test(li.textContent);
          if (chips.length !== 1) out.push({ where, value: `${chips.length} status chips (exactly 1: ${Object.keys(STATUS).join(', ')})` });
          else if (!placeholder) {
            const word = H.text(chips[0]);
            const mods = [...chips[0].classList].filter(c => c.startsWith('cm-chip--')).join(' ');
            if (!(word in STATUS)) out.push({ where: H.path(chips[0]), value: `status "${word}" (${Object.keys(STATUS).join(', ')})` });
            else if (mods !== STATUS[word]) out.push({ where: H.path(chips[0]), value: `"${word}" with ${mods || 'no modifier'} (${STATUS[word] || 'a plain chip'})` });
            if ((word === 'Done') !== li.classList.contains('is-done')) out.push({ where, value: word === 'Done' ? 'a Done milestone without is-done' : `an is-done item with status "${word}"` });
          }
          items.push({ li, iso, name, placeholder });
        }
        for (let i = 1; i < items.length; i++) {
          if (items[i].iso && items[i - 1].iso && items[i].iso < items[i - 1].iso) out.push({ where: H.path(items[i].li), value: `${items[i].iso} after ${items[i - 1].iso} (oldest first)` });
        }

        // The milestone table: the first table in the section whose head names Key and Depends on.
        const COLS = ['Key', 'Milestone', 'Owner', 'Due', 'Depends on'];
        const heads = t => t.tHead ? [...t.tHead.rows[t.tHead.rows.length - 1].cells].map(c => H.text(c)) : [];
        const table = [...ms.querySelectorAll('table.cm-table')].find(t => heads(t).includes('Key') || heads(t).includes('Depends on'));
        if (!table) out.push({ where: H.path(ms), value: `no milestone table (table.cm-table with the columns ${COLS.join(', ')})` });
        else {
          const head = [...table.tHead.rows[table.tHead.rows.length - 1].cells].map(c => H.text(c));
          const col = {};
          COLS.forEach((c, i) => {
            if (head[i] !== c) out.push({ where: H.path(table.tHead), value: `column ${i + 1} is "${head[i] || ''}" (${c}); the first five columns are ${COLS.join(', ')}` });
            col[c] = i;
          });
          const rows = [...table.tBodies].flatMap(b => [...b.rows]);
          const byKey = new Map();
          const parsed = rows.map(r => {
            const cell = c => r.cells[col[c]];
            const txt = c => (cell(c) ? H.text(cell(c)) : '');
            const time = cell('Due') && cell('Due').querySelector('time[datetime]');
            const due = time ? time.getAttribute('datetime') : txt('Due');
            return { r, key: txt('Key'), name: txt('Milestone'), owner: txt('Owner'), due, deps: txt('Depends on'), placeholder: PH.test(r.textContent) };
          });
          for (const p of parsed) {
            if (p.placeholder) continue;
            const where = H.path(p.r);
            if (!/^M\d+$/.test(p.key)) out.push({ where, value: `key "${p.key}" (M and a number)` });
            else if (byKey.has(p.key)) out.push({ where, value: `key ${p.key} appears twice` });
            else byKey.set(p.key, p);
            if (!p.name) out.push({ where, value: 'no milestone name' });
            if (!/\p{L}/u.test(p.owner)) out.push({ where, value: `${p.key}: no owner` });
            if (!/^\d{4}-\d{2}-\d{2}$/.test(p.due)) out.push({ where, value: `${p.key}: due "${p.due}" (an ISO date, as <time datetime>)` });
          }
          for (const p of parsed) {
            if (p.placeholder) continue;
            const where = H.path(p.r);
            if (p.deps === 'None') continue;
            const keys = p.deps.split(/,\s*/);
            if (!p.deps || !keys.every(k => /^M\d+$/.test(k))) { out.push({ where, value: `${p.key}: depends on "${p.deps}" (None, or keys such as "M2, M3")` }); continue; }
            for (const k of keys) {
              const dep = byKey.get(k);
              if (k === p.key) out.push({ where, value: `${p.key} depends on itself` });
              else if (!dep) out.push({ where, value: `${p.key} depends on ${k}, which the table does not list` });
              else if (/^\d{4}-\d{2}-\d{2}$/.test(dep.due) && /^\d{4}-\d{2}-\d{2}$/.test(p.due) && dep.due > p.due) out.push({ where, value: `${p.key}, due ${p.due}, depends on ${k}, due later on ${dep.due}` });
            }
          }
          // The timeline and the table list the same milestones, in the same order, on the same dates.
          if (items.length && parsed.length) {
            if (items.length !== parsed.length) out.push({ where: H.path(table), value: `${parsed.length} milestones in the table and ${items.length} in the timeline` });
            items.forEach((it, i) => {
              const p = parsed[i];
              if (!p || it.placeholder || p.placeholder) return;
              if (it.name !== p.name) out.push({ where: H.path(p.r), value: `row ${i + 1} is "${p.name}" where the timeline has "${it.name}"` });
              else if (it.iso && /^\d{4}-\d{2}-\d{2}$/.test(p.due) && it.iso !== p.due) out.push({ where: H.path(p.r), value: `${p.key} due ${p.due} where the timeline has ${it.iso}` });
            });
          }
        }
      }

      // Out of scope: a list of what the roadmap leaves out.
      const oos = sections[at('out-of-scope')];
      if (oos && !oos.querySelector('ul.cm-list > li')) out.push({ where: H.path(oos), value: 'Out of scope holds no list (ul.cm-list) of what the roadmap leaves out' });
      return out;
    },
  },

  {
    // A case study keeps every part of a report and adds five: Situation, Intervention, Results,
    // Confounds and Failures, in that order, after the executive summary and before Recommendations
    // and the appendices. The situation cites its source; the intervention holds a timeline of its
    // dated changes. Results compares periods of the same length, named in a property sheet as Before
    // and After, and holds a table whose every measure carries a direction from a closed set; the
    // methodology appendix defines the "No change" threshold. A claim of effect cites its source: each
    // key finding, each paragraph of Results and the results table's caption. Confounds and Failures
    // each list at least one entry. The limits of the study are limitation callouts, or the
    // limitation register in the methodology appendix (SPEC §8.22).
    name: 'type-case-study', level: 'fail', source: 'SPEC §7.15', once: true, types: ['case-study'],
    inPage: ({ check }) => {
      const H = window.__cm, d = H.source(), out = [];
      const type = d.querySelector('meta[name="cm-type"]');
      if (!type || (type.getAttribute('content') || '').trim() !== 'case-study') return out;
      const PH = /\{\{[\s\S]*?\}\}/;
      const main = d.querySelector('main') || d.body;
      const sections = [...main.querySelectorAll('section.cm-section')].filter(s => !H.exempt(s, check) && !s.parentElement.closest('section'));
      const at = id => sections.findIndex(s => s.id === id);
      const body = s => s && s.querySelector(':scope > .cm-section__body');
      const cited = el => !!el.querySelector('a.cm-cite') || PH.test(el.textContent);

      const PARTS = [['situation', 'Situation'], ['intervention', 'Intervention'], ['results', 'Results'], ['confounds', 'Confounds'], ['failures', 'Failures']];
      let prev = at('summary'), prevName = 'the executive summary';
      for (const [id, name] of PARTS) {
        const i = at(id);
        if (i < 0) { out.push({ where: 'main', value: `no ${name} section (section#${id})` }); continue; }
        if (i < prev) out.push({ where: H.path(sections[i]), value: `${name} comes before ${prevName}` });
        else { prev = i; prevName = name; }
        if (!body(sections[i]) || !body(sections[i]).firstElementChild) out.push({ where: H.path(sections[i]), value: `the ${name} section is empty` });
      }
      for (const [id, name] of [['recommendations', 'Recommendations'], ['methodology', 'Methodology'], ['sources', 'Notes & sources']]) {
        const i = at(id), last = at('failures');
        if (i >= 0 && last >= 0 && i < last) out.push({ where: H.path(sections[i]), value: `${name} comes before Failures (the case study's parts sit between the summary and Recommendations)` });
      }

      // Every key finding cites its source.
      for (const li of d.querySelectorAll('.cm-summary ol.cm-findings > li')) {
        if (!H.exempt(li, check) && !cited(li)) out.push({ where: H.path(li), value: 'a key finding with no citation (a.cm-cite)' });
      }

      // Situation: the state before, with its source.
      const sit = sections[at('situation')];
      if (sit && body(sit)) {
        const first = body(sit).firstElementChild;
        if (!first || !first.matches('.cm-prose')) out.push({ where: H.path(first || sit), value: 'Situation does not open with a paragraph (.cm-prose)' });
        else if (!cited(first)) out.push({ where: H.path(first), value: 'the situation cites no source (a.cm-cite)' });
      }

      // Intervention: what changed and when, as a timeline.
      const int = sections[at('intervention')];
      if (int && !int.querySelector('ol.cm-timeline > li')) out.push({ where: H.path(int), value: 'Intervention holds no timeline of its dated changes (ol.cm-timeline)' });

      // Results: comparable periods, every measure with its direction, claims cited.
      const res = sections[at('results')];
      if (res) {
        const facts = {};
        for (const dl of res.querySelectorAll('.cm-props > dl')) {
          for (const dt of dl.querySelectorAll(':scope > dt')) {
            const dd = dt.nextElementSibling;
            const key = [...dt.childNodes].filter(n => n.nodeType === 3).map(n => n.nodeValue).join('').trim();
            if (dd && dd.localName === 'dd') facts[key] = { dd, text: H.text(dd) };
          }
        }
        const period = k => {
          const f = facts[k];
          if (!f) { out.push({ where: H.path(res), value: `no ${k} period in a property sheet (.cm-props with dt "${k}")` }); return null; }
          if (PH.test(f.text)) return null;
          const m = f.text.match(/^(\d{4}-\d{2}-\d{2}) → (\d{4}-\d{2}-\d{2})$/);
          if (!m || Number.isNaN(Date.parse(m[1])) || Number.isNaN(Date.parse(m[2])) || m[2] < m[1]) { out.push({ where: H.path(f.dd), value: `${k} "${f.text}" (YYYY-MM-DD → YYYY-MM-DD)` }); return null; }
          return { from: m[1], to: m[2], days: Math.round((Date.parse(m[2]) - Date.parse(m[1])) / 864e5) + 1 };
        };
        const before = period('Before'), after = period('After');
        if (before && after) {
          if (before.days !== after.days) out.push({ where: H.path(facts.After.dd), value: `periods of ${before.days} and ${after.days} days (the same length)` });
          if (after.from <= before.to) out.push({ where: H.path(facts.After.dd), value: `After starts ${after.from}, on or before Before ends ${before.to}` });
        }

        const COLS = ['Measure', 'Before', 'After', 'Change', 'Direction'];
        const DIRECTIONS = ['Better', 'No change', 'Worse'];
        const heads = t => t.tHead ? [...t.tHead.rows[t.tHead.rows.length - 1].cells].map(c => H.text(c)) : [];
        const table = [...res.querySelectorAll('table.cm-table')].find(t => heads(t).includes('Direction') || heads(t).includes('Measure'));
        if (!table) out.push({ where: H.path(res), value: `no results table (table.cm-table with the columns ${COLS.join(', ')})` });
        else {
          const head = [...table.tHead.rows[table.tHead.rows.length - 1].cells].map(c => H.text(c));
          COLS.forEach((c, i) => { if (head[i] !== c) out.push({ where: H.path(table.tHead), value: `column ${i + 1} is "${head[i] || ''}" (${c}); the columns are ${COLS.join(', ')}` }); });
          const rows = [...table.tBodies].flatMap(b => [...b.rows]);
          if (!rows.length) out.push({ where: H.path(table), value: 'the results table has no measures' });
          const di = head.indexOf('Direction');
          for (const r of rows) {
            const cell = r.cells[di];
            const t = cell ? H.text(cell) : '';
            if (!PH.test(r.textContent) && !DIRECTIONS.includes(t)) out.push({ where: H.path(r), value: `direction "${t}" (${DIRECTIONS.join(', ')})` });
            for (const c of [...r.cells].slice(1, 4)) if (!H.text(c) && !PH.test(r.textContent)) out.push({ where: H.path(r), value: 'a measure with an empty Before, After or Change' });
          }
          const meth = sections[at('methodology')];
          const terms = meth ? [...meth.querySelectorAll('.cm-def dt')].map(dt => H.text(dt)) : [];
          if (rows.length && !terms.includes('No change') && !PH.test(table.textContent)) out.push({ where: H.path(meth || res), value: 'the methodology appendix does not define "No change" (a .cm-def term giving the threshold)' });
          const group = (table.closest('.cm-table-wrap') || table).parentElement;
          const cap = group && [...group.children].find(c => c.matches('.cm-caption'));
          if (cap && !cited(cap)) out.push({ where: H.path(cap), value: 'the results table caption cites no source (a.cm-cite)' });
        }
        for (const p of res.querySelectorAll('.cm-section__body > .cm-prose > p')) {
          if (!cited(p)) out.push({ where: H.path(p), value: `a Results paragraph with no citation: "${H.text(p).slice(0, 48)}"` });
        }
      }

      // Confounds and Failures: at least one entry each, as list items or table rows.
      const entries = s => s ? s.querySelectorAll('ul.cm-list > li, ol.cm-olist > li, table.cm-table > tbody > tr').length : 0;
      for (const [id, name, what] of [['confounds', 'Confounds', 'change that could move a measure'], ['failures', 'Failures', 'part that did not work']]) {
        const s = sections[at(id)];
        if (s && !entries(s)) out.push({ where: H.path(s), value: `${name} names no ${what} (a list or a table)` });
      }

      // Limits: limitation callouts, or the register in the methodology appendix.
      const callouts = [...main.querySelectorAll('.cm-callout--limitation')].filter(c => !H.exempt(c, check));
      const meth = sections[at('methodology')];
      const register = meth ? meth.querySelectorAll('ul.cm-limits > li').length : 0;
      const stray = [...main.querySelectorAll('ul.cm-limits')].filter(u => !meth || !meth.contains(u));
      if (!callouts.length && !register) out.push({ where: 'main', value: 'no limits: no limitation callout and no limitation register (ul.cm-limits) in the methodology appendix' });
      for (const u of stray) out.push({ where: H.path(u), value: 'a limitation register outside the methodology appendix (A.2)' });
      return out;
    },
  },
];
