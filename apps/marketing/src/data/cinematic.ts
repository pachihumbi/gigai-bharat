/** Cinematic homepage data — GigAI Bharat infrastructure platform */

export const heroHeadline = "India's AI Operating System For Gig Workers";
export const heroSubheadline =
  "Earn, travel, recharge, learn, and build financial identity in one installable super app — GigPay, GigEV, GigPods, and AI co-pilot for 23.5M workers.";

export const gigPayMetrics = [
  { label: "Instant payouts", value: "T+0", sub: "UPI rail · 24/7 settlement" },
  { label: "Wallet balance avg", value: "₹12,840", sub: "Across 4.2M active wallets" },
  { label: "Daily disbursements", value: "₹847 Cr", sub: "Real-time ledger sync" },
  { label: "Savings yield", value: "6.8% APY", sub: "Worker-owned neo-bank pool" },
  { label: "Insurance coverage", value: "₹5L", sub: "Accident + health bundle" },
  { label: "Gig Credit Score", value: "742 avg", sub: "OCR-verified earnings" },
] as const;

export const gigPayTransactions = [
  { id: "1", type: "payout", desc: "Swiggy shift settlement", amount: "+₹2,840", time: "2m ago", status: "settled" },
  { id: "2", type: "upi", desc: "UPI → family transfer", amount: "−₹5,000", time: "18m ago", status: "complete" },
  { id: "3", type: "savings", desc: "Auto-save (10% rule)", amount: "+₹284", time: "2m ago", status: "credited" },
  { id: "4", type: "insurance", desc: "Health premium debit", amount: "−₹149", time: "1h ago", status: "active" },
  { id: "5", type: "payout", desc: "Uber trip batch", amount: "+₹1,920", time: "3h ago", status: "settled" },
] as const;

export const evFleet = [
  {
    id: "limo-green",
    name: "VinFast Limo Green MPV",
    category: "Premium fleet",
    rangeKm: 450,
    batteryKwh: 92,
    chargeMin: 22,
    costPerKm: 1.1,
    fleetCount: 1240,
    socAvg: 78,
    aiRec: "Airport corridor · 7-seat premium",
    accent: "cyan" as const,
  },
  {
    id: "vf5",
    name: "VinFast VF 5",
    category: "Urban compact",
    rangeKm: 326,
    batteryKwh: 37,
    chargeMin: 18,
    costPerKm: 0.9,
    fleetCount: 2840,
    socAvg: 72,
    aiRec: "Last-mile delivery · tight lanes",
    accent: "saffron" as const,
  },
  {
    id: "vf7",
    name: "VinFast VF 7",
    category: "Crossover SUV",
    rangeKm: 431,
    batteryKwh: 70,
    chargeMin: 24,
    costPerKm: 1.0,
    fleetCount: 1680,
    socAvg: 74,
    aiRec: "Inter-city · weather-adaptive routing",
    accent: "cyan" as const,
  },
  {
    id: "mpv7",
    name: "VinFast MPV 7",
    category: "Workforce flagship",
    rangeKm: 468,
    batteryKwh: 90,
    chargeMin: 25,
    costPerKm: 1.2,
    fleetCount: 3200,
    socAvg: 76,
    aiRec: "Shift dispatch · 7-seat workforce",
    accent: "cyan" as const,
  },
  {
    id: "evo",
    name: "VinFast Evo Scooters",
    category: "Micro-mobility",
    rangeKm: 120,
    batteryKwh: 3.5,
    chargeMin: 45,
    costPerKm: 0.35,
    fleetCount: 8400,
    socAvg: 68,
    aiRec: "Hyperlocal · food & parcel",
    accent: "saffron" as const,
  },
  {
    id: "nexon",
    name: "Tata Nexon EV",
    category: "Bharat crossover",
    rangeKm: 465,
    batteryKwh: 40.5,
    chargeMin: 56,
    costPerKm: 1.05,
    fleetCount: 1920,
    socAvg: 71,
    aiRec: "Tier-2 expansion · proven service",
    accent: "saffron" as const,
  },
  {
    id: "xuv400",
    name: "Mahindra XUV400",
    category: "Fleet SUV",
    rangeKm: 456,
    batteryKwh: 39.4,
    chargeMin: 50,
    costPerKm: 1.08,
    fleetCount: 1560,
    socAvg: 73,
    aiRec: "Security fleet · rugged corridors",
    accent: "cyan" as const,
  },
] as const;

