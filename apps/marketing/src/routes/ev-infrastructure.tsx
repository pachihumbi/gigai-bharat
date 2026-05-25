import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/button-link";
import { GlassPanel, HudLabel, HudValue } from "@/components/ui/glass-panel";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { FadeIn } from "@/components/motion/fade-in";
import { EvCommandCenterSection } from "@/components/flagship/ev-command-center-section";
import { SecurityMobilitySection } from "@/components/flagship/security-mobility-section";
import { VinfastShowcaseSection } from "@/components/flagship/vinfast-showcase";
import { contactLinks } from "@/data/landing";
import { evFleetModules, investorEvStory } from "@/data/ev-fleet";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/ev-infrastructure")({
  head: () =>
    routeHead(
      "/ev-infrastructure",
      "EV Infrastructure — VinFast Fleet | GigAI Bharat",
      "India's AI-powered EV workforce mobility infrastructure. VinFast MPV platform, security command center, smart charging, and sustainable worker transport.",
      "EV Infrastructure — GigAI Bharat × VinFast",
    ),
  component: EvInfrastructurePage,
});

function EvInfrastructurePage() {
  return (
    <main className="page-main pt-20">
      <SectionShell className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-backdrop opacity-30" />
        <FadeIn>
          <SectionLabel>§ EV workforce civilization</SectionLabel>
          <SectionTitle className="mt-6 max-w-4xl text-4xl md:text-6xl">
            Smart EV ecosystem for{" "}
            <span className="italic text-[color:var(--neon)]">India&apos;s working class.</span>
          </SectionTitle>
          <p className="mt-6 max-w-2xl text-lg text-foreground/75">
            VinFast-inspired futuristic mobility — charging maps, worker housing integration, solar + wind hubs, and
            AI fleet orchestration. The sustainable worker transportation network.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink to={contactLinks.partnerships} variant="primary">
              Fleet partnership →
            </ButtonLink>
            <ButtonLink href="/investors" variant="secondary">
              Investor ROI engine
            </ButtonLink>
          </div>
        </FadeIn>
      </SectionShell>

      <VinfastShowcaseSection compact />
      <SecurityMobilitySection />
      <EvCommandCenterSection />

      <SectionShell className="border-t border-border/60">
        <FadeIn>
          <SectionLabel>§ Smart EV ecosystem modules</SectionLabel>
          <SectionTitle className="mt-4">Orchestration layer — not another ride-hail app.</SectionTitle>
        </FadeIn>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {evFleetModules.map((mod, i) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassPanel className="h-full p-6 hover:border-[color:var(--neon)]/40">
                <HudLabel>{mod.title}</HudLabel>
                <HudValue className="mt-2">{mod.metric}</HudValue>
                <p className="mt-1 text-sm text-muted-foreground">{mod.sub}</p>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="border-t border-border/60 bg-midnight/20">
        <FadeIn>
          <SectionLabel>§ Investor narrative</SectionLabel>
          <ul className="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-foreground/85">
            {investorEvStory.map((line) => (
              <li key={line} className="flex gap-3">
                <span className="text-[color:var(--neon)]">▸</span>
                {line}
              </li>
            ))}
          </ul>
        </FadeIn>
      </SectionShell>
    </main>
  );
}
