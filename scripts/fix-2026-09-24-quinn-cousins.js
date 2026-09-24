#!/usr/bin/env node
/**
 * 2026-09-24, Barbara's Quinn-side cousins, from obituaries (Baltimore Sun
 * and Morning Call, via Legacy.com) and the 1940 census. Re-runnable.
 *  - John J. Quinn Jr. married Joan Patricia Hogan (Barbara's "aunt Joan
 *    Hogan"); children John J. (died before 2013), Sharon (Comes), Joan
 *    "Joanie" (Galbreath) and Matthew.
 *  - Pat Quinn's children: Christopher, Patrick and Kelly Gilden (by an
 *    earlier Gilden marriage), Amanda Revty and the late Mark Revty.
 *  - Joan and Bern Stang's son John Quinn Stang, his wife Darlene Gayhardt,
 *    and their children Justin Kyle (1985–2004) and Katelyn.
 *  - Bernard J. Stang Jr.'s parents Bernard and Catherine Stang (1940 census).
 * Living people get names and relationships only.
 */
'use strict';
const { exists, load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, ...(sex ? { sex } : {}), birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
function edit(id, src, fn) { const p = load(id); for (const k of ['milestones', 'notes', 'sources', 'aliases', 'locations', 'career']) p[k] = p[k] || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); }
const person = (id, name, sex, src, fn = () => {}) => { if (!exists(id)) save(blank(id, name, sex)); edit(id, src, fn); };
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, [], p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };
const child = (kid, father, mother) => {
  edit(kid, [], p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; });
  for (const par of [father, mother].filter(Boolean)) edit(par, [], p => add(p.relationships.children, kid));
};
const rename = (p, from, to) => { if (from.includes(p.name)) { add(p.aliases, p.name); p.name = to; } };

const OB_JQ = 'Obituary of John J. Quinn Jr., Baltimore Sun, 19 May 2013 (Legacy.com)';
const OB_PR = 'Obituary of Patricia Marie Revty, Baltimore Sun, 26 Nov 2009 (Legacy.com)';
const OB_JS = 'Obituary of Justin Kyle Stang, Morning Call, Allentown, Feb 2004 (Legacy.com)';
const C1940 = 'Ancestry.com, 1940 United States Federal Census';
const BM = 'Barbara McKeldin Adams, "Barbara McKeldin Adams - A Memoir" (privately printed)';
const COUSIN = 'A first cousin of Barbara McKeldin Adams through her stepmother Peggy (Quinn) McKeldin; Barbara names the cousins Quinn, Tommy, Mark, Tim, Michael, Sharon, John, Joanie, Matthew, Billy and Bobbie. [Barbara McKeldin Adams, A Memoir, text line 413]';

