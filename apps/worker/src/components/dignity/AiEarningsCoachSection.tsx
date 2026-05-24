import { AI_EARNINGS_COACH } from "@/lib/dignity-demo";
import { SectionShell } from "./DignityHero";
import { Brain, MapPin, TrendingUp, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export function AiEarningsCoachSection() {
  const c = AI_EARNINGS_COACH;

  return (
    <SectionShell
      id="copilot"
      tag="04 · AI Earnings Coach"
      title="AI co-pilot for livelihood"
      subtitle="Real-time demand · earnings forecast · route intelligence"
    >
      <div className="pod-card p-5 mb-4 fintech-glow-cyan relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,hsl(0_0%_100%/0.06)_50%,transparent_70%)] bg-[length:200%_100%] animate-shimmer" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-5 w-5 text-cyan-400" />
            <span className="text-[10px] font-mono uppercase text-cyan-300/90">Live recommendation</span>
            <span className="ml-auto text-[10px] font-bold text-emerald-300">{c.confidence}% confidence</span>
          </div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-foreground/50">Best area right now</p>
          <p className="text-2xl font-extrabold text-bright flex items-center gap-2 mt-1">
            <MapPin className="h-5 w-5 text-cyan-400 shrink-0" />
            {c.bestArea}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-black/30 p-2.5 border border-white/[0.06] text-center">
              <p className="text-[9px] font-mono uppercase text-foreground/50">Demand</p>
              <p className="text-sm font-bold text-emerald-300">{c.demand}</p>
            </div>
            <div className="rounded-xl bg-black/30 p-2.5 border border-white/[0.06] text-center col-span-2">
              <p className="text-[9px] font-mono uppercase text-foreground/50">Next {c.windowHours} hours</p>
              <p className="text-sm font-bold text-gradient-neon tabular-nums">
                ₹{c.potentialRange.min.toLocaleString("en-IN")} – ₹{c.potentialRange.max.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {c.tips.map((tip) => (
          <div key={tip} className="pod-card p-3 flex items-start gap-2">
            <Zap className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-bright leading-relaxed">{tip}</p>
          </div>
        ))}
      </div>

      <div className="pod-card p-4 mb-3">
        <p className="text-[10px] font-mono uppercase text-foreground/50 mb-2 flex items-center gap-1">
          <TrendingUp className="h-3 w-3" /> Hourly forecast
        </p>
        <div className="flex gap-2">
          {c.hourlyForecast.map((h) => (
            <div key={h.hour} className="flex-1 rounded-xl bg-black/25 p-2 text-center border border-white/[0.06]">
              <p className="text-[9px] text-foreground/50">{h.hour}</p>
              <p className="text-sm font-bold text-bright tabular-nums">₹{h.earnings}</p>
              <p className={`text-[9px] capitalize ${h.demand === "surge" ? "text-amber-300" : h.demand === "high" ? "text-emerald-300" : "text-foreground/50"}`}>
                {h.demand}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Link to="/dispatch" className="block text-center text-xs font-bold text-cyan-300">
        Open FleetOS dispatch →
      </Link>
    </SectionShell>
  );
}
