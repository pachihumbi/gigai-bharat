import { ButtonLink } from "@/components/ui/button-link";
import { GlassPanel, HudLabel } from "@/components/ui/glass-panel";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { FadeIn } from "@/components/motion/fade-in";
import { contactLinks } from "@/data/landing";

const modules = [
  {
    id: "shramsetu",
    kicker: "Regulatory infrastructure",
    title: "Digital ShramSetu",
    body: "90-day Social Security Code tracker, welfare contributions, ESIC/PF readiness, and audit-ready compliance logs.",
    href: "/shramsetu",
    cta: "Explore ShramSetu",
    accent: "var(--saffron)",
  },
  {
    id: "roi",
    kicker: "Investor moat engine",
    title: "ROI Calculator",
    body: "Live financial simulator — GMV, lending, insurance, valuation, and 5-year network effect projections.",
    href: "/roi",
    cta: "Run simulator",
    accent: "var(--neon)",
  },
  {
    id: "hub",
    kicker: "Civilization infrastructure",
    title: "Smart Hub Blueprint",
    body: "EV charging, AI dispatch hubs, worker housing, solar, clinics, and fintech kiosks — nation-scale design.",
    href: "/smart-hub",
    cta: "View blueprint",
    accent: "var(--neon)",
  },
] as const;

export function FlagshipModulesSection() {
  return (
    <SectionShell id="flagship" className="border-y border-[color:var(--neon)]/12 bg-midnight/25">
      <FadeIn>
        <SectionLabel>§ Flagship modules</SectionLabel>
        <SectionTitle className="mt-4 max-w-3xl">
          The sovereign AI operating system for{" "}
          <span className="italic text-[color:var(--neon)]">India&apos;s workforce.</span>
        </SectionTitle>
        <p className="mt-4 max-w-2xl text-body text-foreground/70">
          Three production-grade experience modules — regulatory infrastructure, investor financial moat, and worker
          civilization blueprint.
        </p>
      </FadeIn>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {modules.map((m, i) => (
          <FadeIn key={m.id} delay={i * 0.06}>
            <GlassPanel glow className="flex h-full flex-col p-8">
              <HudLabel>{m.kicker}</HudLabel>
              <h3 className="mt-3 font-serif text-2xl md:text-3xl" style={{ color: m.accent }}>
                {m.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/75">{m.body}</p>
              <ButtonLink href={m.href} variant="ghost" className="mt-6 w-fit px-0">
                {m.cta} →
              </ButtonLink>
            </GlassPanel>
          </FadeIn>
        ))}
      </div>

      <FadeIn className="mt-10 text-center">
        <ButtonLink href={contactLinks.app} variant="primary">
          Open worker app →
        </ButtonLink>
      </FadeIn>
    </SectionShell>
  );
}
