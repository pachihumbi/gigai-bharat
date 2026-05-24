import { FadeIn } from "@/components/motion/fade-in";
import { GlassPanel, HudLabel } from "@/components/ui/glass-panel";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { DispatchVisualization } from "@/components/viz/dispatch-visualization";
import { WorkerEconomyMap } from "@/components/viz/worker-economy-map";
import { fleetOsMetrics } from "@/data/cinematic";

function DemandHeatmap() {
  const cells = Array.from({ length: 64 }, (_, i) => {
    const intensity = Math.sin(i * 0.7) * 0.5 + 0.5;
    return intensity;
  });

  return (
    <GlassPanel className="p-4">
      <HudLabel>AI Demand Prediction Heatmap</HudLabel>
      <div className="mt-4 grid grid-cols-8 gap-1">
        {cells.map((intensity, i) => (
          <div
            key={i}
            className="aspect-square rounded-sm"
            style={{
              background: `rgba(0, 217, 255, ${0.08 + intensity * 0.7})`,
              boxShadow: intensity > 0.7 ? "0 0 8px rgba(0,217,255,0.4)" : undefined,
            }}
          />
        ))}
      </div>
      <div className="mt-3 flex justify-between font-mono text-[9px] uppercase text-muted-foreground">
        <span>Low demand</span>
        <span className="text-[color:var(--neon)]">Peak corridor</span>
      </div>
    </GlassPanel>
  );
}

export function FleetOsSection() {
  return (
    <SectionShell id="fleetos" className="gpu-lite border-b border-white/5">
      <FadeIn>
        <SectionLabel>04 // FleetOS Intelligence</SectionLabel>
        <SectionTitle className="mt-4 max-w-4xl">
          Real-time <span className="italic text-[color:var(--neon)]">fleet command</span> for India's mobility mesh
        </SectionTitle>
        <p className="mt-4 max-w-2xl text-body text-muted-foreground">
          Palantir-grade fleet intelligence — heatmaps, AI demand prediction, dispatch systems, and worker analytics
          in one operational layer.
        </p>
      </FadeIn>

      <div className="mt-12 grid gap-6 lg:grid-cols-12">
        <FadeIn className="lg:col-span-7 space-y-4">
          <GlassPanel glow className="p-4 md:p-6">
            <HudLabel>Worker Economy Map · Live Nodes</HudLabel>
            <div className="mt-4">
              <WorkerEconomyMap idPrefix="fleetos" className="w-full" />
            </div>
          </GlassPanel>
          <div className="grid gap-4 sm:grid-cols-3">
            {fleetOsMetrics.slice(0, 3).map((m) => (
              <GlassPanel key={m.label} className="p-4">
                <p className="font-mono text-[9px] uppercase text-muted-foreground">{m.label}</p>
                <p className="mt-1 font-serif text-2xl text-white">{m.value}</p>
                <p className="font-mono text-[10px] text-emerald-400">{m.trend}</p>
              </GlassPanel>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="lg:col-span-5 space-y-4">
          <DispatchVisualization />
          <DemandHeatmap />
          <div className="grid grid-cols-2 gap-3">
            {fleetOsMetrics.slice(3).map((m) => (
              <GlassPanel key={m.label} className="p-3">
                <p className="font-mono text-[8px] uppercase text-muted-foreground">{m.label}</p>
                <p className="mt-1 font-serif text-lg text-[color:var(--neon)]">{m.value}</p>
                <p className="font-mono text-[9px] text-muted-foreground">{m.trend}</p>
              </GlassPanel>
            ))}
          </div>
        </FadeIn>
      </div>
    </SectionShell>
  );
}
