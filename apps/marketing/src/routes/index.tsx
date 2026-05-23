import { createFileRoute } from "@tanstack/react-router";
import { AudienceCTASection } from "@/components/landing/audience-cta-section";
import { ChapterIndex } from "@/components/landing/chapter-index";
import { CommandCenterSection } from "@/components/landing/command-center-section";
import { DemoFlowSection } from "@/components/landing/demo-flow-section";
import { FlagshipModulesSection } from "@/components/landing/flagship-modules-section";
import { FounderSection } from "@/components/landing/founder-section";
import { HeroSection } from "@/components/landing/hero-section";
import { InvestorMetricsSection } from "@/components/landing/investor-metrics-section";
import { ModulesGrid } from "@/components/landing/modules-grid";
import { ProblemSection } from "@/components/landing/problem-section";
import { SolutionSection } from "@/components/landing/solution-section";
import { TrustLayersSection } from "@/components/landing/trust-layers-section";
import { TrustSection } from "@/components/landing/trust-section";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    routeHead(
      "/",
      "GigAI Bharat — AI mobility operating system for India",
      "Investor-ready infrastructure for India's 23.5M gig workers. Live command center, worker economy map, AI dispatch, worker-owned ledger.",
      "GigAI Bharat — The future infrastructure layer",
    ),
  component: HomePage,
});

function ThesisSection() {
  return (
    <SectionShell id="thesis">
      <div className="grid gap-10 md:grid-cols-12 md:gap-16">
        <FadeIn className="md:col-span-4">
          <SectionLabel>§ 00 / Thesis</SectionLabel>
          <SectionTitle className="mt-4 italic">India doesn't need another delivery app.</SectionTitle>
        </FadeIn>
        <FadeIn className="md:col-span-7 md:col-start-6" delay={0.08}>
          <div className="space-y-6 font-serif text-lg leading-relaxed text-foreground/85 md:text-2xl">
            <p>
              It needs a{" "}
              <span className="text-[color:var(--neon)]">nervous system</span> — routing millions of
              drivers, charging a national EV fleet, settling earnings in seconds, and treating worker
              data as sovereign infrastructure rather than private rent.
            </p>
            <p className="text-base text-foreground/55 md:text-xl">
              GigAI Bharat is the inverse of extractive platforms: a coordinated, transparent,
              AI-native commons owned by the workers it serves.
            </p>
          </div>
        </FadeIn>
      </div>
    </SectionShell>
  );
}

function HomePage() {
  return (
    <main className="page-main">
      <HeroSection />
      <CommandCenterSection />
      <ThesisSection />
      <ProblemSection />
      <SolutionSection />
      <InvestorMetricsSection />
      <FlagshipModulesSection />
      <DemoFlowSection />
      <ModulesGrid />
      <AudienceCTASection />
      <TrustLayersSection />
      <TrustSection />
      <ChapterIndex />
      <FounderSection />
    </main>
  );
}
