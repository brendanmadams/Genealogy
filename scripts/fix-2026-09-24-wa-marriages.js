#!/usr/bin/env node
/**
 * 2026-09-24, Washington State marriage records (Washington State Archives,
 * Digital Archives: county marriage records and the Department of Health
 * marriage index) for Ray and Dradie Simons's grandchildren's generation.
 * Re-runnable. The index gives names, dates and counties but not parents,
 * so matches that rest on name and place alone are marked "probably".
 *  - Glen married Mary Patricia Walker (1958); Steve married Penny M. Parker
 *    (1977); Les, Billy and Janine's marriages; Amanda Simons married
 *    Christopher Bradley Knight (2018), so she is the "Amanda Knight" DNA
 *    match, and the two records are merged.
 *  - Leads only: Judith A. Simons's 1979 and 1983 Benton County marriages,
 *    and Ryan Howard and Chad Alan Armatrout as possible sons.
 */
'use strict';
const fs = require('fs');
const { exists, load, save, note, file, rename: move } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
function edit(id, src, fn) { const p = load(id); for (const k of ['milestones', 'notes', 'sources', 'aliases', 'locations', 'career', 'education']) p[k] = p[k] || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); }
const rename = (p, from, to) => { if (from.includes(p.name)) { add(p.aliases, p.name); p.name = to; } };
const WA = c => `Washington State Archives, Digital Archives, ${c}`;
const FRANKLIN = WA('Franklin County Auditor, Marriage Records, 1889-2026');
const BENTON_C = WA('Benton County Auditor, Marriage Certificates, 1905-1995');
const BENTON_R = WA('Benton County Auditor, Marriage Records, 1987-2026');
const DOH = WA('Department of Health, Marriage Index, 1969-2022');

// Glen and Mary
edit('simons_mary', FRANKLIN, p => {
  rename(p, ['Mary Simons'], 'Mary Patricia Walker (Simons)');
  p.notes = p.notes.map(t => t === 'Wife of Glen Simons. Maiden name not recorded.' ? 'Wife of Glen Simons.' : t);
  add(p.milestones, 'Married Glen E. Simons (m. 27 Jul 1958)');
  note(p, 'Born Mary Patricia Walker; she married Glen E. Simons on 27 Jul 1958 in Franklin County, Washington (recorded 29 Jul 1958).');
});
edit('simons_glen', FRANKLIN, p => { add(p.aliases, 'Glen E. Simons'); add(p.milestones, 'Married Mary Patricia Walker (m. 27 Jul 1958)'); });

// Steve and Penny
edit('simons_penny', BENTON_C, p => {
  rename(p, ['Penny Simons'], 'Penny M. Parker (Simons)');
  p.notes = p.notes.map(t => t === 'Wife of Steve Simons. Maiden name not recorded.' ? 'Wife of Steve Simons.' : t);
  add(p.milestones, 'Married Steve H. Simons (m. 31 Dec 1977)');
  note(p, 'Born Penny M. Parker; she married Steve H. Simons on 31 Dec 1977 in Benton County, Washington.');
});
edit('simons_steve', BENTON_C, p => { add(p.aliases, 'Steve H. Simons'); add(p.milestones, 'Married Penny M. Parker (m. 31 Dec 1977)'); });

// Judy: leads only
edit('simons_judy', [BENTON_C, BENTON_R], p => {
  note(p, 'Probably her: Judith A. Simons married Steven L. Arbogast on 21 Nov 1979 in Benton County, and, as Judith A. Arbogast, Jeffrey F. Armatrout in 1983, also in Benton County (county marriage certificates). Neither record names her parents.');
  note(p, 'Lead: Ryan Howard Armatrout (married in Benton County, 2011) and Chad Alan Armatrout (married there in 2010) may be her sons with Jeffrey Armatrout; Ryan\'s middle name would honour her father, Howard. Not confirmed.');
});

// Orval's family
edit('simons_orval_keith', DOH, p => note(p, 'Open question: an Orvel K. Simons married Ruth E. Bates (born Connor) on 12 Mar 1977 in Franklin County (Department of Health marriage index). If this is Orval, he and Irene had divorced before his death in 1979.'));
edit('simons_les', FRANKLIN, p => {
  rename(p, ['Les Simons'], 'Leslie Orvel “Les” Simons');
  add(p.aliases, 'Les Simons');
  add(p.milestones, 'Married Terri Lee Hickman (m. 1976)');
  note(p, 'Leslie Orvel Simons married Terri Lee Hickman in Franklin County (certificate recorded 4 May 1976), before his marriage to Lenore.');
});
edit('simons_billy', BENTON_R, p => {
  rename(p, ['Billy Simons'], 'Billy Michael Simons');
  add(p.aliases, 'Billy Simons');
  add(p.milestones, 'Married LeAnn Robin Collins (m. 2000)');
  add(p.milestones, 'Married Yvette Lavon Johnson (m. 2017)');
  note(p, 'Billy Michael Simons married LeAnn Robin Collins in Benton County (certificate recorded 23 Jun 2000) and applied to marry Yvette Lavon Johnson there on 3 Aug 2017.');
});
if (exists('stan_husband_of_janine_simons')) edit('stan_husband_of_janine_simons', BENTON_C, p => {
  rename(p, ['Stan Bensussen'], 'Stanley James “Stan” Bensussen');
  add(p.aliases, 'Stan Bensussen');
  add(p.milestones, 'Married Janine Simons (m. 4 Sep 1983)');
});
edit('simons_janine', BENTON_C, p => { add(p.milestones, 'Married Stanley James Bensussen (m. 4 Sep 1983)'); note(p, 'She married Stanley James Bensussen on 4 Sep 1983 in Benton County.'); });

// Amanda Simons = the "Amanda Knight" DNA match
if (exists('knight_amanda')) {
  const k = load('knight_amanda');
  edit('simons_amanda', k.sources || [], p => {
    p.notable_stories = p.notable_stories || [];
    for (const s of k.notable_stories || []) add(p.notable_stories, s);
  });
  move('knight_amanda', 'simons_amanda');
}
edit('simons_amanda', FRANKLIN, p => {
  rename(p, ['Amanda Simons'], 'Amanda Marie Simons (Knight)');
  for (const a of ['Amanda Simons', 'Amanda Knight']) add(p.aliases, a);
  p.notes = p.notes.map(t => t === 'Daughter of Billy and Yvette Simons; granddaughter of Orvel and Irene Simons. Married Chris (surname not given).' ? 'Daughter of Billy and Yvette Simons; granddaughter of Orvel and Irene Simons.' : t);
  add(p.milestones, 'Married Christopher Bradley Knight (m. 2018)');
  note(p, 'Amanda Marie Simons applied to marry Christopher Bradley Knight on 28 Sep 2018 in Franklin County. She is the "Amanda Knight" in Brendan\'s 23andMe match list, a great-niece of Glen Simons.');
});

// Elmer's and Carl Ray's children: probable matches
edit('simons_debra_sue', BENTON_R, p => note(p, 'Probably her: Debra Sue Simons applied to marry Michael D. Miller in Benton County on 14 Dec 2001.'));
edit('simons_shawn', BENTON_R, p => note(p, 'Probably him: Shawn R. Simons applied to marry Emily Black in Benton County on 13 Jul 1999.'));

// Sharon: lead only
edit('simons_sharon', [], p => note(p, 'Lead: a Sharon L. Simons married Forrest C. Gill in 1973 in Clark County, where Camas is; not confirmed as her.'));
console.log('Washington marriage records applied');
