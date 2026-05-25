import { Github, Linkedin, Mail } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { FounderSection } from "@/components/landing/founder-section";
import { MediaShowcaseSection } from "@/components/landing/media-showcase-section";
import { ButtonLink } from "@/components/ui/button-link";
import { GlassPanel } from "@/components/ui/glass-panel";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { FadeIn } from "@/components/motion/fade-in";
import { founderQuote, contactLinks } from "@/data/landing";
import { founderProfile } from "@/data/cinematic";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/founder")({
  head: () =>
    routeHead(
      "/founder",
      "Founder Manifesto — GigAI Bharat",
      "Technology should increase worker sovereignty, not platform dependency. The founder vision for India's worker-owned AI labor operating system.",
      "Founder Manifesto — GigAI Bharat",
    ),
  component: FounderPage,
});

function FounderPage() {
  return (
    <main className="page-main pt-20">
      <SectionShell>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <FadeIn className="lg:col-span-7">
            <SectionLabel>§ Founder manifesto</SectionLabel>
            <SectionTitle className="mt-4 max-w-3xl font-serif italic">
              &ldquo;{founderQuote}&rdquo;
            </SectionTitle>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-foreground/80">
              GigAI Bharat exists because 23.5 million Indians move this country every day — and the platforms they serve
              treat their data as rent, their earnings as opaque, and their future as someone else&apos;s product
              roadmap.
            </p>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/80">
              We are building the inverse: a sovereign AI operating system where workers own the ledger, the credit
              score, the welfare trail, and the economic graph that banks and insurers will underwrite for the next
              century of Bharat&apos;s labor economy.
            </p>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-5">
            <GlassPanel glow className="p-8">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[color:var(--neon)]/40 bg-[color:var(--neon)]/10">
                <span className="font-serif text-3xl italic text-[color:var(--neon)]">P</span>
              </div>
              <h2 className="mt-6 font-serif text-2xl text-white">{founderProfile.name}</h2>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[color:var(--saffron)]">
                {founderProfile.title}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">{founderProfile.mission}</p>
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

        <FadeIn className="mt-12">
          <GlassPanel glow className="p-8 md:p-12">
            <h3 className="font-serif text-2xl md:text-3xl">Three commitments</h3>
            <ul className="mt-6 space-y-4 text-foreground/85">
              <li>
                <strong className="text-[color:var(--neon)]">Worker sovereignty first.</strong> Every architectural
                decision starts with who owns the data — and the answer is always the worker.
              </li>
              <li>
                <strong className="text-[color:var(--saffron)]">Public intelligence, not surveillance.</strong> AI
                serves labour — shift coach, welfare insights, fair dispatch — never opaque extraction.
              </li>
              <li>
                <strong className="text-foreground">Infrastructure, not another app.</strong> ShramSetu, GigPay, Smart
                Hubs — nation-scale systems that outlive any single platform.
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink to="/manifesto" variant="primary">
                Read full manifesto →
              </ButtonLink>
              <ButtonLink to={contactLinks.investors} variant="ghost">
                Investor intro
              </ButtonLink>
            </div>
          </GlassPanel>
        </FadeIn>
      </SectionShell>
      <FounderSection />
      <MediaShowcaseSection compact />
    </main>
  );
}
