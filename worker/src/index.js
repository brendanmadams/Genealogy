// Cloudflare Worker: receives "Suggest a correction" submissions from the
// family site and files each one as an issue in a private GitHub repo, where
// it waits for review. Nothing reaches the public site until a reviewed
// change is committed to the site repo.
//
// Secrets (set with `npx wrangler secret put NAME`, never committed):
//   GITHUB_TOKEN      fine-grained token for the submissions repo only
//                     (Contents: read/write, Issues: read/write)
//   TURNSTILE_SECRET  Cloudflare Turnstile secret key
// Vars (wrangler.toml): REPO, ALLOWED_ORIGINS, SITE_URL; bindings AI and ASK_LIMITER
// Routes: POST / files a suggestion; POST /ask answers a question (see handleAsk)

const MAX_FILES = 3;
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const FILE_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'application/pdf': 'pdf' };
const KINDS = { correction: 'Correction', addition: 'New information', relative: 'Missing relative', media: 'Photo or document', other: 'Other' };
const LIMITS = { person_id: 120, person_name: 200, details: 5000, source: 2000, name: 120, email: 200, relation: 200, new_name: 150, new_relation: 30, new_status: 20, new_born: 60, new_died: 60, new_place: 200 };
const NEW_RELATIONS = { parent: 'parent', child: 'child', sibling: 'brother or sister', spouse: 'husband, wife or partner', other: 'other relation or not sure' };
const NEW_STATUS = { died: 'has died', living: 'living', unsure: 'not sure' };

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = env.ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean);
    const cors = allowed.includes(origin)
      ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Vary': 'Origin' }
      : {};
    const reply = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...cors } });

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return reply(405, { ok: false, error: 'POST only' });
    if (!cors['Access-Control-Allow-Origin']) return reply(403, { ok: false, error: 'Unknown origin' });
    if (new URL(request.url).pathname === '/ask') return handleAsk(request, env, reply);

    let form;
    try { form = await request.formData(); } catch { return reply(400, { ok: false, error: 'Could not read the form' }); }
    const field = k => String(form.get(k) ?? '').trim().slice(0, LIMITS[k] ?? 200);

    // Honeypot: people never see this field, so anything in it is a bot.
    if (String(form.get('website') ?? '').trim()) return reply(200, { ok: true, number: null });

    const human = await verifyTurnstile(env, String(form.get('cf-turnstile-response') ?? ''), request.headers.get('CF-Connecting-IP'));
    if (!human) return reply(400, { ok: false, error: 'The spam check did not pass. Please try again.' });

    const kind = KINDS[field('kind')] ? field('kind') : 'other';
    const s = {
      kind, person_id: field('person_id'), person_name: field('person_name'),
      details: field('details'), source: field('source'),
      name: field('name'), email: field('email'), relation: field('relation'),
      permission: form.get('permission') === 'yes',
      new_name: field('new_name'), new_relation: NEW_RELATIONS[field('new_relation')] ? field('new_relation') : '',
      new_status: NEW_STATUS[field('new_status')] ? field('new_status') : 'unsure',
      new_born: field('new_born'), new_died: field('new_died'), new_place: field('new_place'),
    };
    // living people: names and relationships only, whatever the browser sent
    if (s.new_status === 'living') s.new_born = s.new_died = s.new_place = '';
    if (kind === 'relative') {
      if (s.new_name.length < 2) return reply(400, { ok: false, error: 'Please give the missing relative’s name.' });
      if (!s.person_id && s.details.length < 10) return reply(400, { ok: false, error: 'Please say how they fit into the family.' });
    } else if (s.details.length < 10) return reply(400, { ok: false, error: 'Please describe the change in a sentence or two.' });
    if (s.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email)) return reply(400, { ok: false, error: 'That email address does not look right.' });

    const files = form.getAll('files').filter(f => f && typeof f === 'object' && f.size > 0);
    if (files.length > MAX_FILES) return reply(400, { ok: false, error: `Please attach at most ${MAX_FILES} files.` });
    for (const f of files) {
      if (!FILE_TYPES[f.type]) return reply(400, { ok: false, error: `${f.name}: only JPEG, PNG, WebP, GIF or PDF files, please.` });
      if (f.size > MAX_FILE_BYTES) return reply(400, { ok: false, error: `${f.name} is over 8 MB.` });
    }
    if (files.length && !s.permission) return reply(400, { ok: false, error: 'Please confirm you have the right to share the attached files.' });

    const stamp = new Date().toISOString();
    const ref = stamp.slice(0, 10) + '-' + crypto.randomUUID().slice(0, 8);
    const gh = (path, init = {}) => fetch(`https://api.github.com/repos/${env.REPO}${path}`, {
      ...init,
      headers: { 'Authorization': `Bearer ${env.GITHUB_TOKEN}`, 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'genealogy-submissions-worker', ...(init.body ? { 'Content-Type': 'application/json' } : {}) },
    });

    const uploaded = [];
    for (const [i, f] of files.entries()) {
      const safe = (f.name || 'file').replace(/\.[^.]*$/, '').replace(/[^A-Za-z0-9_-]+/g, '_').slice(0, 60) || 'file';
      const path = `uploads/${ref}/${i + 1}-${safe}.${FILE_TYPES[f.type]}`;
      const res = await gh(`/contents/${path}`, { method: 'PUT', body: JSON.stringify({ message: `Upload for submission ${ref}`, content: toBase64(await f.arrayBuffer()) }) });
      if (!res.ok) { console.error('GitHub upload failed', res.status, (await res.text()).slice(0, 300)); return reply(502, { ok: false, error: 'Could not store the attachment. Please try again later.' }); }
      uploaded.push({ name: f.name, path, size: f.size });
    }

    const person = s.person_id ? `${s.person_name || s.person_id} (\`${s.person_id}\`)` : 'General (not about one person)';
    const link = s.person_id ? `${env.SITE_URL}#/p/${encodeURIComponent(s.person_id)}` : env.SITE_URL;
    const quote = t => t ? t.split('\n').map(l => `> ${l}`).join('\n') : '> (none given)';
    const body = [
      `**Person:** ${person} · [open on the site](${link})`,
      `**Kind:** ${KINDS[kind]}`,
      ...(kind === 'relative' ? ['', '### The missing relative',
        `- Name: ${s.new_name}`,
        ...(s.person_id ? [`- Relationship to ${s.person_name || s.person_id}: ${s.new_relation ? NEW_RELATIONS[s.new_relation] : '(not given)'}`] : []),
        `- Living: ${NEW_STATUS[s.new_status]}`,
        ...(s.new_born ? [`- Born: ${s.new_born}`] : []),
        ...(s.new_died ? [`- Died: ${s.new_died}`] : []),
        ...(s.new_place ? [`- Where they lived: ${s.new_place}`] : [])] : []),
      '', kind === 'relative' ? (s.person_id ? '### Anything else about them' : '### How they fit into the family') : '### What should change', quote(s.details),
      '', '### Source or how they know', quote(s.source),
      '', '### Submitted by',
      `- Name: ${s.name || '(not given)'}`,
      `- Email: ${s.email || '(not given)'}`,
      `- Relationship to this person: ${s.relation || '(not given)'}`,
      ...(uploaded.length ? ['', '### Attachments', ...uploaded.map(u => `- [${u.name}](https://github.com/${env.REPO}/blob/main/${u.path}) (${Math.round(u.size / 1024)} KB)`), '', `Sender confirmed they have the right to share these: ${s.permission ? 'yes' : 'no'}`] : []),
      '', `<sub>Reference ${ref}, received ${stamp}</sub>`,
    ].join('\n');

    const title = kind === 'relative'
      ? `New relative: ${s.new_name}${s.person_id ? ` (${s.new_relation ? NEW_RELATIONS[s.new_relation] : 'relative'} of ${s.person_name || s.person_id})` : ''}`
      : `${s.person_name || 'General'}: ${KINDS[kind]}`;
    const res = await gh('/issues', { method: 'POST', body: JSON.stringify({ title: title.slice(0, 250), body, labels: ['pending', kind] }) });
    if (!res.ok) { console.error('GitHub issue failed', res.status, (await res.text()).slice(0, 300)); return reply(502, { ok: false, error: 'Could not save the suggestion. Please try again later.' }); }
    const issue = await res.json();
    return reply(200, { ok: true, number: issue.number, ref });
  },
};

