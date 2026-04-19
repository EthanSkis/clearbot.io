/* ──────────────────────────────────────────────────────────
   ClearBot homepage — interactive schematic flowchart
   Data + rendering are plain DOM. No framework dependency.
   ────────────────────────────────────────────────────────── */

// ── Data ────────────────────────────────────────────────────

const AUTOMATIONS = [
  {
    id: 'brief-to-brand',
    title: 'Brief → full brand system',
    summary:
      'One intake form becomes a logo, palette, type system, and guidelines doc. Our bots run the creative moves an agency team would — in 48 hours, not 8 weeks.',
    steps: '7 steps · 4 deliverables · ~48h runtime',
    runsPerWeek: 9,
    nodes: [
      { id: 'brief',    role: 'trigger', label: 'Brand brief',   sub: 'intake form · call recap',        col: 0, row: 1 },
      { id: 'research', role: 'agent',   label: 'Research',      sub: 'category · competitors · mood',   col: 1, row: 1 },
      { id: 'concept',  role: 'agent',   label: 'Concept',       sub: '3 directions · rationale',        col: 2, row: 0 },
      { id: 'refs',     role: 'source',  label: 'Reference set', sub: 'curated board · 40 refs',         col: 2, row: 2 },
      { id: 'review',   role: 'branch',  label: 'Client pick',   sub: 'approve · revise · restart',      col: 3, row: 1 },
      { id: 'build',    role: 'action',  label: 'Build system',  sub: 'logo · type · color · grid',      col: 4, row: 1 },
      { id: 'ship',     role: 'sink',    label: 'Brand kit',     sub: 'Figma · PDF guide · assets',      col: 5, row: 1 },
    ],
    edges: [
      ['brief', 'research'], ['research', 'concept'], ['research', 'refs'],
      ['concept', 'review'], ['refs', 'review'], ['review', 'build'], ['build', 'ship'],
    ],
  },
  {
    id: 'concept-to-campaign',
    title: 'Concept → live multi-channel campaign',
    summary:
      'A campaign concept becomes ready-to-run Meta, Google, TikTok, and email creative — sized, copywritten, tagged, and pushed to ad accounts.',
    steps: '8 steps · 4 channels · ~6h runtime',
    runsPerWeek: 14,
    nodes: [
      { id: 'conc',     role: 'trigger', label: 'Campaign concept', sub: 'positioning · hook',       col: 0, row: 1 },
      { id: 'audience', role: 'agent',   label: 'Audience map',     sub: 'segments · pain points',   col: 1, row: 1 },
      { id: 'copy',     role: 'agent',   label: 'Copy variants',    sub: '12 hooks · 3 tones',       col: 2, row: 0 },
      { id: 'art',      role: 'agent',   label: 'Art direction',    sub: 'key visuals · layouts',    col: 2, row: 2 },
      { id: 'cut',      role: 'action',  label: 'Cut to formats',   sub: '4:5 · 1:1 · 9:16 · email', col: 3, row: 1 },
      { id: 'gate',     role: 'branch',  label: 'Brand check',      sub: 'tone · legal · usage',     col: 4, row: 1 },
      { id: 'meta',     role: 'sink',    label: 'Meta Ads',         sub: 'ad sets drafted',          col: 5, row: 0 },
      { id: 'ga',       role: 'sink',    label: 'Google Ads',       sub: 'RSAs · extensions',        col: 5, row: 1 },
      { id: 'email',    role: 'sink',    label: 'Email · CRM',      sub: 'sequence scheduled',       col: 5, row: 2 },
    ],
    edges: [
      ['conc', 'audience'], ['audience', 'copy'], ['audience', 'art'],
      ['copy', 'cut'], ['art', 'cut'], ['cut', 'gate'],
      ['gate', 'meta'], ['gate', 'ga'], ['gate', 'email'],
    ],
  },
  {
    id: 'request-to-landing',
    title: 'Request → landing page live',
    summary:
      'A one-line page request becomes a live, on-brand landing page with copy, imagery, analytics, and A/B variants — deployed behind your own domain.',
    steps: '7 steps · 1 deploy · ~3h runtime',
    runsPerWeek: 22,
    nodes: [
      { id: 'req',    role: 'trigger', label: 'Page request', sub: 'Slack · form',         col: 0, row: 1 },
      { id: 'wire',   role: 'agent',   label: 'Wireframe',    sub: 'sections · hierarchy', col: 1, row: 1 },
      { id: 'assets', role: 'source',  label: 'Brand assets', sub: 'kit · photography',    col: 2, row: 0 },
      { id: 'write',  role: 'agent',   label: 'Write',        sub: 'hero · value · CTA',   col: 2, row: 2 },
      { id: 'build',  role: 'action',  label: 'Build',        sub: 'Webflow · Next.js',    col: 3, row: 1 },
      { id: 'qa',     role: 'branch',  label: 'QA',           sub: 'perf · a11y · brand',  col: 4, row: 1 },
      { id: 'ship',   role: 'sink',    label: 'Deployed',     sub: 'live URL · GA · CRM',  col: 5, row: 1 },
    ],
    edges: [
      ['req', 'wire'], ['wire', 'assets'], ['wire', 'write'],
      ['assets', 'build'], ['write', 'build'], ['build', 'qa'], ['qa', 'ship'],
    ],
  },
  {
    id: 'calendar-to-content',
    title: 'Calendar → monthly content drop',
    summary:
      'Monday morning, last month’s performance plus this month’s themes turn into 20 posts, 4 blog drafts, and a newsletter — scheduled across every channel.',
    steps: '6 steps · 3 channels · ~2h runtime',
    runsPerWeek: 4,
    nodes: [
      { id: 'cal',   role: 'trigger', label: 'Mon 7:00',    sub: 'calendar cue',                col: 0, row: 1 },
      { id: 'perf',  role: 'source',  label: 'Last month',  sub: 'GA · LinkedIn · IG',          col: 1, row: 1 },
      { id: 'plan',  role: 'agent',   label: 'Plan themes', sub: 'what worked · what’s next',   col: 2, row: 1 },
      { id: 'write', role: 'agent',   label: 'Draft',       sub: '20 posts · 4 blogs · email',  col: 3, row: 1 },
      { id: 'check', role: 'branch',  label: 'Tone check',  sub: 'brand voice · fact-check',    col: 4, row: 1 },
      { id: 'sched', role: 'sink',    label: 'Scheduled',   sub: 'Buffer · Ghost · Klaviyo',    col: 5, row: 1 },
    ],
    edges: [
      ['cal', 'perf'], ['perf', 'plan'], ['plan', 'write'],
      ['write', 'check'], ['check', 'sched'],
    ],
  },
  {
    id: 'footage-to-ad',
    title: 'Raw footage → edited video ad',
    summary:
      'Drop in raw footage and a product one-liner. Out comes a cut, captioned, music-scored video ad in 1:1, 9:16, and 16:9 — ready to run.',
    steps: '7 steps · 3 cuts · ~45 min runtime',
    runsPerWeek: 31,
    nodes: [
      { id: 'upload',  role: 'trigger', label: 'Upload',         sub: 'footage · brief',        col: 0, row: 1 },
      { id: 'trans',   role: 'action',  label: 'Transcribe',     sub: 'whisper · timecodes',    col: 1, row: 1 },
      { id: 'pick',    role: 'agent',   label: 'Pick moments',   sub: 'hook · payoff · b-roll', col: 2, row: 1 },
      { id: 'score',   role: 'agent',   label: 'Score & caption',sub: 'music bed · kinetic',    col: 3, row: 0 },
      { id: 'cut',     role: 'action',  label: 'Render cuts',    sub: '1:1 · 9:16 · 16:9',      col: 3, row: 2 },
      { id: 'review',  role: 'branch',  label: 'Client review',  sub: 'approve · tweak',        col: 4, row: 1 },
      { id: 'deliver', role: 'sink',    label: 'Deliverables',   sub: 'Frame.io · ad accounts', col: 5, row: 1 },
    ],
    edges: [
      ['upload', 'trans'], ['trans', 'pick'], ['pick', 'score'], ['pick', 'cut'],
      ['score', 'review'], ['cut', 'review'], ['review', 'deliver'],
    ],
  },
];

