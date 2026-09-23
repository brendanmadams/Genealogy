#!/usr/bin/env node
/**
 * 2026-09-23, from "Barbara McKeldin Adams - A Memoir" and Brendan Adams. Run
 * after import-barbara-memoir-2026-09-23.js. Re-runnable.
 *  1. Buckey McKeldin's siblings, as Barbara gives them: Lola (already in),
 *     Lillian, Helen, Emma and William "Billy". Emily Schriefer's brothers
 *     Kenneth and George. Estimated births for Emily and Ethel.
 *  2. Corrections: "Uncle Hims" came from Chuck's daughter Jenny (confirmed
 *     by Brendan), not Camille Remy; Aunt Pat Quinn was a woman; the Meridian
 *     cross-burning detail; Alaska cruise 1993. Notes on the engagement dates,
 *     the Hawaii count and the "Edward" hint.
 *  3. From Brendan: Bern (Aunt Joan Quinn's partner), Mark Stang's family,
 *     Beryl's second husband Bob, and birth dates and new people in the
 *     Adams, Olson and Falde families.
 */
'use strict';
const { exists, load, save, note } = require('./lib/records');
const MEM = 'Barbara McKeldin Adams, "Barbara McKeldin Adams - A Memoir" (privately printed)';
const BA = 'Brendan Adams (personal knowledge), 2026';
const L = (...n) => ` [Barbara McKeldin Adams, A Memoir, text line ${n.join(', ')}]`;
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, src) => ({ id, name, birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [src], notes: [], aliases: [] });
function edit(id, fn, src) { const p = load(id); for (const k of ['milestones', 'locations', 'notes', 'sources', 'aliases', 'career', 'education', 'notable_stories', 'childhood_experience']) p[k] = p[k] || []; fn(p); if (src) add(p.sources, src); save(p); return p; }
function person(id, name, src, o = {}) {
  if (!exists(id)) save(blank(id, name, src));
  return edit(id, p => {
    for (const k of ['birth', 'death']) if (o[k] && !p[k]) p[k] = o[k];
    for (const k of ['aliases', 'locations', 'milestones', 'career', 'notable_stories']) for (const v of o[k] || []) add(p[k], v);
    for (const v of o.notes || []) note(p, v);
  }, src);
}
const child = (kid, father, mother) => {
  edit(kid, p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; });
  for (const par of [father, mother].filter(Boolean)) edit(par, p => add(p.relationships.children, kid));
};
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };
/** Set a birth or death, replacing a less exact value and noting what it was. */
function setDate(id, field, value, src) {
  edit(id, p => {
    if (p[field] === value) return;
    if (p[field] && p[field].startsWith(value + ' ')) return;   // already more exact (a later year was added)
    if (p[field]) note(p, `CORRECTION 2026-09-23: ${field === 'birth' ? 'Birth' : 'Death'} changed from "${p[field]}" to "${value}", per ${src.startsWith('Brendan') ? 'Brendan Adams' : src}.`);
    p[field] = value;
  }, src);
}
const strip = (p, re) => { for (const k of ['milestones', 'notes', 'notable_stories', 'childhood_experience', 'personality', 'roles']) if (Array.isArray(p[k])) p[k] = p[k].filter(t => typeof t !== 'string' || !re.test(t)); };

