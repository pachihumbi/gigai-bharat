import { AppShell } from "@/components/AppShell";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkerOs } from "@/hooks/useWorkerOs";
import { useI18n } from "@/i18n/context";
import { CreditGauge } from "@/os/CreditGauge";
import { OsCard, HudLabel } from "@/os/OsCard";
import { ArrowUp, Minus, Shield, TrendingUp } from "lucide-react";

const trendIcon = {
  up: ArrowUp,
  down: ArrowUp,
  stable: Minus,
};

const Credit = () => {
  const { t } = useI18n();
  const { wallet, loading, os } = useWorkerOs();
  const score = wallet?.gig_credit_score ?? 300;

  if (loading) {
    return (
      <AppShell title={t.credit.title}>
        <Skeleton className="h-48 w-full rounded-3xl" />
        <Skeleton className="mt-4 h-64 w-full rounded-3xl" />
      </AppShell>
    );
  }

  return (
    <AppShell title={t.credit.title} kn={t.credit.subtitle}>
      <OsCard glow="green" className="flex flex-col items-center py-6">
        <CreditGauge score={score} />
        <p className="mt-4 max-w-xs text-center text-sm text-muted-foreground">
          {t.credit.subtitle}
        </p>
      </OsCard>

      <HudLabel className="mb-3 mt-6 block">{t.credit.factors}</HudLabel>
      <div className="space-y-3 mb-6">
        {os.creditFactors.map((f) => {
          const Icon = trendIcon[f.trend];
          return (
            <OsCard key={f.id}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{f.label}</p>
                <span className="flex items-center gap-1 text-xs text-secondary">
                  <Icon className="h-3 w-3" />
                  {f.score}/{f.max}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                  style={{ width: `${(f.score / f.max) * 100}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">{f.detail}</p>
            </OsCard>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <OsCard glow="neon">
          <Shield className="mb-2 h-5 w-5 text-primary" />
          <HudLabel>{t.credit.lending}</HudLabel>
          <p className="mt-2 text-lg font-bold text-primary">{os.lending.label}</p>
          {os.lending.amount > 0 && (
            <p className="text-sm text-muted-foreground">Up to ₹{os.lending.amount.toLocaleString("en-IN")} @ {os.lending.rate}</p>
          )}
        </OsCard>
        <OsCard>
          <TrendingUp className="mb-2 h-5 w-5 text-secondary" />
          <HudLabel>{t.credit.insurance}</HudLabel>
          <p className="mt-2 text-lg font-bold text-secondary">{score >= 650 ? "Eligible" : "Building"}</p>
          <p className="text-[11px] text-muted-foreground">Health + accident cover</p>
        </OsCard>
      </div>

      <OsCard className="border-secondary/30">
        <HudLabel className="text-secondary">{t.credit.reliability}</HudLabel>
        <p className="mt-2 text-3xl font-extrabold tabular-nums">{os.complianceScore}<span className="text-lg text-muted-foreground">/99</span></p>
        <p className="mt-1 text-sm text-muted-foreground">Behavioral + financial trust composite</p>
      </OsCard>
    </AppShell>
  );
};

export default Credit;
