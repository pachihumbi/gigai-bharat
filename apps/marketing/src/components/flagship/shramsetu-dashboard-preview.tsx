import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import { Brain, Shield, TrendingUp, Landmark } from "lucide-react";
import { GlassPanel, HudLabel, HudValue, LiveDot } from "@/components/ui/glass-panel";

const LIFECYCLE = [
  { day: 0, label: "Onboard", status: "done" },
  { day: 15, label: "DigiLocker", status: "done" },
  { day: 30, label: "e-Shram", status: "done" },
  { day: 45, label: "OCR Ledger", status: "active" },
  { day: 60, label: "ESIC prep", status: "pending" },
  { day: 75, label: "PF readiness", status: "pending" },
  { day: 90, label: "SSC unlock", status: "pending" },
] as const;

const AUDIT = [
  { ts: "09:14 IST", event: "DigiLocker consent verified", status: "PASS" },
  { ts: "Yesterday", event: "KA 1% cess accrual updated", status: "LOG" },
  { ts: "2d ago", event: "ESIC readiness score computed", status: "PASS" },
];

export function ShramSetuDashboardPreview() {
  const [days, setDays] = useState(0);
  const targetDays = 47;

  useEffect(() => {
    const t = setTimeout(() => setDays(targetDays), 400);
    return () => clearTimeout(t);
  }, []);

  const pct = Math.min(100, (days / 90) * 100);
  const compliance = Math.min(99, Math.round(52 + pct * 0.45));
  const inclusion = Math.min(98, Math.round(48 + pct * 0.38));

  const earningsData = useMemo(
    () =>
      ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({
        day: d,
        amount: 620 + i * 85 + (i % 2) * 120,
      })),
    [],
  );

  const contribData = useMemo(
    () => [
      { m: "Jan", ka: 120, esic: 80 },
      { m: "Feb", ka: 145, esic: 95 },
      { m: "Mar", ka: 160, esic: 110 },
      { m: "Apr", ka: 180, esic: 125 },
      { m: "May", ka: 195, esic: 140 },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <GlassPanel glow className="relative overflow-hidden p-6 md:p-8">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[color:var(--saffron)]/15 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <LiveDot />
              <HudLabel>90-day Social Security Code tracker</HudLabel>
            </div>
            <div className="flex items-end gap-2">
              <motion.span
                className="font-serif text-5xl tabular-nums text-[color:var(--saffron)] md:text-6xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {days}
              </motion.span>
              <span className="mb-2 text-lg text-muted-foreground">/ 90 days</span>
            </div>
            <p className="mt-2 text-sm text-foreground/70">
              Karnataka 1% welfare fee tracked · {90 - days} days to full unlock
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="border border-[color:var(--neon)]/30 bg-card/50 p-3">
              <Shield className="mb-1 h-4 w-4 text-[color:var(--neon)]" />
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Compliance</p>
              <p className="text-2xl font-bold tabular-nums text-[color:var(--neon)]">{compliance}</p>
            </div>
            <div className="border border-[color:var(--saffron)]/30 bg-card/50 p-3">
              <TrendingUp className="mb-1 h-4 w-4 text-[color:var(--saffron)]" />
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Inclusion</p>
              <p className="text-2xl font-bold tabular-nums text-[color:var(--saffron)]">{inclusion}</p>
            </div>
          </div>
        </div>
        <div className="relative mt-6 h-3 overflow-hidden rounded-full bg-border">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[color:var(--saffron)] to-[color:var(--neon)]"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
      </GlassPanel>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassPanel className="h-52 p-4 md:h-56">
          <HudLabel>Earnings ledger analytics (7d demo)</HudLabel>
          <ResponsiveContainer width="100%" height="85%" className="mt-2">
            <AreaChart data={earningsData}>
              <defs>
                <linearGradient id="shramEarn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--neon)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="var(--neon)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }} />
              <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }} />
              <Tooltip contentStyle={{ background: "rgba(8,12,20,0.95)", border: "1px solid rgba(0,255,255,0.2)" }} />
              <Area type="monotone" dataKey="amount" stroke="var(--neon)" fill="url(#shramEarn)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassPanel>

        <GlassPanel className="h-52 p-4 md:h-56">
          <HudLabel>Monthly contribution analytics</HudLabel>
          <ResponsiveContainer width="100%" height="85%" className="mt-2">
            <BarChart data={contribData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="m" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }} />
              <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }} />
              <Tooltip contentStyle={{ background: "rgba(8,12,20,0.95)", border: "1px solid rgba(0,255,255,0.2)" }} />
              <Bar dataKey="ka" fill="var(--saffron)" radius={[4, 4, 0, 0]} name="KA cess ₹" />
              <Bar dataKey="esic" fill="var(--neon)" radius={[4, 4, 0, 0]} name="ESIC ₹" />
            </BarChart>
          </ResponsiveContainer>
        </GlassPanel>
      </div>

      <GlassPanel className="p-6">
        <HudLabel>Worker lifecycle timeline</HudLabel>
        <div className="mt-6 flex flex-wrap gap-2 md:gap-0 md:justify-between">
          {LIFECYCLE.map((step, i) => (
            <div key={step.day} className="flex flex-col items-center md:flex-1">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold ${
                  step.status === "done"
                    ? "border-[color:var(--neon)] bg-[color:var(--neon)]/20 text-[color:var(--neon)]"
                    : step.status === "active"
                      ? "border-[color:var(--saffron)] bg-[color:var(--saffron)]/20 text-[color:var(--saffron)] animate-pulse"
                      : "border-border text-muted-foreground"
                }`}
              >
                {step.day}
              </div>
              <p className="mt-2 text-center text-[10px] font-mono uppercase tracking-wider md:text-xs">{step.label}</p>
              {i < LIFECYCLE.length - 1 && (
                <div className="hidden h-0.5 flex-1 bg-border md:absolute md:block" aria-hidden />
              )}
            </div>
          ))}
        </div>
      </GlassPanel>

      <div className="grid gap-4 md:grid-cols-2">
        <GlassPanel className="p-5">
          <div className="flex items-start gap-3">
            <Brain className="h-5 w-5 shrink-0 text-[color:var(--neon)]" />
            <div>
              <HudLabel>AI welfare insights</HudLabel>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                Upload 2 more OCR entries this week to boost financial inclusion score by ~4 points. ESIC registration
                unlocks at day 60 at current pace.
              </p>
            </div>
          </div>
        </GlassPanel>
        <GlassPanel className="p-5">
          <div className="flex items-start gap-3">
            <Landmark className="h-5 w-5 shrink-0 text-[color:var(--saffron)]" />
            <div>
              <HudLabel>PF / ESIC readiness</HudLabel>
              <div className="mt-3 space-y-2">
                {[
                  { label: "ESIC", pct: 58, ready: false },
                  { label: "PF", pct: 52, ready: false },
                  { label: "DigiLocker KYC", pct: 100, ready: true },
                ].map((r) => (
                  <div key={r.label}>
                    <div className="flex justify-between text-xs">
                      <span>{r.label}</span>
                      <span className={r.ready ? "text-[color:var(--neon)]" : "text-[color:var(--saffron)]"}>
                        {r.ready ? "READY" : "IN PROGRESS"}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-border">
                      <div
                        className={`h-full rounded-full ${r.ready ? "bg-[color:var(--neon)]" : "bg-[color:var(--saffron)]"}`}
                        style={{ width: `${r.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>

      <GlassPanel className="p-5">
        <HudLabel>Regulatory audit logs</HudLabel>
        <div className="mt-4 space-y-2">
          {AUDIT.map((log) => (
            <div key={log.event} className="flex items-center justify-between border-b border-border/50 py-2 text-sm last:border-0">
              <div>
                <p className="font-mono text-[10px] text-muted-foreground">{log.ts}</p>
                <p>{log.event}</p>
              </div>
              <span className="font-mono text-[10px] text-[color:var(--neon)]">{log.status}</span>
            </div>
          ))}
        </div>
      </GlassPanel>

      <p className="text-center font-serif text-lg italic text-[color:var(--neon)]">
        GigAI Bharat is labor infrastructure, not a gig app.
      </p>
    </div>
  );
}
