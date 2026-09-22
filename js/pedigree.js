// Pedigree (ancestor) chart: the chosen person on the left, each generation of
// ancestors in a column to the right, fathers above mothers.
//
// Only people who exist take up space, so a line that stops early does not
// leave a large empty block. Where one parent is known and the other is not,
// a dashed "unknown" card marks the gap for research. Each card carries its
// Ahnentafel number (1 = the chosen person, 2n = father of n, 2n+1 = mother).

import { CARD } from './layout.js';

export const PED = { colGap: 64, rowGap: 14 };
const COL = CARD.w + PED.colGap;
const UNIT = CARD.h + PED.rowGap;

export function generationLabel(g) {
  if (g === 0) return '';
  if (g === 1) return 'Parents';
  if (g === 2) return 'Grandparents';
  if (g === 3) return 'Great-grandparents';
  return `${g - 2}× great-grandparents`;
}

/** Deepest generation of known ancestors above p (0 = no parents recorded). */
export function ancestorDepth(D, p, seen = new Set()) {
  if (!p || seen.has(p.id)) return 0;
  seen.add(p.id);
  let d = 0;
  for (const par of D.parents(p)) d = Math.max(d, 1 + ancestorDepth(D, par, seen));
  seen.delete(p.id);
  return d;
}

/** [father, mother] in chart order; either may be null. */
function parentSlots(D, p) {
  const father = p.father ? D.person(p.father) : null;
  const mother = p.mother ? D.person(p.mother) : null;
  // Parents known only from a `children` list have no father/mother slot:
  // put them in whichever slot is free.
  const extra = D.parents(p).filter(q => q.id !== p.father && q.id !== p.mother);
  const slots = [father, mother];
  for (const q of extra) { const i = slots.indexOf(null); if (i >= 0) slots[i] = q; }
  return slots;
}

/**
 * @returns {{nodes, links, labels, bounds, depth, shownDepth, count}}
 */
export function layoutPedigree(D, focus, maxGen = 4) {
  const nodes = [];
  const links = [];
  const placed = new Map();          // id -> first node, for pedigree collapse
  let cursor = 0;                    // next free vertical slot (in units)
  let deepest = 0;

  function place(p, gen, ahnen, slotName) {
    const x = gen * COL;
    if (!p) {
      // unknown parent placeholder
      const y = (cursor++ + 0.5) * UNIT;
      const n = { id: `unknown-${ahnen}`, x, y, role: 'unknown', gen, ahnen, label: slotName === 'father' ? 'Father unknown' : 'Mother unknown' };
      nodes.push(n);
      return n;
    }
    if (placed.has(p.id)) {
      // Pedigree collapse: the same ancestor reached twice. Show a stub.
      const y = (cursor++ + 0.5) * UNIT;
      const n = { id: p.id, x, y, role: 'repeat', gen, ahnen, repeatOf: placed.get(p.id).ahnen };
      nodes.push(n);
      return n;
    }
    deepest = Math.max(deepest, gen);
    const slots = gen < maxGen ? parentSlots(D, p) : [null, null];
    const anyKnown = slots.some(Boolean);
    const n = { id: p.id, x, y: 0, role: gen === 0 ? 'focus' : 'ancestor', gen, ahnen };
    placed.set(p.id, n);
    nodes.push(n);
    if (anyKnown) {
      const kids = [
        place(slots[0], gen + 1, ahnen * 2, 'father'),
        place(slots[1], gen + 1, ahnen * 2 + 1, 'mother'),
      ];
      n.y = (kids[0].y + kids[1].y) / 2;
      links.push({ type: 'elbow', from: n, to: kids });
    } else {
      n.y = (cursor++ + 0.5) * UNIT;
      n.more = gen === maxGen && D.parents(p).length > 0;   // ancestors beyond the cut
    }
    return n;
  }

  place(focus, 0, 1);

  const shown = Math.max(...nodes.map(n => n.gen));
  const labels = [];
  for (let g = 1; g <= shown; g++) labels.push({ x: g * COL, y: -CARD.h / 2 - 22, text: generationLabel(g) });

  const xs = nodes.map(n => n.x), ys = nodes.map(n => n.y);
  const bounds = {
    x0: Math.min(...xs) - CARD.w / 2 - 40, x1: Math.max(...xs) + CARD.w / 2 + 40,
    y0: Math.min(...ys, 0) - CARD.h / 2 - 110, y1: Math.max(...ys) + CARD.h / 2 + 40,
  };
  return {
    nodes, links, labels, bounds,
    depth: ancestorDepth(D, focus), shownDepth: deepest,
    count: nodes.filter(n => n.role === 'ancestor').length,
    focusNode: nodes[0],
  };
}
