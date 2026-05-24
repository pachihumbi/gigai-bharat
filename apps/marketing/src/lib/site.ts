/** Canonical production domain for GigAI Bharat public marketing site. */
export const productionSiteUrl = "https://www.bharatgig.live";

/** Public site URL — override with VITE_SITE_URL for preview deploys. */
export const siteUrl = (
  import.meta.env.VITE_SITE_URL ?? productionSiteUrl
).replace(/\/$/, "");

export const siteName = "GigAI Bharat";

export const siteTagline = "India's Worker-Owned Mobility Operating System";

export const siteDescription =
  "AI-powered infrastructure for gig workers, EV fleets, mobility finance, and digital labor ecosystems. GigPay, GigEV, GigPods, FleetOS, and ShramSetu — the digital public infrastructure layer for India's workforce economy.";

export const siteKeywords = [
  "GigAI Bharat",
  "Bharat Gig",
  "bharatgig.live",
  "gig economy India",
  "mobility operating system",
  "worker-owned AI",
  "gig workers India",
  "fleet dispatch India",
  "GigPay",
  "earnings ledger",
  "mobility tech startup India",
].join(", ");

export const contactEmail = "hello@bharatgig.live";

/** Absolute OG image URL — must be HTTPS for LinkedIn/Twitter cards. */
export const ogImage =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/9f9c560b-8efb-460c-bda5-652ec61242fa";

export const publicRoutes = [
  "/",
  "/join",
  "/hiring",
  "/manifesto",
  "/workers",
  "/cities",
  "/infrastructure",
  "/future",
  "/investors",
  "/smart-hub",
  "/shramsetu",
  "/founder",
  "/roadmap",
  "/ev-infrastructure",
  "/gurukul",
  "/status",
] as const;

export function absoluteUrl(path: string) {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
