// Sources, citations, status and change: SPEC.md sections 8.21 and 8.22. Read once, on the page as
// written. A template placeholder ({{ … }}) stands for a value still to be filled, so a field holding
// one counts as present and its form is not tested; the writing checks read placeholders the same
// way (record 074). Each in-page function is self-contained, so helpers are repeated inside it.

export default [
  {
    // Each source entry: id src-N, key SN in .cm-id, a title in <b>, a type tag, a locator (a link
    // that leaves the page, or code) and a date in <time datetime>. Keys run in order with no repeat.
    name: 'source-entries', level: 'fail', source: 'SPEC §8.21; §14 item 11', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [], seen = new Map();
      const PH = /\{\{[\s\S]*?\}\}/;
      const iso = v => PH.test(v) || (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(v) && !Number.isNaN(Date.parse(v)));
      for (const list of H.source().querySelectorAll('ol.cm-sources')) {
        if (H.exempt(list, check)) continue;
        let last = 0;
        for (const li of [...list.children].filter(c => c.localName === 'li')) {
          const at = H.path(li), m = (li.id || '').match(/^src-(\d+)$/);
          if (!m) { out.push({ where: at, value: `id "${li.id}" (src-N)` }); continue; }
          const n = Number(m[1]);
          const key = li.querySelector(':scope > .cm-id');
          if (!key || H.text(key) !== `S${n}`) out.push({ where: at, value: `key "${key ? H.text(key) : ''}" for id ${li.id} (S${n} in .cm-id)` });
          if (seen.has(n)) out.push({ where: at, value: `key S${n} is used twice` });
          seen.set(n, li);
          if (n <= last) out.push({ where: at, value: `key S${n} after S${last} (keys run in order)` });
          last = Math.max(last, n);
          const title = li.querySelector('b, strong');
          if (!title || !H.text(title)) out.push({ where: at, value: 'no title (<b>)' });
          const leaves = [...li.querySelectorAll('a[href]')].some(a => !a.matches('.cm-back') && !(a.getAttribute('href') || '').startsWith('#'));
          if (!leaves && !li.querySelector('code')) out.push({ where: at, value: 'no locator (a link to the source, or its system and path in <code>)' });
          const time = li.querySelector('time');
          if (!time) out.push({ where: at, value: 'no date (<time datetime>)' });
          else if (!iso(time.getAttribute('datetime') || '')) out.push({ where: H.path(time), value: `datetime "${time.getAttribute('datetime') || ''}" (an ISO date)` });
        }
      }
      return out;
    },
  },

  {
    // Every citation carries an id, points at a source entry and reads that entry's key.
    name: 'citations', level: 'fail', source: 'SPEC §8.21; §14 item 11', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, d = H.source(), out = [];
      for (const a of d.querySelectorAll('a.cm-cite')) {
        if (H.exempt(a, check)) continue;
        const h = a.getAttribute('href') || '';
        const entry = h[0] === '#' ? d.getElementById(h.slice(1)) : null;
        if (!a.id) out.push({ where: H.path(a), value: `citation ${H.text(a)} has no id, so its source cannot link back` });
        if (!entry || !entry.matches('ol.cm-sources > li')) { out.push({ where: H.path(a), value: `href="${h}" does not point at a source entry` }); continue; }
        const key = entry.querySelector(':scope > .cm-id');
        if (key && H.text(a) !== H.text(key)) out.push({ where: H.path(a), value: `reads "${H.text(a)}" but points at ${H.text(key)}` });
      }
      return out;
    },
  },

  {
    // A cited source ends with one back link, to its first citation. A source no citation points at
    // is listed only, and has no back link.
    name: 'source-backlinks', level: 'fail', source: 'SPEC §8.21; §14 item 11', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, d = H.source(), out = [];
      const cites = [...d.querySelectorAll('a.cm-cite')];
      for (const li of d.querySelectorAll('ol.cm-sources > li')) {
        if (H.exempt(li, check)) continue;
        const mine = li.id ? cites.filter(a => a.getAttribute('href') === `#${li.id}`) : [];
        const backs = [...li.querySelectorAll('a.cm-back')];
        if (!mine.length) {
          if (backs.length) out.push({ where: H.path(li), value: 'listed only (no citation points at it), but has a back link' });
          continue;
        }
        if (backs.length !== 1) { out.push({ where: H.path(li), value: `${backs.length} back links (exactly 1, to its first citation)` }); continue; }
        const want = mine[0].id ? `#${mine[0].id}` : '';
        const got = backs[0].getAttribute('href') || '';
        if (got !== want) out.push({ where: H.path(backs[0]), value: `href="${got}", not the first citation of ${li.id}${want ? ` (${want})` : ''}` });
      }
      return out;
    },
  },

  {
    // A disagreement names its quantity, gives two or three values each with a citation, and closes
    // with the reason they differ.
    name: 'disagreement', level: 'fail', source: 'SPEC §8.21', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const b of H.source().querySelectorAll('.cm-disagree')) {
        if (H.exempt(b, check)) continue;
        const at = H.path(b);
        const label = b.querySelector(':scope > .cm-label');
        if (!label || H.text(label) !== 'Disagreement') out.push({ where: at, value: 'no "Disagreement" label (.cm-label)' });
        const q = b.querySelector(':scope > .cm-t5');
        if (!q || !H.text(q)) out.push({ where: at, value: 'no quantity line (.cm-t5)' });
        const values = [...b.querySelectorAll(':scope > dl > div')];
        if (values.length < 2 || values.length > 3) out.push({ where: at, value: `${values.length} values (2 or 3)` });
        for (const v of values) {
          const dt = v.querySelector(':scope > dt'), dd = v.querySelector(':scope > dd');
          if (!dt || !H.text(dt)) out.push({ where: H.path(v), value: 'no value (<dt>)' });
          if (!dd || !dd.querySelector('a.cm-cite')) out.push({ where: H.path(v), value: 'value without a cited source (<dd> with a.cm-cite)' });
        }
        const why = b.lastElementChild;
        if (!why || why.localName !== 'p' || why.matches('.cm-t5') || !H.text(why)) out.push({ where: at, value: 'no closing paragraph giving the reason' });
      }
      return out;
    },
  },

  {
    // Every date marked up as <time> carries an ISO datetime a machine can read and order.
    name: 'dates', level: 'fail', source: 'SPEC §8.21; §8.22', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const PH = /\{\{[\s\S]*?\}\}/;
      const iso = v => PH.test(v) || (/^\d{4}(-\d{2}(-\d{2}(T\d{2}:\d{2}(:\d{2})?(Z|[+-]\d{2}:\d{2})?)?)?)?$/.test(v) && !Number.isNaN(Date.parse(v)));
      for (const t of H.source().body.querySelectorAll('time')) {
        if (H.exempt(t, check)) continue;
        const v = t.getAttribute('datetime');
        if (v == null) out.push({ where: H.path(t), value: `"${H.text(t)}" has no datetime` });
        else if (!iso(v)) out.push({ where: H.path(t), value: `datetime "${v}" (an ISO date)` });
      }
      return out;
    },
  },

  {
    // One status block at most; its head carries its date, and it holds at least one key and value.
    name: 'status-block', level: 'fail', source: 'SPEC §8.22; §13.2', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const blocks = [...H.source().querySelectorAll('.cm-status')].filter(b => !H.exempt(b, check));
      if (blocks.length > 1) out.push({ where: 'body', value: `${blocks.length} status blocks (one at most)` });
      for (const b of blocks) {
        const head = b.querySelector(':scope > .cm-status__head');
        if (!head || !head.querySelector('time[datetime]')) out.push({ where: H.path(b), value: 'no date in its head (.cm-status__head with <time datetime>)' });
        const rows = [...b.querySelectorAll(':scope > dl > div')];
        if (!rows.length) out.push({ where: H.path(b), value: 'no entries (dl > div with dt and dd)' });
        for (const r of rows) {
          const dt = r.querySelector(':scope > dt'), dd = r.querySelector(':scope > dd');
          if (!dt || !H.text(dt) || !dd || !H.text(dd)) out.push({ where: H.path(r), value: 'entry without a key and a value' });
        }
      }
      return out;
    },
  },

  {
    // Each change: a kind from the closed set, a link to what it changed, and a date, newest first.
    name: 'change-log', level: 'fail', source: 'SPEC §8.22', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const KINDS = ['Added', 'Revised', 'Removed', 'Correction'];
      const PH = /\{\{[\s\S]*?\}\}/;
      for (const list of H.source().querySelectorAll('ol.cm-changes')) {
        if (H.exempt(list, check)) continue;
        let prev = null;
        for (const li of [...list.children].filter(c => c.localName === 'li')) {
          const kind = li.querySelector(':scope > .cm-tag');
          if (!kind || !KINDS.includes(H.text(kind))) out.push({ where: H.path(li), value: `kind "${kind ? H.text(kind) : ''}" (${KINDS.join(', ')})` });
          if (!li.querySelector('a[href^="#"]')) out.push({ where: H.path(li), value: 'no link to the section it changed' });
          const t = li.querySelector('time[datetime]');
          const v = t ? t.getAttribute('datetime') : '';
          if (!t) { out.push({ where: H.path(li), value: 'no date (<time datetime>)' }); continue; }
          if (PH.test(v)) continue;
          if (prev && v > prev) out.push({ where: H.path(li), value: `${v} after ${prev} (newest first)` });
          prev = v;
        }
      }
      return out;
    },
  },

  {
    // Each version: its number, a summary, an owner and a date, newest first. The newest carries the
    // masthead's Version and Published date.
    name: 'revisions', level: 'fail', source: 'SPEC §8.22', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, d = H.source(), out = [];
      const PH = /\{\{[\s\S]*?\}\}/;
      const field = k => { const dt = [...d.querySelectorAll('.cm-mast__meta dt')].find(x => H.text(x) === k); return dt && dt.nextElementSibling ? H.text(dt.nextElementSibling) : ''; };
      const num = v => v.replace(/^v/, '').split('.').map(Number);
      const newer = (a, b) => a[0] !== b[0] ? a[0] > b[0] : a[1] > b[1];
      for (const list of d.querySelectorAll('ol.cm-versions')) {
        if (H.exempt(list, check)) continue;
        const rows = [...list.children].filter(c => c.localName === 'li');
        let prev = null;
        rows.forEach((li, i) => {
          const at = H.path(li);
          const key = li.querySelector(':scope > .cm-id');
          const v = key ? H.text(key) : '';
          const placeholder = PH.test(li.textContent);
          if (!placeholder && !/^v\d+\.\d+$/.test(v)) out.push({ where: at, value: `version "${v}" (vX.Y in .cm-id)` });
          const owner = [...li.querySelectorAll('.cm-meta')].find(m => !m.querySelector('time'));
          if (!owner || !/\p{L}/u.test(H.text(owner))) out.push({ where: at, value: 'no owner (.cm-meta in the entry)' });
          const body = [...li.children].find(c => !c.matches('.cm-id, .cm-meta'));
          const summary = body ? H.text(body).replace(owner ? H.text(owner) : '', '').trim() : '';
          if (!summary) out.push({ where: at, value: 'no summary' });
          const t = li.querySelector('time[datetime]');
          if (!t) { out.push({ where: at, value: 'no date (<time datetime>)' }); return; }
          const date = t.getAttribute('datetime');
          if (placeholder) return;
          if (prev) {
            if (date > prev.date) out.push({ where: at, value: `${date} after ${prev.date} (newest first)` });
            if (/^v\d+\.\d+$/.test(v) && /^v\d+\.\d+$/.test(prev.v) && !newer(num(prev.v), num(v))) out.push({ where: at, value: `${v} after ${prev.v} (newest first)` });
          }
          if (i === 0) {
            const mv = field('Version'), mp = field('Published');
            if (mv && /^\d+\.\d+$/.test(mv) && v !== `v${mv}`) out.push({ where: at, value: `newest version ${v}, masthead Version ${mv}` });
            if (mp && /^\d{4}-\d{2}-\d{2}$/.test(mp) && date !== mp) out.push({ where: at, value: `newest version dated ${date}, masthead Published ${mp}` });
          }
          prev = { v, date };
        });
      }
      return out;
    },
  },

  {
    // Each limit: a name, its effect, and one status chip whose word comes from the closed set, with
    // the offset colour that word takes. Any other chip in the row is plain.
    name: 'limitations', level: 'fail', source: 'SPEC §8.22; §1 rule 9', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const STATUS = { Open: 'cm-chip--warn', 'By design': 'cm-chip--note', Resolved: 'cm-chip--ok' };
      for (const li of H.source().querySelectorAll('ul.cm-limits > li')) {
        if (H.exempt(li, check)) continue;
        const at = H.path(li);
        const name = li.querySelector('b, strong');
        if (!name || !H.text(name)) out.push({ where: at, value: 'no name (<b>)' });
        const body = name && name.parentElement;
        const effect = body ? H.text(body).slice(H.text(name).length).trim() : '';
        if (!/\p{L}/u.test(effect)) out.push({ where: at, value: 'no effect after the name' });
        const chips = [...li.querySelectorAll('.cm-chip')];
        const status = chips.filter(c => H.text(c) in STATUS);
        if (status.length !== 1) out.push({ where: at, value: `${status.length} status chips (exactly 1 of ${Object.keys(STATUS).join(', ')})` });
        for (const c of chips) {
          const mods = [...c.classList].filter(x => x.startsWith('cm-chip--'));
          const want = STATUS[H.text(c)];
          if (want ? mods.join(' ') !== want : mods.length) out.push({ where: H.path(c), value: `"${H.text(c)}" with ${mods.join(' ') || 'no modifier'} (${want || 'a plain chip'})` });
        }
      }
      return out;
    },
  },
];
