import { formatMetric, useLiveMetrics } from "@/hooks/use-live-metrics";
import { GlassPanel, HudLabel, HudValue } from "@/components/ui/glass-panel";
import { cn } from "@/lib/cn";

export function LiveMetricsPanel({ compact = false }: { compact?: boolean }) {
  const { metrics } = useLiveMetrics();

  return (
    <GlassPanel glow className={cn("p-4 md:p-5", compact && "p-3")}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <HudLabel>Platform metrics</HudLabel>
        </div>
      </div>
      <div className={cn("grid gap-3", compact ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3")}>
        {metrics.map((m) => (
          <div
            key={m.id}
            className="border border-border/60 bg-background/40 px-3 py-3 transition-colors hover:border-[color:var(--neon)]/30"
          >
            <HudLabel>{m.label}</HudLabel>
            <HudValue className={cn("mt-1 text-xl md:text-2xl", compact && "text-lg")}>
              {formatMetric(m)}
            </HudValue>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
