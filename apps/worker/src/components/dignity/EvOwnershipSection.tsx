import { EV_OWNERSHIP } from "@/lib/dignity-demo";
import { SectionShell } from "./DignityHero";
import { Car, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export function EvOwnershipSection() {
  const e = EV_OWNERSHIP;

  return (
    <SectionShell
      tag="06 · EV Ownership Program"
      title="Drive-to-own — revolutionary"
      subtitle="Daily earnings contribute toward bike · EV · fleet equity"
    >
      <div className="pod-card p-4 mb-4 fintech-glow-green">
        <div className="flex items-center gap-2 mb-3">
          <Car className="h-5 w-5 text-emerald-400" />
          <p className="text-sm font-bold text-bright">{e.program}</p>
        </div>
        <p className="text-lg font-extrabold text-bright">{e.vehicle}</p>
        <p className="text-xs text-foreground/60 mt-1">
          ₹{e.contributed.toLocaleString("en-IN")} of ₹{e.targetPrice.toLocaleString("en-IN")} · {e.equityPct}% equity
        </p>
        <div className="mt-3 h-3 rounded-full bg-black/40 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-700"
            style={{ width: `${e.equityPct}%` }}
          />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
          <div className="rounded-xl bg-black/25 p-2 border border-white/[0.06]">
            <p className="text-foreground/50">Daily contribution</p>
            <p className="font-bold text-emerald-300">₹{e.dailyContribution}</p>
          </div>
          <div className="rounded-xl bg-black/25 p-2 border border-white/[0.06]">
            <p className="text-foreground/50">Days remaining</p>
            <p className="font-bold text-bright">{e.daysRemaining}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {e.milestones.map((m) => (
          <div
            key={m.pct}
            className={`pod-card p-3 flex items-center justify-between ${m.unlocked ? "border-emerald-400/25" : "opacity-60"}`}
          >
            <span className="text-sm font-semibold text-bright">{m.pct}% · {m.label}</span>
            <span className={`text-[10px] font-bold uppercase ${m.unlocked ? "text-emerald-300" : "text-foreground/40"}`}>
              {m.unlocked ? "Unlocked" : "Locked"}
            </span>
          </div>
        ))}
      </div>

      <Link to="/ev-command" className="flex items-center justify-center gap-2 text-xs font-bold text-cyan-300">
        <TrendingUp className="h-3.5 w-3.5" /> Explore GigEV ownership →
      </Link>
    </SectionShell>
  );
}
