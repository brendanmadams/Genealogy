#!/usr/bin/env node
/**
 * Apply the facts approved by Brendan Adams on 2026-09-23 from Bill Allen's
 * family document (data/imports/bill-allen-2026-09-23.json), plus his four
 * decisions on conflicting dates. Re-runnable: every write checks first.
 *
 * Where each kind of fact goes:
 *   birth/death  date (only when empty or less exact; the old value is kept
 *                in notes), place to locations, a "Born …"/"Died …" milestone
 *   marriage     "Married <spouse> (m. <date>, <place>)" milestone on both
 *                partners, replacing a less exact one
 *   burial, military, religion, divorce -> milestones
 *   career -> career · education -> education · story -> notable_stories
 *   residence -> locations · other and descriptive child facts -> notes
 * Every touched record gets the document as a source.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { exists, load, save, note } = require('./lib/records');
const IMP = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'data', 'imports', 'bill-allen-2026-09-23.json'), 'utf8'));
const TAG = 'CORRECTION 2026-09-23:';
const add = (arr, v) => { if (v && !arr.includes(v)) { arr.push(v); return true; } return false; };
const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const yearOf = s => { const m = String(s || '').match(/\b(1[5-9]\d\d|20\d\d)\b/); return m ? +m[1] : null; };
const precision = s => { s = String(s || ''); if (/\b\d{1,2}\s+[A-Za-z]{3}/.test(s) || /[A-Za-z]{3,}\s+\d{1,2},/.test(s)) return 3; if (/[A-Za-z]{3,}\s+\d{4}/.test(s)) return 2; if (yearOf(s)) return 1; return 0; };
const mentions = (arr, v) => { const n = norm(v); return !!n && (arr || []).some(x => norm(x).includes(n)); };
const cite = f => ` [${f.source === 'r' ? 'Bill Allen, Further Research, 2012' : 'Bill Allen, Descendants of Jose Pierre Adams, 2011'}, line ${f.lines.join(', ')}]`;
const ensure = p => { for (const k of ['locations', 'milestones', 'notable_stories', 'career', 'education', 'notes', 'sources']) p[k] = p[k] || []; };
const placeShort = pl => String(pl || '').replace(/\s+/g, ' ').trim();

const stats = { records: 0, dates: 0, places: 0, milestones: 0, career: 0, education: 0, stories: 0, notes: 0, marriages: 0 };

// ── Decisions ──────────────────────────────────────────────────────────────
function decide(id, field, value, why) {
  const p = load(id); ensure(p);
  if (p[field] !== value) { note(p, `${TAG} ${field === 'birth' ? 'Birth' : 'Death'} changed from "${p[field] || '—'}" to "${value}". ${why}`); p[field] = value; save(p); }
}
const CENSUS = 'The 1820 and 1830 censuses place the birth between 1780 and 1790 (Bill Allen, Further Research, 2012); his 1836 death notice gives his age as about 50. Decision by Brendan Adams.';
decide('adams_jose_pierre', 'birth', 'abt 1785', CENSUS);
decide('hamilton_elizabeth_eliza', 'birth', 'abt 1785', 'The 1820 and 1830 censuses place her birth between 1780 and 1790 (Bill Allen, Further Research, 2012). Decision by Brendan Adams.');
decide('adams_george_francis_1', 'death', '1896', 'From his obituary, found by Bill Allen and cited in his Further Research (2012). Decision by Brendan Adams.');
{ const p = load('adams_alexander_william_col'); ensure(p); note(p, `${TAG} Birth kept as Jun 1842; Bill Allen's 2011 register gives Jun 1843. Decision by Brendan Adams.`); save(p); }
{ const p = load('adams_joseph_pierre_jose2'); ensure(p); note(p, `${TAG} Birth kept as 31 May 1847 (The Trail obituary); another obituary quoted in Bill Allen's Further Research (2012) gives 31 May 1848, near Brunswick. Decision by Brendan Adams.`); save(p); }

// A marriage can be read several times with slightly different places; use
// the reading most of them agree on (first one on a tie).
const bestMarriage = new Map();
{
  const tally = new Map();
  for (const [id, e] of Object.entries(IMP.people)) for (const f of e.facts) {
    if (f.kind !== 'marriage' || !f.related || !f.date) continue;
    const key = [id, f.related].sort().join('+');
    const variant = `${f.date}|${norm(placeShort(f.place)).replace(/\bmissouri\b/, 'mo').replace(/\bcolorado\b/, 'co')}`;
    const t = tally.get(key) || new Map();
    const v = t.get(variant) || { n: 0, f };
    v.n++; t.set(variant, v); tally.set(key, t);
  }
  for (const [key, t] of tally) bestMarriage.set(key, [...t.values()].sort((a, b) => b.n - a.n)[0].f);
}

// ── Import ─────────────────────────────────────────────────────────────────
for (const [id, entry] of Object.entries(IMP.people)) {
  if (!exists(id)) { console.warn('missing record', id); continue; }
  const p = load(id); ensure(p);
  let touched = false;
  const kids = (p.relationships.children || []).map(c => exists(c) ? load(c).name.split(' ')[0].toLowerCase() : '');

  for (const f of entry.facts) {
    const where = placeShort(f.place);
    switch (f.kind) {
      case 'birth': case 'death': {
        const field = f.kind;
        if (f.date && (!p[field] || precision(f.date) > precision(p[field])) && (!p[field] || !yearOf(p[field]) || Math.abs(yearOf(p[field]) - yearOf(f.date)) <= 2)) {
          if (p[field]) note(p, `${TAG} ${field === 'birth' ? 'Birth' : 'Death'} refined from "${p[field]}" to "${f.date}"${cite(f)}.`);
          p[field] = f.date; stats.dates++; touched = true;
        }
        if (where && add(p.locations, where)) { stats.places++; touched = true; }
        const label = field === 'birth' ? 'Born' : 'Died';
        if (f.date || where) {
          const ms = `${label} ${[f.date, where].filter(Boolean).join(', ')}`;
          if (!mentions(p.milestones, ms) && add(p.milestones, ms)) { stats.milestones++; touched = true; }
        }
        if (!f.date && !where && !/unknown/i.test(f.value) && add(p.notes, f.value + cite(f))) { stats.notes++; touched = true; }
        break;
      }
      case 'marriage': {
        if (!f.related || !exists(f.related) || !f.date) { if (add(p.notes, f.value + cite(f))) { stats.notes++; touched = true; } break; }
        if (bestMarriage.get([id, f.related].sort().join('+')) !== f) break;   // a less-agreed reading
        for (const [aId, bId] of [[id, f.related], [f.related, id]]) {
          const a = aId === id ? p : load(aId); ensure(a);
          const b = load(bId);
          const first = norm(b.name).split(' ')[0];
          const text = `Married ${b.name} (m. ${[f.date, where].filter(Boolean).join(', ')})`;
          const i = a.milestones.findIndex(m => /^married\b/i.test(m) && norm(m).includes(first));
          const cur = i >= 0 ? (a.milestones[i].match(/\(m\.\s*([^)]+)\)/) || [])[1] : null;
          if (i >= 0 && cur && precision(cur) >= precision(f.date) && (!where || norm(cur).includes(norm(where).split(' ')[0]))) continue;
          if (i >= 0 && a.milestones[i] === text) continue;
          if (i >= 0) a.milestones[i] = text; else a.milestones.push(text);
          add(a.sources, IMP.source[f.source]);
          if (a !== p) save(a); else touched = true;
          stats.marriages++;
        }
        break;
      }
      case 'burial': case 'military': case 'religion': case 'divorce': {
        const pre = { burial: 'Buried', military: 'Military', religion: 'Religion', divorce: 'Divorced' }[f.kind];
        const text = /^(buried|served|enlist|divorc|member|baptiz|joined)/i.test(f.value) ? f.value : `${pre}: ${f.value}`;
        const full = f.date && !text.includes(yearOf(f.date) || '@@') ? `${text} (${f.date})` : text;
        if (!mentions(p.milestones, f.value) && add(p.milestones, full)) { stats.milestones++; touched = true; }
        if (where && add(p.locations, where)) { stats.places++; touched = true; }
        break;
      }
      case 'career': if (!mentions(p.career, f.value) && add(p.career, f.value + (f.date && !String(f.value).includes(String(yearOf(f.date))) ? ` (${f.date})` : ''))) { stats.career++; touched = true; } break;
      case 'education': if (!mentions(p.education, f.value) && add(p.education, f.value)) { stats.education++; touched = true; } break;
      case 'story': if (!mentions(p.notable_stories, f.value) && add(p.notable_stories, f.value)) { stats.stories++; touched = true; } break;
      case 'residence': {
        if (where) { if (add(p.locations, where)) { stats.places++; touched = true; } }
        else if (add(p.notes, f.value + cite(f))) { stats.notes++; touched = true; }
        break;
      }
      case 'child': {
        // descriptive only; skip lists of children who are already linked
        const named = kids.filter(k => k && norm(f.value).includes(k)).length;
        if (named >= 2) break;
        if (add(p.notes, f.value + cite(f))) { stats.notes++; touched = true; }
        break;
      }
      default: if (!mentions(p.notes, f.value) && add(p.notes, f.value + cite(f))) { stats.notes++; touched = true; }
    }
    if (touched) add(p.sources, IMP.source[f.source]);
  }
  if (touched) { save(p); stats.records++; }
}
console.log(JSON.stringify(stats));
