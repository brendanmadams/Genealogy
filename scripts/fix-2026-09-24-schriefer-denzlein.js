#!/usr/bin/env node
/**
 * 2026-09-24, the parents of Bartholomew Schriefer (1839–1914) and Margaret
 * Denzlein (1865–1924), both from the Catholic parish of Mistendorf, near
 * Bamberg, Bavaria. Re-runnable.
 *  - Checked in the Mistendorf baptism registers (Matricula Online):
 *    Bartholomäus, born 9 Sep 1839 at Zeegendorf, son of A. Margaretha
 *    Schrüfer, single, the father's name left blank; and Margaretha Denzlein,
 *    born 19 May 1865 at Mistendorf No. 48, daughter of Karl Denzlein and
 *    Margaretha Popp.
 *  - Checked too: the Baltimore passenger lists for 1874 (Bartholomäus, with
 *    his second wife Elisabetha and two children) and 1888 (Margaretha), the
 *    1900 census and Find a Grave.
 *  - Still UNPROVEN: Joseph Schlasberger as Bartholomew's father, and the
 *    other Bavarian dates, which come from Find a Grave biographies and the
 *    "Frank and Shugars Families" member tree (citing the parish registers).
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
// the first version of this script wrote notes before the registers were checked
const drop = (p, starts) => { p.notes = p.notes.filter(n => !starts.some(s => n.startsWith(s))); };
const OLD_UNP = 'UNPROVEN: from the Find a Grave biographies and the "Frank and Shugars Families" member tree, which cites the Mistendorf parish registers; not yet checked against the registers.';

const FAG_B = 'Find a Grave, memorial 65818037 (Bartholomew Schriefer, Most Holy Redeemer Cemetery, Baltimore)';
const FAG_M = 'Find a Grave, memorial 65818125 (Margaret Denzlein Schriefer, Most Holy Redeemer Cemetery, Baltimore)';
const P1874 = 'Ancestry.com, Baltimore, Maryland, U.S., Passenger Lists, 1820-1964 (ship Leipzig from Bremen, arrived 12 Sep 1874)';
const P1888 = 'Ancestry.com, Baltimore, Maryland, U.S., Passenger Lists, 1820-1964 (ship Maine from Bremen, arrived 30 May 1888)';
const TREE = 'Ancestry.com, public member tree "Frank and Shugars Families" (tree 113007221), citing the Mistendorf parish registers and Baltimore church and civil records';
const REG1839 = 'Matricula Online, Archdiocese of Bamberg, Mistendorf (Mariä Himmelfahrt), baptisms 1808–1851 (M5/28), 1839, page 62, entry 3';
const REG1865 = 'Matricula Online, Archdiocese of Bamberg, Mistendorf (Mariä Himmelfahrt), baptisms 1850–1888 (M6/37), 1865, page 59, entry 8';

// ── Bartholomew Schriefer ───────────────────────────────────────────────────
edit('schriefer_bartholomew', [FAG_B, P1874, TREE, REG1839], p => {
  if (!p.birth || p.birth === '1839') p.birth = '9 Sep 1839';
  if (!p.death || p.death === '1914') p.death = '8 Nov 1914';
  for (const a of ['Bartholomäus Schriefer', 'Bartholomäus Schrüfer', 'Joannes Bartholomaeus Schrüfer']) add(p.aliases, a);
  for (const l of ['Zeegendorf, Bamberg, Bavaria', 'Mistendorf, Bamberg, Bavaria', '2004 E. Oliver Street, Baltimore (1890)', '917 Stirling Street, Baltimore (1910)', 'Most Holy Redeemer Cemetery, Baltimore']) add(p.locations, l);
  for (const c of ['Bricklayer (Zeegendorf, 1862–1871).', 'Brewer in Baltimore (1875–1900); kept a saloon (1890); brewery watchman (1910).']) add(p.career, c);
  drop(p, ['Born 9 Sep 1839 at Zeegendorf, near Bamberg, Bavaria, and baptized "Joannes Bartholomaeus"']);
  note(p, 'Baptism register: Bartholomäus, born early on 9 Sep 1839 at Zeegendorf, near Bamberg, Bavaria, and baptized the same day by the parish priest, Schmitt, in the parish of Mistendorf; his mother was A. Margaretha Schrüfer, single and Catholic, and the column for the father\'s name is blank; godfather Bartholomäus Geiger, single (Mistendorf baptism register, 1839, page 62, no. 3). He died on 8 Nov 1914 in Baltimore, aged 75, and was buried at Most Holy Redeemer Cemetery with his third wife, Margaret (Find a Grave).');
  note(p, 'Arrived at Baltimore from Bremen on the Leipzig on 12 Sep 1874, as Bartholomäus Schriefer, 35, with Elisabetha (33), Kunigunde (9) and Pankratz (7) (Baltimore passenger lists).');
  note(p, 'Married three times (Find a Grave; the member tree): Margaretha Deinlein (1837–1871), at Mistendorf on 12 Oct 1862, mother of Kunigunde and Pankratz; Elisabetha Nüsslein (1841–1888), at Mistendorf on 3 Jun 1872, who came over with him in 1874 and was the mother of Mary (1883–1937); and Margaret Denzlein, on 8 Jan 1889 at St. James\' Catholic Church, Baltimore (the tree, citing the church and civil marriage records; the 1900 census gives 1888).');
});

// ── Margaret Denzlein ───────────────────────────────────────────────────────
edit('denzlein_margaret', [FAG_M, P1888, TREE, REG1865], p => {
  if (!p.birth || p.birth === '1865') p.birth = '19 May 1865';
  if (!p.death || p.death === '1924') p.death = '25 Oct 1924';
  for (const a of ['Margaretha Denzlein', 'Marga Denzlein']) add(p.aliases, a);
  for (const l of ['Mistendorf, Bamberg, Bavaria', '917 Stirling Street, Baltimore (1910–1924)', 'Most Holy Redeemer Cemetery, Baltimore']) add(p.locations, l);
  drop(p, ['Born 19 May 1865 at Mistendorf, near Bamberg, Bavaria, and baptized there on 21 May;']);
  note(p, 'Baptism register: Margaretha Denzlein, born 19 May 1865 at Mistendorf No. 48, near Bamberg, Bavaria, and baptized there on 21 May, daughter of Karl Denzlein and Margaretha Popp, both Catholic; godmother Margaretha Hofmann of Mistendorf (Mistendorf baptism register, 1865, page 59, no. 8). She died on 25 Oct 1924 at 917 Stirling Street, Baltimore, aged 59, and was buried at Most Holy Redeemer Cemetery (Find a Grave; the Frank and Shugars member tree).');
  note(p, 'Arrived at Baltimore from Bremen on the Maine on 30 May 1888, as Marga Denzlein, 23 (Baltimore passenger lists), and married Bartholomew Schriefer, a widower, on 8 Jan 1889 at St. James\' Catholic Church. Of their nine children, George (1891), John (1894), Maria Anna (1898) and Joseph (1903) died as infants; George S. (George Goode) was born on 1 Jun 1899.');
  note(p, 'Lead: a John Denzlein, born about 1864 in Germany, lived in Baltimore in 1910 with his wife Margarett M.; perhaps a relative.');
});

// ── Bartholomew's parents ───────────────────────────────────────────────────
person('schlasberger_joseph', 'Joseph Schlasberger', 'M', [FAG_B, TREE, REG1839], p => {
  add(p.aliases, 'Joseph Schalsberger');
  add(p.locations, 'Zeegendorf, Bamberg, Bavaria');
  drop(p, [`${OLD_UNP} Named as the father`]);
  note(p, 'UNPROVEN: named as the father of Bartholomew Schriefer (born 9 Sep 1839 at Zeegendorf) on Find a Grave (as Schlasberger) and in the Frank and Shugars member tree (as Schalsberger). The 1839 baptism entry leaves the father\'s name blank and gives the mother as single, so the name must come from a later record, perhaps Bartholomew\'s marriage in 1862. Bartholomew took his mother\'s surname.');
});
person('schruefer_margaretha', 'Margaretha Schrüfer', 'F', [FAG_B, TREE, REG1839], p => {
  for (const a of ['Margaretha Schriefer', 'A. Margaretha Schrüfer']) add(p.aliases, a);
  add(p.locations, 'Zeegendorf, Bamberg, Bavaria');
  drop(p, [`${OLD_UNP} Named as the mother`]);
  note(p, 'Mother of Bartholomäus (Bartholomew Schriefer), born 9 Sep 1839 at Zeegendorf in the parish of Mistendorf, near Bamberg: the baptism register names her A. Margaretha Schrüfer, single and Catholic, and leaves the father\'s name blank (Mistendorf baptism register, 1839, page 62, no. 3).');
});
child('schriefer_bartholomew', 'schlasberger_joseph', 'schruefer_margaretha');

// ── Margaret's parents ──────────────────────────────────────────────────────
person('denzlein_karl', 'Karl Denzlein', 'M', [FAG_M, TREE, REG1865], p => {
  if (!p.birth) p.birth = '1 Dec 1822';
  for (const l of ['Hochstall, Bamberg, Bavaria', 'Mistendorf, Bamberg, Bavaria']) add(p.locations, l);
  add(p.career, 'Farmer (1847).');
  drop(p, [`${OLD_UNP} Born 1 Dec 1822`]);
  note(p, 'Father of Margaret Denzlein, born 19 May 1865 at his house, Mistendorf No. 48; he and his wife Margaretha Popp were Catholic (Mistendorf baptism register, 1865, page 59, no. 8).');
  note(p, 'UNPROVEN, from the Frank and Shugars member tree (citing the parish registers): born 1 Dec 1822 at house no. 5, Hochstall, and baptized the next day at the Church of the Assumption (Mariä Himmelfahrt), Mistendorf; a farmer; married Margaretha Popp at Mistendorf on 8 Feb 1847; their children included Margaretha (1849), Georg (1850–1851), Georg (1853), Margaretha (1860), Barbara (1862) and Margaret (1865). Alive when his wife died in 1877.');
  note(p, 'UNPROVEN lead: the same tree names his parents as Johann Georg Denzlein (1796–1872) and Barbara Pfeufer (born 1794).');
});
person('popp_margaretha', 'Margaretha Popp (Denzlein)', 'F', [FAG_M, TREE, REG1865], p => {
  if (!p.birth) p.birth = '1821';
  if (!p.death) p.death = '15 Oct 1877';
  add(p.aliases, 'Margaret Denzlein');
  add(p.locations, 'Mistendorf, Bamberg, Bavaria');
  drop(p, [`${OLD_UNP} Born 1821;`]);
  note(p, 'Mother of Margaret Denzlein, born 19 May 1865 at Mistendorf No. 48 (Mistendorf baptism register, 1865, page 59, no. 8).');
  note(p, 'UNPROVEN, from the Frank and Shugars member tree: born 1821; married Karl Denzlein at Mistendorf on 8 Feb 1847; died there on 15 Oct 1877, when her daughter Margaret was 12.');
});
wed('denzlein_karl', 'popp_margaretha');
child('denzlein_margaret', 'denzlein_karl', 'popp_margaretha');
console.log('Schriefer and Denzlein parents applied');
