// Document kinds: the required parts of a guide and of a reference (SPEC.md sections 7.3 to 7.5), and
// the two components those kinds add, the procedure (section 8.23) and the related list (section
// 8.24). Read on the page as written. Each in-page function is self-contained, so helpers are
// repeated inside it. A report's anatomy is checked in checks/structure.mjs.

export default [
  {
    // Each required part is a top-level section with the id the spec gives it, in the spec's order.
    // The first part opens the document with one paragraph; Notes & sources closes it. A part the
    // spec lets a document leave out may be replaced by its omission comment in <main>. A document
    // may add sections between the required parts. No KPI strip: the summary and
    // featured budgets (checks/budgets.mjs) hold the other blocks these kinds never carry.
    name: 'kind-anatomy', level: 'fail', source: 'SPEC §7.3; §7.4; §7.5', once: true, kinds: ['guide', 'reference'],
    inPage: ({ check }) => {
      const H = window.__cm, d = H.source(), out = [], kind = H.kind();
      const SOURCES = { id: 'sources', name: 'Notes & sources', has: '.cm-sources', what: 'a sources list (.cm-sources)' };
      const PARTS = {
        guide: [
          { id: 'purpose', name: 'Purpose', lede: true },
          { id: 'prerequisites', name: 'Prerequisites', has: 'ul.cm-list, ol.cm-olist', what: 'a list (ul.cm-list)', omit: true },
          { id: 'steps', name: 'Steps', has: 'ol.cm-procedure', what: 'a procedure (ol.cm-procedure)' },
          { id: 'exceptions', name: 'Exceptions and recovery', omit: true },
          { id: 'related', name: 'Related documents', has: 'ul.cm-related', what: 'a related list (ul.cm-related)', omit: true },
          SOURCES,
        ],
        reference: [
          { id: 'definition', name: 'Definition', lede: true },
          { id: 'properties', name: 'Properties', has: '.cm-props', what: 'a property sheet (.cm-props)' },
          { id: 'relationships', name: 'Relationships', omit: true },
          { id: 'examples', name: 'Examples', omit: true },
          SOURCES,
        ],
      }[kind];
      const main = d.querySelector('main') || d.body;
      const sections = [...main.querySelectorAll('section.cm-section')]
        .filter(s => !H.exempt(s, check) && !s.parentElement.closest('section'));
      let prev = -1, prevName = '';
      for (const p of PARTS) {
        const at = sections.findIndex(s => s.id === p.id);
        if (at < 0) {
          if (!(p.omit && H.omitted(main, p.id))) out.push({ where: 'main', value: `no ${p.name} section (section#${p.id})${p.omit ? `, and no omission comment (cm-omit ${p.id})` : ''}` });
          continue;
        }
        const s = sections[at];
        if (at < prev) out.push({ where: H.path(s), value: `${p.name} comes before ${prevName}` });
        else { prev = at; prevName = p.name; }
        const body = s.querySelector(':scope > .cm-section__body');
        if (!body || !body.firstElementChild) { out.push({ where: H.path(s), value: `the ${p.name} section is empty` }); continue; }
        if (p.lede) {
          const first = body.firstElementChild;
          const one = first.matches('.cm-prose') && first.children.length === 1 && first.firstElementChild.localName === 'p' && H.text(first);
          if (!one) out.push({ where: H.path(first), value: `${p.name} does not open with one paragraph (a .cm-prose holding one <p>)` });
        }
        if (p.has && !s.querySelector(p.has)) out.push({ where: H.path(s), value: `${p.name} holds no ${p.what}` });
      }
      const first = sections.find(s => s.id === PARTS[0].id);
      if (first && sections[0] !== first) out.push({ where: H.path(sections[0]), value: `the first section is not ${PARTS[0].name} (section#${PARTS[0].id})` });
      const last = sections.find(s => s.id === SOURCES.id);
      if (last && sections[sections.length - 1] !== last) out.push({ where: H.path(last), value: 'Notes & sources is not the last section' });
      for (const k of d.querySelectorAll('.cm-kpis')) if (!H.exempt(k, check)) out.push({ where: H.path(k), value: `a KPI strip in a ${kind} (none)` });
      return out;
    },
  },

  {
    // A procedure is an ordered list of steps. Each step opens with its title, a heading, carries
    // what to do, and closes with its outcome: the label "Outcome" on a line of its own, then the
    // outcome sentence. A procedure never sits inside another.
    name: 'procedure', level: 'fail', source: 'SPEC §8.23', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const ol of H.source().querySelectorAll('.cm-procedure')) {
        if (H.exempt(ol, check)) continue;
        if (ol.localName !== 'ol') out.push({ where: H.path(ol), value: `.cm-procedure on <${ol.localName}> (an <ol>)` });
        if (ol.parentElement.closest('.cm-procedure')) out.push({ where: H.path(ol), value: 'a procedure inside a procedure' });
        for (const li of ol.children) {
          if (li.localName !== 'li') { out.push({ where: H.path(li), value: `<${li.localName}> in a procedure (steps are <li>)` }); continue; }
          const kids = [...li.children];
          const title = kids[0], outcome = kids[kids.length - 1];
          if (!title || !title.matches('.cm-procedure__title') || !/^h[2-6]$/.test(title.localName) || !H.text(title)) {
            out.push({ where: H.path(li), value: 'the step does not open with its title (a heading, .cm-procedure__title)' });
          }
          const outcomes = li.querySelectorAll('.cm-procedure__outcome');
          if (!outcome || !outcome.matches('.cm-procedure__outcome')) out.push({ where: H.path(li), value: 'the step does not close with its outcome (.cm-procedure__outcome)' });
          else {
            const label = outcome.querySelector(':scope > .cm-label');
            const text = outcome.querySelector(':scope > p');
            if (!label || H.text(label) !== 'Outcome') out.push({ where: H.path(outcome), value: 'no "Outcome" label (.cm-label) on its own line' });
            if (!text || !H.text(text)) out.push({ where: H.path(outcome), value: 'no outcome sentence (<p>)' });
          }
          if (outcomes.length > 1) out.push({ where: H.path(li), value: `${outcomes.length} outcomes in one step (exactly 1)` });
          if (kids.length < 3) out.push({ where: H.path(li), value: 'nothing to do between the title and the outcome' });
        }
      }
      return out;
    },
  },

  {
    // Every item of a related list carries a tag from the closed set that names what the item is, a
    // link to it, and one sentence on how it relates. A link to a place in the page points at an
    // element that exists.
    name: 'related', level: 'fail', source: 'SPEC §8.24', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, d = H.source(), out = [];
      const TAGS = ['Report', 'Guide', 'Reference', 'Metric', 'Dataset', 'System'];
      for (const ul of d.querySelectorAll('.cm-related')) {
        if (H.exempt(ul, check)) continue;
        if (ul.localName !== 'ul') out.push({ where: H.path(ul), value: `.cm-related on <${ul.localName}> (a <ul>)` });
        for (const li of ul.children) {
          if (li.localName !== 'li') { out.push({ where: H.path(li), value: `<${li.localName}> in a related list (items are <li>)` }); continue; }
          const tag = li.querySelector(':scope > .cm-tag');
          const a = li.querySelector(':scope > a');
          const p = li.querySelector(':scope > p');
          const href = a ? (a.getAttribute('href') || '').trim() : '';
          if (!tag || !H.text(tag)) out.push({ where: H.path(li), value: 'no tag naming what the item is (.cm-tag)' });
          else if (!TAGS.includes(H.text(tag))) out.push({ where: H.path(tag), value: `tag "${H.text(tag)}" (${TAGS.join(', ')})` });
          if (!a || !href || !H.text(a)) out.push({ where: H.path(li), value: 'no link with a title (<a href>)' });
          else if (href[0] === '#' && !d.getElementById(decodeURIComponent(href.slice(1)))) out.push({ where: H.path(a), value: `href="${href}" points at nothing` });
          if (!p || !H.text(p)) out.push({ where: H.path(li), value: 'no sentence on how it relates (<p>)' });
        }
      }
      return out;
    },
  },
];
