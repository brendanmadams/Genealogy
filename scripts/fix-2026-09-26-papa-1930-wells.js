#!/usr/bin/env node
/**
 * 2026-09-26, George Francis Adams Sr. in the 1930 census: the index (FamilySearch
 * ark 1:1:XCN2-WJC, Burlingame, San Mateo County) has him as George F. Wells, 14,
 * stepson of Arthur T. Wells, beside Presley M. and Edith V. Adams; the note
 * claiming he was recorded as Adams is removed. Re-runnable.
 */
'use strict';
const { load, save } = require('./lib/records');
const p = load('george_francis_adams_sr');
const drop = 'Recorded correctly as step-child with surname Adams on the 1930 census (not Wells)';
p.notes = p.notes.filter(n => n !== drop);
p.notable_stories = (p.notable_stories || []).filter(n => n !== drop);
p.milestones = (p.milestones || []).filter(n => n !== drop);
const src = 'FamilySearch, United States Census, 1930 (Burlingame, San Mateo County, California; George F. Wells, 14, born Oregon, stepson of Arthur T. and Serena M. Wells, with Presley M. Adams, Edith V. Adams, Rosemary Wells and Daphne L. Wells; ark 1:1:XCN2-WJC)';
if (!p.sources.includes(src)) p.sources.push(src);
const n = 'The Wells surname appears on one record only: the 1930 census at Burlingame, where the enumerator wrote him as George F. Wells, stepson, while his brother Presley and sister Edith on the same sheet kept the name Adams. The 1940 census has him as George Adams again, still Arthur Wells\'s stepson, and every later record is Adams.';
if (!p.notes.includes(n)) p.notes.push(n);
save(p);
console.log('Papa 1930 applied');
