#!/usr/bin/env node
/**
 * 2026-09-25, Mary Patricia (Walker) Simons's half-sisters, Roma Florence and
 * Betty Ann Walker, daughters of John William Walker and Marrion (Hinds).
 * Re-runnable.
 */
'use strict';
const { exists, load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, sex, birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
const edit = (id, src, fn) => { const p = load(id); p.notes = p.notes || []; p.sources = p.sources || []; p.locations = p.locations || []; p.aliases = p.aliases || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); };
const person = (id, name, sex, src, fn) => { if (!exists(id)) save(blank(id, name, sex)); edit(id, src, fn); };
const child = (kid, father, mother) => { edit(kid, [], p => { p.relationships.father = father; p.relationships.mother = mother; }); for (const par of [father, mother]) edit(par, [], p => add(p.relationships.children, kid)); };
const ED = 'Ancestry.com, public member tree of Ed Simons (tree 189265374)';
const C1950 = 'Ancestry.com, 1950 United States Federal Census (Richland, Benton County, Washington; ED 3-26, page 33)';
const WAM = 'Ancestry.com, Washington, U.S., Marriage Records, 1854-2013 (Roma Florence Walker and Paul Carleton Hathaway, Franklin County, 1962)';
const YB = 'Ancestry.com, U.S., School Yearbooks, 1900-2016 (Kennewick, 1961)';

person('walker_roma_florence', 'Roma Florence Walker (Hathaway)', 'F', [C1950, WAM, YB, ED], p => {
  if (!p.birth) p.birth = '5 Sep 1943';
  for (const l of ['Bend, Deschutes County, Oregon', 'Richland, Washington', 'Kennewick, Washington']) add(p.locations, l);
  add(p.aliases, 'Roma F. Walker');
  note(p, 'Born 5 Sep 1943 (Washington marriage records); Ed Simons\'s tree gives the place as Bend, Oregon. Aged 6 in the 1950 census at Richland; in the 1961 Kennewick High School yearbook; married Paul Carleton Hathaway in Franklin County in May 1962. Ed Simons\'s tree also names a husband Theodore Walters.');
});
person('walker_betty_ann', 'Betty Ann Walker', 'F', [C1950, ED], p => {
  add(p.locations, 'Richland, Washington');
  add(p.aliases, 'Betty A. Walker');
  note(p, 'Aged 4 in the 1950 census at Richland. Ed Simons\'s tree names her husbands as George Coomes and Otho Walter Eaton.');
});
for (const id of ['walker_roma_florence', 'walker_betty_ann']) child(id, 'walker_john_william', 'hinds_marrion_roma');
console.log('Walker sisters applied');
