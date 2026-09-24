#!/usr/bin/env node
/**
 * 2026-09-24, "Enoch Pratt" (the Enoch Pratt Free Library, Baltimore's public
 * library) came from chapter 34 of Barbara McKeldin Adams's memoir, "My
 * Favorite Books", where she recalls going to the library every Saturday. It
 * was copied onto everyone the chapter mentions: Garret and Owen appear only
 * because they got her hooked on some authors. Keep it on Barbara, named in
 * full, and remove it from the boys. Re-runnable.
 */
'use strict';
const { load, save } = require('./lib/records');
const OLD = 'Enoch Pratt', FULL = 'Enoch Pratt Free Library, Baltimore';
for (const id of ['garret_adams', 'owen_adams']) {
  const p = load(id);
  p.locations = (p.locations || []).filter(l => l !== OLD);
  save(p);
}
const b = load('barbara_mckeldin_adams');
b.locations = [...new Set((b.locations || []).map(l => l === OLD ? FULL : l))];
save(b);
console.log('Enoch Pratt fixed');