// John J. Quinn Jr.'s family
edit('quinn_john_jr', OB_JQ, p => {
  add(p.career, 'Retired Associate Director, Maryland Department of Assessments and Taxation.');
  add(p.milestones, 'Married Joan Patricia Hogan');
  note(p, 'Born and raised in Baltimore; graduated from the Shrine of the Little Flower school, Calvert Hall College and Loyola College (business administration); moved to Forest Hill, Harford County, in 1969; a member of St Ignatius Church, Hickory. Married Joan Patricia Hogan for over 50 years until her death in 2009. Survived by his children Sharon (Comes), Joan (Galbreath) and Matthew, four grandchildren, and his sister Catherine Joan Stang; predeceased by his son John J. Quinn.');
});
person('hogan_joan_patricia', 'Joan Patricia Hogan (Quinn)', 'F', [OB_JQ, OB_PR, BM], p => {
  if (!p.death) p.death = '2009';
  add(p.aliases, 'Joan Quinn'); add(p.aliases, 'Joan Hogan');
  add(p.milestones, 'Married John Joseph Quinn Jr.');
  note(p, 'Wife of John Joseph Quinn Jr. for over 50 years; died in 2009. She is the "aunt Joan Hogan" of Barbara McKeldin Adams\'s memoir, who went to college with Barbara\'s fifth-grade teacher, Mrs. Cronin. [Barbara McKeldin Adams, A Memoir, text line 540]');
});
wed('quinn_john_jr', 'hogan_joan_patricia');
const kid = (id, name, sex, src, fn = () => {}, father = 'quinn_john_jr', mother = 'hogan_joan_patricia') => {
  person(id, name, sex, src, p => { note(p, COUSIN); fn(p); });
  child(id, father, mother);
};
kid('quinn_john_j_3', 'John J. Quinn', 'M', [OB_JQ, BM], p => { if (!p.death) p.death = 'before 2013'; note(p, 'Son of John J. Quinn Jr. and Joan (Hogan) Quinn; he died before his father (2013).'); });
kid('quinn_sharon', 'Sharon Quinn (Comes)', 'F', [OB_JQ, BM], p => { add(p.aliases, 'Sharon Comes'); note(p, 'Married Dan Comes; they live in Bel Air, Maryland. Barbara, ten years older, calls her the nearest in age of her girl cousins. [Barbara McKeldin Adams, A Memoir, text line 949]'); });
kid('quinn_joan_galbreath', 'Joan “Joanie” Quinn (Galbreath)', 'F', [OB_JQ, BM], p => { add(p.aliases, 'Joan Galbreath'); add(p.aliases, 'Joanie Quinn'); note(p, 'Married Brian Galbreath, a dairy farmer at Street, Maryland. Barbara sent her a tie quilt of cows for her firstborn. [Barbara McKeldin Adams, A Memoir, text line 3387]'); });
kid('quinn_matthew', 'Matthew Quinn', 'M', [OB_JQ, BM], p => note(p, 'Of Forest Hill, Maryland. A Billy Joel fan; his cousins took him to Billy Joel\'s concerts. [Barbara McKeldin Adams, A Memoir, text line 3015]'));

// Pat Quinn's children
edit('quinn_pat', OB_PR, p => note(p, 'Her obituary names her children Christopher, Patrick and Kelly Gilden (by an earlier marriage to a Gilden), Amanda Revty and the late Mark Revty, and her stepdaughter Sharon Helmly.'));
person('gilden_unknown', '(Unknown) Gilden', 'M', OB_PR, p => note(p, 'Placeholder for the first husband of Patricia Marie Quinn and father of her Gilden children; his first name is not recorded.'));
wed('quinn_pat', 'gilden_unknown');
for (const [id, name, sex] of [['gilden_christopher', 'Christopher Gilden', 'M'], ['gilden_patrick', 'Patrick Gilden', 'M'], ['gilden_kelly', 'Kelly Gilden', '']]) {
  person(id, name, sex, OB_PR, p => note(p, 'Child of Patricia Marie (Quinn) Revty and her first husband, a Gilden.'));
  child(id, 'gilden_unknown', 'quinn_pat');
}
person('revty_amanda', 'Amanda Revty', 'F', OB_PR, p => note(p, 'Daughter of Walter G. and Patricia (Quinn) Revty.'));
child('revty_amanda', 'revty_walter_g', 'quinn_pat');
person('revty_mark', 'Mark Revty', 'M', OB_PR, p => { if (!p.death) p.death = 'before 2009'; note(p, 'Son of Walter G. and Patricia (Quinn) Revty; he died before his mother (2009). His wife was Robin Revty, and they had a son, Mark.'); });
child('revty_mark', 'revty_walter_g', 'quinn_pat');

