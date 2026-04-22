/* ──────────────────────────────────────────────────────────
   ClearBot homepage — interactive schematic flowchart
   Data + rendering are plain DOM. No framework dependency.
   ────────────────────────────────────────────────────────── */

// ── Data ────────────────────────────────────────────────────

const AUTOMATIONS = [
  {
    id: 'renewal-lifecycle',
    title: 'License → filed renewal',
    summary:
      'A license record with an upcoming deadline becomes a pre-filled application, fees paid, confirmation downloaded, and a filing record in your vault — with human review only when a requirement changed.',
    steps: '7 steps · 3 outputs · ~6h runtime',
    runsPerWeek: 240,
    nodes: [
      { id: 'clock',    role: 'trigger', label: '90-day cue',      sub: 'deadline detector',             col: 0, row: 1 },
      { id: 'kb',       role: 'source',  label: 'Knowledge base',  sub: 'forms · fees · requirements',   col: 1, row: 0 },
      { id: 'record',   role: 'source',  label: 'License record',  sub: 'number · expiry · agency',      col: 1, row: 2 },
      { id: 'prep',     role: 'agent',   label: 'Prep packet',     sub: 'form fill · docs · fees',       col: 2, row: 1 },
      { id: 'gate',     role: 'branch',  label: 'Owner approval',  sub: 'in-app one-tap',                col: 3, row: 1 },
      { id: 'file',     role: 'action',  label: 'Submit to agency',sub: 'portal login · pay · confirm',  col: 4, row: 1 },
      { id: 'vault',    role: 'sink',    label: 'Filed + archived',sub: 'receipt · cert · audit log',    col: 5, row: 1 },
    ],
    edges: [
      ['clock', 'prep'], ['kb', 'prep'], ['record', 'prep'],
      ['prep', 'gate'], ['gate', 'file'], ['file', 'vault'],
    ],
  },
  {
    id: 'onboarding',
    title: 'Upload → every license mapped',
    summary:
      'Drop in your current licenses or connect state portals. Claude extracts every expiration date, license number, and agency — then maps each one to the ClearBot knowledge base so the renewal clock starts.',
    steps: '6 steps · N locations · ~30 min runtime',
    runsPerWeek: 18,
    nodes: [
      { id: 'upload', role: 'trigger', label: 'Licenses uploaded', sub: 'PDFs · portal pulls · photos', col: 0, row: 1 },
      { id: 'ocr',    role: 'action',  label: 'OCR + parse',       sub: 'Claude · vision',              col: 1, row: 1 },
      { id: 'map',    role: 'agent',   label: 'Map to KB',         sub: 'agency · license type',        col: 2, row: 1 },
      { id: 'gaps',   role: 'branch',  label: 'Gap check',         sub: 'missing docs · unknown types', col: 3, row: 0 },
      { id: 'sched',  role: 'action',  label: 'Build calendar',    sub: '90/60/30 reminders set',       col: 3, row: 2 },
      { id: 'dash',   role: 'sink',    label: 'Live dashboard',    sub: 'every license · every loc',    col: 4, row: 1 },
    ],
    edges: [
      ['upload', 'ocr'], ['ocr', 'map'],
      ['map', 'gaps'], ['map', 'sched'],
      ['gaps', 'dash'], ['sched', 'dash'],
    ],
  },
  {
    id: 'deadline-tracker',
    title: 'Calendar → 90/60/30 alerts',
    summary:
      'Every morning, ClearBot scans upcoming deadlines across every location and sends exactly-what-you-need reminders — with the form, the fee, the documents, and a one-click start-renewal link.',
    steps: '5 steps · 3 channels · ~90s runtime',
    runsPerWeek: 7,
    nodes: [
      { id: 'cron',   role: 'trigger', label: 'Daily 6:00',     sub: 'cron cue',                    col: 0, row: 1 },
      { id: 'scan',   role: 'agent',   label: 'Scan deadlines', sub: 'all locations · all licenses',col: 1, row: 1 },
      { id: 'tier',   role: 'branch',  label: 'Tier by urgency',sub: '90 · 60 · 30 · overdue',      col: 2, row: 1 },
      { id: 'draft',  role: 'agent',   label: 'Draft message',  sub: 'form · fee · docs needed',    col: 3, row: 1 },
      { id: 'email',  role: 'sink',    label: 'Email',          sub: 'owner + ops manager',         col: 4, row: 0 },
      { id: 'sms',    role: 'sink',    label: 'SMS',            sub: '30-day + overdue',            col: 4, row: 1 },
      { id: 'slack',  role: 'sink',    label: 'Slack / portal', sub: 'in-app card',                 col: 4, row: 2 },
    ],
    edges: [
      ['cron', 'scan'], ['scan', 'tier'], ['tier', 'draft'],
      ['draft', 'email'], ['draft', 'sms'], ['draft', 'slack'],
    ],
  },
  {
    id: 'auto-submit',
    title: 'Approved packet → filed with agency',
    summary:
      'For agencies with online portals, ClearBot logs in, fills the form, pays the fee, and downloads the confirmation — all under the customer account. Humans step in only when an agency requirement changes.',
    steps: '7 steps · N agencies · ~12 min per filing',
    runsPerWeek: 110,
    nodes: [
      { id: 'pkt',    role: 'trigger', label: 'Approved packet', sub: 'owner tapped "file"',          col: 0, row: 1 },
      { id: 'creds',  role: 'source',  label: 'Agency creds',    sub: 'vaulted · per-location',       col: 1, row: 1 },
      { id: 'bot',    role: 'agent',   label: 'Portal agent',    sub: 'Playwright · form mapping',    col: 2, row: 1 },
      { id: 'pay',    role: 'action',  label: 'Pay fee',         sub: 'Stripe-backed · agency card',  col: 3, row: 0 },
      { id: 'upload', role: 'action',  label: 'Attach docs',     sub: 'COI · certs · photos',         col: 3, row: 2 },
      { id: 'verify', role: 'branch',  label: 'Verify submit',   sub: 'confirmation number pulled',   col: 4, row: 1 },
      { id: 'done',   role: 'sink',    label: 'Filed',           sub: 'receipt · log · next date',    col: 5, row: 1 },
    ],
    edges: [
      ['pkt', 'bot'], ['creds', 'bot'],
      ['bot', 'pay'], ['bot', 'upload'],
      ['pay', 'verify'], ['upload', 'verify'], ['verify', 'done'],
    ],
  },
  {
    id: 'knowledge-base',
    title: 'Rejection → knowledge base updated',
    summary:
      'Every rejected filing is parsed by Claude, the changed requirement is isolated, and the knowledge base is patched — so every pending renewal in that jurisdiction is corrected before it files.',
    steps: '7 steps · cross-customer signal · ~5 min runtime',
    runsPerWeek: 12,
    nodes: [
      { id: 'reject', role: 'trigger', label: 'Rejection notice', sub: 'email · portal · letter',    col: 0, row: 1 },
      { id: 'parse',  role: 'agent',   label: 'Parse reason',     sub: 'Claude · rule extract',      col: 1, row: 1 },
      { id: 'diff',   role: 'agent',   label: 'Diff vs KB',       sub: 'what changed',               col: 2, row: 1 },
      { id: 'cross',  role: 'branch',  label: 'Cross-signal',     sub: '3+ same-jurisdiction = live',col: 3, row: 1 },
      { id: 'patch',  role: 'action',  label: 'Patch KB',         sub: 'form · fee · doc list',      col: 4, row: 0 },
      { id: 'resub',  role: 'action',  label: 'Re-prep pending',  sub: 'all affected filings',       col: 4, row: 2 },
      { id: 'alert',  role: 'sink',    label: 'Team notified',    sub: 'changelog · audit trail',    col: 5, row: 1 },
    ],
    edges: [
      ['reject', 'parse'], ['parse', 'diff'], ['diff', 'cross'],
      ['cross', 'patch'], ['cross', 'resub'],
      ['patch', 'alert'], ['resub', 'alert'],
    ],
  },
];