const NODE_DETAIL = {
  'brief-to-brand:research': {
    body: 'Reads the brief alongside your category, scrapes 200+ competitor touchpoints, and distills a positioning map with whitespace flagged.',
    outputs: ['positioning', 'whitespace', 'mood refs'],
  },
  'brief-to-brand:concept': {
    body: 'Three distinct creative directions, each with logo sketches, type pairings, palette, and a one-paragraph rationale the client can react to.',
    outputs: ['3 directions', 'rationale', 'sample layouts'],
  },
  'brief-to-brand:build': {
    body: 'Once a direction is picked, builds the full system: logo lockups, type scale, color tokens, grid, iconography, motion rules, and a PDF guideline.',
    outputs: ['logo kit', 'type scale', 'tokens', 'guidelines'],
  },
  'concept-to-campaign:copy': {
    body: 'Generates twelve hook variants across three tones (direct, playful, earnest). Each is tagged by audience segment so downstream cuts can mix and match.',
    outputs: ['12 hooks', 'tone tags', 'segment tags'],
  },
  'concept-to-campaign:art': {
    body: 'Picks key visuals and lays out master templates for every placement. Composition rules, safe zones, and logo placement are all hard-coded into the template.',
    outputs: ['key visual', 'placements', 'template'],
  },
  'concept-to-campaign:cut': {
    body: 'Renders every approved copy × visual pair into 4:5, 1:1, 9:16, and email-ready sizes — naming convention matches your ad account taxonomy.',
    outputs: ['4:5', '1:1', '9:16', 'email'],
  },
  'request-to-landing:wire': {
    body: 'Reads the request and picks the right section pattern — hero, social proof, features, FAQ, CTA — from our library. You see the wireframe before a pixel gets pushed.',
    outputs: ['section list', 'layout', 'content brief'],
  },
  'request-to-landing:write': {
    body: 'Copy grounded in your brand voice doc. Hero, value props, and CTAs are written in three variants so the A/B test is ready on day one.',
    outputs: ['hero', 'body', 'CTAs (3 variants)'],
  },
  'request-to-landing:qa': {
    body: 'Runs Lighthouse, axe, a brand-tone check, and a fact-check against your claims doc. Anything < 95 or failing brand gets sent back before deploy.',
    outputs: ['perf', 'a11y', 'brand', 'facts'],
  },
  'calendar-to-content:plan': {
    body: 'Looks at what performed last month, your content pillars, and upcoming product beats — picks themes, cadence, and channel mix for the month.',
    outputs: ['themes', 'cadence', 'channel mix'],
  },
  'calendar-to-content:check': {
    body: 'Every draft runs through a tone check against your brand voice, a claims check against your facts doc, and a duplication check against the last 90 days.',
    outputs: ['tone score', 'claims ok', 'dedupe ok'],
  },
  'footage-to-ad:pick': {
    body: 'Reads the transcript, scores moments for hook strength and emotional beat, and assembles a first cut. You see the timeline with reasoning attached.',
    outputs: ['hook', 'beats', 'b-roll picks'],
  },
  'footage-to-ad:score': {
    body: 'Picks music from your licensed library to match energy curve, adds kinetic captions styled to your brand, and matches audio ducking to voiceover.',
    outputs: ['music bed', 'captions', 'mix'],
  },
};