// John Quinn Stang's family
person('stang_john_quinn', 'John Quinn Stang', 'M', [OB_JS, BM], p => {
  add(p.aliases, 'John Q. Stang'); add(p.aliases, 'Quinn Stang');
  add(p.locations, 'South Whitehall Township, Lehigh County, Pennsylvania');
  add(p.milestones, 'Married Darlene A. Gayhardt');
  note(p, 'Son of Bernard J. and Catherine Joan (Quinn) Stang: his son Justin\'s 2004 obituary names Bernard J. and Catherine J. (Quinn) Stang as Justin\'s paternal grandparents. Possibly the cousin "Quinn" of Barbara\'s memoir, who is listed separately from a cousin John. [Barbara McKeldin Adams, A Memoir, text line 413]');
});
child('stang_john_quinn', 'stang_bern', 'quinn_joan');
person('gayhardt_darlene', 'Darlene A. Gayhardt (Stang)', 'F', OB_JS, p => { add(p.aliases, 'Darlene Stang'); add(p.milestones, 'Married John Quinn Stang'); note(p, 'Wife of John Quinn Stang; her mother was Mary R. Gayhardt of Berlin, Maryland (2004).'); });
wed('stang_john_quinn', 'gayhardt_darlene');
person('stang_justin_kyle', 'Justin Kyle Stang', 'M', OB_JS, p => {
  p.birth = p.birth || '1985'; p.death = p.death || '7 Feb 2004';
  add(p.aliases, 'Kyle Stang');
  add(p.locations, 'South Whitehall Township, Lehigh County, Pennsylvania');
  note(p, 'Died 7 Feb 2004, aged 18, in a car accident in South Whitehall Township. A senior at Parkland High School, where he played varsity soccer and belonged to the National Honor Society and Spanish Club; a member of St Joseph the Worker Church, Orefield.');
});
child('stang_justin_kyle', 'stang_john_quinn', 'gayhardt_darlene');
person('stang_katelyn', 'Katelyn B. Stang', 'F', OB_JS, p => note(p, 'Daughter of John Quinn and Darlene (Gayhardt) Stang; sister of Justin Kyle Stang.'));
child('stang_katelyn', 'stang_john_quinn', 'gayhardt_darlene');
edit('stang_mark', [], p => add(p.relationships.siblings, 'stang_john_quinn'));
edit('stang_john_quinn', [], p => add(p.relationships.siblings, 'stang_mark'));

// Bernard J. Stang Jr. and his parents
edit('stang_bern', [C1940, OB_JS], p => {
  rename(p, ['Bernard J. Stang'], 'Bernard J. Stang Jr.');
  add(p.aliases, 'Bernard J. Stang');
  for (const l of ['Baltimore, Maryland', 'Sparta, New Jersey', 'Easton, Pennsylvania']) add(p.locations, l);
  note(p, 'Aged 9 in the 1940 census as Bernard J. Stang Jr., living with his parents Bernard and Catherine Stang and his sister Bernice and brother William at 3020 Clifton Park Terrace, Baltimore.');
});
person('stang_bernard_sr', 'Bernard Stang', 'M', C1940, p => { p.birth = p.birth || 'abt 1892'; add(p.aliases, 'Bernard Stang Sr.'); add(p.locations, 'Baltimore, Maryland'); note(p, 'Aged 48 in the 1940 census at 3020 Clifton Park Terrace, Baltimore, with his wife Catherine and children Bernice (24), William (19) and Bernard Jr. (9).'); });
person('stang_catherine', 'Catherine Stang', 'F', C1940, p => { p.birth = p.birth || 'abt 1893'; add(p.locations, 'Baltimore, Maryland'); note(p, 'Aged 47 in the 1940 census, wife of Bernard Stang; her birth surname is not recorded.'); });
wed('stang_bernard_sr', 'stang_catherine');
child('stang_bern', 'stang_bernard_sr', 'stang_catherine');
console.log('Quinn cousins and Stangs applied');
// "Died before 2021" (from the memoir import) is superseded where a death date is now known
for (const id of ['quinn_joan', 'quinn_pat', 'quinn_john_jr', 'quinn_marie_ellinghaus', 'margaret_peggy_mckeldin']) {
  if (!exists(id)) continue;
  edit(id, [], p => { if (/\d{4}/.test(p.death || '')) p.milestones = p.milestones.filter(t => t !== 'Died before 2021'); });
}
