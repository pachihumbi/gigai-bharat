import { WorkerEconomyMap } from "@/components/viz/worker-economy-map";
import { FadeInHero } from "@/components/motion/fade-in";
import { ButtonLink } from "@/components/ui/button-link";
import { Kicker } from "@/components/ui/kicker";
import { LiveDot } from "@/components/ui/glass-panel";
import { heroStats, contactLinks } from "@/data/landing";

export function HeroSection() {
  return (
    <section className="relative min-h-[92dvh] overflow-hidden border-b border-border">
      {/* Ambient layers */}
      <div className="absolute inset-0 grid-backdrop opacity-30" aria-hidden />
      <div className="hero-mesh pointer-events-none absolute inset-0" aria-hidden />
      <div className="orb orb-saffron pointer-events-none absolute -left-32 top-16 h-56 w-56 md:h-96 md:w-96" aria-hidden />
      <div className="orb orb-neon pointer-events-none absolute -right-16 bottom-24 h-64 w-64 md:h-[26rem] md:w-[26rem]" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/75 to-background" aria-hidden />
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-[color:var(--saffron)] via-[color:var(--neon)] to-transparent" aria-hidden />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pt-14 pb-10 md:grid-cols-12 md:gap-12 md:px-12 md:pt-20 md:pb-16 lg:min-h-[78dvh] lg:items-center">
        <div className="md:col-span-6 lg:col-span-7">
          <FadeInHero>
            <div className="flex flex-wrap items-center gap-3">
              <Kicker>EV Workforce Infrastructure</Kicker>
              <span className="inline-flex items-center gap-2 border border-border bg-card/50 px-3 py-1.5">
                <LiveDot />
                <span className="font-mono text-label uppercase tracking-[0.18em] text-foreground/70">
                  Bengaluru pilot live
                </span>
              </span>
            </div>
          </FadeInHero>

          <FadeInHero delay={0.08} className="mt-7 md:mt-9">
            <h1 className="font-serif text-[2.65rem] leading-[0.9] tracking-tight sm:text-display-lg md:text-[4.25rem] lg:text-[5.25rem]">
              India&apos;s AI-powered
              <br />
              <span className="bg-gradient-to-r from-[color:var(--saffron)] via-[color:var(--neon)] to-[color:var(--neon)] bg-clip-text italic text-transparent">
                EV workforce layer.
              </span>
            </h1>
          </FadeInHero>

          <FadeInHero delay={0.16} className="mt-6 max-w-xl md:mt-8">
            <p className="text-base leading-relaxed text-foreground/78 md:text-body-lg">
              VinFast EV fleet intelligence, security command centers, smart charging ecosystems, and worker-owned
              AI dispatch — sustainable mobility infrastructure for 23.5M workers. Not a taxi company.
            </p>
          </FadeInHero>

          <FadeInHero delay={0.24} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href="/ev-infrastructure" variant="primary" className="min-w-[200px]">
              EV infrastructure →
            </ButtonLink>
            <ButtonLink to="/investors" variant="secondary">
              Investor ROI →
            </ButtonLink>
            <a
              href="#command-center"
              className="inline-flex min-h-11 items-center font-mono text-label uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-[color:var(--neon)] sm:px-2"
            >
              Live demo ↓
            </a>
          </FadeInHero>

          <FadeInHero delay={0.32} className="mt-8 flex flex-wrap gap-2">
            {["VinFast EV fleet", "Security SOC", "Smart charging", "AI dispatch"].map((tag) => (
              <span
                key={tag}
                className="border border-border/80 bg-background/60 px-3 py-1.5 font-mono text-label uppercase tracking-[0.14em] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </FadeInHero>
        </div>

        <FadeInHero delay={0.18} className="relative md:col-span-6 lg:col-span-5">
          <div className="hero-panel relative overflow-hidden border border-[color:var(--neon)]/20 bg-card/25 shadow-[0_0_80px_-30px] shadow-[color:var(--neon)]/25 md:bg-card/30">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--neon)]/60 to-transparent" aria-hidden />
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <LiveDot />
                <span className="font-mono text-label uppercase tracking-wider text-foreground/65">
                  Worker economy map
                </span>
              </div>
              <span className="font-mono text-label tabular-nums text-[color:var(--neon)]">14 cities</span>
            </div>
            <WorkerEconomyMap
              idPrefix="hero"
              animate={false}
              className="h-[220px] w-full sm:h-[320px] md:h-[380px]"
            />
          </div>
        </FadeInHero>
      </div>

      {/* Metrics strip */}
      <div className="relative border-t border-border bg-graphite/95">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border md:grid-cols-4 md:px-12">
          {heroStats.map((s) => (
            <div key={s.k} className="px-4 py-5 md:px-8 md:py-6">
              <p className="font-mono text-label uppercase tracking-[0.2em] text-muted-foreground">{s.k}</p>
              <p className="mt-1.5 font-serif text-2xl text-[color:var(--neon)] sm:text-3xl md:text-4xl">{s.v}</p>
              <p className="mt-0.5 font-mono text-label uppercase tracking-[0.15em] text-foreground/40">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