const NODE_DETAIL = {
  'renewal-lifecycle:kb': {
    body: 'The ClearBot knowledge base — every license type, agency, form version, fee schedule, and required document, for every jurisdiction you operate in. Updated automatically from agency portals and every filing outcome across the customer base.',
    outputs: ['current form', 'current fee', 'doc requirements'],
  },
  'renewal-lifecycle:prep': {
    body: 'Pulls the latest agency requirements from the KB, assembles the renewal packet: form pre-filled from your license record, the exact fee, and every required document from your vault. Ready to submit.',
    outputs: ['pre-filled form', 'doc bundle', 'fee total'],
  },
  'renewal-lifecycle:gate': {
    body: 'One-tap approval in the portal or app. Owner sees the packet, the fee, and any flagged changes since last year before authorizing submission. Auto-mode skips this once trust is built.',
    outputs: ['approved', 'flagged', 'snoozed'],
  },
  'renewal-lifecycle:file': {
    body: 'Logs into the agency portal using vaulted credentials, submits the form, pays the fee on the agency card, and captures the confirmation number. If the portal breaks, humans step in without missing the deadline.',
    outputs: ['confirmation #', 'receipt', 'next expiry'],
  },
  'onboarding:ocr': {
    body: 'Claude parses every uploaded license — scanned PDFs, portal screenshots, phone photos — and extracts license number, issuing agency, issue date, expiration, and any attached conditions.',
    outputs: ['license #', 'expiry', 'agency', 'conditions'],
  },
  'onboarding:map': {
    body: 'Every parsed license is matched to an entry in the ClearBot knowledge base — the canonical agency, the canonical license type, the current form version. Unknown types are flagged for human review.',
    outputs: ['KB match', 'agency id', 'unknown flag'],
  },
  'onboarding:gaps': {
    body: 'Compares your uploaded set to what the knowledge base says a business of your type and location should hold. Surfaces missing licenses, missing documents, and any that may have lapsed before onboarding.',
    outputs: ['missing licenses', 'missing docs', 'lapsed flags'],
  },
  'deadline-tracker:scan': {
    body: 'Every morning, scans every license on every location for upcoming deadlines. Tiers them by urgency, routes them to the right owner on your team, and drafts the alert body with exactly what is needed.',
    outputs: ['upcoming list', 'urgency tier', 'owner routing'],
  },
  'deadline-tracker:draft': {
    body: 'Composes a human-sounding reminder tailored to the specific license and jurisdiction. Includes the current form URL, the current fee, and a checklist of required documents pulled from the knowledge base.',
    outputs: ['form URL', 'fee', 'doc checklist', 'one-click start'],
  },
  'auto-submit:bot': {
    body: 'A Playwright agent that logs into the agency portal, navigates to the renewal form for your license type, and maps each field from the prep packet. Tested per-agency and version-gated against the knowledge base.',
    outputs: ['portal session', 'form mapping', 'field log'],
  },
  'auto-submit:verify': {
    body: 'After submit, the agent pulls the confirmation number from the receipt page, screenshots the submission, and writes both to the audit trail. If the receipt is missing, the filing is held and a human is paged immediately.',
    outputs: ['confirmation #', 'screenshot', 'audit entry'],
  },
  'knowledge-base:parse': {
    body: 'Rejection notices — email, PDF letter, portal message — are read by Claude to extract the exact rule that changed. Examples: new doc required, new fee, renamed form, changed filing window.',
    outputs: ['rule diff', 'affected form', 'effective date'],
  },
  'knowledge-base:cross': {
    body: 'One rejection could be a one-off. Three rejections from the same jurisdiction in the same week is a systemic change — the knowledge base is patched live and every pending renewal in that jurisdiction is re-prepped before it files.',
    outputs: ['cross-customer count', 'patch scope', 'live flag'],
  },
};

