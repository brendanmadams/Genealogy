#!/usr/bin/env node
/**
 * 2026-09-26, Charles F. Masters placed as Raymond Zell Simons's father on the
 * chart, as Ed Simons's tree has him, with the link labelled UNPROVEN pending
 * DNA on the Masters record; Ray's own record carries the caveat without the
 * flag, since everything else about Ray is documented. Re-runnable.
 */
'use strict';
const { load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };

const ray = load('simons_raymond_zell');
ray.relationships.father = 'masters_charles_f';
ray.notes = ray.notes.map(n => /^His father is not identified\./.test(n)
  ? 'His father is not proven. The birth registers name him as "Ray Simonds", born in Chicago, a farmer, which fits neither Aaron (born in Ohio) nor Charles F. Masters, whom Gertrude married in 1898 (born in Michigan); Raymond\'s 1930 census gives his father\'s birthplace as Illinois. Masters is shown as his father on the chart because Ed Simons\'s tree names him, citing only another member tree; the link awaits a DNA match to a Masters or Prescott descendant.'
  : n);
save(ray);

const m = load('masters_charles_f');
add(m.relationships.children, 'simons_raymond_zell');
m.notes = m.notes.map(n => /names him as Raymond Zell Simons's father \(UNPROVEN\)/.test(n)
  ? 'Born Mar 1875 in Michigan, son of Richard F. and Sarah Masters, with whom he lived at South Haven in 1900; died 18 May 1928 at Sacramento, aged 53 (1900 census; California death index). Ed Simons\'s tree gives 17 Mar 1875 at Watertown, Clinton County, and names him as Raymond Zell Simons\'s father, citing only another member tree. UNPROVEN pending DNA: Raymond\'s birth register names a "Ray Simonds", born in Chicago, and no Masters or Prescott match has yet appeared among the family\'s 23andMe relatives. He is shown as Raymond\'s father on the chart on that basis.'
  : n);
note(m, 'UNPROVEN pending DNA: shown as Raymond Zell Simons\'s father on Ed Simons\'s authority only.');
save(m);
console.log('Ray–Masters applied');
