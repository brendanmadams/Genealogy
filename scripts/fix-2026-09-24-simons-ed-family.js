#!/usr/bin/env node
/**
 * 2026-09-24, Ed Simons's wife Kim and son John (Brendan Adams). Kim is the
 * mother of Ed's children, John and Kayla. All living: names and
 * relationships only. Re-runnable.
 */
'use strict';
const { exists, load, save } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const SRC = 'Brendan Adams, 2026-09-24';
const blank = (id, name, sex) => ({ id, name, sex, birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
const person = (id, name, sex, fn) => { const p = exists(id) ? load(id) : blank(id, name, sex); fn(p); add(p.sources, SRC); save(p); };

person('simons_kim', 'Kim Simons', 'F', p => { p.relationships.spouse = 'simons_ed'; for (const c of ['henley_kayla', 'simons_john']) add(p.relationships.children, c); });
person('simons_john', 'John Simons', 'M', p => { p.relationships.father = 'simons_ed'; p.relationships.mother = 'simons_kim'; });
person('henley_kayla', 'Kayla Simons (Henley)', 'F', p => { p.relationships.mother = 'simons_kim'; });
person('simons_ed', 'Ed Simons', 'M', p => {
  if (!p.relationships.spouse) p.relationships.spouse = 'simons_kim';
  add(p.relationships.children, 'simons_john');
});
console.log('Ed Simons family applied');
