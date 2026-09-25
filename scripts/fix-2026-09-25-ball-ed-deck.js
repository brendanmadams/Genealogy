#!/usr/bin/env node
/**
 * 2026-09-25, the Ball thread once more, from pages 41–52 of Ed Simons's
 * "Simons Family Trees and Genealogy" deck: the Moses Ball grant and marker,
 * Ann Brashear's parents and dates, the children of Moses Sr. and of William
 * and Nancy (Tate) Ball as Find a Grave lists them, the Ball Family of the
 * Potomac's immigrant James Ball, and the Y-DNA project's subgroups, which
 * keep the Stafford Balls and Mary Ball Washington's Lancaster Balls apart.
 * Re-runnable.
 */
'use strict';
const { load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const edit = (id, src, fn) => { const p = load(id); p.notes = p.notes || []; p.sources = p.sources || []; p.locations = p.locations || []; p.aliases = p.aliases || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); };
const refine = (p, k, v) => { if (!p[k] || /^(abt |about )?\d{4}$/i.test(String(p[k]).trim())) p[k] = v; };
const swapNote = (p, from, to) => { const i = p.notes.findIndex(n => n.startsWith(from)); if (i >= 0) p.notes[i] = to; else note(p, to); };

const DECK = 'Ed Simons, "Simons Family Trees and Genealogy" (slide deck, Sep 2026), pp. 41–52';
const FTDNA = 'FamilyTreeDNA, Ball Surname Y-DNA Study, public results (checked 25 Sep 2026): subgroup 00894 "John Ball, b. 1670, Stafford/Fairfax Co., VA", haplogroup R-M269 > U106; subgroup 00401 "Col William Ball, Lancaster Co., VA", haplogroup I-M253';
const MARKER = 'Historical marker "Moses Ball Grant", Carlin Springs Road, Glencarlyn, Arlington, Virginia, erected by Arlington County (Historical Marker Database no. 56091)';
const FAGM = 'Find a Grave, memorial 36788166 (Moses Ball Sr., 1717–1792)';
const BRASH = 'Charles Brashear, "A Brashear(s) Family History", vol. 2 (1999), as reproduced in Ed Simons\'s deck';
const FAGN = 'Find a Grave, memorial 125432952 (Nancy Tate Ball, 1788–1840, Ball Cemetery, Hawkins County)';
const FAGW = 'Find a Grave, memorial 101804658 (William Ball, 1775–1871, Ball Cemetery, Hawkins County)';
const POTOMAC = 'Doris LeClerc Ball and George Ball, "The Ball Family of the Potomac, 1654–2004" (2004), as summarised on Find a Grave and Geni';
const MBW = 'maryballwashington.com, "The English ancestry of George Washington\'s mother, Mary Ball" (monographs on the Balls of Berkshire, Northamptonshire and Virginia)';

// ── John Ball of Stafford: two Ball families, one surname ───────────────────
edit('ball_john_stafford', [FTDNA, POTOMAC, DECK, MBW], p => {
  refine(p, 'birth', 'abt 1670');
  add(p.locations, 'Overwharton Parish, Stafford County, Virginia');
  swapNote(p, 'The claim that he was a son of Richard Ball (1645–1677)',
    'Not of Mary Ball Washington\'s family. Her line is the Lancaster County Balls: Col. William Ball of Millenbeck (about 1615–1680), his son Col. Joseph Ball (1649–1711) of Epping Forest, and Joseph\'s daughter Mary, who married Augustine Washington on 6 Mar 1730. John Ball of Stafford belongs to a different family, which The Ball Family of the Potomac traces to a James Ball who came to Westmoreland County in 1654 (UNPROVEN here; the book\'s claim). The Ball surname Y-DNA project keeps the two apart: fourteen tested descendants of "John Ball, b. 1670, Stafford/Fairfax Co., VA" form one subgroup in haplogroup R-U106, while the descendants of "Col William Ball, Lancaster Co., VA" form another in haplogroup I-M253. Two haplogroups means two unrelated male lines, so no genealogy that joins them can be right. The older claim that John was a son of Richard Ball (1645–1677), Col. Joseph\'s brother, has no record behind it and is contradicted by the DNA.');
  note(p, 'Pages 47–52 of Ed Simons\'s deck (Colonial Families of the United States; Ancestral Records and Portraits, p. 420; a typescript Ball genealogy tracing the Lancaster Balls to Rev. Richard Ball of Northampton and six brothers on the ship Planter in 1635) all describe the Lancaster County family and George Washington\'s descent from it. They are accurate for that family but do not mention John Ball of Stafford or his descendants; the Barkham and Northampton descent itself "has never been substantiated by reference to documentary evidence" (maryballwashington.com).');
});
edit('winifred_ball', POTOMAC, p => { p.name = 'Winifred Williams (Ball)'; add(p.aliases, 'Winifred Ball'); note(p, 'The Ball Family of the Potomac gives her maiden name as Williams, of Overwharton Parish, Stafford County (UNPROVEN here; the book\'s statement).'); });

