import { useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import {
  Activity,
  BadgeCheck,
  Brain,
  CheckCircle2,
  FileText,
  HeartPulse,
  Landmark,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useLedger } from "@/hooks/useLedger";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const STATES = [
  { name: "KA", score: 96, ready: true },
  { name: "MH", score: 88, ready: false },
  { name: "TS", score: 84, ready: false },
  { name: "TN", score: 82, ready: false },
  { name: "GJ", score: 79, ready: false },
  { name: "DL", score: 91, ready: false },
];

const AUDIT_LOG = [
  { ts: "2026-05-23 09:14", event: "DigiLocker consent verified", status: "PASS" },
  { ts: "2026-05-22 18:42", event: "90-day SSC window updated (+1 day)", status: "LOG" },
  { ts: "2026-05-22 11:05", event: "KA 1% cess eligibility check", status: "PENDING" },
  { ts: "2026-05-21 07:30", event: "ESIC readiness score computed", status: "PASS" },
];

function NeonCard({
  children,
  className = "",
  glow = "primary",
}: {
  children: React.ReactNode;
  className?: string;
  glow?: "primary" | "secondary" | "accent";
}) {
  const glowCls =
    glow === "secondary" ? "border-secondary/40" : glow === "accent" ? "border-accent/40" : "border-primary/40";
  return (
    <div className={`glass-card p-4 ${glowCls} ${className}`}>{children}</div>
  );
}

const Welfare = () => {
  const { welfare, earnings, wallet, loading, todayEarnings } = useLedger();

  const chartData = useMemo(() => {
    const byDay: Record<string, number> = {};
    earnings.slice(0, 14).forEach((e) => {
      byDay[e.date] = (byDay[e.date] || 0) + Number(e.amount_earned);
    });
    return Object.entries(byDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7)
      .map(([date, amount]) => ({
        day: date.slice(5),
        amount: Math.round(amount),
      }));
  }, [earnings]);

  const contribData = useMemo(
    () => [
      { month: "Jan", ka: 120, esic: 80 },
      { month: "Feb", ka: 145, esic: 95 },
      { month: "Mar", ka: 160, esic: 110 },
      { month: "Apr", ka: 180, esic: 125 },
      { month: "May", ka: 195, esic: 140 },
    ],
    [],
  );

  if (loading || !welfare) {
    return (
      <AppShell title="Digital ShramSetu" kn="ಡಿಜಿಟಲ್ ಶ್ರಮಸೇತು">
        <Skeleton className="h-44 w-full rounded-3xl mb-4" />
        <Skeleton className="h-48 w-full rounded-3xl mb-4" />
        <Skeleton className="h-32 w-full rounded-3xl" />
      </AppShell>
    );
  }

  const days = welfare.active_working_days;
  const total = 90;
  const remaining = Math.max(0, total - days);
  const pct = Math.min(100, (days / total) * 100);
  const complianceScore = Math.min(99, Math.round(52 + pct * 0.45 + (wallet?.gig_credit_score ?? 0) / 15));
  const inclusionScore = Math.min(98, Math.round(48 + pct * 0.38 + chartData.length * 3));
  const kaCess = Math.round(days * 8.5);
  const esicReady = pct >= 60;
  const pfReady = pct >= 75;

  return (
    <AppShell title="Digital ShramSetu" kn="ಡಿಜಿಟಲ್ ಶ್ರಮಸೇತು">
      <div className="mb-3 flex items-center gap-2 animate-fade-in">
        <Landmark className="h-4 w-4 text-accent" />
        <p className="text-[10px] font-mono-tech uppercase tracking-[0.3em] text-accent">
          Regulatory Infrastructure • Social Security Code
        </p>
      </div>

      {/* 90-day tracker */}
      <NeonCard glow="accent" className="relative overflow-hidden mb-4 animate-scale-in">
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-accent/25 blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-mono-tech">90-Day SSC Eligibility</p>
            <BadgeCheck className="h-4 w-4 text-secondary" />
          </div>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-5xl font-extrabold tabular-nums text-gradient-saffron">{days}</span>
            <span className="mb-1.5 text-lg text-muted-foreground">/ {total} days</span>
          </div>
          <p className="mt-1 text-sm font-semibold">{remaining} days to full Social Security unlock</p>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-saffron transition-all duration-1000 shadow-[0_0_12px_hsl(var(--accent))]"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-mono-tech text-muted-foreground">
            <span>DAY 0</span>
            <span className="text-accent">DAY 90 → SSC READY</span>
          </div>
        </div>
      </NeonCard>

      {/* Score cards */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        {[
          { label: "Compliance Score", value: complianceScore, icon: ShieldCheck, color: "text-primary" },
          { label: "Financial Inclusion", value: inclusionScore, icon: TrendingUp, color: "text-secondary" },
          { label: "KA 1% Cess Tracked", value: `₹${kaCess}`, icon: Landmark, color: "text-accent" },
          { label: "Today's Ledger", value: `₹${Math.round(todayEarnings)}`, icon: Activity, color: "text-primary" },
        ].map((s, i) => (
          <NeonCard key={s.label} className="animate-fade-in" glow={i % 2 === 0 ? "primary" : "secondary"}>
            <s.icon className={`mb-2 h-4 w-4 ${s.color}`} />
            <p className="text-[10px] font-mono-tech uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
          </NeonCard>
        ))}
      </div>

      {/* ESIC / PF readiness */}
      <NeonCard className="mb-4 animate-fade-in">
        <p className="mb-3 text-[10px] font-mono-tech uppercase tracking-widest text-muted-foreground">
          ESIC / PF Readiness
        </p>
        <div className="space-y-3">
          {[
            { label: "ESIC Registration", ready: esicReady, pct: Math.min(100, pct + 10) },
            { label: "PF Compliance", ready: pfReady, pct: Math.min(100, pct) },
            { label: "DigiLocker KYC", ready: true, pct: 100 },
          ].map((r) => (
            <div key={r.label}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-semibold">{r.label}</span>
                <span className={r.ready ? "text-secondary font-mono-tech" : "text-accent font-mono-tech"}>
                  {r.ready ? "READY" : "IN PROGRESS"}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${r.ready ? "bg-secondary" : "bg-accent"}`}
                  style={{ width: `${r.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </NeonCard>

      {/* Earnings chart */}
      {chartData.length > 0 && (
        <NeonCard className="mb-4 h-44 animate-fade-in">
          <p className="mb-2 text-[10px] font-mono-tech uppercase tracking-widest text-muted-foreground">
            Earnings Ledger (7d)
          </p>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 11,
                }}
              />
              <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" fill="url(#earnGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </NeonCard>
      )}

      {/* Monthly contributions */}
      <NeonCard className="mb-4 h-44 animate-fade-in">
        <p className="mb-2 text-[10px] font-mono-tech uppercase tracking-widest text-muted-foreground">
          Monthly Contribution Analytics
        </p>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={contribData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 11,
              }}
            />
            <Bar dataKey="ka" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="KA Cess ₹" />
            <Bar dataKey="esic" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} name="ESIC ₹" />
          </BarChart>
        </ResponsiveContainer>
      </NeonCard>

      {/* State readiness */}
      <NeonCard className="mb-4 animate-fade-in">
        <p className="mb-3 text-[10px] font-mono-tech uppercase tracking-widest text-muted-foreground">
          State Labor Policy Readiness
        </p>
        <div className="grid grid-cols-3 gap-2">
          {STATES.map((s) => (
            <div
              key={s.name}
              className={`rounded-xl border p-2 text-center ${s.ready ? "border-secondary/50 bg-secondary/10" : "border-border bg-muted/30"}`}
            >
              <p className="text-xs font-bold">{s.name}</p>
              <p className="text-lg font-extrabold tabular-nums text-primary">{s.score}</p>
              {s.ready && <p className="text-[9px] font-mono-tech text-secondary">LIVE</p>}
            </div>
          ))}
        </div>
      </NeonCard>

      {/* AI insights */}
      <NeonCard glow="secondary" className="mb-4 animate-fade-in">
        <div className="flex items-start gap-3">
          <Brain className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
          <div>
            <p className="text-[10px] font-mono-tech uppercase tracking-widest text-secondary">AI Welfare Insights</p>
            <p className="mt-1 text-sm leading-relaxed">
              At current pace you unlock full Karnataka welfare cess in{" "}
              <span className="font-bold text-accent">{remaining} days</span>. Upload 2 more OCR entries this week to
              boost financial inclusion score by ~4 points.
            </p>
          </div>
        </div>
      </NeonCard>

      {/* Audit log */}
      <NeonCard className="mb-4 animate-fade-in">
        <div className="mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <p className="text-[10px] font-mono-tech uppercase tracking-widest text-muted-foreground">
            Audit-Ready Regulatory Logs
          </p>
        </div>
        <div className="space-y-2">
          {AUDIT_LOG.map((log) => (
            <div key={log.ts} className="flex items-center justify-between border-b border-border/50 pb-2 text-[11px] last:border-0">
              <div>
                <p className="font-mono-tech text-muted-foreground">{log.ts}</p>
                <p className="font-medium">{log.event}</p>
              </div>
              <span
                className={`font-mono-tech text-[10px] ${log.status === "PASS" ? "text-secondary" : log.status === "PENDING" ? "text-accent" : "text-muted-foreground"}`}
              >
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </NeonCard>

      {/* Benefits */}
      <p className="mb-2 mt-2 px-1 text-[10px] font-mono-tech tracking-widest text-muted-foreground">UNLOCKING SOON</p>
      <div className="mb-4 space-y-3">
        <div className="glass-card flex animate-fade-in items-center gap-3 border-secondary/30 p-4">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary/15">
            <HeartPulse className="h-5 w-5 text-secondary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Health Insurance ₹5L</p>
            <p className="text-[11px] font-kannada text-muted-foreground">ಆಯುಷ್ಮಾನ್ ಭಾರತ್ aligned</p>
          </div>
          <span className="text-[10px] font-mono-tech text-secondary">{remaining} DAYS</span>
        </div>
        <div className="glass-card flex animate-fade-in items-center gap-3 border-accent/30 p-4">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent/15">
            <Landmark className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">KA State 1% Welfare Cess</p>
            <p className="text-[11px] font-kannada text-muted-foreground">ಕರ್ನಾಟಕ ೧% ಸೆಸ್</p>
          </div>
          <span className="text-[10px] font-mono-tech text-accent">{remaining} DAYS</span>
        </div>
      </div>

      {/* Verified badges */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        {["DigiLocker", "e-Shram", "Aadhaar KYC", "PM-SYM Pension"].map((label) => (
          <div key={label} className="glass-card flex animate-fade-in items-center gap-2 p-3">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
            <p className="truncate text-sm font-semibold">{label} ✓</p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-[10px] font-mono-tech tracking-[0.25em] text-muted-foreground">
        GIGAI BHARAT IS NOT A GIG APP — IT IS REGULATORY INFRASTRUCTURE
      </p>
    </AppShell>
  );
};

export default Welfare;
