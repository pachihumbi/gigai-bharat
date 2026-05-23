import { Link } from "@tanstack/react-router";
import { chapters } from "@/data/chapters";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";

export function ChapterIndex() {
  return (
    <SectionShell id="chapters">
      <FadeIn className="mb-12 flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel>§ 05 / Deep dive</SectionLabel>
          <SectionTitle className="mt-3">Five chapters</SectionTitle>
        </div>
        <p className="font-mono text-label uppercase tracking-[0.2em] text-muted-foreground">
          Read in order →
        </p>
      </FadeIn>

      <div className="divide-y divide-border">
        {chapters.map((c, i) => (
          <FadeIn key={c.slug} delay={i * 0.04}>
            <Link
              to={c.path}
              className="group grid grid-cols-1 gap-4 py-8 transition-colors hover:bg-card/30 md:-mx-3 md:grid-cols-12 md:items-baseline md:gap-6 md:px-3 md:py-10"
            >
              <span className="font-mono text-sm text-[color:var(--neon)] md:col-span-1">{c.num}</span>
              <div className="md:col-span-4">
                <h3 className="font-serif text-2xl transition-colors group-hover:text-[color:var(--neon)] md:text-3xl">
                  {c.title}
                </h3>
                <p className="mt-1 font-mono text-label uppercase tracking-[0.2em] text-[color:var(--saffron)]">
                  {c.kicker}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-foreground/70 md:col-span-6 md:text-base">
                {c.blurb}
              </p>
              <span className="font-mono text-label uppercase tracking-[0.2em] text-muted-foreground group-hover:text-[color:var(--neon)] md:col-span-1 md:text-right">
                Open →
              </span>
            </Link>
          </FadeIn>
        ))}
      </div>
    </SectionShell>
  );
}
