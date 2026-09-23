#!/usr/bin/env node
/**
 * 2026-09-23, at Brendan Adams's request. Re-runnable.
 *  1. Marjorie Wheeler: sister of Dorothy Ann Wheeler (the 1944 wedding notice
 *     calls her "Mrs. Charles W. Schlatter (Marjorie Wheeler)" under "Sister
 *     Is Attendant"). Her parents Melvin Wheeler and Dorothy Douthit Pfander
 *     are Dorothy Ann's parents in Bill Allen's register. Her photograph from
 *     page 105 of the document is added in data/media.json.
 *  2. The 46 readings the document readers marked unclear, added as labelled
 *     research notes (no dates changed).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { exists, load, save, note } = require('./lib/records');
const DOC = 'Descendants of Jose Pierre Adams, compiled by William W. "Bill" Allen (2 April 2011 edition)';
const add = (a, v) => { if (!a.includes(v)) a.push(v); };
const blank = (id, name) => ({ id, name, birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [DOC], notes: [], aliases: [] });

// ── 1. Wheeler ─────────────────────────────────────────────────────────────
if (!exists('pfander_dorothy_douthit')) save({ ...blank('pfander_dorothy_douthit', 'Dorothy Douthit Pfander (Wheeler, Howard)'), birth: '1899', death: '1993', aliases: ['Dorothy Wheeler', 'Dorothy Howard'],
  notes: ['Mother of Dorothy Ann and Marjorie Wheeler; wife of Melvin Wheeler. A photo caption in Bill Allen’s document names her "Dorothy Douthit (Pfander) (Wheeler) Howard", which suggests a later marriage to a Howard.'] });
if (!exists('schlatter_charles_w')) save({ ...blank('schlatter_charles_w', 'Charles W. Schlatter'), notes: ['Husband of Marjorie Wheeler; married before May 1944.'] });
{
  const m = load('wheeler_marjorie');
  m.name = 'Marjorie Wheeler (Schlatter)';
  m.aliases = m.aliases || []; add(m.aliases, 'Mrs. Charles W. Schlatter'); add(m.aliases, 'Marge Wheeler');
  m.relationships.father = 'wheeler_melvin';
  m.relationships.mother = 'pfander_dorothy_douthit';
  m.relationships.spouse = 'schlatter_charles_w';
  m.milestones = m.milestones || []; add(m.milestones, 'Married Charles W. Schlatter (before 1944)');
  add(m.milestones, 'Matron of honor at her sister Dorothy Ann’s wedding to George Homer Allen, 8 May 1944, Sioux Falls, SD');
  add(m.sources, DOC);
  note(m, 'CORRECTION 2026-09-23: Parents set to Melvin Wheeler and Dorothy Douthit Pfander, and husband Charles W. Schlatter, from the 1944 wedding notice ("Sister Is Attendant: Mrs. Charles W. Schlatter (Marjorie Wheeler)") and Dorothy Ann’s register entry in Bill Allen’s document.');
  save(m);
  const c = load('schlatter_charles_w'); c.relationships.spouse = 'wheeler_marjorie'; c.milestones = c.milestones || []; add(c.milestones, 'Married Marjorie Wheeler (before 1944)'); save(c);
}
{
  const mel = load('wheeler_melvin'); mel.birth = mel.birth || '1897'; mel.death = mel.death || '1961';
  mel.relationships.spouse = 'pfander_dorothy_douthit'; add(mel.relationships.children, 'wheeler_marjorie'); add(mel.relationships.children, 'wheeler_dorothy_ann'); save(mel);
  const dd = load('pfander_dorothy_douthit'); dd.relationships.spouse = 'wheeler_melvin'; add(dd.relationships.children, 'wheeler_dorothy_ann'); add(dd.relationships.children, 'wheeler_marjorie'); save(dd);
  const da = load('wheeler_dorothy_ann'); if (!da.relationships.mother) da.relationships.mother = 'pfander_dorothy_douthit';
  note(da, 'CORRECTION 2026-09-23: Mother set to Dorothy Douthit Pfander, per her register entry ("daughter of Melvin Wheeler and Dorothy Douthit Pfander").'); save(da);
}
{ // photo + portrait
  const MJ = path.resolve(__dirname, '..', 'data', 'media.json');
  const media = JSON.parse(fs.readFileSync(MJ, 'utf8'));
  if (!media.items.some(i => i.id === 'marjorie-wheeler')) {
    media.items.push({ id: 'marjorie-wheeler', kind: 'photo', file: 'MarjorieWheeler_AdamsFamilyDoc_p105.jpg', title: 'Marjorie Wheeler',
      caption: 'In a wedding gown, holding a bouquet. From the photo pages of Bill Allen’s family document (page 105).',
      source: 'Descendants of Jose Pierre Adams, compiled by Bill Allen (2011), page 105.', people: ['wheeler_marjorie'],
      portraits: [{ person: 'wheeler_marjorie', crop: [210, 45, 230] }] });
    fs.writeFileSync(MJ, JSON.stringify(media, null, 2) + '\n');
  }
}

// ── 2. Unclear readings as labelled notes ──────────────────────────────────
const H = 'Bill Allen’s hypothesis', D = 'Sources disagree', O = 'From his obituary (scan partly unreadable)', U = 'Unconfirmed detail', R = 'Unclear reference';
const L = n => ` [Bill Allen, line ${n}]`;
const NOTES = {
  adams_jose_pierre: [
    [H, 'His grandson’s 1898 sketch says he came from Scotland in early manhood (perhaps the 1810s). Bill Allen doubts it: several records say he was born or raised in Virginia, and Bill thinks the Scottish link came through Elizabeth Hamilton’s parents.', '3994, 8679, 8682'],
    [H, 'Bill speculates that the middle name "Pierre" may be a garbling of Peer, a Virginia family name, prompted by a Samuel Peer living nearby.', 8689],
    [U, 'Family tradition says he was an illegitimate son of John Quincy Adams, and a letter mentions a birth in Newark, New Jersey; the sentence does not make clear whether Newark refers to him or to John Quincy Adams. Unproven.', 2907],
    [H, 'Bill estimates he died between 1830 (his last census) and 1835, possibly as late as 1840.', '7191, 7443'],
    [D, 'The register gives his marriage to Elizabeth as 1813; its narrative says around 1815-1816.', 3995],
    [D, 'The register prints his involvement in Francis Hamilton’s estate as 1822 and "1853"; the second date is probably a misprint.', 9675],
    [U, 'A family letter says it is possible he moved to Missouri with his son’s family.', 2915],
  ],
  hamilton_elizabeth_eliza: [
    [H, 'Bill thinks she probably remarried soon after Jose died; no record of a remarriage has been found.', 4019],
    [D, 'The 1850 census age suggests she was born about 1783, in Virginia.', 7497],
  ],
  adams_magdalena: [
    [R, 'The Magdalena Adams named in Francis A. Hamilton’s 1830 will is assumed by the compiler to be Jose P. Adams’s daughter.', 9714],
  ],
  adams_alexander_washington: [
    [H, 'Possibly the male aged 20-29 in Elizabeth Adams’s household, Union Township, Licking County, Ohio, in the 1840 census. Another candidate family in central Missouri was ruled out.', '4053, 7449'],
    [U, 'An Alex W. Adams, unmarried, aged 44, registered for the Civil War draft in Columbus, Ohio, in 1863; Bill is not sure it is the same man.', 7895],
  ],
  adams_george_francis_1: [
    [O, 'His obituary says his parents emigrated west in 1833, and that he took part in the Black Hawk War (1832) and later enlisted under General Price and Colonel Watson to drive the Mormons from Missouri (1838). The scanned years read 1885 and 1886; the corrected years are estimates.', '6821, 6825, 6826'],
    [O, 'His obituary calls him a grandson of Alexander Hamilton; Bill notes it was apparently not written by a family member and confuses the family history.', 6820],
    [O, 'His obituary says he was a Presbyterian for many years (the number is unreadable), was confined to bed for six months before his death, and that the Rev. Sisson of the Methodist church at Castle Rock conducted his funeral.', '6849, 6852'],
    [D, 'His obituary says he came to Colorado in 1878; a biographical record says 1886.', 6952],
    [H, 'Bill thinks he probably came to Missouri alone, and mentions his apparent love of tall tales in connection with the family’s uncertain name history.', '7354, 8717'],
    [U, 'A family letter says he and Cynthia moved from (West) Virginia to Missouri, the writer thinks to Marion, Missouri.', 2915],
    [D, 'His son John W.’s death certificate gives his birthplace as Ohio; Bill believes Alberta Allen, the informant, stated this by mistake.', 7358],
  ],
  lane_cynthia: [[D, 'A biographical record says she died in Missouri in 1861; her husband’s obituary implies 1863.', 6956]],
  clark_ephraim: [[H, 'Apparently died soon after his son Clay was born, possibly in the Civil War.', 4154]],
  allen_margaret_jeanice: [[U, 'Her brother George Homer Allen’s 2010 obituary lists her as Peggy Turmon of Pueblo, Colorado, which suggests a later married name.', 5355]],
  wheeler_dorothy_ann: [[U, 'A photo caption names her Dorothy (Wheeler) Angwin at her 80th birthday, which suggests a later married name.', 5367]],
  allen_wendy: [[U, 'Her study of international law is recorded as at "Oxford College, Cambridge, England", which does not name a real college; the institution is uncertain.', 5475]],
  wheeler_marjorie: [[R, 'Probably the "Marge" in the photo caption "Dorothy A, Dorothy D & Marge".', 6249]],
  adams_mary_swan: [[H, 'Bill believes Mary stepped in as Lewis Swan’s wife after her sister Magdalena died, a common practice at the time, and that she had no children.', '8472, 8547']],
  adams_harriet_josephine: [[U, 'In the 1880 census she appears as Jacobina. Bill suggests it may be a middle name; Jacobina was also her aunt’s name.', 7908]],
  konitzer_christiana: [[D, 'Her son George W.’s death certificate names his mother as Henrietta Konitzer of Germany; Bill thinks the informant got her first name wrong.', '7931, 8236']],
  swan_lewis: [
    [H, 'Bill believes Lewis, much older than Magdalena, had an earlier marriage that produced Horatio and Melissa.', 8463],
    [H, 'No death or burial record found; assumed to have died between 1870 and 1880.', 8520],
  ],
  hamilton_francis: [
    [D, 'The register says he bought household goods from John Lindsay in "1879", apparently a misprint for 1789.', 9215],
    [H, 'A Maryland Historical Magazine article says he moved to Prince George’s County before 1799; the compiler thinks that was a different Francis Hamilton, who married Susan Blandford.', 9226],
  ],
  hamilton_john_of_kype: [[R, 'A letter says "he" bought the tower known as the Castle of Mauchline, later sold it and leased it back from the Earl of Loudon; it may mean John Hamilton of Kype or his son Gavin.', 3157]],
};
let n = 0;
for (const [id, list] of Object.entries(NOTES)) {
  if (!exists(id)) { console.warn('missing', id); continue; }
  const p = load(id); p.notes = p.notes || [];
  for (const [label, text, line] of list) { const t = `${label}: ${text}${L(line)}`; if (!p.notes.includes(t)) { p.notes.push(t); n++; } }
  p.sources = p.sources || []; add(p.sources, DOC);
  save(p);
}
console.log(`Wheeler family linked; ${n} labelled notes added`);
