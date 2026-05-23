import { motion } from "framer-motion";
import { Battery, Gauge, Shield, Zap } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { GlassPanel, HudLabel, HudValue } from "@/components/ui/glass-panel";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { FadeIn } from "@/components/motion/fade-in";
import { vinfastMpv, vinfastShowcaseMetrics } from "@/data/ev-fleet";

function EvSilhouette() {
  return (
    <div className="relative mx-auto aspect-[16/9] max-w-2xl">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[color:var(--neon)]/20 via-transparent to-[color:var(--saffron)]/15 blur-2xl" />
      <svg viewBox="0 0 640 360" className="relative w-full drop-shadow-[0_0_40px_hsl(var(--neon)/0.35)]">
        <defs>
          <linearGradient id="evBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(200 100% 55%)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(160 100% 45%)" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <ellipse cx="320" cy="300" rx="240" ry="20" fill="hsl(var(--neon)/0.15)" />
        <path
          d="M80 240 Q120 180 200 170 L440 165 Q520 165 560 200 L580 240 L560 260 L520 270 L120 270 L80 240 Z"
          fill="url(#evBody)"
          stroke="hsl(var(--neon))"
          strokeWidth="2"
        />
        <path d="M200 170 L280 120 L420 118 L500 165" fill="none" stroke="hsl(var(--neon)/0.6)" strokeWidth="2" />
        <circle cx="180" cy="265" r="28" fill="hsl(var(--background))" stroke="hsl(var(--neon))" strokeWidth="3" />
        <circle cx="460" cy="265" r="28" fill="hsl(var(--background))" stroke="hsl(var(--neon))" strokeWidth="3" />
        <rect x="290" y="185" width="60" height="8" rx="4" fill="hsl(var(--saffron))" className="animate-pulse" />
      </svg>
      <motion.div
        className="absolute right-4 top-4 rounded-xl border border-[color:var(--neon)]/40 bg-background/80 px-3 py-2 backdrop-blur"
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <p className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--neon)]">AI dispatch overlay</p>
        <p className="text-xs font-semibold">SOC 78% · Route optimized</p>
      </motion.div>
    </div>
  );
}

export function VinfastShowcaseSection({ compact = false }: { compact?: boolean }) {
  return (
    <SectionShell id="vinfast" className={compact ? "border-t border-border/60" : "border-y border-border/60 bg-midnight/30"}>
      {!compact && (
        <FadeIn>
          <SectionLabel>§ VinFast EV fleet</SectionLabel>
          <SectionTitle className="mt-4 max-w-4xl">
            The AI-powered{" "}
            <span className="italic text-[color:var(--neon)]">EV workforce mobility</span> infrastructure of India.
          </SectionTitle>
          <p className="mt-4 max-w-2xl text-lg text-foreground/75">
            GigAI Bharat is not a taxi company. We orchestrate VinFast EV fleets, smart charging, security command
            centers, and worker-owned dispatch intelligence — sustainable urban workforce transport at nation scale.
          </p>
        </FadeIn>
      )}

      <FadeIn className={compact ? "mt-0" : "mt-12"}>
        <GlassPanel glow className="overflow-hidden p-6 md:p-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <HudLabel>VinFast partner platform</HudLabel>
              <h3 className="mt-2 font-serif text-3xl md:text-4xl">{vinfastMpv.name}</h3>
              <p className="mt-2 text-muted-foreground">{vinfastMpv.tagline}</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {vinfastShowcaseMetrics.map((m) => (
                  <div key={m.label} className="rounded-xl border border-border/60 bg-background/40 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{m.label}</p>
                    <p className="mt-1 font-serif text-2xl text-[color:var(--neon)]">{m.value}</p>
                    <p className="text-[10px] text-muted-foreground">{m.sub}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/ev-infrastructure" variant="primary">
                  EV infrastructure →
                </ButtonLink>
                <a
                  href={vinfastMpv.referenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center font-mono text-label uppercase tracking-[0.18em] text-muted-foreground hover:text-[color:var(--neon)]"
                >
                  VinFast MPV7 ↗
                </a>
              </div>
            </div>
            <EvSilhouette />
          </div>
        </GlassPanel>
      </FadeIn>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Battery, label: "Battery intelligence", value: `${vinfastMpv.batteryKwh} kWh LFP` },
          { icon: Gauge, label: "Range analytics", value: `${vinfastMpv.rangeKm} km WLTP` },
          { icon: Shield, label: "Security fleet", value: "AI-verified ops" },
        ].map(({ icon: Icon, label, value }) => (
          <GlassPanel key={label} className="flex items-center gap-4 p-5">
            <Icon className="h-8 w-8 text-[color:var(--neon)]" />
            <div>
              <HudLabel>{label}</HudLabel>
              <HudValue className="text-lg">{value}</HudValue>
            </div>
          </GlassPanel>
        ))}
      </div>
    </SectionShell>
  );
}

export function VinfastShowcaseCompact() {
  return <VinfastShowcaseSection compact />;
}
