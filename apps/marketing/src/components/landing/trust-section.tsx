import { FadeIn } from "@/components/motion/fade-in";
import { StatRow } from "@/components/editorial";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { investorMetrics, trustSignals } from "@/data/landing";

export function TrustSection() {
  return (
    <SectionShell id="trust" className="border-t border-border">
      <FadeIn>
        <SectionLabel>§ 04 / Investor & operator signal</SectionLabel>
        <SectionTitle className="mt-4">Built for diligence. Designed for Bharat.</SectionTitle>
      </FadeIn>

      <FadeIn className="mt-10">
        <StatRow stats={[...investorMetrics]} />
      </FadeIn>

      <FadeIn className="mt-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {trustSignals.map((t) => (
            <div key={t.label} className="border border-border bg-card/30 p-5">
              <p className="font-mono text-label uppercase tracking-[0.18em] text-muted-foreground">
                {t.label}
              </p>
              <p className="mt-2 font-serif text-lg text-foreground">{t.value}</p>
            </div>
          ))}
        </div>
      </FadeIn>
    </SectionShell>
  );
}
