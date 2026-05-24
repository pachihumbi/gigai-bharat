import type { EvVehicle } from "./ev-demo";
import { ALL_EV_VEHICLES } from "./ev-demo";

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatInrCompact(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
  return formatInr(amount);
}

export function socColor(pct: number): string {
  if (pct >= 70) return "text-emerald-400";
  if (pct >= 40) return "text-amber-400";
  return "text-red-400";
}

export function socBarColor(pct: number): string {
  if (pct >= 70) return "from-emerald-400 to-cyan-400";
  if (pct >= 40) return "from-amber-400 to-orange-400";
  return "from-red-400 to-orange-500";
}

export function accentGlow(accent: EvVehicle["accent"]): string {
  const map = {
    cyan: "fintech-glow-cyan",
    green: "fintech-glow-green",
    saffron: "shadow-[0_0_32px_hsl(33_100%_50%/0.22)]",
    violet: "shadow-[0_0_32px_hsl(270_80%_60%/0.22)]",
  };
  return map[accent];
}

export function accentBorder(accent: EvVehicle["accent"]): string {
  const map = {
    cyan: "border-cyan-400/35",
    green: "border-emerald-400/35",
    saffron: "border-orange-400/35",
    violet: "border-violet-400/35",
  };
  return map[accent];
}

export function accentText(accent: EvVehicle["accent"]): string {
  const map = {
    cyan: "text-cyan-300",
    green: "text-emerald-300",
    saffron: "text-orange-300",
    violet: "text-violet-300",
  };
  return map[accent];
}

export function accentGradient(accent: EvVehicle["accent"]): string {
  const map = {
    cyan: "from-cyan-500/20 via-blue-500/10 to-transparent",
    green: "from-emerald-500/20 via-green-500/10 to-transparent",
    saffron: "from-orange-500/20 via-amber-500/10 to-transparent",
    violet: "from-violet-500/20 via-purple-500/10 to-transparent",
  };
  return map[accent];
}

export type ProfitCalcInput = {
  dailyKm: number;
  shiftDays: number;
  petrolCostPerKm: number;
  evCostPerKm: number;
  dailyEarnings: number;
  emiEstimate: number;
};

export type ProfitCalcResult = {
  monthlyFuelSavings: number;
  monthlyEarnings: number;
  monthlyEmi: number;
  netMonthlyProfit: number;
  breakEvenMonths: number;
  annualSavings: number;
};

export function calculateEvProfit(input: ProfitCalcInput): ProfitCalcResult {
  const monthlyKm = input.dailyKm * input.shiftDays;
  const petrolMonthly = monthlyKm * input.petrolCostPerKm;
  const evMonthly = monthlyKm * input.evCostPerKm;
  const monthlyFuelSavings = Math.round(petrolMonthly - evMonthly);
  const monthlyEarnings = Math.round(input.dailyEarnings * input.shiftDays);
  const monthlyEmi = input.emiEstimate;
  const netMonthlyProfit = monthlyEarnings + monthlyFuelSavings - monthlyEmi;
  const vehicleCost = monthlyEmi * 60;
  const breakEvenMonths = monthlyFuelSavings > 0 ? Math.ceil(vehicleCost / monthlyFuelSavings) : 0;
  const annualSavings = monthlyFuelSavings * 12;

  return {
    monthlyFuelSavings,
    monthlyEarnings,
    monthlyEmi,
    netMonthlyProfit,
    breakEvenMonths,
    annualSavings,
  };
}

export function getVehicleById(id: string): EvVehicle | undefined {
  return ALL_EV_VEHICLES.find((v) => v.id === id);
}

export function recommendVehicles(
  dailyKm: number,
  priority: "maximize earnings" | "lowest emi" | "long range",
  limit = 3,
): EvVehicle[] {
  const scored = ALL_EV_VEHICLES.map((v) => {
    let score = 0;
    if (priority === "maximize earnings") score += v.dailyEarnings * 0.4;
    if (priority === "lowest emi") score += (50000 - v.emiEstimate) * 0.5;
    if (priority === "long range") score += v.rangeKm * 2;
    if (dailyKm > 120 && v.rangeKm >= 400) score += 40;
    if (dailyKm < 80 && v.category === "scooter") score += 50;
    if (v.aiRecommended) score += 25;
    return { vehicle: v, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.vehicle);
}
