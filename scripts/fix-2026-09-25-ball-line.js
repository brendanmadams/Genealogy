#!/usr/bin/env node
/**
 * 2026-09-25, the Ball line above David Tate Ball, checked against records
 * after Ed Simons proposed a descent from George Washington's Balls.
 * Re-runnable.
 *  - William Ball of Hawkins County, husband of Nancy Tate, is in the 1830,
 *    1840, 1850 and 1870 censuses and died 27 Feb 1871; the tree's 1784–1826
 *    was wrong. David's link to him stays Inferred.
 *  - Above William: Moses Ball Jr. and Mary Ann Hardin (Inferred), Moses Ball
 *    Sr. and Ann Brashears, and John Ball of Stafford County (documented by
 *    John's 1722 will, via Bonnie Ball's 1961 genealogy).
 *  - Y-DNA shows this family is unrelated to the Lancaster County Balls of
 *    Mary Ball Washington, so no Washington link is recorded.
 */
'use strict';
const { exists, load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, ...(sex ? { sex } : {}), birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
function edit(id, src, fn) { const p = load(id); for (const k of ['milestones', 'notes', 'sources', 'aliases', 'locations', 'career']) p[k] = p[k] || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); }
const person = (id, name, sex, src, fn = () => {}) => { if (!exists(id)) save(blank(id, name, sex)); edit(id, src, fn); };
const child = (kid, father, mother) => {
  edit(kid, [], p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; });
  for (const par of [father, mother].filter(Boolean)) edit(par, [], p => add(p.relationships.children, kid));
};
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, [], p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };
const drop = (p, starts) => { p.notes = p.notes.filter(n => !starts.some(s => n.startsWith(s))); };

const C1830 = 'Ancestry.com, 1830 United States Federal Census (Hawkins County, Tennessee; William Ball)';
const C1840 = 'Ancestry.com, 1840 United States Federal Census (Hawkins County, Tennessee; William Ball)';
const C1850 = 'Ancestry.com, 1850 United States Federal Census (District 16, Hawkins County, Tennessee; Wm Ball, 75)';
const C1870 = 'Ancestry.com, 1870 United States Federal Census (District 16, Hawkins County, Tennessee, post office Van Hill; William Ball, 95, in the household of Harden Ball)';
const FAG_W = 'Find a Grave, memorial 101804658 (William Ball, 1775–1871, Ball Cemetery, Hawkins County)';
const FAG_M = 'Find a Grave, memorial 35458870 (Moses Ball Jr., 1748–1831, Ball Cemetery, Hawkins County)';
const FAG_JW = 'Find a Grave, memorial 89287998 (John Wesley Ball Sr., 1789–1862)';
const BB = 'Bonnie Ball, "The Balls of Fairfax and Stafford in Virginia" (1961)';
const WILL = 'Hawkins County, Tennessee, will abstracts (Moses Ball, will dated 13 Dec 1831)';
const ARL = 'Arlington Historical Society, review of Doris and George Ball, "The Ball Family of the Potomac 1654–2004" (2005)';
const DNA = 'Steven Perkins, "More bad genealogy on the Washington-Ball connection" (scpgen.blogspot.com, 2012), and the Ball surname Y-DNA project at FamilyTreeDNA';
const MV = 'Mount Vernon digital encyclopedia, "Ball Family"';
const TREE = 'Ancestry.com, public member tree "Kulp-Ritchey-Dorsett Family Tree" (tree 4662169)';

