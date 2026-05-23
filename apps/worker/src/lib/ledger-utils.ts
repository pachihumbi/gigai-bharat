import type { EarningRow } from "@/hooks/useLedger";

export function sumEarnings(rows: EarningRow[], filter?: (r: EarningRow) => boolean) {
  return rows.filter(filter ?? (() => true)).reduce((s, r) => s + Number(r.amount_earned), 0);
}

export function groupByPlatform(rows: EarningRow[]) {
  const map = new Map<string, number>();
  for (const r of rows) {
    map.set(r.source_platform, (map.get(r.source_platform) ?? 0) + Number(r.amount_earned));
  }
  return [...map.entries()]
    .map(([platform, total]) => ({ platform, total }))
    .sort((a, b) => b.total - a.total);
}

export function lastNDays(rows: EarningRow[], days = 7) {
  const out: { date: string; total: number; label: string }[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-IN", { weekday: "short" });
    const total = sumEarnings(rows, (r) => r.date === iso);
    out.push({ date: iso, total, label });
  }
  return out;
}

export function weekTotal(rows: EarningRow[]) {
  const start = new Date();
  start.setDate(start.getDate() - 6);
  const startIso = start.toISOString().slice(0, 10);
  return sumEarnings(rows, (r) => r.date >= startIso);
}

export function exportLedgerCsv(rows: EarningRow[]) {
  const header = "date,platform,amount_inr\n";
  const body = rows
    .map((r) => `${r.date},${r.source_platform},${Number(r.amount_earned).toFixed(2)}`)
    .join("\n");
  const blob = new Blob([header + body], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `gigai-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
