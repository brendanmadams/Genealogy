#!/usr/bin/env node
/**
 * 2026-09-23, dates and people in the Olson and Falde families from Brendan
 * Adams. Re-runnable. Roger Falde is set as the father of Randy and Robin
 * (Mary's husband; same surname). Mary was born a Kelley. Rosemary's surname
 * is spelled Dick-Peddie; she married Tom "Umpa" Olson on 4 Apr, about 1945.
 */
'use strict';
const { exists, load, save, note } = require('./lib/records');
const BA = 'Brendan Adams (personal knowledge), 2026';
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name) => ({ id, name, birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [BA], notes: [], aliases: [] });
function edit(id, fn) { const p = load(id); for (const k of ['milestones', 'notes', 'sources', 'aliases']) p[k] = p[k] || []; fn(p); add(p.sources, BA); save(p); }
function setDate(id, field, value) {
  edit(id, p => {
    if (p[field] === value) return;
    // a day-and-month value is refined silently when the year arrives; anything else is noted
    if (p[field] && !value.startsWith(p[field])) note(p, `CORRECTION 2026-09-23: ${field === 'birth' ? 'Birth' : 'Death'} changed from "${p[field]}" to "${value}", per Brendan Adams.`);
    p[field] = value;
  });
}
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };
const child = (kid, father) => { edit(kid, p => { p.relationships.father = father; }); edit(father, p => add(p.relationships.children, kid)); };

const DATES = {
  falde_randy: ['15 Apr 1947'], olson_bonnie: ['15 Apr 1947'], falde_mary: ['17 Jun 1927', '10 Dec 2018'],
  olson_kris: ['21 Oct 1948'], olson_tom: ['31 Jan 1947'], dickpeddie_rosemary: ['5 Apr 1925'],
  olson_sigrid: ['26 Jun 1950'], olson_tommy: ['8 Nov 1987'],
};
for (const [id, [b, d]] of Object.entries(DATES)) { setDate(id, 'birth', b); if (d) setDate(id, 'death', d); }

if (!exists('falde_roger')) save(blank('falde_roger', 'Roger Falde'));
setDate('falde_roger', 'birth', '19 Sep 1925'); setDate('falde_roger', 'death', '21 Sep 1992');
edit('falde_roger', p => note(p, 'Husband of Mary Falde and father of Randy and Robin Falde.'));
wed('falde_mary', 'falde_roger');
for (const k of ['falde_randy', 'falde_robin']) child(k, 'falde_roger');

if (!exists('oden_bugs')) save(blank('oden_bugs', '“Bugs” Oden'));
setDate('oden_bugs', 'birth', '23 Dec 1925'); setDate('oden_bugs', 'death', '26 Feb 2016');
edit('oden_bugs', p => note(p, 'Second husband of Mary Falde, whom she married after Roger Falde’s death in 1992.'));
wed('falde_mary', 'oden_bugs');
edit('falde_mary', p => { if (p.name === 'Mary Falde') p.name = 'Mary Kelley (Falde, Oden)'; add(p.aliases, 'Mary Falde'); add(p.aliases, 'Mary Oden'); p.notes = p.notes.map(t => t.replace('; her birth surname is not recorded.', '.').replace(/^Mother of Randy and Robin Falde.$/, 'Mother of Randy and Robin Falde. Married first Roger Falde, then “Bugs” Oden.')); });
edit('dickpeddie_rosemary', p => { p.name = 'Rosemary Dick-Peddie (Olson)'; p.aliases = p.aliases.filter(a => !/Dickpettie/i.test(a)); add(p.milestones, 'Married Tom “Umpa” Olson (m. 4 Apr abt 1945)'); });
edit('olson_tom_umpa', p => add(p.milestones, 'Married Rosemary Dick-Peddie (m. 4 Apr abt 1945)'));
console.log('Olson and Falde dates applied');
