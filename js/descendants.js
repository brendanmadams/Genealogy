// Descendant chart: the chosen person on the left, each generation of
// descendants in a column to the right, oldest child first.
//
// Each person's spouses are listed as small tags under their card, and each
// spouse's children branch off that tag, so second marriages stay separate.
// Children whose other parent is unknown branch off the person's own card.
// Every card carries its d'Aboville number (1, 1.1, 1.2, 1.1.1 …).

import { CARD, shortLabel } from './layout.js';
import { byBirth, displayName } from './data.js';

export const TAG = { h: 30, gap: 6, indent: 18 };
const COL = CARD.w + 72;
const ROWGAP = 14;

export function descendantLabel(g) {
  if (g === 0) return '';
  if (g === 1) return 'Children';
  if (g === 2) return 'Grandchildren';
  if (g === 3) return 'Great-grandchildren';
  return `${g - 2}× great-grandchildren`;
}

/** Deepest generation of descendants below p (0 = no children recorded). */
export function descendantDepth(D, p, seen = new Set()) {
  if (!p || seen.has(p.id)) return 0;
  seen.add(p.id);
  let d = 0;
  for (const c of D.children(p)) d = Math.max(d, 1 + descendantDepth(D, c, seen));
  seen.delete(p.id);
  return d;
}

/**
 * @returns {{nodes, links, labels, bounds, depth, shownDepth, count, focusNode}}
 *  person node: {id, x, y, role:'focus'|'descendant'|'repeat', gen, number, more?}
 *  tag node:    {type:'tag', id (spouse id or null), familyId, x, y, w, label, sub}
 */
export function layoutDescendants(D, focus, maxGen = 3) {
  const nodes = [];
  const links = [];
  const placed = new Map();
  let cursor = 0;          // next free y (px, top edge)
  let deepest = 0;

  // Families of p that should show: spouse families (with or without children)
  // first, oldest marriage first, then the family with the other parent unknown.
  function familiesOf(p) {
    const fams = D.partnerFamilies(p);
    const withPartner = fams.filter(f => f.partners.length === 2);
    const solo = fams.filter(f => f.partners.length === 1 && f.children.length);
    // children given up for adoption hang from the birth parent on a dashed line
    const birth = p.birth_children?.length ? [{ id: `birth-${p.id}`, partners: [p.id], children: p.birth_children, birth: true }] : [];
    return [...withPartner, ...solo, ...birth];
  }

  function place(p, gen, number) {
    const x = gen * COL;
    if (placed.has(p.id)) {
      const top = cursor; cursor += CARD.h + ROWGAP;
      const n = { id: p.id, x, y: top + CARD.h / 2, role: 'repeat', gen, number, repeatOf: placed.get(p.id).number };
      nodes.push(n);
      return { node: n, top, bottom: top + CARD.h };
    }
    deepest = Math.max(deepest, gen);
    const n = { id: p.id, x, y: 0, role: gen === 0 ? 'focus' : 'descendant', gen, number };
    placed.set(p.id, n);
    nodes.push(n);

    const fams = familiesOf(p);
    const tags = fams.filter(f => f.partners.length === 2);
    const blockH = CARD.h + tags.length * (TAG.h + TAG.gap);
    const expand = gen < maxGen;

    // Lay out children first (they decide the vertical span), grouped by family.
    const start = cursor;
    const groups = [];
    let childNo = 0;
    if (expand) {
      for (const f of fams) {
        const kids = byBirth(f.children.map(id => D.person(id)).filter(Boolean));
        if (!kids.length) continue;
        const kidNodes = kids.map(k => place(k, gen + 1, `${number}.${++childNo}`).node);
        if (f.birth) kidNodes.forEach(k => { k.birthChild = true; });
        groups.push({ fam: f, kids: kidNodes });
      }
    }
    const childBottom = cursor;

    // Centre the person's block beside its children, but never above the slot start.
    const span = groups.length ? childBottom - ROWGAP - start : 0;
    let top = groups.length ? start + Math.max(0, (span - blockH) / 2) : start;
    top = Math.max(top, start);
    n.y = top + CARD.h / 2;
    cursor = Math.max(childBottom, top + blockH + ROWGAP);

    // Spouse tags under the card.
    const tagNodes = new Map();
    tags.forEach((f, i) => {
      const sp = D.partnerIn(f, p);
      const t = {
        type: 'tag', id: sp?.id || null, familyId: f.id,
        x: x + TAG.indent / 2, w: CARD.w - TAG.indent,
        y: top + CARD.h + TAG.gap + i * (TAG.h + TAG.gap) + TAG.h / 2,
        label: sp ? displayName(sp) : 'Spouse unknown', sub: f.marriage ? `m. ${f.marriage}` : '', partnered: !!f.partnered,
      };
      nodes.push(t);
      tagNodes.set(f.id, t);
    });

    // Connectors: from the spouse tag (or the card, when the other parent is unknown).
    groups.forEach((g, i) => {
      const src = tagNodes.get(g.fam.id);
      const from = src ? { x: src.x + src.w / 2, y: src.y } : { x: x + CARD.w / 2, y: n.y };
      links.push({ type: 'branch', from, to: g.kids, lane: i, lanes: groups.length, dashed: !!g.fam.birth });
    });

    if (!expand) n.more = D.children(p).length > 0;
    return { node: n, top, bottom: cursor };
  }

  place(focus, 0, '1');

  const shown = Math.max(...nodes.filter(n => n.gen !== undefined).map(n => n.gen));
  const labels = [];
  for (let g = 1; g <= shown; g++) labels.push({ x: g * COL, y: -22, text: descendantLabel(g), short: shortLabel(g, 'Children') });

  const people = nodes.filter(n => !n.type);
  const bounds = {
    x0: -CARD.w / 2 - 40, x1: shown * COL + CARD.w / 2 + 40,
    y0: -56, y1: Math.max(...nodes.map(n => n.y + (n.type ? TAG.h / 2 : CARD.h / 2))) + 40,
  };
  return {
    nodes, links, labels, bounds,
    depth: descendantDepth(D, focus), shownDepth: deepest,
    count: people.filter(n => n.role === 'descendant').length,
    focusNode: people[0],
  };
}

export const DESC_COL = COL;