export const gigPodsFacilities = [
  {
    id: "sleep",
    title: "Smart Worker Pods",
    subtitle: "goSTOPS-inspired capsule rest",
    capacity: "840 pods",
    metric: "4.2h avg rest",
    features: ["Climate-controlled capsules", "Biometric check-in", "Shift-sync wake alarms"],
    accent: "neon" as const,
  },
  {
    id: "charge",
    title: "EV Charging Hubs",
    subtitle: "Tesla-grade supercharge grid",
    capacity: "72 fast slots",
    metric: "4 min wait p50",
    features: ["Solar + wind hybrid", "Battery swap lanes", "Fleet SOC orchestration"],
    accent: "saffron" as const,
  },
  {
    id: "gurukul",
    title: "Gurukul AI Centers",
    subtitle: "Vernacular skill acceleration",
    capacity: "14 city nodes",
    metric: "5 min certification",
    features: ["KN · HI · TA · TE voice", "Earnings multiplier tracks", "Live dispatch coaching"],
    accent: "neon" as const,
  },
  {
    id: "recovery",
    title: "Rest & Recovery Zones",
    subtitle: "Fatigue prevention infrastructure",
    capacity: "320 bays",
    metric: "12h Rest-Lock",
    features: ["Macro-rest enforcement", "Nutrition + hydration", "Wellness telemetry"],
    accent: "saffron" as const,
  },
  {
    id: "command",
    title: "AI Dispatch Command",
    subtitle: "Palantir-grade ops center",
    capacity: "24/7 SOC",
    metric: "1.8s match p50",
    features: ["Demand heatmaps", "Fleet rerouting AI", "Incident triage console"],
    accent: "neon" as const,
  },
] as const;

export const fleetOsMetrics = [
  { label: "Active fleet units", value: "18,840", trend: "+12%" },
  { label: "Demand prediction accuracy", value: "94.2%", trend: "+2.1%" },
  { label: "Dispatch match p50", value: "1.8s", trend: "−0.3s" },
  { label: "Dead mileage reduction", value: "38%", trend: "+6%" },
  { label: "Worker utilization", value: "82.4%", trend: "+4%" },
  { label: "Heatmap nodes live", value: "142", trend: "+8" },
] as const;

export const shramSetuBenefits = [
  { id: "identity", title: "Worker Identity", desc: "DigiLocker-linked sovereign ID with portable earnings history.", status: "Live" },
  { id: "insurance", title: "Insurance", desc: "Accident, health, and life coverage via e-Shram integration.", status: "Live" },
  { id: "pension", title: "Pension Eligibility", desc: "90-day engagement tracking toward NPS and EPFO readiness.", status: "Pilot" },
  { id: "health", title: "Health Support", desc: "Telemedicine, wellness pods, and fatigue intervention alerts.", status: "Live" },
  { id: "safety", title: "Safety Systems", desc: "SOS rail, geofence alerts, and women-safety verified routes.", status: "Live" },
  { id: "gov", title: "Government-Tech", desc: "UMANG, e-Shram, and state welfare API integration.", status: "Roadmap" },
] as const;

export const aiCopilotRoles = [
  {
    role: "Drivers",
    persona: "Shift Coach",
    sample: "Demand spike in Whitefield. Route via ORR — 23% higher earnings next 2 hours.",
    metrics: ["Vernacular voice", "EV range optimizer", "Rest-Lock alerts"],
  },
  {
    role: "Operators",
    persona: "Fleet Commander",
    sample: "Rebalance 12 VF5 units to Koramangala. SOC sufficient until 22:00 shift end.",
    metrics: ["Live heatmaps", "Charge scheduling", "Incident triage"],
  },
  {
    role: "Fleet Owners",
    persona: "Capital Advisor",
    sample: "Fleet ROI up 14% this quarter. Recommend 8 MPV7 additions for airport corridor.",
    metrics: ["Unit economics", "Depreciation model", "Insurance pooling"],
  },
  {
    role: "Investors",
    persona: "Market Intelligence",
    sample: "Bengaluru TAM expanding 38% YoY. Worker-owned ledger creates 15% lending pool.",
    metrics: ["GMV projections", "Network effects", "DPDP compliance"],
  },
] as const;

