#!/usr/bin/env node
/**
 * 2026-09-25, James and Sarah (Mooney) Quinn of Fallston, parents of John
 * Bernard Quinn: proven from James's 1898 and Sarah's 1890 obituaries in the
 * Aegis, the Harford County censuses of 1860–1880, their gravestones at
 * St. John's, Hydes, and the Rasharkin parish register (Eliza, 1854). The
 * Quinn Family Tree's parents for both are examined and left UNPROVEN.
 * Re-runnable.
 */
'use strict';
const { exists, load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, sex, birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
const edit = (id, src, fn) => { const p = load(id); p.notes = p.notes || []; p.sources = p.sources || []; p.locations = p.locations || []; p.aliases = p.aliases || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); };
const person = (id, name, sex, src, fn) => { if (!exists(id)) save(blank(id, name, sex)); edit(id, src, fn); };
const refine = (p, k, v) => { if (!p[k] || /^(abt |about )?\d{4}$/i.test(String(p[k]).trim())) p[k] = v; };
const child = (kid, father, mother) => { edit(kid, [], p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; }); for (const par of [father, mother].filter(Boolean)) edit(par, [], p => add(p.relationships.children, kid)); };
const swapNote = (p, from, to) => { const i = p.notes.findIndex(n => n.startsWith(from)); if (i >= 0) p.notes[i] = to; else note(p, to); };

const OBIT98 = 'The Aegis and Intelligencer (Bel Air), 11 Mar 1898, death notice of James Quinn (clipping on Find a Grave memorial 22191168)';
const OBIT90 = 'The Aegis and Intelligencer (Bel Air), 27 Jun 1890, death notice of Mrs. James Quinn (clipping on Find a Grave memorial 22191176)';
const FAGJ = 'Find a Grave, memorial 22191168 (James Quinn, d. 6 Mar 1898, "75 Years Old, Native of County Antrim, Ireland", Saint John the Evangelist Cemetery, Hydes, Baltimore County)';
const FAGS = 'Find a Grave, memorial 22191176 (Sarah Quinn, "Age 64 Years, Native of County Antrim, Ireland", Saint John the Evangelist Cemetery, Hydes)';
const FAGA = 'Find a Grave, memorial 206242611 (Ann Jane Quinn Bradley, 1847–1912) and 22191188 (John Joseph Quinn, d. 15 Apr 1883, "25 Years, 2 months, 14 days")';
const C1860 = 'FamilySearch, United States Census, 1860 (3rd District, Bel Air, Harford County, Maryland; James Quinn, 36, born Ireland, in the household of Joseph Harlan; ark 1:1:M694-L1V)';
const C1870 = 'FamilySearch, United States Census, 1870 (District 3, Harford County, Maryland; James Quin, 45, with Barney, 17, and John, 12, born Ireland, in the household of Joseph Harlan; ark 1:1:MN3F-2C8)';
const C1880 = 'FamilySearch, United States Census, 1880 (Fallston, Harford County, Maryland; James Quin, 57, labourer on farm, with Sarah, 54, Joseph, 21, and Barney, 27; ark 1:1:MNQG-LPP)';
const REG = 'Ancestry.com, Ireland, Catholic Parish Registers, 1655-1915 (Rasharkin, diocese of Down and Connor, NLI microfilm 05476/04: baptism of Eliza Quinn, 20 Dec 1854, parents James Quinn and Sarah Mooney; and an unnamed child of — Quin and Sally Quin)';
const TREE = 'Ancestry.com, public member tree "Quinn Family Tree" (tree 11167102)';
const C1851 = 'FamilySearch, Ireland Census, 1851 (Rasharkin parish, County Antrim, surviving fragment: Thomas Mooney, 55, linen weaver, married 1822, with Mary, 46, Hugh, 19, Margaret, 15, and Mary, 12; ark 1:1:QV9Y-71CW)';
const NLI = 'National Library of Ireland, Catholic parish registers: Rasharkin (Down and Connor), baptisms from 16 Aug 1848; microfilm 05502 is Newry (Dromore)';

