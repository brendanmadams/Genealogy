#!/usr/bin/env node
/**
 * The extended research in Bill Allen's "Further Research on the Family and
 * Descendants of Joseph P. and Elizabeth (Hamilton) Adams" (Feb 2012), added
 * at Brendan Adams's request on 2026-09-23. Re-runnable.
 *
 *  - HAMILTON: Francis Hamilton's (#158) children and descendants, taken
 *    directly from the Hamilton family register in the document (lines
 *    9166-9715), because the automated readings merged people with the same
 *    name (two John A., two Francis, two Isaac Hamiltons).
 *  - OHIO: Alexander Washington Adams's, Harriet Adams Gill's and Magdalena
 *    Adams Swan's families, and Jose Pierre Adams's twin daughters, from the
 *    readings in data/imports/bill-allen-extended-2026-09-23.json.
 *  - MERGES: six people added in the previous batch who appear again here
 *    under fuller names.
 * Left out: in-laws' own parents and siblings, step-children, people named
 * only in passing (witnesses, boarders, clergy), and unnamed children.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { exists, load, save, note } = require('./lib/records');
const IMP = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'data', 'imports', 'bill-allen-extended-2026-09-23.json'), 'utf8'));
const SRC = 'Further Research on the Family and Descendants of Joseph P. and Elizabeth (Hamilton) Adams, William W. Allen (February 2012)';
const SRC_H = 'Hamilton family register (The Family of Francis Hamilton and Susan), in Bill Allen’s Further Research (February 2012)';
const add = (arr, v) => { if (v && !arr.includes(v)) { arr.push(v); return true; } return false; };
const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const yearOf = s => { const m = String(s || '').match(/\b(1[5-9]\d\d|20\d\d)\b/); return m ? +m[1] : null; };
const precision = s => { s = String(s || ''); if (/\b\d{1,2}\s+[A-Za-z]{3}/.test(s)) return 3; if (/[A-Za-z]{3,}\s+\d{4}/.test(s)) return 2; if (yearOf(s)) return 1; return 0; };
const mentions = (arr, v) => { const n = norm(v); return !!n && (arr || []).some(x => norm(x).includes(n)); };
const blank = (id, name) => ({ id, name, birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
const ensure = p => { for (const k of ['locations', 'milestones', 'notable_stories', 'career', 'education', 'notes', 'sources', 'aliases']) p[k] = p[k] || []; };

// ── Hamilton register ──────────────────────────────────────────────────────
// [id, name, { father, mother, birth, death, places, career, milestones, notes, aliases, spouses: [[id, date, place]] }]
const FR = 'hamilton_francis', SU = 'hamilton_susan';
const H = [
  ['hamilton_alexander_uncle', 'Alexander Hamilton', { father: 'hamilton_john_of_kype', mother: 'young_jacobina', places: ['Prince George’s County, MD', 'Piscataway, MD'],
    notes: ['Brother of Francis Hamilton (#158); register number 316.1. Fled from Prince George’s County to his brother’s place at Keeptrist in 1777. His letters and will name Francis’s children; his nephew John Alexander ("Jacky") lived with him at Piscataway in 1784.'] }],
  // children of Francis Hamilton (#158)
  ['hamilton_john_alexander', 'John Alexander Hamilton', { father: FR, mother: SU, birth: 'between 1776 and 1784', death: 'bef 1820', places: ['Jefferson County, VA', 'Frederick County, MD'],
    spouses: [['philpott_eleanor', '22 Jun 1795', 'Frederick County, MD']], aliases: ['Jacky Hamilton'],
    notes: ['Register number 158.1. In 1808 he bought 46 acres of the family estate from his sister Jacobina. Received slaves, silver and a share of land-sale proceeds from his uncle Alexander in 1790.'] }],
  ['philpott_eleanor', 'Eleanor Philpott (Hamilton)', { death: 'aft 1850', places: ['Frederick County, MD', 'Jefferson County, VA', 'Greenville, Darke County, OH'], aliases: ['Nelly Hamilton'],
    notes: ['Daughter of Barton and Martha (Musgrove) Philpott of Frederick County, Maryland. In 1850 she was living in Greenville, Ohio, with her daughter Eliza C. Jarboe and grandchildren.'] }],
  ['hamilton_gavin_d1814', 'Gavin Hamilton', { father: FR, mother: SU, death: 'Jan 1814', places: ['Prince George’s County, MD'], aliases: ['Gawin Hamilton'],
    spouses: [['douglas_elizabeth', '20 Jul 1800', 'Prince George’s County, MD']],
    notes: ['Register number 158.2. Died between 5 and 19 January 1814 in Prince George’s County, Maryland; his will left the remainder of his estate to his son Francis Alexander Hamilton.'] }],
  ['douglas_elizabeth', 'Elizabeth Douglas (Hamilton)', {}],
  ['hamilton_francis_alexander', 'Francis Alexander Hamilton', { father: 'hamilton_gavin_d1814', mother: 'douglas_elizabeth', birth: 'abt 1802', death: 'May 1830', places: ['Petersville, Frederick County, MD'],
    notes: ['Register number 158.2a. Died between 3 and 17 May 1830 at Petersville, Maryland, aged 28. His will, written 3 May 1830, names Francis Hamilton’s children and grandchildren and made Jose P. Adams (his aunt Elizabeth’s husband) executor.'] }],
  ['hamilton_francis_jr', 'Francis Hamilton Jr.', { father: FR, mother: SU, death: '1821', places: ['Virginia'], spouses: [['hamilton_catherine', null, null]], notes: ['Register number 158.4.'] }],
  ['hamilton_catherine', 'Catherine Hamilton', { notes: ['Wife of Francis Hamilton Jr.; maiden name not recorded.'] }],
  ['hamilton_henry_a', 'Henry A. Hamilton', { father: 'hamilton_francis_jr', mother: 'hamilton_catherine' }],
  ['hamilton_mary_b', 'Mary B. Hamilton (Martin)', { father: 'hamilton_francis_jr', mother: 'hamilton_catherine', spouses: [['martin_daniel', 'aft 1830', null]] }],
  ['martin_daniel', 'Daniel Martin', {}],
  ['hamilton_jacobina', 'Jacobina Hamilton (Baker)', { father: FR, mother: SU, spouses: [['baker_walter', '2 Apr 1817', 'Frederick County, MD']],
    notes: ['Register number 158.5. Second wife of Walter Baker, her late sister Magdalena’s husband; no children.'] }],
  ['hamilton_magdalena', 'Magdalena Hamilton (Baker)', { father: FR, mother: SU, aliases: ['Margaret Hamilton'], spouses: [['baker_walter', null, null]], notes: ['Register number 158.7. First wife of Walter Baker.'] }],
  ['baker_walter', 'Walter Baker', { notes: ['Married Magdalena Hamilton and, after her, her sister Jacobina Hamilton (1817).'] }],
  ['baker_washington', 'Washington Baker', { father: 'baker_walter', mother: 'hamilton_magdalena' }],
  // John Alexander and Eleanor
  ['hamilton_francis_l', 'Francis L. Hamilton', { father: 'hamilton_john_alexander', mother: 'philpott_eleanor', birth: 'abt 1795', places: ['Virginia', 'Greenville, Darke County, OH'],
    spouses: [['deane_elizabeth_phebe', '6 Sep 1829', 'Darke County, OH']],
    career: ['Kept a tavern at his home in Greenville, Ohio, licensed 1830 to 1837', 'Retired farmer in Greenville by 1850'],
    notes: ['Register number 158.1a. In 1848 he became guardian of the nine minor children of his late brother-in-law Rudolph Ryan.'] }],
  ['deane_elizabeth_phebe', 'Elizabeth Phebe Deane (Clary, Hamilton)', { birth: 'abt 1808', places: ['Ohio', 'Greenville, Darke County, OH'], aliases: ['Phebe Hamilton'],
    notes: ['First married Isaac Clary (13 May 1824, Darke County), with two children, Patience and Eliza Ann Clary; a court case of 1830 names her first husband as Vachel Clary. A widow in Greenville in 1880.'] }],
  ['hamilton_eliza_c', 'Eliza C. Hamilton (Jarboe)', { father: 'hamilton_john_alexander', mother: 'philpott_eleanor', birth: 'abt 1804', places: ['Virginia', 'Greenville, Darke County, OH'],
    spouses: [['jarboe_james', '23 Mar 1825', 'Frederick County, MD']], notes: ['Register number 158.1b.'] }],
  ['jarboe_james', 'James Jarboe', {}],
  ['jarboe_charles', 'Charles Jarboe', { father: 'jarboe_james', mother: 'hamilton_eliza_c', birth: 'abt 1830', places: ['Maryland', 'Darke County, OH'], career: ['Teamster (1860)'] }],
  ['jarboe_margaret_a', 'Margaret A. Jarboe', { father: 'jarboe_james', mother: 'hamilton_eliza_c', birth: 'abt 1833', places: ['Maryland'] }],
  ['hamilton_john_1c', 'John Hamilton', { father: 'hamilton_john_alexander', mother: 'philpott_eleanor', notes: ['Register number 158.1c; the register refers to an unidentified file for him.'] }],
  ['hamilton_thomas_w', 'Thomas W. Hamilton', { father: 'hamilton_john_alexander', mother: 'philpott_eleanor', birth: 'abt 1812', places: ['Virginia', 'Greenville Township, Darke County, OH'],
    spouses: [['meeks_mary_ann', null, null]], notes: ['Register number 158.1d. Mary Ann Meeks was too young to be the mother of his first child, so he may have married earlier.'] }],
  ['meeks_mary_ann', 'Mary Ann Meeks (Hamilton)', { birth: '1825', places: ['Virginia'] }],
  ['hamilton_george_w', 'George W. Hamilton', { father: 'hamilton_john_alexander', mother: 'philpott_eleanor', birth: 'abt 1814', places: ['Virginia', 'Greenville, Darke County, OH'],
    spouses: [['hamilton_ann', null, null]], career: ['Livery business in Greenville (1850)', 'Butcher (1860)', 'Constable in Greenville (1870)'], notes: ['Register number 158.1e.'] }],
  ['hamilton_ann', 'Ann Hamilton', { birth: 'abt 1813', places: ['Ohio'], notes: ['Wife of George W. Hamilton; maiden name not recorded.'] }],
  ['hamilton_eleanor', 'Eleanor Hamilton (Ryan)', { father: 'hamilton_john_alexander', mother: 'philpott_eleanor', birth: 'abt 1810', death: 'May 1886', places: ['Ohio'],
    spouses: [['ryan_rudolph', null, null]], notes: ['Register number 158.1f; born 1810 or 1811.'] }],
  ['ryan_rudolph', 'Rudolph Ryan', { death: 'bef Apr 1848', notes: ['Died before 12 April 1848, when Francis L. Hamilton became guardian of his nine minor children.'] }],
  // Francis L. and Elizabeth Phebe
  ['hamilton_john_a_1830', 'John A. Hamilton', { father: 'hamilton_francis_l', mother: 'deane_elizabeth_phebe', birth: 'abt 1830', places: ['Greenville, Darke County, OH'],
    spouses: [['irwin_emeline', '18 Oct 1855', 'Darke County, OH']], career: ['Farmer (1860)', 'City marshal of Greenville (1870)', 'Clerk (1880)'], notes: ['Register number 158.1a1. Not the John A. Hamilton born about 1836, son of Thomas W.'] }],
  ['irwin_emeline', 'Emeline Irwin (Hamilton)', { birth: 'abt 1833', places: ['Ohio'] }],
  ['hamilton_caroline_1833', 'Caroline Hamilton', { father: 'hamilton_francis_l', mother: 'deane_elizabeth_phebe', birth: 'abt 1833', places: ['Ohio'] }],
  ['hamilton_gavin_washington', 'Gavin Washington Hamilton', { father: 'hamilton_francis_l', mother: 'deane_elizabeth_phebe', birth: 'abt 1835', places: ['Ohio'] }],
  ['hamilton_francis_1839', 'Francis Hamilton', { father: 'hamilton_francis_l', mother: 'deane_elizabeth_phebe', birth: 'abt 1839', places: ['Ohio'], notes: ['Register number 158.1a4; living at home in 1870.'] }],
  ['hamilton_james_1844', 'James Hamilton', { father: 'hamilton_francis_l', mother: 'deane_elizabeth_phebe', birth: 'abt 1844', places: ['Ohio'] }],
  ['hamilton_sarah_1846', 'Sarah Hamilton', { father: 'hamilton_francis_l', mother: 'deane_elizabeth_phebe', birth: 'abt 1846', places: ['Ohio'], notes: ['Living at home in 1870.'] }],
  ['hamilton_daniel_1849', 'Daniel Hamilton', { father: 'hamilton_francis_l', mother: 'deane_elizabeth_phebe', birth: 'abt 1849', places: ['Darke County, OH'],
    spouses: [['wilcox_ellen', '3 Jul 1879', 'Darke County, OH']], career: ['Lightning rod salesman'] }],
  ['wilcox_ellen', 'Ellen Wilcox (Hamilton)', { birth: 'abt 1851', places: ['Ohio'], aliases: ['Ella Wilcox'] }],
  ['hamilton_isaac_1850', 'Isaac Hamilton', { father: 'hamilton_francis_l', mother: 'deane_elizabeth_phebe', birth: 'abt 1850', places: ['Ohio'], notes: ['Register number 158.1a8. Not the Isaac Hamilton (1867-1946), son of Samuel F.'] }],
  // John A. (1830) and Emeline
  ...[['hamilton_phebe_1856', 'Phebe Hamilton', 'abt 1856'], ['hamilton_edward_1858', 'Edward Hamilton', 'abt 1858', 'Printer (1880)'], ['hamilton_francis_1859', 'Francis Hamilton', 'abt 1859', 'Brickmason (1880)'],
      ['hamilton_kate_1861', 'Kate Hamilton', 'abt 1861'], ['hamilton_sophia_1868', 'Sophia Hamilton', 'abt 1868']]
    .map(([id, name, birth, job]) => [id, name, { father: 'hamilton_john_a_1830', mother: 'irwin_emeline', birth, places: ['Ohio'], career: job ? [job] : [] }]),
  ['hamilton_emma_1867', 'Emma Hamilton', { father: 'hamilton_john_a_1830', mother: 'irwin_emeline', birth: '1 Aug 1867', death: '5 Jul 1919', places: ['Greenville, OH'], milestones: ['Buried in Greenville Cemetery'] }],
  ['hamilton_anna_b', 'Anna B. Hamilton (Ballard)', { father: 'hamilton_john_a_1830', mother: 'irwin_emeline', birth: 'abt 1863', places: ['Ohio'], spouses: [['ballard_william_a', '7 Jun 1888', 'Darke County, OH']], notes: ['Married second a man surnamed Hunt.'] }],
  ['ballard_william_a', 'William A. Ballard', {}],
  // Thomas W. and Mary Ann
  ['hamilton_john_a_1836', 'John A. Hamilton', { father: 'hamilton_thomas_w', birth: 'abt 1836', places: ['Ohio'], notes: ['Register number 158.1d1; probably from Thomas W.’s first marriage. Not the John A. Hamilton born about 1830.'] }],
  ['hamilton_alice_g', 'Alice G. Hamilton (House)', { father: 'hamilton_thomas_w', mother: 'meeks_mary_ann', birth: 'abt 1841', places: ['Greenville, Darke County, OH'], spouses: [['house_harry', '10 Oct 1857', 'Darke County, OH']] }],
  ['house_harry', 'Harry House', { career: ['Carpenter in Greenville (1870, 1880)'] }],
  ['house_adelia', 'Adelia House', { father: 'house_harry', mother: 'hamilton_alice_g', birth: 'abt 1859', places: ['Ohio'] }],
  ['house_ida', 'Ida House', { father: 'house_harry', mother: 'hamilton_alice_g', birth: 'abt 1861', places: ['Ohio'] }],
  ['hamilton_nancy_jane', 'Nancy Jane Hamilton (Mann)', { father: 'hamilton_thomas_w', mother: 'meeks_mary_ann', birth: 'abt 1841', places: ['Greenville, Darke County, OH'], spouses: [['mann_james_m', '19 Jun 1861', 'Darke County, OH']], notes: ['Two further children are listed only as unknown.'] }],
  ['mann_james_m', 'James M. Mann', { birth: 'Dec 1839', places: ['Indiana', 'Greenville, Darke County, OH'], career: ['Engineer'] }],
  ['mann_margaret', 'Margaret Mann', { father: 'mann_james_m', mother: 'hamilton_nancy_jane', birth: 'abt 1864', places: ['Ohio'], aliases: ['Maggie Mann'] }],
  ['mann_rolla_w', 'Rolla W. Mann', { father: 'mann_james_m', mother: 'hamilton_nancy_jane', birth: 'Jun 1875', places: ['Greenville, Darke County, OH'], aliases: ['Roll Mann'], career: ['Darke County treasurer (1920)'], spouses: [['mann_f_iona', null, null]] }],
  ['mann_f_iona', 'F. Iona Mann', { birth: 'abt 1887', notes: ['Wife of Rolla W. Mann; maiden name not recorded.'] }],
  ['mann_james_h', 'James H. Mann', { father: 'mann_rolla_w', mother: 'mann_f_iona', birth: 'abt 1914', places: ['Ohio'] }],
  ['hamilton_phebe_ann', 'Phebe Ann Hamilton (Sparks)', { father: 'hamilton_thomas_w', mother: 'meeks_mary_ann', birth: '1843', death: '1932', places: ['Darke County, OH'], milestones: ['Buried at Abbottsville Cemetery, Darke County, Ohio'], spouses: [['sparks_william_h_h', '28 Jul 1865', 'Darke County, OH']] }],
  ['sparks_william_h_h', 'William H. H. Sparks', { birth: '1840', places: ['Ohio', 'German Township, Darke County, OH'], career: ['Farmer in German Township (1870, 1880)'], milestones: ['Buried at Abbottsville Cemetery, Darke County, Ohio'] }],
  ...[['sparks_rosella', 'Rosella Sparks', 'abt 1868'], ['sparks_thomas_h', 'Thomas H. Sparks', 'abt 1869'], ['sparks_margaret_caroline', 'Margaret Caroline Sparks', 'abt 1870'], ['sparks_walter', 'Walter Sparks', 'abt 1872'],
      ['sparks_john_d', 'John D. Sparks', 'abt 1875'], ['sparks_rutherford', 'Rutherford Sparks', 'abt 1876'], ['sparks_unes', 'Unes Sparks', 'abt 1879']]
    .map(([id, name, birth]) => [id, name, { father: 'sparks_william_h_h', mother: 'hamilton_phebe_ann', birth, places: ['Ohio'] }]),
  ['hamilton_caroline_1845', 'Caroline Hamilton (Harter)', { father: 'hamilton_thomas_w', mother: 'meeks_mary_ann', birth: 'abt 1845', places: ['Ohio'], spouses: [['harter_eli', '5 Apr 1865', 'Darke County, OH']] }],
  ['harter_eli', 'Eli Harter', {}],
  ['hamilton_mary_a', 'Mary A. Hamilton (Bascom)', { father: 'hamilton_thomas_w', mother: 'meeks_mary_ann', birth: 'Apr 1851', places: ['Greenville, Darke County, OH'], spouses: [['bascom_john_l', '5 Dec 1869', 'Darke County, OH']] }],
  ['bascom_john_l', 'John L. Bascom', { birth: '25 Dec 1841', death: 'bef 1920', places: ['Greenville, Darke County, OH'], career: ['Policeman, Department of Public Safety, Greenville (1900)'], notes: ['Son of John Sanford and Susannah (Spencer) Bascom.'] }],
  ['hamilton_lona_belle', 'Lona Belle Hamilton (McCoy)', { father: 'bascom_john_l', mother: 'hamilton_mary_a', birth: 'Jun 1869', places: ['Ohio'], spouses: [['mccoy_ulysses_g', '5 Oct 1902', 'Darke County, OH']], notes: ['Recorded under the surname Hamilton; widowed by 1910 and living with her mother.'] }],
  ['mccoy_ulysses_g', 'Ulysses G. McCoy', { death: 'bef 1910', notes: ['Son of John P. and Sarah J. (Hulse) McCoy.'] }],
  ['bascom_susannah', 'Susannah Bascom (Foltz)', { father: 'bascom_john_l', mother: 'hamilton_mary_a', birth: 'Jul 1871', places: ['Ohio', 'Dayton, OH'], spouses: [['foltz_george_t', '1896', null]] }],
  ['foltz_george_t', 'George T. Foltz', { birth: 'Jan 1870', places: ['Dayton, Montgomery County, OH', 'Troy, OH'], career: ['Assistant superintendent at an insurance company (1900)', 'Traveling salesman (1910, 1920)'] }],
  ['hamilton_eunice', 'Eunice Hamilton (Stoltz)', { father: 'hamilton_thomas_w', mother: 'meeks_mary_ann', birth: '1867', places: ['Greenville, Darke County, OH'], spouses: [['stoltz_james_l', '7 Jul 1881', 'Darke County, OH']], career: ['Mender in a cutting mill, Greenville (as a widow)'] }],
  ['stoltz_james_l', 'James L. Stoltz', {}],
  // George W. and Ann
  ['hamilton_gavin_1840', 'Gavin Hamilton', { father: 'hamilton_george_w', mother: 'hamilton_ann', birth: 'abt 1840', places: ['Ohio'] }],
  ['hamilton_francis_a_1843', 'Francis A. Hamilton', { father: 'hamilton_george_w', mother: 'hamilton_ann', birth: 'abt 1843', places: ['Ohio'], aliases: ['Frank Hamilton'] }],
  ['hamilton_samuel_f', 'Samuel F. Hamilton', { father: 'hamilton_george_w', mother: 'hamilton_ann', birth: '1846', death: '1927', places: ['Darke County, OH'], career: ['Farmer in Darke County (1870, 1880)'],
    milestones: ['Buried in Otterbein Cemetery, Darke County, Ohio'], spouses: [['rieker_mary_elizabeth', '28 Dec 1865', 'Darke County, OH']] }],
  ['rieker_mary_elizabeth', 'Mary Elizabeth Rieker (Hamilton)', { birth: '1846', places: ['Ohio'], milestones: ['Buried in Otterbein Cemetery, Darke County, Ohio'], notes: ['Her death year is misprinted in the register ("1827").'] }],
  ['hamilton_isaac_1867', 'Isaac Hamilton', { father: 'hamilton_samuel_f', mother: 'rieker_mary_elizabeth', birth: '1867', death: '1946', notes: ['May be the Isaac buried in St. John’s Cemetery, Darke County.'] }],
  ['hamilton_evaline', 'Evaline Hamilton', { father: 'hamilton_samuel_f', mother: 'rieker_mary_elizabeth', birth: 'abt 1876', death: '1879', milestones: ['Buried in Otterbein Cemetery, Darke County, Ohio'] }],
  ['hamilton_louisa_1879', 'Louisa Hamilton', { father: 'hamilton_samuel_f', mother: 'rieker_mary_elizabeth', birth: 'abt 1879' }],
  ['hamilton_amanda_1880', 'Amanda Hamilton', { father: 'hamilton_samuel_f', mother: 'rieker_mary_elizabeth', birth: 'abt 1880' }],
  ['hamilton_sarah_e', 'Sarah E. Hamilton', { father: 'hamilton_george_w', mother: 'hamilton_ann', birth: 'abt 1849', places: ['Ohio'] }],
];
// Rudolph and Eleanor Ryan's nine children, from the 12 Apr 1848 guardianship (ages then)
for (const [id, name, age] of [['ryan_mary_e', 'Mary E. Ryan', 13], ['ryan_john', 'John Ryan', 11], ['ryan_emily_a', 'Emily A. Ryan', 10], ['ryan_george_w', 'George W. Ryan', 8], ['ryan_francis_l', 'Francis L. Ryan', 8],
  ['ryan_eliza_jane', 'Eliza Jane Ryan', 6], ['ryan_daniel_h', 'Daniel H. Ryan', 4], ['ryan_william', 'William Ryan', 2], ['ryan_elizabeth_p', 'Elizabeth P. Ryan', 1]]) {
  H.push([id, name, { father: 'ryan_rudolph', mother: 'hamilton_eleanor', birth: `abt ${1848 - age}`, notes: [`Aged ${age} on 12 April 1848, when her or his uncle Francis L. Hamilton became guardian of Rudolph Ryan’s children.`.replace('her or his', /Mary|Emily|Eliza|Elizabeth/.test(name) ? 'her' : 'his')] }]);
}

// ── Ohio Adams, Gill and Swan families (facts from the readings) ───────────
const O = [
  ['adams_susan_twin', 'Susan Adams', { father: 'adams_jose_pierre', mother: 'hamilton_elizabeth_eliza', notes: ['Twin of Ursula; alive in 1830, and probably died before the 1840 census.'] }],
  ['adams_ursula_twin', 'Ursula Adams', { father: 'adams_jose_pierre', mother: 'hamilton_elizabeth_eliza', notes: ['Twin of Susan; alive in 1830, and probably died before the 1840 census.'] }],
  ['adams_george_w_1857', 'George W. Adams', { father: 'adams_alexander_washington', mother: 'konitzer_christiana', spouses: [['davis_carrie_a', 'Nov 1880', 'Newark, Licking County, OH'], ['drumm_jennie_s', 'Apr 1906', 'Licking County, OH']] }],
  ['davis_carrie_a', 'Carrie A. Davis (Adams)', { aliases: ['Jennie S. Davis'], notes: ['First wife of George W. Adams. The marriage record reads Jennie S. Davis and the license image Carrie A. Davis, so her first name is uncertain.'] }],
  ['drumm_jennie_s', 'Jennie S. Drumm (Parr, Adams)', { aliases: ['Jennie Parr'], notes: ['Second wife of George W. Adams; previously Mrs. Parr.'] }],
  ['adams_harriet_ray', 'Harriet Ray Adams', { father: 'adams_george_w_1857', mother: 'davis_carrie_a' }],
  ['adams_ralph_stanley', 'Ralph Stanley Adams', { father: 'adams_george_w_1857', mother: 'davis_carrie_a', aliases: ['Ralph S. Adams'], spouses: [['irwin_zona', null, null]] }],
  ['irwin_zona', 'Zona Irwin (Adams)', { notes: ['Wife of Ralph Stanley Adams; they had no children.'] }],
  ['adams_ethel_jane', 'Ethel Jane Adams', { father: 'adams_george_w_1857', mother: 'davis_carrie_a' }],
  ['adams_george_edgar', 'George Edgar Adams', { father: 'adams_george_w_1857', mother: 'davis_carrie_a' }],
  ['adams_alice_christiana', 'Alice Christiana Adams (Wright)', { father: 'adams_george_w_1857', mother: 'davis_carrie_a', spouses: [['wright_ralph_w', null, null]] }],
  ['wright_ralph_w', 'Ralph W. Wright', {}],
  ['wright_harriet_jean', 'Harriet Jean Wright', { father: 'wright_ralph_w', mother: 'adams_alice_christiana' }],
  ['adams_mary_rebecca', 'Mary Rebecca Adams', { father: 'adams_alexander_washington', mother: 'konitzer_christiana', aliases: ['Mary R. Adams'] }],
  ['adams_evarilda', 'Evarilda Adams', { father: 'adams_alexander_washington', mother: 'konitzer_christiana' }],
  ['adams_helen_n', 'Helen N. Adams', { father: 'adams_alexander_washington', mother: 'konitzer_christiana' }],
  ['gill_stephen_milton', 'Stephen Milton Gill', { father: 'gill_stephen_augusta', mother: 'adams_harriet_josephine', aliases: ['Milton S. Gill', 'S. Milton Gill'] }],
  ['gill_mary_frances', 'Mary Frances Gill', { father: 'gill_stephen_augusta', mother: 'adams_harriet_josephine', aliases: ['Mary Gill'] }],
  ['swan_horatio_m', 'Horatio M. Swan', { father: 'swan_lewis', notes: ['Bill Allen believed he was Lewis Swan’s child by an earlier marriage.'] }],
  ['swan_melissa', 'Melissa Swan', { father: 'swan_lewis', notes: ['Bill Allen believed she was Lewis Swan’s child by an earlier marriage.'] }],
  ['swan_mary_elizabeth', 'Mary Elizabeth Swan', { father: 'swan_lewis', mother: 'adams_magdalena', notes: ['Bill Allen believed she was Magdalena’s daughter, born after the 1840 census. The 1870 census suggests she married a man named Hanel or Hazle (hard to read).'] }],
];
// earlier-batch people who reappear here under fuller names
const MERGES = [['adams_charles_w', null], ['adams_myrtle_anna', null], ['adams_william_w_1885', 'William Wallace Adams'], ['adams_mary_1845', null], ['adams_nancy_e', 'Nancy Elizabeth Adams'], ['adams_virginia_m', null]];

// ── apply ──────────────────────────────────────────────────────────────────
let created = 0;
function upsert(id, name, x, src) {
  const isNew = !exists(id); const p = isNew ? blank(id, name) : load(id); ensure(p);
  if (isNew) created++;
  p.name = name;
  if (x.birth && (!p.birth || precision(x.birth) > precision(p.birth))) p.birth = x.birth;
  if (x.death && (!p.death || precision(x.death) > precision(p.death))) p.death = x.death;
  for (const k of ['places', 'career', 'milestones', 'aliases']) for (const v of x[k] || []) add(p[k === 'places' ? 'locations' : k], v);
  for (const n of x.notes || []) note(p, n);
  add(p.sources, src);
  save(p);
  return p;
}
function applyFacts(id, src) {
  const p = load(id); ensure(p);
  for (const f of (IMP.people[id] || {}).facts || []) {
    const where = String(f.place || '').trim();
    if (f.kind === 'birth' || f.kind === 'death') {
      if (f.date && (!p[f.kind] || precision(f.date) > precision(p[f.kind]))) {
        if (p[f.kind] && yearOf(p[f.kind]) && yearOf(p[f.kind]) !== yearOf(f.date)) { note(p, `Bill Allen’s Further Research gives ${f.kind} ${f.date}; this record keeps ${p[f.kind]}. [line ${f.lines.join(', ')}]`); }
        else p[f.kind] = f.date;
      }
      add(p.locations, where);
      if (f.date || where) { const ms = `${f.kind === 'birth' ? 'Born' : 'Died'} ${[f.date, where].filter(Boolean).join(', ')}`; if (!mentions(p.milestones, ms)) add(p.milestones, ms); }
    } else if (['parent', 'child', 'spouse', 'marriage'].includes(f.kind)) {
      // relationships come from the lists above
    } else if (['burial', 'military', 'religion', 'divorce'].includes(f.kind)) { if (!mentions(p.milestones, f.value)) add(p.milestones, f.value); add(p.locations, where); }
    else if (f.kind === 'career') { if (!mentions(p.career, f.value)) add(p.career, f.value); }
    else if (f.kind === 'education') { if (!mentions(p.education, f.value)) add(p.education, f.value); }
    else if (f.kind === 'story') { if (!mentions(p.notable_stories, f.value)) add(p.notable_stories, f.value); }
    else if (f.kind === 'residence') { if (where) add(p.locations, where); if (f.date && !mentions(p.notes, f.value)) add(p.notes, `${f.value} [Further Research, line ${f.lines.join(', ')}]`); }
    else if (!mentions(p.notes, f.value)) add(p.notes, `${f.value} [Further Research, line ${f.lines.join(', ')}]`);
  }
  add(p.sources, src);
  save(p);
}
for (const [id, name, x] of H) upsert(id, name, x, SRC_H);
for (const [id, name, x] of O) { upsert(id, name, x, SRC); applyFacts(id, SRC); }
for (const [id, rename] of MERGES) { if (!exists(id)) continue; if (rename) { const p = load(id); p.name = rename; save(p); } applyFacts(id, SRC); }

// Francis Hamilton's children share his wife as mother (the register is unsure of her name)
{ const t = load('hamilton_thomas'); if (!t.relationships.mother) { t.relationships.mother = SU; save(t); } }
{ const s = load(SU); note(s, 'The Hamilton register is unsure of Francis Hamilton’s wife’s name: "possibly a Susan or Margaret"; a Susan Hamilton was living alone in Jefferson County in 1820.'); save(s); }

// relationships
const setParent = (kid, field, par) => {
  if (!par) return;
  const k = load(kid);
  if (k.relationships[field] && k.relationships[field] !== par) { console.warn(`${kid}.${field} is ${k.relationships[field]}; not changing to ${par}`); return; }
  if (k.relationships[field] !== par) { k.relationships[field] = par; save(k); }
  const p = load(par); p.relationships.children = p.relationships.children || []; if (add(p.relationships.children, kid)) save(p);
};
for (const [id, , x] of [...H, ...O]) { setParent(id, 'father', x.father); setParent(id, 'mother', x.mother); }
for (const [id, , x] of [...H, ...O]) for (const [sp, date, where] of x.spouses || []) {
  for (const [a, b] of [[id, sp], [sp, id]]) {
    const pa = load(a), r = pa.relationships; ensure(pa);
    if (!r.spouse) r.spouse = b; else if (r.spouse !== b) { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, b); }
    const other = load(b), first = norm(other.name).split(' ')[0];
    const text = `Married ${other.name}` + (date ? ` (m. ${[date, where].filter(Boolean).join(', ')})` : '');
    const i = pa.milestones.findIndex(m => /^married\b/i.test(m) && norm(m).includes(first));
    if (i < 0) pa.milestones.push(text); else if (date && !/\(m\./.test(pa.milestones[i])) pa.milestones[i] = text;
    save(pa);
  }
}
console.log(JSON.stringify({ hamilton: H.length, ohio: O.length, merged: MERGES.length, created }));
