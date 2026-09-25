#!/usr/bin/env node
/**
 * 2026-09-25, William H. Bell and Elmira "Ella" (Flaherty) Bell of Baltimore,
 * Brendan's 3x-great-grandparents, and their parents, from FamilySearch:
 * NUMIDENT files of three of their children (mother's maiden name Flaherty),
 * the 1860–1900 censuses of Baltimore's 18th ward, and the shared FamilySearch
 * tree as a guide. Re-runnable.
 */
'use strict';
const { exists, load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, sex, birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
const edit = (id, src, fn) => { const p = load(id); p.notes = p.notes || []; p.sources = p.sources || []; p.locations = p.locations || []; p.aliases = p.aliases || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); };
const person = (id, name, sex, src, fn) => { if (!exists(id)) save(blank(id, name, sex)); edit(id, src, fn); };
const refine = (p, k, v) => { if (!p[k] || /^(abt |about )?\d{4}$/i.test(String(p[k]).trim())) p[k] = v; };
const child = (kid, father, mother) => { edit(kid, [], p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; }); for (const par of [father, mother].filter(Boolean)) edit(par, [], p => add(p.relationships.children, kid)); };
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, [], p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };
const swapNote = (p, from, to) => { const i = p.notes.findIndex(n => n.startsWith(from)); if (i >= 0) p.notes[i] = to; else note(p, to); };

const NUM = 'FamilySearch, United States, Social Security Numerical Identification Files (NUMIDENT), 1936-2007: Emma Virginia McKeldin, born 13 Aug 1891 Baltimore (ark 1:1:6K9T-21YR); Charles Alexander Bell, born 25 May 1881 (1:1:6K4J-2SHC); William Ambrose Bell, born 24 Jan 1889 (1:1:6K4J-GSGD); each naming the parents William H. Bell and Elmira / Ella Flaherty (spelled Flaharty, Flagharty, Flaherty)';
const C1880 = 'FamilySearch, United States Census, 1880 (Baltimore, 18th Ward, precinct 6; household of William H. Bell, blacksmith; ark 1:1:MNQD-SLT)';
const C1870B = 'FamilySearch, United States Census, 1870 (Baltimore, ward 18; household of John Bell, 48; ark 1:1:MN34-QDG)';
const C1870F = 'FamilySearch, United States Census, 1870 (Baltimore; household of Thomas Fleharty, 46; ark 1:1:MN3W-JYB)';
const C1860F = 'FamilySearch, United States Census, 1860 (18th Ward, Baltimore City; household of Thos. Fleeharty, 32; ark 1:1:M69F-68H)';
const C1900 = 'FamilySearch, United States Census, 1900 (Baltimore city Ward 22, precinct 5, ED 283, sheet 7A; household of William Bell; ark 1:1:M3KP-XCG)';
const C1880J = 'FamilySearch, United States Census, 1880 (Baltimore; household of Jehu A. Bell, 59; ark 1:1:MNQ8-1WK)';
const LOUDON = 'FamilySearch, Maryland, Baltimore, Loudon Park Cemetery, Cemetery Records, 1853-1986 (Jehu A. Bell, born 1820, buried 7 Oct 1899; ark 1:1:QRJT-Z4N2)';
const FST = 'FamilySearch Family Tree, William Henry Bell (LBP5-ZNF), Almira Fluharty (LRGQ-9J8), Jehu A. Bell (9WVZ-VC6), Sarah Elizabeth Collins (9WVZ-VCG), Margaret Flaherty (GSST-JHW) and Thos. Fleeharty (G3HR-HGJ); a shared tree, used as a guide only';
const NUMK = 'FamilySearch, United States, Social Security Numerical Identification Files (NUMIDENT), 1936-2007 (children of Charles E. McKeldin and Emma V. Bell: Charles Edward McKeldin, 1:1:6K3X-1323; Helen McKeldin Souder, 1:1:6K3X-FZS6; William Henry McKeldin, 1:1:6K3N-QTF8; Lillian May Norris, 1:1:6K3D-FZN3)';

