import { WORKER_IDENTITY } from "@/lib/dignity-demo";
import { SectionShell } from "./DignityHero";
import { Award, BadgeCheck, Star } from "lucide-react";

const tierColors = {
  gold: "border-amber-400/40 bg-amber-400/15 text-amber-200",
  silver: "border-white/25 bg-white/10 text-foreground/80",
  bronze: "border-orange-400/30 bg-orange-400/10 text-orange-200",
};

export function WorkerIdentitySection() {
  const w = WORKER_IDENTITY;

  return (
    <SectionShell
      id="identity"
      tag="07 · Worker Reputation Identity"
      title="LinkedIn for gig workers"
      subtitle="Portable economic identity — trips · ratings · safety · skills"
    >
      <div className="pod-card p-5 mb-4 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-pink-500/15 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/35 bg-cyan-400/10 text-xl font-bold text-cyan-200">
            {w.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-bright truncate">{w.name}</p>
              <BadgeCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            </div>
            <p className="text-[11px] font-mono text-cyan-200/80">{w.workerId}</p>
            <p className="text-[10px] text-foreground/50 mt-0.5">Verified since {w.verifiedSince}</p>
          </div>
        </div>

        <div className="relative mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Trips", value: w.completedTrips.toLocaleString("en-IN") },
            { label: "Rating", value: w.rating },
            { label: "GigScore", value: w.portableScore },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-black/30 py-2 border border-white/[0.06]">
              <p className="text-base font-bold text-bright tabular-nums">{s.value}</p>
              <p className="text-[9px] font-mono uppercase text-foreground/50">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {[
          { label: "Safety score", value: `${w.safetyScore}%` },
          { label: "EV efficiency", value: `${w.evEfficiency} km/kWh` },
          { label: "Reliability", value: `${w.reliability}%` },
          { label: "Portable ID", value: "Active" },
        ].map((s) => (
          <div key={s.label} className="pod-card p-3">
            <p className="text-[9px] font-mono uppercase text-foreground/50">{s.label}</p>
            <p className="text-sm font-bold text-bright">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="pod-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Award className="h-4 w-4 text-amber-400" />
          <p className="text-sm font-bold text-bright">Skill badges</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {w.badges.map((b) => (
            <span
              key={b.name}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${tierColors[b.tier as keyof typeof tierColors]}`}
            >
              <Star className="h-2.5 w-2.5" /> {b.name}
            </span>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
