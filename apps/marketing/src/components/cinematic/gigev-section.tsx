import { useState } from "react";
import { Battery, Brain, Gauge, Zap } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { GlassPanel, HudLabel } from "@/components/ui/glass-panel";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { evFleet } from "@/data/cinematic";

function EvSilhouette({ variant }: { variant: "mpv" | "suv" | "compact" | "scooter" }) {
  const paths = {
    mpv: "M60 200 Q100 150 180 145 L460 140 Q540 140 580 175 L600 200 L580 220 L520 230 L80 230 L60 200 Z",
    suv: "M70 210 Q110 160 200 155 L420 150 Q500 155 560 190 L575 215 L550 235 L100 235 L70 210 Z",
    compact: "M90 215 Q130 175 220 170 L400 168 Q480 172 530 200 L545 220 L120 225 L90 215 Z",
    scooter: "M120 220 Q200 180 320 185 L480 190 Q520 195 540 210 L530 225 L140 228 L120 220 Z",
  };

  return (
    <div className="relative mx-auto aspect-[16/9] max-w-md">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[color:var(--neon)]/15 via-transparent to-[color:var(--saffron)]/10 blur-xl" />
      <svg viewBox="0 0 640 360" className="relative w-full drop-shadow-[0_0_30px_rgba(0,217,255,0.25)]">
        <defs>
          <linearGradient id={`evGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.86 0.16 215)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="oklch(0.72 0.17 55)" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <ellipse cx="320" cy="280" rx="220" ry="18" fill="rgba(0,217,255,0.1)" />
        <path d={paths[variant]} fill={`url(#evGrad-${variant})`} stroke="oklch(0.86 0.16 215)" strokeWidth="1.5" />
        {variant !== "scooter" ? (
          <>
            <circle cx="160" cy="250" r="24" fill="#030303" stroke="oklch(0.86 0.16 215)" strokeWidth="2" />
            <circle cx="480" cy="250" r="24" fill="#030303" stroke="oklch(0.86 0.16 215)" strokeWidth="2" />
          </>
        ) : (
          <>
            <circle cx="200" cy="250" r="18" fill="#030303" stroke="oklch(0.86 0.16 215)" strokeWidth="2" />
            <circle cx="420" cy="250" r="14" fill="#030303" stroke="oklch(0.86 0.16 215)" strokeWidth="2" />
          </>
        )}
        <rect x="290" y="175" width="60" height="6" rx="3" fill="oklch(0.72 0.17 55)" className="animate-pulse" />
      </svg>
    </div>
  );
}

function variantFor(id: string): "mpv" | "suv" | "compact" | "scooter" {
  if (id === "evo") return "scooter";
  if (id === "vf5") return "compact";
  if (id === "vf7" || id === "nexon" || id === "xuv400") return "suv";
  return "mpv";
}

export function GigEvSection() {
  const [active, setActive] = useState(0);
  const vehicle = evFleet[active];

  return (
    <SectionShell id="gigev" className="gpu-lite border-b border-white/5">
      <FadeIn>
        <SectionLabel>02 // GigEV Ecosystem</SectionLabel>
        <SectionTitle className="mt-4 max-w-4xl">
          Premium <span className="italic text-[color:var(--neon)]">EV fleet intelligence</span> at nation scale
        </SectionTitle>
        <p className="mt-4 max-w-2xl text-body text-muted-foreground">
          VinFast, Tata, and Mahindra fleets unified under AI battery analytics, charging intelligence, and
          recommendation systems.
        </p>
      </FadeIn>

      <FadeIn className="mt-8 flex flex-wrap gap-2">
        {evFleet.map((v, i) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded border px-3 py-2 font-mono text-[9px] uppercase tracking-wider transition-all ${
              active === i
                ? "border-[color:var(--neon)] bg-[color:var(--neon)]/10 text-white"
                : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20"
            }`}
          >
            {v.name.split(" ").slice(-2).join(" ")}
          </button>
        ))}
      </FadeIn>

      <FadeIn className="mt-8">
        <GlassPanel glow className="overflow-hidden p-6 md:p-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <HudLabel>{vehicle.category}</HudLabel>
              <h3 className="mt-2 font-serif text-3xl text-white md:text-4xl">{vehicle.name}</h3>
              <p className="mt-3 flex items-center gap-2 text-sm text-[color:var(--saffron)]">
                <Brain className="h-4 w-4" />
                AI Recommendation: {vehicle.aiRec}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { icon: Gauge, label: "WLTP Range", value: `${vehicle.rangeKm} km` },
                  { icon: Battery, label: "Battery", value: `${vehicle.batteryKwh} kWh` },
                  { icon: Zap, label: "DC Fast Charge", value: `${vehicle.chargeMin} min` },
                  { icon: Gauge, label: "Cost / km", value: `₹${vehicle.costPerKm}` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-black/40 p-4">
                    <Icon className="mb-2 h-4 w-4 text-[color:var(--neon)]" />
                    <p className="font-mono text-[9px] uppercase text-muted-foreground">{label}</p>
                    <p className="mt-1 font-serif text-xl text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                <div>
                  <p className="font-mono text-[9px] uppercase text-muted-foreground">Fleet deployed</p>
                  <p className="font-serif text-2xl text-[color:var(--neon)]">{vehicle.fleetCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase text-muted-foreground">Avg SOC</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[color:var(--saffron)] to-[color:var(--neon)]"
                        style={{ width: `${vehicle.socAvg}%` }}
                      />
                    </div>
                    <span className="font-mono text-sm text-white">{vehicle.socAvg}%</span>
                  </div>
                </div>
              </div>
            </div>
            <EvSilhouette variant={variantFor(vehicle.id)} />
          </div>
        </GlassPanel>
      </FadeIn>

      <FadeIn className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Battery analytics", value: "AI diagnostics", sub: "Predictive maintenance" },
          { label: "Charging intelligence", value: "4 min wait p50", sub: "Solar + wind hubs" },
          { label: "Fleet dashboard", value: "18,840 units", sub: "Real-time SOC mesh" },
          { label: "AI recommendations", value: "94.2% accuracy", sub: "Demand-aware routing" },
        ].map((item) => (
          <GlassPanel key={item.label} className="p-4">
            <p className="font-mono text-[9px] uppercase text-muted-foreground">{item.label}</p>
            <p className="mt-1 font-serif text-lg text-[color:var(--neon)]">{item.value}</p>
            <p className="text-[10px] text-muted-foreground">{item.sub}</p>
          </GlassPanel>
        ))}
      </FadeIn>
    </SectionShell>
  );
}
