export const CO_LIVING_HERO = {
  title: "GigAI Smart Co-Living Pods",
  subtitle: "EV × Rest × Skill × Dispatch — India's workforce infrastructure layer",
  taglineKn: "ಸ್ಮಾರ್ಟ್ ಕೋ-ಲಿವಿಂಗ್ · ಕಾರ್ಮಿಕರ ಮೂಲಸೌಕರ್ಯ",
  locations: 12,
  workersHoused: 2840,
  chargingSlots: 480,
  occupancyPct: 87,
};

export const EV_SMART_HUB = {
  chargingStations: 48,
  fleetParking: 120,
  dispatchDesks: 8,
  batteryHealthAvg: 94,
  sessionsToday: 186,
  solarPct: 62,
  metrics: [
    { label: "Ultra-fast chargers", value: "24", unit: "150kW DC" },
    { label: "Fleet parking bays", value: "120", unit: "EV + hybrid" },
    { label: "Dispatch AI nodes", value: "8", unit: "live routing" },
    { label: "Battery health", value: "94%", unit: "fleet avg" },
  ],
  batteryAnalytics: [
    { hour: "6a", soc: 88, load: 42 },
    { hour: "9a", soc: 72, load: 78 },
    { hour: "12p", soc: 58, load: 91 },
    { hour: "3p", soc: 65, load: 85 },
    { hour: "6p", soc: 78, load: 68 },
    { hour: "9p", soc: 92, load: 35 },
  ],
  dispatchStats: {
    activeDrivers: 142,
    avgWaitMin: 2.4,
    tripsToday: 1840,
    aiMatchRate: 96,
  },
};

export type WorkerPod = {
  id: string;
  name: string;
  tier: "standard" | "premium" | "executive";
  pricePerShift: number;
  shiftHours: number;
  available: number;
  total: number;
  features: string[];
  biometric: boolean;
};

export const WORKER_PODS: WorkerPod[] = [
  {
    id: "pod-alpha",
    name: "Alpha Capsule",
    tier: "standard",
    pricePerShift: 149,
    shiftHours: 8,
    available: 6,
    total: 24,
    features: ["Biometric entry", "Climate control", "USB-C + wireless charge", "Noise isolation"],
    biometric: true,
  },
  {
    id: "pod-neo",
    name: "Neo Sleep Pod",
    tier: "premium",
    pricePerShift: 249,
    shiftHours: 8,
    available: 3,
    total: 16,
    features: ["Zero-gravity recline", "Smart wake alarm", "Shift sync booking", "Wellness lighting"],
    biometric: true,
  },
  {
    id: "pod-orbit",
    name: "Orbit Executive",
    tier: "executive",
    pricePerShift: 399,
    shiftHours: 12,
    available: 2,
    total: 8,
    features: ["Private ensuite", "EV priority parking", "Gurukul lounge access", "Meal credits"],
    biometric: true,
  },
];

export const POD_BOOKING = {
  nextAvailable: "22:30",
  currentOccupancy: 87,
  tonightBooked: 68,
  avgRating: 4.8,
  shiftBlocks: [
    { label: "Morning rest", time: "06:00 – 14:00", price: 149, slots: 4 },
    { label: "Afternoon nap", time: "14:00 – 18:00", price: 99, slots: 8 },
    { label: "Night shift", time: "22:00 – 06:00", price: 199, slots: 2 },
  ],
};

export const GURUKUL_CENTER = {
  activeLearners: 186,
  coursesLive: 24,
  completionRate: 78,
  certificationsIssued: 412,
  programs: [
    {
      id: "ev-maint",
      title: "EV Maintenance Basics",
      icon: "battery" as const,
      duration: "4 weeks",
      enrolled: 64,
      level: "Intermediate",
      aiPowered: true,
    },
    {
      id: "english-comms",
      title: "English for Gig Workers",
      icon: "mic" as const,
      duration: "6 weeks",
      enrolled: 92,
      level: "Beginner",
      aiPowered: true,
    },
    {
      id: "fin-lit",
      title: "Financial Literacy & Savings",
      icon: "wallet" as const,
      duration: "3 weeks",
      enrolled: 118,
      level: "All levels",
      aiPowered: true,
    },
    {
      id: "ai-dispatch",
      title: "AI Dispatch Operations",
      icon: "cpu" as const,
      duration: "2 weeks",
      enrolled: 48,
      level: "Advanced",
      aiPowered: true,
    },
  ],
  liveSession: {
    title: "EV Battery Care Masterclass",
    instructor: "VinFast × GigAI",
    startsIn: "45 min",
    seats: 12,
  },
};

export const COMMUNITY_ECOSYSTEM = {
  zones: [
    {
      id: "food",
      name: "Fuel Zone",
      emoji: "🍛",
      description: "Affordable worker meals · ₹49 thali · 24/7 chai",
      status: "Open",
      waitMin: 5,
      rating: 4.6,
    },
    {
      id: "rest",
      name: "Rest Lounge",
      emoji: "🛋️",
      description: "Recliners · meditation pods · fatigue recovery",
      status: "Open",
      waitMin: 0,
      rating: 4.9,
    },
    {
      id: "medical",
      name: "MediCare Desk",
      emoji: "🏥",
      description: "First aid · tele-doctor · ESIC linkage",
      status: "On-call",
      waitMin: 12,
      rating: 4.7,
    },
    {
      id: "insurance",
      name: "Insurance Desk",
      emoji: "🛡️",
      description: "ESIC · e-Shram · accident cover enrollment",
      status: "Open",
      waitMin: 8,
      rating: 4.8,
    },
  ],
  amenities: ["High-speed WiFi", "Laundry lockers", "Prayer room", "EV wash bay", "Parcel hub", "Community board"],
};

export const INVESTOR_VISION = {
  headline: "Physical infrastructure layer for India's workforce economy.",
  subheadline: "GigAI Bharat Co-Living Pods combine EV charging, worker housing, AI skill centers, and dispatch intelligence into a single investable asset class.",
  stats: [
    { label: "Target hubs by 2028", value: "500+" },
    { label: "Workers served / hub", value: "250" },
    { label: "Revenue streams", value: "7" },
    { label: "Asset utilization", value: "24/7" },
  ],
  revenueStreams: [
    "EV charging (B2B fleet + B2C)",
    "Shift-based pod rentals",
    "Gurukul AI subscriptions",
    "Dispatch commission share",
    "Food & retail partnerships",
    "Insurance & welfare desk fees",
    "Solar energy arbitrage",
  ],
  comparable: "goSTOPS × Tesla Supercharger × Zostel × Capsule hotel",
};

export const HUB_LOCATIONS = [
  { city: "Bengaluru", hub: "Whitefield GigAI Campus", pods: 48, chargers: 64, status: "Live" },
  { city: "Bengaluru", hub: "Electronic City Worker Yard", pods: 32, chargers: 40, status: "Live" },
  { city: "Hyderabad", hub: "HITEC City Co-Living", pods: 40, chargers: 52, status: "Q3 2026" },
  { city: "Pune", hub: "Hinjewadi EV Hub", pods: 36, chargers: 48, status: "Q4 2026" },
];