// ── POST /ask: answer a question from the records the site sends ───────────
// The site sends the question, a label for the selection on screen and the
// records for that selection (already trimmed). The instructions below are
// fixed here, so a page cannot change them. Uses the free Workers AI
// allowance; on the free plan it stops for the day instead of billing.
const ASK_MODEL = '@cf/google/gemma-4-26b-a4b-it';
const ASK_SYSTEM = `You help relatives explore the Adams–McKeldin family history website. Answer the question using ONLY the family records provided. Each record starts with a person's id in square brackets.

Rules:
- Use only facts stated in the records. If they do not answer the question, say plainly what is and is not recorded. Never guess, and never fill gaps from general knowledge.
- Whenever you mention a person, put their id in square brackets right after the name, e.g. "Ellen Rogers Ball [ball_ellen_rogers]".
- Anything the records call UNPROVEN, "Inferred" or "Lead" must stay labelled as unproven in your answer.
- For people marked living, give only names and relationships.
- The records may begin with "Recorded connections", worked out from the family tree: the relationship between the people asked about and the route of people it runs through, closest first, with any other route (through a different marriage) marked "also". For questions about how people are related or connected, rely on these and mention every route listed.
- Be concise: at most about 200 words. Plain text only: short paragraphs, "- " for list items, **bold** sparingly. No headings or tables.`;

