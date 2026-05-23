import { createFileRoute } from "@tanstack/react-router";
import { RoiCalculatorSection } from "@/components/flagship/roi-calculator-section";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { FadeIn } from "@/components/motion/fade-in";
import { contactLinks } from "@/data/landing";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/roi")({
  head: () =>
    routeHead(
      "/roi",
      "Investor ROI Calculator — GigAI Bharat",
      "Live financial simulator: GMV, lending opportunity, insurance revenue, valuation projection, and 5-year network effects for India's worker-owned AI OS.",
      "GigAI Bharat — Investor ROI Engine",
    ),
  component: RoiPage,
});

function RoiPage() {
  return (
    <main className="page-main pt-20">
      <SectionShell>
        <FadeIn>
          <SectionLabel>§ For investors</SectionLabel>
          <SectionTitle className="mt-4 max-w-3xl">
            Model the <span className="italic text-[color:var(--neon)]">sovereign financial identity</span> moat.
          </SectionTitle>
          <p className="mt-4 max-w-2xl text-foreground/70">
            Adjust assumptions live. See how GigAI Bharat evolves from mobility platform → fintech infrastructure →
            worker data network.
          </p>
          <ButtonLink href={contactLinks.investors} variant="primary" className="mt-6">
            Request full data room →
          </ButtonLink>
        </FadeIn>
      </SectionShell>
      <RoiCalculatorSection />
    </main>
  );
}