const ROLE_META = {
  trigger: { tag: 'SIGNAL' },
  source:  { tag: 'RECORD' },
  agent:   { tag: 'AGENT'  },
  action:  { tag: 'FILE'   },
  branch:  { tag: 'REVIEW' },
  sink:    { tag: 'DONE'   },
};

const SERVICES = [
  { id: 'essential',    name: 'Essential',    meta: '$500 / location / year · 1+ locations',
    body: 'Deadline tracking, document vault, and 90/60/30-day alerts with exactly what is needed. You file. We make sure you never forget.' },
  { id: 'standard',     name: 'Standard',     meta: '$800 / location / year · 3+ locations',
    body: 'Essential plus prep packets — pre-filled renewal forms, assembled documents, exact fees, ready to submit. You review and file.' },
  { id: 'professional', name: 'Professional', meta: '$1,200 / location / year · 5+ locations',
    body: 'Standard plus auto-submission. ClearBot logs into agency portals, fills the form, pays the fee, and captures the confirmation — you approve in-app.' },
  { id: 'enterprise',   name: 'Enterprise',   meta: 'custom · 20+ locations',
    body: 'Professional plus a dedicated ops lead, SLA on every filing, data exports, API access, and jurisdiction intelligence reports for your leadership team.' },
  { id: 'intelligence', name: 'Data licensing', meta: 'enterprise · from $15k/yr',
    body: 'Aggregated, anonymized jurisdiction intelligence — real-world processing times, fee changes, rejection patterns — licensed to CRE, insurance, and PE teams.' },
];

