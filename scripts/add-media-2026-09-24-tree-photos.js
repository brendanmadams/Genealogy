#!/usr/bin/env node
/**
 * 2026-09-24, photos and record images saved from Ancestry.com public member
 * trees with Brendan Adams's approval. Published here: photos taken before
 * 1930 and record images. Later snapshots and headstone photos were saved to
 * the private image folder but are held until their owners agree. Adds items
 * to data/media.json; re-runnable. Then run scripts/prepare-media.ps1 and
 * scripts/build.js.
 * Also records what the images and the Kulp-Ritchey-Dorsett tree show:
 *  - the 1896, 1917, 1920, 1941 and 1945 marriages;
 *  - Rhea Dradie Simons, Ray and Dradie's daughter who died at birth in 1916
 *    (the second sister in Elaine's 2011 obituary);
 *  - Elmer Simons's two wives, Wilma K. Hardy (m. 1947) and Beatrice "Bette"
 *    Jones (m. 1969), which settles "Wilma or Betty".
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { exists, load, save, note } = require('./lib/records');
const MEDIA = path.resolve(__dirname, '..', 'data', 'media.json');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, ...(sex ? { sex } : {}), birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
function edit(id, src, fn) { const p = load(id); for (const k of ['milestones', 'notes', 'sources', 'aliases', 'locations', 'career', 'education']) p[k] = p[k] || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); }

const shared = (who, when, tree) => `Shared on Ancestry.com by ${who}, ${when}; from the public member tree "${tree}".`;
const COX = 'Cox Family Tree', KULP = 'Kulp-Ritchey-Dorsett Family Tree', QUINN = 'Quinn Family Tree';

const items = [
  {
    id: 'forester-ivan-glenn-boys', kind: 'photo',
    file: 'ancestry_forester_ivan_glenn.jpg',
    title: 'Ivan and Glenn Forester as boys',
    caption: 'Studio portrait of the two sons of Charlie and Etta (Burch) Forester, about 1905: Ivan (born 1899) on the left and Glenn (born 1897) on the right. They were grandsons of Rebecca Ann (Simons) Forester.',
    source: shared('wtmbbanjo', '20 Mar 2013', COX),
    people: ['forester_ivan_duane', 'forester_glenn_c'],
    portraits: [{ person: 'forester_ivan_duane', crop: [153, 196, 140] }, { person: 'forester_glenn_c', crop: [335, 159, 150] }],
  },
  {
    id: 'forester-glenn-baby', kind: 'photo',
    file: 'ancestry_forester_glenn_4.jpg',
    title: 'Glenn Forester as a baby',
    caption: 'Cabinet-card portrait of Glenn C. Forester, born 15 Mar 1897, probably taken about 1898.',
    source: shared('wtmbbanjo', '20 Mar 2013', COX),
    people: ['forester_glenn_c'],
  },
  {
    id: 'mcphail-ellen-john-b', kind: 'photo',
    file: 'ancestry_mcphail_ellen_john_b.jpg',
    title: 'Ellen and John B. McPhail with a boy named John',
    caption: 'Labelled in the tree as Ellen Rogers McPhail, her husband John B. and "son John McPhail". The boy looks about ten, so he is more likely a grandson. Taken before John B.\'s death in March 1925.',
    source: shared('tth50', '23 Jan 2012', KULP),
    people: ['ball_ellen_rogers', 'mcphail_john_belle'],
  },
  {
    id: 'mcphail-ellen-1925-lynden', kind: 'photo',
    file: 'ancestry_mcphail_ellen_1925.jpg',
    title: 'Ellen Rogers Ball McPhail and family, Lynden, 1925',
    caption: 'A copied page labelled "1925, Lynden, WA" and "Ellen Roger Ball McPhail": six people outdoors, two older women seated in front. Ellen, then about 73 and widowed that March, is probably one of them; the others are not named.',
    source: shared('John McPhail', '1 Jan 2018', KULP),
    people: ['ball_ellen_rogers'],
  },
  {
    id: 'marriage-1896-forester-burch', kind: 'document',
    file: 'ancestry_forester_burch_marriage_1896.jpg',
    title: 'Marriage notice of Charles E. Forester and Addie May Burch, 1896',
    caption: '"At the residence of Jonas Eglekraut, in Clear Lake township, by Rev. J. W. Martin, Chas. E. Forester and Miss Addie May Burch, both of Steuben Co., Ind." Published 4 Nov 1896; the paper is not named in the tree.',
    source: `Newspaper clipping, 4 Nov 1896. ${shared('dmacfarlane', '9 Feb 2022', COX)}`,
    people: ['forester_charles_elmer', 'burch_etta'],
  },
  {
    id: 'marriage-1917-forester-borton', kind: 'document',
    file: 'ancestry_forester_borton_marriage_1917.jpg',
    title: 'Marriage register: Glenn Forester and Ruth Borton, Jackson, Michigan, 1917',
    caption: 'Entry 817: Glen Forester, 20, of Jackson, born in Ohio, a mechanic, son of Charles Forester and Etta M. Burch; Ruth Borton, 21, of Jackson, born at Ray, Indiana, daughter of Charles Borton and Elberta Baker. Married 3 Nov 1917 at Jackson by William H. Shannon, clergyman.',
    source: `Jackson County, Michigan, marriage register, 1917. ${shared('Marci Hess', '21 Dec 2012', COX)}`,
    people: ['forester_glenn_c', 'borton_ruth_trilby'],
  },
  {
    id: 'marriage-1920-schriefer-quinn', kind: 'document',
    file: 'ancestry_schriefer_quinn_1920.jpg',
    title: 'Marriage certificate of George Schriefer and Ethel Quinn, 12 July 1920',
    caption: 'George Schriefer, 21, of Baltimore, a B&O Railroad worker, and Ethel Quinn, 20, of Baltimore, both single, married at St. Paul\'s Church, Ellicott City, under a Howard County licence, by the Rev. Michael A. Ryan. Filed 26 Jul 1920.',
    source: `Howard County, Maryland, Circuit Court marriage return, 1920. ${shared('cmfrank63', '10 Nov 2019', QUINN)}`,
    people: ['schriefer_george_goode', 'ethel_quinn_schriefer'],
  },
  {
    id: 'marriage-1941-poehlman-schriefer', kind: 'document',
    file: 'ancestry_poehlman_schriefer_1941.jpg',
    title: 'Church marriage register: Jack Poehlman and Emily Schriefer, September 1941',
    caption: 'Entry 46: Jack Hetrick Poehlman of Mount Rainier, Maryland, son of John Poehlman and Beulah, a Lutheran; and Emily Margaret Schriefer of Baltimore, daughter of George Schriefer and Ethel Quinn, baptized at St. John\'s in 1921. Married in September 1941; witnesses Robert Poehlman and Bernadette O\'Grady.',
    source: `Baltimore Catholic parish marriage register, 1941. ${shared('cmfrank63', '28 Jun 2017', QUINN)}`,
    people: ['poleman_jack', 'emily_schrieffer_mckeldin'],
  },
  {
    id: 'marriage-1945-mckeldin-poehlman', kind: 'album',
    title: 'Marriage of Charles E. McKeldin and Emily M. Poehlman, 2 November 1945',
    caption: 'Page 1, the Baltimore City marriage licence (no. 5549): Charles E. McKeldin, 28, a machinist, single, and Emily M. Poehlman, 24, a widow, of 334 E. 21st Street; not related. Page 2, the church register, entry 40: Charles E. McKeldin Jr. of 1143 Carroll Street, son of Charles E. McKeldin Sr. and Emma A. Bell, and Emily M. Poehlman (Schriefer), baptized 20 Feb 1921 at St. John\'s, daughter of George Schriefer and Ethel Quinn; witnesses William A. McKeldin and Helen F. Bosies; the Rev. Paul F. Hittel.',
    source: `Baltimore City marriage licence 5549 and Baltimore Catholic parish marriage register, 1945. ${shared('cmfrank63', '28 Jun 2017', QUINN)}`,
    people: ['charles_buckey_mckeldin', 'emily_schrieffer_mckeldin', 'mckeldin_charles_i', 'emma_bell_mckeldin', 'schriefer_george_goode', 'ethel_quinn_schriefer'],
    pages: ['ancestry_mckeldin_poehlman_1945_license.jpg', 'ancestry_mckeldin_poehlman_1945_church.jpg'],
  },
];
const cfg = JSON.parse(fs.readFileSync(MEDIA, 'utf8'));
for (const it of items) {
  const i = cfg.items.findIndex(x => x.id === it.id);
  if (i >= 0) cfg.items[i] = it; else cfg.items.push(it);
}
fs.writeFileSync(MEDIA, JSON.stringify(cfg, null, 2) + '\n');

// ── what the records say ────────────────────────────────────────────────────
const IMG = t => `Record image on Ancestry.com, ${t}`;
edit('forester_charles_elmer', IMG('marriage notice, 4 Nov 1896 (Cox Family Tree)'), p => note(p, 'His marriage to Addie May Burch took place at the home of Jonas Eglekraut in Clear Lake Township, Steuben County, Indiana, performed by the Rev. J. W. Martin (newspaper notice, 4 Nov 1896).'));
edit('forester_glenn_c', IMG('Jackson County, Michigan, marriage register, 1917 (Cox Family Tree)'), p => note(p, 'At his marriage on 3 Nov 1917 at Jackson, Michigan, he was 20, a mechanic, living in Jackson; the Rev. William H. Shannon officiated.'));
edit('borton_ruth_trilby', IMG('Jackson County, Michigan, marriage register, 1917 (Cox Family Tree)'), p => note(p, 'Born at Ray, Indiana, daughter of Charles Borton and Elberta (Nora Alberta) Baker; aged 21, living in Jackson, when she married Glenn Forester on 3 Nov 1917.'));
for (const id of ['schriefer_george_goode', 'ethel_quinn_schriefer']) edit(id, IMG('Howard County, Maryland, marriage return, 1920 (Quinn Family Tree)'), p => note(p, 'George Schriefer (21, B&O Railroad) and Ethel Quinn (20), both of Baltimore, were married on 12 Jul 1920 at St. Paul\'s Church, Ellicott City, Howard County, by the Rev. Michael A. Ryan.'));
edit('poleman_jack', IMG('Baltimore Catholic parish marriage register, 1941 (Quinn Family Tree)'), p => note(p, 'The 1941 church marriage register gives him as Jack Hetrick Poehlman of Mount Rainier, Maryland, son of John Poehlman and Beulah, a Lutheran. He and Emily married in September 1941.'));
edit('emily_schrieffer_mckeldin', IMG('Baltimore City marriage licence 5549 and parish marriage register, 1945 (Quinn Family Tree)'), p => {
  note(p, 'She married Charles E. McKeldin on 2 Nov 1945 in Baltimore, aged 24, a widow, living at 334 E. 21st Street (marriage licence 5549). The church register gives her baptism as 20 Feb 1921 at St. John\'s.');
});
edit('charles_buckey_mckeldin', IMG('Baltimore City marriage licence 5549 and parish marriage register, 1945 (Quinn Family Tree)'), p => {
  note(p, 'He married Emily M. Poehlman on 2 Nov 1945 in Baltimore, aged 28, a machinist, of 1143 Carroll Street; his brother William A. McKeldin was a witness. The church register gives his own baptism as 10 Oct 1945.');
});

// ── Rhea Dradie Simons ──────────────────────────────────────────────────────
const KTREE = 'Ancestry.com, public member tree "Kulp-Ritchey-Dorsett Family Tree" (tree 4662169)';
const OB_ELAINE = 'Obituary of Elaine Upham, Tri-City Herald, 14 Aug 2011 (transcribed on Find a Grave, memorial 75368477)';
if (!exists('simons_rhea_dradie')) save(blank('simons_rhea_dradie', 'Rhea Dradie Simons', 'F'));
edit('simons_rhea_dradie', [KTREE, OB_ELAINE], p => {
  p.birth = p.birth || '19 Sep 1916'; p.death = p.death || '19 Sep 1916';
  add(p.locations, 'Milton, Oregon');
  p.relationships.father = 'simons_raymond_zell'; p.relationships.mother = 'kulp_dradie_ellen';
  note(p, 'First child of Ray and Dradie (Kulp) Simons; born and died on 19 Sep 1916 at Milton (Kulp-Ritchey-Dorsett Family Tree). She is the second sister who, with Beryl, predeceased Elaine, according to Elaine\'s 2011 obituary.');
});
for (const id of ['simons_raymond_zell', 'kulp_dradie_ellen']) edit(id, [], p => add(p.relationships.children, 'simons_rhea_dradie'));
edit('simons_raymond_zell', [], p => { p.notes = p.notes.filter(t => !t.startsWith('Elaine\'s 2011 obituary says she was preceded in death by two sisters.')); });

// ── Elmer's wives ───────────────────────────────────────────────────────────
if (!exists('hardy_wilma')) save(blank('hardy_wilma', 'Wilma K. Hardy (Simons)', 'F'));
edit('hardy_wilma', KTREE, p => {
  p.birth = p.birth || '30 Mar 1924'; p.death = p.death || '10 Aug 1989';
  for (const l of ['Chadron, Dawes County, Nebraska', 'Franklin County, Washington']) add(p.locations, l);
  add(p.aliases, 'Wilma Simons');
  add(p.milestones, 'Married Raymond Elmer Simons (m. 30 Aug 1947)');
  p.relationships.spouse = 'simons_raymond_elmer';
  for (const c of ['simons_carl_ray', 'simons_debra_sue']) add(p.relationships.children, c);
  note(p, 'Born 30 Mar 1924 at Chadron, Nebraska; married Elmer Simons on 30 Aug 1947 in Franklin County, Washington; died 10 Aug 1989 in Franklin County (Kulp-Ritchey-Dorsett Family Tree). She and Elmer adopted Carl Ray (1954) and Debra Sue; Carl Ray\'s 2025 obituary names his parents as Wilma and Elmer.');
});
edit('simons_betty', KTREE, p => {
  if (p.name === 'Betty Simons') { add(p.aliases, p.name); p.name = 'Beatrice Lee “Bette” Jones (Barton, Simons)'; }
  for (const a of ['Bette Simons', 'Beatrice Lee Jones Barton']) add(p.aliases, a);
  p.birth = p.birth || '1921'; p.death = p.death || '1995';
  add(p.milestones, 'Married Raymond Elmer Simons (m. 10 Nov 1969)');
  p.notes = p.notes.filter(t => !/^Carl Ray Simons's 2025 obituary names his mother as Wilma, not Betty/.test(t) && t !== 'Wife of Raymond Elmer ("Elmer") Simons. Maiden name not recorded.');
  note(p, 'Beatrice Lee "Bette" Jones (1921–1995), earlier Mrs. Barton, was Elmer Simons\'s second wife: they married on 10 Nov 1969 at Pasco, and the tree records a second marriage about 1980 (Kulp-Ritchey-Dorsett Family Tree). His first wife was Wilma K. Hardy.');
  note(p, 'CORRECTION 2026-09-24: Carl Ray and Debra Sue were adopted by Elmer and his first wife, Wilma (Hardy); Bette was their stepmother. Carl Ray\'s 2025 obituary names his parents as Wilma and Elmer, and the tree dates Elmer\'s marriage to Bette to 1969.');
  p.relationships.children = p.relationships.children.filter(c => !['simons_carl_ray', 'simons_debra_sue'].includes(c));
});
for (const c of ['simons_carl_ray', 'simons_debra_sue']) edit(c, KTREE, p => {
  p.relationships.mother = 'hardy_wilma';
  p.notes = p.notes.map(t => t === 'Adopted by Elmer and Betty Simons.' ? 'Adopted by Elmer and Wilma (Hardy) Simons; Elmer\'s second wife, Bette, was a stepmother.' : t);
});
edit('simons_raymond_elmer', KTREE, p => {
  const r = p.relationships;
  if (r.spouse === 'simons_betty') r.spouse = 'hardy_wilma';
  r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, 'simons_betty');
  r._extra_spouses = r._extra_spouses.filter(x => x !== r.spouse);
  if (p.death === '1994') p.death = '26 Apr 1994';
  add(p.milestones, 'Married Wilma K. Hardy (m. 30 Aug 1947)');
  add(p.milestones, 'Married Beatrice Lee “Bette” Jones (m. 10 Nov 1969)');
  add(p.locations, 'Pasco, Washington');
  note(p, 'Married Wilma K. Hardy on 30 Aug 1947 in Franklin County and Beatrice "Bette" Jones on 10 Nov 1969 at Pasco. Died 26 Apr 1994 at Pasco; buried at Kennewick (Kulp-Ritchey-Dorsett Family Tree).');
});
console.log('Tree photos and record images added; Rhea and Wilma recorded');
