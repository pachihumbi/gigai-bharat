import { FadeIn } from "@/components/motion/fade-in";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { problemPoints } from "@/data/landing";

export function ProblemSection() {
  return (
    <SectionShell id="problem">
      <div className="grid gap-12 md:grid-cols-12 md:gap-16">
        <FadeIn className="md:col-span-4">
          <SectionLabel>§ 01 / The crisis</SectionLabel>
          <SectionTitle className="mt-4 italic">
            Aggregators optimized GMV.
            <br />
            Workers need infrastructure.
          </SectionTitle>
        </FadeIn>
        <div className="grid gap-4 sm:grid-cols-2 md:col-span-8">
          {problemPoints.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.06}>
              <article className="h-full border border-border bg-card/40 p-6 transition-colors hover:border-[color:var(--neon)]/30">
                <h3 className="font-mono text-sm uppercase tracking-[0.15em] text-[color:var(--saffron)]">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/75 md:text-base">{p.body}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
