#!/usr/bin/env node
/**
 * 2026-09-24, Ancestry.com and Find a Grave records for Brendan's McKeldin,
 * Bell, Schriefer and Quinn great-grandparents, looked up with Brendan Adams.
 * Re-runnable.
 *  - Emma was Emma Virginia Bell (13 Aug 1891 – 4 Jan 1949), daughter of
 *    William H. and Elmira "Ella" Bell; Charles E. McKeldin I was Charles Edward.
 *  - George Schriefer (1 Jun 1899 – 9 May 1951), son of Bartholomew Schriefer
 *    and Margaret Denzlein; Ethel E. Quinn (1901 – 9 Apr 1952), daughter of
 *    Bernard Quinn and Emily Mariam Lynn (later Cook).
 *  - Emily Margaret Schriefer: 20 Feb 1921 – 21 Oct 1950; first husband
 *    Jack Hetrick Poehlman (m. 1941).
 * The earlier dates for George, Ethel and Emily were burial or notice dates,
 * and the memoir's age-based birth estimates were too early.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { exists, load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, ...(sex ? { sex } : {}), birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
function edit(id, src, fn) { const p = load(id); for (const k of ['milestones', 'notes', 'sources', 'aliases', 'locations', 'career', 'education', 'notable_stories']) p[k] = p[k] || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); }
const person = (id, name, sex, src, fn = () => {}) => { if (!exists(id)) save(blank(id, name, sex)); edit(id, src, fn); };
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, [], p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };
const child = (kid, father, mother) => {
  edit(kid, [], p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; });
  for (const par of [father, mother].filter(Boolean)) edit(par, [], p => add(p.relationships.children, kid));
};
const drop = (p, key, re) => { p[key] = p[key].filter(t => !re.test(t)); };
const rename = (p, from, to) => { if (from.includes(p.name)) { add(p.aliases, p.name); p.name = to; } };

const C1900 = 'Ancestry.com, 1900 United States Federal Census';
const C1910 = 'Ancestry.com, 1910 United States Federal Census';
const C1920 = 'Ancestry.com, 1920 United States Federal Census';
const C1930 = 'Ancestry.com, 1930 United States Federal Census';
const C1940 = 'Ancestry.com, 1940 United States Federal Census';
const OBIT = 'Ancestry.com, U.S., Newspapers.com Obituary Index (Baltimore Sun and Evening Sun death notices)';
const FAG = n => `Find a Grave, memorial ${n}`;

// Emma Virginia Bell (McKeldin)
edit('emma_bell_mckeldin', [C1900, C1920, C1930, FAG(34433509)], p => {
  rename(p, ['Emma Bell McKeldin'], 'Emma Virginia Bell (McKeldin)');
  for (const a of ['Emma V. McKeldin', 'Emma Bell']) add(p.aliases, a);
  p.birth = '13 Aug 1891';
  p.death = '4 Jan 1949';
  drop(p, 'notable_stories', /^(Bell may be middle name|Full maiden name should appear)/);
  drop(p, 'notes', /^CONFIRMED identity via Barbara's memoir p\. 57\. Maiden name unknown/);
  for (const l of ['1118 Cleveland Street, Baltimore (1900)', '1143 Carroll Street, Baltimore (1920–1930)', 'Mount Olivet Cemetery, Baltimore']) add(p.locations, l);
  add(p.milestones, 'Buried at Mount Olivet Cemetery, Baltimore, 7 Jan 1949');
  note(p, 'Born Emma Virginia Bell on 13 Aug 1891 in Baltimore, the daughter of William H. Bell and Elmira "Ella" Bell; the 1920 census lists her parents living with her and Charles at 1143 Carroll Street as his father-in-law and mother-in-law. Bell was her maiden name.');
  note(p, 'CORRECTION: died 4 Jan 1949 in Baltimore and buried 7 Jan 1949 at Mount Olivet Cemetery (Find a Grave, with burial permit number), about eleven months after her granddaughter Barbara was born; the earlier "abt Feb 1948" was an estimate from Barbara\'s memoir.');
  note(p, 'Married Charles Edward McKeldin about 1908 (he was 21 at his first marriage, per the 1930 census). Children in the 1920 and 1930 censuses: Lola E. (b. abt 1909), Lillian M. (abt 1911), Helen M. (abt 1912), Charles E. (1917), Emma (abt 1920) and William (abt 1923).');
});
const BELL_KIDS = 'Children in the 1900 census at 1118 Cleveland Street, Baltimore: Sadie (Stahler, b. abt 1877), Charles A. (abt 1881), Margaret (abt 1888), William (abt 1889), Emma (Aug 1891), Carrie V. (abt 1894) and Annie (abt 1899).';
person('bell_william_h', 'William H. Bell', 'M', [C1900, C1920], p => {
  p.birth = p.birth || 'abt 1854';
  add(p.locations, 'Baltimore, Maryland');
  note(p, 'Father of Emma Virginia Bell (McKeldin). Born about 1854 in Maryland; living with Emma and Charles McKeldin at 1143 Carroll Street in 1920, aged 66.');
  note(p, BELL_KIDS);
});
person('bell_elmira', 'Elmira “Ella” Bell', 'F', [C1900, C1920], p => {
  p.birth = p.birth || 'abt 1858';
  for (const a of ['Ella Bell', 'Elmira Bell']) add(p.aliases, a);
  add(p.locations, 'Baltimore, Maryland');
  note(p, 'Mother of Emma Virginia Bell (McKeldin). Elmira in the 1900 census (aged 42) and Ella in 1920 (aged 62), born in Maryland. Her birth surname is not recorded; Margaret Clayhardy, 73, lived with the family in 1900 as William Bell\'s mother-in-law, which suggests Elmira was born a Clayhardy (not confirmed).');
});
wed('bell_william_h', 'bell_elmira');
child('emma_bell_mckeldin', 'bell_william_h', 'bell_elmira');

// Charles Edward McKeldin I and his children
edit('mckeldin_charles_i', [C1920, C1930, FAG(34433503)], p => {
  rename(p, ['Charles E. McKeldin I'], 'Charles Edward McKeldin I');
  add(p.aliases, 'Charles Edward McKeldin');
  add(p.locations, '1143 Carroll Street, Baltimore');
  add(p.career, 'Sheet metal worker: in window work in 1920 and in a garage in 1930 (censuses).');
  note(p, 'His Find a Grave memorial names him Charles Edward McKeldin (1887–1949). He rented 1143 Carroll Street in 1920 and owned it by 1930; the house stayed in the family, and his daughter-in-law Emily\'s funeral (1950) and her parents\' death notices (1951, 1952) all give it as home.');
});
edit('charles_buckey_mckeldin', [C1920, C1930, FAG(222564397)], p => {
  add(p.aliases, 'Charles Edward McKeldin');
  note(p, 'His Find a Grave memorial names him Charles Edward McKeldin (1917–2006), confirming that the E. stood for Edward.');
});
const kid = (id, fn) => edit(id, [C1920, C1930], fn);
kid('mckeldin_lola', p => { if (!p.birth) p.birth = 'abt 1909'; add(p.aliases, 'Lola E. McKeldin'); note(p, 'Lola E., aged 11, in the 1920 census at 1143 Carroll Street; not in the household in 1930.'); });
kid('mckeldin_lillian_buckey', p => { if (!p.birth) p.birth = 'abt 1911'; add(p.aliases, 'Lillian M. McKeldin'); note(p, 'Lillian M., aged 9 in the 1920 census and 19 in 1930, at 1143 Carroll Street.'); });
edit('mckeldin_helen_buckey', [C1920, C1930, FAG(279694397)], p => {
  rename(p, ['Helen McKeldin'], 'Helen M. McKeldin (Souder)');
  add(p.aliases, 'Helen McKeldin'); add(p.aliases, 'Helen Souder');
  if (!p.birth) p.birth = '1912'; if (!p.death) p.death = '1994';
  note(p, 'Helen M. McKeldin Souder (1912–1994) on Find a Grave; aged 7 in the 1920 census and 17 in 1930.');
});
kid('mckeldin_emma_buckey', p => { if (!p.birth) p.birth = 'abt 1920'; note(p, 'Aged 10 in the 1930 census at 1143 Carroll Street.'); });
kid('mckeldin_william_billy', p => { if (!p.birth) p.birth = 'abt 1923'; note(p, 'Aged 7 in the 1930 census at 1143 Carroll Street.'); });

// George Schriefer and his parents
edit('schriefer_george_goode', [C1900, C1930, C1940, OBIT, FAG(222563508)], p => {
  p.birth = '1 Jun 1899';
  p.death = '9 May 1951';
  p.milestones = p.milestones.filter(t => t !== 'Death: 12 May 1951');
  p.milestones = p.milestones.filter(t => t !== 'Married Ethel E. Quinn (m. abt 1920)');
  add(p.milestones, 'Married Ethel Elizabeth Quinn (m. 12 Jul 1920)');
  add(p.milestones, 'Buried at New Cathedral Cemetery, Baltimore, 12 May 1951');
  for (const l of ['2531 E. Oliver Street, Baltimore (1900)', '2003 Barclay Street, Baltimore (1930)', '339 21st Street, Baltimore (1940)', '1143 Carroll Street, Baltimore (1951)']) add(p.locations, l);
  add(p.career, 'Shipping clerk, for an ice cream company in 1930 and still in 1940 (censuses).');
  add(p.education, 'Completed sixth grade (1940 census).');
  note(p, 'CORRECTION: died 9 May 1951 in Baltimore, in his 52nd year, per his death notice (Evening Sun, 10 May 1951) and Find a Grave; 12 May 1951 was his burial at New Cathedral Cemetery. Born 1 Jun 1899 in Baltimore.');
  p.notes = p.notes.filter(t => t !== 'Son of Bartholomew Schriefer and Margaret (Denzlein), both born in Germany; in the 1900 census he is George S., aged 11 months, at 2531 E. Oliver Street. He married Ethel E. Quinn about 1920 (he was 20 at his first marriage, per the 1930 census).');
  note(p, 'Son of Bartholomew Schriefer and Margaret (Denzlein), both born in Germany; in the 1900 census he is George S., aged 11 months, at 2531 E. Oliver Street. He married Ethel Elizabeth Quinn on 12 Jul 1920 in Baltimore (Quinn Family Tree on Ancestry; he was 20 at his first marriage, per the 1930 census).');
  note(p, 'In 1930 his mother-in-law Emily Cook and her husband Earnest Cook lived with the family on Barclay Street.');
});
person('schriefer_bartholomew', 'Bartholomew Schriefer', 'M', [C1900, FAG(65818037)], p => {
  p.birth = p.birth || '1839'; p.death = p.death || '1914';
  for (const l of ['Germany', 'Baltimore, Maryland']) add(p.locations, l);
  note(p, 'Born in Germany; aged 60 in the 1900 census at 2531 E. Oliver Street, Baltimore.');
  note(p, 'Children on Find a Grave: Mary (1883–1937), Jennie Katherine (Frank, 1889–1955), Anna M. (Herbert, 1892–1967), Margaret M. (Conroy, 1896–1961), George (1899–1951) and Henry (1904–1980).');
});
person('denzlein_margaret', 'Margaret Denzlein (Schriefer)', 'F', [C1900, FAG(65818125)], p => {
  p.birth = p.birth || '1865'; p.death = p.death || '1924';
  add(p.aliases, 'Margaret Schriefer');
  for (const l of ['Germany', 'Baltimore, Maryland']) add(p.locations, l);
  note(p, 'Born in Germany; aged 35 in the 1900 census, wife of Bartholomew Schriefer.');
});
wed('schriefer_bartholomew', 'denzlein_margaret');
child('schriefer_george_goode', 'schriefer_bartholomew', 'denzlein_margaret');

// Ethel E. Quinn and her parents
edit('ethel_quinn_schriefer', [C1910, C1930, C1940, OBIT, FAG(222563596)], p => {
  rename(p, ['Ethel Quinn (Schriefer)', 'Ethel E. Quinn (Schriefer)'], 'Ethel Elizabeth Quinn (Schriefer)');
  add(p.aliases, 'Ethel E. Schriefer');
  p.birth = '13 Nov 1900';
  p.notes = p.notes.filter(t => t !== 'CORRECTION: born 1901 in Maryland (aged 9 in 1910, 29 in 1930, 39 in 1940; Find a Grave 1901) and died 9 Apr 1952 in Baltimore, per her death notice (Baltimore Sun, 10 Apr 1952). She was about 51, not in her early sixties as Barbara remembered.');
  p.death = '9 Apr 1952';
  drop(p, 'notes', /^Birth estimated: Barbara says her grandmother died in her early sixties/);
  p.milestones = p.milestones.filter(t => t !== 'Death.');
  add(p.milestones, 'Buried at New Cathedral Cemetery, Baltimore');
  add(p.locations, 'Harford County, Maryland');
  add(p.locations, '1143 Carroll Street, Baltimore (1952)');
  note(p, 'CORRECTION: born 13 Nov 1900 at Fallston, Harford County, and baptized 2 Dec 1900 at St John\'s Church (Quinn Family Tree on Ancestry; aged 9 in 1910, 29 in 1930, 39 in 1940; Find a Grave gives 1901), and died 9 Apr 1952 in Baltimore, per her death notice (Baltimore Sun, 10 Apr 1952). She was about 51, not in her early sixties as Barbara remembered.');
  note(p, 'Daughter of Bernard Quinn and Emily M. (Lynn), both born in Ireland; in 1910 the family lived in District 3, Harford County, Maryland.');
});
person('quinn_bernard', 'Bernard Quinn', 'M', [C1910, FAG(222563596)], p => {
  p.birth = p.birth || '1852'; p.death = p.death || '1913';
  add(p.aliases, 'Barnie Quinn');
  for (const l of ['Ireland', 'Harford County, Maryland']) add(p.locations, l);
  note(p, 'Born in Ireland; "Barnie Quin", aged 58, in the 1910 census of District 3, Harford County, Maryland, with his wife Emily M. and children Agnes E. (14), John J. (12), Ethel E. (9) and Margaret A. (4).');
  note(p, 'Children named on Find a Grave: Sarah Catherine "Sally" (Brady, 1889–1959), Charlotte Ann (Landreth, 1892–1971), John Joseph (1898–1956), Ethel E. (Schriefer, 1901–1952) and Margaret M. (Osborne, 1905–1946).');
});
person('lynn_emily_mariam', 'Emily Mariam Lynn (Quinn, Cook)', 'F', [C1910, C1930, FAG(222563596)], p => {
  p.birth = p.birth || '1869'; p.death = p.death || '1937';
  for (const a of ['Emily M. Quinn', 'Emily Cook']) add(p.aliases, a);
  for (const l of ['Ireland', 'Harford County, Maryland', 'Baltimore, Maryland']) add(p.locations, l);
  note(p, 'Born in Ireland; wife of Bernard Quinn in 1910 (aged 39). After his death in 1913 she married Earnest Cook; in 1930 they lived with her daughter Ethel and son-in-law George Schriefer on Barclay Street, Baltimore. Her granddaughter Emily Margaret Schriefer was likely named for her.');
});
wed('quinn_bernard', 'lynn_emily_mariam');
child('ethel_quinn_schriefer', 'quinn_bernard', 'lynn_emily_mariam');
edit('quinn_john_joseph', [C1910, FAG(222563596)], p => {
  p.birth = '6 May 1898';
  p.death = 'Feb 1956';
  p.notes = p.notes.filter(t => !t.startsWith('CORRECTION: 1898–1956 per Find a Grave (aged 12 in the 1910 census)'));
  note(p, 'CORRECTION: born 6 May 1898 at Fallston, Harford County, and died Feb 1956 in Baltimore (Quinn Family Tree on Ancestry, citing the Social Security Death Index; Find a Grave 1898–1956; aged 12 in the 1910 census); the earlier abt 1900 / abt 1959 were estimates. Ethel\'s sister Margaret (b. 1905) was younger than him, so he was the youngest brother rather than the youngest sibling.');
});
child('quinn_john_joseph', 'quinn_bernard', 'lynn_emily_mariam');

// Emily Margaret Schriefer and her first husband
edit('emily_schrieffer_mckeldin', [C1930, C1940, OBIT, FAG(222564260)], p => {
  rename(p, ['Emily Schrieffer (McKeldin)'], 'Emily Margaret Schriefer (Poehlman, McKeldin)');
  for (const a of ['Emily Schriefer', 'Emily Poehlman', 'Emily Margaret McKeldin']) add(p.aliases, a);
  p.birth = '20 Feb 1921';
  p.death = '21 Oct 1950';
  drop(p, 'notes', /^(Birth estimated: Barbara says her mother died at 36|DOB and full middle name still unknown|Surname spelling: Barbara uses both Schriefer|Maiden name Schriefer\/Schrieffer — spelling unresolved|Additional spouse: poleman_jack)/);
  p.milestones = p.milestones.filter(t => !/^Married Jack Poleman/.test(t));
  add(p.milestones, 'Married Jack Hetrick Poehlman (m. 1941)');
  add(p.milestones, 'Buried at New Cathedral Cemetery, Baltimore');
  add(p.locations, '1143 Carroll Street, Baltimore');
  note(p, 'CORRECTION: born 20 Feb 1921 in Baltimore and died 21 Oct 1950, in her 30th year, per her death notice (Baltimore Sun, 23 Oct 1950) and Find a Grave; she was 9 in the 1930 census and 19 in 1940. The earlier birth "abt 1914" came from Barbara remembering her as 36, and 24 Oct was not her death date.');
  note(p, 'The censuses, her parents\' death notices and Find a Grave spell the family name Schriefer.');
});
edit('poleman_jack', FAG(222564260), p => {
  rename(p, ['Jack Poleman'], 'Jack Hetrick Poehlman');
  add(p.aliases, 'Jack Poleman');
  if (!p.birth) p.birth = '1919'; if (!p.death) p.death = '1944';
  drop(p, 'notes', /^Naval aviator; first husband of Emily Schriefer\. Shot down on D-Day\. Name per rule_updates/);
  add(p.milestones, 'Married Emily Margaret Schriefer (m. 1941)');
  note(p, 'First husband of Emily Margaret Schriefer (m. 1941). Find a Grave lists him as 1Lt. Jack Hetrick Poehlman (1919–1944). Family memory says he was a naval aviator shot down on D-Day; a first lieutenant\'s rank suggests the Army Air Forces instead (not confirmed).');
});
wed('emily_schrieffer_mckeldin', 'poleman_jack');

// Emily's brothers
edit('schriefer_kenneth', [C1930, C1940, OBIT], p => { rename(p, ['Kenneth Schriefer'], 'Kenneth Joseph Schriefer'); add(p.aliases, 'Kenneth Schriefer'); if (!p.birth) p.birth = 'abt 1923'; note(p, 'Kenneth J., aged 7 in the 1930 census and 16 in 1940; named Kenneth Joseph in his parents\' death notices.'); });
edit('schriefer_george_jr', [C1930, C1940, FAG(68447197)], p => { rename(p, ['George Schriefer Jr.'], 'George Bernard Schriefer'); add(p.aliases, 'George Schriefer Jr.'); if (!p.birth) p.birth = '1925'; if (!p.death) p.death = '1992'; note(p, 'George Bernard Schriefer (1925–1992) on Find a Grave; aged 5 in the 1930 census and 15 in 1940.'); });

// family lines now start a generation earlier
const BR = path.resolve(__dirname, '..', 'data', 'branches.json');
const bj = JSON.parse(fs.readFileSync(BR, 'utf8'));
for (const b of bj.branches) {
  if (b.key === 'quinn') b.roots = ['quinn_bernard', 'lynn_emily_mariam'];
  if (b.key === 'schriefer') b.roots = ['schriefer_bartholomew', 'denzlein_margaret'];
}
fs.writeFileSync(BR, JSON.stringify(bj, null, 1) + '\n');
console.log('Ancestry McKeldin/Schriefer/Quinn records applied');
