#!/usr/bin/env node
/**
 * 2026-09-24, the Olson family from Brendan Adams. Re-runnable.
 *  - Full names: Umpa is Thomas Orlando Olson; his son Thomas William Olson;
 *    his grandson Thomas Mikkel "Tommy" Olson.
 *  - Umpa's parents: Thomas Mikkel Olson and Clara. The elder Thomas Mikkel
 *    was a brother of Nels Olson, for whom the younger Nels is named. Their
 *    sons were Umpa and Carroll; Carroll married Wilma and had Debbie, Diane
 *    and Denise.
 *  - Sigrid Olson's partner is Chris Wood (no children). Tommy married and
 *    divorced Megan (no children).
 */
'use strict';
const { exists, load, save, note } = require('./lib/records');
const BA = 'Brendan Adams (personal knowledge), 2026';
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, ...(sex ? { sex } : {}), birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [BA], notes: [], aliases: [] });
function edit(id, fn) { const p = load(id); for (const k of ['milestones', 'notes', 'sources', 'aliases']) p[k] = p[k] || []; fn(p); add(p.sources, BA); save(p); }
const person = (id, name, sex, fn = () => {}) => { if (!exists(id)) save(blank(id, name, sex)); edit(id, fn); };
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };
const child = (kid, father, mother) => {
  edit(kid, p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; });
  for (const par of [father, mother].filter(Boolean)) edit(par, p => add(p.relationships.children, kid));
};
const siblings = (a, b) => { edit(a, p => add(p.relationships.siblings, b)); edit(b, p => add(p.relationships.siblings, a)); };
const rename = (id, name, aliases) => edit(id, p => { if (p.name !== name) { p.name = name; } for (const a of aliases) add(p.aliases, a); });
// marriage lines written earlier under "Tom"; the current wording replaces them
const relabel = (id, from, to) => edit(id, p => { p.milestones = p.milestones.filter(t => t !== from); add(p.milestones, to); });

// Full names
rename('olson_tom_umpa', 'Thomas Orlando Olson', ['Umpa', 'Tom Olson']);
rename('olson_tom', 'Thomas William Olson', ['Tom Olson']);
rename('olson_tommy', 'Thomas Mikkel “Tommy” Olson', ['Tommy Olson', 'Thomas Mikkel Olson']);
relabel('dickpeddie_rosemary', 'Married Tom “Umpa” Olson (m. 6 Apr 1945)', 'Married Thomas Orlando “Umpa” Olson (m. 6 Apr 1945)');
relabel('olson_bonnie', 'Married Tom Olson (m. 14 Jun 1969)', 'Married Thomas William Olson (m. 14 Jun 1969)');

// Umpa's parents and uncle
person('olson_thomas_mikkel_elder', 'Thomas Mikkel Olson', 'M', p => note(p, 'Father of Thomas Orlando "Umpa" Olson and Carroll Olson; brother of Nels Olson. His great-grandson Thomas Mikkel "Tommy" Olson is named for him.'));
person('olson_clara', 'Clara Olson', 'F', p => note(p, 'Wife of Thomas Mikkel Olson and mother of Thomas Orlando "Umpa" Olson and Carroll Olson; her birth surname is not recorded.'));
wed('olson_thomas_mikkel_elder', 'olson_clara');
child('olson_tom_umpa', 'olson_thomas_mikkel_elder', 'olson_clara');
person('olson_nels_elder', 'Nels Olson', 'M', p => note(p, 'Brother of Thomas Mikkel Olson (Umpa’s father). His great-great-nephew Nels Olson is named for him.'));
siblings('olson_nels_elder', 'olson_thomas_mikkel_elder');
// their father's name is not known; a placeholder links the brothers, as with "(Unknown) Ashby"
person('olson_unknown_father', '(Unknown) Olson', 'M', p => note(p, 'Placeholder for the father of the brothers Thomas Mikkel Olson and Nels Olson, whose name is not recorded.'));
for (const k of ['olson_thomas_mikkel_elder', 'olson_nels_elder']) child(k, 'olson_unknown_father', null);

// Carroll's family
person('olson_carroll', 'Carroll Olson', 'M', p => note(p, 'Son of Thomas Mikkel and Clara Olson; brother of Thomas Orlando "Umpa" Olson.'));
child('olson_carroll', 'olson_thomas_mikkel_elder', 'olson_clara');
person('olson_wilma', 'Wilma Olson', 'F', p => note(p, 'Wife of Carroll Olson; her birth surname is not recorded.'));
wed('olson_carroll', 'olson_wilma');
for (const [id, name] of [['olson_debbie', 'Debbie Olson'], ['olson_diane', 'Diane Olson'], ['olson_denise', 'Denise Olson']]) {
  person(id, name, 'F', p => note(p, 'Daughter of Carroll and Wilma Olson.'));
  child(id, 'olson_carroll', 'olson_wilma');
}

// Sigrid's partner; Tommy's former wife
person('wood_chris', 'Chris Wood', null, p => note(p, 'Partner of Sigrid Olson; they have no children.'));
wed('olson_sigrid', 'wood_chris');
edit('olson_sigrid', p => note(p, 'Her partner is Chris Wood; they have no children.'));
person('megan_ex_olson', 'Megan', 'F', p => { add(p.aliases, 'Megan Olson'); add(p.milestones, 'Married Thomas Mikkel “Tommy” Olson; later divorced'); note(p, 'Former wife of Thomas Mikkel "Tommy" Olson; no children. Her surname is not recorded.'); });
wed('olson_tommy', 'megan_ex_olson');
edit('olson_tommy', p => { add(p.milestones, 'Married Megan; later divorced'); note(p, 'Married and later divorced Megan; no children.'); });
console.log('Olson family applied');
