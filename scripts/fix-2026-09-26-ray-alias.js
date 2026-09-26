#!/usr/bin/env node
/** 2026-09-26, the names the family uses for Raymond Zell Simons, so "Ray Simons" resolves to him. Re-runnable. */
'use strict';
const { load, save } = require('./lib/records');
const p = load('simons_raymond_zell');
p.aliases = p.aliases || [];
for (const a of ['Ray Simons', 'Ray Z. Simons', 'Grandpa Ray']) if (!p.aliases.includes(a)) p.aliases.push(a);
save(p);
const e = load('simons_raymond_elmer');
e.aliases = e.aliases || [];
for (const a of ['Elmer Simons', 'R. Elmer Simons']) if (!e.aliases.includes(a)) e.aliases.push(a);
save(e);
console.log('Ray alias applied');