// ── 1. McKeldin and Schriefer families ────────────────────────────────────
edit('charles_buckey_mckeldin', p => {
  const had = p.notes.some(t => /^Lola\/Lillian\/Helen\/Emma\/Billy correction/.test(t));
  strip(p, /^Lola\/Lillian\/Helen\/Emma\/Billy correction/);
  if (had) note(p, `CORRECTION 2026-09-23: Lola, Lillian, Helen, Emma and William "Billy" are his sisters and brother, as his daughter Barbara states twice in her memoir, not Charles E. McKeldin I's siblings as an earlier note suggested. (Charles E. I also had a sister Lillian and a brother William, which likely caused the mix-up.)${L(392, 4153)}`);
  note(p, `Barbara lists "Edward, after my father" among possible names for her son Brian, which suggests the E. in his name stood for Edward (not confirmed).${L(1591)}`);
}, MEM);
const SIBS = [['mckeldin_lillian_buckey', 'Lillian McKeldin', 'The family diva, per her niece Barbara.'], ['mckeldin_helen_buckey', 'Helen McKeldin', 'One of the aunts who called Barbara "Babs".'], ['mckeldin_emma_buckey', 'Emma McKeldin', 'One of the sisters who called their brother "Buckey".'], ['mckeldin_william_billy', 'William “Billy” McKeldin', 'His sisters called him Billy or Bill.']];
for (const [id, name, t] of SIBS) {
  person(id, name, MEM, { aliases: id === 'mckeldin_william_billy' ? ['Billy McKeldin', 'Bill McKeldin', 'Uncle William'] : [], notes: [`${id === 'mckeldin_william_billy' ? 'Brother' : 'Sister'} of Charles "Buckey" McKeldin, named in his daughter Barbara's memoir; died before she wrote. ${t}${L(392, 4153)}`] });
  child(id, 'mckeldin_charles_i', 'emma_bell_mckeldin');
}
for (const [id, name] of [['schriefer_kenneth', 'Kenneth Schriefer'], ['schriefer_george_jr', 'George Schriefer Jr.']]) {
  person(id, name, MEM, { notes: [`Son of George "Goode" and Ethel (Quinn) Schriefer; brother of Emily Schriefer McKeldin, shown with her and their mother in a family photo.${L(284)}`] });
  child(id, 'schriefer_george_goode', 'ethel_quinn_schriefer');
}
edit('emily_schrieffer_mckeldin', p => { if (!p.birth) p.birth = 'abt 1914'; note(p, `Birth estimated: Barbara says her mother died at 36 (she died 24 Oct 1950).${L(4157)}`); }, MEM);
edit('ethel_quinn_schriefer', p => { if (!p.birth) p.birth = 'abt 1890'; note(p, `Birth estimated: Barbara says her grandmother died in her early sixties (she died 12 Apr 1952).${L(4158)}`); }, MEM);

// ── 2. Corrections ────────────────────────────────────────────────────────
edit('camille_remy', p => {
  const had = [...p.notable_stories, ...p.childhood_experience, ...p.notes, ...p.milestones].some(t => /Hims/.test(t));
  strip(p, /Hims/);
  if (had) note(p, 'CORRECTION 2026-09-23: Removed the "Uncle Hims" story; it was Chuck McKeldin’s daughter Jenny who gave John Adams that nickname, per Barbara’s memoir and Brendan Adams.');
});
edit('jennifer_mckeldin', p => { add(p.aliases, 'Jenny'); }, MEM);
edit('quinn_pat', p => {
  p.notes = p.notes.map(t => t === 'Pat Quinn, teenager in ~1952. Child of John Joseph Quinn and Marie Ellinghaus Quinn. Sex unknown per source.' ? 'Pat Quinn, a teenager in about 1952; daughter of John Joseph Quinn and Marie Ellinghaus Quinn. Barbara calls her "Aunt Pat".' : t);
}, MEM);
edit('barbara_mckeldin_adams', p => {
  p.milestones = p.milestones.map(t => t === '1972: Son Brian born in Meridian MS. KKK active in Meridian — woke up to crosses visible on front lawns.' ? '1972: Son Brian born in Meridian, MS. The Klan was active in Meridian: before they moved in, the Klan had burned a cross on the front lawn of a Jewish couple, who then traded apartments with John and Barbara.' : t);
  add(p.milestones, '1993: Alaska cruise with John, her father and stepmother (Granny and Pops) and Nana (Beryl) and Bob');
  note(p, `Sources disagree on the number of Hawaii trips: Barbara thinks eight; John says about ten.${L(3952)}`);
  note(p, `Barbara recalls surviving Hurricane Camille in Beeville, Texas, but Camille struck in August 1969, before their January 1970 wedding. The storm they lived through in Beeville in 1970 was most likely Hurricane Celia (August 1970).${L(1302, 2377)}`);
}, MEM);
edit('john_howard_adams', p => {
  add(p.milestones, '1993: Alaska cruise with Barbara, her father and stepmother, and his mother Beryl and her husband Bob');
  note(p, `Sources disagree on the engagement: John's record says the ring was presented in Nov 1968; Barbara writes that they first talked about marriage at the Army-Navy weekend at the end of Nov 1968 and went diamond shopping in Annapolis in Feb 1969.${L(1251)}`);
  note(p, 'The Alaska trip in the list of trips taken since retiring was earlier: Barbara dates their Alaska cruise to 1993.');
}, MEM);

