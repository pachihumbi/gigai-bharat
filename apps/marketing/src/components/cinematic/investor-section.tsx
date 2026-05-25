import { useMemo, useState } from "react";
import { MapPin, TrendingUp } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { CardTilt } from "@/components/cinematic/card-tilt";
import { ButtonLink } from "@/components/ui/button-link";
import { GlassPanel, HudLabel } from "@/components/ui/glass-panel";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import {
  investorThesis,
  launchRoadmap,
  revenueStreams,
  workerPainPoints,
} from "@/data/cinematic";
import { contactLinks } from "@/data/landing";

export function InvestorSection() {
  const [roiWorkers, setRoiWorkers] = useState(500000);

  const roiCalculations = useMemo(() => {
    const ridesPerYear = 320;
    const avgEarningsPerRide = 400;
    const gmv = roiWorkers * ridesPerYear * avgEarningsPerRide;
    const gmvCr = gmv / 10000000;
    const lendingCr = gmvCr * 0.15;
    const valuationCr = gmvCr * 0.55;

    return {
      gmvCr: gmvCr.toFixed(0),
      lendingCr: lendingCr.toFixed(0),
      valuationCr: valuationCr.toFixed(0),
    };
  }, [roiWorkers]);

  return (
    <SectionShell
      id="investors"
      className="gpu-lite border-b border-[color:var(--neon)]/15 bg-midnight/30"
    >
      <FadeIn>
        <div className="flex flex-wrap items-center gap-3">
          <SectionLabel>08 // Investor Intelligence</SectionLabel>
          <span className="inline-flex items-center gap-2 border border-[color:var(--saffron)]/40 bg-[color:var(--saffron)]/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-[color:var(--saffron)]">
            <MapPin className="h-3 w-3" />
            Pilot city: Bengaluru
          </span>
        </div>
        <SectionTitle className="mt-4 max-w-4xl">
          The <span className="italic text-[color:var(--neon)]">AI infrastructure thesis</span> for Bharat
        </SectionTitle>
        <p className="mt-4 max-w-2xl text-body text-muted-foreground">
          India&apos;s gig economy: 23.5M workers, ₹6.2L Cr mobility GMV by 2030 — worker-owned infrastructure captures
          embedded finance, EV transition, and AI dispatch without platform rent.
        </p>
      </FadeIn>

      <FadeIn className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {investorThesis.map((item) => (
          <GlassPanel
            key={item.title}
            className="glow-card-hover p-6 transition-all duration-300 hover:border-[color:var(--neon)]/35 hover:shadow-[0_0_40px_-12px_var(--neon)]"
          >
            <p className="font-serif text-4xl text-[color:var(--neon)] md:text-5xl">{item.value}</p>
            <p className="mt-2 font-mono text-label uppercase tracking-wider text-foreground/80">{item.title}</p>
            <p className="mt-1 text-sm text-[color:var(--saffron)]">{item.sub}</p>
            <p className="mt-3 text-sm text-muted-foreground">{item.body}</p>
          </GlassPanel>
        ))}
      </FadeIn>

      <FadeIn className="mt-14">
        <HudLabel>Worker pain points we solve</HudLabel>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {workerPainPoints.map((p) => (
            <div
              key={p.title}
              className="glow-card-hover border border-white/10 bg-white/[0.03] p-5 transition-all hover:border-[color:var(--saffron)]/30"
            >
              <p className="font-serif text-lg text-white">{p.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn className="mt-14">
        <HudLabel>Revenue model</HudLabel>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-left text-muted-foreground">
                <th className="py-3 pr-4 uppercase tracking-wider">Stream</th>
                <th className="py-3 pr-4 uppercase tracking-wider">Model</th>
                <th className="py-3 uppercase tracking-wider">Unit economics</th>
              </tr>
            </thead>
            <tbody>
              {revenueStreams.map((r) => (
                <tr key={r.stream} className="border-b border-white/5 text-white/85">
                  <td className="py-3 pr-4">{r.stream}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{r.model}</td>
                  <td className="py-3 text-[color:var(--neon)]">{r.margin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FadeIn>

      <FadeIn className="mt-14">
        <HudLabel>Future roadmap</HudLabel>
        <div className="mt-6 flex flex-col gap-3 md:flex-row md:flex-wrap">
          {launchRoadmap.map((step) => (
            <div
              key={step.phase}
              className="glow-card-hover flex flex-1 min-w-[140px] flex-col border border-white/10 bg-black/40 px-4 py-4"
            >
              <p className="font-mono text-[9px] uppercase tracking-wider text-[color:var(--neon)]">{step.phase}</p>
              <p className="mt-2 font-serif text-lg text-white">{step.label}</p>
              <p className="mt-1 font-mono text-[9px] uppercase text-[color:var(--saffron)]">{step.status}</p>
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn className="mt-10 grid gap-8 lg:grid-cols-12">
        <GlassPanel className="lg:col-span-5 p-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <TrendingUp className="h-4 w-4 text-[color:var(--neon)]" />
            <HudLabel>Scale Parameter Controls</HudLabel>
          </div>
          <div className="mt-6">
            <div className="flex justify-between font-mono text-xs text-white">
              <span>Worker scale</span>
              <span className="text-[color:var(--neon)]">{(roiWorkers / 1000).toFixed(0)}K</span>
            </div>
            <input
              type="range"
              min="100000"
              max="2000000"
              step="50000"
              value={roiWorkers}
              onChange={(e) => setRoiWorkers(Number(e.target.value))}
              className="mt-3 h-1 w-full cursor-pointer rounded-lg accent-[color:var(--neon)]"
            />
          </div>
          <ButtonLink href={contactLinks.investors} variant="primary" className="mt-8 w-full">
            Request investor intro →
          </ButtonLink>
        </GlassPanel>

        <div className="grid gap-4 sm:grid-cols-3 lg:col-span-7">
          {[
            { label: "Projected GMV", value: `₹${roiCalculations.gmvCr} Cr` },
            { label: "Lending pool", value: `₹${roiCalculations.lendingCr} Cr` },
            { label: "Valuation thesis", value: `₹${roiCalculations.valuationCr} Cr` },
          ].map((m) => (
            <CardTilt key={m.label} glowColor="rgba(0, 217, 255, 0.2)">
              <div className="glow-card-hover p-5">
                <p className="font-mono text-[9px] uppercase text-muted-foreground">{m.label}</p>
                <p className="mt-2 font-serif text-3xl text-white">{m.value}</p>
              </div>
            </CardTilt>
          ))}
        </div>
      </FadeIn>
    </SectionShell>
  );
}
