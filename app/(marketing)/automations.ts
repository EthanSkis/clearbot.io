// Data for the interactive brief-to-brand flowchart. Kept in a plain
// TS module so the marketing client component + any future SSR reads
// share one source of truth.

export type NodeRole = 'trigger' | 'source' | 'agent' | 'action' | 'branch' | 'sink';

export interface FlowNode {
  id: string;
  role: NodeRole;
  label: string;
  sub: string;
  col: number;
  row: number;
}

export interface Automation {
  id: string;
  title: string;
  summary: string;
  steps: string;
  runsPerWeek: number;
  nodes: FlowNode[];
  edges: [string, string][];
}

export const AUTOMATIONS: Automation[] = [
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
      { id: 'ship',     role: 'sink',    label: 'Brand kit',     sub: 'Figma · PDF guide · assets',      col: 5, row: 1 }
    ],
    edges: [
      ['brief', 'research'], ['research', 'concept'], ['research', 'refs'],
      ['concept', 'review'], ['refs', 'review'], ['review', 'build'], ['build', 'ship']
    ]
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
      { id: 'email',    role: 'sink',    label: 'Email · CRM',      sub: 'sequence scheduled',       col: 5, row: 2 }
    ],
    edges: [
      ['conc', 'audience'], ['audience', 'copy'], ['audience', 'art'],
      ['copy', 'cut'], ['art', 'cut'], ['cut', 'gate'],
      ['gate', 'meta'], ['gate', 'ga'], ['gate', 'email']
    ]
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
      { id: 'ship',   role: 'sink',    label: 'Deployed',     sub: 'live URL · GA · CRM',  col: 5, row: 1 }
    ],
    edges: [
      ['req', 'wire'], ['wire', 'assets'], ['wire', 'write'],
      ['assets', 'build'], ['write', 'build'], ['build', 'qa'], ['qa', 'ship']
    ]
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
      { id: 'sched', role: 'sink',    label: 'Scheduled',   sub: 'Buffer · Ghost · Klaviyo',    col: 5, row: 1 }
    ],
    edges: [
      ['cal', 'perf'], ['perf', 'plan'], ['plan', 'write'],
      ['write', 'check'], ['check', 'sched']
    ]
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
      { id: 'deliver', role: 'sink',    label: 'Deliverables',   sub: 'Frame.io · ad accounts', col: 5, row: 1 }
    ],
    edges: [
      ['upload', 'trans'], ['trans', 'pick'], ['pick', 'score'], ['pick', 'cut'],
      ['score', 'review'], ['cut', 'review'], ['review', 'deliver']
    ]
  }
];

