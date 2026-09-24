#!/usr/bin/env node
/**
 * 2026-09-24, Ancestry.com records for Ellen Rogers (Ball) McPhail and John
 * Belle McPhail, looked up with Brendan Adams. Re-runnable.
 *  - Ellen: born 2 Nov 1851 Nashville, died 21 Oct 1934 Blaine; father David
 *    Ball (death record). The Ball household of McMinn and Roane counties,
 *    Tennessee, in 1860 and 1870 (David and "Graden") is inferred to be hers.
 *  - John Belle: born 31 Aug 1849 McMinn County, Tennessee, died 14 Mar 1925
 *    West Delta; parents John McPhail and a Newman (Martha on the death
 *    record, Susannah on Find a Grave).
 *  - Children's years from Find a Grave; Draden's full name Dradie Susan.
 */
'use strict';
const { exists, load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, ...(sex ? { sex } : {}), birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
function edit(id, src, fn) { const p = load(id); for (const k of ['milestones', 'notes', 'sources', 'aliases', 'locations']) p[k] = p[k] || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); }
const person = (id, name, sex, src, fn = () => {}) => { if (!exists(id)) save(blank(id, name, sex)); edit(id, src, fn); };
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, [], p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };
const child = (kid, father, mother) => {
  edit(kid, [], p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; });
  for (const par of [father, mother].filter(Boolean)) edit(par, [], p => add(p.relationships.children, kid));
};

const CENSUS = 'Ancestry.com, U.S. Federal Censuses 1860, 1870, 1900, 1910 and 1920';
const WADEATH = 'Ancestry.com, Washington, U.S., Death Records, 1907–2017, and Select Death Index, 1907–1960';
const SSACI = 'Ancestry.com, U.S., Social Security Applications and Claims Index, 1936–2007';
const FAG = n => `Find a Grave, memorial ${n} (via Ancestry.com, U.S., Find a Grave Index)`;

// Ellen Rogers (Ball) McPhail
edit('ball_ellen_rogers', [CENSUS, WADEATH, FAG(6749131)], p => {
  p.birth = '2 Nov 1851';
  p.death = '21 Oct 1934';
  for (const a of ['Ellen Roger Ball', 'Ellen R. Ball']) add(p.aliases, a);
  for (const l of ['Nashville, Davidson County, Tennessee', 'McMinn County, Tennessee', 'Roane County, Tennessee', 'Meridian, Whatcom County, Washington', 'Blaine, Whatcom County, Washington']) add(p.locations, l);
  add(p.milestones, 'Married John Belle McPhail (m. 1873)');
  note(p, 'Born 2 Nov 1851 at Nashville, Tennessee; died 21 Oct 1934 at Blaine, Whatcom County, aged 82. Her Washington death record names her father as David Ball; her mother\'s name is left blank. Find a Grave gives the death date as 31 Oct 1934; the death record\'s 21 Oct is used here.');
  note(p, 'Married John Belle McPhail in 1873 (1900 census: married 27 years). By 1900 she had borne five children, all living. The family lived at Meridian, Whatcom County, in 1900 and at Delta in 1910 and 1920, when their grandson John M. McPhail, 9, lived with them.');
  note(p, 'Inferred: she is the Ellen Ball, aged 9, in the household of David Ball (48) and Graden Ball (46) in District 2, McMinn County, Tennessee, in 1860, and aged 18 with David and "Grodon" Ball in Roane County in 1870. McMinn County was also John Belle McPhail\'s birthplace, and the name Graden matches the Draden/Dradie names in her family.');
});

