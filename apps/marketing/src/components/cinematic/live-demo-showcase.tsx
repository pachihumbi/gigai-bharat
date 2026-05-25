import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Car,
  Home,
  LayoutDashboard,
  Wallet,
  Zap,
} from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { CardTilt } from "@/components/cinematic/card-tilt";
import { AnimatedCounter } from "@/components/motion/animated-counter";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { contactLinks } from "@/data/landing";
import { gigPayTransactions, evFleet } from "@/data/cinematic";

const tabs = [
  { id: "gigpay", label: "GigPay", icon: Wallet },
  { id: "gigev", label: "GigEV", icon: Car },
  { id: "dashboard", label: "Worker OS", icon: LayoutDashboard },
  { id: "pods", label: "GigPods", icon: Home },
  { id: "ai", label: "AI Copilot", icon: Bot },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function LiveDemoShowcase() {
  const [active, setActive] = useState<TabId>("gigpay");

  return (
    <SectionShell id="live-demo" className="gpu-lite border-b border-white/5 bg-black/40">
      <FadeIn>
        <SectionLabel>Live product demos</SectionLabel>
        <SectionTitle className="mt-4 max-w-3xl">
          Touch the <span className="italic text-[color:var(--neon)]">super app</span> before you install
        </SectionTitle>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
          Investor-grade previews of GigPay, EV fleet, worker command center, smart pods, and AI co-pilot — all live on
          app.bharatgig.live.
        </p>
      </FadeIn>

      <FadeIn className="mt-10 flex flex-wrap gap-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActive(id)}
            className={`flex items-center gap-2 rounded border px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider transition-all ${
              active === id
                ? "border-[color:var(--neon)]/50 bg-[color:var(--neon)]/10 text-[color:var(--neon)] shadow-[0_0_24px_-8px_var(--neon)]"
                : "border-white/10 text-muted-foreground hover:border-white/20 hover:text-white"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </FadeIn>

      <FadeIn className="mt-8">
        <CardTilt glowColor="rgba(0, 217, 255, 0.25)">
          <div className="min-h-[320px] rounded-lg border border-white/10 bg-black/70 p-6 md:p-8">
            {active === "gigpay" && (
              <motion.div key="gigpay" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">GigPay wallet</p>
                <p className="mt-2 font-serif text-4xl text-[color:var(--neon)]">
                  <AnimatedCounter value={12840} prefix="₹" />
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Instant UPI · QR · T+0 payouts</p>
                <ul className="mt-6 space-y-2">
                  {gigPayTransactions.slice(0, 4).map((tx) => (
                    <li
                      key={tx.id}
                      className="flex justify-between border-b border-white/5 py-2 font-mono text-xs text-white/80"
                    >
                      <span>{tx.desc}</span>
                      <span className={tx.amount.startsWith("+") ? "text-[color:var(--neon)]" : "text-[color:var(--saffron)]"}>
                        {tx.amount}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
            {active === "gigev" && (
              <motion.div key="gigev" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">EV marketplace</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {evFleet.slice(0, 4).map((v) => (
                    <div key={v.id} className="border border-white/10 bg-white/5 p-4">
                      <p className="font-mono text-[9px] uppercase text-[color:var(--saffron)]">{v.category}</p>
                      <p className="mt-1 font-serif text-lg text-white">{v.name}</p>
                      <p className="mt-2 font-mono text-xs text-muted-foreground">
                        {v.rangeKm} km · SOC {v.socAvg}% · ₹{v.costPerKm}/km
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {active === "dashboard" && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Worker dashboard</p>
                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    { label: "Today", value: 2840, suffix: "" },
                    { label: "Trips", value: 18, suffix: "" },
                    { label: "Credit", value: 742, suffix: "" },
                    { label: "SOC", value: 76, suffix: "%" },
                  ].map((m) => (
                    <div key={m.label} className="border border-[color:var(--neon)]/20 bg-[color:var(--neon)]/5 p-4 text-center">
                      <p className="font-mono text-[9px] uppercase text-muted-foreground">{m.label}</p>
                      <p className="mt-2 font-serif text-2xl text-white">
                        <AnimatedCounter value={m.value} prefix={m.label === "Today" ? "₹" : ""} suffix={m.suffix} />
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">Route telematics · fatigue dial · 11 OS modules</p>
              </motion.div>
            )}
            {active === "pods" && (
              <motion.div key="pods" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Smart ShramSetu pods</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {["Sleep pods", "EV charge", "Gurukul AI", "Recovery", "Dispatch SOC"].map((f) => (
                    <span
                      key={f}
                      className="border border-white/15 bg-white/5 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-white/80"
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                  Affordable premium co-living with smart sleep infrastructure, shared kitchens, charging stations, and
                  24/7 safety systems — Bengaluru pilot nodes live.
                </p>
              </motion.div>
            )}
            {active === "ai" && (
              <motion.div key="ai" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">AI assistant</p>
                <div className="mt-4 rounded border border-[color:var(--neon)]/30 bg-[color:var(--neon)]/5 p-4">
                  <p className="font-mono text-xs text-[color:var(--neon)]">Shift Coach · LIVE</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/90">
                    Demand spike in Whitefield. Route via ORR —{" "}
                    <span className="text-[color:var(--saffron)]">23% higher earnings</span> next 2 hours. EV SOC sufficient
                    until 22:00.
                  </p>
                </div>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {["KN voice", "Demand zones", "Financial coach", "Safety SOS"].map((t) => (
                    <li key={t} className="flex items-center gap-1 font-mono text-[10px] uppercase text-muted-foreground">
                      <Zap className="h-3 w-3 text-[color:var(--neon)]" />
                      {t}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </CardTilt>
      </FadeIn>

      <FadeIn className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <a href={contactLinks.app} className="cinematic-cta-primary inline-flex items-center justify-center gap-2 rounded py-3.5 px-6 font-mono text-[11px] uppercase tracking-wider">
          Open live super app →
        </a>
        <a
          href="https://app.bharatgig.live/demo"
          className="cinematic-cta-secondary inline-flex items-center justify-center rounded py-3.5 px-6 font-mono text-[11px] uppercase tracking-wider"
        >
          Try demo workspace
        </a>
      </FadeIn>
    </SectionShell>
  );
}