// ── William H. Bell ─────────────────────────────────────────────────────────
edit('bell_william_h', [NUM, C1880, C1870B, C1900, FST], p => {
  p.name = 'William Henry Bell';
  if (p.birth === 'abt 1854') p.birth = 'May 1854';
  for (const l of ['18th Ward, Baltimore, Maryland', '1118 Cleveland Street, Baltimore (1900)', '1143 Carroll Street, Baltimore (1920)']) add(p.locations, l);
  for (const a of ['William H. Bell', 'William Bell']) add(p.aliases, a);
  note(p, 'Born May 1854 in Maryland (1900 census; the FamilySearch tree gives 25 May 1855), son of John (Jehu A.) Bell and Sarah. In 1870, aged 16, he was at home in Baltimore\'s 18th ward with John, 48, Sarah, 39, brothers Thomas, John, Charles and George W., and Catharine Bell, 76, presumably his grandmother (1870 census).');
  note(p, 'A blacksmith in 1880, aged 26, in the 18th ward with his wife Elmira, 22, daughter Sarah E., 3, and Elmira\'s brother Charles Flaharty, 14 (1880 census). Married about 1876: the 1900 census gives 24 years married, both parents born in Maryland.');
  note(p, 'His wife\'s maiden name was Flaherty: the Social Security applications of their children Charles Alexander (born 25 May 1881), William Ambrose (24 Jan 1889) and Emma Virginia (13 Aug 1891) all name their parents as William H. Bell and Elmira or Ella Flaherty, variously spelled. Alive in January 1920, aged 66, with Emma and Charles McKeldin. The FamilySearch tree gives his death as 22 Feb 1921 in Maryland, from a Find a Grave entry not yet seen; a William H. Bell, 71, buried at Loudon Park on 18 Nov 1921 is probably someone else.');
});

// ── Elmira "Ella" (Flaherty) Bell ───────────────────────────────────────────
edit('bell_elmira', [NUM, C1880, C1870F, C1860F, C1900, FST], p => {
  p.name = 'Elmira "Ella" Flaherty (Bell)';
  if (p.birth === 'abt 1858') p.birth = 'Jun 1857';
  add(p.locations, '18th Ward, Baltimore, Maryland');
  for (const a of ['Almira Flaherty', 'Elmira Flaherty', 'Almira Fleeharty']) add(p.aliases, a);
  swapNote(p, 'Mother of Emma Virginia Bell (McKeldin). Elmira in the 1900 census',
    'Mother of Emma Virginia Bell (McKeldin). Elmira in the 1900 census (aged 42) and Ella in 1920 (aged 62), born in Maryland. Her maiden name was Flaherty: the Social Security applications of her children Charles Alexander, William Ambrose and Emma Virginia give their mother as Elmira or Ella Flaherty (spelled Flaharty and Flagharty as well). Margaret "Clayhardy", 73, the mother-in-law in William Bell\'s 1900 household, is her mother Margaret Flaherty, mis-indexed.');
  note(p, 'Born June 1857 in Maryland (the FamilySearch tree, from the censuses), daughter of Thomas and Margaret Flaherty of Baltimore\'s 18th ward: Almira, 3, in 1860 with Thos. and Margaret Fleeharty, and 13 in 1870 with Thomas and Margaret Fleharty, her sister Mary M. and brother Charles. Her brother Charles, 14, lived with her and William in 1880. Her death is not yet found; she was alive in January 1920.');
});
wed('bell_william_h', 'bell_elmira');

// ── Bell parents ────────────────────────────────────────────────────────────
person('bell_jehu_a', 'Jehu A. "John" Bell', 'M', [C1870B, C1880J, LOUDON, FST], p => {
  refine(p, 'birth', '19 Oct 1820'); refine(p, 'death', '6 Oct 1899');
  for (const l of ['18th Ward, Baltimore, Maryland', 'Loudon Park Cemetery, Baltimore']) add(p.locations, l);
  add(p.aliases, 'John Bell');
  note(p, 'Inferred: father of William Henry Bell. John Bell, 48, born in Maryland, headed the 18th-ward household in 1870 in which William H., 16, lived with Sarah, 39, and four younger boys (1870 census); the same family appears in 1880 as Jehu A. Bell, 59, with Sarah E. and sons Charles, George and Jehu A. (1880 census). The FamilySearch tree gives his birth as 19 Oct 1820 at Baltimore and his death as 6 Oct 1899 there; a Jehu A. Bell, born 1820, was buried at Loudon Park Cemetery on 7 Oct 1899 (cemetery records).');
});
person('collins_sarah_elizabeth', 'Sarah Elizabeth Collins (Bell)', 'F', [C1870B, C1880J, FST], p => {
  refine(p, 'birth', '1827'); refine(p, 'death', '1897');
  add(p.locations, '18th Ward, Baltimore, Maryland');
  add(p.aliases, 'Sarah E. Bell');
  note(p, 'Inferred: mother of William Henry Bell; Sarah, 39, in the 1870 household of John Bell, and Sarah E. in Jehu A. Bell\'s in 1880. UNPROVEN, from the FamilySearch tree only: born 1827, died 1897; maiden name Collins; married Jehu A. Bell on 28 Dec 1847 in the District of Columbia; eight children.');
});
wed('bell_jehu_a', 'collins_sarah_elizabeth');
child('bell_william_h', 'bell_jehu_a', 'collins_sarah_elizabeth');

