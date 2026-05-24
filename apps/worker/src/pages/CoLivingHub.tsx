import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import {
  ColivingHero,
  CommunityEcosystemSection,
  EvSmartHubSection,
  GurukulCenterSection,
  InvestorVisionSection,
  WorkerPodsSection,
} from "@/components/coliving";

const CoLivingHub = () => {
  return (
    <AppShell title="Smart Co-Living" kn="ಸ್ಮಾರ್ಟ್ ಕೋ-ಲಿವಿಂಗ್ · EV worker infrastructure">
      <div className="space-y-8 sm:space-y-10 pb-4">
        <ColivingHero />
        <EvSmartHubSection />
        <WorkerPodsSection />
        <GurukulCenterSection />
        <CommunityEcosystemSection />
        <InvestorVisionSection />

        <div className="grid grid-cols-2 gap-3 animate-fade-in">
          <Link
            to="/ev-command"
            className="pod-card py-4 text-center text-sm font-bold text-cyan-200 border-cyan-400/25 active:scale-[0.98] transition"
          >
            GigEV Fleet →
          </Link>
          <Link
            to="/dispatch"
            className="pod-card py-4 text-center text-sm font-bold text-violet-200 border-violet-400/25 active:scale-[0.98] transition"
          >
            AI Dispatch →
          </Link>
        </div>
      </div>

      <p className="text-center text-[10px] font-mono-tech tracking-[0.25em] text-foreground/45 mt-8 pb-2">
        INFRASTRUCTURE LAYER · <span className="text-gradient-neon font-bold">GIGAI BHARAT</span>
      </p>
    </AppShell>
  );
};

export default CoLivingHub;
