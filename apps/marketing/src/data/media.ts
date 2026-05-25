export const mediaAssets = [
  {
    id: "deck",
    type: "presentation" as const,
    title: "GigAI Bharat — Investor Deck",
    description: "Mobility OS → fintech infrastructure → sovereign worker data network.",
    href: "/contact/investors",
    cta: "Request deck",
    thumbnail: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/9f9c560b-8efb-460c-bda5-652ec61242fa",
  },
  {
    id: "fleet",
    type: "presentation" as const,
    title: "Fleet Partnership Presentation",
    description: "City-scale dispatch, EV coordination, and transparent settlement for fleet operators.",
    href: "/contact/partnerships",
    cta: "Request fleet deck",
    thumbnail: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/9f9c560b-8efb-460c-bda5-652ec61242fa",
  },
  {
    id: "video",
    type: "video" as const,
    title: "Workforce Operating System — Vision Film",
    description: "Cinematic overview of the worker-owned AI labor operating system for Bharat.",
    href: "/infrastructure",
    cta: "Watch command center demo",
    thumbnail: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/9f9c560b-8efb-460c-bda5-652ec61242fa",
  },
  {
    id: "kannada",
    type: "audio" as const,
    title: "Founder Vision — Kannada Narrative",
    description: "ಕನ್ನಡದಲ್ಲಿ ಗಿಗ್ ಕಾರ್ಮಿಕರ ಸಾರ್ವಭೌಮ OS ದೂರದೃಷ್ಟಿ.",
    href: "https://app.bharatgig.live/auth",
    cta: "Experience worker app",
    thumbnail: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/9f9c560b-8efb-460c-bda5-652ec61242fa",
  },
] as const;

export const roadmapPhases = [
  { phase: "2026 Q2", title: "Bengaluru pilot", items: ["ShramSetu live", "OCR ledger", "GigPay prototype"], status: "live" },
  { phase: "2026 Q4", title: "Tier-2 expansion", items: ["6 states", "Vernacular coach", "Fleet API"], status: "active" },
  { phase: "2027", title: "Neo-bank rails", items: ["Embedded lending", "Insurance", "UPI settlement"], status: "planned" },
  { phase: "2028+", title: "Smart Hub network", items: ["EV hubs", "Worker housing", "National mesh"], status: "planned" },
] as const;

export const infraStatus = [
  { service: "Marketing site (SSR)", status: "operational", uptime: "99.9%" },
  { service: "Worker app (SPA)", status: "operational", uptime: "99.9%" },
  { service: "Supabase + RLS", status: "operational", uptime: "99.95%" },
  { service: "OCR edge pipeline", status: "operational", uptime: "99.5%" },
  { service: "DigiLocker integration", status: "beta", uptime: "—" },
  { service: "Smart Hub physical nodes", status: "planning", uptime: "—" },
] as const;
