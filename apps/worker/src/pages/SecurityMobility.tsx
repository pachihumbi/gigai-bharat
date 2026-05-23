import { AppShell } from "@/components/AppShell";
import { useI18n } from "@/i18n/context";
import { securityStack } from "@/data/ev-fleet";
import { OsCard, HudLabel } from "@/os/OsCard";
import { AlertTriangle, Eye, Radio, ShieldCheck, Users } from "lucide-react";

const icons = [ShieldCheck, Eye, AlertTriangle, Radio, ShieldCheck, Users];

const SecurityMobility = () => {
  const { t } = useI18n();

  return (
    <AppShell title={t.security.title} kn={t.security.subtitle}>
      <OsCard glow="green" className="mb-4">
        <div className="flex items-center gap-2">
          <Radio className="h-5 w-5 animate-pulse text-secondary" />
          <HudLabel className="text-secondary">{t.security.socLive}</HudLabel>
        </div>
        <div className="mt-4 space-y-2 font-mono text-[11px]">
          {["VinFast MPV7 · Verified · SOC 81%", "Route risk · MG Rd · LOW", "SOS standby · 0 active", "Women-safe corridor · ACTIVE"].map((line) => (
            <p key={line} className="rounded border border-secondary/20 bg-secondary/5 px-3 py-2 text-foreground/80">
              ▸ {line}
            </p>
          ))}
        </div>
      </OsCard>

      <div className="grid gap-3">
        {securityStack.map((s, i) => {
          const Icon = icons[i];
          return (
            <OsCard key={s.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold">{s.label}</span>
              </div>
              <span className="rounded-full bg-secondary/15 px-2 py-0.5 text-[10px] font-bold text-secondary">
                {t.security.active}
              </span>
            </OsCard>
          );
        })}
      </div>

      <OsCard glow="saffron" className="mt-4">
        <AlertTriangle className="mb-2 h-6 w-6 text-accent" />
        <p className="font-semibold">{t.security.sosTitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t.security.sosBody}</p>
        <button type="button" className="mt-4 w-full rounded-xl bg-destructive/20 py-3 font-bold text-destructive border border-destructive/40">
          {t.security.sosButton}
        </button>
      </OsCard>
    </AppShell>
  );
};

export default SecurityMobility;
