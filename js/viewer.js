// Full-screen viewer for photos, documents and album pages.
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export class Viewer {
  constructor(D, onPick) {
    this.D = D; this.onPick = onPick;
    this.el = document.createElement('div');
    this.el.id = 'viewer';
    this.el.hidden = true;
    this.el.setAttribute('role', 'dialog');
    this.el.setAttribute('aria-modal', 'true');
    document.body.appendChild(this.el);
    this.el.addEventListener('click', e => {
      if (e.target === this.el || e.target.closest('.v-close')) return this.close();
      if (e.target.closest('.v-prev')) return this.step(-1);
      if (e.target.closest('.v-next')) return this.step(1);
      const who = e.target.closest('[data-person]');
      if (who) { this.close(); this.onPick(who.dataset.person); }
    });
    document.addEventListener('keydown', e => {
      if (this.el.hidden) return;
      if (e.key === 'Escape') { e.stopPropagation(); this.close(); }
      if (e.key === 'ArrowLeft') this.step(-1);
      if (e.key === 'ArrowRight') this.step(1);
    }, true);
  }

  open(id, page = 0) {
    this.item = this.D.media.get(id);
    if (!this.item) return;
    this.page = page;
    this.render();
    this.el.hidden = false;
    this.el.querySelector('.v-close').focus();
  }
  close() { this.el.hidden = true; this.el.replaceChildren(); }
  step(d) {
    const n = this.item.files.length;
    if (n < 2) return;
    this.page = (this.page + d + n) % n;
    this.render();
  }

  render() {
    const m = this.item, f = m.files[this.page], multi = m.files.length > 1;
    const body = /\.pdf$/i.test(f)
      ? `<iframe class="v-pdf" src="${f}" title="${esc(m.title)}"></iframe>`
      : `<img class="v-img" src="${f}" alt="${esc(m.title)}" />`;
    const people = m.people.map(id => this.D.person(id)).filter(Boolean)
      .map(p => `<button class="chip" data-person="${p.id}" style="--branch:${this.D.color(p)}"><span class="chip-name">${esc(p.name)}</span></button>`).join('');
    this.el.innerHTML = `
      <div class="v-frame">
        <div class="v-stage">${body}
          ${multi ? `<button class="v-prev" aria-label="Previous page">‹</button><button class="v-next" aria-label="Next page">›</button>` : ''}
        </div>
        <aside class="v-info">
          <button class="icon-btn v-close" aria-label="Close">✕</button>
          <h2>${esc(m.title)}</h2>
          ${multi ? `<div class="v-page">Page ${this.page + 1} of ${m.files.length}</div>` : ''}
          ${m.caption ? `<p>${esc(m.caption)}</p>` : ''}
          ${m.source ? `<p class="muted">Source: ${esc(m.source)}</p>` : ''}
          ${people ? `<h3>People</h3><div class="chips">${people}</div>` : ''}
          <p><a class="v-open" href="${f}" target="_blank" rel="noopener">Open full size ↗</a></p>
        </aside>
      </div>`;
  }
}
