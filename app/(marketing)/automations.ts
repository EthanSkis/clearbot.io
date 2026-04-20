// Marketing-page data. Kept in a plain TS module so the marketing
// client component + any future SSR reads share one source of truth.

export interface Service {
  id: string;
  name: string;
  meta: string;
  body: string;
}

export interface ProcessStep {
  n: string;
  name: string;
  body: string;
}

export interface Collaborator {
  name: string;
  logoSrc: string;
  href?: string;
}

export const SERVICES: Service[] = [
  {
    id: 'brand',
    name: 'Brand & graphic design',
    meta: 'identity · graphics',
    body: 'Logos, identity systems, and one-off graphics. Shipped as a Figma library plus a PDF guide, so every poster, post, and page stays on-brand.'
  },
  {
    id: 'web',
    name: 'Website design',
    meta: 'new builds',
    body: 'Marketing sites and landing pages, built from scratch. On-brand, fast, analytics-wired. Next.js, Framer, or Webflow — whichever fits the job.'
  },
  {
    id: 'rescue',
    name: 'Website rescues',
    meta: 'fixes · redesigns',
    body: 'Your site isn’t landing. I take what’s there, keep what works, and redesign the rest until it reads like the business you actually are.'
  },
  {
    id: 'copy',
    name: 'Landing-page copy',
    meta: 'words · conversion',
    body: 'Headlines, hero, features, FAQ, CTAs. Three angles drafted fast, then tightened until the page actually sounds like you and earns the click.'
  },
  {
    id: 'audit',
    name: 'Site & brand audit',
    meta: 'teardown · 48h',
    body: 'A written teardown of your site or brand — hierarchy, clarity, tone, consistency — with five prioritized fixes. Flat fee, back in your inbox in 48 hours.'
  },
  {
    id: 'naming',
    name: 'Naming & taglines',
    meta: 'sprint · 2 days',
    body: 'Twenty name candidates, ten taglines, domain checks, and a shortlist with rationale. Two-day sprint for new ventures or products that need a sharper hook.'
  },
  {
    id: 'ads',
    name: 'Ad creative packs',
    meta: 'static · motion',
    body: 'Static and motion ad variants for Meta, Google, and LinkedIn. Ten creatives a pack, each in three aspect ratios, copy hooks and layouts tuned to your audience.'
  },
  {
    id: 'content',
    name: 'Content engine',
    meta: 'retainer · monthly',
    body: 'A monthly drop of on-brand social graphics and captions for LinkedIn, Instagram, and X. You stay posting without stopping to design every single tile.'
  },
  {
    id: 'video',
    name: 'Motion & video',
    meta: 'loops · teasers',
    body: 'Animated logos, hero loops, and short product teasers. Fast turnarounds for sites, ads, and launches that need something moving, not another still.'
  },
  {
    id: 'deck',
    name: 'Pitch-deck design',
    meta: 'narrative · slides',
    body: 'Investor and sales decks, ten to fifteen slides. Narrative structured first, then designed as a system you can extend yourself without breaking the look.'
  },
  {
    id: 'icons',
    name: 'Illustration & icon packs',
    meta: 'custom set',
    body: 'Custom icon sets or spot-illustration packs matched to your brand. Twenty icons or ten illustrations, shipped as editable vector for wherever they need to go.'
  }
];

export const PROCESS: ProcessStep[] = [
  { n: '01', name: 'Brief',   body: 'A quick form, or a 30-minute call. I learn what you sell, who buys it, and what the work needs to do.' },
  { n: '02', name: 'Concept', body: 'I come back within a couple days with a direction — mood, sketches, rationale. You react; I sharpen.' },
  { n: '03', name: 'Make',    body: 'I build the thing end to end — identity, site, graphic. You see progress, not a black box.' },
  { n: '04', name: 'Ship',    body: 'Work goes live in your channels. I stick around to tune anything that isn’t earning its keep.' }
];

// Collaborators / clients the studio has shipped work for.
// Drop SVG marks into public/assets/collaborators/ and add rows here.
export const COLLABORATORS: Collaborator[] = [
  { name: 'Brand 01', logoSrc: '/assets/collaborators/mark-01.svg' },
  { name: 'Brand 02', logoSrc: '/assets/collaborators/mark-02.svg' },
  { name: 'Brand 03', logoSrc: '/assets/collaborators/mark-03.svg' }
];
