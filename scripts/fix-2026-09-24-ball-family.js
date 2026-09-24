#!/usr/bin/env node
/**
 * 2026-09-24, Ellen Rogers (Ball) McPhail's parents and brothers and
 * sisters, from the 1850–1900 censuses, the 1833 Roane County marriage
 * record, Tennessee death records and Find a Grave, with Irma Kulp Zacher's
 * Kulp-Ritchey-Dorsett Family Tree (4662169) as a guide. Re-runnable.
 *  - "Graden" was Draden (Drady) Catherine Davis: David Ball married "Drary
 *    Davis" in Roane County on 21 Dec 1833, and her son Thomas's death
 *    certificate gives his mother's maiden name as Davis.
 *  - The grandparents (William Ball and Nancy Tate; Samuel G. Davis and
 *    Rebecca Rogers) come only from member trees and are marked UNPROVEN.
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
const rename = (p, from, to) => { if (from.includes(p.name)) { add(p.aliases, p.name); p.name = to; } };

const MARR = "Ancestry.com, Tennessee, U.S., Marriage Records, 1780-2002 (David Ball and Drary Davis, Roane County, 21 Dec 1833)";
const C1850 = "Ancestry.com, 1850 United States Federal Census (Subdivision 22, Meigs County, Tennessee)";
const C1860 = "Ancestry.com, 1860 United States Federal Census (District 2, McMinn County, Tennessee)";
const C1870 = "Ancestry.com, 1870 United States Federal Census (District 8, Roane County, Tennessee)";
const C1880 = "Ancestry.com, 1880 United States Federal Census (District 8, Roane County, Tennessee)";
const C1900 = "Ancestry.com, 1900 United States Federal Census (Civil District 2, McMinn County, Tennessee)";
const TN_DEATH = "Ancestry.com, Tennessee, U.S., Death Records, 1908-1965 (Thomas T. Ball, McMinn County, 1924, certificate 195)";
const KULP = "Ancestry.com, public member tree \"Kulp-Ritchey-Dorsett Family Tree\" (tree 4662169)";

// ── David and Draden ─────────────────────────────────────────────────────────
edit('ball_david', [MARR, C1850, C1880, KULP], p => {
  rename(p, ['David Ball'], 'David Tate Ball');
  add(p.aliases, 'David Ball');
  if (!p.birth || p.birth === 'abt 1812') p.birth = '25 Dec 1813';
  if (!p.death) p.death = '18 Mar 1886';
  for (const l of ['Hawkins County, Tennessee', 'Meigs County, Tennessee']) add(p.locations, l);
  add(p.milestones, 'Married Draden “Drady” Davis (m. 21 Dec 1833, Roane County, Tennessee)');
  p.notes = p.notes.filter(t => !t.startsWith('Inferred from the censuses: aged 48 in 1860'));
  note(p, "Married \"Drary Davis\" (Draden Catherine Davis) on 21 Dec 1833 in Roane County, Tennessee. The family is in the censuses at Subdivision 22, Meigs County, in 1850 (David 36, with Dorden 34 and eight children); District 2, McMinn County, in 1860; and District 8, Roane County, in 1870 and 1880 (with Drady C.). Eleven children are known: William Henry (1834), Samuel G. (1836), Sarah (abt 1837), Nancy Rebecca (1841), Thomas T. (1842), George W. (1844), Mary Ann (abt 1846), Martha E. (abt 1849), Ellen Rogers (1851), Margaret (abt 1854) and Catharine (abt 1857).");
  note(p, "The Kulp-Ritchey-Dorsett tree gives his full name as David Tate Ball, born 25 Dec 1813 in Hawkins County, Tennessee (the censuses put his birth in 1812–1814), and his death as 18 Mar 1886 at Rogersville, Roane County. The middle name Tate, his mother's reputed surname, was given to Ellen's son John Tate McPhail.");
  note(p, "UNPROVEN: the Kulp-Ritchey-Dorsett tree names his parents as William Ball (1784–1826, born at Alexandria, Virginia, died in Hawkins County) and Nancy Tate (1788–1850), and their parents as Moses Ball and Mary Ann Hardin, and Edward Tate and Sarah McMullan. The tree cites only other member trees for this.");
});
edit('ball_graden', [MARR, C1850, C1860, C1870, C1880, C1900, TN_DEATH, KULP], p => {
  rename(p, ['Graden Ball'], 'Draden Catherine “Drady” Davis (Ball)');
  for (const a of ['Graden Ball', 'Dorden Ball', 'Drady C. Ball', 'Drary Davis', 'Dradie Catherine Davis']) add(p.aliases, a);
  if (!p.birth) p.birth = 'Jan 1816';
  if (!p.death) p.death = '12 Mar 1908';
  for (const l of ['Meigs County, Tennessee', 'McMinn County, Tennessee', 'Roane County, Tennessee', 'Athens, McMinn County, Tennessee']) add(p.locations, l);
  add(p.milestones, 'Married David Tate Ball (m. 21 Dec 1833, Roane County, Tennessee)');
  p.notes = p.notes.filter(t => !t.startsWith('Inferred mother of Ellen Rogers (Ball) McPhail: wife of David Ball in the 1860'));
  note(p, "CORRECTION 2026-09-24: Her name was Draden (Drady) Catherine, born Davis, not \"Graden\" (a misreading in the 1860 census index). She married David Ball as \"Drary Davis\" on 21 Dec 1833 in Roane County, Tennessee, and her son Thomas T. Ball's 1924 death certificate gives his mother's maiden name as Davis. She appears as Dorden (34) in 1850, Graden (46) in 1860, \"Grodon\" in 1870, Drady C. in 1880, and Drady Ball, born Jan 1816, in 1900, living in McMinn County with her children Nancy R. and George W. She is the source of the Draden/Dradie names among Ellen's descendants.");
  note(p, "The Kulp-Ritchey-Dorsett tree gives her birth as 18 Jan 1816 and her death as 12 Mar 1908 at Athens, McMinn County, aged 92.");
  note(p, "UNPROVEN: the Kulp-Ritchey-Dorsett tree names her parents as Samuel G. Davis (1778–1848, born in Virginia, died in McMinn or Meigs County) and Rebecca Rogers (\"Rebecca Ball Rogers\", 1785–1830). Ellen's middle name, Rogers, would come from this grandmother. The tree cites only other member trees; no will or probate for Samuel G. Davis has been found.");
});
edit('ball_ellen_rogers', [MARR, C1850, KULP], p => note(p, "Her mother was Draden (Drady) Catherine Davis, who married David Ball in Roane County on 21 Dec 1833. Her middle name, Rogers, would come from her maternal grandmother, whom the Kulp-Ritchey-Dorsett tree names as Rebecca Rogers (UNPROVEN)."));

// ── grandparents (UNPROVEN, from the tree) ───────────────────────────────────
const UNP = "UNPROVEN: known only from the Kulp-Ritchey-Dorsett Family Tree (Irma Kulp Zacher), which cites other member trees.";
person('ball_william_1784', 'William Ball', 'M', KULP, p => { p.birth = p.birth || '1784'; p.death = p.death || '1826'; for (const l of ['Alexandria, Virginia', 'Hawkins County, Tennessee']) add(p.locations, l); note(p, UNP + " Born 1784 at Alexandria, Virginia; died 1826 in Hawkins County, Tennessee; son of Moses Ball and Mary Ann Hardin. Father of David Tate Ball."); });
person('tate_nancy', 'Nancy Tate (Ball)', 'F', KULP, p => { p.birth = p.birth || '1788'; p.death = p.death || '1850'; add(p.locations, 'Hawkins County, Tennessee'); note(p, UNP + " Born 1788 and died 1850 in Hawkins County, Tennessee; daughter of Edward Tate and Sarah McMullan. Mother of David Tate Ball."); });
wed('ball_william_1784', 'tate_nancy');
child('ball_david', 'ball_william_1784', 'tate_nancy');
person('davis_samuel_g', 'Samuel G. Davis', 'M', KULP, p => { p.birth = p.birth || '1778'; p.death = p.death || '1848'; for (const l of ['Virginia', 'McMinn County, Tennessee']) add(p.locations, l); note(p, UNP + " Born 1778 in Virginia; died 1848 in McMinn (or Meigs) County, Tennessee. Father of Draden Catherine (Davis) Ball."); });
person('rogers_rebecca', 'Rebecca Rogers (Davis)', 'F', KULP, p => { p.birth = p.birth || '1785'; p.death = p.death || '1830'; add(p.aliases, 'Rebecca Ball Rogers'); for (const l of ['Virginia', 'McMinn County, Tennessee']) add(p.locations, l); note(p, UNP + " Named in the tree as \"Rebecca Ball Rogers\", born 1785 in Virginia, died 1830 in McMinn County. Mother of Draden Catherine (Davis) Ball; Ellen Rogers Ball's middle name would come from her."); });
wed('davis_samuel_g', 'rogers_rebecca');
child('ball_graden', 'davis_samuel_g', 'rogers_rebecca');

// ── Ellen's brothers and sisters ─────────────────────────────────────────────
const FAG_WH = "Find a Grave, memorial for William H. Ball (Rose Hill Cemetery, Wapanucka, Oklahoma)";
const FAG_SG = "Find a Grave, memorial for Samuel G. Ball (Bluff Springs Cemetery, Kingsville, Missouri)";
const SIBS = [
  ['ball_william_henry', 'William Henry Ball', 'M', '20 Oct 1834', '5 Dec 1906', [C1850, FAG_WH], "Born 20 Oct 1834 in Meigs County, Tennessee; aged 17 in 1850. Died 5 Dec 1906 at Wapanucka, Johnston County, Oklahoma, and buried at Rose Hill Cemetery there; his wife was Ann, and Find a Grave links sons Thomas Jefferson, Edward John, Landon Ceirn Haynes and John D. Ball."],
  ['ball_samuel_g', 'Samuel G. Ball', 'M', '11 Aug 1836', '2 Dec 1935', [C1850, FAG_SG], "Born 11 Aug 1836 at Decatur, Meigs County, Tennessee; aged 15 in 1850. Lived in Johnson County, Missouri (1910, 1930); died 2 Dec 1935 at Higginsville, Missouri, aged 99, and buried at Bluff Springs Cemetery, Kingsville. His wife was Rachel J.; a daughter was Martha E. Denney."],
  ['ball_sarah', 'Sarah Ball', 'F', 'abt 1837', '', [C1850, KULP], "Aged 13 in 1850. The Kulp-Ritchey-Dorsett tree calls her Sarah Jane and gives her death as 1880."],
  ['ball_nancy_rebecca', 'Nancy Rebecca Ball', 'F', 'Mar 1841', '', [C1850, C1860, C1870, C1880, C1900], "Born Mar 1841; aged 10 in 1850. Unmarried, she lived with her parents in 1860–1880 and with her mother and brother George in McMinn County in 1900. The tree gives her death as after 1910."],
  ['ball_thomas_t', 'Thomas T. Ball', 'M', '18 Nov 1842', '22 Aug 1924', [C1850, C1880, TN_DEATH], "Born 18 Nov 1842 in Tennessee; aged 8 in 1850; in District 7, Meigs County, in 1880 and McMinn County in 1910. Died 22 Aug 1924 in McMinn County, widowed, and buried at Mt. Zion. His death certificate (no. 195) names his parents as Ball and Davis. The tree calls him Thomas Terrell (or Tate) Ball."],
  ['ball_george_w', 'George W. Ball', 'M', 'Oct 1844', '1908', [C1850, C1860, C1900, "Ancestry.com, Tennessee, U.S., Wills and Probate Records, 1779-2008 (George W. Ball, 1908)"], "Born Oct 1844; aged 6 in 1850 and 15 in 1860. He lived with his mother and sister Nancy in McMinn County in 1900 and died in 1908 (Tennessee probate record); the tree gives 26 Mar 1908."],
  ['ball_mary_ann', 'Mary Ann Ball', 'F', 'abt 1846', '', [C1850, C1860, C1870], "Aged 4 in 1850 and in the household in 1860 and 1870 (Mary A.)."],
  ['ball_martha_e', 'Martha E. Ball', 'F', 'abt 1849', '', [C1850, KULP], "Aged 1 in 1850; not in the 1860 household. The tree gives her death as 1858."],
  ['ball_margaret', 'Margaret Ball', 'F', 'abt 1854', '', [C1860, C1870, KULP], "In the household in 1860 and 1870. The tree calls her Margaret S. Harriet Ball, born 1854 in Meigs County, died about 1905 in McMinn County."],
  ['ball_catharine', 'Catharine Ball', 'F', 'abt 1857', '', [C1860, C1870, KULP], "In the household in 1860 and 1870. The tree calls her Dradie Catherine Ball and gives her death as 7 May 1917 in Mobile County, Alabama. Lead: a Tennessee death record names a Drady Katherine Ball as the wife of Joseph L. Fox and mother of George Browder Fox."],
];
for (const [id, name, sex, b, d, src, text] of SIBS) {
  person(id, name, sex, src, p => { if (!p.birth) p.birth = b; if (d && !p.death) p.death = d; note(p, "Child of David Tate Ball and Draden (Davis) Ball; a brother or sister of Ellen Rogers (Ball) McPhail. ".replace('a brother or sister', sex === 'M' ? 'a brother' : 'a sister') + text); });
  child(id, 'ball_david', 'ball_graden');
}
const ALL = ['ball_ellen_rogers', ...SIBS.map(s => s[0])];
for (const id of ALL) edit(id, [], p => { for (const o of ALL) if (o !== id) add(p.relationships.siblings, o); });
console.log('Ball family applied');
