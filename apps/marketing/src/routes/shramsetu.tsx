import { createFileRoute } from "@tanstack/react-router";
import { ShramSetuDashboardPreview } from "@/components/flagship/shramsetu-dashboard-preview";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { FadeIn } from "@/components/motion/fade-in";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/shramsetu")({
  head: () =>
    routeHead(
      "/shramsetu",
      "Digital ShramSetu — Welfare Intelligence | GigAI Bharat",
      "Interactive worker welfare dashboard: 90-day Social Security Code tracker, compliance scores, ESIC/PF readiness, and audit-ready regulatory logs.",
      "Digital ShramSetu — Labor Infrastructure",
    ),
  component: ShramSetuPage,
});

function ShramSetuPage() {
  return (
    <main className="page-main pt-20">
      <SectionShell>
        <FadeIn>
          <SectionLabel>§ Digital ShramSetu</SectionLabel>
          <SectionTitle className="mt-4 max-w-3xl">
            India&apos;s sovereign{" "}
            <span className="italic text-[color:var(--neon)]">labor welfare intelligence layer.</span>
          </SectionTitle>
          <p className="mt-4 max-w-2xl text-foreground/70">
            Interactive GovTech dashboard — aligned with Social Security Code, Karnataka welfare cess, and DPDP audit
            requirements. Live demo below; sign in for your personal tracker.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <ButtonLink href="https://app.bharatgig.live/welfare" variant="primary">
              Open live dashboard →
            </ButtonLink>
            <ButtonLink href="/investors" variant="ghost">
              Investor ROI engine
            </ButtonLink>
          </div>
        </FadeIn>

        <FadeIn className="mt-12">
          <ShramSetuDashboardPreview />
        </FadeIn>
      </SectionShell>
    </main>
  );
}
