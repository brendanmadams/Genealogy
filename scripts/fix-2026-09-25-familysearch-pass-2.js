#!/usr/bin/env node
/**
 * 2026-09-25, second FamilySearch pass over open items:
 *  - Bertha Simons: death 24 Sep 1940 at Seattle as Bertha Stuart (parents
 *    named), and her three marriages (Noyes 1902, Harrington 1914, Stuart 1933).
 *  - George F. Adams (#1) and Cynthia Lane: marriage 14 Jan 1841, Chariton
 *    County, Missouri, closing a question from the family emails.
 *  - Charles Frank Masters and Nellie Gertrude Simons: 1898 Berrien County
 *    marriage with both sets of parents.
 *  - Henry A. Adams: died 28 Jan 1926 at Los Angeles as Harry Ashby Adams,
 *    son of Alexander Adams and an Ashby.
 * Re-runnable.
 */
'use strict';
const { exists, load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, sex, birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
const edit = (id, src, fn) => { const p = load(id); p.notes = p.notes || []; p.sources = p.sources || []; p.locations = p.locations || []; p.aliases = p.aliases || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); };
const person = (id, name, sex, src, fn) => { if (!exists(id)) save(blank(id, name, sex)); edit(id, src, fn); };
const refine = (p, k, v) => { if (!p[k] || /^(abt |about )?\d{4}$/i.test(String(p[k]).trim())) p[k] = v; };
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, [], p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };
const swapNote = (p, from, to) => { const i = p.notes.findIndex(n => n.startsWith(from)); if (i >= 0) p.notes[i] = to; else note(p, to); };

const WADB = 'FamilySearch, Washington, Deaths and Burials, 1810-1960 (Bertha Stuart, died 24 Sep 1940 Seattle, buried 27 Sep 1940; born 4 Mar 1886 Michigan; parents Arron Simons and Hattie Michels; husband Alfred A. Stuart; ark 1:1:HVC6-Z6T2)';
const WAM1914 = 'FamilySearch, Washington, County Marriages, 1855-2008 (Harry H. Harrington and Bertha E. Noyes, Mount Vernon, Skagit County, 24 Oct 1914; ark 1:1:QPMJ-8L4S)';
const WAM1933 = 'FamilySearch, Washington, County Marriages, 1855-2008 (Alfred A. Stuart and Bertha E. Simons, King County, 26 Jan 1933; arks 1:1:QPMV-4G1Y, QPMV-FLHJ)';
const FSTB = 'FamilySearch Family Tree, Bertha E. Simons (LXWM-ZQF), Forest Clifford Noyes (LZLP-2TR) and Harry Henry Harrington (LZ5R-CC4); a shared tree, used as a guide only';
const MOM1841 = 'FamilySearch, Missouri, County Marriage, Naturalization, and Court Records, 1800-1991 (George F. Adams and Miss Cinthia Lane, Chariton County, 14 Jan 1841, page 64; ark 1:1:WPWL-1VPZ)';
const MIM1898 = 'FamilySearch, Michigan, County Marriages, 1820-1941 (Charles Frank Masters, 23, and Nellie Gertrude Simons, 19, Berrien County, 12 Sep 1898, page 279; parents Richard F. Masters and Sarah A. Prescott; Aron Simons and Hattie Michels; ark 1:1:VN24-M3B)';
const CAD1926 = 'FamilySearch, California, County Birth and Death Records, 1800-1994 (Harry Ashby Adams, aged 58, died 28 Jan 1926 Los Angeles, document 984; parents Alexander Adams and — Ashby; ark 1:1:QGNM-68Y1)';

