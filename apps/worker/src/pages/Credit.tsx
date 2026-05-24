import { AppShell } from "@/components/AppShell";
import { useWorkerOs } from "@/hooks/useWorkerOs";
import { useI18n } from "@/i18n/context";
import { GIGAI_CREDIT } from "@/lib/dignity-demo";
import { DEMO_WALLET } from "@/lib/demo-data";
import { CreditGauge } from "@/os/CreditGauge";
import { ArrowUp, Minus, Shield, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const trendIcon = {
  up: ArrowUp,
  down: ArrowUp,
  stable: Minus,
};

const Credit = () => {
  const { t } = useI18n();
  const { wallet, os } = useWorkerOs();
  const score = wallet?.gig_credit_score ?? DEMO_WALLET.gig_credit_score;
  const credit = GIGAI_CREDIT;

  return (
    <AppShell title={t.credit.title} kn={t.credit.subtitle}>
      <div className="pod-card flex flex-col items-center py-6 mb-4 animate-scale-in fintech-glow-green">
        <CreditGauge score={score} />
        <p className="mt-4 max-w-xs text-center text-sm text-foreground/75">{t.credit.subtitle}</p>
        <p className="mt-2 text-xs font-bold text-emerald-300">
          Pre-approved ₹{credit.preApproved.toLocaleString("en-IN")} · Earning-based trust
        </p>
      </div>

      <p className="text-[10px] font-mono-tech uppercase tracking-widest text-foreground/50 mb-3">{t.credit.factors}</p>
      <div className="space-y-3 mb-6">
        {(os.creditFactors.length ? os.creditFactors : credit.factors.map((f) => ({
          id: f.label,
          label: f.label,
          score: f.score,
          max: f.max,
          trend: "up" as const,
          detail: "AI trust composite",
        }))).map((f) => {
          const Icon = trendIcon[f.trend as keyof typeof trendIcon] ?? ArrowUp;
          return (
            <div key={f.id} className="pod-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-bright">{f.label}</p>
                <span className="flex items-center gap-1 text-xs text-emerald-300">
                  <Icon className="h-3 w-3" />
                  {f.score}/{f.max}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/40">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all"
                  style={{ width: `${(f.score / f.max) * 100}%` }}
                />
              </div>
              {"detail" in f && f.detail && (
                <p className="mt-2 text-[11px] text-foreground/55">{f.detail}</p>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[10px] font-mono uppercase text-foreground/50 mb-2">Credit products</p>
      <div className="space-y-2 mb-6">
        {credit.products.map((p) => (
          <div key={p.name} className="pod-card p-3.5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-bright">{p.name}</p>
              <p className="text-[11px] text-foreground/55">Up to ₹{p.limit.toLocaleString("en-IN")} · {p.rate}</p>
            </div>
            <Shield className="h-4 w-4 text-emerald-400" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="pod-card p-4 fintech-glow-cyan">
          <Shield className="mb-2 h-5 w-5 text-cyan-400" />
          <p className="text-[10px] font-mono uppercase text-foreground/50">{t.credit.lending}</p>
          <p className="mt-2 text-lg font-bold text-cyan-300">{os.lending.label}</p>
          {os.lending.amount > 0 && (
            <p className="text-sm text-foreground/60">Up to ₹{os.lending.amount.toLocaleString("en-IN")} @ {os.lending.rate}</p>
          )}
        </div>
        <div className="pod-card p-4">
          <TrendingUp className="mb-2 h-5 w-5 text-emerald-400" />
          <p className="text-[10px] font-mono uppercase text-foreground/50">{t.credit.insurance}</p>
          <p className="mt-2 text-lg font-bold text-emerald-300">{credit.insuranceEligible ? "Eligible" : "Building"}</p>
          <p className="text-[11px] text-foreground/55">Health + accident cover</p>
        </div>
      </div>

      <div className="pod-card p-4 border-emerald-400/20 mb-4">
        <p className="text-[10px] font-mono uppercase text-emerald-300/90">{t.credit.reliability}</p>
        <p className="mt-2 text-3xl font-extrabold tabular-nums text-bright">
          {os.complianceScore}<span className="text-lg text-foreground/50">/99</span>
        </p>
        <p className="mt-1 text-sm text-foreground/60">Behavioral + financial trust composite</p>
      </div>

      <Link to="/dignity" className="block pod-card py-3.5 text-center text-sm font-bold text-violet-200 border-violet-400/25">
        Worker dignity infrastructure →
      </Link>
    </AppShell>
  );
};

export default Credit;
