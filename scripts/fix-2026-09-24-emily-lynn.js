#!/usr/bin/env node
/**
 * 2026-09-24, Emily Mariam Lynn (Quinn, Cook), 1869–1937: her marriage
 * license, arrival and burial, and the parents a member tree gives her.
 * Re-runnable.
 *  - Proven: her maiden name (the Baltimore County marriage licenses for June
 *    1889, Bernard Quinn to Emily Lynn), her birth in Ireland about Feb 1869
 *    to Irish parents (1900 census), and her burial at St. John's, Fork.
 *  - Inferred: the Emily Lynn, 15, who landed at Philadelphia in 1884.
 *  - UNPROVEN: her parents John Lynn and Charlotte Montgomery (the "Quinn
 *    Family Tree", from a baptism index entry for Galgorm, County Antrim, 1868);
 *    nothing yet ties that baptism to her.
 */
'use strict';
const { exists, load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, ...(sex ? { sex } : {}), birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
function edit(id, src, fn) { const p = load(id); for (const k of ['milestones', 'notes', 'sources', 'aliases', 'locations', 'career', 'education']) p[k] = p[k] || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); }
const person = (id, name, sex, src, fn = () => {}) => { if (!exists(id)) save(blank(id, name, sex)); edit(id, src, fn); };
const child = (kid, father, mother) => {
  edit(kid, [], p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; });
  for (const par of [father, mother].filter(Boolean)) edit(par, [], p => add(p.relationships.children, kid));
};
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, [], p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };

const LIC = 'The Baltimore County Union (Towson), 6 Jul 1889, p. 3, "Orange Blossoms for Seventeen" (marriage licenses issued in June 1889); via Newspapers.com';
const C1900 = 'Ancestry.com, 1900 United States Federal Census (Fallston, Harford County, Maryland; ED 147, sheet 9, dwelling 164)';
const PASS = 'Ancestry.com, Pennsylvania, U.S., Arriving Passenger and Crew Lists, 1798-1962 (ship Phoenician, Philadelphia, 30 Jul 1884; NARA T840, roll 5)';
const FAG = 'Find a Grave, memorial 272356009 (Emily Mariam Lynn Quinn Cook, Saint John\'s Cemetery, Fork, Baltimore County)';
const BAP = 'Ancestry.com, Ireland, Select Births and Baptisms, 1620-1911 (Emily Lynn, born 9 Jan 1868, Galgorm, County Antrim; FHL film 101160)';
const TREE = 'Ancestry.com, public member tree "Quinn Family Tree" (tree 11167102)';

edit('lynn_emily_mariam', [LIC, C1900, PASS, FAG, BAP], p => {
  if (!p.birth || p.birth === '1869') p.birth = 'Feb 1869';
  add(p.aliases, 'Emily Lynn');
  for (const l of ['Philadelphia, Pennsylvania (arrived 1884)', 'Fallston, Harford County, Maryland', "Saint John's Cemetery, Fork, Baltimore County, Maryland"]) add(p.locations, l);
  note(p, 'Her maiden name is confirmed by the Baltimore County marriage licenses issued in June 1889, which list "Bernard Quinn to Emily Lynn" (Baltimore County Union, 6 Jul 1889). The member tree gives the wedding as 6 Aug 1889 at St. John\'s Catholic Church, Hydes, Baltimore County, and records an adult christening for her there the same day, which would mean she became a Catholic at her marriage.');
  note(p, 'In 1900, at Fallston, Harford County, she was 31, born Feb 1869 in Ireland to parents both born in Ireland, married 11 years, and the mother of six children, five of them living; she could read, write and speak English (1900 census).');
  note(p, 'Inferred: the Emily Lynn, 15, born in Ireland, who sailed from Glasgow and Moville on the Phoenician and landed at Philadelphia on 30 Jul 1884 (passenger list). No relatives are listed with her.');
  note(p, 'Buried at Saint John\'s Cemetery, Fork, Baltimore County, like her first husband Bernard; her second husband was Ernest P. Cook, who died in 1943 (Find a Grave).');
  note(p, 'UNPROVEN: the Quinn Family Tree names her parents as John Joseph Lynn (1834–1892) and Charlotte Ann Montgomery (1842–1906), of Galgorm and Ballymena, County Antrim, from a baptism index entry for an Emily Lynn born 9 Jan 1868 at Galgorm to John Lynn and Charlotte Montgomery. Her own records give Feb 1869, and nothing yet links that baptism to her; her daughter Charlotte Ann\'s name fits. The same tree also attaches a second Emily Lynn, born 24 Feb 1869 in County Antrim to Robert Lynn and Mary Ann Hanna, whom another tree has marrying Thomas George Stevenson in Ireland in 1890. Her 1937 Maryland death certificate, which should name her parents, would settle it.');
});

person('lynn_john_joseph', 'John Joseph Lynn', 'M', [BAP, TREE], p => {
  if (!p.birth) p.birth = '1834';
  if (!p.death) p.death = '5 Mar 1892';
  add(p.aliases, 'John Lynn');
  for (const l of ['Galgorm, County Antrim, Ireland', 'Ballymena, County Antrim, Ireland']) add(p.locations, l);
  note(p, 'UNPROVEN, from the Quinn Family Tree: born 1834 at Galgorm, County Antrim; died 5 Mar 1892 at Ballymena. Named as the father of Emily Lynn, born 9 Jan 1868 at Galgorm (baptism index), whom the tree identifies with Emily Mariam Lynn (Quinn, Cook); that link is not yet proven.');
});
person('montgomery_charlotte_ann', 'Charlotte Ann Montgomery (Lynn)', 'F', [BAP, TREE], p => {
  if (!p.birth) p.birth = '1842';
  if (!p.death) p.death = '4 Feb 1906';
  add(p.aliases, 'Charlotte Lynn');
  add(p.locations, 'Ballymena, County Antrim, Ireland');
  note(p, 'UNPROVEN, from the Quinn Family Tree: born 1842 at Ballymena, County Antrim; died there on 4 Feb 1906, aged 64. Named as the mother of Emily Lynn, born 9 Jan 1868 at Galgorm (baptism index), whom the tree identifies with Emily Mariam Lynn (Quinn, Cook); that link is not yet proven. The tree thinks the family was Protestant.');
});
wed('lynn_john_joseph', 'montgomery_charlotte_ann');
child('lynn_emily_mariam', 'lynn_john_joseph', 'montgomery_charlotte_ann');
console.log('Emily Lynn applied');
