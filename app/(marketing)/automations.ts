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
  { name: 'Studio Mark 01', logoSrc: '/assets/collaborators/mark-01.svg' },
  { name: 'Studio Mark 02', logoSrc: '/assets/collaborators/mark-02.svg' },
  { name: 'Studio Mark 03', logoSrc: '/assets/collaborators/mark-03.svg' },
  { name: 'Studio Mark 04', logoSrc: '/assets/collaborators/mark-04.svg' },
  { name: 'Studio Mark 05', logoSrc: '/assets/collaborators/mark-05.svg' },
  { name: 'Studio Mark 06', logoSrc: '/assets/collaborators/mark-06.svg' }
];