// ── Moses Ball Sr.: the grant, the marker, the neighbour ────────────────────
edit('ball_moses_sr', [MARKER, FAGM, BRASH, DECK], p => {
  refine(p, 'birth', '2 May 1717'); refine(p, 'death', '3 Sep 1792');
  for (const l of ['Stafford County, Virginia', 'Four Mile Run, Fairfax County (now Glencarlyn, Arlington), Virginia', 'Ball–Carlin Cemetery, Arlington, Virginia']) add(p.locations, l);
  note(p, 'Born 2 May 1717 in Stafford County; died 3 Sep 1792 at what is now Glencarlyn, Arlington County (Find a Grave). In 1748 Lord Fairfax granted him 91 acres on Four Mile Run, between the land of his brother John Ball on the north and that of Simon Pearson and George Washington on the south; the land stayed in the family until 1818, and Arlington County\'s marker on Carlin Springs Road records that "George Washington, who owned an adjacent tract of land south of Four Mile Run, surveyed his tract on April 22, 1785, in company with Moses Ball." He was buried on his own farm, later Carlin\'s, in what is now the Ball–Carlin Cemetery, not in the Ball family burying ground at Clarendon, which was bought by John Ball in 1796 (Doris Ball; a letter of Clara Ball, 1897).');
  note(p, 'Children, from the Brashear family history: John (25 Jul 1746 – 14 Dec 1814, m. Mary Ann Thrift), Moses Jr. (1748–1831, m. Mary Ann "Molly" Hardin), Robert (1750–1776), Bazil (1751 – about 1835), George (about 1752 – 1825, m. Elizabeth Tunnell), James (born 1755), Ann (1757–1812) and Sibella (1762–1817). Charles Brashear repeats the saying that Moses was Washington\'s second cousin; the Y-DNA project shows the two Ball families are not related, and Washington used "cousin" for any Ball.');
});
edit('brashears_ann', [BRASH, DECK], p => {
  refine(p, 'birth', '26 Sep 1729'); refine(p, 'death', '30 Nov 1816');
  for (const l of ['Brashear\'s Meadow, Prince George\'s County, Maryland', 'Arlington, Virginia']) add(p.locations, l);
  add(p.aliases, 'Ann Brashear');
  note(p, 'Born 26 Sep 1729 at Brashear\'s Meadow, Prince George\'s County, Maryland, daughter of Robert Brashear and Charity Dowell; died 30 Nov 1816 and probably buried in an unmarked grave beside Moses Ball at Arlington (Charles Brashear, A Brashear(s) Family History, vol. 2, 1999; UNPROVEN here, from that compilation).');
});

// ── William and Nancy (Tate) Ball: the children Find a Grave lists ──────────
edit('ball_william_1784', [FAGW, FAGN, DECK], p => {
  note(p, 'Find a Grave\'s memorials for William (101804658) and Nancy (125432952) name thirteen children, Tabitha, Mary, Sarah, Edward Tate "Ned" (1810), the twins Nancy and Sabilla (1815), Harden (1818), Moses (1820), Lewis B. (1824), the twins Clinton C. and Milton Edward (1826), George W. (1827) and William Solomon (1830s), and say Nancy bore "more than a dozen". David (born 1813) is not among them, so his place in this family rests on the census and the Tate name, not on the memorials; see his record.');
});
edit('tate_nancy', [FAGN, FAGW], p => {
  note(p, 'Find a Grave gives her dates as 1788–1840 and names a brother, David Tate, who "moved west"; if David Tate Ball was her son, he carried her brother\'s name as well as her surname.');
});
edit('ball_david', [FAGN, FAGW], p => {
  note(p, 'Caution: the Find a Grave memorials of William and Nancy (Tate) Ball list thirteen children and do not include him. The inference that he was their son rests on his 1813 birth in Hawkins County, the boy of his age in William\'s 1830 household, and the name Tate, which was Nancy\'s surname and her brother David Tate\'s name.');
});
console.log('Ball deck notes applied');
