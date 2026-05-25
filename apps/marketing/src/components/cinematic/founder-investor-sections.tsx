import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { ButtonLink } from "@/components/ui/button-link";
import { GlassPanel, HudLabel } from "@/components/ui/glass-panel";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { founderProfile } from "@/data/cinematic";
import { contactLinks } from "@/data/landing";

export function CinematicFounderSection() {
  return (
    <SectionShell id="founder" bleed className="my-0 border-y border-[color:var(--neon)]/20">
      <div className="relative overflow-hidden bg-gradient-to-b from-black via-slate-950/40 to-black">
        <div className="absolute inset-0 grid-backdrop-fine opacity-30" aria-hidden />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(255,69,0,0.08),transparent_60%)]"
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-5 py-section md:px-12">
          <FadeIn>
            <SectionLabel>07 // Founder Vision</SectionLabel>
            <SectionTitle className="mt-4 max-w-4xl font-serif italic">
              &ldquo;{founderProfile.vision}&rdquo;
            </SectionTitle>
          </FadeIn>

          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            <FadeIn className="lg:col-span-7 space-y-6">
              <p className="text-body-lg text-foreground/80">{founderProfile.mission}</p>
              <GlassPanel className="p-6">
                <HudLabel>Infrastructure Philosophy</HudLabel>
                <p className="mt-3 text-foreground/85">{founderProfile.philosophy}</p>
              </GlassPanel>
              <div className="flex flex-wrap gap-3">
                <ButtonLink to="/founder" variant="primary">
                  Full manifesto →
                </ButtonLink>
                <ButtonLink to="/manifesto" variant="secondary">
                  Read manifesto
                </ButtonLink>
              </div>
            </FadeIn>

            <FadeIn delay={0.1} className="lg:col-span-5">
              <GlassPanel glow className="p-8">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[color:var(--neon)]/40 bg-[color:var(--neon)]/10">
                  <span className="font-serif text-3xl italic text-[color:var(--neon)]">P</span>
                </div>
                <h3 className="mt-6 font-serif text-2xl text-white">{founderProfile.name}</h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[color:var(--saffron)]">
                  {founderProfile.title}
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Building Bharat-first infrastructure for 23.5M gig workers — worker sovereignty, EV mobility, and
                  AI that serves labour.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={founderProfile.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded border border-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-[color:var(--neon)]/30 hover:text-[color:var(--neon)]"
                  >
                    <Github className="h-4 w-4" /> GitHub
                  </a>
                  <a
                    href={founderProfile.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded border border-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-[color:var(--neon)]/30 hover:text-[color:var(--neon)]"
                  >
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                  <a
                    href={`mailto:${founderProfile.links.email}`}
                    className="flex items-center gap-2 rounded border border-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-[color:var(--saffron)]/30 hover:text-[color:var(--saffron)]"
                  >
                    <Mail className="h-4 w-4" /> Email
                  </a>
                </div>
              </GlassPanel>
            </FadeIn>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

export function JoinCtaSection() {
  return (
    <section id="join" className="relative overflow-hidden py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,82,255,0.15),transparent_75%)]"
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-5xl space-y-8 px-5 text-center">
        <FadeIn>
          <p className="font-mono text-label uppercase tracking-widest text-[color:var(--neon)]">
            08 // Network Enlistment
          </p>
          <h2 className="mt-4 font-serif text-5xl tracking-tight text-white md:text-7xl">
            The digital public infrastructure layer
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-body-lg text-muted-foreground">
            For India's future workforce economy. Investors, fleet operators, and workers — join the mobility operating
            system.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 pt-4 sm:flex-row sm:flex-wrap">
            <Link
              to="/join"
              className="cinematic-cta-primary inline-flex items-center justify-center gap-2 rounded py-4 px-8 font-mono text-xs font-bold uppercase tracking-wider"
            >
              Join on website <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={contactLinks.app}
              className="cinematic-cta-secondary inline-flex items-center justify-center rounded py-4 px-8 font-mono text-xs uppercase tracking-wider"
            >
              Open driver app
            </a>
            <a
              href="mailto:hello@bharatgig.live"
              className="cinematic-cta-ghost inline-flex items-center justify-center rounded py-4 px-8 font-mono text-xs uppercase tracking-wider"
            >
              Contact Command Center
            </a>
          </div>
          <p className="pt-8 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            © 2026 GigAI Bharat · MIT Open Source Core · DPDP Compliant
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
