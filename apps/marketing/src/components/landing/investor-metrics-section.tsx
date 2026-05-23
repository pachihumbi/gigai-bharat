import { ButtonLink } from "@/components/ui/button-link";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { FadeIn } from "@/components/motion/fade-in";
import { contactLinks, investorMetrics } from "@/data/landing";

const liveMetrics = [
  { label: "Worker OS prototype", value: "Live", sub: "Ledger + OCR + GigPay" },
  { label: "Edge AI pipeline", value: "Gemini Vision", sub: "parse-earning function" },
  { label: "Data model", value: "RLS-bound", sub: "worker-owned rows" },
  { label: "Languages", value: "EN · KN · HI", sub: "Vernacular-first UX" },
] as const;

export function InvestorMetricsSection() {
  return (
    <SectionShell id="investors" className="border-y border-[color:var(--neon)]/15 bg-midnight/30">
      <FadeIn>
        <SectionLabel>§ Investor signal</SectionLabel>
        <SectionTitle className="mt-4 max-w-3xl">
          Infrastructure metrics for{" "}
          <span className="italic text-[color:var(--neon)]">due diligence.</span>
        </SectionTitle>
        <p className="mt-4 max-w-2xl text-body text-foreground/70">
          Bharat-scale TAM with a worker-owned data moat — MIT open core, DPDP-native architecture,
          and a live prototype you can demo today.
        </p>
      </FadeIn>

      <FadeIn className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {investorMetrics.map((m) => (
          <div
            key={m.label}
            className="border border-border bg-card/40 p-6 transition-colors hover:border-[color:var(--neon)]/25"
          >
            <p className="font-serif text-4xl text-[color:var(--neon)] md:text-5xl">{m.value}</p>
            <p className="mt-2 font-mono text-label uppercase tracking-[0.18em] text-foreground/80">{m.label}</p>
            <p className="mt-1 text-sm text-muted-foreground">{m.sub}</p>
          </div>
        ))}
        <div className="border border-[color:var(--saffron)]/40 bg-[color:var(--saffron)]/5 p-6 sm:col-span-2 lg:col-span-3">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <p className="font-mono text-label uppercase tracking-[0.2em] text-[color:var(--saffron)]">
                Live prototype ready
              </p>
              <p className="mt-3 font-serif text-2xl italic md:text-3xl">
                "We're not pitching slides — we're shipping the OS."
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <ButtonLink href={contactLinks.investors} variant="primary">
                Request investor intro →
              </ButtonLink>
              <ButtonLink to="/infrastructure" variant="secondary">
                Live command center →
              </ButtonLink>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {liveMetrics.map((m) => (
          <div key={m.label} className="border border-border/80 bg-background/50 p-4">
            <p className="font-mono text-label uppercase tracking-[0.14em] text-muted-foreground">{m.label}</p>
            <p className="mt-2 font-serif text-lg text-foreground">{m.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{m.sub}</p>
          </div>
        ))}
      </FadeIn>
    </SectionShell>
  );
}
