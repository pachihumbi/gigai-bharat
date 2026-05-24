import { COMMUNITY_ECOSYSTEM } from "@/lib/coliving-demo";
import { ArchitectureVisual } from "./ArchitectureVisual";
import { SectionHeader } from "./EvSmartHubSection";
import { Heart, Users } from "lucide-react";

export function CommunityEcosystemSection() {
  const c = COMMUNITY_ECOSYSTEM;

  return (
    <section className="animate-fade-in">
      <SectionHeader
        icon={Users}
        tag="04 · Community Ecosystem"
        title="Food · Rest · Medical · Insurance"
        subtitle="Zostel-style community · worker-first amenities"
      />

      <ArchitectureVisual variant="community" className="mb-4" />

      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {c.zones.map((zone) => (
          <div key={zone.id} className="pod-card p-3.5">
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl">{zone.emoji}</span>
              <span
                className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                  zone.status === "Open"
                    ? "bg-emerald-400/15 text-emerald-300 border border-emerald-400/30"
                    : "bg-amber-400/15 text-amber-300 border border-amber-400/30"
                }`}
              >
                {zone.status}
              </span>
            </div>
            <p className="text-sm font-bold text-bright">{zone.name}</p>
            <p className="text-[10px] text-foreground/60 mt-1 leading-snug">{zone.description}</p>
            <div className="mt-2 flex items-center justify-between text-[10px]">
              <span className="text-foreground/50">{zone.waitMin > 0 ? `~${zone.waitMin} min wait` : "Walk-in"}</span>
              <span className="flex items-center gap-0.5 text-amber-300">
                <Heart className="h-2.5 w-2.5" /> {zone.rating}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="pod-card p-4">
        <p className="text-[10px] font-mono uppercase tracking-wider text-foreground/50 mb-3">Campus amenities</p>
        <div className="flex flex-wrap gap-2">
          {c.amenities.map((a) => (
            <span
              key={a}
              className="text-[11px] px-3 py-1.5 rounded-full border border-white/[0.08] bg-black/25 text-foreground/75"
            >
              {a}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
