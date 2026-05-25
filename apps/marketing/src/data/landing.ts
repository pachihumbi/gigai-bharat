import type { ChapterPath } from "./chapters";

export const heroStats = [
  { k: "VinFast EV fleet", v: "MPV7", sub: "Workforce mobility platform" },
  { k: "Smart charge hubs", v: "72", sub: "Solar + wind integrated" },
  { k: "Fleet SOC avg", v: "74%", sub: "AI battery intelligence" },
  { k: "Security SOC", v: "24/7", sub: "AI-verified workforce" },
] as const;

export const problemPoints = [
  {
    title: "Fragmented earnings",
    body: "Workers run 3–4 apps with no unified ledger, credit history, or tax-ready export.",
  },
  {
    title: "Platform lock-in",
    body: "Ratings, routes, and demand data live on platforms workers do not own or port.",
  },
  {
    title: "Unpaid idle time",
    body: "Hours lost hunting demand, charging EVs, or waiting — rarely compensated or measured.",
  },
  {
    title: "No bankable identity",
    body: "Irregular cash flows block loans, insurance, and access to social security schemes.",
  },
] as const;

export const solutionPillars = [
  {
    num: "01",
    title: "Worker-owned ledger",
    body: "OCR earnings parsing, RLS-bound storage, exportable history — your data, your score.",
  },
  {
    num: "02",
    title: "AI that serves labour",
    body: "Shift coach, vernacular voice, demand intelligence — not black-box surveillance.",
  },
  {
    num: "03",
    title: "GigPay & credit",
    body: "Virtual UPI wallet, Gig Credit Score, micro-loans tied to real earnings — not proxies.",
  },
  {
    num: "04",
    title: "Safety & compliance",
    body: "Rest-Lock fatigue management, audit trails, DPDP-aligned architecture from day one.",
  },
] as const;

export const coreModules = [
  {
    icon: "ledger",
    title: "Unified Earnings Ledger",
    status: "Live",
    body: "Multi-platform OCR converts screenshots into structured earnings and a bankable Gig Credit Score.",
  },
  {
    icon: "coach",
    title: "Vernacular Shift Coach",
    status: "Roadmap",
    body: "Kannada & Hindi voice dispatch — demand hotspots, EV charging, and idle-time reduction.",
  },
  {
    icon: "pay",
    title: "GigPay Neo-Bank",
    status: "Prototype",
    body: "Virtual UPI wallet, micro-EMIs for EV rentals, contextual credit from verified ledger data.",
  },
  {
    icon: "safety",
    title: "ESG Rest-Lock",
    status: "Prototype",
    body: "Mandatory macro-rest after 12 active hours — driver safety and fleet risk reduction.",
  },
  {
    icon: "dpi",
    title: "Digital ShramSetu",
    status: "Live",
    body: "90-day engagement tracking toward Social Security Code via DigiLocker & UMANG APIs.",
  },
  {
    icon: "mesh",
    title: "City Dispatch Mesh",
    status: "Live",
    body: "Real-time demand heatmaps, settlement reconciliation, and model-weight coordination.",
  },
] as const;

export const trustSignals = [
  { label: "Architecture", value: "Supabase RLS + Edge AI" },
  { label: "Compliance posture", value: "DPDP-first design" },
  { label: "Pilot geography", value: "Bengaluru → Tier-2" },
  { label: "Open source", value: "MIT monorepo" },
] as const;

export const investorMetrics = [
  { value: "₹6.2L Cr", label: "Mobility GMV by 2030", sub: "Bharat TAM" },
  { value: "23.5M", label: "Gig workers addressable", sub: "Mobility & delivery" },
  { value: "38%", label: "Earnings opacity gap", sub: "vs transparent OS" },
  { value: "T+0", label: "OCR → ledger latency", sub: "Screenshot to credit" },
  { value: "14", label: "Pilot city nodes", sub: "Tier 1–3 expansion" },
  { value: "168h", label: "Unpaid idle / yr", sub: "Per driver (target)" },
] as const;

export type NavLink = {
  to: string;
  label: string;
  short?: string;
  external?: boolean;
};

export const primaryNav: NavLink[] = [
  { to: "/", label: "Home", short: "Home" },
  { to: "https://app.bharatgig.live/demo", label: "Worker App", short: "App", external: true },
  { to: "/infrastructure", label: "Infrastructure", short: "Infra" },
  { to: "/founder", label: "Founder", short: "Founder" },
  { to: "/investors", label: "Investor", short: "Investors" },
  { to: "/gurukul", label: "Gurukul AI", short: "Gurukul" },
  { to: "/join", label: "Join Workforce", short: "Join" },
];

export const founderQuote =
  "Technology should increase worker sovereignty, not platform dependency.";

export const contactLinks = {
  github: "https://github.com/pachihumbi/gigai-bharat",
  email: "hello@bharatgig.live",
  app: "https://app.bharatgig.live/demo",
  appAuth: "https://app.bharatgig.live/auth",
  investors: "mailto:hello@bharatgig.live?subject=GigAI%20Bharat%20-%20Investor%20Intro",
  fleet: "mailto:hello@bharatgig.live?subject=GigAI%20Bharat%20-%20Fleet%20Partnership",
} as const;

export const audienceCTAs = [
  {
    audience: "investors" as const,
    kicker: "For investors & policy",
    title: "The infrastructure layer for 23.5M workers.",
    body: "Worker-owned data moat, DPDP-native architecture, and Bharat-scale TAM in mobility GMV.",
    bullets: ["MIT open-source core", "RLS + audit trail", "Live command center demo"],
    ctaLabel: "Request intro",
    href: contactLinks.investors,
    primary: true,
  },
  {
    audience: "workers" as const,
    kicker: "For gig workers",
    title: "Own your earnings. Own your future.",
    body: "OCR ledger, Gig Credit Score, vernacular shift coach, and Rest-Lock safety — built for drivers on low-end Android.",
    bullets: ["Multi-app earnings OCR", "GigPay wallet & score", "Kannada / Hindi coach (roadmap)"],
    ctaLabel: "Start onboarding",
    href: "/join",
    primary: false,
  },
  {
    audience: "fleet" as const,
    kicker: "For fleet owners",
    title: "VinFast EV fleet at city scale.",
    body: "AI dispatch, SOC optimization, security command center, and smart charging — workforce mobility infrastructure, not ride-hail.",
    bullets: ["VinFast MPV7 platform", "24/7 security SOC", "Solar + wind charge hubs"],
    ctaLabel: "Partner with us",
    href: contactLinks.fleet,
    primary: false,
  },
] as const;

export const trustLayers = [
  {
    id: "security" as const,
    title: "Security",
    body: "Row Level Security on every worker table. JWT-gated AI endpoints. No service role in the browser.",
    proofs: ["Supabase RLS", "Edge Function auth", "Audit logging"],
  },
  {
    id: "compliance" as const,
    title: "Compliance",
    body: "DPDP Act 2023 principles embedded — data minimization, export, and purpose-bound processing.",
    proofs: ["DPDP-first design", "DigiLocker roadmap", "Settlement audit trail"],
  },
  {
    id: "ownership" as const,
    title: "Worker ownership",
    body: "Workers control their ledger, credit score, and export rights — platforms don't hold the keys.",
    proofs: ["Portable earnings", "Worker council pilot", "Open MIT core"],
  },
  {
    id: "ai" as const,
    title: "AI infrastructure",
    body: "Structured AI outputs, human-in-the-loop review, and vernacular models — not surveillance.",
    proofs: ["Gemini OCR pipeline", "Shift coach RAG", "Quota + audit"],
  },
] as const;
