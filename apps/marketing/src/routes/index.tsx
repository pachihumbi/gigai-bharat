import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BackgroundCanvas } from "@/components/cinematic/background-canvas";
import { routeHead } from "@/lib/seo";
import { heroHeadline, heroSubheadline } from "@/data/cinematic";
import { ErrorBoundary } from "@/components/error-boundary";

const HeroSection = lazy(() =>
  import("@/components/cinematic/hero-section").then((m) => ({ default: m.HeroSection })),
);
const HomeSectionNav = lazy(() =>
  import("@/components/cinematic/home-section-nav").then((m) => ({ default: m.HomeSectionNav })),
);
const GigPaySection = lazy(() =>
  import("@/components/cinematic/gigpay-section").then((m) => ({ default: m.GigPaySection })),
);
const GigEvSection = lazy(() =>
  import("@/components/cinematic/gigev-section").then((m) => ({ default: m.GigEvSection })),
);
const GigPodsSection = lazy(() =>
  import("@/components/cinematic/gigpods-section").then((m) => ({ default: m.GigPodsSection })),
);
const FleetOsSection = lazy(() =>
  import("@/components/cinematic/fleetos-section").then((m) => ({ default: m.FleetOsSection })),
);
const ShramSetuSection = lazy(() =>
  import("@/components/cinematic/shramsetu-section").then((m) => ({ default: m.ShramSetuSection })),
);
const AiCopilotSection = lazy(() =>
  import("@/components/cinematic/ai-copilot-section").then((m) => ({ default: m.AiCopilotSection })),
);
const CinematicFounderSection = lazy(() =>
  import("@/components/cinematic/founder-investor-sections").then((m) => ({
    default: m.CinematicFounderSection,
  })),
);
const JoinCtaSection = lazy(() =>
  import("@/components/cinematic/founder-investor-sections").then((m) => ({
    default: m.JoinCtaSection,
  })),
);
const InvestorSection = lazy(() =>
  import("@/components/cinematic/investor-section").then((m) => ({ default: m.InvestorSection })),
);

export const Route = createFileRoute("/")({
  head: () =>
    routeHead(
      "/",
      `GigAI Bharat — ${heroHeadline}`,
      heroSubheadline,
      "GigAI Bharat — India's worker-owned mobility operating system",
    ),
  component: HomePage,
});

function HeroFallback() {
  return (
    <section id="hero" className="relative flex min-h-[92vh] items-center border-b border-white/5 px-5 py-16">
      <div className="mx-auto max-w-3xl space-y-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--neon)]">
          National Infrastructure · Live Network
        </p>
        <h1 className="font-serif text-4xl leading-tight text-white md:text-6xl">{heroHeadline}</h1>
        <p className="max-w-xl text-base text-muted-foreground">{heroSubheadline}</p>
      </div>
    </section>
  );
}

function SectionFallback() {
  return <div className="min-h-[40vh] border-b border-white/5" aria-hidden />;
}

function HomePage() {
  return (
    <main className="page-main relative overflow-hidden bg-black text-white selection:bg-[color:var(--neon)]/20 selection:text-white">
      <BackgroundCanvas />

      <ErrorBoundary>
        <Suspense fallback={<HeroFallback />}>
          <HeroSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <HomeSectionNav />
          <GigPaySection />
          <GigEvSection />
          <GigPodsSection />
          <FleetOsSection />
          <ShramSetuSection />
          <AiCopilotSection />
          <CinematicFounderSection />
          <InvestorSection />
          <JoinCtaSection />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
