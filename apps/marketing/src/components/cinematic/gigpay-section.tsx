import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  Shield,
  Smartphone,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { CardTilt } from "@/components/cinematic/card-tilt";
import { GlassPanel, HudLabel, HudValue } from "@/components/ui/glass-panel";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { gigPayMetrics, gigPayTransactions } from "@/data/cinematic";

function EarningsChart() {
  const bars = useMemo(
    () => [42, 58, 51, 72, 68, 84, 79, 91, 88, 96, 92, 100],
    [],
  );

  return (
    <div className="flex h-32 items-end gap-1.5 pt-4">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t bg-gradient-to-t from-[color:var(--neon)]/20 to-[color:var(--neon)]/70"
          initial={{ height: 0 }}
          whileInView={{ height: `${h}%` }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04, duration: 0.5 }}
        />
      ))}
    </div>
  );
}

export function GigPaySection() {
  const [balance] = useState(12840);

  return (
    <SectionShell id="gigpay" className="gpu-lite border-b border-white/5 bg-gradient-to-b from-black to-slate-950/30">
      <FadeIn>
        <SectionLabel>01 // GigPay Fintech Layer</SectionLabel>
        <SectionTitle className="mt-4 max-w-4xl">
          The <span className="italic text-[color:var(--neon)]">PhonePe-grade wallet</span> for India's gig workforce
        </SectionTitle>
        <p className="mt-4 max-w-2xl text-body text-muted-foreground">
          Worker wallet, instant UPI payouts, earnings dashboard, savings pools, and embedded insurance — all powered
          by OCR-verified ledger data.
        </p>
      </FadeIn>

      <div className="mt-12 grid gap-6 lg:grid-cols-12">
        <FadeIn className="lg:col-span-5">
          <CardTilt glowColor="rgba(0, 217, 255, 0.3)">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-[color:var(--neon)]" />
                  <HudLabel>GigPay Worker Wallet</HudLabel>
                </div>
                <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] uppercase text-emerald-400">
                  UPI Active
                </span>
              </div>

              <p className="mt-6 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Available balance
              </p>
              <HudValue className="mt-1 text-4xl text-white">₹{balance.toLocaleString("en-IN")}</HudValue>

              <div className="mt-6 grid grid-cols-3 gap-2">
                {[
                  { icon: ArrowUpRight, label: "Pay", color: "text-[color:var(--neon)]" },
                  { icon: ArrowDownLeft, label: "Receive", color: "text-[color:var(--saffron)]" },
                  { icon: PiggyBank, label: "Save", color: "text-emerald-400" },
                ].map(({ icon: Icon, label, color }) => (
                  <button
                    key={label}
                    type="button"
                    className="flex flex-col items-center gap-1.5 rounded border border-white/10 bg-white/5 py-3 transition-colors hover:border-[color:var(--neon)]/30"
                  >
                    <Icon className={`h-4 w-4 ${color}`} />
                    <span className="font-mono text-[9px] uppercase tracking-wider">{label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                <HudLabel>Recent activity</HudLabel>
                {gigPayTransactions.slice(0, 4).map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between border-b border-white/5 py-2 text-xs last:border-0"
                  >
                    <div>
                      <p className="text-white/90">{tx.desc}</p>
                      <p className="font-mono text-[9px] text-muted-foreground">{tx.time}</p>
                    </div>
                    <span
                      className={`font-mono tabular-nums ${tx.amount.startsWith("+") ? "text-emerald-400" : "text-white/80"}`}
                    >
                      {tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardTilt>
        </FadeIn>

        <FadeIn delay={0.1} className="lg:col-span-7 space-y-4">
          <GlassPanel glow className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <HudLabel>Earnings Dashboard</HudLabel>
                <p className="mt-1 font-serif text-2xl text-white">₹48,250 <span className="text-sm text-muted-foreground">/ month avg</span></p>
              </div>
              <div className="flex items-center gap-1 text-emerald-400">
                <TrendingUp className="h-4 w-4" />
                <span className="font-mono text-sm tabular-nums">+14.2%</span>
              </div>
            </div>
            <EarningsChart />
            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-white/5 pt-4">
              <div>
                <p className="font-mono text-[9px] uppercase text-muted-foreground">Swiggy</p>
                <p className="font-mono text-sm text-white">₹18,420</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase text-muted-foreground">Uber</p>
                <p className="font-mono text-sm text-white">₹16,800</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase text-muted-foreground">Rapido</p>
                <p className="font-mono text-sm text-white">₹13,030</p>
              </div>
            </div>
          </GlassPanel>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gigPayMetrics.map((m) => (
              <GlassPanel key={m.label} className="p-4">
                <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{m.label}</p>
                <p className="mt-1 font-serif text-xl text-[color:var(--neon)]">{m.value}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{m.sub}</p>
              </GlassPanel>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <GlassPanel className="flex items-center gap-4 p-5">
              <Smartphone className="h-8 w-8 text-[color:var(--saffron)]" />
              <div>
                <HudLabel>UPI-Style Layer</HudLabel>
                <p className="text-sm text-white/90">Instant IMPS · Bharat QR · NPCI rail</p>
              </div>
            </GlassPanel>
            <GlassPanel className="flex items-center gap-4 p-5">
              <Shield className="h-8 w-8 text-emerald-400" />
              <div>
                <HudLabel>Savings + Insurance</HudLabel>
                <p className="text-sm text-white/90">Auto-save rules · ₹5L health bundle</p>
              </div>
            </GlassPanel>
          </div>
        </FadeIn>
      </div>
    </SectionShell>
  );
}
