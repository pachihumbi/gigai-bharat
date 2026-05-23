export type SurgeZone = {
  id: string;
  name: string;
  multiplier: number;
  etaMin: number;
  estEarnings: number;
  distanceKm: number;
  demand: "low" | "medium" | "high" | "surge";
  evFriendly?: boolean;
};

export type CreditFactor = {
  id: string;
  label: string;
  score: number;
  max: number;
  trend: "up" | "down" | "stable";
  detail: string;
};

export type CoachingTip = {
  id: string;
  title: string;
  body: string;
  impact: string;
  localeHint?: string;
};

export type ExpenseCategory = {
  id: string;
  label: string;
  amount: number;
  icon: "fuel" | "ev" | "food" | "maint";
  pct: number;
};

export const dispatchZones: SurgeZone[] = [
  { id: "indiranagar", name: "Indiranagar 100ft Rd", multiplier: 2.4, etaMin: 8, estEarnings: 420, distanceKm: 3.2, demand: "surge" },
  { id: "koramangala", name: "Koramangala 5th Block", multiplier: 1.9, etaMin: 12, estEarnings: 310, distanceKm: 4.1, demand: "high" },
  { id: "whitefield", name: "Whitefield IT Corridor", multiplier: 1.7, etaMin: 22, estEarnings: 580, distanceKm: 12.4, demand: "high", evFriendly: true },
  { id: "airport", name: "BLR Airport T1 Queue", multiplier: 2.1, etaMin: 35, estEarnings: 890, distanceKm: 28, demand: "surge" },
  { id: "mg-road", name: "MG Road Metro", multiplier: 1.4, etaMin: 6, estEarnings: 180, distanceKm: 2.1, demand: "medium" },
];

export const evHubs = [
  { name: "VinFast × GigAI — Indiranagar", slots: 12, waitMin: 4 },
  { name: "VinFast Solar Hub — Koramangala", slots: 16, waitMin: 3 },
  { name: "VinFast Grid — Whitefield", slots: 24, waitMin: 5 },
];

export function computeCreditFactors(score: number, tripCount: number, dayCount: number): CreditFactor[] {
  const consistency = Math.min(99, 55 + dayCount * 4 + Math.min(tripCount, 30));
  const behavioral = Math.min(99, 50 + score / 12);
  const financial = Math.min(99, 45 + score / 10);
  return [
    { id: "consistency", label: "Shift consistency", score: consistency, max: 99, trend: "up", detail: `${dayCount} active days tracked` },
    { id: "behavioral", label: "Behavioral trust", score: behavioral, max: 99, trend: "stable", detail: "Safety & rest-lock compliance" },
    { id: "financial", label: "Financial discipline", score: financial, max: 99, trend: "up", detail: "Ledger completeness & bill pay" },
    { id: "reliability", label: "Platform reliability", score: Math.min(99, 60 + tripCount), max: 99, trend: "up", detail: `${tripCount} verified trips` },
  ];
}

export function lendingReadiness(score: number) {
  if (score >= 750) return { label: "Pre-approved", amount: 25000, rate: "12.5%", color: "secondary" as const };
  if (score >= 650) return { label: "Eligible", amount: 15000, rate: "14.9%", color: "primary" as const };
  if (score >= 500) return { label: "Building", amount: 5000, rate: "18.5%", color: "accent" as const };
  return { label: "Keep earning", amount: 0, rate: "—", color: "muted" as const };
}

export function earningsProjection(todayEarnings: number, weekTotal: number) {
  const dailyAvg = weekTotal > 0 ? weekTotal / 7 : todayEarnings || 850;
  return {
    todayPredicted: Math.round(todayEarnings + dailyAvg * 0.35),
    weekPredicted: Math.round(weekTotal + dailyAvg * 2.1),
    monthPredicted: Math.round(dailyAvg * 26),
  };
}

export function defaultExpenses(weekTotal: number): ExpenseCategory[] {
  const fuel = Math.round(weekTotal * 0.18);
  const ev = Math.round(weekTotal * 0.06);
  const food = Math.round(weekTotal * 0.08);
  const maint = Math.round(weekTotal * 0.04);
  const total = fuel + ev + food + maint || 1;
  return [
    { id: "fuel", label: "Fuel / CNG", amount: fuel, icon: "fuel", pct: Math.round((fuel / total) * 100) },
    { id: "ev", label: "EV charging", amount: ev, icon: "ev", pct: Math.round((ev / total) * 100) },
    { id: "food", label: "Meals on shift", amount: food, icon: "food", pct: Math.round((food / total) * 100) },
    { id: "maint", label: "Maintenance", amount: maint, icon: "maint", pct: Math.round((maint / total) * 100) },
  ];
}

export const coachingTips: CoachingTip[] = [
  { id: "1", title: "Peak window alert", body: "Whitefield IT corridor pays ₹680/week more 7–9 PM for drivers like you.", impact: "+₹680/wk", localeHint: "ಸಂಜೆ ೭-೯" },
  { id: "2", title: "Rest before surge", body: "Take 15 min break now — airport queue surge in 40 mins. Fatigue drops earnings 18%.", impact: "+18% efficiency" },
  { id: "3", title: "OCR your Swiggy batch", body: "Upload tonight's Swiggy screenshot to boost credit score + ledger accuracy.", impact: "+5 credit" },
];

export const systemModules = [
  { id: "ledger", path: "/ledger", color: "primary" },
  { id: "credit", path: "/credit", color: "secondary" },
  { id: "dispatch", path: "/dispatch", color: "accent" },
  { id: "welfare", path: "/welfare", color: "primary" },
  { id: "gigpay", path: "/gigpay", color: "secondary" },
  { id: "ocr", path: "/ocr", color: "accent" },
] as const;
