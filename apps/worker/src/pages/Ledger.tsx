import { AppShell } from "@/components/AppShell";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkerOs } from "@/hooks/useWorkerOs";
import { useI18n } from "@/i18n/context";
import {
  exportLedgerCsv,
  groupByPlatform,
  lastNDays,
  sumEarnings,
  weekTotal,
} from "@/lib/ledger-utils";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { HudLabel } from "@/os/OsCard";
import { Fuel, Zap, Download, TrendingUp, Camera } from "lucide-react";
import { Link } from "react-router-dom";

const PLATFORM_COLOR: Record<string, string> = {
  Swiggy: "hsl(33 100% 50%)",
  Rapido: "hsl(48 100% 55%)",
  Uber: "hsl(200 100% 60%)",
  Zomato: "hsl(0 90% 60%)",
  Ola: "hsl(140 70% 55%)",
  Direct_GigAI: "hsl(160 100% 50%)",
};

const Ledger = () => {
  const { t } = useI18n();
  const { earnings, loading, wallet, os } = useWorkerOs();

  if (loading) {
    return (
      <AppShell title={t.ledger.title}>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-3xl" />
          <Skeleton className="h-48 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      </AppShell>
    );
  }

  const week = weekTotal(earnings);
  const allTime = sumEarnings(earnings);
  const chartData = lastNDays(earnings);
  const platforms = groupByPlatform(earnings);

  return (
    <AppShell title={t.ledger.title}>
      <p className="text-sm text-muted-foreground -mt-3 mb-4">{t.ledger.subtitle}</p>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="glass-card p-4 border-secondary/30">
          <p className="text-[10px] font-mono-tech uppercase tracking-widest text-muted-foreground">
            {t.ledger.thisWeek}
          </p>
          <p className="text-3xl font-extrabold tabular-nums text-gradient-neon mt-1">₹{week.toFixed(0)}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-[10px] font-mono-tech uppercase tracking-widest text-muted-foreground">
            {t.ledger.allTime}
          </p>
          <p className="text-3xl font-extrabold tabular-nums mt-1">₹{allTime.toFixed(0)}</p>
          <p className="text-[10px] text-muted-foreground mt-1">
            {earnings.length} {t.ledger.entries}
          </p>
        </div>
      </div>

      {wallet && (
        <Link to="/credit" className="glass-card p-4 mb-4 flex items-center justify-between hover:border-secondary/40 transition">
          <div>
            <p className="text-[10px] font-mono-tech text-muted-foreground">Gig Credit Score</p>
            <p className="text-2xl font-bold text-secondary tabular-nums">{wallet.gig_credit_score}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono-tech text-muted-foreground">GigPay balance</p>
            <p className="text-2xl font-bold tabular-nums">₹{Number(wallet.wallet_balance).toFixed(0)}</p>
          </div>
        </Link>
      )}

      {week > 0 && (
        <div className="glass-card p-4 mb-4">
          <HudLabel className="mb-3 block">{t.ledger.expenses}</HudLabel>
          <div className="grid grid-cols-2 gap-2">
            {os.expenses.map((e) => (
              <div key={e.id} className="rounded-xl border border-border/50 bg-background/40 p-3">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  {e.icon === "fuel" ? <Fuel className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                  {e.label}
                </div>
                <p className="mt-1 text-lg font-bold tabular-nums">₹{e.amount}</p>
                <p className="text-[10px] text-muted-foreground">{e.pct}% of week</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs">
            <span className="text-muted-foreground">{t.ledger.projection}</span>
            <span className="font-bold tabular-nums text-primary">₹{os.projection.monthPredicted.toLocaleString("en-IN")}</span>
          </div>
        </div>
      )}

      {/* 7-day chart */}
      <div className="glass-card p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-secondary" />
          <p className="text-[10px] font-mono-tech uppercase tracking-widest text-secondary">7-day earnings</p>
        </div>
        {chartData.some((d) => d.total > 0) ? (
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={36} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
                  formatter={(v: number) => [`₹${v.toFixed(0)}`, "Earned"]}
                />
                <Bar dataKey="total" fill="hsl(var(--secondary))" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-8 text-center">{t.ledger.noEntries}</p>
        )}
      </div>

      {/* Platform breakdown */}
      {platforms.length > 0 && (
        <div className="glass-card p-4 mb-4">
          <p className="text-[10px] font-mono-tech uppercase tracking-widest text-muted-foreground mb-3">
            {t.ledger.byPlatform}
          </p>
          <div className="space-y-2">
            {platforms.map(({ platform, total }) => {
              const pct = allTime > 0 ? (total / allTime) * 100 : 0;
              const color = PLATFORM_COLOR[platform] ?? "hsl(var(--primary))";
              return (
                <div key={platform}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold">{platform}</span>
                    <span className="tabular-nums font-bold text-secondary">₹{total.toFixed(0)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Entry list */}
      <div className="glass-card p-4 mb-4 max-h-64 overflow-y-auto">
        {earnings.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">{t.ledger.noEntries}</p>
        ) : (
          <ul className="space-y-2">
            {earnings.slice(0, 50).map((r, i) => (
              <li key={`${r.date}-${r.source_platform}-${i}`} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
                <div>
                  <p className="text-sm font-semibold">{r.source_platform}</p>
                  <p className="text-[10px] text-muted-foreground">{r.date}</p>
                </div>
                <span className="text-sm font-bold tabular-nums text-secondary">₹{Number(r.amount_earned).toFixed(0)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/ocr"
          className="glass-card p-4 flex items-center justify-center gap-2 min-h-[52px] active:scale-95 transition bg-primary/10 border-primary/30"
        >
          <Camera className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold">{t.ledger.addEarnings}</span>
        </Link>
        <button
          type="button"
          onClick={() => exportLedgerCsv(earnings)}
          disabled={earnings.length === 0}
          className="glass-card p-4 flex items-center justify-center gap-2 min-h-[52px] active:scale-95 transition disabled:opacity-50"
        >
          <Download className="h-5 w-5 text-secondary" />
          <span className="text-sm font-semibold">{t.ledger.export}</span>
        </button>
      </div>

      <p className="text-center text-[10px] font-mono-tech tracking-[0.25em] text-muted-foreground mt-6">
        {t.common.powered}
      </p>
    </AppShell>
  );
};

export default Ledger;
