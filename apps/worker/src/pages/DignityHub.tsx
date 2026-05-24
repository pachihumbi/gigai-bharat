import { AppShell } from "@/components/AppShell";
import {
  AiEarningsCoachSection,
  DignityHero,
  EmergencySafetySection,
  EvOwnershipSection,
  FamilyModeSection,
  FounderVisionSection,
  GigAiCreditSection,
  GurukulDignitySection,
  HealthLayerSection,
  PlatformEcosystemMap,
  RestRecoverySection,
  WorkerGovernanceSection,
  WorkerIdentitySection,
} from "@/components/dignity";

const DignityHub = () => {
  return (
    <AppShell title="Worker Dignity" kn="ಕಾರ್ಮಿಕ dignity · Infrastructure moat">
      <div className="space-y-8 sm:space-y-10 pb-4">
        <DignityHero />
        <PlatformEcosystemMap />
        <EmergencySafetySection />
        <HealthLayerSection />
        <FamilyModeSection />
        <AiEarningsCoachSection />
        <RestRecoverySection />
        <EvOwnershipSection />
        <WorkerIdentitySection />
        <GurukulDignitySection />
        <WorkerGovernanceSection />
        <GigAiCreditSection />
        <FounderVisionSection />
      </div>

      <p className="text-center text-[10px] font-mono-tech tracking-[0.25em] text-foreground/45 mt-8 pb-2">
        WORKER DIGNITY INFRASTRUCTURE · <span className="text-gradient-neon font-bold">GIGAI BHARAT</span>
      </p>
    </AppShell>
  );
};

export default DignityHub;
