#!/usr/bin/env node
/**
 * 2026-09-23, from "John Howard Adams - A Memoir" and Brendan Adams. Run after
 * import-john-memoir-2026-09-23.js. Re-runnable.
 *  1. Three corrections from the memoir: John and Barbara met in 1967 but
 *     began dating in summer 1968; John joined the paper industry (Crown
 *     Zellerbach, Port Townsend) in 1976, not 1978; his New Mexico schools
 *     were in west-central, not north-central, New Mexico.
 *  2. Daphne Wells is Serena and Arthur Wells's daughter (the memoir names a
 *     half-sister of George Sr.); so they married before about 1925.
 *  3. Megan's family, from Brendan: her parents Kris Olson and Randy Falde,
 *     her brother Brendan Falde, and her grandfather Tom Olson ("Umpa") with
 *     his children and grandchildren.
 */
'use strict';
const fs = require('fs');
const { exists, load, save, note } = require('./lib/records');
const MEM = 'John Howard Adams, "John Howard Adams - A Memoir" (privately printed)';
const BA = 'Brendan Adams (personal knowledge), 2026';
const L = (...n) => ` [John Howard Adams, A Memoir, text line ${n.join(', ')}]`;
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, src) => ({ id, name, birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [src], notes: [], aliases: [] });
function edit(id, fn, src) { const p = load(id); for (const k of ['milestones', 'locations', 'notes', 'sources', 'aliases', 'career', 'education', 'notable_stories']) p[k] = p[k] || []; fn(p); if (src) add(p.sources, src); save(p); return p; }
function person(id, name, src, o = {}) {
  if (!exists(id)) save(blank(id, name, src));
  return edit(id, p => {
    for (const k of ['birth', 'death']) if (o[k] && !p[k]) p[k] = o[k];
    for (const k of ['aliases', 'locations', 'milestones', 'career', 'notable_stories']) for (const v of o[k] || []) add(p[k], v);
    for (const v of o.notes || []) note(p, v);
  }, src);
}
const child = (kid, father, mother) => {
  edit(kid, p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; });
  for (const par of [father, mother].filter(Boolean)) edit(par, p => add(p.relationships.children, kid));
};
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };
const swap = (arr, from, to) => { const i = arr.indexOf(from); if (i >= 0) { if (arr.includes(to)) arr.splice(i, 1); else arr[i] = to; return true; } return false; };

// ── 1. Corrections to John's record ───────────────────────────────────────
for (const id of ['john_howard_adams', 'barbara_mckeldin_adams']) edit(id, p => {
  const other = id === 'john_howard_adams' ? 'Barbara McKeldin' : 'John Adams';
  let hit = false;
  for (const k of ['milestones', 'notes', 'notable_stories']) for (const t of [...p[k]]) if (/^1967 summer: Began courtship/i.test(t)) { p[k] = p[k].filter(x => x !== t); hit = true; }
  add(p.milestones, `Met ${other} in 1967, at the end of John's second (Youngster) year at the Naval Academy`);
  add(p.milestones, `Began dating ${other} in summer 1968, between John's third and fourth years at the Academy`);
  if (hit) note(p, `CORRECTION 2026-09-23: The courtship began in summer 1968, not summer 1967: John met Barbara in 1967, when she was dating a classmate, and they began dating the following summer.${L(1362, 1563)}`);
}, MEM);
edit('john_howard_adams', p => {
  let hit = false;
  for (const k of ['milestones', 'career']) p[k] = p[k].map(t => {
    if (/^1978: Transitioned to civilian paper industry/.test(t)) { hit = true; return t.replace(/^1978: Transitioned to civilian paper industry/, '1976: Left active duty and joined the paper industry as a mechanical engineer with Crown Zellerbach, Port Townsend, WA'); }
    if (/north-central New Mexico/.test(t)) { hit = true; return t.replace('north-central New Mexico', 'west-central New Mexico'); }
    return t;
  });
  add(p.milestones, '1978: Moved to Gilroy, CA, for a management job with Crown Zellerbach’s Containerboard Division');
  add(p.aliases, 'Howie');
  note(p, `Lowell Tiller, a Korean War Navy flight-crew veteran who hired him at Wauna, and his wife Lillian took the Adams family in almost as their own; Lowell was John's mentor and confidant.${L(2140, 2144)}`);
  if (hit) note(p, `CORRECTION 2026-09-23: Joined the paper industry in 1976 (Crown Zellerbach, Port Townsend), not 1978, which was the move to Gilroy; and his New Mexico schools were in west-central, not north-central, New Mexico (Crownpoint, Grants, Gallup).${L(2616, 2624, 2686, 2694)}`);
}, MEM);