// Her parents (inferred from the censuses; David is named on her death record)
person('ball_david', 'David Ball', 'M', [WADEATH, CENSUS], p => {
  p.birth = p.birth || 'abt 1812';
  for (const l of ['McMinn County, Tennessee', 'Roane County, Tennessee']) add(p.locations, l);
  note(p, 'Father of Ellen Rogers (Ball) McPhail, as named on her 1934 Washington death record.');
  note(p, 'Inferred from the censuses: aged 48 in 1860 (District 2, McMinn County, Tennessee) and 55 in 1870 (District 8, Roane County), with his wife Graden and children Nancy (b. abt 1844), George (abt 1845), Mary Ann (abt 1848), Ellen (abt 1851), Margaret (abt 1854) and Catharine (abt 1857).');
});
person('ball_graden', 'Graden Ball', 'F', CENSUS, p => {
  for (const a of ['Grodon Ball']) add(p.aliases, a);
  note(p, 'Inferred mother of Ellen Rogers (Ball) McPhail: wife of David Ball in the 1860 (aged 46) and 1870 ("Grodon", aged 42) censuses of McMinn and Roane counties, Tennessee. Her birth surname is not recorded. The name appears to be the source of the Draden/Dradie names among her descendants.');
});
wed('ball_david', 'ball_graden');
child('ball_ellen_rogers', 'ball_david', 'ball_graden');

// John Belle McPhail and his parents
edit('mcphail_john_belle', [CENSUS, WADEATH, FAG(6749130)], p => {
  p.birth = '31 Aug 1849';
  p.death = '14 Mar 1925';
  for (const l of ['McMinn County, Tennessee', 'Meridian, Whatcom County, Washington', 'West Delta, Whatcom County, Washington']) add(p.locations, l);
  add(p.milestones, 'Married Ellen Rogers Ball (m. 1873)');
  add(p.milestones, 'Buried in Lynden Cemetery, Lynden, Washington');
  note(p, 'Born 31 Aug 1849 in McMinn County, Tennessee; died 14 Mar 1925 at West Delta, Whatcom County, aged 75 (Washington death certificate 48).');
  note(p, 'His death record names his parents as John McPhail and Martha Newman; Find a Grave gives his mother as Susannah Newman McPhail (b. 1817).');
});
person('mcphail_john_elder', 'John McPhail', 'M', [WADEATH, FAG(6749130)], p => {
  p.birth = p.birth || '1805';
  note(p, 'Father of John Belle McPhail, named on his son\'s 1925 death record.');
  note(p, 'Find a Grave lists his other children as Byrd Newman McPhail (1833–1893), William Dugald McPhail (1838–1900), Mary Rebecca McPhail Gudger (1840–1924) and Daniel Percell McPhail (1847–1928).');
});
person('newman_susannah', 'Susannah Newman (McPhail)', 'F', [WADEATH, FAG(6749130)], p => {
  p.birth = p.birth || '1817';
  for (const a of ['Martha Newman', 'Susannah Newman McPhail']) add(p.aliases, a);
  note(p, 'Mother of John Belle McPhail. His death record calls her Martha Newman; Find a Grave calls her Susannah Newman McPhail (b. 1817).');
});
wed('mcphail_john_elder', 'newman_susannah');
child('mcphail_john_belle', 'mcphail_john_elder', 'newman_susannah');

// Their children
edit('mcphail_draden', SSACI, p => { add(p.aliases, 'Dradie Susan Dunbar'); note(p, 'Her full name appears as Dradie Susan Dunbar in a Social Security claim that names her parents John B. McPhail and Ellen R. Ball.'); });
edit('mcphail_sarah_rebecca_jane', FAG(6660968), p => { if (!p.birth) p.birth = '1880'; if (!p.death) p.death = '1958'; });
edit('mcphail_minnie_belle', FAG(6830215), p => { if (!p.birth) p.birth = '1882'; if (!p.death) p.death = '1958'; });
edit('mcphail_john_tate', [FAG(8580484), CENSUS], p => { if (!p.birth) p.birth = '1889'; if (!p.death) p.death = '1969'; add(p.aliases, 'Mac McPhail'); note(p, 'Known as "Mac". Aged 10 in 1900, living with his parents at Meridian, Whatcom County.'); });
console.log('Ancestry McPhail records applied');
