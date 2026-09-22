#!/usr/bin/env node
/**
 * Confirmed by Brendan on 2026-09-22. Re-runnable.
 *  - Mary Emily McPhail is the mother of John Jacob Kulp's ten children.
 *  - James Alfred McKeldin and Dorothea Grief take the later birth dates
 *    (the earlier ones are kept in notes).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const DIR = path.resolve(__dirname, '..', 'data', 'people');
const TAG = 'CORRECTION 2026-09-22:';
const load = id => JSON.parse(fs.readFileSync(path.join(DIR, id + '.json'), 'utf8'));
const save = (id, p) => fs.writeFileSync(path.join(DIR, id + '.json'), JSON.stringify(p, null, 2) + '\n');
const note = (p, t) => { p.notes = p.notes || []; const s = `${TAG} ${t}`; if (!p.notes.includes(s)) p.notes.push(s); };

// ── Kulp children ──────────────────────────────────────────────────────────
const jj = load('kulp_john_jacob');
const me = load('mcphail_mary_emily');
me.relationships.children = me.relationships.children || [];
for (const kid of jj.relationships.children) {
  const c = load(kid);
  if (c.relationships.mother !== 'mcphail_mary_emily') {
    c.relationships.mother = 'mcphail_mary_emily';
    note(c, 'Mother set to mcphail_mary_emily, the only recorded wife of John Jacob Kulp (m. 15 Aug 1897; she d. 1931); confirmed by Brendan Adams.');
    save(kid, c);
  }
  if (!me.relationships.children.includes(kid)) me.relationships.children.push(kid);
}
save('mcphail_mary_emily', me);

// ── McKeldin birth dates ───────────────────────────────────────────────────
const DATES = [
  ['mckeldin_james_alfred', 'abt 29 Mar 1860', 'abt 1844'],
  ['grief_dorothea', '3 Jul 1863', 'abt 1854'],
];
for (const [id, birth, old] of DATES) {
  const p = load(id);
  if (p.birth !== birth) {
    note(p, `Birth changed from "${old}" to "${birth}" (confirmed by Brendan Adams). The later date fits the ~1877-78 marriage at ages 17 and 14 and the children's births 1880-1902; the earlier date would put Dorothea at 48 for her last child.`);
    p.birth = birth;
    save(id, p);
  }
}
console.log(`done: ${jj.relationships.children.length} Kulp children, 2 McKeldin birth dates`);
