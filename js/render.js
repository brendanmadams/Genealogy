// Draws a layout (from layout.js) into the SVG and handles pan/zoom.
import { CARD } from './layout.js';
import { lifespan, initials, nameLines } from './data.js';

const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs = {}, text) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== undefined && v !== null) e.setAttribute(k, v);
  if (text !== undefined) e.textContent = text;
  return e;
};

export class Renderer {
  constructor(svg, D, onPick) {
    this.svg = svg; this.D = D; this.onPick = onPick;
    this.root = el('g', { class: 'viewport' });
    this.linkLayer = el('g', { class: 'links' });
    this.nodeLayer = el('g', { class: 'nodes' });
    this.root.append(this.linkLayer, this.nodeLayer);
    svg.appendChild(this.root);
    this.zoom = d3.zoom().scaleExtent([0.25, 2.5]).on('zoom', e => this.root.setAttribute('transform', e.transform));
    d3.select(svg).call(this.zoom).on('dblclick.zoom', null);
    this.bounds = null;
  }

  draw(layout) {
    this.linkLayer.replaceChildren();
    this.nodeLayer.replaceChildren();
    for (const t of layout.labels || []) {
      this.linkLayer.appendChild(el('text', { class: 'col-label', x: t.x, y: t.y, 'text-anchor': 'middle' }, t.text));
    }
    for (const l of layout.links) this.drawLink(l);
    for (const n of layout.nodes) this.drawNode(n);
    this.bounds = layout.bounds;
    this.focusNode = layout.focusNode || layout.nodes.find(n => n.role === 'focus');
  }

  drawLink(l) {
    if (l.type === 'elbow') {
      // child's right edge → vertical spine → each parent's left edge
      const x0 = l.from.x + CARD.w / 2, xm = x0 + (l.to[0].x - CARD.w / 2 - x0) / 2;
      let d = `M${x0},${l.from.y} H${xm}`;
      d += ` M${xm},${Math.min(...l.to.map(t => t.y))} V${Math.max(...l.to.map(t => t.y))}`;
      for (const t of l.to) d += ` M${xm},${t.y} H${t.x - CARD.w / 2}`;
      this.linkLayer.appendChild(el('path', { class: 'descent', d }));
      return;
    }
    if (l.type === 'couple') {
      const y = l.a.y;
      const x1 = l.a.x + CARD.w / 2, x2 = l.b.x - CARD.w / 2;
      this.linkLayer.appendChild(el('line', { class: 'couple', x1, y1: y, x2, y2: y }));
      if (l.label) this.linkLayer.appendChild(el('text', { class: 'marriage', x: (x1 + x2) / 2, y: y + CARD.h / 2 + 14, 'text-anchor': 'middle' }, l.label));
      return;
    }
    // descent
    const xs = l.to.map(t => t.x);
    let d = `M${l.from.x},${l.from.y} V${l.busY}`;
    const minX = Math.min(...xs, l.from.x), maxX = Math.max(...xs, l.from.x);
    if (maxX - minX > 0.5) d += ` M${minX},${l.busY} H${maxX}`;
    for (const t of l.to) d += ` M${t.x},${l.busY} V${t.y}`;
    this.linkLayer.appendChild(el('path', { class: 'descent' + (l.dashed ? ' dashed' : ''), d }));
  }

  drawUnknown(n) {
    const g = el('g', { class: 'card role-unknown', transform: `translate(${n.x - CARD.w / 2},${n.y - CARD.h / 2})` });
    g.appendChild(el('rect', { class: 'body', width: CARD.w, height: CARD.h, rx: 12 }));
    g.appendChild(el('text', { class: 'unknown-label', x: CARD.w / 2, y: CARD.h / 2 + 4, 'text-anchor': 'middle' }, n.label));
    g.appendChild(el('text', { class: 'ahnen', x: CARD.w - 8, y: 14, 'text-anchor': 'end' }, String(n.ahnen)));
    this.nodeLayer.appendChild(g);
  }