// ── Bertha ──────────────────────────────────────────────────────────────────
edit('simons_bertha', [WADB, WAM1914, WAM1933, FSTB], p => {
  p.name = 'Bertha E. Simons (Noyes, Harrington, Stuart)';
  if (p.birth === 'Mar 1887') p.birth = '4 Mar 1886';
  refine(p, 'death', '24 Sep 1940');
  for (const l of ['Mount Vernon, Skagit County, Washington', 'Seattle, King County, Washington']) add(p.locations, l);
  for (const a of ['Bertha E. Simons', 'Bertha E. Noyes', 'Bertha Stuart']) add(p.aliases, a);
  swapNote(p, 'UNPROVEN, from Ed Simons\'s tree: died 24 Sep 1940 in King County',
    'Died 24 Sep 1940 at Seattle, aged 54, as Bertha Stuart, housewife, wife of Alfred A. Stuart, and was buried there on 27 Sep; the record gives her birth as 4 Mar 1886 in Michigan and her parents as Arron Simons, born in Ohio, and Hattie Michels, born in Canada (Washington deaths and burials). This confirms the date in Ed Simons\'s tree, which she was missing from the death index under Simons and Harrington because she died under her third married name. The 1900 census had her birth as Mar 1887.');
  note(p, 'Married three times in Washington: Forest Noyes at Burlington, Skagit County, 2 Nov 1902; Harry H. Harrington at Mount Vernon, Skagit County, 24 Oct 1914, as Bertha E. Noyes; and Alfred A. Stuart in King County, 26 Jan 1933, under her maiden name (Washington county marriages).');
});
person('stuart_alfred_a', 'Alfred A. Stuart', 'M', [WAM1933, WADB], p => {
  add(p.locations, 'Seattle, King County, Washington');
  note(p, 'Married Bertha E. Simons in King County on 26 Jan 1933; her husband at her death in Seattle in 1940 (Washington county marriages; Washington deaths and burials). A marriage of an Alfred A. Stuart to Marie B. Rothwell in King County on 23 Jun 1920 may be his earlier one; not confirmed.');
});
wed('simons_bertha', 'stuart_alfred_a');
edit('harrington_harry_h', [WAM1914, FSTB], p => {
  note(p, 'Married Bertha E. Noyes at Mount Vernon, Skagit County, on 24 Oct 1914 (Washington county marriages), which confirms the 1920 census identification. The FamilySearch tree calls him Harry Henry Harrington, 1887–1959, from a shared tree only.');
});
edit('noyes_forest', FSTB, p => {
  add(p.aliases, 'Forest Clifford Noyes');
  note(p, 'The FamilySearch tree gives him as Forest Clifford Noyes, 1882–1939, from a shared tree only. Bertha remarried in 1914.');
});

// ── George F. Adams (#1) and Cynthia Lane ───────────────────────────────────
const LANE_TEXT = 'Married 14 Jan 1841 in Chariton County, Missouri, recorded as George F. Adams and Miss Cinthia Lane on page 64 of the county register (Missouri county marriage records). This answers the family emails\' open question about the marriage record, and fits Bill Allen\'s view that George reached Chariton County in late 1840 or early 1841; their home was Chariton County, not Marion.';
edit('adams_george_francis_1', MOM1841, p => { add(p.locations, 'Chariton, Chariton County, Missouri'); swapNote(p, 'Open question: no marriage record has been found for George F. Adams (#1) and Cynthia Lane', LANE_TEXT); });
edit('lane_cynthia', MOM1841, p => { add(p.locations, 'Chariton, Chariton County, Missouri'); swapNote(p, 'Open question: no marriage record has been found for George F. Adams (#1) and Cynthia Lane', LANE_TEXT + ' She was about 17.'); });

// ── Masters and Gertrude, 1898 ──────────────────────────────────────────────
edit('masters_charles_f', MIM1898, p => {
  add(p.aliases, 'Charles Frank Masters');
  add(p.locations, 'Berrien County, Michigan');
  note(p, 'The Berrien County marriage register (12 Sep 1898, page 279) gives him as Charles Frank Masters, 23, son of Richard F. Masters and Sarah A. Prescott, marrying Nellie Gertrude Simons, 19, daughter of Aron Simons and Hattie Michels (Michigan county marriages).');
});
edit('simons_gertrude_nellie', MIM1898, p => {
  add(p.aliases, 'Nellie Gertrude Simons');
  note(p, 'The Berrien County marriage register (12 Sep 1898, page 279) gives her as Nellie Gertrude Simons, 19, daughter of Aron Simons and Hattie Michels, marrying Charles Frank Masters, 23 (Michigan county marriages).');
});

// ── Henry A. Adams ──────────────────────────────────────────────────────────
edit('adams_henry_a', CAD1926, p => {
  refine(p, 'death', '28 Jan 1926');
  add(p.locations, 'Los Angeles, California');
  for (const a of ['Harry Ashby Adams', 'Harry A. Adams']) add(p.aliases, a);
  note(p, 'Inferred: he is the Harry Ashby Adams, aged 58, who died at Los Angeles on 28 Jan 1926, son of Alexander Adams and a mother whose surname is given as Ashby (California county death records, document 984, which also names an Augusta Adams). The age fits his birth in January 1868, and the middle name Ashby confirms his mother\'s family. Harry is the usual short form of Henry.');
});
edit('ashby_unknown', CAD1926, p => {
  note(p, 'Her surname is confirmed by her son\'s 1926 Los Angeles death record, which names him Harry Ashby Adams, son of Alexander Adams and an Ashby (California county death records). Her given name is still unknown.');
});
console.log('FamilySearch pass 2 applied');