// ── Flaherty parents ────────────────────────────────────────────────────────
person('flaherty_thomas', 'Thomas Flaherty', 'M', [C1860F, C1870F, FST], p => {
  refine(p, 'birth', 'abt 1826');
  add(p.locations, '18th Ward, Baltimore, Maryland');
  for (const a of ['Thomas Fleharty', 'Thos. Fleeharty']) add(p.aliases, a);
  note(p, 'Father of Elmira (Bell). Head of an 18th-ward household in 1860 (Thos. Fleeharty, 32, born in Maryland, with Margaret, 32, Emma and Francis Pheobus, 13 and 8, Almira, 3, Mary, 1, and Wm. Chambers, 55) and in 1870 (Thomas Fleharty, 46, with Margaret, 43, Almira, 13, Mary M., 11, and Charles, 5). The censuses put his birth at 1824–1828. Dead by 1900, when Margaret was living with the Bells as a widow; his death is not yet found.');
});
person('flaherty_margaret', 'Margaret (Phoebus, Flaherty)', 'F', [C1860F, C1870F, C1900, FST], p => {
  refine(p, 'birth', 'May 1827'); refine(p, 'death', '2 Aug 1912');
  for (const l of ['18th Ward, Baltimore, Maryland', '1118 Cleveland Street, Baltimore (1900)']) add(p.locations, l);
  for (const a of ['Margaret Fleharty', 'Margaret Clayhardy']) add(p.aliases, a);
  note(p, 'Mother of Elmira (Bell). Born May 1827 in Maryland; wife of Thomas Flaherty in the 1860 and 1870 censuses; in 1900, aged 73 and widowed, she lived with her daughter and William Bell at 1118 Cleveland Street, indexed as Margaret "Clayhardy", mother-in-law. Her birth surname is not yet known. UNPROVEN, from the FamilySearch tree: married first Francis A. Phoebus at Baltimore on 10 Sep 1846, the father of the Emma and Francis Phoebus in her 1860 household; died 2 Aug 1912 in Maryland.');
});
wed('flaherty_thomas', 'flaherty_margaret');
child('bell_elmira', 'flaherty_thomas', 'flaherty_margaret');

// ── Bell siblings of Emma with dated records ────────────────────────────────
const SIBS = [
  ['bell_charles_alexander', 'Charles Alexander Bell', 'M', '25 May 1881', 'Born 25 May 1881 at Baltimore, son of William H. Bell and Elmira Flaherty (his 1937 Social Security application); Charles A., 19, at home in 1900.'],
  ['bell_william_ambrose', 'William Ambrose Bell', 'M', '24 Jan 1889', 'Born 24 Jan 1889 at Baltimore, son of William H. Bell and Ella Flaherty (his 1937 Social Security application); William, 11, at home in 1900. A Wm. A. Bell, born 1889, died in Baltimore on 12 Oct 1944 (Maryland church records), possibly him.'],
];
for (const [id, name, sex, b, text] of SIBS) { person(id, name, sex, [NUM, C1900], p => { refine(p, 'birth', b); add(p.locations, 'Baltimore, Maryland'); note(p, text); }); child(id, 'bell_william_h', 'bell_elmira'); }

// ── Emma's children, from their Social Security files ───────────────────────
edit('emma_bell_mckeldin', [NUM, NUMK], p => {
  note(p, 'Her own Social Security application (October 1946) gives her birth as 13 Aug 1891 at Baltimore to William H. Bell and Elmira Flaharty; her mother\'s maiden name was Flaherty. Her children\'s applications name her as Emma V. Bell, wife of Charles E. McKeldin.');
});
edit('mckeldin_lillian_buckey', NUMK, p => { p.name = 'Lillian May McKeldin (Norris)'; add(p.aliases, 'Lillian May Norris'); note(p, 'Her Social Security file gives her full name as Lillian May and her married name as Norris, daughter of Charles E. McKeldin and Emma V. Bell.'); });
edit('mckeldin_helen_buckey', NUMK, p => { note(p, 'Her Social Security file, as Helen McKeldin Souder, names her parents Charles E. McKeldin and Emma V. Bell.'); });
edit('mckeldin_william_billy', NUMK, p => { add(p.aliases, 'William Henry McKeldin'); note(p, 'His Social Security file gives his full name as William Henry McKeldin, son of Charles McKeldin and Emma Bell; he was named for his grandfather William Henry Bell.'); });
console.log('Bell / Flaherty applied');