  drawNode(n) {
    if (n.role === 'unknown') return this.drawUnknown(n);
    const p = this.D.person(n.id);
    const color = this.D.color(p);
    const g = el('g', { class: `card role-${n.role}${n.half ? ' half' : ''}`, transform: `translate(${n.x - CARD.w / 2},${n.y - CARD.h / 2})`, tabindex: 0, role: 'button' });
    g.dataset.id = n.id;
    g.style.setProperty('--branch', color);
    g.appendChild(el('title', {}, `${p.name}${lifespan(p) ? ' · ' + lifespan(p) : ''}`));

    if (n.role === 'focus') g.appendChild(el('rect', { class: 'focus-ring', x: -5, y: -5, width: CARD.w + 10, height: CARD.h + 10, rx: 16 }));
    g.appendChild(el('rect', { class: 'body', width: CARD.w, height: CARD.h, rx: 12 }));
    g.appendChild(el('rect', { class: 'stripe', width: 5, height: CARD.h, rx: 2.5 }));

    // portrait: initials, replaced by images/<id>.jpg when one exists
    const cx = 34, cy = CARD.h / 2, r = 22;
    g.appendChild(el('circle', { class: 'avatar', cx, cy, r }));
    g.appendChild(el('text', { class: 'initials', x: cx, y: cy + 5, 'text-anchor': 'middle' }, initials(p)));
    if (p.photo) this.addPhoto(g, p, cx, cy, r);

    const [l1, l2] = nameLines(p);
    const long = (l1.length > 16 || l2.length > 16);
    const t1 = el('text', { class: 'name' + (long ? ' small' : ''), x: 66, y: l2 ? 26 : 36 }, l1);
    g.appendChild(t1);
    if (l2) g.appendChild(el('text', { class: 'name' + (long ? ' small' : ''), x: 66, y: 43 }, l2));
    const span = lifespan(p);
    if (span) g.appendChild(el('text', { class: 'dates', x: 66, y: l2 ? 59 : 54 }, span));
    if (n.half) g.appendChild(el('text', { class: 'tag', x: CARD.w - 8, y: 14, 'text-anchor': 'end' }, 'half'));
    if (n.ahnen) g.appendChild(el('text', { class: 'ahnen', x: CARD.w - 8, y: 14, 'text-anchor': 'end' }, String(n.ahnen)));
    if (n.role === 'repeat') g.appendChild(el('text', { class: 'tag', x: CARD.w - 8, y: CARD.h - 8, 'text-anchor': 'end' }, `same as ${n.repeatOf}`));
    if (n.more) {
      // ancestors continue beyond the generations shown
      g.appendChild(el('path', { class: 'more', d: `M${CARD.w + 6},${CARD.h / 2 - 7} l8,7 l-8,7` }));
    }
    if (p.living) g.appendChild(el('circle', { class: 'living', cx: CARD.w - 10, cy: CARD.h - 10, r: 3 }));

    const pick = () => this.onPick(n.id);
    g.addEventListener('click', pick);
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
    this.nodeLayer.appendChild(g);
  }

  addPhoto(g, p, cx, cy, r) {
    const clipId = `clip-${p.id}`;
    if (!this.svg.querySelector('#' + clipId)) {
      const clip = el('clipPath', { id: clipId });
      clip.appendChild(el('circle', { cx, cy, r }));
      this.svg.querySelector('defs').appendChild(clip);
    }
    g.appendChild(el('image', { href: p.photo, x: cx - r, y: cy - r, width: 2 * r, height: 2 * r, preserveAspectRatio: 'xMidYMid slice', 'clip-path': `url(#${clipId})` }));
  }

  /** Fit the drawing in the viewport (animated). */
  fit(animate = true) {
    if (!this.bounds) return;
    const b = this.bounds;
    const W = this.svg.clientWidth || 800, H = this.svg.clientHeight || 600;
    const MIN = 0.4;   // below this the text is unreadable; show the chosen person instead
    let k = Math.min(1.15, W / (b.x1 - b.x0), H / (b.y1 - b.y0));
    let tx = W / 2 - k * (b.x0 + b.x1) / 2, ty = H / 2 - k * (b.y0 + b.y1) / 2;
    if (k < MIN && this.focusNode) {
      k = MIN;
      const fitsWide = (b.x1 - b.x0) * k <= W;
      tx = fitsWide ? W / 2 - k * (b.x0 + b.x1) / 2 : 24 - k * b.x0;
      ty = H / 2 - k * this.focusNode.y;
    }
    const t = d3.zoomIdentity.translate(tx, ty).scale(k);
    const s = d3.select(this.svg);
    if (animate) s.transition().duration(520).ease(d3.easeCubicInOut).call(this.zoom.transform, t);
    else s.call(this.zoom.transform, t);
  }
  /** For printing: show the whole drawing via viewBox instead of the zoom transform. */
  printMode(on) {
    if (on && this.bounds) {
      const b = this.bounds;
      this.savedTransform = this.root.getAttribute('transform');
      this.root.removeAttribute('transform');
      this.svg.setAttribute('viewBox', `${b.x0} ${b.y0} ${b.x1 - b.x0} ${b.y1 - b.y0}`);
      this.svg.setAttribute('preserveAspectRatio', 'xMidYMin meet');
    } else {
      this.svg.removeAttribute('viewBox');
      if (this.savedTransform) this.root.setAttribute('transform', this.savedTransform);
    }
  }
  zoomBy(f) { d3.select(this.svg).transition().duration(200).call(this.zoom.scaleBy, f); }
}
