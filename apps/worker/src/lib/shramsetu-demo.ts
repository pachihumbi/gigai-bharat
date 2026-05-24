import type { WorkerProfile } from "@/hooks/useLedger";

export type WelfareScheme = {
  id: string;
  name: string;
  kn: string;
  status: "active" | "eligible" | "locked";
  provider: string;
  coverage?: string;
};

export type InsurancePlan = {
  id: string;
  name: string;
  coverage: string;
  premium: number;
  status: "active" | "pending" | "renewal";
  validUntil: string;
};

export type PensionTrack = {
  enrolled: boolean;
  scheme: string;
  monthlyContribution: number;
  projectedPayout: number;
  yearsToEligible: number;
  progressPct: number;
};

export const DEMO_SHRAMSETU_PROFILE = {
  workerId: "GB-IN-KA-2026-8842",
  aadhaarMasked: "XXXX-XXXX-4821",
  eshramId: "ESHRAM8829104",
  skillLevel: "Pro Driver L3",
  skillXp: 2840,
  skillNextLevel: 3200,
  verifiedSince: "2025-11-12",
  platforms: ["Swiggy", "Rapido", "Uber"],
  city: "Bengaluru",
  state: "Karnataka",
} as const;

export const DEMO_WELFARE_SCHEMES: WelfareScheme[] = [
  {
    id: "pmjay",
    name: "Ayushman Bharat PM-JAY",
    kn: "ಆಯುಷ್ಮಾನ್ ಭಾರತ",
    status: "active",
    provider: "Govt of India",
    coverage: "₹5L / family",
  },
  {
    id: "eshram",
    name: "e-Shram Portal",
    kn: "ಇ-ಶ್ರಮ",
    status: "active",
    provider: "MoLE",
    coverage: "Accident ₹2L",
  },
  {
    id: "ka-cess",
    name: "KA Gig Welfare Cess",
    kn: "ಕರ್ನಾಟಕ ೧% ಸೆಸ್",
    status: "eligible",
    provider: "Karnataka Labour",
    coverage: "₹1,842 accrued",
  },
  {
    id: "esic",
    name: "ESIC Registration",
    kn: "ಇএಸ್ಐಸಿ",
    status: "eligible",
    provider: "ESIC India",
    coverage: "Medical + cash",
  },
  {
    id: "pm-sym",
    name: "PM-SYM Pension",
    kn: "ಪension ಯೋಜನೆ",
    status: "locked",
    provider: "Govt of India",
    coverage: "₹3,000 / mo @ 60",
  },
  {
    id: "bmtc",
    name: "BMTC Worker Pass",
    kn: "ಬಿಎಂಟಿಸಿ ಪಾಸ್",
    status: "locked",
    provider: "Bengaluru",
    coverage: "50% transit",
  },
];

export const DEMO_INSURANCE: InsurancePlan[] = [
  {
    id: "health",
    name: "Gig Health Shield",
    coverage: "₹5,00,000",
    premium: 0,
    status: "active",
    validUntil: "2027-03-31",
  },
  {
    id: "accident",
    name: "Ride Accident Cover",
    coverage: "₹2,00,000",
    premium: 49,
    status: "active",
    validUntil: "2026-12-15",
  },
  {
    id: "ev",
    name: "EV Battery Protection",
    coverage: "VinFast MPV7",
    premium: 199,
    status: "renewal",
    validUntil: "2026-06-01",
  },
];

export const DEMO_PENSION: PensionTrack = {
  enrolled: true,
  scheme: "PM-SYM + NPS Lite",
  monthlyContribution: 100,
  projectedPayout: 3000,
  yearsToEligible: 22,
  progressPct: 68,
};

export const DEMO_CONTRIBUTION_TREND = [
  { month: "Jan", ka: 120, esic: 80, pension: 100 },
  { month: "Feb", ka: 145, esic: 95, pension: 100 },
  { month: "Mar", ka: 160, esic: 110, pension: 100 },
  { month: "Apr", ka: 180, esic: 125, pension: 100 },
  { month: "May", ka: 195, esic: 140, pension: 100 },
];

export function workerDisplayName(worker: WorkerProfile | null) {
  return worker?.name ?? "Prashanth Gowda";
}
