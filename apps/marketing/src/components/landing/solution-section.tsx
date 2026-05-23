import { FadeIn } from "@/components/motion/fade-in";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { solutionPillars } from "@/data/landing";

export function SolutionSection() {
  return (
    <SectionShell id="solution" className="border-y border-border bg-card/20">
      <FadeIn>
        <SectionLabel>§ 02 / The operating layer</SectionLabel>
        <SectionTitle className="mt-4 max-w-3xl">
          A worker-aligned stack — data, AI, fintech, and safety in one sovereign platform.
        </SectionTitle>
      </FadeIn>
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {solutionPillars.map((p, i) => (
          <FadeIn key={p.num} delay={i * 0.07}>
            <article className="group flex gap-6 border border-border p-6 md:p-8 transition-colors hover:bg-background/50">
              <span className="font-serif text-5xl leading-none text-[color:var(--neon)]/40 group-hover:text-[color:var(--neon)]">
                {p.num}
              </span>
              <div>
                <h3 className="font-serif text-2xl md:text-3xl">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70 md:text-base">{p.body}</p>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </SectionShell>
  );
}
