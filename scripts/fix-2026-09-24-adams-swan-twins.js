#!/usr/bin/env node
/**
 * 2026-09-24, Jose Pierre Adams's daughters Mary (Swan), Susan and Ursula,
 * and the Swan household, from the 1830–1870 censuses and Ohio county
 * marriage records on Ancestry.com. Re-runnable.
 *  - The 1860 census places Lewis Swan in Cleveland with his son Horatio's
 *    family and "Maria" (Mary Elizabeth), 19; Mary (Adams) Swan is gone.
 *  - Leads only: Mary E. Swan's 1866 marriage to Samuel Hand, and 1839 and
 *    1849 Delaware County marriages of a Susanna and an "Arsula C." Adams.
 */
'use strict';
const { load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
function edit(id, src, fn) { const p = load(id); for (const k of ['milestones', 'notes', 'sources', 'aliases', 'locations', 'career', 'education']) p[k] = p[k] || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); }

const C1830 = 'Ancestry.com, 1830 United States Federal Census (Granville, Licking County, Ohio)';
const C1850 = 'Ancestry.com, 1850 United States Federal Census (Columbus Ward 1, Franklin County, Ohio; NARA M432, roll 679, page 384b)';
const C1860 = 'Ancestry.com, 1860 United States Federal Census (Cleveland Ward 9, Cuyahoga County, Ohio; NARA M653, roll 953, page 899)';
const C1870 = 'Ancestry.com, 1870 United States Federal Census (Union, Licking County, Ohio; NARA M593, roll 1233, page 428A)';
const MARR = 'Ancestry.com, Ohio, U.S., County Marriage Records, 1774-1993';

edit('adams_mary_swan', [C1850, C1860, MARR], p => {
  add(p.locations, 'Columbus, Franklin County, Ohio');
  note(p, 'In the 1850 census she is Mary E. Swan, 33 (born about 1817), wife of Lewis Swan, a carpenter, at Columbus Ward 1, with his children Horatio M. (23) and Melissa (18) and her niece and stepdaughter Mary Elizabeth (10). The Franklin County marriage index gives her as Mary E. (or C.) Adams, married 24 Sep 1848. By 1860 Lewis was living with Horatio in Cleveland without her, so she died between 1850 and 1860.');
});
edit('swan_lewis', [C1830, C1850, C1860, C1870], p => {
  for (const l of ['Granville, Licking County, Ohio', 'Columbus, Franklin County, Ohio', 'Cleveland, Cuyahoga County, Ohio', 'Union Township, Licking County, Ohio']) add(p.locations, l);
  add(p.career, 'Carpenter (1850–1870).');
  note(p, 'A carpenter, born about 1805–07 in Vermont (1850, 1860; Connecticut in 1870). He headed a household at Granville, Licking County, in 1830; lived at Columbus in 1850; was with his son H. M. (Horatio) Swan in Cleveland Ward 9 in 1860, with Maria (Mary Elizabeth), 19; and in 1870, aged 64, lived with Stephen and Harriet J. (Adams) Gill at Union Township, Licking County (post office Etna), with Mary E., 30.');
});
edit('swan_horatio_m', [C1850, C1860], p => {
  p.birth = p.birth || 'abt 1827';
  add(p.locations, 'Cleveland, Cuyahoga County, Ohio');
  note(p, 'Son of Lewis Swan, probably by a marriage before Magdalena Adams; aged 23 in 1850 (Columbus). In 1860 "H. M. Swan", 30, lived in Cleveland Ward 9 with his wife Cecilia (24), daughter Frances C. (2), his father Lewis and his half-sister Maria (19).');
});
edit('swan_melissa', C1850, p => { p.birth = p.birth || 'abt 1832'; note(p, 'Daughter of Lewis Swan; aged 18 in the 1850 census at Columbus.'); });
edit('swan_mary_elizabeth', [C1850, C1860, C1870, MARR], p => {
  p.birth = p.birth || 'abt 1840';
  for (const a of ['Maria Swan', 'Mary E. Hand']) add(p.aliases, a);
  note(p, 'Aged 10 in 1850 (Columbus) and "Maria", 19, with her father and half-brother Horatio in Cleveland in 1860. In 1870, as Mary E., 30, she was with her father at her aunt Harriet (Adams) Gill\'s at Union Township, Licking County.');
  note(p, 'Lead: a Mary E. Swan married Samuel Hand on 2 May 1866 in Franklin County (Ohio county marriage records); the surname indexed as "Hanel" in the 1870 census may be Hand. Not confirmed.');
});
const OLD_TWIN_LEAD = 'Lead only: Ohio county marriage records include a Susanna Adams who married James Budd on 25 Dec 1839 and an "Arsula C." Adams who married John Sigler on 21 Jun 1849, both in Delaware County, next to Licking and Franklin. Neither is linked to this family by any record found, and the 1909 Gill biography says both twins had died by then.';
const FAG = 'Find a Grave, memorials 40110222 (Susannah Adams Budd) and Arsula C. Sigler (Leon, Iowa)';
for (const id of ['adams_susan_twin', 'adams_ursula_twin']) edit(id, [MARR, FAG], p => {
  p.notes = p.notes.filter(t => t !== OLD_TWIN_LEAD);
  note(p, 'Checked and ruled out: the Susanna Adams who married James Budd in Delaware County, Ohio, on 25 Dec 1839 was born in Ohio on 20 May 1816, a daughter of Elijah Adams, and died in Indiana in 1896; the "Arsula C." Adams who married John Sigler there on 21 Jun 1849 was born at Harlem, Delaware County, on 19 Mar 1830, a daughter of John and Desire (Cook) Adams, and died at Leon, Iowa, in 1908. No record of either twin after 1830 has been found.');
});

// Jose Pierre Adams: a lead on his parents
const WILL = 'Ancestry.com, New Jersey, U.S., Wills and Probate Records, 1739-1991 (will of Evi Adams Esq. of Wantage, Sussex County, dated 9 Dec 1815; Sussex County Wills, vol. C–D, 1828–1855)';
const FAG_EVI = 'Find a Grave, memorial 5983703 (Judge Evi Adams, 1744–1828, quoting his entries in the records of the First Baptist Church of Wantage, New Jersey)';
edit('adams_jose_pierre', [WILL, FAG_EVI], p => note(p, "UNPROVEN lead on his parents: about twenty Ancestry member trees make him \"Joseph Perry Adams\", born 15 Mar 1783, son of Judge Evi Adams (1744–1828) and Jane Lewis of Wantage, Sussex County, New Jersey. Evi's own entries in the Wantage First Baptist Church records list a son Joseph born 15 Mar 1783 (an earlier Joseph died in 1774), and Evi's will of 9 Dec 1815 leaves \"my son Joseph Adams\" $1,200 out of money he had already received, beside his sons Lewis, John E., Evi and Ellis. Neither record gives a middle name or ties that Joseph to Virginia; the trees' \"Perry\" middle name, Fredericksburg birthplace and 1843 death are unsourced. The birth year fits Jose's (1780–1790 in the 1820 and 1830 censuses), and the New Jersey origin fits the family story, but no link has been proved."));
console.log('Adams–Swan and twins applied');
