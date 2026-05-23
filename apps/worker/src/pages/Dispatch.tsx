import { AppShell } from "@/components/AppShell";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/i18n/context";
import { dispatchZones, evHubs } from "@/data/worker-os";
import { AiInsightCard } from "@/os/AiInsightCard";
import { OsCard, HudLabel } from "@/os/OsCard";
import { Battery, MapPin, Navigation, Plane, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const demandColor = {
  surge: "text-accent bg-accent/15 border-accent/30",
  high: "text-secondary bg-secondary/15 border-secondary/30",
  medium: "text-primary bg-primary/15 border-primary/30",
  low: "text-muted-foreground bg-muted/30 border-border/60",
};

const Dispatch = () => {
  const { t } = useI18n();

  return (
    <AppShell title={t.dispatch.title} kn={t.dispatch.subtitle}>
      <AiInsightCard
        live
        title={t.dispatch.surgeZones}
        body={`${t.dispatch.moveTo} ${dispatchZones[0].name} — ${dispatchZones[0].multiplier}x in ${dispatchZones[0].etaMin} min`}
        impact={`+₹${dispatchZones[0].estEarnings}`}
        icon={Zap}
      />

      {/* Heatmap visual */}
      <OsCard glow="neon" className="my-4 overflow-hidden p-0">
        <div className="relative aspect-[4/3] bg-[radial-gradient(circle_at_30%_40%,hsl(var(--accent)/0.35),transparent_50%),radial-gradient(circle_at_70%_60%,hsl(var(--secondary)/0.3),transparent_45%),hsl(var(--muted)/0.5)]">
          {dispatchZones.slice(0, 4).map((z, i) => (
            <div
              key={z.id}
              className="absolute animate-pulse-glow rounded-full border-2 border-secondary/60 bg-secondary/20"
              style={{
                width: `${40 + z.multiplier * 12}px`,
                height: `${40 + z.multiplier * 12}px`,
                left: `${15 + i * 22}%`,
                top: `${20 + (i % 2) * 30}%`,
              }}
            />
          ))}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-4">
            <HudLabel className="text-secondary">{t.dispatch.idle}</HudLabel>
            <p className="text-xs text-muted-foreground">AI routing reduces idle time 23% vs platform default</p>
          </div>
        </div>
      </OsCard>

      {/* Zone list */}
      <div className="space-y-3 mb-4">
        {dispatchZones.map((z) => (
          <OsCard key={z.id} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{z.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {z.distanceKm} km • {z.etaMin} min • +₹{z.estEarnings} {t.dispatch.est}
              </p>
            </div>
            <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold ${demandColor[z.demand]}`}>
              {z.multiplier}x
            </span>
          </OsCard>
        ))}
      </div>

      {/* EV hubs */}
      <HudLabel className="mb-3 block">{t.dispatch.evHubs}</HudLabel>
      <div className="mb-4 space-y-2">
        {evHubs.map((h) => (
          <OsCard key={h.name} className="flex items-center gap-3 py-3">
            <Battery className="h-5 w-5 text-secondary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{h.name}</p>
              <p className="text-[10px] text-muted-foreground">{h.slots} slots • ~{h.waitMin} min wait</p>
            </div>
          </OsCard>
        ))}
      </div>

      {/* Airport intel */}
      <OsCard glow="saffron" className="mb-4">
        <div className="flex items-center gap-2">
          <Plane className="h-5 w-5 text-accent" />
          <HudLabel className="text-accent">{t.dispatch.airport}</HudLabel>
        </div>
        <p className="mt-2 text-sm">BLR T1 queue: <span className="font-bold text-accent">2.1x surge</span> — 35 min ETA, ₹890 est. trip</p>
      </OsCard>

      <Link
        to="/map"
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-primary/10 py-4 font-semibold text-primary"
      >
        <Navigation className="h-5 w-5" />
        {t.dispatch.map}
        <MapPin className="h-4 w-4 opacity-60" />
      </Link>
    </AppShell>
  );
};

export default Dispatch;
