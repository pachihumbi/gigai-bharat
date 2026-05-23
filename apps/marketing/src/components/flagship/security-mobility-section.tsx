import { motion } from "framer-motion";
import { AlertTriangle, Eye, Lock, Radio, ShieldCheck, Users } from "lucide-react";
import { GlassPanel, HudLabel, LiveDot } from "@/components/ui/glass-panel";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { FadeIn } from "@/components/motion/fade-in";
import { securityFeatures } from "@/data/ev-fleet";

const icons = [ShieldCheck, Eye, AlertTriangle, Radio, Lock, Eye, Users, Radio] as const;

export function SecurityMobilitySection() {
  return (
    <SectionShell id="security-mobility" className="relative overflow-hidden border-y border-border/60">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--neon)/0.08),transparent_70%)]" />
      <FadeIn>
        <SectionLabel>§ Security mobility infrastructure</SectionLabel>
        <SectionTitle className="mt-4 max-w-3xl">
          Fleet command center —{" "}
          <span className="italic text-[color:var(--neon)]">worker protection at scale.</span>
        </SectionTitle>
        <p className="mt-4 max-w-2xl text-foreground/75">
          Cyber-security aesthetic meets sovereign workforce protection. AI verification, live monitoring, SOS, and
          women safety protocols — integrated with VinFast EV fleet intelligence.
        </p>
      </FadeIn>

      <div className="mt-10 grid gap-4 lg:grid-cols-12">
        <GlassPanel glow className="relative overflow-hidden p-6 lg:col-span-5">
          <div className="flex items-center gap-2">
            <LiveDot />
            <HudLabel className="text-[color:var(--neon)]">Live fleet SOC</HudLabel>
          </div>
          <div className="mt-6 space-y-3 font-mono text-xs">
            {["BLR-042 · VinFast MPV7 · SOC 81%", "BLR-118 · Verified · En route", "SOS standby · 0 active", "Risk corridor · MG Rd · LOW"].map(
              (line, i) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded border border-[color:var(--neon)]/20 bg-background/50 px-3 py-2 text-foreground/80"
                >
                  <span className="text-[color:var(--neon)]">▸</span> {line}
                </motion.div>
              ),
            )}
          </div>
          <div className="mt-6 flex gap-2">
            {["VERIFY", "MONITOR", "SOS"].map((t) => (
              <span key={t} className="rounded-full border border-secondary/40 bg-secondary/10 px-2 py-1 text-[10px] font-semibold text-secondary">
                {t}
              </span>
            ))}
          </div>
        </GlassPanel>

        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
          {securityFeatures.map((f, i) => {
            const Icon = icons[i % icons.length];
            return (
              <FadeIn key={f.id} delay={i * 0.04}>
                <GlassPanel className="h-full p-5 transition-colors hover:border-[color:var(--neon)]/30">
                  <div className="flex items-start justify-between">
                    <Icon className="h-5 w-5 text-[color:var(--neon)]" />
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-mono uppercase ${
                        f.status === "live" ? "bg-secondary/15 text-secondary" : "bg-accent/15 text-accent"
                      }`}
                    >
                      {f.status}
                    </span>
                  </div>
                  <h3 className="mt-3 font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
                </GlassPanel>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
