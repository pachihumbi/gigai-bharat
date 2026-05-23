import { Link } from "@tanstack/react-router";
import { ClientTime } from "@/components/ui/client-time";
import { DispatchVisualization } from "@/components/viz/dispatch-visualization";
import { LiveMetricsPanel } from "@/components/viz/live-metrics-panel";
import { WorkerEconomyMap } from "@/components/viz/worker-economy-map";
import { CinematicSection, StaggerChildren, StaggerItem } from "@/components/motion/cinematic-reveal";
import { GlassPanel, LiveDot } from "@/components/ui/glass-panel";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";

export function CommandCenterSection() {
  return (
    <CinematicSection id="command-center" className="gpu-lite relative border-y border-border bg-midnight/40">
      <div className="absolute inset-0 grid-backdrop opacity-30" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" aria-hidden />
      <div className="scanline-subtle pointer-events-none absolute inset-0" aria-hidden />

      <SectionShell className="relative py-section md:py-24">
        <StaggerChildren className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
          <StaggerItem>
            <SectionLabel>§ Command Center / Live</SectionLabel>
            <SectionTitle className="mt-3 max-w-2xl">
              India-scale mobility intelligence —{" "}
              <span className="italic text-[color:var(--neon)]">simulated in real time.</span>
            </SectionTitle>
          </StaggerItem>
          <StaggerItem>
            <div className="flex items-center gap-2 font-mono text-label uppercase tracking-[0.2em] text-muted-foreground">
              <LiveDot />
              Bengaluru mesh · <ClientTime />
            </div>
          </StaggerItem>
        </StaggerChildren>

        <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
          {/* Map — primary visual */}
          <StaggerItem className="lg:col-span-7">
            <GlassPanel glow className="relative min-h-[320px] overflow-hidden p-2 md:min-h-[420px] md:p-4">
              <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
                <LiveDot />
                <span className="font-mono text-label uppercase tracking-[0.2em] text-foreground/70">
                  Worker economy map
                </span>
              </div>
            <WorkerEconomyMap idPrefix="cmd" className="h-full min-h-[300px] w-full md:min-h-[380px]" />
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--neon)]" /> High demand
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--saffron)]" /> Medium
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" /> Emerging
                </span>
              </div>
            </GlassPanel>
          </StaggerItem>

          {/* Right stack — metrics + dispatch */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            <StaggerItem>
              <LiveMetricsPanel />
            </StaggerItem>
            <StaggerItem className="flex-1">
              <DispatchVisualization className="min-h-[280px]" />
            </StaggerItem>
          </div>
        </div>

        <StaggerItem className="mt-6">
          <GlassPanel className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between md:p-5">
            <p className="max-w-xl text-sm text-foreground/70 md:text-base">
              Production command center connects live worker telemetry, AI dispatch, and settlement
              reconciliation — this demo simulates the investor view of the GigAI Bharat mesh.
            </p>
            <Link
              to="/infrastructure"
              className="shrink-0 border border-[color:var(--neon)] px-5 py-3 text-center font-mono text-label uppercase tracking-[0.2em] text-[color:var(--neon)] transition-colors hover:bg-[color:var(--neon)] hover:text-[color:var(--accent-foreground)]"
            >
              Full architecture →
            </Link>
          </GlassPanel>
        </StaggerItem>
      </SectionShell>
    </CinematicSection>
  );
}