const ROLE_META = {
  trigger: { tag: 'BRIEF'   },
  source:  { tag: 'ASSET'   },
  agent:   { tag: 'CRAFT'   },
  action:  { tag: 'PRODUCE' },
  branch:  { tag: 'REVIEW'  },
  sink:    { tag: 'SHIP'    },
};

const SERVICES = [
  { id: 'brand',   name: 'Brand systems',    meta: 'typical · 48 hours',
    body: 'Logo, type, color, voice, guidelines. A full identity shipped as Figma libraries and a PDF bible — ready for every downstream bot to draw from.' },
  { id: 'web',     name: 'Websites & pages', meta: 'typical · 3–72 hours',
    body: 'Marketing sites and campaign landers. On-brand, fast, analytics-wired, with A/B variants live on day one. Webflow, Framer, or custom Next.js.' },
  { id: 'ads',     name: 'Ads & campaigns',  meta: 'typical · 6 hours',
    body: 'Concept through live placements. Copy variants, sized creative, audience targeting, and media plans pushed straight to Meta, Google, and TikTok.' },
  { id: 'content', name: 'Content engine',   meta: 'retainer · from $4k/mo',
    body: 'Monthly content at the scale a human team can’t match. Social posts, blogs, newsletters, and repurposing flows tuned to your brand voice.' },
  { id: 'video',   name: 'Video & motion',   meta: 'typical · 45 min per cut',
    body: 'Ad cuts, explainers, and social video from raw footage or stock. Music scored, captioned, sized for every placement.' },
];