// ── 3. From Brendan ───────────────────────────────────────────────────────
person('stang_bern', 'Bern Stang', BA, { birth: 'abt 1931', notes: ['Husband of Aunt Joan Quinn, and father of Mark Stang (per Brendan Adams). He turned 90 in 2021 and was then the last living member of Barbara’s parents’ generation; she texted him several times a year.' + L(3324)] });
edit('stang_bern', p => {}, MEM);
wed('quinn_joan', 'stang_bern');
person('stang_mark', 'Mark Stang', BA, { notes: ['Son of Bern and Joan (Quinn) Stang, a cousin of Barbara McKeldin Adams: Joan was the sister of Barbara’s stepmother, Peggy (Quinn) McKeldin (per Brendan Adams). Barbara made his son Kevin a teddy-bear tie quilt, which Mark said Kevin carried everywhere like Linus’s blanket.' + L(3389)] });
person('perusek_dawn', 'Dawn Perusek (Stang)', BA, { birth: '23 Jun', aliases: ['Dawn Stang'], notes: ['Wife of Mark Stang.'] });
wed('stang_mark', 'perusek_dawn');
child('stang_mark', 'stang_bern', 'quinn_joan');
edit('quinn_joan', p => { if (p.name === 'Joan Quinn') p.name = 'Joan Quinn (Stang)'; add(p.aliases, 'Joan Stang'); add(p.aliases, 'Joan Hogan'); note(p, `Wife of Bern Stang and mother of Mark Stang (per Brendan Adams). Barbara calls her "my aunt Joan Hogan" in one passage, which may point to an earlier marriage.${L(540)}`); }, BA);
for (const [id, name] of [['stang_kevin', 'Kevin Stang'], ['stang_emily', 'Emily Stang']]) { person(id, name, BA, {}); child(id, 'stang_mark', 'perusek_dawn'); }
person('bob_beryl', 'Bob', BA, { death: 'bef 1 Aug 1998', notes: ['Second husband of Beryl Simons Adams, whom he married after George Francis Adams Sr.’s death in 1980; they lived on a golf course in Olympia, Washington. He died before Beryl (1 Aug 1998).', 'Went with Beryl on the 1993 Alaska cruise with John and Barbara Adams and Barbara’s father and stepmother.' + L(3677)], locations: ['Olympia, Washington'] });
edit('bob_beryl', p => {
  if (p.name === 'Bob') p.name = 'Bob Shriver';
  note(p, 'Surname Shriver per Brendan Adams, who is fairly but not entirely sure of it.');
}, MEM);
// Brendan Falde's death (Brendan Adams)
setDate('falde_brendan', 'death', '12 Nov 2020', BA);
edit('falde_brendan', p => { add(p.milestones, 'Died 12 Nov 2020, in a car accident'); p.notes = p.notes.map(t => t.replace(' Deceased; dates not recorded.', '')); }, BA);
// Mark Stang: web research, 2026-09-23 (not conclusive)
edit('stang_mark', p => {
  add(p.locations, 'Allentown, Pennsylvania');
  note(p, 'Research lead: the 2004 Morning Call obituary of Justin Kyle Stang (18, of South Whitehall Township, died 7 Feb 2004) names his parents John Q. and Darlene A. (Gayhardt) Stang, and a Kevin Stang wrote in its guestbook to his "big cousin". John Q. Stang appears as John Quinn Stang in Allentown. So John is probably Mark’s brother, another son of Bern and Joan (Quinn) Stang; Barbara lists both a John and a Quinn among her cousins. Not confirmed. [Legacy.com, Justin Stang obituary, Morning Call, Feb 2004]');
}, 'Web research by Claude for Brendan Adams, 2026-09-23 (Legacy.com; people-search listing)');
wed('beryl_simons_adams', 'bob_beryl');
edit('beryl_simons_adams', p => { p.milestones = p.milestones.filter(t => !/^Married Bob/.test(t)); add(p.milestones, 'Married Bob Shriver (m. after 1980); they lived on a golf course in Olympia, Washington'); add(p.locations, 'Olympia, Washington'); }, BA);

