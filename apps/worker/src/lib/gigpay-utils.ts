import type { EarningRow } from "@/hooks/useLedger";
import { lastNDays, sumEarnings } from "@/lib/ledger-utils";
import type { GigPayTransaction } from "@/lib/gigpay-demo";

export function formatInr(amount: number, compact = false) {
  if (compact && amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

export function formatTxnTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH}h ago`;
  if (diffH < 48) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function earningsToWeeklyChart(earnings: EarningRow[]) {
  return lastNDays(earnings, 7);
}

export function computeTodayEarnings(earnings: EarningRow[]) {
  const today = new Date().toISOString().slice(0, 10);
  return sumEarnings(earnings, (r) => r.date === today);
}

export function computeWeeklyEarnings(earnings: EarningRow[]) {
  const start = new Date();
  start.setDate(start.getDate() - 6);
  const startIso = start.toISOString().slice(0, 10);
  return sumEarnings(earnings, (r) => r.date >= startIso);
}

export function mergeTransactions(
  demo: GigPayTransaction[],
  earnings: EarningRow[],
): GigPayTransaction[] {
  const fromEarnings: GigPayTransaction[] = earnings.slice(0, 5).map((e, i) => ({
    id: `earn-${e.date}-${i}`,
    type: "credit" as const,
    title: `${e.source_platform} credit`,
    subtitle: e.date,
    amount: Number(e.amount_earned),
    timestamp: new Date(`${e.date}T12:00:00`).toISOString(),
    icon: "💰",
    status: "completed" as const,
  }));

  const merged = [...demo, ...fromEarnings];
  const seen = new Set<string>();
  return merged
    .filter((t) => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 12);
}
