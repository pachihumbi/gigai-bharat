import { REST_RECOVERY } from "@/lib/dignity-demo";
import { SectionShell } from "./DignityHero";
import { BedDouble, Droplets, Utensils } from "lucide-react";
import { Link } from "react-router-dom";

export function RestRecoverySection() {
  const r = REST_RECOVERY;

  return (
    <SectionShell
      tag="05 · Rest & Recovery Network"
      title="Recovery inside GigPods"
      subtitle="Shower · sleep · food · prayer · lockers — workers need infrastructure"
    >
      <div className="pod-card p-4 mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase text-foreground/50">Recovery score</p>
          <p className="text-3xl font-extrabold text-violet-300 tabular-nums">{r.recoveryScore}</p>
        </div>
        <BedDouble className="h-10 w-10 text-violet-400/60" />
      </div>

      <div className="space-y-2 mb-4">
        {r.amenities.map((a) => (
          <div key={a.name} className="pod-card p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {a.name.includes("Shower") ? (
                <Droplets className="h-4 w-4 text-cyan-300 shrink-0" />
              ) : a.name.includes("Food") ? (
                <Utensils className="h-4 w-4 text-orange-300 shrink-0" />
              ) : (
                <BedDouble className="h-4 w-4 text-violet-300 shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-bright">{a.name}</p>
                <p className="text-[11px] text-foreground/55">{a.status}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-300 shrink-0">{a.price}</span>
          </div>
        ))}
      </div>

      <p className="text-center text-[11px] text-foreground/60 mb-3">Next rest slot: {r.nextRestSlot}</p>
      <Link to="/co-living" className="block pod-card py-3.5 text-center text-sm font-bold text-violet-200 border-violet-400/25">
        Open GigPods campus →
      </Link>
    </SectionShell>
  );
}