// ── James ───────────────────────────────────────────────────────────────────
edit('quin_james_mcgeer', [OBIT98, FAGJ, C1860, C1870, C1880, REG, TREE], p => {
  p.name = 'James Quinn';
  refine(p, 'birth', 'abt 1823'); refine(p, 'death', '6 Mar 1898');
  for (const l of ['Rasharkin, County Antrim, Ireland', 'Bel Air, Harford County, Maryland', 'Fallston, Harford County, Maryland', 'Saint John the Evangelist Cemetery, Hydes, Baltimore County, Maryland']) add(p.locations, l);
  for (const a of ['James Quin', 'James McGeer Quin']) add(p.aliases, a);
  swapNote(p, 'UNPROVEN: named as a parent of John Bernard Quinn',
    'Proven father of John Bernard Quinn. His death notice in the Aegis (11 Mar 1898) says he "died at the home of his son Mr. Bernard Quinn, on Sunday, of pneumonia, aged seventy-five years", survived by three children, Bernard Quinn, Mrs. Dennis A. Bradley and Mrs. Thomas Shannahan, and was buried at St. John\'s church, Long Green, Father Hauck officiating; the bearers were Richard and Dennis Shannahan, Frank Kearney, William Groves, John and Andrew Kelly. The 1870 and 1880 censuses have Barney (Bernard), born in Ireland about 1853, in his household. His gravestone at Hydes reads "75 Years Old, Native of County Antrim, Ireland".');
  swapNote(p, 'The tree gives his death as 6 Mar 1898',
    'Born about 1823 in County Antrim (aged 36 in 1860, 45 in 1870, 57 in 1880, 75 at death); the Quinn Family Tree gives Rasharkin, where his daughter Eliza was baptised in 1854. He came to Maryland ahead of his family: in 1860 he was a labourer, alone, in the household of Joseph Harlan near Bel Air, and in 1870 still with Harlan, in District 3, with his sons Barney, 17, and John, 12, newly arrived from Ireland; by 1880 he, Sarah and the boys were at Fallston. Children: Ann Jane (Bradley, about 1846–1912), John Bernard (1853–1913), Eliza (baptised Rasharkin 20 Dec 1854; probably the Elizabeth Jane, Mrs. Thomas Shannahan, 1857–1903, of the tree) and John Joseph (1858–1883).');
  note(p, 'UNPROVEN, and unlikely: the Quinn Family Tree makes him a son of a James Thomas Quinn Sr. (1793, Giant\'s Causeway – 1866) and Ann Ellen Stephenson of Belfast, and gives him the middle name McGeer from a supposed grandmother Mary McGeer. Its only records are other trees, a Belfast marriage of 1830 or 1836 (after James was born) and the civil death of a James Quinn at Gort, County Galway, in 1866, a different man a county away. His parents are not known.');
});

// ── Sarah ───────────────────────────────────────────────────────────────────
edit('mooney_sarah', [OBIT90, FAGS, C1880, REG, TREE, NLI, C1851], p => {
  p.name = 'Sarah Mooney (Quinn)';
  refine(p, 'birth', 'abt 1826');
  if (p.death === '23 Jun 1890') p.death = '23 Jun 1890';
  for (const l of ['County Antrim, Ireland', 'Fallston, Harford County, Maryland', 'Saint John the Evangelist Cemetery, Hydes, Baltimore County, Maryland']) add(p.locations, l);
  for (const a of ['Sarah Quinn', 'Sally Quin', 'Mrs. James Quinn']) add(p.aliases, a);
  swapNote(p, 'UNPROVEN: named as a parent of John Bernard Quinn',
    'Proven mother of John Bernard Quinn, and her maiden name is proven: the Rasharkin parish register records the baptism of Eliza Quinn on 20 Dec 1854, daughter of James Quinn and Sarah Mooney. Her death notice in the Aegis (27 Jun 1890) says Mrs. James Quinn died on Monday morning [23 Jun 1890] at the residence of Dennis A. Bradley near Fallston, having been taken with convulsions the Saturday before "while she was walking across the field on her way to the home of her son"; buried at St. John\'s, Long Green, on the Wednesday; she left one son, Bernard Quinn, and two daughters, Mrs. Thomas Shannahan and Mrs. Dennis A. Bradley, all of Fallston; "about 65 years of age", "an excellent nurse" who gave her services freely to women rich and poor "as a religious duty". Her stone reads "Age 64 Years, Native of County Antrim, Ireland"; the notice calls her a native of County Derry, across the Bann from Rasharkin.');
  swapNote(p, 'The tree gives her death as 23 Jun 1890',
    'Born about 1826 (54 in 1880; 64 at death). The Quinn Family Tree\'s birth date of 26 Nov 1826 comes from a baptism on NLI microfilm 05502, which is the Newry registers in County Down, not Rasharkin, so it belongs to another Sarah Mooney; Rasharkin\'s own registers begin in 1848. Find a Grave\'s death date of 29 Jun 1890 is wrong: the notice printed on 27 Jun says she died on the Monday, 23 Jun.');
  note(p, 'UNPROVEN: the Quinn Family Tree gives her parents as Thomas Mooney (born 1796) and Mary, of Magheraboy townland, Rasharkin, married 1822. A Thomas Mooney, 55, linen weaver, married 1822, does appear in the surviving 1851 census fragment for Rasharkin with Mary, 46, Hugh, 19, Margaret, 15, and Mary, 12, but Sarah, married by then, is not in it, and nothing else connects her to that household; Griffith\'s Valuation lists some fifty Mooney holdings in the parish. Her parents are not known.');
});

