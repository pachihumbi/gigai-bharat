import { createFileRoute } from "@tanstack/react-router";
import { BackgroundCanvas } from "@/components/cinematic/background-canvas";
import { HomeSectionNav } from "@/components/cinematic/home-section-nav";
import { HeroSection } from "@/components/cinematic/hero-section";
import { GigPaySection } from "@/components/cinematic/gigpay-section";
import { GigEvSection } from "@/components/cinematic/gigev-section";
import { GigPodsSection } from "@/components/cinematic/gigpods-section";
import { FleetOsSection } from "@/components/cinematic/fleetos-section";
import { ShramSetuSection } from "@/components/cinematic/shramsetu-section";
import { AiCopilotSection } from "@/components/cinematic/ai-copilot-section";
import { CinematicFounderSection, JoinCtaSection } from "@/components/cinematic/founder-investor-sections";
import { InvestorSection } from "@/components/cinematic/investor-section";
import { routeHead } from "@/lib/seo";
import { heroHeadline, heroSubheadline } from "@/data/cinematic";

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

function HomePage() {
  return (
    <main className="page-main relative overflow-hidden bg-black text-white selection:bg-[color:var(--neon)]/20 selection:text-white">
      <BackgroundCanvas />

      <HeroSection />
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
    </main>
  );
}
