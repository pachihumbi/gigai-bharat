import { AppShell } from "@/components/AppShell";
import {
  InsurancePensionPanel,
  WelfareSchemesGrid,
  WorkerIdentityCard,
} from "@/components/shramsetu";
import { useLedger } from "@/hooks/useLedger";
import {
  DEMO_CONTRIBUTION_TREND,
  DEMO_INSURANCE,
  DEMO_PENSION,
  DEMO_SHRAMSETU_PROFILE,
  DEMO_WELFARE_SCHEMES,
} from "@/lib/shramsetu-demo";
import { DEMO_WALLET, DEMO_WELFARE, DEMO_WORKER } from "@/lib/demo-data";
import { BadgeCheck, Brain, FileText, Landmark, ShieldCheck, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const AUDIT_LOG = [
  { ts: "2026-05-24 09:14", event: "DigiLocker consent verified", status: "PASS" },
  { ts: "2026-05-23 18:42", event: "SSC 90-day window +1 day", status: "LOG" },
  { ts: "2026-05-23 11:05", event: "KA 1% cess eligibility check", status: "PASS" },
  { ts: "2026-05-22 07:30", event: "ESIC readiness score computed", status: "PASS" },
];

const Welfare = () => {
  const { worker, welfare, wallet, todayEarnings, isDemo } = useLedger();

  const displayWorker = worker ?? DEMO_WORKER;
  const displayWelfare = welfare ?? DEMO_WELFARE;
  const displayWallet = wallet ?? DEMO_WALLET;

  const days = displayWelfare.active_working_days;
  const total = 90;
  const remaining = Math.max(0, total - days);
  const pct = Math.min(100, (days / total) * 100);
  const complianceScore = Math.min(99, Math.round(52 + pct * 0.45 + displayWallet.gig_credit_score / 15));
  const today = Math.round(todayEarnings || 2850);

  return (
    <AppShell title="ShramSetu" kn="ಶ್ರಮಸೇತು · Digital Welfare Bridge">
      <div className="mb-4 flex items-center gap-2 animate-fade-in">
        <Landmark className="h-4 w-4 text-orange-400" />
        <p className="text-[10px] font-mono-tech uppercase tracking-[0.28em] text-orange-300/90">
          Govt-tech · Social Security Code · India Stack
        </p>
      </div>

      <div className="space-y-4 sm:space-y-5">
        <WorkerIdentityCard worker={displayWorker} verified />

        {/* 90-day SSC */}
        <div className="govtech-card relative overflow-hidden p-5 animate-scale-in">
          <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.25em] text-orange-300 font-mono-tech">
                90-Day SSC Eligibility
              </p>
              <BadgeCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-5xl font-extrabold tabular-nums text-gradient-saffron">{days}</span>
              <span className="mb-1.5 text-lg text-foreground/70">/ {total} days</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-bright">
              {remaining} days to full Social Security unlock
            </p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/40 border border-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 transition-all duration-1000 shadow-[0_0_16px_rgba(255,140,0,0.4)]"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-mono-tech text-foreground/55">
              <span>DAY 0</span>
              <span className="text-orange-300">DAY 90 → SSC READY</span>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Compliance", value: complianceScore, icon: ShieldCheck, color: "text-cyan-300" },
            { label: "Inclusion", value: 94, icon: TrendingUp, color: "text-emerald-300" },
            { label: "KA Cess", value: `₹${Math.round(days * 8.5)}`, icon: Landmark, color: "text-orange-300" },
            { label: "Today", value: `₹${today}`, icon: BadgeCheck, color: "text-cyan-200" },
          ].map((s, i) => (
            <div key={s.label} className="fintech-card p-4 animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
              <s.icon className={`mb-2 h-4 w-4 ${s.color}`} />
              <p className="text-[10px] font-mono uppercase tracking-wider text-foreground/55">{s.label}</p>
              <p className={`text-2xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <WelfareSchemesGrid schemes={DEMO_WELFARE_SCHEMES} />

        <InsurancePensionPanel insurance={DEMO_INSURANCE} pension={DEMO_PENSION} />

        {/* Contributions chart */}
        <div className="fintech-card p-4 sm:p-5 h-52 animate-fade-in">
          <p className="mb-3 text-[10px] font-mono-tech uppercase tracking-widest text-foreground/55">
            Monthly contribution analytics
          </p>
          <ResponsiveContainer width="100%" height="78%">
            <BarChart data={DEMO_CONTRIBUTION_TREND}>
              <CartesianGrid strokeDasharray="3 6" stroke="hsl(200 60% 18% / 0.5)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(200 30% 75%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(200 30% 75%)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(215 60% 6%)",
                  border: "1px solid hsl(200 100% 50% / 0.25)",
                  borderRadius: 12,
                  fontSize: 11,
                }}
              />
              <Bar dataKey="ka" fill="hsl(33 100% 50%)" radius={[4, 4, 0, 0]} name="KA Cess ₹" />
              <Bar dataKey="esic" fill="hsl(150 100% 50%)" radius={[4, 4, 0, 0]} name="ESIC ₹" />
              <Bar dataKey="pension" fill="hsl(200 100% 50%)" radius={[4, 4, 0, 0]} name="Pension ₹" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI insight */}
        <div className="fintech-card p-4 fintech-glow-green animate-fade-in">
          <div className="flex items-start gap-3">
            <Brain className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-300/90">AI welfare coach</p>
              <p className="mt-1.5 text-sm leading-relaxed text-bright">
                {displayWorker.name} unlocks full Karnataka welfare cess in{" "}
                <span className="font-bold text-orange-300">{remaining} days</span>. e-Shram ID{" "}
                <span className="font-mono text-cyan-200">{DEMO_SHRAMSETU_PROFILE.eshramId}</span> is active.
              </p>
            </div>
          </div>
        </div>

        {/* Audit log */}
        <div className="fintech-card p-4 animate-fade-in">
          <div className="mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-cyan-400" />
            <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/55">
              Audit-ready regulatory logs
            </p>
          </div>
          <div className="space-y-2">
            {AUDIT_LOG.map((log) => (
              <div
                key={log.ts}
                className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-[11px] last:border-0"
              >
                <div>
                  <p className="font-mono text-foreground/50">{log.ts}</p>
                  <p className="font-medium text-bright">{log.event}</p>
                </div>
                <span
                  className={`font-mono text-[10px] ${log.status === "PASS" ? "text-emerald-400" : "text-foreground/55"}`}
                >
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isDemo && (
        <p className="mt-6 text-center text-[10px] font-mono text-cyan-400/60">Investor demo · ShramSetu v2</p>
      )}

      <p className="mt-4 text-center text-[10px] font-mono-tech tracking-[0.22em] text-foreground/45 pb-2">
        REGULATORY INFRASTRUCTURE · NOT A GIG APP
      </p>
    </AppShell>
  );
};

export default Welfare;