// ── William Ball of Hawkins County ──────────────────────────────────────────
edit('ball_william_1784', [C1830, C1840, C1850, C1870, FAG_W, BB, WILL], p => {
  p.birth = 'abt 1775';
  p.death = '27 Feb 1871';
  for (const l of ['Fairfax County, Virginia', 'District 16, Hawkins County, Tennessee', 'Van Hill, Hawkins County, Tennessee', 'Ball Cemetery, Hawkins County, Tennessee']) add(p.locations, l);
  drop(p, ['UNPROVEN: known only from the Kulp-Ritchey-Dorsett Family Tree']);
  note(p, 'CORRECTION: born about 1775 and died 27 Feb 1871, not 1784–1826. He is in the Hawkins County censuses of 1830 (aged 50–59), 1840 (60–69), 1850 (75, a farmer with real estate of $400, unable to read or write) and 1870 (95, retired, in the household of his son Harden at Van Hill), and Find a Grave records his death at Van Hill on 27 Feb 1871 and his burial in the Ball Cemetery. The 1850 census gives his birthplace as Maryland and the 1870 census Virginia; Bonnie Ball\'s 1961 genealogy says Fairfax County or Alexandria.');
  note(p, 'Married Nancy Tate about 1801 (Find a Grave; the Kulp-Ritchey-Dorsett tree), and later Patience. Children named by Find a Grave and the censuses include Tabitha (Smith, 1802), Mary, Sarah, the twins Nancy (Bailey) and Sabilla (Bradley, 1815), Harden (1818), Moses (1820), Rev. Lewis B. (1824), the twins Clinton C. and Milton E. (1826), George W. (1827) and William S.; Bonnie Ball also lists Edward Tate (about 1806), Nancy (about 1808) and a William Jr. who died in Roane County. Neither list includes David Tate Ball, so David\'s place as his son rests on the evidence on David\'s record.');
  note(p, 'Inferred: son of Moses Ball Jr. and Mary Ann Hardin. Moses\'s 1831 Hawkins County will names a "Wm", Bonnie Ball\'s genealogy lists William, husband of Nancy Tate, among Moses\'s children, William named sons Harden and Moses, and his brother John Wesley Ball Sr. (1789–1862) also came from Fairfax County to Hawkins County.');
});
edit('tate_nancy', [FAG_W, BB], p => note(p, 'Married William Ball about 1801; Find a Grave gives her death only as the 1840s, and Bonnie Ball\'s genealogy names her as his second wife, after a first wife surnamed Alim (or similar).'));
edit('ball_david', [C1830, FAG_W, BB], p => {
  drop(p, ['UNPROVEN: the Kulp-Ritchey-Dorsett tree names his parents as William Ball (1784–1826']);
  note(p, 'Inferred: son of William Ball (about 1775–1871) of Hawkins County and Nancy Tate. He was born in Hawkins County in 1813, his middle name matches Nancy Tate\'s maiden name (and passed to his grandson John Tate McPhail), and William\'s 1830 household held a boy of his age; but neither Find a Grave nor Bonnie Ball\'s 1961 genealogy lists him among William\'s children. His parents\' parents, Moses Ball and Mary Ann Hardin and Edward Tate and Sarah McMullan, come from the Kulp-Ritchey-Dorsett tree.');
  note(p, 'Rogersville, given by the tree as his place of death, is the seat of Hawkins County, not Roane County; he was living in District 8, Roane County, in 1880.');
});

