import { useState } from "react";
import { CheckCircle2, Lock, RefreshCw, Shield } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { CardTilt } from "@/components/cinematic/card-tilt";
import { GlassPanel, HudLabel } from "@/components/ui/glass-panel";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { shramSetuBenefits } from "@/data/cinematic";

export function ShramSetuSection() {
  const [auditStatus, setAuditStatus] = useState<"idle" | "running" | "done">("idle");
  const [auditLogs, setAuditLogs] = useState<string[]>([]);

  const startAudit = () => {
    if (auditStatus === "running") return;
    setAuditStatus("running");
    setAuditLogs(["STARTING SHRAMSETU WELFARE AUDIT..."]);

    const logsList = [
      "VERIFYING DIGILOCKER WORKER IDENTITY CHAIN...",
      "CHECKING E-SHRAM REGISTRATION STATUS...",
      "VALIDATING INSURANCE COVERAGE ALLOCATION...",
      "PENSION ELIGIBILITY: 68 DAYS / 90 REQUIRED...",
      "KARNATAKA WELFARE CESS: 100% COMPLIANT",
      "SYSTEM COMPLIANT: WELFARE LAYER SECURE",
    ];

    logsList.forEach((log, index) => {
      setTimeout(() => {
        setAuditLogs((prev) => [...prev, `[AUDIT] ${log}`]);
      }, (index + 1) * 700);
    });

    setTimeout(() => setAuditStatus("done"), 4800);
  };

  return (
    <SectionShell
      id="shramsetu"
      className="gpu-lite border-b border-white/5 bg-gradient-to-b from-black to-slate-950/20"
    >
      <FadeIn>
        <SectionLabel>05 // ShramSetu Welfare Layer</SectionLabel>
        <SectionTitle className="mt-4 max-w-4xl">
          Government-tech <span className="italic text-[color:var(--saffron)]">welfare infrastructure</span> for workers
        </SectionTitle>
        <p className="mt-4 max-w-2xl text-body text-muted-foreground">
          Worker identity, insurance, pension eligibility, health support, safety systems, and government API
          integration — the dignity layer of India's workforce economy.
        </p>
      </FadeIn>

      <div className="mt-12 grid gap-8 lg:grid-cols-12">
        <FadeIn className="lg:col-span-7">
          <div className="grid gap-4 sm:grid-cols-2">
            {shramSetuBenefits.map((b) => (
              <GlassPanel key={b.id} className="p-5">
                <div className="flex items-start justify-between">
                  <Shield className="h-5 w-5 text-[color:var(--saffron)]" />
                  <span
                    className={`rounded border px-2 py-0.5 font-mono text-[8px] uppercase ${
                      b.status === "Live"
                        ? "border-emerald-500/30 text-emerald-400"
                        : b.status === "Pilot"
                          ? "border-[color:var(--saffron)]/30 text-[color:var(--saffron)]"
                          : "border-white/20 text-muted-foreground"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-lg text-white">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
              </GlassPanel>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="lg:col-span-5 space-y-4">
          <CardTilt glowColor="rgba(255, 69, 0, 0.25)">
            <div className="p-6">
              <HudLabel>Sovereign Worker Credential</HudLabel>
              <p className="mt-4 font-serif text-5xl text-white">742</p>
              <p className="mt-1 font-mono text-[9px] uppercase text-[color:var(--neon)]">Gig Credit Score · AA+</p>
              <div className="mt-6 space-y-2 border-t border-white/10 pt-4 font-mono text-xs">
                <p className="flex justify-between text-muted-foreground">
                  <span>ID Node</span>
                  <span className="text-white">GB-IND-560032</span>
                </p>
                <p className="flex justify-between text-muted-foreground">
                  <span>e-Shram</span>
                  <span className="text-emerald-400">Verified</span>
                </p>
                <p className="flex justify-between text-muted-foreground">
                  <span>Insurance</span>
                  <span className="text-white">₹5L Active</span>
                </p>
              </div>
            </div>
          </CardTilt>

          <GlassPanel className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-3">
              <span className="font-mono text-[9px] uppercase text-white">Welfare Audit Console</span>
              <span className="font-mono text-[9px] text-[color:var(--saffron)] animate-pulse">Monitoring</span>
            </div>
            <div className="space-y-4 p-4">
              <div className="h-[140px] space-y-1.5 overflow-y-auto font-mono text-[10px]">
                {auditLogs.length === 0 ? (
                  <p className="italic text-muted-foreground/60">Audit queue ready...</p>
                ) : (
                  auditLogs.map((log, i) => (
                    <p
                      key={i}
                      className={log.includes("SYSTEM COMPLIANT") ? "font-semibold text-emerald-400" : "text-[color:var(--saffron)]"}
                    >
                      {log}
                    </p>
                  ))
                )}
              </div>
              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-emerald-400" />
                  <span className="font-mono text-[9px] uppercase text-muted-foreground">DPDP Aligned</span>
                </div>
                <button
                  type="button"
                  onClick={startAudit}
                  disabled={auditStatus === "running"}
                  className="flex items-center gap-2 rounded border border-[color:var(--saffron)]/40 bg-[color:var(--saffron)]/10 px-3 py-2 font-mono text-[9px] uppercase text-[color:var(--saffron)] transition-colors hover:bg-[color:var(--saffron)]/20 disabled:opacity-50"
                >
                  {auditStatus === "running" ? (
                    <>
                      <RefreshCw className="h-3 w-3 animate-spin" /> Auditing
                    </>
                  ) : auditStatus === "done" ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" /> Complete
                    </>
                  ) : (
                    "Run welfare audit"
                  )}
                </button>
              </div>
            </div>
          </GlassPanel>
        </FadeIn>
      </div>
    </SectionShell>
  );
}
