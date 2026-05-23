/** VinFast MPV platform — workforce mobility reference: vinfastauto.in/en/mpv7 */

export const vinfastMpv = {
  name: "VinFast MPV7",
  tagline: "Premium EV workforce mobility platform",
  referenceUrl: "https://vinfastauto.in/en/mpv7",
  rangeKm: 468,
  batteryKwh: 90,
  seats: 7,
  dcChargeMin: 25,
  operatingCostPerKm: 1.2,
  co2SavedPerTrip: "4.2 kg",
  fleetReady: true,
} as const;

export const vinfastShowcaseMetrics = [
  { label: "WLTP range", value: "468 km", sub: "City + highway mix" },
  { label: "DC fast charge", value: "25 min", sub: "10–80% SOC" },
  { label: "Operating cost", value: "₹1.2/km", sub: "vs ₹4.8 ICE fleet" },
  { label: "AI fleet uptime", value: "99.2%", sub: "Predictive maintenance" },
] as const;

export const securityFeatures = [
  { id: "verify", title: "AI driver verification", body: "Biometric + document OCR + behavioral trust score before every shift.", status: "live" },
  { id: "monitor", title: "Live safety monitoring", body: "Real-time trip telemetry, geofence alerts, and anomaly detection.", status: "live" },
  { id: "sos", title: "SOS emergency layer", body: "One-tap SOS routes to fleet command, police API, and worker welfare desk.", status: "live" },
  { id: "fatigue", title: "Fatigue prevention AI", body: "Rest-Lock system with 12h macro-rest and AI coaching interventions.", status: "live" },
  { id: "route", title: "Route risk analysis", body: "Palantir-grade risk scoring on corridors, time-of-day, and incident feeds.", status: "pilot" },
  { id: "surveillance", title: "Smart surveillance integration", body: "Opt-in dashcam + fleet command center with privacy-first DPDP design.", status: "pilot" },
  { id: "women", title: "Women safety protocols", body: "Verified routes, buddy dispatch, and priority SOS escalation.", status: "live" },
  { id: "command", title: "Fleet command center", body: "24/7 security ops with AI-assisted incident triage.", status: "live" },
] as const;

export const evCommandMetrics = [
  { label: "Fleet SOC avg", value: "74%", trend: "+3%" },
  { label: "Energy efficiency", value: "6.2 km/kWh", trend: "+8%" },
  { label: "Carbon avoided", value: "2,840 t/yr", trend: "↑" },
  { label: "Maintenance alerts", value: "12", trend: "−40%" },
] as const;

export const chargingHubs = [
  { name: "VinFast × GigAI Hub — Whitefield", slots: 24, solarMw: 1.2, windKw: 400, waitMin: 4 },
  { name: "Solar Carport — Koramangala", slots: 16, solarMw: 0.8, windKw: 0, waitMin: 6 },
  { name: "Worker Housing EV Yard — Electronic City", slots: 32, solarMw: 2.4, windKw: 200, waitMin: 3 },
] as const;

export const evFleetModules = [
  { id: "vinfast", title: "VinFast EV Fleet", metric: "MPV7 platform", sub: "Worker-owned mobility" },
  { id: "charge", title: "Smart Charging Grid", metric: "72 fast slots", sub: "Solar + wind powered" },
  { id: "security", title: "Security Command", metric: "24/7 SOC", sub: "AI-verified workforce" },
  { id: "dispatch", title: "AI Dispatch Mesh", metric: "1.8s p50", sub: "Battery-aware routing" },
  { id: "housing", title: "Worker EV Housing", metric: "840 units", sub: "Charge-at-home ready" },
  { id: "carbon", title: "Carbon Intelligence", metric: "−2,840 t/yr", sub: "Scope 2 avoided" },
] as const;

export const investorEvStory = [
  "India's EV workforce infrastructure layer — not a taxi company.",
  "VinFast fleet partnership + GigAI AI dispatch + sovereign worker data moat.",
  "Security-grade mobility with DPDP-native surveillance and SOS rails.",
  "Smart charging ecosystem amortized across worker housing + fleet hubs.",
] as const;