export const founderProfile = {
  name: "Pachihumbi",
  title: "Founder & CEO",
  vision:
    "We are building the digital public infrastructure layer for India's future workforce economy — where technology increases worker sovereignty, not platform dependency.",
  mission: "Bharat-first infrastructure that dignifies labour, electrifies mobility, and democratizes AI.",
  philosophy:
    "Infrastructure, not another app. Worker-owned data moats. Nation-scale systems that outlive any single platform.",
  links: {
    github: "https://github.com/pachihumbi/gigai-bharat",
    linkedin: "https://linkedin.com/in/pachihumbi",
    email: "hello@bharatgig.live",
  },
} as const;

export const investorThesis = [
  {
    title: "Market Opportunity",
    value: "₹6.2L Cr",
    sub: "Mobility GMV by 2030",
    body: "India's workforce economy is the largest unstructured labour market on earth — ripe for infrastructure, not another aggregator.",
  },
  {
    title: "Workforce Economy",
    value: "23.5M",
    sub: "Gig workers addressable",
    body: "Mobility, delivery, and logistics workers with zero portable credit identity — until now.",
  },
  {
    title: "EV Transition",
    value: "38%",
    sub: "Fleet electrification by 2030",
    body: "VinFast + Tata + Mahindra fleet intelligence with AI dispatch and smart charging amortized across GigPods.",
  },
  {
    title: "AI Infrastructure",
    value: "T+0",
    sub: "OCR → ledger latency",
    body: "Worker-owned RLS architecture with vernacular AI copilots — DPDP-native from day one.",
  },
  {
    title: "Worker Dignity Model",
    value: "742",
    sub: "Avg Gig Credit Score",
    body: "Portable earnings, insurance, pension eligibility, and neo-banking — the PhonePe layer for labour.",
  },
  {
    title: "Network Valuation",
    value: "55× GMV",
    sub: "5-year compounding thesis",
    body: "Embedded finance, insurance, and fleet OS create multi-sided revenue without platform rent extraction.",
  },
] as const;

export const workerPainPoints = [
  { title: "Platform rent extraction", body: "15–30% commissions and opaque surge pricing drain ₹100 earned before it reaches families." },
  { title: "No portable identity", body: "Ratings and earnings trapped inside apps — zero credit history for loans or insurance." },
  { title: "EV transition friction", body: "High upfront EV costs, charging anxiety, and no worker-owned fleet financing." },
  { title: "Rest & safety gaps", body: "12+ hour shifts without mandated rest infrastructure or vernacular safety rails." },
] as const;

export const revenueStreams = [
  { stream: "GigPay rails", model: "UPI + wallet interchange", margin: "0.3–0.8%" },
  { stream: "EV fleet OS", model: "Subscription + charge margin", margin: "₹2.4K/unit/mo" },
  { stream: "GigPods", model: "Co-living + charge hubs", margin: "₹899/night avg" },
  { stream: "Embedded finance", model: "Credit + insurance", margin: "2.5% NIM" },
  { stream: "AI copilot", model: "B2B fleet licensing", margin: "₹49/driver/mo" },
] as const;

export const launchRoadmap = [
  { phase: "Now", label: "Bengaluru pilot", status: "Live" },
  { phase: "Q3 2026", label: "Android APK + Play Store", status: "Build" },
  { phase: "Q4 2026", label: "Tier-1 city expansion", status: "Plan" },
  { phase: "2027", label: "National worker OS", status: "Scale" },
] as const;

export const homeNavAnchors = [
  { id: "live-demo", label: "Demos" },
  { id: "gigpay", label: "GigPay" },
  { id: "gigev", label: "GigEV" },
  { id: "gigpods", label: "GigPods" },
  { id: "fleetos", label: "FleetOS" },
  { id: "shramsetu", label: "ShramSetu" },
  { id: "copilot", label: "AI Copilot" },
  { id: "founder", label: "Founder" },
  { id: "investors", label: "Investors" },
] as const;

/** Website pages — use in section nav for full-page routes (not hash anchors). */
export const websitePages = [
  { href: "/founder", label: "Founder page" },
  { href: "/manifesto", label: "Manifesto" },
  { href: "/investors", label: "Investors" },
] as const;