async function handleAsk(request, env, reply) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (env.ASK_LIMITER) {
    const { success } = await env.ASK_LIMITER.limit({ key: ip });
    if (!success) return reply(429, { ok: false, error: 'That is a lot of questions at once. Please wait a minute and try again.' });
  }
  let body;
  try { body = await request.json(); } catch { return reply(400, { ok: false, error: 'Could not read the question.' }); }
  const question = String(body?.question ?? '').trim().slice(0, 500);
  const scope = String(body?.scope ?? '').trim().slice(0, 200);
  const context = String(body?.context ?? '').slice(0, 30000);
  if (question.length < 3) return reply(400, { ok: false, error: 'Please type a question.' });
  if (!context.trim()) return reply(400, { ok: false, error: 'Open a person first, so there are records to read.' });
  try {
    const out = await env.AI.run(env.ASK_MODEL || ASK_MODEL, {
      messages: [
        { role: 'system', content: ASK_SYSTEM },
        { role: 'user', content: `Selection on screen: ${scope || 'not given'}\n\nRecords:\n${context}\n\nQuestion: ${question}` },
      ],
      max_tokens: 700,
      temperature: 0.2,
      chat_template_kwargs: { enable_thinking: false },   // answer directly; thinking used up the token budget
    });
    const answer = String(out?.response ?? out?.choices?.[0]?.message?.content ?? '').trim();
    if (!answer) throw new Error('empty answer');
    return reply(200, { ok: true, answer });
  } catch (e) {
    const msg = String(e?.message || e);
    console.error('AI failed', msg.slice(0, 300));
    if (/4006|daily free allocation|neurons/i.test(msg)) return reply(429, { ok: false, error: 'The AI has used its free allowance for today. The exact answers still work; try the AI again tomorrow.' });
    return reply(502, { ok: false, error: 'The AI could not answer just now. Please try again in a minute.' });
  }
}

async function verifyTurnstile(env, token, ip) {
  if (!token) return false;
  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const out = await res.json().catch(() => ({}));
  return out.success === true;
}

function toBase64(buf) {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
