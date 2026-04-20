// Mirror of app/(marketing)/automations.ts SERVICES + TIER_GROUPS.
// Canonical source is the TS module — keep in sync when services change.
// Used by the static client/team portals which can't import .ts directly.

export const TIER_GROUPS = [
  { tier: 'core',       code: '§ 01a', label: 'Core · flagship',     blurb: 'The three lanes most engagements land in.' },
  { tier: 'fast',       code: '§ 01b', label: 'Fast-turn add-ons',   blurb: 'Pure-LLM deliverables. Sprints, not projects.' },
  { tier: 'production', code: '§ 01c', label: 'Production · series', blurb: 'Multi-asset output, often on retainer.' },
  { tier: 'specialty',  code: '§ 01d', label: 'Specialty',           blurb: 'Craft-heavy, scope-specific commissions.' }
];

export const SERVICES = [
  { id: 'brand',   tier: 'core',       name: 'Brand & graphic design',     meta: 'identity · graphics' },
  { id: 'web',     tier: 'core',       name: 'Website design',             meta: 'new builds' },
  { id: 'rescue',  tier: 'core',       name: 'Website rescues',            meta: 'fixes · redesigns' },
  { id: 'copy',    tier: 'fast',       name: 'Landing-page copy',          meta: 'words · conversion' },
  { id: 'audit',   tier: 'fast',       name: 'Site & brand audit',         meta: 'teardown · 48h' },
  { id: 'naming',  tier: 'fast',       name: 'Naming & taglines',          meta: 'sprint · 2 days' },
  { id: 'ads',     tier: 'production', name: 'Ad creative packs',          meta: 'static · motion' },
  { id: 'content', tier: 'production', name: 'Content engine',             meta: 'retainer · monthly' },
  { id: 'video',   tier: 'production', name: 'Motion & video',             meta: 'loops · teasers' },
  { id: 'deck',    tier: 'specialty',  name: 'Pitch-deck design',          meta: 'narrative · slides' },
  { id: 'icons',   tier: 'specialty',  name: 'Illustration & icon packs',  meta: 'custom set' }
];

const TIER_LETTER = { core: 'a', fast: 'b', production: 'c', specialty: 'd' };

export function getService(id) {
  if (!id) return null;
  return SERVICES.find((s) => s.id === id) || null;
}

export function getTier(tier) {
  return TIER_GROUPS.find((t) => t.tier === tier) || null;
}

export function servicesByTier() {
  const out = TIER_GROUPS.map((g) => ({ ...g, items: [] }));
  for (const svc of SERVICES) {
    const bucket = out.find((g) => g.tier === svc.tier);
    if (bucket) bucket.items.push(svc);
  }
  return out;
}

// Stable code like `SVC / 01a-02` (tier-letter + zero-padded index within tier).
export function serviceCode(id) {
  const svc = getService(id);
  if (!svc) return '';
  const letter = TIER_LETTER[svc.tier] || 'x';
  const peers = SERVICES.filter((s) => s.tier === svc.tier);
  const idx = peers.findIndex((s) => s.id === id) + 1;
  return `SVC / 01${letter}-${String(idx).padStart(2, '0')}`;
}

export function serviceTag(id) {
  const svc = getService(id);
  if (!svc) return '';
  return `${serviceCode(id)} · ${svc.name}`;
}

export function tierLabel(tier) {
  const t = getTier(tier);
  return t ? t.label : tier;
}
