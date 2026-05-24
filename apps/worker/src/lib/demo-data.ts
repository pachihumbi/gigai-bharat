import type { EarningRow, Wallet, Welfare, WorkerProfile } from "@/hooks/useLedger";

export const DEMO_WORKER: WorkerProfile = {
  id: "demo-worker-101",
  name: "Prashanth Gowda",
  phone_number: "+91 98450 12345",
  vehicle_type: "VinFast MPV7",
  home_lat: 12.9716,
  home_lng: 77.5946,
  home_address: "Indiranagar, Bengaluru",
};

export const DEMO_WALLET: Wallet = {
  wallet_balance: 18420,
  gig_credit_score: 768,
  active_loan_amount: 0,
};

export const DEMO_WELFARE: Welfare = {
  active_working_days: 72,
  is_eligible_for_state_benefits: true,
};

export function buildDemoEarnings(): EarningRow[] {
  const day = (offset: number) =>
    new Date(Date.now() - offset * 86400000).toISOString().slice(0, 10);

  return [
    { date: day(0), amount_earned: 1250, source_platform: "Swiggy" },
    { date: day(0), amount_earned: 1600, source_platform: "Rapido" },
    { date: day(1), amount_earned: 1800, source_platform: "Uber" },
    { date: day(1), amount_earned: 1400, source_platform: "Zomato" },
    { date: day(2), amount_earned: 2200, source_platform: "Swiggy" },
    { date: day(3), amount_earned: 1950, source_platform: "Uber" },
    { date: day(4), amount_earned: 2500, source_platform: "Rapido" },
  ];
}
