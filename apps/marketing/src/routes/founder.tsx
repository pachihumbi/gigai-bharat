import { createFileRoute } from "@tanstack/react-router";
import { FounderSection } from "@/components/landing/founder-section";
import { MediaShowcaseSection } from "@/components/landing/media-showcase-section";
import { ButtonLink } from "@/components/ui/button-link";
import { GlassPanel } from "@/components/ui/glass-panel";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { FadeIn } from "@/components/motion/fade-in";
import { founderQuote, contactLinks } from "@/data/landing";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/founder")({
  head: () =>
    routeHead(
      "/founder",
      "Founder Manifesto — GigAI Bharat",
      "Technology should increase worker sovereignty, not platform dependency. The founder vision for India's worker-owned AI labor operating system.",
      "Founder Manifesto — GigAI Bharat",
    ),
  component: FounderPage,
});

function FounderPage() {
  return (
    <main className="page-main pt-20">
      <SectionShell>
        <FadeIn>
          <SectionLabel>§ Founder manifesto</SectionLabel>
          <SectionTitle className="mt-4 max-w-3xl font-serif italic">
            &ldquo;{founderQuote}&rdquo;
          </SectionTitle>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-foreground/80">
            GigAI Bharat exists because 23.5 million Indians move this country every day — and the platforms they serve
            treat their data as rent, their earnings as opaque, and their future as someone else&apos;s product
            roadmap.
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/80">
            We are building the inverse: a sovereign AI operating system where workers own the ledger, the credit
            score, the welfare trail, and the economic graph that banks and insurers will underwrite for the next
            century of Bharat&apos;s labor economy.
          </p>
        </FadeIn>

        <FadeIn className="mt-12">
          <GlassPanel glow className="p-8 md:p-12">
            <h3 className="font-serif text-2xl md:text-3xl">Three commitments</h3>
            <ul className="mt-6 space-y-4 text-foreground/85">
              <li>
                <strong className="text-[color:var(--neon)]">Worker sovereignty first.</strong> Every architectural
                decision starts with who owns the data — and the answer is always the worker.
              </li>
              <li>
                <strong className="text-[color:var(--saffron)]">Public intelligence, not surveillance.</strong> AI
                serves labour — shift coach, welfare insights, fair dispatch — never opaque extraction.
              </li>
              <li>
                <strong className="text-foreground">Infrastructure, not another app.</strong> ShramSetu, GigPay, Smart
                Hubs — nation-scale systems that outlive any single platform.
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/manifesto" variant="primary">
                Read full manifesto →
              </ButtonLink>
              <ButtonLink href={contactLinks.investors} variant="ghost">
                Investor intro
              </ButtonLink>
            </div>
          </GlassPanel>
        </FadeIn>
      </SectionShell>
      <FounderSection />
      <MediaShowcaseSection compact />
    </main>
  );
}
