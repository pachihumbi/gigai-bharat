import { HUB_LOCATIONS, INVESTOR_VISION } from "@/lib/coliving-demo";
import { Building2, Globe, TrendingUp } from "lucide-react";

export function InvestorVisionSection() {
  const v = INVESTOR_VISION;

  return (
    <section className="animate-fade-in">
      <div className="investor-vision relative overflow-hidden rounded-3xl p-5 sm:p-6">
        <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-cyan-500/15 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-4 w-4 text-violet-300" />
            <span className="text-[10px] font-mono-tech uppercase tracking-[0.3em] text-violet-300/90">
              05 · Investor Vision
            </span>
          </div>

          <blockquote className="text-xl sm:text-2xl font-extrabold text-bright leading-snug">
            "{v.headline}"
          </blockquote>
          <p className="mt-3 text-sm text-foreground/75 leading-relaxed">{v.subheadline}</p>
          <p className="mt-2 text-[11px] font-mono text-cyan-300/70">{v.comparable}</p>

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            {v.stats.map((s) => (
              <div key={s.label} className="cinematic-glass rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-gradient-neon tabular-nums">{s.value}</p>
                <p className="text-[9px] font-mono uppercase tracking-wider text-foreground/55 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-300/90">7 revenue streams</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {v.revenueStreams.map((r) => (
                <span
                  key={r}
                  className="text-[10px] px-2.5 py-1 rounded-lg border border-emerald-400/20 bg-emerald-400/5 text-foreground/75"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pod-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="h-4 w-4 text-cyan-300" />
          <p className="text-sm font-bold text-bright">Expansion roadmap</p>
        </div>
        <div className="space-y-2">
          {HUB_LOCATIONS.map((loc) => (
            <div
              key={loc.hub}
              className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/25 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-bright truncate">{loc.hub}</p>
                <p className="text-[11px] text-foreground/55">
                  {loc.city} · {loc.pods} pods · {loc.chargers} chargers
                </p>
              </div>
              <span
                className={`shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  loc.status === "Live"
                    ? "bg-emerald-400/15 text-emerald-300 border border-emerald-400/30"
                    : "bg-cyan-400/10 text-cyan-300 border border-cyan-400/25"
                }`}
              >
                {loc.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
