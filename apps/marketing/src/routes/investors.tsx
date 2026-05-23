import { createFileRoute } from "@tanstack/react-router";
import { RoiCalculatorSection } from "@/components/flagship/roi-calculator-section";
import { MediaShowcaseSection } from "@/components/landing/media-showcase-section";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { FadeIn } from "@/components/motion/fade-in";
import { contactLinks } from "@/data/landing";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/investors")({
  head: () =>
    routeHead(
      "/investors",
      "Investors — ROI Engine | GigAI Bharat",
      "VC-grade financial simulation: GMV, embedded finance, data moat, valuation growth, and 5-year network effects for India's worker-owned AI OS.",
      "GigAI Bharat — Investor ROI Engine",
    ),
  component: InvestorsPage,
});

function InvestorsPage() {
  return (
    <main className="page-main pt-20">
      <SectionShell>
        <FadeIn>
          <SectionLabel>§ For investors</SectionLabel>
          <SectionTitle className="mt-4 max-w-4xl">
            India&apos;s sovereign{" "}
            <span className="italic text-[color:var(--neon)]">financial identity layer.</span>
          </SectionTitle>
          <p className="mt-4 max-w-3xl text-lg text-foreground/75">
            GigAI Bharat transforms fragmented labor activity into a sovereign financial identity layer — unlocking
            embedded finance, neo-bank rails, and compounding data network effects.
          </p>
          <ButtonLink href={contactLinks.investors} variant="primary" className="mt-6">
            Request full data room →
          </ButtonLink>
        </FadeIn>
      </SectionShell>
      <RoiCalculatorSection />
      <MediaShowcaseSection compact />
    </main>
  );
}
