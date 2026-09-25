#!/usr/bin/env node
/**
 * 2026-09-25, second pass over Ed Simons's Ancestry tree (tree 189265374):
 * birthplaces, death places and fuller dates our records lacked, for people
 * who have died. Dates go into the fields only where a record confirms them;
 * places and dates that rest on Ed's tree alone are noted as such. Living
 * people are untouched (names and relationships only). Re-runnable.
 */
'use strict';
const { load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const edit = (id, src, fn) => { const p = load(id); p.notes = p.notes || []; p.sources = p.sources || []; p.locations = p.locations || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); };
const ED = 'Ancestry.com, public member tree of Ed Simons (tree 189265374)';
const WADI = 'Ancestry.com, Washington, U.S., Death Records, 1907-2017';
const C1870 = 'Ancestry.com, 1870 United States Federal Census (Northwest, Williams County, Ohio; household of Henry Simons)';

// ── confirmed by the Washington death index ─────────────────────────────────
edit('simons_howard', [WADI, ED], p => {
  if (p.death === 'Sep 1973') p.death = '8 Sep 1973';
  add(p.locations, 'Kennewick, Washington');
  note(p, 'Died 8 Sep 1973, as Byron D. Simons (Washington death records); Ed Simons\'s tree gives the place as Kennewick and his full name as Byron Daniel "Howard" Simons.');
});
edit('george_francis_adams_sr', [WADI, ED], p => { add(p.locations, 'Tacoma, Pierce County, Washington'); note(p, 'Died 11 Oct 1980 at Tacoma, Pierce County (Washington death records).'); });
edit('simons_orval_keith', [WADI, ED], p => { add(p.locations, 'Bellingham, Whatcom County, Washington'); note(p, 'Born 30 Oct 1929 and died 21 Jul 1979 at Spokane (Washington death records, as Orvel K. Simons). Ed Simons\'s tree gives his birthplace as Bellingham.'); });
edit('simons_raymond_elmer', [WADI, ED], p => { add(p.locations, 'Blaine, Whatcom County, Washington'); note(p, 'Born 17 Oct 1921 and died 26 Apr 1994 at Pasco (Washington death records). Ed Simons\'s tree gives his birthplace as Blaine.'); });
edit('kulp_dradie_ellen', [WADI, ED], p => { add(p.locations, 'Blaine, Whatcom County, Washington'); note(p, 'Died 12 Sep 1978 at Pasco (Washington death records). Ed Simons\'s tree gives her birthplace as Blaine, Whatcom County.'); });

// ── from Ed's tree only (noted as such) ─────────────────────────────────────
const TREE_PLACES = [
  ['simons_glen', ['Bellingham, Whatcom County, Washington'], null],
  ['rhinehart_les', ['Lynden, Whatcom County, Washington'], 'Born at Lynden (Ed Simons\'s tree).'],
  ['kulp_edith_sarah', ['Blaine, Whatcom County, Washington', 'Spokane, Washington'], 'Born at Blaine (Ed Simons\'s tree); died at Spokane (Washington death records).'],
  ['kulp_marlan_john', ['Blaine, Whatcom County, Washington', 'Spokane, Washington'], 'Born at Blaine (Ed Simons\'s tree); died at Spokane (Washington death records).'],
  ['kulp_nardin_ira', ['Blaine, Whatcom County, Washington'], 'Born at Blaine (Ed Simons\'s tree).'],
  ['kulp_reta_may', ['Blaine, Whatcom County, Washington', 'Spokane, Washington'], 'Born at Blaine (Ed Simons\'s tree); died at Spokane (Washington death records).'],
  ['kulp_elmer_spencer', ['Blaine, Whatcom County, Washington'], 'Born at Blaine (Ed Simons\'s tree).'],
  ['kulp_dorothy_belle', ['Blaine, Whatcom County, Washington', 'Pasco, Washington'], 'Born at Blaine (Ed Simons\'s tree); died at Pasco (Washington death records).'],
  ['kulp_audrey_rebecca', ['Colville, Stevens County, Washington'], 'Died in Stevens County (Washington death records); Ed Simons\'s tree gives the place as Colville.'],
  ['simons_ettie', ['Olympia, Thurston County, Washington'], null],
  ['simons_bertha', ['South Haven, Van Buren County, Michigan', 'King County, Washington'], 'Ed Simons\'s tree gives her birthplace as South Haven, Michigan (March 1887), and her death as 24 Sep 1940 in King County.'],
  ['vancel_sarah', ['Holton, Jackson County, Kansas'], null],
  ['vancel_valentine', ['Pennsylvania', 'Big Muddy, Union County, Illinois'], null],
  ['karnes_elizabeth_rebecca', ['Clyde, Cloud County, Kansas'], null],
  ['dolan_thomas', ['County Dublin, Ireland', 'Multnomah County, Oregon'], null],
  ['dowling_ellen', ['County Cork, Ireland', 'Multnomah County, Oregon'], null],
  ['dolan_joseph_martin', ['Cedar Mill, Washington County, Oregon'], null],
  ['adams_george_francis_2', ['Oakland, Douglas County, Oregon'], 'Ed Simons\'s tree gives his place of death as Oakland, Douglas County, Oregon.'],
  ['kulp_abraham_clemens', ['Kulpsville, Montgomery County, Pennsylvania', 'Linden, Lycoming County, Pennsylvania'], 'Ed Simons\'s tree gives his birthplace as Kulpsville, Montgomery County, and his place of death as Linden, Lycoming County, Pennsylvania.'],
  ['mcphail_john_elder', ['Cumberland County, North Carolina', 'McMinn County, Tennessee'], 'Ed Simons\'s tree gives John David McPhail\'s birth as about 1805 in Cumberland County, North Carolina, and his death as before 1870 in McMinn County, Tennessee.'],
  ['ball_graden', [], 'Ed Simons\'s tree gives her birth as 18 Jan 1816.'],
  ['wagner_mary', [], 'Ed Simons\'s tree gives her birth as 30 Jan 1818 in Ohio, as Mary Wagoner.'],
];
for (const [id, locs, text] of TREE_PLACES) edit(id, ED, p => { locs.forEach(l => add(p.locations, l)); if (text) note(p, text); });

// 1870 census: Henry Simons's younger children born in Indiana
for (const id of ['simons_richard', 'simons_harriet_e']) edit(id, [C1870, ED], p => { add(p.locations, 'Indiana'); note(p, 'Born in Indiana (1870 census, in the household of Henry Simons at Northwest, Williams County, Ohio).'); });
console.log('Ed tree places applied');