// Adams grandchildren
setDate('ethan_adams', 'birth', '5 Aug 2002', BA);
person('rae_mae', 'Rae Mae Adams', BA, { milestones: ['Married Ethan Adams (m. 25 Apr 2026)'] });
edit('ethan_adams', p => add(p.milestones, 'Married Rae Mae (m. 25 Apr 2026)'), BA);
wed('ethan_adams', 'rae_mae');
setDate('gabrielle_adams', 'birth', '8 Apr 2004', BA); edit('gabrielle_adams', p => add(p.aliases, 'Elly Adams'), BA);
setDate('lauren_adams', 'birth', '13 Mar 2007', BA);
setDate('gavin_adams', 'birth', '19 Aug 2009', BA); edit('gavin_adams', p => add(p.aliases, 'Gavinator'), MEM);
setDate('michelle_ellis_adams', 'birth', '12 Sep', BA);

// Olson and Falde families
setDate('olson_tom_umpa', 'birth', '10 Nov', BA);
setDate('olson_tom', 'birth', '31 Jan', BA);
setDate('olson_sigrid', 'birth', '26 Jun', BA);
setDate('olson_nels', 'birth', '28 Aug 1976', BA);
setDate('olson_kari', 'birth', '28 Oct 1981', BA);
setDate('falde_brendan', 'birth', '26 Sep 1973', BA);
person('rosgen_john', 'John Rosgen', BA, { birth: '3 Mar', aliases: ['John Rosegen'], milestones: ['Married Kari Olson (m. 7 Jan 2012)'] });
edit('olson_kari', p => add(p.milestones, 'Married John Rosgen (m. 7 Jan 2012)'), BA);
wed('olson_kari', 'rosgen_john');
person('olson_eddy_orlando', 'Eddy Orlando Olson', BA, { birth: '24 Jan 2019' });
child('olson_eddy_orlando', 'rosgen_john', 'olson_kari');
person('kirk_faith', 'Faith Kirk (Olson)', BA, { birth: '2 Mar', aliases: ['Faith Olson'] });
wed('olson_nels', 'kirk_faith');
person('olson_mirabelle', 'Mirabelle Olson', BA, { birth: '12 Mar 2014' });
child('olson_mirabelle', 'olson_nels', 'kirk_faith');
person('falde_mary', 'Mary Falde', BA, { birth: '17 Jun', notes: ['Mother of Randy and Robin Falde.'] });
person('falde_robin', 'Robin Falde', BA, { birth: '22 Aug', notes: ['Sister of Randy Falde.'] });
for (const k of ['falde_randy', 'falde_robin']) child(k, null, 'falde_mary');
console.log('Barbara memoir decisions and Brendan’s additions applied');
