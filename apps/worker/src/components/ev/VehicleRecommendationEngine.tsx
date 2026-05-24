import { useMemo, useState } from "react";
import { DEMO_AI_RECOMMENDATIONS, DEMO_WORKER_PROFILE } from "@/lib/ev-demo";
import { getVehicleById, recommendVehicles } from "@/lib/ev-utils";
import { Brain, ChevronRight, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

type VehicleRecommendationEngineProps = {
  onSelectVehicle?: (vehicleId: string) => void;
};

export function VehicleRecommendationEngine({ onSelectVehicle }: VehicleRecommendationEngineProps) {
  const [priority, setPriority] = useState<"maximize earnings" | "lowest emi" | "long range">(
    DEMO_WORKER_PROFILE.priority,
  );

  const recommendations = useMemo(
    () => recommendVehicles(DEMO_WORKER_PROFILE.dailyKm, priority, 4),
    [priority],
  );

  return (
    <div className="ev-card p-4 sm:p-5 animate-fade-in">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-400/10">
          <Brain className="h-5 w-5 text-violet-300" />
        </div>
        <div>
          <p className="text-[10px] font-mono-tech uppercase tracking-[0.28em] text-violet-300/90">
            AI recommendation engine
          </p>
          <p className="text-lg font-bold text-bright">Your perfect EV match</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-black/25 p-3.5 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <User className="h-4 w-4 text-cyan-300" />
          <span className="text-sm font-semibold text-bright">{DEMO_WORKER_PROFILE.name}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-foreground/65">
          <span>{DEMO_WORKER_PROFILE.role}</span>
          <span>{DEMO_WORKER_PROFILE.dailyKm} km/day</span>
          <span>{DEMO_WORKER_PROFILE.shiftHours}h shifts</span>
          <span>Fuel: ₹{DEMO_WORKER_PROFILE.monthlyFuelSpend.toLocaleString("en-IN")}/mo</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {(["maximize earnings", "lowest emi", "long range"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPriority(p)}
            className={cn(
              "rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border",
              priority === p
                ? "border-violet-400/50 bg-violet-400/15 text-violet-200"
                : "border-white/10 bg-black/20 text-foreground/60 hover:border-white/20",
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {recommendations.map((vehicle, i) => {
          const aiRec = DEMO_AI_RECOMMENDATIONS.find((r) => r.vehicleId === vehicle.id);
          const score = aiRec?.score ?? 90 - i * 4;

          return (
            <button
              key={vehicle.id}
              type="button"
              onClick={() => onSelectVehicle?.(vehicle.id)}
              className="w-full flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-black/25 p-3 text-left transition-all hover:border-violet-400/25 active:scale-[0.99]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/25 bg-violet-400/10 text-sm font-bold text-violet-200">
                #{i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-bright truncate">
                    {vehicle.brand} {vehicle.name}
                  </p>
                  {vehicle.aiRecommended && <Sparkles className="h-3 w-3 text-cyan-300 shrink-0" />}
                </div>
                <p className="text-[11px] text-foreground/60 truncate">
                  {aiRec?.reason ?? vehicle.bestFor}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-sm font-bold text-emerald-300">{score}%</span>
                <ChevronRight className="h-4 w-4 text-foreground/40" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { getVehicleById };
