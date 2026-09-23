#!/usr/bin/env node
/**
 * 2026-09-24, from Brendan Adams. Re-runnable. Michelle (Ellis) Adams born
 * 12 Sep 1972 (the year added to the day and month already recorded); she
 * and Brian John Adams married 17 Dec 1993.
 */
'use strict';
const { load, save } = require('./lib/records');
const BA = 'Brendan Adams (personal knowledge), 2026';
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
function marry(id, re, text) {
  const p = load(id);
  p.milestones = (p.milestones || []).filter(t => !re.test(t));
  add(p.milestones, text);
  p.sources = p.sources || []; add(p.sources, BA);
  save(p);
}
{ const m = load('michelle_ellis_adams'); if (!m.birth || m.birth === '12 Sep') m.birth = '12 Sep 1972'; save(m); }
marry('brian_john_adams', /^Married Michelle\b/, 'Married Michelle Ellis (m. 17 Dec 1993)');
marry('michelle_ellis_adams', /^Married Brian\b/, 'Married Brian John Adams (m. 17 Dec 1993)');
console.log('Brian and Michelle updated');
