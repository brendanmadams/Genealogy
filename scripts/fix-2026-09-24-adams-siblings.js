#!/usr/bin/env node
/**
 * 2026-09-24, George Francis Adams Sr. and his brother and sister, Presley
 * and Edith, from Oregon birth certificates, the 1920–1950 censuses, draft
 * and death records, and Presley's 1987 obituary. Re-runnable.
 *  - George Sr.'s birth certificate named him George Francis on 25 Mar 1916,
 *    two weeks after his birth; there is no "Edward G. Adams" certificate.
 *    The 1930 census lists him as George F., 14, beside Presley and Edith.
 *  - His father died 7 Feb 1920 (Oregon death index), not 1918.
 *  - Presley was registered as Pressley Alfred Adams; he used Presley Mark.
 *    His children were Frederick S., Serena A. (Haapala) and Kathleen.
 *  - Edith's "V." is Van Tyne. She married Thomas White Childs about 1934;
 *    their sons were George C. and Gregg E. Childs.
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
const rename = (p, from, to) => { if (from.includes(p.name)) { add(p.aliases, p.name); p.name = to; } };
const drop = (p, ...prefixes) => { p.notes = p.notes.filter(t => !prefixes.some(x => t.startsWith(x))); };

const BIRTHS = 'Ancestry.com, Oregon, U.S., State Births, 1842-1924 (Oregon State Archives)';
const C1920 = 'Ancestry.com, 1920 United States Federal Census (Sutherlin, Douglas County, Oregon)';
const C1930 = 'Ancestry.com, 1930 United States Federal Census (Burlingame, San Mateo County, California)';
const C1940 = 'Ancestry.com, 1940 United States Federal Census';
const C1950 = 'Ancestry.com, 1950 United States Federal Census';
const OR_DEATH = 'Ancestry.com, Oregon, U.S., Death Index, 1898-2008';
const DRAFT = 'Ancestry.com, U.S., World War II Draft Cards Young Men, 1940-1947';
const NV_DEATH = 'Ancestry.com, Nevada, U.S., Death Index, 1980-2012';
const OB_PRESLEY = 'Obituary of Presley M. Adams, Reno Gazette-Journal, 11 Jan 1987 (Newspapers.com Obituary Index on Ancestry.com)';
const GRAVES = 'Ancestry.com, U.S., Veterans\' Gravesites, ca. 1775-2019 (Willamette National Cemetery)';
const FAG_EDITH = 'Find a Grave, memorial 36261118 (Edith Childs, Willamette National Cemetery)';
const FAG_GEORGE = 'Find a Grave, memorial 239144218 (George Francis Adams, 1916–1980)';

// ── George Francis Adams (#2), the father ────────────────────────────────────
edit('adams_george_francis_2', OR_DEATH, p => {
  p.relationships.siblings = p.relationships.siblings.filter(s => !['adams_presley', 'adams_edith_v'].includes(s));
  drop(p, 'Unconfirmed: Trudy said he died in 1918', 'Unconfirmed: A death certificate for him probably exists');
  note(p, 'The Oregon death index records his death on 7 Feb 1920 in Douglas County, which settles the date; Trudy\'s 1918 was mistaken.');
  note(p, 'On his children\'s birth certificates he is a druggist or pharmacist, born in Missouri: at Roseburg in 1910 (aged 33) and 1916, and at Sutherlin in 1912 (aged 35).');
});
edit('trumbo_serena_marie', BIRTHS, p => {
  add(p.locations, 'Chehalis, Washington');
  note(p, 'Her son George\'s 1916 birth certificate gives her birthplace as Chehalis, Washington.');
});

// ── George Francis Adams Sr. ────────────────────────────────────────────────
edit('george_francis_adams_sr', [BIRTHS, C1930, FAG_GEORGE], p => {
  drop(p, 'Unconfirmed: His mother Neenie seems to have changed his name', 'Unconfirmed: His sister Trudy said he was 2 years old', 'Unconfirmed: His son George can only guess that the \'G\'', 'Open question: George Francis Adams Sr. appears as Edward G.');
  p.notes = p.notes.map(t => t.replace(' Brendan Adams doubts they are the same person; left open.', '').replace(' The emails say Oregon birth certificates exist under both names.', ''));
  add(p.locations, 'Roseburg, Douglas County, Oregon');
  add(p.milestones, 'Born at Mercy Hospital, Roseburg, Oregon, 10 Mar 1916');
  note(p, 'CORRECTION 2026-09-24: His Oregon birth certificate (no. 25) records George Francis Adams, born 10 Mar 1916 at Mercy Hospital, Roseburg, the third child of George Francis Adams, druggist, and Serena Trumbo, of Sutherlin. The given name was added by a supplemental report on 25 Mar 1916, so he was named George Francis two weeks after birth, not renamed after his father\'s death. No certificate exists for an Edward G. Adams. The "Edward G. Adams", aged 3, in the 1920 census is the only young son in the household, and in 1930 he appears as George F., 14, stepson of Arthur T. Wells, with Presley and Edith, so "Edward G." looks like the enumerator\'s error or a family name.');
  note(p, 'His father died on 7 Feb 1920 (Oregon death index), when George was nearly 4, not in 1918 when he was 2.');
  note(p, 'He died on 11 Oct 1980 at Tacoma, Washington (Find a Grave, memorial 239144218).');
});

// ── Presley ─────────────────────────────────────────────────────────────────
edit('adams_presley', [BIRTHS, C1920, C1930, C1940, DRAFT, NV_DEATH, OB_PRESLEY], p => {
  rename(p, ['Presley Adams'], 'Presley Mark Adams');
  for (const a of ['Pressley Alfred Adams', 'Presley M. Adams', 'Presley Adams']) add(p.aliases, a);
  p.relationships.siblings = p.relationships.siblings.filter(s => s !== 'adams_george_francis_2');
  if (p.death === 'January 1987') p.death = '9 Jan 1987';
  for (const l of ['Roseburg, Douglas County, Oregon', 'Richmond, Contra Costa County, California', 'Gardnerville, Douglas County, Nevada']) add(p.locations, l);
  add(p.career, 'Laboratory technician for the Standard Oil Company of California at Richmond (1940); he had four years of college.');
  drop(p, 'Sibling of George Francis Adams Sr. (child of George Francis Adams #2 and Serena Trumbo). Previously listed as', 'He and Fran had three children: Sally, Casey and a third');
  note(p, 'Born 22 Jun 1910 at Roseburg, Oregon, the first child of George F. Adams, druggist, and Serena Trumbo; his birth certificate names him Pressley Alfred Adams. As an adult he used Presley Mark Adams (1940 draft card, which gives 21 Jun 1910); family papers called him Presley Marcason, and the 1920 census index reads "Presley N."');
  note(p, 'In 1930 he was 20, a stepson in Arthur T. Wells\'s household at Burlingame, California. By 1940 he lived at 140 Santa Fe Avenue, Richmond, with his wife Frances (24) and their infant son. He died on 9 Jan 1987 at Gardnerville, Nevada.');
  note(p, 'His obituary (Reno Gazette-Journal, 11 Jan 1987) names his wife Frances; his children Frederick S. Adams, Serena A. Haapala and Kathleen Adams; and his sisters Edith Childs, Daphne Miller and Rosemary O\'Dell.');
});
edit('adams_fran', [C1940, DRAFT, OB_PRESLEY], p => {
  rename(p, ['Fran Adams'], 'Frances “Fran” Adams');
  add(p.aliases, 'Fran Adams');
  note(p, 'Frances Adams, aged 24 in the 1940 census (born about 1916), at Richmond, California; named as Presley\'s wife on his 1940 draft card and in his 1987 obituary.');
});
person('adams_frederick_s', 'Frederick S. Adams', 'M', [C1940, OB_PRESLEY], p => note(p, 'Son of Presley and Frances Adams; an infant in the 1940 census at Richmond, California, and named in his father\'s 1987 obituary.'));
child('adams_frederick_s', 'adams_presley', 'adams_fran');
edit('adams_sally', OB_PRESLEY, p => {
  add(p.aliases, 'Serena A. Haapala');
  note(p, 'Probably the "Serena A. Haapala" named as Presley\'s daughter in his 1987 obituary; Sally would be a nickname, and Serena was her grandmother\'s name.');
});
edit('adams_casey', OB_PRESLEY, p => {
  add(p.aliases, 'Kathleen Adams');
  note(p, 'Probably the "Kathleen Adams" named as Presley\'s daughter in his 1987 obituary, unmarried then; Casey would be a nickname.');
});
for (const id of ['adams_frederick_s', 'adams_sally', 'adams_casey']) edit(id, [], p => { for (const o of ['adams_frederick_s', 'adams_sally', 'adams_casey']) if (o !== id) add(p.relationships.siblings, o); });

// ── Edith ───────────────────────────────────────────────────────────────────
edit('adams_edith_v', [BIRTHS, C1920, C1930, C1940, C1950, OR_DEATH, GRAVES, FAG_EDITH, OB_PRESLEY], p => {
  rename(p, ['Edith V. Adams (Childs)'], 'Edith Van Tyne Adams (Childs)');
  for (const a of ['Edith Adams Childs', 'Edith A. Childs']) add(p.aliases, a);
  p.relationships.siblings = p.relationships.siblings.filter(s => s !== 'adams_george_francis_2');
  if (!p.birth || p.birth === 'abt 1913') p.birth = '29 Apr 1912';
  if (!p.death) p.death = '10 May 2000';
  for (const l of ['Sutherlin, Douglas County, Oregon', 'Philadelphia, Pennsylvania', 'Portland, Oregon']) add(p.locations, l);
  p.milestones = p.milestones.filter(t => t !== 'Married Thomas Childs');
  add(p.milestones, 'Married Thomas White Childs (m. abt 1934)');
  add(p.milestones, 'Buried at Willamette National Cemetery, Portland, Oregon (7 Jun 2000)');
  drop(p, 'Birth year approximate: abt 1913.', 'She had two sons, surname Childs; their names are not recorded.', 'UNPROVEN: her marriage to Thomas Childs and their two sons');
  note(p, 'Born 29 Apr 1912 at Sutherlin, Oregon, the second child of George F. Adams, pharmacist, and Serena Trumbo. Her birth certificate is marked "ALTERED": her given names, Edith Van Tyne, were added later by affidavit. Van Tyne is her grandmother Mary Frances Vantine\'s surname.');
  note(p, 'In 1930 she was 17, a stepdaughter in Arthur T. Wells\'s household at Burlingame. She married Thomas White Childs about 1934 (married 16 years in 1950); they lived in Philadelphia in 1935 and in Portland, Oregon, from 1940, with their sons George C. and Gregg E. Childs. She died on 10 May 2000 and was buried beside Thomas at Willamette National Cemetery.');
});
edit('childs_thomas', [C1940, C1950, GRAVES, FAG_EDITH], p => {
  rename(p, ['Thomas Childs'], 'Thomas White Childs');
  add(p.aliases, 'Thomas W. Childs II');
  p.birth = p.birth || '20 May 1908'; p.death = p.death || '7 May 1998';
  add(p.locations, 'Portland, Oregon');
  add(p.career, 'Captain, U.S. Army.');
  p.milestones = p.milestones.filter(t => t !== 'Married Edith V. Adams');
  add(p.milestones, 'Married Edith Van Tyne Adams (m. abt 1934)');
  add(p.milestones, 'Buried at Willamette National Cemetery, Portland, Oregon');
  drop(p, 'UNPROVEN: known only from family recollection', 'Husband of Edith V. Adams, George Francis Adams Sr.’s sister; they had two sons, whose names are not recorded.');
  note(p, 'Husband of Edith (Adams) Childs, George Francis Adams Sr.\'s sister. Born 20 May 1908; died 7 May 1998; a captain in the U.S. Army, buried at Willamette National Cemetery. With Edith and their sons George C. and Gregg E. in Portland in 1940 and 1950.');
});
for (const [id, name] of [['childs_george_c', 'George C. Childs'], ['childs_gregg_e', 'Gregg E. Childs']]) {
  person(id, name, 'M', [C1940, C1950], p => note(p, 'Son of Thomas White and Edith (Adams) Childs; in their Portland household in the 1950 census.'));
  child(id, 'childs_thomas', 'adams_edith_v');
}
for (const id of ['childs_george_c', 'childs_gregg_e']) edit(id, [], p => add(p.relationships.siblings, id === 'childs_george_c' ? 'childs_gregg_e' : 'childs_george_c'));

// Daphne's married name is confirmed by Presley's obituary
edit('bill_daphne_wells', OB_PRESLEY, p => {
  p.notes = p.notes.filter(t => t !== 'The surname Miller is John Howard Adams’s recollection (2026); not yet confirmed by a document.');
  note(p, 'Presley Adams\'s 1987 obituary names his sister as Daphne Miller, confirming the surname; the first name Bill is family recollection.');
});
edit('wells_daphne', OB_PRESLEY, () => {});
edit('wells_rosemary', OB_PRESLEY, p => note(p, 'Named as Rosemary O\'Dell, a sister of Presley Adams, in his 1987 obituary.'));
console.log('Adams siblings applied');
