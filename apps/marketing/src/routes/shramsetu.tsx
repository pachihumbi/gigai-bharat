import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Landmark, Shield } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { GlassPanel, HudLabel, HudValue } from "@/components/ui/glass-panel";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { FadeIn } from "@/components/motion/fade-in";
import { contactLinks } from "@/data/landing";
import { routeHead } from "@/lib/seo";

const features = [
  "90-day Social Security Code eligibility tracker",
  "Karnataka 1% welfare contribution tracker",
  "Worker compliance & financial inclusion scores",
  "ESIC / PF readiness indicators",
  "Audit-ready regulatory logs",
  "AI-powered welfare insights",
  "State-wise labor policy readiness",
] as const;

export const Route = createFileRoute("/shramsetu")({
  head: () =>
    routeHead(
      "/shramsetu",
      "Digital ShramSetu — Welfare Intelligence | GigAI Bharat",
      "Regulatory infrastructure for India's workforce: Social Security Code tracking, welfare contributions, compliance scores, and DPDP-aligned audit logs.",
      "Digital ShramSetu — Regulatory Infrastructure",
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
            Not a gig app.{" "}
            <span className="italic text-[color:var(--neon)]">Regulatory infrastructure</span> for India&apos;s
            workforce.
          </SectionTitle>
          <p className="mt-4 max-w-2xl text-foreground/70">
            Fully aligned with India&apos;s Social Security Code framework — 90-day eligibility tracking, welfare
            contributions, and audit-ready compliance for every gig worker.
          </p>
        </FadeIn>

        <FadeIn className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { label: "SSC alignment", value: "100%", icon: Shield },
            { label: "KA welfare cess", value: "1%", icon: Landmark },
            { label: "DPDP audit trail", value: "Live", icon: CheckCircle2 },
          ].map((s) => (
            <GlassPanel key={s.label} glow className="p-6">
              <s.icon className="mb-3 h-5 w-5 text-[color:var(--neon)]" />
              <HudLabel>{s.label}</HudLabel>
              <HudValue className="mt-2">{s.value}</HudValue>
            </GlassPanel>
          ))}
        </FadeIn>

        <FadeIn className="mt-12">
          <GlassPanel className="p-8">
            <h3 className="font-serif text-2xl">GovTech-grade welfare intelligence</h3>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--neon)]" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="https://app.bharatgig.live/welfare" variant="primary">
                Open ShramSetu dashboard →
              </ButtonLink>
              <ButtonLink href="/roi" variant="ghost">
                Investor ROI calculator
              </ButtonLink>
            </div>
          </GlassPanel>
        </FadeIn>
      </SectionShell>
    </main>
  );
}
