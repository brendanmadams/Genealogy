#!/usr/bin/env node
/**
 * Jose Pierre Adams (II): full birth date and place, career, and his three
 * daughters, from his 1923 obituary in The Trail (Sons of Colorado) and the
 * family document "Descendants of Jose Pierre Adams" (2010). Added at
 * Brendan Adams's request, 2026-09-23. Re-runnable.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { exists, load, save, note } = require('./lib/records');
const OBIT = 'Obituary of Jose Pierre Adams, The Trail (Sons of Colorado), 1923 (media: jose2-obit)';
const DOC = 'Descendants of Jose Pierre Adams (family document, Nov 2010)';
const add = (arr, v) => { if (!arr.includes(v)) arr.push(v); };

// ── Jose Pierre II ─────────────────────────────────────────────────────────
const J = 'adams_joseph_pierre_jose2';
const j = load(J);
j.birth = '31 May 1847';
add(j.locations, 'Brunswick, MO');
add(j.locations, 'Denver, CO');
for (const c of [
  'Pioneer cattleman on the ranges of Colorado, Wyoming, Arizona and New Mexico',
  'One of the organizers and for many years president of the Denver Livestock Exchange',
  'Helped found what became the National Western Stock Show, with former Governor Ammons and the late Fred Johnson',
  'Douglas County commissioner; a leading spirit in building the courthouse at Castle Rock',
  'Livestock commission business at the Denver stockyards for about 25 years',
  'President of the J. P. Adams & Brigham Livestock Company',
]) add(j.career, c);
add(j.milestones, 'Born 31 May 1847, Brunswick, Missouri');
add(j.milestones, 'Crossed the plains by ox cart and settled in Douglas County before Colorado became a state');
add(j.milestones, 'Died 1923 at the home of his daughter Alice Adams Fulton, 1620 Steele Street, Denver');
add(j.sources, OBIT);
add(j.sources, DOC);
note(j, 'CORRECTION 2026-09-23: Birth refined from "May 1847" to 31 May 1847 at Brunswick, Missouri, and career details added, from his 1923 obituary. The obituary gives his marriage to Susan M. Pugh as 24 Dec 1868; the family document gives 1872. Not yet resolved.');
save(j);

// ── Daughters ──────────────────────────────────────────────────────────────
const DAUGHTERS = [
  { id: 'adams_alice_e', name: 'Alice E. Adams (Fulton)', birth: '1873', aliases: ['Alice Adams Fulton', 'Alice Hazleton'],
    locations: ['Douglas County, CO', 'Philadelphia, PA', 'Denver, CO'],
    notes: ['Eldest daughter of Jose Pierre Adams (II) and Susan M. Pugh. An earlier biography of her father calls her "Mrs. Alice Hazleton, of Philadelphia"; his 1923 obituary calls her Mrs. Alice Adams Fulton of Denver, so she probably married twice. Her father died at her home, 1620 Steele Street, Denver.'] },
  { id: 'adams_mary_j', name: 'Mary J. Adams (Collins)', birth: '1877', aliases: ['Mrs. J. F. Collins'],
    locations: ['Douglas County, CO', 'San Francisco, CA'],
    notes: ['Daughter of Jose Pierre Adams (II) and Susan M. Pugh. Identified as "Mrs. J. F. Collins of San Francisco" in her father\'s 1923 obituary by elimination: the obituary names Alice and Edna, and the family document gives Mary as the third daughter.'] },
  { id: 'adams_edna_m', name: 'Edna M. Adams', birth: 'Nov 1886', aliases: [],
    locations: ['Colorado', 'Denver, CO'],
    notes: ['Youngest daughter of Jose Pierre Adams (II) and Susan M. Pugh. "Miss Edna M. Adams" of Denver in her father\'s 1923 obituary, so unmarried then.'] },
];
for (const d of DAUGHTERS) {
  const p = exists(d.id) ? load(d.id) : {
    id: d.id, name: d.name, birth: d.birth, death: '', personality: [], roles: [], childhood_experience: [],
    notable_stories: [], risk_events: [], milestones: [], education: [], career: [],
    relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] },
    locations: [], sources: [], notes: [], aliases: [],
  };
  p.relationships.father = J;
  p.relationships.mother = 'pugh_susan';
  for (const l of d.locations) add(p.locations, l);
  for (const a of d.aliases) add(p.aliases, a);
  add(p.sources, OBIT); add(p.sources, DOC);
  for (const n of d.notes) note(p, n);
  save(p);
}
for (const par of [J, 'pugh_susan']) {
  const p = load(par);
  for (const d of DAUGHTERS) add(p.relationships.children, d.id);
  save(p);
}

// Tag the daughters on the obituary clipping
const MJ = path.resolve(__dirname, '..', 'data', 'media.json');
const media = JSON.parse(fs.readFileSync(MJ, 'utf8'));
const obit = media.items.find(m => m.id === 'jose2-obit');
for (const d of DAUGHTERS) add(obit.people, d.id);
fs.writeFileSync(MJ, JSON.stringify(media, null, 2) + '\n');
console.log('Jose Pierre II and daughters written');
