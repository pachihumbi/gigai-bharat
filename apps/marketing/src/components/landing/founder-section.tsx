import { FadeIn } from "@/components/motion/fade-in";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionShell } from "@/components/ui/section-shell";
import { contactLinks, founderQuote } from "@/data/landing";

export function FounderSection() {
  return (
    <SectionShell bleed className="my-16 border-y border-[color:var(--neon)]/25">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 grid-backdrop-fine opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-12 md:py-24">
          <FadeIn className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="font-mono text-label uppercase tracking-[0.22em] text-[color:var(--saffron)]">
                Founder manifesto
              </p>
              <blockquote className="mt-6 font-serif text-3xl italic leading-tight md:text-5xl lg:text-[3.25rem]">
                "{founderQuote}"
              </blockquote>
              <p className="mt-8 max-w-2xl text-body text-foreground/75">
                We are hiring engineers, organizers, and city operators who believe mobility belongs to
                the people who provide it — not the platforms that rent their labour.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:col-span-4 md:items-stretch">
              <ButtonLink to="/hiring" variant="secondary">
                View open roles →
              </ButtonLink>
              <ButtonLink href={`mailto:${contactLinks.email}`} variant="ghost">
                Partner with us →
              </ButtonLink>
              <ButtonLink href={contactLinks.github} variant="ghost" external>
                Explore the codebase
              </ButtonLink>
              <ButtonLink to="/future" variant="ghost">
                2030 roadmap →
              </ButtonLink>
            </div>
          </FadeIn>
        </div>
      </div>
    </SectionShell>
  );
}