// ── 2. Daphne Wells ───────────────────────────────────────────────────────
child('wells_daphne', 'wells_arthur', 'trumbo_serena_marie');
edit('wells_daphne', p => { p.notes = p.notes.filter(t => !/with her stepmother Serena/.test(t)); note(p, `Daughter of Arthur T. Wells and Serena (Trumbo) Wells, so a half-sister of George Francis Adams Sr. John Adams's memoir says Serena and Arthur had a daughter together; the 1940 census of their San Francisco household lists Daphne, aged 15, born in California.${L(546)} Decision by Brendan Adams.`); }, MEM);
for (const id of ['trumbo_serena_marie', 'wells_arthur']) edit(id, p => {
  let hit = false;
  p.milestones = p.milestones.map(t => /^Married (Arthur Wells|Serena Marie Nevada Trumbo) \(m\. abt 1929, San Francisco, CA\)$/.test(t) ? (hit = true, t.replace('abt 1929', 'before 1925')) : t);
  if (hit) note(p, 'CORRECTION 2026-09-23: Marriage dated before 1925 rather than about 1929: their daughter Daphne was born about 1925 (1940 census). Decision by Brendan Adams.');
});

// ── 3. Megan's family (Brendan) ───────────────────────────────────────────
person('olson_tom_umpa', 'Tom Olson', BA, { aliases: ['Umpa'], notes: ['Megan Adams’s maternal grandfather, called "Umpa". Father of Kris Olson (Falde), Tom Olson and Sigrid Olson.', `He loved to drive and was saddened when he could no longer do so.${L(3708)}`] });
edit('olson_tom_umpa', p => {}, MEM);
person('olson_kris', 'Kris Olson (Falde)', BA, { aliases: ['Kris Falde'], notes: ['Megan Adams’s mother. Married and later divorced Randy Falde.'] });
person('olson_tom', 'Tom Olson', BA, { notes: ['Son of Tom "Umpa" Olson; brother of Kris and Sigrid.'] });
person('olson_sigrid', 'Sigrid Olson', BA, {});
person('dickpettie_rosemary', 'Rosemary Dickpettie (Olson)', BA, { aliases: ['Rosemary Olson'], notes: ['Wife of Tom "Umpa" Olson; Megan Adams’s maternal grandmother.'] });
wed('olson_tom_umpa', 'dickpettie_rosemary');
for (const k of ['olson_kris', 'olson_tom', 'olson_sigrid']) child(k, 'olson_tom_umpa', 'dickpettie_rosemary');
person('falde_randy', 'Randy Falde', BA, { milestones: ['Married Kris Olson; later divorced'] });
edit('olson_kris', p => add(p.milestones, 'Married Randy Falde; later divorced'));
wed('olson_kris', 'falde_randy');
person('falde_brendan', 'Brendan Falde', BA, { death: 'deceased', notes: ['Son of Randy Falde and Kris Olson (Falde); brother of Megan Adams. Deceased; dates not recorded.'] });
child('falde_brendan', 'falde_randy', 'olson_kris');
child('megan_marie_adams', 'falde_randy', 'olson_kris');
edit('megan_marie_adams', p => { add(p.aliases, 'Megan Marie Falde'); add(p.aliases, 'Megan Falde'); note(p, `John and Barbara visited "the wonderful Olson and Falde families" in Albuquerque while living in New Mexico.${L(2699)}`); }, BA);
person('olson_bonnie', 'Bonnie Olson', BA, { notes: ['Wife of Tom Olson (son of Tom "Umpa" Olson).'] });
wed('olson_tom', 'olson_bonnie');
for (const [id, name, alias] of [['olson_nels', 'Nels Olson'], ['olson_kari', 'Kari Olson (Rosgen)', 'Kari Rosgen'], ['olson_tommy', 'Tommy Olson']]) {
  person(id, name, BA, { aliases: alias ? [alias] : [] });
  child(id, 'olson_tom', 'olson_bonnie');
}
console.log('memoir corrections, Daphne and the Olson-Falde family applied');
