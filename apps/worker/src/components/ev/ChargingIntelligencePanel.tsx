import { DEMO_CHARGING_HUBS } from "@/lib/ev-demo";
import { BatteryCharging, MapPin, Sun, Zap } from "lucide-react";

export function ChargingIntelligencePanel() {
  const totalAvailable = DEMO_CHARGING_HUBS.reduce((s, h) => s + h.available, 0);
  const totalSlots = DEMO_CHARGING_HUBS.reduce((s, h) => s + h.slots, 0);
  const avgWait = Math.round(
    DEMO_CHARGING_HUBS.reduce((s, h) => s + h.waitMin, 0) / DEMO_CHARGING_HUBS.length,
  );

  return (
    <div className="ev-card p-4 sm:p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-mono-tech uppercase tracking-[0.28em] text-emerald-300/90">
            Charging intelligence
          </p>
          <p className="text-lg font-bold text-bright mt-0.5">Nearby super-hubs</p>
        </div>
        <BatteryCharging className="h-6 w-6 text-emerald-400" />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "Available", value: `${totalAvailable}/${totalSlots}` },
          { label: "Avg wait", value: `${avgWait} min` },
          { label: "Solar hubs", value: "3/4" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-emerald-400/15 bg-emerald-400/5 py-2.5 text-center">
            <p className="text-[9px] font-mono uppercase text-foreground/50">{s.label}</p>
            <p className="text-sm font-bold text-emerald-300">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2.5">
        {DEMO_CHARGING_HUBS.map((hub) => (
          <div
            key={hub.id}
            className="rounded-2xl border border-white/[0.07] bg-black/25 p-3.5 transition-colors hover:border-cyan-400/20"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-bright truncate">{hub.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-foreground/60">
                  <span className="flex items-center gap-0.5">
                    <MapPin className="h-3 w-3" /> {hub.distanceKm} km
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Zap className="h-3 w-3" /> {hub.powerKw} kW
                  </span>
                  {hub.solar && (
                    <span className="flex items-center gap-0.5 text-amber-300">
                      <Sun className="h-3 w-3" /> Solar
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-bold text-emerald-300">
                  {hub.available}/{hub.slots}
                </p>
                <p className="text-[10px] text-foreground/50">~{hub.waitMin} min</p>
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/50 mr-3">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                  style={{ width: `${(hub.available / hub.slots) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-cyan-200/80">₹{hub.pricePerKwh}/kWh</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
