#!/usr/bin/env node
/**
 * 2026-09-25, David Tate Ball proven a son of William Ball Sr. of Hawkins
 * County: the County Court minutes of 6 Sep 1875 (pp. 248–251) name him among
 * the heirs at law of Wm Ball Sr., deceased, in the partition of William's
 * land on Buck Creek, and he signed the heirs' agreement of 23 Aug 1875 by his
 * agent S. H. Ball. The same record lists William's other heirs, so his
 * children are added as records. Re-runnable.
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

const MIN1875 = 'Hawkins County, Tennessee, County Court Minutes, April 1874–December 1877, pp. 248–251 (Monday 6 Sep 1875: Zadock Barnard and others v. Harden Ball and others, bill for partition, and In the matter of Hardin Ball, administrator, v. the heirs of Wm Ball; the heirs\' agreement of 23 Aug 1875); FamilySearch images 3:1:3QHV-63CD-V8LW and 3:1:3QHV-63CD-VZH7';
const FAGN = 'Find a Grave, memorial 125432952 (Nancy Tate Ball, 1788–1840, Ball Cemetery, Hawkins County)';
const FAGW = 'Find a Grave, memorial 101804658 (William Ball, 1775–1871, Ball Cemetery, Hawkins County)';
const BONNIE = 'Bonnie Ball, "The Balls of Fairfax and Stafford in Virginia" (1961), entry 33, William Ball, and his children 110–119 (Internet Archive)';
const FS1880 = 'FamilySearch, United States Census, 1880 (District 8, Grainger County, Tennessee; David Ball, 66, farm labourer, with Drady C., 64, and Nancy R., 39; ark 1:1:MDW7-MJ5)';
const FAGE = 'Find a Grave, memorial 189661237 (Edward Tate Ball, 1810–1878)';

// ── David ───────────────────────────────────────────────────────────────────
edit('ball_david', [MIN1875, FS1880], p => {
  swapNote(p, 'Inferred: son of William Ball (about 1775–1871) of Hawkins County and Nancy Tate.',
    'Proven son of William Ball Sr. (about 1775–1871) of Hawkins County. When William\'s land on Buck Creek was partitioned after his death, the County Court at Rogersville on 6 Sep 1875 declared the heirs at law of "Wm Ball Sr, decd" to be Mary Barnard (wife of Zadock Barnard), Moses Ball, Milton Ball, Nancy Bailey formerly Ball, George Ball, L. B. Ball, Sibby Bradley (wife of John K. Bradley), Clinton Ball, Sarah Barnard formerly Ball, David Ball, and the defendants Hardin Ball (the administrator), E. T. Ball and the unknown heirs of Wm Ball Jr., deceased, each entitled by descent to an equal undivided share. David, then living away from Hawkins County, signed the heirs\' agreement of 23 Aug 1875 by his agent S. H. Ball (County Court minutes). His mother was William\'s wife Nancy Tate: he was born in 1813, within their marriage, and carried her surname and her brother David Tate\'s name.');
  swapNote(p, 'Caution: the Find a Grave memorials of William and Nancy (Tate) Ball list thirteen children and do not include him.',
    'The Find a Grave memorials of William and Nancy (Tate) Ball, and Bonnie Ball\'s 1961 genealogy, list William\'s children without him; the 1875 court record shows they simply missed him, as he had left the county by 1840.');
  note(p, 'In 1880 he was a farm labourer, aged 66, in District 8 of Grainger County (not Roane), with Drady C., 64, and their daughter Nancy R., 39; his father is given as born in Virginia and his mother in Tennessee (1880 census as indexed by FamilySearch). Grainger County adjoins Hawkins.');
  add(p.locations, 'District 8, Grainger County, Tennessee');
});

// ── William and Nancy ───────────────────────────────────────────────────────
edit('ball_william_1784', [MIN1875, BONNIE], p => {
  swapNote(p, 'Find a Grave\'s memorials for William (101804658) and Nancy (125432952) name thirteen children',
    'His heirs, as the County Court declared them on 6 Sep 1875 when his land on Buck Creek in the 16th Civil District (adjoining S. H. Ball and Nancy Lucas) was partitioned: Mary (Barnard), Moses, Milton, Nancy (Bailey), George, Lewis B., Sibby (Bradley), Clinton, Sarah (Barnard), David, Hardin, E. T. (Edward Tate) and the unknown heirs of William Jr., deceased, thirteen shares in all; Hardin, the administrator, had disputed the clerk\'s account of his administration and settled for a thirteenth share (County Court minutes). Find a Grave and Bonnie Ball\'s genealogy also name Tabitha (Smith, born 1802) and a William Solomon Ball who died in 1862, neither of whom appears in the suit.');
  add(p.locations, 'Buck Creek, 16th Civil District, Hawkins County, Tennessee');
});
edit('tate_nancy', FAGN, p => {
  note(p, 'Find a Grave gives her parents as Edward Tate, born 1755 in Botetourt County, Virginia, and Sarah McMullen, a family that settled in Greene County, Tennessee, and later moved west; her siblings Edward (born 1790), Catherine, Gersham, Carey, David, Jane and Robert; and her death in the 1840s at New Canton, Hawkins County (UNPROVEN: the memorial cites no records).');
});

// ── William's other children ────────────────────────────────────────────────
const KIDS = [
  ['ball_tabitha', 'Tabitha Ball (Smith)', 'F', '1802', '', 'Eldest child of William and Nancy (Tate) Ball, born 1802; married T. J. Smith (Find a Grave; Bonnie Ball). Not named among the heirs in 1875, so probably dead by then.', [FAGN, BONNIE]],
  ['ball_mary_barnard', 'Mary Ball (Barnard)', 'F', '', '', 'Daughter of William and Nancy (Tate) Ball; wife of Zadock Barnard, who brought the 1875 bill for partition of her father\'s land (County Court minutes).', [MIN1875, FAGN]],
  ['ball_sarah_barnard', 'Sarah Ball (Barnard)', 'F', '', '', 'Daughter of William and Nancy (Tate) Ball; "Sarah Barnard formerly Ball" among the heirs in 1875 (County Court minutes).', [MIN1875, FAGN]],
  ['ball_edward_tate', 'Edward Tate "Ned" Ball', 'M', '18 Jul 1810', '3 May 1878', 'Son of William and Nancy (Tate) Ball, born 18 Jul 1810 in Hawkins County; married Mahala "Ella" Bussell there in 1840; a defendant, as E. T. Ball, in the 1875 partition of his father\'s land; in Hawkins County in every census to 1870; died 3 May 1878 (Find a Grave; County Court minutes; Bonnie Ball, who gives about 1806).', [MIN1875, FAGE, BONNIE]],
  ['ball_nancy_bailey', 'Nancy Ball (Bailey)', 'F', '1815', '1905', 'Daughter of William and Nancy (Tate) Ball, born 1815, twin of Sabilla; married Andrew Bailey; "Nancy Bailey formerly Ball" among the heirs in 1875 (County Court minutes; Find a Grave; Bonnie Ball).', [MIN1875, FAGN, BONNIE]],
  ['ball_sabilla_bradley', 'Sabilla "Sibby" Ball (Bradley)', 'F', '1815', '1906', 'Daughter of William and Nancy (Tate) Ball, born 1815, twin of Nancy; wife of John K. Bradley, with whom she signed the heirs\' agreement of 1875 (County Court minutes; Find a Grave; Bonnie Ball).', [MIN1875, FAGN, BONNIE]],
  ['ball_harden', 'Harden Ball', 'M', '1818', 'aft 1880', 'Son of William and Nancy (Tate) Ball, born 1818; administrator of his father\'s estate, whose exceptions to the clerk\'s account were settled by the heirs\' agreement of 23 Aug 1875 for a thirteenth share of the land; his father, 95, lived in his household in 1870 (County Court minutes; 1870 census; Find a Grave). Bonnie Ball gives his wives as a McNeese and Sibby Miller.', [MIN1875, FAGN, BONNIE]],
  ['ball_moses_1820', 'Moses Ball', 'M', '1820', '', 'Son of William and Nancy (Tate) Ball, born 1820; one of the heirs in 1875 (County Court minutes; Find a Grave).', [MIN1875, FAGN]],
  ['ball_lewis_b', 'Rev. Lewis B. Ball', 'M', '17 Feb 1824', '1898', 'Son of William and Nancy (Tate) Ball, born 17 Feb 1824; married Rebecca Jackson; one of the complainants in the 1875 partition suit (County Court minutes; Find a Grave; Bonnie Ball).', [MIN1875, FAGN, BONNIE]],
  ['ball_clinton_c', 'Clinton C. Ball', 'M', '1826', '1920', 'Son of William and Nancy (Tate) Ball, born 1826, twin of Milton; married Matilda Long in Hawkins County on 18 Nov 1851; one of the heirs in 1875 (County Court minutes; Find a Grave; Bonnie Ball).', [MIN1875, FAGN, BONNIE]],
  ['ball_milton_edward', 'Milton Edward Ball', 'M', '1826', '1912', 'Son of William and Nancy (Tate) Ball, born 1826, twin of Clinton; married Louisa McCarroll on 20 Dec 1849; signed the heirs\' agreement of 1875 as M. E. Ball (County Court minutes; Find a Grave; Bonnie Ball).', [MIN1875, FAGN, BONNIE]],
  ['ball_george_w_1827', 'George W. Ball', 'M', '1827', 'aft 1860', 'Son of William and Nancy (Tate) Ball, born 1827; married Elizabeth Light on 29 Oct 1848; signed the heirs\' agreement of 1875 as G. W. F. Ball (County Court minutes; Find a Grave; Bonnie Ball).', [MIN1875, FAGN, BONNIE]],
  ['ball_william_solomon', 'William Solomon Ball', 'M', 'abt 1830', '1862', 'Given by Find a Grave as a son of William and Nancy (Tate) Ball, a private who died in 1862 (UNPROVEN: no record seen). The 1875 suit names instead the unknown heirs of a William Ball Jr., deceased, whom Bonnie Ball says died in Roane County; whether these are one man or two is not settled.', [FAGN, BONNIE]],
  ['ball_william_jr', 'William Ball Jr.', 'M', '', 'bef 1875', 'Son of William Ball Sr.; dead by 1875, when his heirs, "whose names and residences are unknown", were made defendants in the partition of his father\'s land (County Court minutes). Bonnie Ball says he died in Roane County, where David also lived; possibly the same man as the William Solomon Ball of Find a Grave.', [MIN1875, BONNIE]],
];
for (const [id, name, sex, b, d, text, src] of KIDS) {
  person(id, name, sex, src, p => { if (b) refine(p, 'birth', b); if (d) refine(p, 'death', d); add(p.locations, 'Hawkins County, Tennessee'); note(p, text); });
  child(id, 'ball_william_1784', id === 'ball_william_jr' ? '' : 'tate_nancy');
}
console.log('David Ball proven applied');
