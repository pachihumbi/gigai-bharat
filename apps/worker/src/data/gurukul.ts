export type LearningTrack = {
  id: string;
  title: string;
  durationMin: number;
  xp: number;
  progress: number;
  icon: string;
  voice: boolean;
};

export type Certification = {
  id: string;
  title: string;
  badge: string;
  level: "bronze" | "silver" | "gold";
  verified: boolean;
  blockchainReady: boolean;
};

export type Tribe = {
  id: string;
  name: string;
  members: number;
  city: string;
  mentor: string;
  rank?: number;
};

export const learningTracks: LearningTrack[] = [
  { id: "ev", title: "EV fleet operations", durationMin: 12, xp: 120, progress: 65, icon: "⚡", voice: true },
  { id: "comm", title: "Customer communication", durationMin: 8, xp: 80, progress: 40, icon: "💬", voice: true },
  { id: "finance", title: "Financial literacy", durationMin: 15, xp: 150, progress: 55, icon: "💰", voice: true },
  { id: "ai", title: "AI tools usage", durationMin: 10, xp: 100, progress: 30, icon: "🤖", voice: true },
  { id: "logistics", title: "Logistics intelligence", durationMin: 14, xp: 140, progress: 20, icon: "📦", voice: false },
  { id: "safety", title: "Safety training", durationMin: 9, xp: 90, progress: 80, icon: "🛡", voice: true },
  { id: "entrepreneur", title: "Entrepreneurship", durationMin: 18, xp: 180, progress: 15, icon: "🚀", voice: true },
  { id: "fleet", title: "Fleet ownership", durationMin: 20, xp: 200, progress: 10, icon: "🚐", voice: true },
  { id: "digipay", title: "Digital finance", durationMin: 11, xp: 110, progress: 45, icon: "🏦", voice: true },
  { id: "mobility", title: "Mobility operations", durationMin: 13, xp: 130, progress: 50, icon: "🗺", voice: true },
];

export const certifications: Certification[] = [
  { id: "ev-spec", title: "EV Mobility Specialist", badge: "EV", level: "gold", verified: true, blockchainReady: true },
  { id: "dispatch", title: "AI Dispatch Operator", badge: "AI", level: "silver", verified: true, blockchainReady: true },
  { id: "captain", title: "Smart Fleet Captain", badge: "FC", level: "bronze", verified: false, blockchainReady: true },
  { id: "finance", title: "Worker Finance Expert", badge: "₹", level: "silver", verified: true, blockchainReady: true },
  { id: "safety", title: "Safety Certified Partner", badge: "SC", level: "gold", verified: true, blockchainReady: true },
];

export const skillGraph = {
  skillScore: 72,
  reliabilityScore: 85,
  earningPotential: 78,
  fleetLeadership: 45,
  growthVelocity: 12,
} as const;

export const economicTips = [
  { id: "1", title: "Shift window upgrade", body: "Whitefield 7–9 PM adds ₹680/week for your profile.", impact: "+₹680/wk" },
  { id: "2", title: "Auto-savings rule", body: "Save 10% of daily earnings — GigPay vault at 8% APY.", impact: "+₹2.4K/mo" },
  { id: "3", title: "Fleet ownership path", body: "Complete Fleet Ownership track → eligible for VinFast lease EMI.", impact: "EMI ready" },
  { id: "4", title: "Skill → income", body: "AI Dispatch Operator cert unlocks +15% surge priority.", impact: "+15% surge" },
];

export const tribes: Tribe[] = [
  { id: "blr-ev", name: "Bengaluru EV Pioneers", members: 1240, city: "Bengaluru", mentor: "Ravi K.", rank: 3 },
  { id: "ka-kn", name: "Kannada Worker Circle", members: 890, city: "Karnataka", mentor: "Priya M." },
  { id: "fleet", name: "Future Fleet Owners", members: 456, city: "Pan-India", mentor: "GigAI Mentor" },
];

export const successStories = [
  { name: "Suresh", city: "Bengaluru", quote: "Gurukul helped me go from ₹18K to ₹32K/month in 90 days.", uplift: "+78%" },
  { name: "Lakshmi", city: "Chennai", quote: "EV Mobility cert got me a VinFast fleet partner role.", uplift: "Fleet lead" },
];

export const onboardingSteps = [
  { id: "welcome", label: "Welcome" },
  { id: "identity", label: "Identity" },
  { id: "verify", label: "Verify" },
  { id: "profile", label: "Profile" },
  { id: "launch", label: "Launch" },
] as const;

export function computeTotalXp(tracks: LearningTrack[]) {
  return tracks.reduce((s, t) => s + Math.round(t.xp * (t.progress / 100)), 0);
}

export function nextCertProgress(skillScore: number) {
  return Math.min(100, skillScore + 8);
}
