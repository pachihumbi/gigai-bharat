import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/button-link";
import { GlassPanel, HudLabel, HudValue } from "@/components/ui/glass-panel";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { FadeIn } from "@/components/motion/fade-in";
import { contactLinks } from "@/data/landing";
import { gurukulCerts, gurukulMetrics, gurukulPillars, gurukulTracks } from "@/data/gurukul";

export function GurukulShowcaseSection({ compact = false }: { compact?: boolean }) {
  return (
    <SectionShell id="gurukul" className={compact ? "border-t border-border/60" : "border-y border-border/60 bg-midnight/25"}>
      {!compact && (
        <FadeIn>
          <SectionLabel>§ Gurukul AI</SectionLabel>
          <SectionTitle className="mt-4 max-w-4xl">
            The AI-powered{" "}
            <span className="italic text-[color:var(--neon)]">economic upgrade engine</span> for India&apos;s working class.
          </SectionTitle>
          <p className="mt-4 max-w-2xl text-lg text-foreground/75">
            Not an LMS. Not a government portal. An AI mentor + skill graph + certification layer that transforms gig
            workers into sovereign economic citizens — in under 5 minutes.
          </p>
        </FadeIn>
      )}

      <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${compact ? "mt-0" : "mt-10"}`}>
        {gurukulMetrics.map((m) => (
          <GlassPanel key={m.label} glow className="p-5">
            <HudLabel>{m.label}</HudLabel>
            <HudValue className="mt-2">{m.value}</HudValue>
          </GlassPanel>
        ))}
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {gurukulPillars.map((p, i) => (
          <motion.div key={p.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <GlassPanel className="h-full p-6 hover:border-[color:var(--neon)]/30">
              <span className="text-3xl">{p.icon}</span>
              <h3 className="mt-3 font-serif text-xl">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </GlassPanel>
          </motion.div>
        ))}
      </div>

      <FadeIn className="mt-12">
        <GlassPanel glow className="p-8">
          <HudLabel>Learning tracks</HudLabel>
          <div className="mt-4 flex flex-wrap gap-2">
            {gurukulTracks.map((t) => (
              <span key={t} className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-medium">
                {t}
              </span>
            ))}
          </div>
          <HudLabel className="mt-8 block">GigAI certifications</HudLabel>
          <ul className="mt-3 space-y-2">
            {gurukulCerts.map((c) => (
              <li key={c} className="flex items-center gap-2 text-foreground/85">
                <span className="text-[color:var(--neon)]">▸</span> {c}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href={contactLinks.app} variant="primary">
              Start onboarding →
            </ButtonLink>
            <ButtonLink href="/gurukul" variant="secondary">
              Explore Gurukul
            </ButtonLink>
          </div>
        </GlassPanel>
      </FadeIn>
    </SectionShell>
  );
}
