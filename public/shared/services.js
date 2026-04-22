// Mirror of app/(marketing)/automations.ts SERVICES + TIER_GROUPS.
// Canonical source is the TS module — keep in sync when services change.
// Used by the static client/team portals which can't import .ts directly.

export const TIER_GROUPS = [
  { tier: 'core',       code: '§ 01a', label: 'Plans · per location / year', blurb: 'Start where you are comfortable. Upgrade as trust is built.' },
  { tier: 'fast',       code: '§ 01b', label: 'Onboarding & discovery',      blurb: 'Get every license mapped before the first renewal hits.' },
  { tier: 'production', code: '§ 01c', label: 'Ongoing automations',         blurb: 'The systems that run every day across every location.' },
  { tier: 'specialty',  code: '§ 01d', label: 'Enterprise & data',           blurb: 'Tailored for 20+ location operators and intelligence buyers.' }
];

export const SERVICES = [
  { id: 'essential',    tier: 'core',       name: 'Essential',                 meta: '$500 / loc / yr · 1+ locations' },
  { id: 'standard',     tier: 'core',       name: 'Standard',                  meta: '$800 / loc / yr · 3+ locations' },
  { id: 'professional', tier: 'core',       name: 'Professional',              meta: '$1,200 / loc / yr · 5+ locations' },
  { id: 'mapping',      tier: 'fast',       name: 'License discovery',        meta: 'included · week 1' },
  { id: 'gaps',         tier: 'fast',       name: 'Gap audit',                 meta: 'included · week 1' },
  { id: 'vault',        tier: 'fast',       name: 'Document vault',            meta: 'always-on · every plan' },
  { id: 'alerts',       tier: 'production', name: 'Deadline engine',          meta: 'daily · email + SMS + portal' },
  { id: 'prep',         tier: 'production', name: 'Prep packets',              meta: 'Standard + Pro · per filing' },
  { id: 'autofile',     tier: 'production', name: 'Portal auto-submission',    meta: 'Professional · per filing' },
  { id: 'enterprise',   tier: 'specialty',  name: 'Enterprise',                meta: 'custom · 20+ locations' },
  { id: 'data',         tier: 'specialty',  name: 'Jurisdiction intelligence', meta: 'data license · from $15k/yr' }
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
