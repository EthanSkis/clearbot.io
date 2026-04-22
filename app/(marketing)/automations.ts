// Marketing-page data. Kept in a plain TS module so the marketing
// client component + any future SSR reads share one source of truth.

export type ServiceTier = 'core' | 'fast' | 'production' | 'specialty';

export interface Service {
  id: string;
  name: string;
  meta: string;
  body: string;
  tier: ServiceTier;
}

export interface TierGroup {
  tier: ServiceTier;
  code: string;
  label: string;
  blurb: string;
}

export const TIER_GROUPS: TierGroup[] = [
  { tier: 'core',       code: '§ 01a', label: 'Plans · per location / year', blurb: 'Start where you are comfortable. Upgrade as trust is built.' },
  { tier: 'fast',       code: '§ 01b', label: 'Onboarding & discovery',      blurb: 'Get every license mapped before the first renewal hits.' },
  { tier: 'production', code: '§ 01c', label: 'Ongoing automations',         blurb: 'The systems that run every day across every location.' },
  { tier: 'specialty',  code: '§ 01d', label: 'Enterprise & data',           blurb: 'Tailored for 20+ location operators and intelligence buyers.' }
];

export interface ProcessStep {
  n: string;
  name: string;
  body: string;
}

export interface Collaborator {
  name: string;
  logoSrc: string;
  href: string;
}

export const SERVICES: Service[] = [
  {
    id: 'essential',
    tier: 'core',
    name: 'Essential',
    meta: '$500 / location / yr · 1+ locations',
    body: 'Deadline tracking across every license, a document vault for COIs and certifications, and 90/60/30-day alerts with exactly what each renewal needs. You file. We make sure you never forget.'
  },
  {
    id: 'standard',
    tier: 'core',
    name: 'Standard',
    meta: '$800 / location / yr · 3+ locations',
    body: 'Everything in Essential, plus prep packets — pre-filled renewal forms, assembled documents, and the exact fee, delivered ready-to-submit. You review and file.'
  },
  {
    id: 'professional',
    tier: 'core',
    name: 'Professional',
    meta: '$1,200 / location / yr · 5+ locations',
    body: 'Everything in Standard, plus auto-submission. ClearBot logs into agency portals under your account, fills the form, pays the fee, and downloads the confirmation. You approve in-app.'
  },
  {
    id: 'mapping',
    tier: 'fast',
    name: 'License discovery',
    meta: 'included · week 1',
    body: 'Upload your current licenses or connect your state portal. Claude extracts every expiration date, license number, and issuing agency in under an hour — nothing missed.'
  },
  {
    id: 'gaps',
    tier: 'fast',
    name: 'Gap audit',
    meta: 'included · week 1',
    body: 'We compare your license set to what the knowledge base says a business of your type and location should hold. Missing permits, lapsed certificates, and stale documents are surfaced on day one.'
  },
  {
    id: 'vault',
    tier: 'fast',
    name: 'Document vault',
    meta: 'always-on · every plan',
    body: 'Manager certifications, certificates of insurance, food-handler permits, health inspections — every recurring document your renewals need, stored once and attached automatically.'
  },
  {
    id: 'alerts',
    tier: 'production',
    name: 'Deadline engine',
    meta: 'daily · email + SMS + portal',
    body: '90, 60, and 30-day alerts tailored per license. Each one ships with the current form, the current fee, a checklist of required documents, and a one-click start-renewal link.'
  },
  {
    id: 'prep',
    tier: 'production',
    name: 'Prep packets',
    meta: 'Standard + Pro · per filing',
    body: 'For every upcoming renewal, a packet with the form pre-filled from your license record, every required document attached from the vault, and the exact fee total. Ready to submit in minutes.'
  },
  {
    id: 'autofile',
    tier: 'production',
    name: 'Portal auto-submission',
    meta: 'Professional · per filing',
    body: 'For agencies with online portals, a Playwright agent logs in under your credentials, completes the form, pays the fee, and captures the confirmation number — with a human fallback if anything breaks.'
  },
  {
    id: 'enterprise',
    tier: 'specialty',
    name: 'Enterprise',
    meta: 'custom · 20+ locations',
    body: 'Dedicated ops lead, SLA on every filing, data exports, API access, custom jurisdiction coverage, and role-based access for your legal, finance, and operations teams.'
  },
  {
    id: 'data',
    tier: 'specialty',
    name: 'Jurisdiction intelligence',
    meta: 'data license · from $15k/yr',
    body: 'Aggregated, anonymized data on real-world agency processing times, fee changes, and rejection patterns by metro — licensed to CRE, insurance underwriters, franchise brokers, and PE operators.'
  }
];

export const PROCESS: ProcessStep[] = [
  { n: '01', name: 'Onboard', body: 'Upload your current licenses or connect your state portal account. We extract every expiration date, license number, and agency in under an hour.' },
  { n: '02', name: 'Map',     body: 'Each license is matched to our knowledge base. Missing licenses, lapsed permits, and gaps in your document vault are surfaced on day one.' },
  { n: '03', name: 'Track',   body: 'Deadlines become alerts. 90, 60, 30 days out — every renewal with the exact form, exact fee, and exact document list, routed to the right owner.' },
  { n: '04', name: 'File',    body: 'Choose Alert, Prep, or Auto mode per license. We file, pay, and log confirmations. Every filing becomes evidence in an audit-ready trail.' }
];

// Collaborators / clients the studio has shipped work for.
// Drop SVG marks into public/assets/collaborators/ and add rows here.
export const COLLABORATORS: Collaborator[] = [
  { name: 'Brand 01', logoSrc: '/assets/collaborators/mark-01.svg', href: 'https://instagram.com/bollinger_bakes' },
  { name: 'Brand 02', logoSrc: '/assets/collaborators/mark-02.svg', href: 'https://example.com/brand-02' },
  { name: 'Brand 03', logoSrc: '/assets/collaborators/mark-03.svg', href: 'https://example.com/brand-03' }
];