// ── Moses Ball Jr. and Mary Ann Hardin ──────────────────────────────────────
person('ball_moses_jr', 'Moses Ball Jr.', 'M', [FAG_M, BB, WILL, FAG_JW], p => {
  if (!p.birth) p.birth = '20 Apr 1748';
  if (!p.death) p.death = '15 Dec 1831';
  for (const l of ['Beech Creek, Fairfax County, Virginia', 'Beech Creek, Hawkins County, Tennessee', 'Ball Cemetery, Hawkins County, Tennessee']) add(p.locations, l);
  note(p, 'Born 20 Apr 1748 in Fairfax County, Virginia, son of Moses Ball and Ann Brashears; married Mary Ann "Molly" Hardin about 1770. Last recorded in Fairfax in 1791, he bought 200 acres on Beech Creek, Hawkins County, Tennessee, from Samuel Curry in 1797. His will is dated 13 Dec 1831 and names his wife Molly and the executors Wesley and Thomas Ball; he died 15 Dec 1831 and was buried in the Ball Cemetery (Bonnie Ball\'s 1961 genealogy; the Hawkins County will abstracts; Find a Grave). His children included William, John Wesley (1789–1862), Thomas H., Bennett, Sarah (Long) and Sabilla (Long).');
});
person('hardin_mary_ann', 'Mary Ann "Molly" Hardin (Ball)', 'F', [FAG_M, BB, WILL], p => {
  if (!p.birth) p.birth = 'abt 1754';
  add(p.aliases, 'Molly Ball');
  add(p.locations, 'Hawkins County, Tennessee');
  note(p, 'Wife of Moses Ball Jr., married about 1770; named as Molly in his 1831 will. Find a Grave gives her birth as 1754 and her parents as William Hardin and Patty Green (unverified).');
});
wed('ball_moses_jr', 'hardin_mary_ann');
child('ball_william_1784', 'ball_moses_jr', 'hardin_mary_ann');

// ── Moses Ball Sr. and Ann Brashears ────────────────────────────────────────
person('ball_moses_sr', 'Moses Ball Sr.', 'M', [BB, ARL, MV], p => {
  if (!p.birth) p.birth = '1717';
  if (!p.death) p.death = '1792';
  add(p.locations, 'Fairfax County, Virginia');
  note(p, 'Of Fairfax County, Virginia, 1717–1792, son of John Ball of Stafford County, whose 1722 will names him. A neighbour of George Washington, who calls him "cousin" in his diaries, though Washington called anyone named Ball cousin; Moses\'s will provides for repaying £10 he owed Washington (Bonnie Ball\'s 1961 genealogy; the 2005 Arlington Historical Society review). Father of Moses Ball Jr.');
  note(p, 'Not related to George Washington\'s Ball family by blood: Y-DNA tests of descendants of John Ball of Stafford and of William Ball of Lancaster County (Mary Ball Washington\'s grandfather) show two unrelated families.');
});
person('brashears_ann', 'Ann "Nancy" Brashears (Ball)', 'F', [FAG_M, BB], p => {
  add(p.aliases, 'Ann Nancy Brashers');
  note(p, 'Wife of Moses Ball Sr. and mother of Moses Ball Jr., as Find a Grave and Bonnie Ball\'s genealogy give her; her surname is also spelled Brashers.');
});
wed('ball_moses_sr', 'brashears_ann');
child('ball_moses_jr', 'ball_moses_sr', 'brashears_ann');

// ── John Ball of Stafford County ────────────────────────────────────────────
person('ball_john_stafford', 'John Ball of Stafford County', 'M', [BB, ARL, DNA], p => {
  if (!p.death) p.death = '1722';
  add(p.locations, 'Stafford County, Virginia');
  note(p, 'Died 1722 in Stafford County, Virginia; his will names his wife Winifred and his sons James, John, Moses and George (Bonnie Ball\'s 1961 genealogy; the 2005 Arlington Historical Society review). The earliest proven ancestor of the Fairfax and Hawkins County Balls; his own parents are unknown. A James Ball brought to Westmoreland County in 1654 has been proposed as his father, unproven.');
  note(p, 'The claim that he was a son of Richard Ball (1645–1677), brother of Mary Ball Washington\'s father Col. Joseph Ball, has no record behind it, and Y-DNA testing places his descendants and the Lancaster County Balls in unrelated paternal lines (haplogroups R1b and I).');
});
person('winifred_ball', 'Winifred (Ball)', 'F', [BB, ARL], p => note(p, 'Wife of John Ball of Stafford County, named in his 1722 will.'));
wed('ball_john_stafford', 'winifred_ball');
child('ball_moses_sr', 'ball_john_stafford', 'winifred_ball');
console.log('Ball line applied');
