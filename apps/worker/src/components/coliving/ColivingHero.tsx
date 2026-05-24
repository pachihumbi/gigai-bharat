import { CO_LIVING_HERO } from "@/lib/coliving-demo";
import { ArchitectureVisual } from "./ArchitectureVisual";
import { Building2, MapPin, Users, Zap } from "lucide-react";

export function ColivingHero() {
  const h = CO_LIVING_HERO;

  return (
    <section className="pod-hero relative overflow-hidden rounded-3xl animate-scale-in">
      <ArchitectureVisual variant="hero" className="absolute inset-0 rounded-none border-0 aspect-auto h-full min-h-[220px]" />
      <div className="relative p-5 sm:p-6 min-h-[220px] flex flex-col justify-end">
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-cyan-400" />
          <span className="text-[10px] font-mono-tech uppercase tracking-[0.3em] text-cyan-300/90">
            Infrastructure · Co-Living · EV
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-bright leading-tight mt-auto">
          {h.title}
        </h1>
        <p className="mt-1.5 text-sm text-foreground/80 leading-relaxed max-w-md">{h.subtitle}</p>
        <p className="mt-1 text-xs font-kannada text-cyan-200/70">{h.taglineKn}</p>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { icon: MapPin, label: "Live hubs", value: h.locations },
            { icon: Users, label: "Workers housed", value: h.workersHoused.toLocaleString("en-IN") },
            { icon: Zap, label: "Charge slots", value: h.chargingSlots },
            { icon: Building2, label: "Occupancy", value: `${h.occupancyPct}%` },
          ].map((s) => (
            <div key={s.label} className="cinematic-glass rounded-xl px-3 py-2.5 text-center">
              <s.icon className="h-3.5 w-3.5 mx-auto mb-1 text-cyan-300" />
              <p className="text-base font-bold tabular-nums text-bright">{s.value}</p>
              <p className="text-[9px] font-mono uppercase tracking-wider text-foreground/50">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