const PROCESS = [
  { n: '01', name: 'Brief',        body: 'Ten-minute intake form, or a 30-minute call if you prefer. We capture what you sell, who you sell to, and what the work needs to do.' },
  { n: '02', name: 'Concept',      body: 'Our bots return 3 directions within a day. You pick one, leave notes on another — the system learns what you mean by on-brand.' },
  { n: '03', name: 'Produce',      body: 'The winning direction fans out into every deliverable you need — identity, site, ads, video — cut from the same source of truth.' },
  { n: '04', name: 'Ship & tune',  body: 'Work goes live in your channels. We watch the numbers, iterate weekly, and retire creative the moment it stops earning its keep.' },
];

// ── State & layout constants ────────────────────────────────

const NODE_W = 180;
const NODE_H = 68;
const GEOM = { colW: 220, rowH: 120, padX: 40, padY: 50 };

const state = {
  automationIdx: 0,
  selectedNodeId: null,
  zoom: 1,
  pan: { x: 0, y: 0 },
  runTick: 0,
  runTimer: null,
};

// ── Helpers ─────────────────────────────────────────────────

const SVG_NS = 'http://www.w3.org/2000/svg';

function escape(s) {
  return String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

function layoutNodes(nodes) {
  return nodes.map(n => ({
    ...n,
    x: GEOM.padX + n.col * GEOM.colW,
    y: GEOM.padY + n.row * GEOM.rowH,
  }));
}

function connectorPath(a, b) {
  const dx = b.x - a.x;
  if (Math.abs(b.y - a.y) < 2) return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
  const c1x = a.x + dx * 0.55;
  const c2x = b.x - dx * 0.55;
  return `M ${a.x} ${a.y} C ${c1x} ${a.y}, ${c2x} ${b.y}, ${b.x} ${b.y}`;
}

function debounce(fn, ms) {
  let t;
  return function (...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), ms); };
}

// ── Renderers ───────────────────────────────────────────────

function renderServices() {
  const wrap = document.getElementById('services-grid');
  wrap.innerHTML = SERVICES.map((s, i) => `
    <article class="service">
      <div class="service-head">
        <span>SVC / ${String(i + 1).padStart(2, '0')}</span>
        <span class="meta">${escape(s.meta)}</span>
      </div>
      <h3 class="service-name">${escape(s.name)}</h3>
      <p class="service-body">${escape(s.body)}</p>
      <a class="service-cta" href="https://signup.clearbot.io/book?focus=${encodeURIComponent(s.id)}">Book a call about this
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
    </article>
  `).join('');
}

function renderGallery() {
  const wrap = document.getElementById('gallery');
  wrap.innerHTML = AUTOMATIONS.map((a, i) => `
    <button type="button" class="gallery-tab${i === state.automationIdx ? ' current' : ''}"
            data-idx="${i}" role="tab" aria-selected="${i === state.automationIdx}">
      <div class="gallery-fig">FIG. ${String(i + 1).padStart(2, '0')}</div>
      <div class="gallery-title">${escape(a.title)}</div>
      <div class="gallery-meta">${a.runsPerWeek.toLocaleString()} / wk</div>
    </button>
  `).join('');
  wrap.querySelectorAll('.gallery-tab').forEach(btn => {
    btn.addEventListener('click', () => loadAutomation(Number(btn.dataset.idx)));
  });
}

