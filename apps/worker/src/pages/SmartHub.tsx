import { AppShell } from "@/components/AppShell";
import { MiniMap } from "@/components/MiniMap";
import { Skeleton } from "@/components/ui/skeleton";
import { useLedger } from "@/hooks/useLedger";
import { Sparkles, TrendingUp, Award, AlertTriangle, Lightbulb, Bot, Wallet, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";

const HubSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-24 w-full rounded-3xl" />
    <Skeleton className="h-40 w-full rounded-3xl" />
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-3xl" />)}
    </div>
  </div>
);

const SmartHub = () => {
  const { worker, wallet, welfare, earnings, loading } = useLedger();

  const insights = useMemo(() => {
    if (!earnings.length) return null;
    const last7 = new Set(
      Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(); d.setDate(d.getDate() - i);
        return d.toISOString().slice(0, 10);
      })
    );
    const prev7 = new Set(
      Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(); d.setDate(d.getDate() - i - 7);
        return d.toISOString().slice(0, 10);
      })
    );
    const week = earnings.filter((r) => last7.has(r.date));
    const prev = earnings.filter((r) => prev7.has(r.date));
    const weekTotal = week.reduce((s, r) => s + Number(r.amount_earned), 0);
    const prevTotal = prev.reduce((s, r) => s + Number(r.amount_earned), 0);
    const delta = prevTotal > 0 ? ((weekTotal - prevTotal) / prevTotal) * 100 : 0;

    const byPlatform: Record<string, number> = {};
    week.forEach((r) => { byPlatform[r.source_platform] = (byPlatform[r.source_platform] || 0) + Number(r.amount_earned); });
    const sorted = Object.entries(byPlatform).sort((a, b) => b[1] - a[1]);
    const top = sorted[0];
    const weak = sorted[sorted.length - 1];

    const byDow: Record<number, number> = {};
    week.forEach((r) => {
      const d = new Date(r.date).getDay();
      byDow[d] = (byDow[d] || 0) + Number(r.amount_earned);
    });
    const bestDow = Object.entries(byDow).sort((a, b) => b[1] - a[1])[0];
    const dowName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return {
      weekTotal: Math.round(weekTotal),
      delta: Math.round(delta),
      top: top ? { platform: top[0], amount: Math.round(top[1]) } : null,
      weak: weak && sorted.length > 1 ? { platform: weak[0], amount: Math.round(weak[1]) } : null,
      bestDay: bestDow ? dowName[Number(bestDow[0])] : null,
      platformShare: sorted.map(([p, a]) => ({ p, a: Math.round(a), pct: Math.round((a / weekTotal) * 100) })),
    };
  }, [earnings]);

  if (loading) return <AppShell><HubSkeleton /></AppShell>;

  const firstName = worker?.name?.split(" ")[0] || "Driver";

  return (
    <AppShell>
      {/* Hero */}
      <div className="glass-card p-5 mb-4 relative overflow-hidden animate-scale-in" style={{ boxShadow: "0 0 0 1px hsl(var(--accent)/0.4), 0 0 30px hsl(var(--accent)/0.2)" }}>
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-accent/25 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-saffron grid place-items-center glow-saffron">
            <Bot className="h-6 w-6 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-mono-tech uppercase tracking-[0.25em] text-accent">Smart Hub • ಸ್ಮಾರ್ಟ್ ಹಬ್</p>
            <p className="font-bold text-base leading-tight mt-0.5">Hey {firstName}, here's your week.</p>
            <p className="text-[11px] text-muted-foreground">AI-curated tips, alerts &amp; opportunities.</p>
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="glass-card p-4 animate-fade-in">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="h-3.5 w-3.5 text-secondary" />
            <p className="text-[10px] font-mono-tech uppercase tracking-widest text-muted-foreground">7-Day</p>
          </div>
          <p className="text-2xl font-extrabold text-gradient-neon tabular-nums">₹{insights?.weekTotal ?? 0}</p>
          <p className={`text-[11px] font-semibold ${(insights?.delta ?? 0) >= 0 ? "text-secondary" : "text-destructive"}`}>
            {(insights?.delta ?? 0) >= 0 ? "+" : ""}{insights?.delta ?? 0}% vs prev
          </p>
        </div>
        <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: "0.05s" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Award className="h-3.5 w-3.5 text-accent" />
            <p className="text-[10px] font-mono-tech uppercase tracking-widest text-muted-foreground">Credit</p>
          </div>
          <p className="text-2xl font-extrabold tabular-nums">{wallet?.gig_credit_score ?? 0}</p>
          <p className="text-[11px] text-muted-foreground">GigScore™</p>
        </div>
        <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Wallet className="h-3.5 w-3.5 text-primary" />
            <p className="text-[10px] font-mono-tech uppercase tracking-widest text-muted-foreground">Wallet</p>
          </div>
          <p className="text-2xl font-extrabold tabular-nums">₹{Math.round(wallet?.wallet_balance ?? 0)}</p>
          <p className="text-[11px] text-muted-foreground">Available now</p>
        </div>
        <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar className="h-3.5 w-3.5 text-secondary" />
            <p className="text-[10px] font-mono-tech uppercase tracking-widest text-muted-foreground">Active</p>
          </div>
          <p className="text-2xl font-extrabold tabular-nums">{welfare?.active_working_days ?? 0}</p>
          <p className="text-[11px] text-muted-foreground">days · welfare track</p>
        </div>
      </div>

      {/* Live hotspots map */}
      <MiniMap homeLat={worker?.home_lat ? Number(worker.home_lat) : null} homeLng={worker?.home_lng ? Number(worker.home_lng) : null} />

      {/* Platform mix */}
      {insights?.platformShare?.length ? (
        <div className="glass-card p-4 mb-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-secondary" />
            <p className="text-[10px] font-mono-tech uppercase tracking-widest text-secondary">Platform Mix • 7-day</p>
          </div>
          <div className="space-y-2.5">
            {insights.platformShare.map((row) => (
              <div key={row.p}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold">{row.p}</span>
                  <span className="tabular-nums text-muted-foreground">₹{row.a} • {row.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
                  <div className="h-full bg-gradient-neon transition-all" style={{ width: `${row.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* AI tips */}
      <div className="space-y-3 mb-4">
        {insights?.top && (
          <div className="glass-card p-4 border-secondary/30 animate-fade-in">
            <div className="flex gap-3">
              <div className="flex-none h-9 w-9 rounded-lg bg-secondary/15 grid place-items-center">
                <Lightbulb className="h-4 w-4 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-mono-tech uppercase tracking-widest text-secondary">Top Performer</p>
                <p className="text-sm font-semibold mt-0.5 leading-snug">
                  <span className="text-secondary">{insights.top.platform}</span> drove ₹{insights.top.amount} this week. Double down on peak hours.
                </p>
              </div>
            </div>
          </div>
        )}

        {insights?.bestDay && (
          <div className="glass-card p-4 border-accent/30 animate-fade-in">
            <div className="flex gap-3">
              <div className="flex-none h-9 w-9 rounded-lg bg-accent/15 grid place-items-center">
                <TrendingUp className="h-4 w-4 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-mono-tech uppercase tracking-widest text-accent">Best Day</p>
                <p className="text-sm font-semibold mt-0.5 leading-snug">
                  <span className="text-accent">{insights.bestDay}</span> is your highest-earning day. Plan longer shifts.
                </p>
              </div>
            </div>
          </div>
        )}

        {insights?.weak && (
          <div className="glass-card p-4 border-destructive/30 animate-fade-in">
            <div className="flex gap-3">
              <div className="flex-none h-9 w-9 rounded-lg bg-destructive/15 grid place-items-center">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-mono-tech uppercase tracking-widest text-destructive">Underperforming</p>
                <p className="text-sm font-semibold mt-0.5 leading-snug">
                  <span className="text-destructive">{insights.weak.platform}</span> brought just ₹{insights.weak.amount}. Try shifting hours or pause it.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link to="/heatmap" className="glass-card p-4 active:scale-95 transition-transform">
          <Sparkles className="h-5 w-5 text-accent mb-2" />
          <p className="text-sm font-semibold">Shift Coach</p>
          <p className="text-[10px] text-muted-foreground">Where to drive now</p>
        </Link>
        <Link to="/gigpay" className="glass-card p-4 active:scale-95 transition-transform">
          <Wallet className="h-5 w-5 text-primary mb-2" />
          <p className="text-sm font-semibold">GigPay</p>
          <p className="text-[10px] text-muted-foreground">Cash-out &amp; credit</p>
        </Link>
      </div>

      <p className="text-center text-[10px] font-mono-tech tracking-[0.25em] text-muted-foreground">
        POWERED BY <span className="text-gradient-neon font-bold">GIGAI BHARAT</span>
      </p>
    </AppShell>
  );
};

export default SmartHub;
