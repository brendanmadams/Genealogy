// Hourglass layout around one focus person:
//
//   grandparents      [GP] [GP]        [GP] [GP]
//   parents                 [Father] [Mother]
//   focus row     [sib] [sib] [FOCUS] [spouse A] [spouse B]
//   children              [c] [c] [c]        [c]
//   grandchildren        [g] [g]  [g]
//
// At most five rows ever render, so the picture stays readable for any family.
// Every card is clickable and becomes the new focus.

export const CARD = { w: 176, h: 68 };
export const GAP = { sib: 22, couple: 14, block: 44, row: 118 };

/** Marriage label for a couple line: the date on the chart, the full text (with place) as its tooltip. */
export const marriageLabel = fam => fam?.marriage ? { label: `m. ${String(fam.marriage).split(',')[0].trim()}`, title: `m. ${fam.marriage}` } : { label: '' };
const ROW = CARD.h + GAP.row;

/**
 * @returns {{nodes: Node[], links: Link[], bounds: {x0,y0,x1,y1}}}
 *  Node: {id, x, y, role, half?}   (x,y = card centre)
 *  Link: {type:'couple', a, b, label} | {type:'descent', from:{x,y}, to:[{x,y}], busY}
 */
export function layoutFocus(D, focus) {
  const nodes = new Map();
  const links = [];
  const place = (p, x, y, role, extra = {}) => {
    if (!p || nodes.has(p.id)) return nodes.get(p?.id);
    const n = { id: p.id, x, y, role, ...extra };
    nodes.set(p.id, n);
    return n;
  };
  const cx = n => n.x;
  const right = n => n.x + CARD.w / 2;
  const left = n => n.x - CARD.w / 2;

  // ── Focus row ─────────────────────────────────────────────────────────────
  const fNode = place(focus, 0, 0, 'focus');
  const fams = D.partnerFamilies(focus);              // couples first, then solo
  const spouseNodes = [];
  let sx = 0;
  for (const fam of fams) {
    const sp = D.partnerIn(fam, focus);
    if (!sp) continue;
    sx += CARD.w + GAP.couple;
    const n = place(sp, sx, 0, 'spouse', { familyId: fam.id });
    spouseNodes.push(n);
    // several spouses sit in a row; label each marriage under the gap beside that spouse
    links.push({ type: 'couple', a: fNode, b: n, ...marriageLabel(fam), labelX: n.x - CARD.w / 2 - GAP.couple / 2 });
  }

  const sibs = D.siblings(focus);
  // Blood half siblings through a birth parent are not on this chart (the birth
  // parent is not drawn); the details panel lists them.
  const onChart = s => !(focus.adopted && !(s.parents || []).some(id => (focus.parents || []).includes(id)));
  const sibList = [...sibs.full.map(s => [s, false, false]), ...(sibs.adoptive || []).map(s => [s, true, true]), ...sibs.half.filter(onChart).map(s => [s, true, false])];
  // Siblings sit to the left of the focus, oldest first.
  const sibNodes = [];
  let leftX = 0;
  for (let i = sibList.length - 1; i >= 0; i--) {
    const [s, half, adoptive] = sibList[i];
    leftX -= CARD.w + GAP.sib;
    sibNodes.unshift(place(s, leftX, 0, 'sibling', { half, adoptive }));
  }

  // ── Children and grandchildren ────────────────────────────────────────────
  // Each family of the focus gets a block of children; each child carries its
  // own children (all marriages merged) beneath it. Block widths are computed
  // first so nothing overlaps, then blocks are pushed apart left→right.
  const blocks = [];
  for (const fam of fams) {
    const kids = fam.children.map(id => D.person(id)).filter(Boolean);
    if (!kids.length) continue;
    const sp = D.partnerIn(fam, focus);
    const anchorX = sp ? (fNode.x + nodes.get(sp.id).x) / 2 : fNode.x;
    const items = kids.map(k => {
      const gks = D.children(k);
      const w = Math.max(CARD.w, gks.length * CARD.w + Math.max(0, gks.length - 1) * GAP.sib);
      return { k, gks, w };
    });
    const width = items.reduce((s, it) => s + it.w, 0) + (items.length - 1) * GAP.sib;
    blocks.push({ fam, anchorX, items, width, x: anchorX - width / 2 });
  }
  // push overlapping blocks right (they are already in spouse order)
  for (let i = 1; i < blocks.length; i++) {
    const prevRight = blocks[i - 1].x + blocks[i - 1].width;
    if (blocks[i].x < prevRight + GAP.block) blocks[i].x = prevRight + GAP.block;
  }
  for (const b of blocks) {
    let x = b.x;
    const childNodes = [];
    for (const it of b.items) {
      const ccx = x + it.w / 2;
      const cn = place(it.k, ccx, ROW, 'child', { familyId: b.fam.id });
      if (cn) childNodes.push(cn);
      if (it.gks.length) {
        const gw = it.gks.length * CARD.w + (it.gks.length - 1) * GAP.sib;
        let gx = ccx - gw / 2 + CARD.w / 2;
        const gNodes = [];
        for (const g of it.gks) {
          const gn = place(g, gx, 2 * ROW, 'grandchild');
          if (gn) gNodes.push(gn);
          gx += CARD.w + GAP.sib;
        }
        if (cn && gNodes.length) links.push(descent({ x: cn.x, y: cn.y }, gNodes));
      }
      x += it.w + GAP.sib;
    }
    if (childNodes.length) {
      const sp = D.partnerIn(b.fam, focus);
      // drop from the gap beside that spouse (where its marriage label sits), so a
      // second marriage's children never seem to hang from the first spouse
      const spNode = sp ? nodes.get(sp.id) : null;
      const from = spNode ? { x: spNode.x - CARD.w / 2 - GAP.couple / 2, y: 0, couple: true } : { x: fNode.x, y: 0 };
      links.push(descent(from, childNodes));
    }
  }

  // ── Parents ───────────────────────────────────────────────────────────────
  const parents = D.parents(focus);
  const parentFam = D.parentFamily(focus);
  const parentNodes = [];
  if (parents.length) {
    // centre the parent couple above the run of full siblings + focus
    const fullSibNodes = sibNodes.filter(n => !n.half);
    const spanL = fullSibNodes.length ? Math.min(...fullSibNodes.map(cx)) : fNode.x;
    const spanC = (spanL + fNode.x) / 2;
    const pw = parents.length * CARD.w + (parents.length - 1) * GAP.couple;
    let px = spanC - pw / 2 + CARD.w / 2;
    for (const par of parents) {
      parentNodes.push(place(par, px, -ROW, 'parent'));
      px += CARD.w + GAP.couple;
    }
    if (parentNodes.length === 2) {
      links.push({ type: 'couple', a: parentNodes[0], b: parentNodes[1], ...marriageLabel(parentFam) });
    }
    // descent from parents to focus and full siblings (half siblings link separately below)
    const from = parentNodes.length === 2
      ? { x: (parentNodes[0].x + parentNodes[1].x) / 2, y: -ROW, couple: true }
      : { x: parentNodes[0].x, y: -ROW };
    links.push(descent(from, [...fullSibNodes, fNode]));
    // half siblings descend from the shared parent alone
    for (const hn of sibNodes.filter(n => n.half)) {
      const h = D.person(hn.id);
      const shared = parentNodes.find(pn => (h.parents || []).includes(pn.id));
      if (shared) links.push(descent({ x: shared.x, y: -ROW, offset: true }, [hn]));
    }
  }

  // ── Grandparents ──────────────────────────────────────────────────────────
  const gpGroups = [];
  for (const pn of parentNodes) {
    const par = D.person(pn.id);
    const gps = D.parents(par);
    if (!gps.length) continue;
    const w = gps.length * CARD.w + (gps.length - 1) * GAP.couple;
    gpGroups.push({ pn, gps, w, x: pn.x - w / 2, fam: D.parentFamily(par) });
  }
  for (let i = 1; i < gpGroups.length; i++) {
    const prevRight = gpGroups[i - 1].x + gpGroups[i - 1].w;
    if (gpGroups[i].x < prevRight + GAP.block) gpGroups[i].x = prevRight + GAP.block;
  }
  if (gpGroups.length) {
    // re-centre the whole grandparent row over the parents
    const rowL = gpGroups[0].x, rowR = gpGroups[gpGroups.length - 1].x + gpGroups[gpGroups.length - 1].w;
    const parC = (Math.min(...parentNodes.map(cx)) + Math.max(...parentNodes.map(cx))) / 2;
    const shift = parC - (rowL + rowR) / 2;
    for (const g of gpGroups) g.x += shift;
  }
  for (const g of gpGroups) {
    let gx = g.x + CARD.w / 2;
    const gn = [];
    for (const gp of g.gps) { gn.push(place(gp, gx, -2 * ROW, 'grandparent')); gx += CARD.w + GAP.couple; }
    if (gn.length === 2) links.push({ type: 'couple', a: gn[0], b: gn[1], ...marriageLabel(g.fam) });
    const from = gn.length === 2 ? { x: (gn[0].x + gn[1].x) / 2, y: -2 * ROW, couple: true } : { x: gn[0].x, y: -2 * ROW };
    links.push(descent(from, [g.pn]));
  }

  // ── Bounds ────────────────────────────────────────────────────────────────
  const all = [...nodes.values()];
  const bounds = {
    x0: Math.min(...all.map(left)) - 40, x1: Math.max(...all.map(right)) + 40,
    y0: Math.min(...all.map(n => n.y)) - CARD.h / 2 - 40, y1: Math.max(...all.map(n => n.y)) + CARD.h / 2 + 40,
  };
  return { nodes: all, links, bounds };
}

/** A parent→children connector: down from the parent (or couple midpoint) to a bus, across, then down to each child. */
function descent(from, toNodes) {
  const childTop = toNodes[0].y - CARD.h / 2;
  const fromY = from.couple ? from.y + 10 : from.y + CARD.h / 2;   // couple links start at the marriage line
  const busY = childTop - GAP.row * 0.45;
  return { type: 'descent', from: { x: from.x, y: fromY }, to: toNodes.map(n => ({ x: n.x, y: childTop })), busY, dashed: !!from.offset };
}

/** Compact column heading for narrow (zoomed-out) columns. */
export function shortLabel(g, first) {
  if (g === 1) return first;
  if (g === 2) return 'Grand';
  if (g === 3) return 'Great';
  return `${g - 2}× great`;
}