const PROCESS = [
  { n: '01', name: 'Onboard',    body: 'Upload your current licenses or connect your state portal account. We extract every expiration date, license number, and agency in under an hour.' },
  { n: '02', name: 'Map',        body: 'Each license is matched to our knowledge base. Missing licenses, lapsed permits, and gaps in your document vault are surfaced on day one.' },
  { n: '03', name: 'Track',      body: 'Deadlines become alerts. 90, 60, 30 days out — every renewal with the exact form, exact fee, and exact document list, routed to the right owner.' },
  { n: '04', name: 'File',       body: 'Choose Alert, Prep, or Auto mode per license. We file, pay, and log confirmations. Every filing becomes evidence in an audit-ready trail.' },
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

  const worldW = maxX + GEOM.padX;
  const worldH = maxY + GEOM.padY;

  const stage = document.getElementById('flowStage');
  stage._bbox = { minX, maxX, minY, maxY };
  stage._dims = { worldW, worldH };

  // Edges SVG — draw paths in world coords; viewBox + width/height scale them crisply.
  const svg = document.getElementById('flowEdges');
  svg.setAttribute('viewBox', `0 0 ${worldW} ${worldH}`);
  svg.setAttribute('preserveAspectRatio', 'none');
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
    el.dataset.worldX = (n.x - NODE_W / 2);
    el.dataset.worldY = (n.y - NODE_H / 2);
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

  applyZoomLayout();
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

let lastZoomLayout = null;

function applyZoomLayout() {
  const stage = document.getElementById('flowStage');
  if (!stage || !stage._dims) return;
  const z = state.zoom || 1;
  const { worldW, worldH } = stage._dims;
  const stageW = worldW * z;
  const stageH = worldH * z;
  stage.style.width  = stageW + 'px';
  stage.style.height = stageH + 'px';
  stage.style.setProperty('--zoom', z);

  const svg = document.getElementById('flowEdges');
  if (svg) {
    svg.setAttribute('width',  stageW);
    svg.setAttribute('height', stageH);
    svg.style.width  = stageW + 'px';
    svg.style.height = stageH + 'px';
  }

  document.querySelectorAll('#flowNodes .node').forEach(el => {
    const wx = parseFloat(el.dataset.worldX);
    const wy = parseFloat(el.dataset.worldY);
    el.style.left   = (wx * z) + 'px';
    el.style.top    = (wy * z) + 'px';
    el.style.width  = (NODE_W * z) + 'px';
    el.style.height = (NODE_H * z) + 'px';
  });

  lastZoomLayout = z;
}

function applyTransform() {
  const stage = document.getElementById('flowStage');
  stage.style.transform = `translate(${state.pan.x}px, ${state.pan.y}px)`;
  const z = document.getElementById('flowZoomVal');
  if (z) z.textContent = Math.round(state.zoom * 100) + '%';
  if (state.zoom !== lastZoomLayout) applyZoomLayout();
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