// ── siblings of Bernard ─────────────────────────────────────────────────────
person('quinn_ann_jane', 'Ann Jane Quinn (Bradley)', 'F', [FAGA, OBIT98, OBIT90, TREE], p => {
  refine(p, 'birth', 'abt 1846'); refine(p, 'death', '28 Jan 1912');
  for (const l of ['County Antrim, Ireland', 'Fallston, Harford County, Maryland', 'Saint John the Evangelist Cemetery, Hydes, Baltimore County, Maryland']) add(p.locations, l);
  note(p, 'Eldest child of James and Sarah (Mooney) Quinn, born in Ireland about 1846 (the tree says July 1846 at Craigs, County Antrim); married Dennis A. Bradley (1841–1911); her mother died at the Bradley house near Fallston in 1890; died 28 Jan 1912 at Fallston. Find a Grave lists nine children, Annie (Towne), Katherine (Livingston), Andrew, Daniel, Bernard, Elizabeth (Lancaster), Sara (Martin), Susan (Madara) and John Joseph Bradley.');
});
person('quinn_elizabeth_jane', 'Elizabeth Jane Quinn (Shannahan)', 'F', [OBIT98, OBIT90, REG, TREE], p => {
  refine(p, 'birth', '1854');
  refine(p, 'death', '1903');
  for (const l of ['Rasharkin, County Antrim, Ireland', 'Fallston, Harford County, Maryland']) add(p.locations, l);
  add(p.aliases, 'Eliza Quinn');
  note(p, 'Daughter of James and Sarah (Mooney) Quinn: probably the Eliza Quinn baptised at Rasharkin on 20 Dec 1854, and the "Mrs. Thomas Shannahan" of Fallston named as a surviving daughter in her mother\'s (1890) and father\'s (1898) death notices. The Quinn Family Tree calls her Elizabeth Jane, born Nov 1857, died 1903; the baptism suggests 1854.');
});
person('quinn_john_joseph_1858', 'John Joseph Quinn', 'M', [FAGA, C1870, C1880, TREE], p => {
  refine(p, 'birth', '1 Feb 1858'); refine(p, 'death', '15 Apr 1883');
  for (const l of ['County Antrim, Ireland', 'Fallston, Harford County, Maryland', 'Saint John the Evangelist Cemetery, Hydes, Baltimore County, Maryland']) add(p.locations, l);
  add(p.aliases, 'Joseph Quin');
  note(p, 'Son of James and Sarah (Mooney) Quinn, born in Ireland in 1858 (his stone gives his age at death as 25 years, 2 months, 14 days, so about 1 Feb 1858); John, 12, with his father and brother in 1870, and Joseph, 21, at Fallston in 1880; died 15 Apr 1883 and buried at Hydes, "Native of County Antrim, Ireland".');
});
for (const id of ['quinn_ann_jane', 'quinn_elizabeth_jane', 'quinn_john_joseph_1858']) child(id, 'quin_james_mcgeer', 'mooney_sarah');

// ── Bernard ─────────────────────────────────────────────────────────────────
edit('quinn_bernard', [OBIT98, OBIT90, C1870, C1880], p => {
  note(p, 'His parentage is proven by his parents\' death notices: his mother died in June 1890 on her way across the fields to his home, and his father died at his home in March 1898 (the Aegis). He reached Maryland by 1870, when he was Barney, 17, with his father and brother John in Joseph Harlan\'s household in District 3, and was at Fallston with his parents in 1880, aged 27.');
});
console.log('Quinn parents applied');