export const NODE_DETAIL: Record<string, { body: string; outputs: string[] }> = {
  'brief-to-brand:research': { body: 'Reads the brief alongside your category, scrapes 200+ competitor touchpoints, and distills a positioning map with whitespace flagged.', outputs: ['positioning', 'whitespace', 'mood refs'] },
  'brief-to-brand:concept': { body: 'Three distinct creative directions, each with logo sketches, type pairings, palette, and a one-paragraph rationale the client can react to.', outputs: ['3 directions', 'rationale', 'sample layouts'] },
  'brief-to-brand:build': { body: 'Once a direction is picked, builds the full system: logo lockups, type scale, color tokens, grid, iconography, motion rules, and a PDF guideline.', outputs: ['logo kit', 'type scale', 'tokens', 'guidelines'] },
  'concept-to-campaign:copy': { body: 'Generates twelve hook variants across three tones (direct, playful, earnest). Each is tagged by audience segment so downstream cuts can mix and match.', outputs: ['12 hooks', 'tone tags', 'segment tags'] },
  'concept-to-campaign:art': { body: 'Picks key visuals and lays out master templates for every placement. Composition rules, safe zones, and logo placement are all hard-coded into the template.', outputs: ['key visual', 'placements', 'template'] },
  'concept-to-campaign:cut': { body: 'Renders every approved copy × visual pair into 4:5, 1:1, 9:16, and email-ready sizes — naming convention matches your ad account taxonomy.', outputs: ['4:5', '1:1', '9:16', 'email'] },
  'request-to-landing:wire': { body: 'Reads the request and picks the right section pattern — hero, social proof, features, FAQ, CTA — from our library. You see the wireframe before a pixel gets pushed.', outputs: ['section list', 'layout', 'content brief'] },
  'request-to-landing:write': { body: 'Copy grounded in your brand voice doc. Hero, value props, and CTAs are written in three variants so the A/B test is ready on day one.', outputs: ['hero', 'body', 'CTAs (3 variants)'] },
  'request-to-landing:qa': { body: 'Runs Lighthouse, axe, a brand-tone check, and a fact-check against your claims doc. Anything < 95 or failing brand gets sent back before deploy.', outputs: ['perf', 'a11y', 'brand', 'facts'] },
  'calendar-to-content:plan': { body: 'Looks at what performed last month, your content pillars, and upcoming product beats — picks themes, cadence, and channel mix for the month.', outputs: ['themes', 'cadence', 'channel mix'] },
  'calendar-to-content:check': { body: 'Every draft runs through a tone check against your brand voice, a claims check against your facts doc, and a duplication check against the last 90 days.', outputs: ['tone score', 'claims ok', 'dedupe ok'] },
  'footage-to-ad:pick': { body: 'Reads the transcript, scores moments for hook strength and emotional beat, and assembles a first cut. You see the timeline with reasoning attached.', outputs: ['hook', 'beats', 'b-roll picks'] },
  'footage-to-ad:score': { body: 'Picks music from your licensed library to match energy curve, adds kinetic captions styled to your brand, and matches audio ducking to voiceover.', outputs: ['music bed', 'captions', 'mix'] }
};

export const ROLE_TAGS: Record<NodeRole, string> = {
  trigger: 'BRIEF',
  source:  'ASSET',
  agent:   'CRAFT',
  action:  'PRODUCE',
  branch:  'REVIEW',
  sink:    'SHIP'
};

export const SERVICES = [
  { id: 'brand',   name: 'Brand systems',    meta: 'typical · 48 hours',      body: 'Logo, type, color, voice, guidelines. A full identity shipped as Figma libraries and a PDF bible — ready for every downstream bot to draw from.' },
  { id: 'web',     name: 'Websites & pages', meta: 'typical · 3–72 hours',    body: 'Marketing sites and campaign landers. On-brand, fast, analytics-wired, with A/B variants live on day one. Webflow, Framer, or custom Next.js.' },
  { id: 'ads',     name: 'Ads & campaigns',  meta: 'typical · 6 hours',       body: 'Concept through live placements. Copy variants, sized creative, audience targeting, and media plans pushed straight to Meta, Google, and TikTok.' },
  { id: 'content', name: 'Content engine',   meta: 'retainer · from $4k/mo', body: 'Monthly content at the scale a human team can’t match. Social posts, blogs, newsletters, and repurposing flows tuned to your brand voice.' },
  { id: 'video',   name: 'Video & motion',   meta: 'typical · 45 min per cut',body: 'Ad cuts, explainers, and social video from raw footage or stock. Music scored, captioned, sized for every placement.' }
];

export const PROCESS = [
  { n: '01', name: 'Brief',       body: 'Ten-minute intake form, or a 30-minute call if you prefer. We capture what you sell, who you sell to, and what the work needs to do.' },
  { n: '02', name: 'Concept',     body: 'Our bots return 3 directions within a day. You pick one, leave notes on another — the system learns what you mean by on-brand.' },
  { n: '03', name: 'Produce',     body: 'The winning direction fans out into every deliverable you need — identity, site, ads, video — cut from the same source of truth.' },
  { n: '04', name: 'Ship & tune', body: 'Work goes live in your channels. We watch the numbers, iterate weekly, and retire creative the moment it stops earning its keep.' }
];