function updateGallery() {
  document.querySelectorAll('.gallery-tab').forEach(btn => {
    const isCurrent = Number(btn.dataset.idx) === state.automationIdx;
    btn.classList.toggle('current', isCurrent);
    btn.setAttribute('aria-selected', String(isCurrent));
  });
}

function renderProcess() {
  const wrap = document.getElementById('process-strip');
  wrap.innerHTML = PROCESS.map(p => `
    <div class="process-step">
      <div class="process-n">${escape(p.n)}</div>
      <div class="process-name">${escape(p.name)}</div>
      <p class="process-body">${escape(p.body)}</p>
    </div>
  `).join('');
}

// ── Flowchart ───────────────────────────────────────────────

function renderFlowchart() {
  const a = AUTOMATIONS[state.automationIdx];
  const placed = layoutNodes(a.nodes);
  const byId = Object.fromEntries(placed.map(n => [n.id, n]));

  const xs = placed.map(n => n.x);
  const ys = placed.map(n => n.y);
  const minX = Math.min(...xs) - NODE_W / 2;
  const maxX = Math.max(...xs) + NODE_W / 2;
  const minY = Math.min(...ys) - NODE_H / 2;
  const maxY = Math.max(...ys) + NODE_H / 2;

  const stageW = maxX + GEOM.padX;
  const stageH = maxY + GEOM.padY;

  const stage = document.getElementById('flowStage');
  stage.style.width  = stageW + 'px';
  stage.style.height = stageH + 'px';
  stage._bbox = { minX, maxX, minY, maxY };

  // Edges SVG
  const svg = document.getElementById('flowEdges');
  svg.setAttribute('width',  stageW);
  svg.setAttribute('height', stageH);
  svg.style.width  = stageW + 'px';
  svg.style.height = stageH + 'px';
  svg.innerHTML = '';

  const defs = document.createElementNS(SVG_NS, 'defs');
  defs.innerHTML = `
    <marker id="arrow-default" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#8a8880" />
    </marker>
    <marker id="arrow-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#ffffff" />
    </marker>
  `;
  svg.appendChild(defs);

  a.edges.forEach(([aId, bId]) => {
    const A = byId[aId], B = byId[bId];
    const from = { x: A.x + NODE_W / 2, y: A.y };
    const to   = { x: B.x - NODE_W / 2, y: B.y };
    const d = connectorPath(from, to);

    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'rgba(243, 241, 234, 0.16)');
    path.setAttribute('stroke-width', '1');
    if (A.role === 'branch') path.setAttribute('stroke-dasharray', '3 3');
    path.setAttribute('marker-end', 'url(#arrow-default)');
    path.dataset.from = aId;
    path.dataset.to   = bId;
    svg.appendChild(path);

    const packet = document.createElementNS(SVG_NS, 'circle');
    packet.setAttribute('r', '2.5');
    packet.setAttribute('cx', '0');
    packet.setAttribute('cy', '0');
    packet.classList.add('packet');
    packet.style.offsetPath = `path('${d}')`;
    packet.style.motionPath = `path('${d}')`;
    packet.dataset.to = bId;
    svg.appendChild(packet);
  });

  // Nodes
  const wrap = document.getElementById('flowNodes');
  wrap.innerHTML = '';
  placed.forEach(n => {
    const el = document.createElement('div');
    el.className = `node ${n.role}`;
    el.style.left   = (n.x - NODE_W / 2) + 'px';
    el.style.top    = (n.y - NODE_H / 2) + 'px';
    el.style.width  = NODE_W + 'px';
    el.style.height = NODE_H + 'px';
    el.dataset.id = n.id;
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', n.label);
    const tag = (ROLE_META[n.role] || {}).tag || n.role.toUpperCase();
    el.innerHTML = `
      <div class="node-role"><span class="node-role-dot"></span>${escape(tag)}</div>
      <div class="node-label">${escape(n.label)}</div>
      ${n.sub ? `<div class="node-sub">${escape(n.sub)}</div>` : ''}
      <span class="node-corner tl"></span><span class="node-corner br"></span>
    `;
    el.addEventListener('click', (e) => { e.stopPropagation(); selectNode(n.id); });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectNode(n.id); }
    });
    wrap.appendChild(el);
  });

  applySelection();
}

