import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/button-link";
import { GlassPanel, HudLabel, HudValue, LiveDot } from "@/components/ui/glass-panel";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { FadeIn } from "@/components/motion/fade-in";
import { contactLinks } from "@/data/landing";
import { hubMetrics, infrastructureModules, stateReadiness } from "@/data/smart-hub";

export function SmartHubBlueprint() {
  return (
    <main className="page-main">
      {/* Hero */}
      <SectionShell className="relative min-h-[70vh] overflow-hidden pt-24">
        <div className="pointer-events-none absolute inset-0 grid-backdrop opacity-40" />
        <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-[color:var(--neon)]/10 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-[color:var(--saffron)]/10 blur-[100px]" />

        <FadeIn>
          <SectionLabel>§ Smart Hub Blueprint</SectionLabel>
          <SectionTitle className="mt-6 max-w-4xl text-4xl md:text-6xl">
            Worker civilization{" "}
            <span className="italic text-[color:var(--neon)]">infrastructure.</span>
          </SectionTitle>
          <p className="mt-6 max-w-2xl text-lg text-foreground/75 md:text-xl">
            Physical + digital operating system for India&apos;s working class — EV hubs, welfare clinics, fintech
            kiosks, and AI dispatch centers designed for nation-scale deployment.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href={contactLinks.investors} variant="primary">
              Infrastructure investment intro →
            </ButtonLink>
            <ButtonLink href="/roi" variant="ghost">
              View ROI simulator
            </ButtonLink>
          </div>
        </FadeIn>

        <FadeIn className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Hub investment", value: `₹${hubMetrics.investmentCr} Cr` },
            { label: "Workers served", value: `${(hubMetrics.workersServed / 1000).toFixed(0)}K` },
            { label: "Carbon reduction", value: hubMetrics.carbonReduction },
            { label: "Welfare score", value: `${hubMetrics.welfareScore}/100` },
          ].map((m) => (
            <GlassPanel key={m.label} glow className="p-5">
              <HudLabel>{m.label}</HudLabel>
              <HudValue className="mt-2">{m.value}</HudValue>
            </GlassPanel>
          ))}
        </FadeIn>
      </SectionShell>

      {/* Ecosystem diagram */}
      <SectionShell id="ecosystem" className="border-y border-border/60 bg-midnight/30">
        <FadeIn>
          <SectionLabel>§ Ecosystem architecture</SectionLabel>
          <SectionTitle className="mt-4">11 infrastructure modules. One civilization layer.</SectionTitle>
        </FadeIn>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {infrastructureModules.map((mod, i) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassPanel className="group h-full p-6 transition-colors hover:border-[color:var(--neon)]/40">
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{mod.icon}</span>
                  <LiveDot className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="mt-4 font-serif text-xl">{mod.title}</h3>
                <p className="mt-1 font-serif text-2xl text-[color:var(--neon)]">{mod.metric}</p>
                <p className="mt-1 text-sm text-muted-foreground">{mod.sub}</p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-[color:var(--saffron)]">
                  {mod.carbon}
                </p>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </SectionShell>

      {/* 3D-style cinematic section */}
      <SectionShell className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[color:var(--neon)]/5 to-transparent" />
        <FadeIn>
          <SectionLabel>§ Physical + digital mesh</SectionLabel>
          <SectionTitle className="mt-4 max-w-3xl">
            Tesla-grade infrastructure. Indian public-scale ambition.
          </SectionTitle>
        </FadeIn>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <GlassPanel glow className="relative aspect-[4/3] overflow-hidden p-8">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,255,0.08),transparent_70%)]" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <HudLabel>Smart Hub cross-section</HudLabel>
                <p className="mt-4 font-serif text-3xl">Bengaluru Pilot Node</p>
              </div>
              <div className="space-y-3">
                {["EV charge bay × 24", "AI dispatch core", "Worker dormitory L1–L3", "Solar canopy 1.2 MWp"].map(
                  (layer) => (
                    <div
                      key={layer}
                      className="border border-[color:var(--neon)]/20 bg-card/40 px-4 py-3 font-mono text-sm backdrop-blur-sm"
                    >
                      {layer}
                    </div>
                  ),
                )}
              </div>
            </div>
          </GlassPanel>

          <div className="space-y-4">
            <GlassPanel className="p-6">
              <HudLabel>Sustainability dashboard</HudLabel>
              <div className="mt-4 space-y-4">
                {[
                  { label: "Renewable energy share", pct: 68 },
                  { label: "Worker welfare coverage", pct: hubMetrics.welfareScore },
                  { label: "Smart city integration", pct: 82 },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{s.label}</span>
                      <span className="font-mono text-[color:var(--neon)]">{s.pct}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-border">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[color:var(--neon)] to-[color:var(--saffron)]"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>

            <GlassPanel className="p-6">
              <HudLabel>State deployment readiness</HudLabel>
              <div className="mt-4 space-y-2">
                {stateReadiness.map((s) => (
                  <div key={s.state} className="flex items-center justify-between border-b border-border/50 py-2 text-sm last:border-0">
                    <span className="font-semibold">{s.state}</span>
                    <span className="font-mono text-[color:var(--neon)]">{s.score}</span>
                    <span className="text-xs text-muted-foreground">{s.status}</span>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        </div>
      </SectionShell>

      {/* Closing CTA */}
      <SectionShell className="border-t border-[color:var(--neon)]/15 pb-24">
        <FadeIn>
          <GlassPanel glow className="p-10 text-center md:p-16">
            <p className="font-serif text-2xl md:text-4xl italic leading-snug">
              &ldquo;GigAI Bharat is building the operating system for the future of labor civilization.&rdquo;
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <ButtonLink href={contactLinks.investors} variant="primary">
                Request infrastructure deck →
              </ButtonLink>
              <ButtonLink href="/join" variant="ghost">
                Join as worker
              </ButtonLink>
            </div>
          </GlassPanel>
        </FadeIn>
      </SectionShell>
    </main>
  );
}
