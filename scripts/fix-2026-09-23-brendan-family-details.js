#!/usr/bin/env node
/**
 * 2026-09-23, family details from Brendan Adams. Re-runnable. Values are
 * replaced as given, without correction notes (Brendan: "no corrections
 * needed, just replace").
 *  - John Howard Adams born 24 Feb 1947.
 *  - Tom "Umpa" Olson and Rosemary Dick-Peddie married 6 Apr 1945; their son
 *    Tom married Evonne "Bonnie" Jelcick on 14 Jun 1969.
 *  - Presley Adams's wife Fran and children Sally and Casey (a third child
 *    not yet named); Edith Adams Childs's two sons (names not recorded).
 *  - Daphne Wells's husband Bill and their children, named for the letters
 *    of their first child James, who died at birth.
 */
'use strict';
const { exists, load, save, note } = require('./lib/records');
const BA = 'Brendan Adams (personal knowledge), 2026';
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, ...(sex ? { sex } : {}), birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [BA], notes: [], aliases: [] });
function edit(id, fn) { const p = load(id); for (const k of ['milestones', 'notes', 'sources', 'aliases', 'locations']) p[k] = p[k] || []; fn(p); add(p.sources, BA); save(p); }
const person = (id, name, sex, fn = () => {}) => { if (!exists(id)) save(blank(id, name, sex)); edit(id, fn); };
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };
const child = (kid, father, mother) => {
  edit(kid, p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; });
  for (const par of [father, mother].filter(Boolean)) edit(par, p => add(p.relationships.children, kid));
};
const marriage = (id, text) => edit(id, p => { p.milestones = p.milestones.filter(t => !(/^Married /.test(t) && t.split(' (m.')[0] === text.split(' (m.')[0])); add(p.milestones, text); });

// John Howard Adams
edit('john_howard_adams', p => { p.birth = '24 Feb 1947'; });

// Olson marriages
marriage('olson_tom_umpa', 'Married Rosemary Dick-Peddie (m. 6 Apr 1945)');
marriage('dickpeddie_rosemary', 'Married Tom “Umpa” Olson (m. 6 Apr 1945)');
edit('olson_bonnie', p => { p.name = 'Evonne “Bonnie” Jelcick (Olson)'; add(p.aliases, 'Bonnie Olson'); add(p.aliases, 'Evonne Olson'); });
marriage('olson_tom', 'Married Evonne “Bonnie” Jelcick (m. 14 Jun 1969)');
marriage('olson_bonnie', 'Married Tom Olson (m. 14 Jun 1969)');

// Presley Adams's family
person('adams_fran', 'Fran Adams', 'F', p => note(p, 'Wife of Presley Adams; her birth surname is not recorded.'));
wed('adams_presley', 'adams_fran');
person('adams_sally', 'Sally Adams', 'F');
person('adams_casey', 'Casey Adams', 'F', p => { if (!p.death) p.death = 'deceased'; note(p, 'Never married; deceased.'); });
for (const k of ['adams_sally', 'adams_casey']) child(k, 'adams_presley', 'adams_fran');
edit('adams_presley', p => note(p, 'He and Fran had three children: Sally, Casey and a third whose name is not recorded.'));

// Edith Adams Childs
edit('adams_edith_v', p => { if (p.name === 'Edith V. Adams') { add(p.aliases, 'Edith V. Adams'); p.name = 'Edith V. Adams (Childs)'; } add(p.aliases, 'Edith Childs'); note(p, 'She had two sons, surname Childs; their names are not recorded.'); });

// Daphne Wells's family
person('bill_daphne_wells', 'Bill Childs', 'M', p => { if (p.name === 'Bill') p.name = 'Bill Childs'; p.notes = p.notes.filter(t => t !== 'Husband of Daphne Wells; his surname is not recorded. They lived in the San Francisco Bay Area.'); add(p.locations, 'San Francisco Bay Area, California'); note(p, 'Husband of Daphne Wells. They lived in the San Francisco Bay Area. (Daphne’s half-sister Edith Adams also married a Childs, Thomas.)'); });
wed('wells_daphne', 'bill_daphne_wells');
edit('wells_daphne', p => { if (p.name === 'Daphne Wells') p.name = 'Daphne Wells (Childs)'; add(p.aliases, 'Daphne Childs'); add(p.locations, 'San Francisco Bay Area, California'); note(p, 'She and her husband Bill Childs lost their first child, James, at birth, and named their five later children for the letters of his name: John, Arthur, Mary, Edward and Stephen.'); });
const KIDS = [['daphne_james', 'James Childs', 'M'], ['daphne_john', 'John Childs', 'M'], ['daphne_arthur', 'Arthur Childs', 'M'], ['daphne_mary', 'Mary Childs', 'F'], ['daphne_edward', 'Edward Childs', 'M'], ['daphne_stephen', 'Stephen Childs', 'M']];
for (const [id, name, sex] of KIDS) {
  person(id, name, sex, p => {
    if (p.name === name.split(' ')[0]) p.name = name;
    p.notes = p.notes.filter(t => !/ Surname not recorded\.$/.test(t));
    if (id === 'daphne_james') { if (!p.death) p.death = 'deceased'; add(p.milestones, 'Died at birth; the first child of Bill and Daphne'); }
    else note(p, `Child of Bill and Daphne (Wells) Childs; named for the letter ${name[0]} in the name of their first child, James, who died at birth.`);
  });
  child(id, 'bill_daphne_wells', 'wells_daphne');
}
console.log('family details applied');