function applySelection() {
  document.querySelectorAll('.node').forEach(el => {
    el.classList.toggle('is-selected', el.dataset.id === state.selectedNodeId);
  });
  document.querySelectorAll('#flowEdges path[data-from]').forEach(p => {
    const active = p.dataset.from === state.selectedNodeId || p.dataset.to === state.selectedNodeId;
    p.setAttribute('stroke', active ? '#ffffff' : 'rgba(243, 241, 234, 0.16)');
    p.setAttribute('stroke-width', active ? '1.5' : '1');
    p.setAttribute('marker-end', `url(#arrow-${active ? 'active' : 'default'})`);
  });
}

function selectNode(id) {
  state.selectedNodeId = id;
  applySelection();
  renderDetail();
}

function renderDetail() {
  const a = AUTOMATIONS[state.automationIdx];
  const n = a.nodes.find(x => x.id === state.selectedNodeId);
  const body = document.getElementById('detailBody');
  const tag  = document.getElementById('detailTag');
  if (!n) { body.innerHTML = ''; tag.textContent = ''; return; }

  const step = a.nodes.findIndex(x => x.id === n.id) + 1;
  const roleTag = (ROLE_META[n.role] || {}).tag || '';
  tag.innerHTML = roleTag ? `<span>${escape(roleTag)}</span>` : '';

  const d = NODE_DETAIL[`${a.id}:${state.selectedNodeId}`];
  let html = `
    <div class="detail-step">STEP · ${step} / ${a.nodes.length}</div>
    <div class="detail-label">${escape(n.label)}</div>
    <div class="detail-sub">${escape(n.sub || '')}</div>
  `;
  if (d && d.body) html += `<p class="detail-body-text">${escape(d.body)}</p>`;
  if (d && d.outputs) {
    html += `<div class="detail-outputs-label">OUTPUTS</div>`;
    html += `<div class="detail-outputs">${d.outputs.map(o => `<code>${escape(o)}</code>`).join('')}</div>`;
  }
  body.innerHTML = html;
}

// ── Pan & zoom ──────────────────────────────────────────────

function applyTransform() {
  const stage = document.getElementById('flowStage');
  stage.style.transform = `translate(${state.pan.x}px, ${state.pan.y}px) scale(${state.zoom})`;
  const z = document.getElementById('flowZoomVal');
  if (z) z.textContent = Math.round(state.zoom * 100) + '%';
}

function clampZoom(z) { return Math.min(2.5, Math.max(0.4, z)); }

function zoomAt(nextZoom, cx, cy) {
  const nz = clampZoom(nextZoom);
  const z = state.zoom;
  state.pan.x = cx - ((cx - state.pan.x) * nz) / z;
  state.pan.y = cy - ((cy - state.pan.y) * nz) / z;
  state.zoom = nz;
  applyTransform();
}

function autoCenter() {
  const viewport = document.getElementById('flowViewport');
  const stage = document.getElementById('flowStage');
  if (!viewport || !stage || !stage._bbox) return;
  const rect = viewport.getBoundingClientRect();
  if (rect.width === 0) return;
  const { minX, maxX, minY, maxY } = stage._bbox;
  const cw = maxX - minX;
  const ch = maxY - minY;
  const margin = 24;
  const fit = Math.min(
    (rect.width  - margin * 2) / cw,
    (rect.height - margin * 2) / ch,
    1
  );
  const z = Math.max(0.4, fit);
  state.zoom = z;
  state.pan.x = rect.width  / 2 - ((minX + maxX) / 2) * z;
  state.pan.y = rect.height / 2 - ((minY + maxY) / 2) * z;
  applyTransform();
}

