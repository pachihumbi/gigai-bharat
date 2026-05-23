import { Link } from "@tanstack/react-router";
import { FadeIn } from "@/components/motion/fade-in";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { contactLinks } from "@/data/landing";

const demoSteps = [
  {
    step: "01",
    title: "Command center",
    body: "Live worker economy map, dispatch simulation, and city-scale metrics.",
    href: "/#command-center",
    cta: "View demo",
  },
  {
    step: "02",
    title: "EV infrastructure",
    body: "VinFast fleet showcase, security SOC, and AI EV command center.",
    href: "/ev-infrastructure",
    cta: "EV fleet",
  },
  {
    step: "03",
    title: "Worker onboarding",
    body: "VinFast EV fleet selection → OCR ledger → Gig Credit Score.",
    href: "/join",
    cta: "Join flow",
  },
  {
    step: "04",
    title: "Investor ROI",
    body: "Financial simulator with EV fleet expansion and embedded finance moat.",
    href: "/investors",
    cta: "Run simulator",
  },
] as const;

export function DemoFlowSection() {
  return (
    <SectionShell id="demo" className="border-t border-border">
      <FadeIn>
        <SectionLabel>§ Live demo path</SectionLabel>
        <SectionTitle className="mt-3">Four stops. One investor-ready story.</SectionTitle>
      </FadeIn>

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {demoSteps.map((s, i) => (
          <FadeIn key={s.step} delay={i * 0.06}>
            <article className="flex h-full flex-col border border-border bg-card/25 p-5 transition-colors hover:border-[color:var(--neon)]/30">
              <p className="font-serif text-3xl text-[color:var(--neon)]/80">{s.step}</p>
              <h3 className="mt-3 font-serif text-xl">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              <div className="mt-5">
                {s.external ? (
                  <ButtonLink href={s.href} variant="ghost" external className="px-0">
                    {s.cta} →
                  </ButtonLink>
                ) : s.href.startsWith("/#") ? (
                  <a
                    href={s.href}
                    className="font-mono text-label uppercase tracking-[0.2em] text-[color:var(--neon)]"
                  >
                    {s.cta} →
                  </a>
                ) : (
                  <Link
                    to={s.href}
                    className="font-mono text-label uppercase tracking-[0.2em] text-[color:var(--neon)]"
                  >
                    {s.cta} →
                  </Link>
                )}
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </SectionShell>
  );
}
