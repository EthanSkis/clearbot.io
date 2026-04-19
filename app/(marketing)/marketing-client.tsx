'use client';
import { useEffect, useRef } from 'react';
import { AUTOMATIONS, NODE_DETAIL, ROLE_TAGS, SERVICES, PROCESS, type Automation, type NodeRole } from './automations';
import { SIGNUP_URL } from '@/lib/env';

const SVG_NS = 'http://www.w3.org/2000/svg';
const NODE_W = 180;
const NODE_H = 68;
const GEOM = { colW: 220, rowH: 120, padX: 40, padY: 50 };

interface Placed extends Automation['nodes'][number] { x: number; y: number }

function layoutNodes(nodes: Automation['nodes']): Placed[] {
  return nodes.map((n) => ({ ...n, x: GEOM.padX + n.col * GEOM.colW, y: GEOM.padY + n.row * GEOM.rowH }));
}
function connectorPath(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = b.x - a.x;
  if (Math.abs(b.y - a.y) < 2) return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
  const c1x = a.x + dx * 0.55;
  const c2x = b.x - dx * 0.55;
  return `M ${a.x} ${a.y} C ${c1x} ${a.y}, ${c2x} ${b.y}, ${b.x} ${b.y}`;
}
function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
  let t: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => { if (t) clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
function escape(s: unknown) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

export function MarketingHomeClient() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const state = { automationIdx: 0, selectedNodeId: null as string | null, zoom: 1, pan: { x: 0, y: 0 }, runTick: 0, runTimer: null as ReturnType<typeof setInterval> | null };
    let lastZoomLayout: number | null = null;

    const $ = (id: string) => root.querySelector<HTMLElement>(`#${id}`)!;
    const $$ = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));

    function renderServices() {
      $('services-grid').innerHTML = SERVICES.map((s, i) => `
        <article class="service">
          <div class="service-head">
            <span>SVC / ${String(i + 1).padStart(2, '0')}</span>
            <span class="meta">${escape(s.meta)}</span>
          </div>
          <h3 class="service-name">${escape(s.name)}</h3>
          <p class="service-body">${escape(s.body)}</p>
          <a class="service-cta" href="${SIGNUP_URL}/book?focus=${encodeURIComponent(s.id)}">Book a call about this
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
        </article>`).join('');
    }
    function renderGallery() {
      const wrap = $('gallery');
      wrap.innerHTML = AUTOMATIONS.map((a, i) => `
        <button type="button" class="gallery-tab${i === state.automationIdx ? ' current' : ''}" data-idx="${i}" role="tab" aria-selected="${i === state.automationIdx}">
          <div class="gallery-fig">FIG. ${String(i + 1).padStart(2, '0')}</div>
          <div class="gallery-title">${escape(a.title)}</div>
          <div class="gallery-meta">${a.runsPerWeek.toLocaleString()} / wk</div>
        </button>`).join('');
      wrap.querySelectorAll<HTMLButtonElement>('.gallery-tab').forEach((btn) => {
        btn.addEventListener('click', () => loadAutomation(Number(btn.dataset.idx)));
      });
    }
    function updateGallery() {
      $$('.gallery-tab').forEach((btn) => {
        const isCurrent = Number((btn as HTMLButtonElement).dataset.idx) === state.automationIdx;
        btn.classList.toggle('current', isCurrent);
        btn.setAttribute('aria-selected', String(isCurrent));
      });
    }
    function renderProcess() {
      $('process-strip').innerHTML = PROCESS.map((p) => `
        <div class="process-step">
          <div class="process-n">${escape(p.n)}</div>
          <div class="process-name">${escape(p.name)}</div>
          <p class="process-body">${escape(p.body)}</p>
        </div>`).join('');
    }

    function renderFlowchart() {
      const a = AUTOMATIONS[state.automationIdx];
      const placed = layoutNodes(a.nodes);
      const byId = Object.fromEntries(placed.map((n) => [n.id, n]));

      const xs = placed.map((n) => n.x);
      const ys = placed.map((n) => n.y);
      const minX = Math.min(...xs) - NODE_W / 2;
      const maxX = Math.max(...xs) + NODE_W / 2;
      const minY = Math.min(...ys) - NODE_H / 2;
      const maxY = Math.max(...ys) + NODE_H / 2;
      const worldW = maxX + GEOM.padX;
      const worldH = maxY + GEOM.padY;

      const stage = $('flowStage') as HTMLElement & { _bbox?: any; _dims?: any };
      stage._bbox = { minX, maxX, minY, maxY };
      stage._dims = { worldW, worldH };

      const svg = $('flowEdges') as unknown as SVGSVGElement;
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
        </marker>`;
      svg.appendChild(defs);

      a.edges.forEach(([aId, bId]) => {
        const A = byId[aId]; const B = byId[bId];
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
        path.dataset.from = aId; path.dataset.to = bId;
        svg.appendChild(path);
        const packet = document.createElementNS(SVG_NS, 'circle');
        packet.setAttribute('r', '2.5'); packet.setAttribute('cx', '0'); packet.setAttribute('cy', '0');
        packet.classList.add('packet');
        (packet.style as any).offsetPath = `path('${d}')`;
        (packet.style as any).motionPath = `path('${d}')`;
        packet.dataset.to = bId;
        svg.appendChild(packet);
      });

      const wrap = $('flowNodes');
      wrap.innerHTML = '';
      placed.forEach((n) => {
        const el = document.createElement('div');
        el.className = `node ${n.role}`;
        el.dataset.worldX = String(n.x - NODE_W / 2);
        el.dataset.worldY = String(n.y - NODE_H / 2);
        el.dataset.id = n.id;
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.setAttribute('aria-label', n.label);
        const tag = ROLE_TAGS[n.role as NodeRole] || n.role.toUpperCase();
        el.innerHTML = `
          <div class="node-role"><span class="node-role-dot"></span>${escape(tag)}</div>
          <div class="node-label">${escape(n.label)}</div>
          ${n.sub ? `<div class="node-sub">${escape(n.sub)}</div>` : ''}
          <span class="node-corner tl"></span><span class="node-corner br"></span>`;
        el.addEventListener('click', (e) => { e.stopPropagation(); selectNode(n.id); });
        el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectNode(n.id); } });
        wrap.appendChild(el);
      });
      applyZoomLayout();
      applySelection();
    }

    function applySelection() {
      $$('.node').forEach((el) => el.classList.toggle('is-selected', (el as HTMLElement).dataset.id === state.selectedNodeId));
      $$('#flowEdges path[data-from]').forEach((p) => {
        const el = p as unknown as SVGPathElement & { dataset: DOMStringMap };
        const active = el.dataset.from === state.selectedNodeId || el.dataset.to === state.selectedNodeId;
        el.setAttribute('stroke', active ? '#ffffff' : 'rgba(243, 241, 234, 0.16)');
        el.setAttribute('stroke-width', active ? '1.5' : '1');
        el.setAttribute('marker-end', `url(#arrow-${active ? 'active' : 'default'})`);
      });
    }
    function selectNode(id: string) { state.selectedNodeId = id; applySelection(); renderDetail(); }

    function renderDetail() {
      const a = AUTOMATIONS[state.automationIdx];
      const n = a.nodes.find((x) => x.id === state.selectedNodeId);
      const body = $('detailBody'); const tag = $('detailTag');
      if (!n) { body.innerHTML = ''; tag.textContent = ''; return; }
      const step = a.nodes.findIndex((x) => x.id === n.id) + 1;
      const roleTag = ROLE_TAGS[n.role as NodeRole] || '';
      tag.innerHTML = roleTag ? `<span>${escape(roleTag)}</span>` : '';
      const d = NODE_DETAIL[`${a.id}:${state.selectedNodeId}`];
      let html = `
        <div class="detail-step">STEP · ${step} / ${a.nodes.length}</div>
        <div class="detail-label">${escape(n.label)}</div>
        <div class="detail-sub">${escape(n.sub || '')}</div>`;
      if (d?.body) html += `<p class="detail-body-text">${escape(d.body)}</p>`;
      if (d?.outputs) { html += `<div class="detail-outputs-label">OUTPUTS</div><div class="detail-outputs">${d.outputs.map((o) => `<code>${escape(o)}</code>`).join('')}</div>`; }
      body.innerHTML = html;
    }

    function applyZoomLayout() {
      const stage = $('flowStage') as HTMLElement & { _dims?: any };
      if (!stage._dims) return;
      const z = state.zoom || 1;
      const { worldW, worldH } = stage._dims;
      const stageW = worldW * z; const stageH = worldH * z;
      stage.style.width = stageW + 'px'; stage.style.height = stageH + 'px';
      stage.style.setProperty('--zoom', String(z));
      const svg = $('flowEdges') as unknown as SVGElement;
      svg.setAttribute('width', String(stageW)); svg.setAttribute('height', String(stageH));
      (svg as unknown as HTMLElement).style.width = stageW + 'px';
      (svg as unknown as HTMLElement).style.height = stageH + 'px';
      $$('#flowNodes .node').forEach((el) => {
        const wx = parseFloat((el as HTMLElement).dataset.worldX || '0');
        const wy = parseFloat((el as HTMLElement).dataset.worldY || '0');
        el.style.left = wx * z + 'px'; el.style.top = wy * z + 'px';
        el.style.width = NODE_W * z + 'px'; el.style.height = NODE_H * z + 'px';
      });
      lastZoomLayout = z;
    }
    function applyTransform() {
      const stage = $('flowStage'); stage.style.transform = `translate(${state.pan.x}px, ${state.pan.y}px)`;
      const z = root.querySelector<HTMLElement>('#flowZoomVal'); if (z) z.textContent = Math.round(state.zoom * 100) + '%';
      if (state.zoom !== lastZoomLayout) applyZoomLayout();
    }
    const clampZoom = (z: number) => Math.min(2.5, Math.max(0.4, z));
    function zoomAt(nextZoom: number, cx: number, cy: number) {
      const nz = clampZoom(nextZoom); const z = state.zoom;
      state.pan.x = cx - ((cx - state.pan.x) * nz) / z;
      state.pan.y = cy - ((cy - state.pan.y) * nz) / z;
      state.zoom = nz; applyTransform();
    }
    function autoCenter() {
      const viewport = $('flowViewport'); const stage = $('flowStage') as HTMLElement & { _bbox?: any };
      if (!stage._bbox) return;
      const rect = viewport.getBoundingClientRect(); if (rect.width === 0) return;
      const { minX, maxX, minY, maxY } = stage._bbox;
      const cw = maxX - minX; const ch = maxY - minY; const margin = 24;
      const fit = Math.min((rect.width - margin * 2) / cw, (rect.height - margin * 2) / ch, 1);
      const z = Math.max(0.4, fit); state.zoom = z;
      state.pan.x = rect.width / 2 - ((minX + maxX) / 2) * z;
      state.pan.y = rect.height / 2 - ((minY + maxY) / 2) * z;
      applyTransform();
    }

    function setupPanZoom() {
      const viewport = $('flowViewport') as HTMLElement;
      let drag: { id: number; sx: number; sy: number; px: number; py: number } | null = null;
      viewport.addEventListener('pointerdown', (e) => {
        if ((e.target as HTMLElement).closest('.node')) return;
        if (e.button !== 0) return;
        viewport.setPointerCapture?.(e.pointerId);
        drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, px: state.pan.x, py: state.pan.y };
        viewport.classList.add('dragging');
      });
      viewport.addEventListener('pointermove', (e) => {
        if (!drag || drag.id !== e.pointerId) return;
        state.pan.x = drag.px + (e.clientX - drag.sx);
        state.pan.y = drag.py + (e.clientY - drag.sy);
        applyTransform();
      });
      const endDrag = (e: PointerEvent) => {
        if (drag && drag.id === e.pointerId) { drag = null; viewport.classList.remove('dragging'); }
        viewport.releasePointerCapture?.(e.pointerId);
      };
      viewport.addEventListener('pointerup', endDrag);
      viewport.addEventListener('pointercancel', endDrag);
      viewport.addEventListener('pointerleave', endDrag);
      viewport.addEventListener('wheel', (e) => {
        if (!(e.ctrlKey || e.metaKey)) return;
        e.preventDefault();
        const rect = viewport.getBoundingClientRect();
        zoomAt(state.zoom * Math.exp(-e.deltaY * 0.0015), e.clientX - rect.left, e.clientY - rect.top);
      }, { passive: false });
      $$('.flow-zoom button').forEach((btn) => {
        btn.addEventListener('click', () => {
          const rect = viewport.getBoundingClientRect();
          const cx = rect.width / 2, cy = rect.height / 2;
          const act = (btn as HTMLElement).dataset.act;
          if (act === 'in')  zoomAt(state.zoom * 1.2, cx, cy);
          if (act === 'out') zoomAt(state.zoom / 1.2, cx, cy);
          if (act === 'rst') autoCenter();
        });
      });
    }

    function startLiveRun() { stopLiveRun(); state.runTick = 0; stepLiveRun(); state.runTimer = setInterval(stepLiveRun, 1400); }
    function stopLiveRun() { if (state.runTimer) clearInterval(state.runTimer); state.runTimer = null; }
    function stepLiveRun() {
      const a = AUTOMATIONS[state.automationIdx];
      const ids = a.nodes.map((n) => n.id);
      const currentId = ids[state.runTick % ids.length];
      $$('.node').forEach((el) => el.classList.toggle('is-active', (el as HTMLElement).dataset.id === currentId));
      $$('#flowEdges .packet').forEach((pk) => {
        if ((pk as HTMLElement).dataset.to === currentId) {
          pk.classList.remove('running'); void (pk as HTMLElement).getBoundingClientRect(); pk.classList.add('running');
        }
      });
      state.runTick++;
    }

    function loadAutomation(idx: number) {
      state.automationIdx = idx;
      const a = AUTOMATIONS[idx];
      state.selectedNodeId = (a.nodes[2] && a.nodes[2].id) || a.nodes[0].id;
      $('figLabel').textContent = `FIG. ${String(idx + 1).padStart(2, '0')} · ${a.id.replace(/-/g, ' ').toUpperCase()}`;
      $('autoTitle').textContent = a.title;
      $('autoMeta').textContent = `${a.steps} · ${a.runsPerWeek.toLocaleString()} runs / week`;
      renderFlowchart(); renderDetail(); updateGallery();
      requestAnimationFrame(() => autoCenter());
      state.runTick = 0;
    }

    renderServices(); renderGallery(); renderProcess(); setupPanZoom();
    loadAutomation(0); startLiveRun();
    const onResize = debounce(() => autoCenter(), 150);
    window.addEventListener('resize', onResize);
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      const vp = $('flowViewport');
      let fired = false;
      ro = new ResizeObserver(() => { if (fired || vp.getBoundingClientRect().width === 0) return; autoCenter(); fired = true; });
      ro.observe(vp);
    }
    return () => { stopLiveRun(); window.removeEventListener('resize', onResize); ro?.disconnect(); };
  }, []);

  return (
    <div ref={rootRef}>
      <div className="stage">
        <article className="panel panel--flow">
          <span className="bracket bracket-tl" />
          <span className="bracket bracket-br" />
          <header className="panel-head">
            <span className="panel-fig" id="figLabel">FIG. 01 · BRIEF-TO-BRAND</span>
            <span className="status-tag"><span className="pulse-dot" /><span>IN RUN</span></span>
          </header>
          <div className="panel-sub">
            <div className="panel-sub-title" id="autoTitle">Brief → full brand system</div>
            <div className="panel-sub-meta" id="autoMeta">7 steps · 4 deliverables · ~48h runtime · 9 runs / week</div>
          </div>
          <div className="flow" id="flow">
            <div className="flow-viewport" id="flowViewport">
              <div className="flow-stage" id="flowStage">
                <svg className="flow-edges" id="flowEdges" aria-hidden="true" />
                <div className="flow-nodes" id="flowNodes" />
              </div>
            </div>
            <div className="flow-zoom" id="flowZoom">
              <button type="button" data-act="in" aria-label="Zoom in">+</button>
              <div className="flow-zoom-val" id="flowZoomVal">100%</div>
              <button type="button" data-act="out" aria-label="Zoom out">−</button>
              <button type="button" data-act="rst" aria-label="Reset view">RST</button>
            </div>
            <div className="flow-hint">drag to pan · ⌘/ctrl + scroll to zoom</div>
          </div>
          <footer className="panel-foot">
            <span>tap a node</span>
            <span className="legend"><span className="legend-shape trigger" />BRIEF</span>
            <span className="legend"><span className="legend-shape agent" />CRAFT</span>
            <span className="legend"><span className="legend-shape action" />PRODUCE</span>
            <span className="legend"><span className="legend-shape sink" />SHIP</span>
          </footer>
        </article>

        <aside className="panel panel--detail" id="detailPanel">
          <span className="bracket bracket-tl" />
          <span className="bracket bracket-br" />
          <header className="panel-head">
            <span>NODE · DETAIL</span>
            <span className="status-tag" id="detailTag" />
          </header>
          <div className="detail" id="detailBody" />
        </aside>
      </div>

      <div className="divider" id="services"><span>§ 01 · Services</span><span className="divider-line" /></div>
      <div className="services" id="services-grid" />

      <div className="divider"><span>§ 02 · Built-in automations</span><span className="divider-line" /></div>
      <div className="gallery" id="gallery" role="tablist" aria-label="Example workflows" />

      <div className="divider" id="process"><span>§ 03 · How we engage</span><span className="divider-line" /></div>
      <div className="process" id="process-strip" />
    </div>
  );
}