function setupPanZoom() {
  const viewport = document.getElementById('flowViewport');
  let drag = null;
  let moved = false;

  viewport.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.node')) return;
    if (e.button !== 0) return;
    viewport.setPointerCapture && viewport.setPointerCapture(e.pointerId);
    drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, px: state.pan.x, py: state.pan.y };
    moved = false;
    viewport.classList.add('dragging');
  });
  viewport.addEventListener('pointermove', (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    const dx = e.clientX - drag.sx;
    const dy = e.clientY - drag.sy;
    if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
    state.pan.x = drag.px + dx;
    state.pan.y = drag.py + dy;
    applyTransform();
  });
  const endDrag = (e) => {
    if (drag && drag.id === e.pointerId) {
      drag = null;
      viewport.classList.remove('dragging');
    }
    viewport.releasePointerCapture && viewport.releasePointerCapture(e.pointerId);
  };
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('pointerleave', endDrag);

  viewport.addEventListener('wheel', (e) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    const rect = viewport.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    zoomAt(state.zoom * Math.exp(-e.deltaY * 0.0015), cx, cy);
  }, { passive: false });

  document.querySelectorAll('.flow-zoom button').forEach(btn => {
    btn.addEventListener('click', () => {
      const rect = viewport.getBoundingClientRect();
      const cx = rect.width / 2, cy = rect.height / 2;
      const act = btn.dataset.act;
      if (act === 'in')  zoomAt(state.zoom * 1.2, cx, cy);
      if (act === 'out') zoomAt(state.zoom / 1.2, cx, cy);
      if (act === 'rst') autoCenter();
    });
  });
}

// ── Live-run animation ──────────────────────────────────────

function startLiveRun() {
  stopLiveRun();
  state.runTick = 0;
  stepLiveRun();
  state.runTimer = setInterval(stepLiveRun, 1400);
}

function stopLiveRun() {
  if (state.runTimer) clearInterval(state.runTimer);
  state.runTimer = null;
}

function stepLiveRun() {
  const a = AUTOMATIONS[state.automationIdx];
  const ids = a.nodes.map(n => n.id);
  const currentId = ids[state.runTick % ids.length];

  document.querySelectorAll('.node').forEach(el => {
    el.classList.toggle('is-active', el.dataset.id === currentId);
  });

  document.querySelectorAll('#flowEdges .packet').forEach(pk => {
    if (pk.dataset.to === currentId) {
      pk.classList.remove('running');
      void pk.getBoundingClientRect();
      pk.classList.add('running');
    }
  });

  state.runTick++;
}

// ── Automation loader ───────────────────────────────────────

function loadAutomation(idx) {
  state.automationIdx = idx;
  const a = AUTOMATIONS[idx];
  state.selectedNodeId = (a.nodes[2] && a.nodes[2].id) || a.nodes[0].id;

  document.getElementById('figLabel').textContent =
    `FIG. ${String(idx + 1).padStart(2, '0')} · ${a.id.replace(/-/g, ' ').toUpperCase()}`;
  document.getElementById('autoTitle').textContent = a.title;
  document.getElementById('autoMeta').textContent =
    `${a.steps} · ${a.runsPerWeek.toLocaleString()} runs / week`;

  renderFlowchart();
  renderDetail();
  updateGallery();
  requestAnimationFrame(() => autoCenter());
  state.runTick = 0;
}

// ── Init ────────────────────────────────────────────────────

function init() {
  renderServices();
  renderGallery();
  renderProcess();
  setupPanZoom();
  loadAutomation(0);
  startLiveRun();

  window.addEventListener('resize', debounce(() => autoCenter(), 150));

  if (typeof ResizeObserver !== 'undefined') {
    const vp = document.getElementById('flowViewport');
    let fired = false;
    const ro = new ResizeObserver(() => {
      if (fired) return;
      if (vp.getBoundingClientRect().width === 0) return;
      autoCenter();
      fired = true;
    });
    ro.observe(vp);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
