import { useMemo } from "react";
import { useLedger } from "./useLedger";
import {
  computeCreditFactors,
  defaultExpenses,
  dispatchZones,
  earningsProjection,
  lendingReadiness,
} from "@/data/worker-os";
import { weekTotal } from "@/lib/ledger-utils";

export function useWorkerOs() {
  const ledger = useLedger();

  const os = useMemo(() => {
    const week = weekTotal(ledger.earnings);
    const tripCount = ledger.earnings.length;
    const dayCount = new Set(ledger.earnings.map((r) => r.date)).size;
    const score = ledger.wallet?.gig_credit_score ?? 300;
    const projection = earningsProjection(ledger.todayEarnings, week);
    const topZone = dispatchZones[0];

    return {
      weekTotal: week,
      tripCount,
      dayCount,
      projection,
      creditFactors: computeCreditFactors(score, tripCount, dayCount),
      lending: lendingReadiness(score),
      expenses: defaultExpenses(week),
      topZone,
      inclusionScore: Math.min(99, 40 + dayCount * 3 + (ledger.welfare?.active_working_days ?? 0) / 3),
      complianceScore: Math.min(99, 50 + (ledger.welfare?.active_working_days ?? 0) / 2),
    };
  }, [ledger.earnings, ledger.todayEarnings, ledger.wallet, ledger.welfare]);

  return { ...ledger, os };
}
