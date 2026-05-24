import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import {
  ChargingIntelligencePanel,
  EvProfitCalculator,
  FleetAnalyticsDashboard,
  VehicleRecommendationEngine,
  VehicleSectionCarousel,
  getVehicleById,
} from "@/components/ev";
import { EV_SECTIONS } from "@/lib/ev-demo";
import { useI18n } from "@/i18n/context";
import { Zap } from "lucide-react";

const EvCommand = () => {
  const { t } = useI18n();
  const [selectedId, setSelectedId] = useState("vinfast-limo-green");

  const selectedVehicle = useMemo(() => getVehicleById(selectedId) ?? null, [selectedId]);

  const scrollToVehicle = (vehicleId: string) => {
    setSelectedId(vehicleId);
    const el = document.getElementById(`ev-section-${getVehicleById(vehicleId)?.category}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AppShell title={t.ev.commandTitle} kn={t.ev.commandSub}>
      <div className="mb-4 flex items-center gap-2 animate-fade-in">
        <Zap className="h-4 w-4 text-cyan-400" />
        <p className="text-[10px] font-mono-tech uppercase tracking-[0.28em] text-cyan-300/90">
          GigEV · Tesla-grade mobility super-app
        </p>
      </div>

      <p className="text-xs text-foreground/75 -mt-2 mb-5 leading-relaxed">
        VinFast × Tata × Mahindra fleet ecosystem · AI-powered EV recommendations · live demo analytics
      </p>

      <div className="space-y-6 sm:space-y-7">
        <FleetAnalyticsDashboard />

        <VehicleRecommendationEngine onSelectVehicle={scrollToVehicle} />

        {EV_SECTIONS.map((section, i) => (
          <div key={section.id} id={`ev-section-${section.id}`} className="scroll-mt-24">
            <VehicleSectionCarousel
              section={section}
              selectedId={selectedId}
              onSelectVehicle={(v) => setSelectedId(v.id)}
              delay={i * 60}
            />
          </div>
        ))}

        <EvProfitCalculator vehicle={selectedVehicle} />

        <ChargingIntelligencePanel />

        <Link
          to="/co-living"
          className="ev-card block py-4 text-center font-bold text-violet-200 border-violet-400/30 bg-violet-400/10 hover:bg-violet-400/15 transition-all animate-fade-in active:scale-[0.99]"
        >
          Smart Co-Living Pods →
        </Link>

        <Link
          to="/dispatch"
          className="ev-card block py-4 text-center font-bold text-cyan-200 border-cyan-400/30 bg-cyan-400/10 hover:bg-cyan-400/15 transition-all animate-fade-in active:scale-[0.99]"
        >
          {t.ev.openDispatch} →
        </Link>
      </div>

      <p className="text-center text-[10px] font-mono-tech tracking-[0.25em] text-foreground/45 mt-8 pb-2">
        POWERED BY <span className="text-gradient-neon font-bold">GIGEV BHARAT</span>
      </p>
    </AppShell>
  );
};

export default EvCommand;
