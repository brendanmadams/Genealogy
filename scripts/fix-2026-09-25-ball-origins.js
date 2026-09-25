#!/usr/bin/env node
/**
 * 2026-09-25, where the Stafford Balls came from: George H. S. King's notes
 * on the John Ball family (his transcription of John's 1722 will, the 1695
 * and 1699/1700 grants, the Williams and Charles County, Maryland, clues),
 * Nugent's abstract of John Drayton's 1654 Occoquan patent with James Ball
 * among the headrights, and the Y-DNA branch ages. Re-runnable.
 */
'use strict';
const { load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const edit = (id, src, fn) => { const p = load(id); p.notes = p.notes || []; p.sources = p.sources || []; p.locations = p.locations || []; p.aliases = p.aliases || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); };
const refine = (p, k, v) => { if (!p[k] || /^(abt |about )?\d{4}$/i.test(String(p[k]).trim())) p[k] = v; };

const KING = 'George Harrison Sanford King Papers (Fredericksburg; FamilySearch, "Stafford, Virginia, Genealogies 1914–1985"), "Miscellaneous Notes, John Ball Family", with King\'s 1962 certified copy of the will of John Ball from the Clerk\'s transcript (Stafford Will Book K, p. 35, now lost); images 3:1:33SQ-GPXC-XX4, X8N, XZB, X88 and 3:1:33S7-9PXC-66T';
const NUGENT = 'Nell Marion Nugent, Cavaliers and Pioneers: Abstracts of Virginia Land Patents and Grants, 1623–1666 (1934), p. 369: John Drayton, 2,000 acres, Westmoreland County, 25 Nov 1654 (Patent Book 3, p. 313)';
const DISC = 'FamilyTreeDNA Discover, haplogroup R-FT145790 (formed about 1400, most recent common ancestor about 1650; six tested descendants reporting England and the United Kingdom) under R-FT146722 (England, United Kingdom, Wales); checked 25 Sep 2026';

edit('ball_john_stafford', [KING, NUGENT, DISC], p => {
  for (const l of ['Little Hunting Creek and Dogue Run, Stafford (now Fairfax) County, Virginia']) add(p.locations, l);
  note(p, 'Land and record trail, from George H. S. King\'s notes: granted 221 acres on the North Branch of Little Hunting Creek by the Northern Neck Proprietor on 9 Aug 1695, and 300 acres on Dogue Run, adjoining Col. George Mason, on 8 Mar 1699/1700 (land later left to his daughter Mary); named an executor, with Henry Hally Sr. and Robert Williams, in the will of Giles Vandegasteel, 1699/1700; produced Ann Williams\'s deed of gift to her daughter Margaret in court, 15 Sep 1704; with his wife Winifred sold 200 acres called "Lanternam" in Charles County, Maryland, formerly taken up by William Williams, to Richard Edelen on 9 Mar 1714. Most Stafford deeds of the period are lost.');
  note(p, 'His will, dated 14 Aug 1722 and proved 14 Nov 1722 (King\'s certified copy from the Clerk\'s transcript; the will book itself is lost), left 595 acres on Piney Branch to his daughters Martha and Ann, other land to a daughter with reversion to Martha, "one case of Pistols & Holsters" to his son James, "cutting him off from all ye rest", and the residue to his wife Winifred, executrix, with Capt. Simon Pearson to assist her; witnesses Gabriel Adams, James Davis, Alice Boyston and Margaret Farroll. James, of Overwharton Parish, sold the 100 acres between the forks of Little and Great Hunting Creek that the will had left him, in 1726. King judged Bonnie Ball\'s 1961 book "very faulty in the earlier part" on John Ball, saying it had drawn people named Ralls into the Ball pedigree.');
  note(p, 'Where he came from is not proven. UNPROVEN: The Ball Family of the Potomac (2004) makes him a son of the James Ball who is listed among the forty headrights in John Drayton\'s patent of 2,000 acres on the Occoquan River, Westmoreland (later Stafford) County, 25 Nov 1654 (Nugent); the patent lies a few miles below John\'s later land on Dogue Run and Hunting Creek, which fits, but a headright entry proves only that a James Ball had been brought to Virginia by then. King thought the Charles County, Maryland, records of the "Lanternam" tract the likeliest place to learn the ancestry of John or Winifred. The Y-DNA of his descendants (haplogroup R-FT145790) has a common ancestor born about 1650 and all its tested members report English or Welsh origins.');
});
edit('winifred_ball', [KING], p => {
  refine(p, 'death', 'aft 1741');
  note(p, 'Executrix of her husband\'s will, 1722; as "Winifred Ball, widow" sold 106 acres on Dogue Run to George Mason on 18 Jan 1723/24; married secondly Benjamin Lawrence, by whom she had Priscilla Lawrence, born 27 Dec 1728 (recorded in Moses Ball\'s Bible), and as Winifred Lawrence leased 30 acres with Moses Ball to John West on 15 Jan 1741 (King\'s notes). Her maiden name Williams is Bonnie Ball\'s claim; King found the Charles County deed she cited does not prove it, and thought William Williams, who patented 881 acres on Dogue Run in 1694 and died intestate in Stafford in 1703, "conceivable" as her father, no more.');
});
edit('ball_moses_sr', [KING], p => {
  note(p, 'Married Ann Brashear on 27 Jun 1745, according to his family Bible as cited by Bonnie Ball; in a deposition of 29 Jun 1767 he recalled his brother John pointing out a boundary "line tree" twenty years earlier; in 1741 he and his mother, by then Winifred Lawrence, leased 30 acres to John West (King\'s notes). His half-sister Priscilla Lawrence was born in 1728.');
});
edit('brashears_ann', [KING], p => note(p, 'Married Moses Ball on 27 Jun 1745 (his Bible, as cited by Bonnie Ball and noted by G. H. S. King).'));
console.log('Ball origins applied');
