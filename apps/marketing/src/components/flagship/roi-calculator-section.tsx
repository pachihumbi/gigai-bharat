import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp, Zap, Shield, Database } from "lucide-react";
import { GlassPanel, HudLabel, HudValue, LiveDot } from "@/components/ui/glass-panel";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { FadeIn } from "@/components/motion/fade-in";
import { defaultRoiInputs, computeRoi, roiGrowthSeries, type RoiInputs } from "@/data/roi";

function fmtCr(n: number) {
  if (n >= 1000) return `₹${(n / 100).toFixed(0)}K Cr`;
  return `₹${n.toFixed(0)} Cr`;
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="font-mono text-label uppercase tracking-wider text-muted-foreground">{label}</label>
        <span className="font-serif text-lg tabular-nums text-[color:var(--neon)]">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-[color:var(--neon)]"
      />
    </div>
  );
}

export function RoiCalculatorSection() {
  const [inputs, setInputs] = useState<RoiInputs>(defaultRoiInputs);
  const out = useMemo(() => computeRoi(inputs), [inputs]);
  const growth = useMemo(() => roiGrowthSeries(inputs), [inputs]);

  const set = <K extends keyof RoiInputs>(key: K, val: RoiInputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: val }));

  const outputs = [
    { label: "Projected GMV", value: fmtCr(out.projectedGmvCr), icon: TrendingUp },
    { label: "Annual Transactions", value: `${out.annualTransactionsCr.toFixed(1)} Cr rides`, icon: Zap },
    { label: "Lending Opportunity", value: fmtCr(out.lendingOpportunityCr), icon: Shield },
    { label: "Insurance Revenue", value: fmtCr(out.insuranceRevenueCr), icon: Shield },
    { label: "AI Underwriting Value", value: fmtCr(out.aiUnderwritingCr), icon: Database },
    { label: "Worker Identity Score", value: `${out.identityScore}/99`, icon: Database },
    { label: "Y5 Revenue Run-Rate", value: fmtCr(out.revenueYear5Cr), icon: TrendingUp },
    { label: "Valuation Projection", value: fmtCr(out.valuationCr), icon: TrendingUp },
  ];

  return (
    <SectionShell id="roi-calculator" className="border-y border-[color:var(--neon)]/10 bg-midnight/20">
      <FadeIn>
        <SectionLabel>§ Investor ROI Engine</SectionLabel>
        <SectionTitle className="mt-4 max-w-4xl">
          The financial moat — from mobility to{" "}
          <span className="italic text-[color:var(--neon)]">sovereign worker identity.</span>
        </SectionTitle>
        <p className="mt-4 max-w-3xl text-body text-foreground/70">
          GigAI Bharat transforms fragmented labor activity into a sovereign financial identity layer — unlocking
          embedded finance, neo-bank rails, and compounding network effects.
        </p>
      </FadeIn>

      <div className="mt-12 grid gap-8 lg:grid-cols-12">
        <FadeIn className="lg:col-span-5 space-y-6">
          <GlassPanel glow className="p-6 md:p-8">
            <div className="mb-6 flex items-center gap-2">
              <LiveDot />
              <HudLabel>Live simulator inputs</HudLabel>
            </div>
            <div className="space-y-5">
              <Slider label="Worker count" value={inputs.workers} min={50000} max={5000000} step={50000} format={(v) => `${(v / 1e5).toFixed(1)}L`} onChange={(v) => set("workers", v)} />
              <Slider label="Daily rides / worker" value={inputs.dailyRides} min={2} max={20} step={1} format={(v) => String(v)} onChange={(v) => set("dailyRides", v)} />
              <Slider label="OCR uploads / day" value={inputs.ocrUploadsPerDay} min={0.5} max={6} step={0.5} format={(v) => String(v)} onChange={(v) => set("ocrUploadsPerDay", v)} />
              <Slider label="Wallet adoption %" value={inputs.walletAdoption} min={5} max={90} step={1} format={(v) => `${v}%`} onChange={(v) => set("walletAdoption", v)} />
              <Slider label="Credit penetration %" value={inputs.creditPenetration} min={5} max={60} step={1} format={(v) => `${v}%`} onChange={(v) => set("creditPenetration", v)} />
              <Slider label="Insurance adoption %" value={inputs.insuranceAdoption} min={5} max={80} step={1} format={(v) => `${v}%`} onChange={(v) => set("insuranceAdoption", v)} />
              <Slider label="Avg earnings / ride ₹" value={inputs.avgEarnings} min={300} max={2000} step={50} format={(v) => `₹${v}`} onChange={(v) => set("avgEarnings", v)} />
              <Slider label="States expanded" value={inputs.states} min={1} max={28} step={1} format={(v) => String(v)} onChange={(v) => set("states", v)} />
            </div>
          </GlassPanel>
        </FadeIn>

        <FadeIn className="lg:col-span-7 space-y-6" delay={0.06}>
          <div className="grid gap-4 sm:grid-cols-2">
            {outputs.map((o, i) => (
              <motion.div
                key={o.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <GlassPanel className="p-5">
                  <o.icon className="mb-2 h-4 w-4 text-[color:var(--neon)]" />
                  <HudLabel>{o.label}</HudLabel>
                  <HudValue className="mt-1 text-xl md:text-2xl">{o.value}</HudValue>
                </GlassPanel>
              </motion.div>
            ))}
          </div>

          <GlassPanel glow className="p-6">
            <HudLabel>5-year network effect simulation</HudLabel>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(8,12,20,0.95)",
                      border: "1px solid rgba(0,255,255,0.2)",
                      borderRadius: 8,
                    }}
                  />
                  <Line type="monotone" dataKey="gmv" stroke="var(--neon)" strokeWidth={2} dot={false} name="GMV ₹Cr" />
                  <Line type="monotone" dataKey="valuation" stroke="var(--saffron)" strokeWidth={2} dot={false} name="Valuation ₹Cr" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>

          <GlassPanel className="p-6">
            <HudLabel>Revenue expansion curve</HudLabel>
            <div className="mt-4 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growth}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--neon)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--neon)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "rgba(8,12,20,0.95)", border: "1px solid rgba(0,255,255,0.2)" }} />
                  <Area type="monotone" dataKey="revenue" stroke="var(--neon)" fill="url(#revGrad)" name="Revenue ₹Cr" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>
        </FadeIn>
      </div>

      <FadeIn className="mt-12">
        <GlassPanel glow className="p-8 md:p-10">
          <h3 className="font-serif text-2xl md:text-3xl">The data moat flywheel</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              { step: "01", title: "OCR Ledger", body: "Every screenshot becomes structured earnings data owned by the worker." },
              { step: "02", title: "Gig Credit Score", body: "Verified income unlocks bankable identity — not platform proxies." },
              { step: "03", title: "Embedded Finance", body: "Lending, insurance, and UPI rails compound on real cash-flow data." },
              { step: "04", title: "Network Effects", body: "Multi-state expansion multiplies GMV, data density, and valuation." },
            ].map((f) => (
              <div key={f.step} className="border border-border/80 p-4">
                <p className="font-mono text-label text-[color:var(--neon)]">{f.step}</p>
                <p className="mt-2 font-semibold">{f.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center font-serif text-lg italic text-[color:var(--neon)]">
            Multi-billion-dollar potential through fintech moat, neo-bank opportunity, and embedded finance expansion.
          </p>
        </GlassPanel>
      </FadeIn>
    </SectionShell>
  );
}
