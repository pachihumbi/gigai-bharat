import { createFileRoute } from "@tanstack/react-router";
import { GurukulShowcaseSection } from "@/components/flagship/gurukul-showcase";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { FadeIn } from "@/components/motion/fade-in";
import { contactLinks } from "@/data/landing";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/gurukul")({
  head: () =>
    routeHead(
      "/gurukul",
      "Gurukul AI — Worker Skill & Economic Intelligence | GigAI Bharat",
      "AI mentor, skill graph, certifications, and economic upgrade engine. Onboard in under 5 minutes — from gig worker to sovereign economic citizen.",
      "Gurukul AI — GigAI Bharat",
    ),
  component: GurukulPage,
});

function GurukulPage() {
  return (
    <main className="page-main pt-20">
      <SectionShell>
        <FadeIn>
          <SectionLabel>§ Gurukul AI</SectionLabel>
          <SectionTitle className="mt-4 max-w-4xl">
            From gig worker →{" "}
            <span className="italic text-[color:var(--neon)]">sovereign economic citizen.</span>
          </SectionTitle>
          <p className="mt-4 max-w-2xl text-lg text-foreground/75">
            The easiest onboarding + skill-building ecosystem in India. Voice-first, multilingual, low-literacy
            optimized — Duolingo psychology meets Stripe polish meets Bharat-first UX.
          </p>
          <ButtonLink href={contactLinks.app} variant="primary" className="mt-6">
            Join in under 5 minutes →
          </ButtonLink>
        </FadeIn>
      </SectionShell>
      <GurukulShowcaseSection compact />
    </main>
  );
}
