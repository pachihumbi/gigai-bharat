import { GURUKUL_DIGNITY, WORKER_GOVERNANCE, GIGAI_CREDIT } from "@/lib/dignity-demo";
import { SectionShell } from "./DignityHero";
import { GraduationCap, Landmark, TrendingUp, Vote, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

export function GurukulDignitySection() {
  const g = GURUKUL_DIGNITY;

  return (
    <SectionShell
      tag="08 · AI Gurukul"
      title="Upgrade life through the app"
      subtitle="English · AI tools · EV · finance · business · international prep"
    >
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        {[
          { label: "Active", value: g.activeCourses },
          { label: "Certs", value: g.certifications },
          { label: "Next", value: "→" },
        ].map((s) => (
          <div key={s.label} className="pod-card p-2.5">
            <p className="text-lg font-bold text-emerald-300">{s.value}</p>
            <p className="text-[9px] font-mono uppercase text-foreground/50">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {g.programs.map((p) => (
          <span key={p} className="text-[11px] px-3 py-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/5 text-foreground/75">
            {p}
          </span>
        ))}
      </div>

      <p className="text-xs text-foreground/65 mb-3">
        Upgrade path: <span className="text-emerald-300 font-semibold">{g.upgradePath}</span>
      </p>
      <Link to="/gurukul" className="block pod-card py-3.5 text-center text-sm font-bold text-emerald-200 border-emerald-400/25">
        <GraduationCap className="inline h-4 w-4 mr-1.5 mb-0.5" />
        Open Gurukul AI →
      </Link>
    </SectionShell>
  );
}

export function WorkerGovernanceSection() {
  const g = WORKER_GOVERNANCE;

  return (
    <SectionShell
      tag="09 · Worker-Owned Governance"
      title="Platform owned by workers"
      subtitle="Voting · proposals · community treasury · profit sharing"
    >
      <div className="pod-card p-4 mb-4 fintech-glow-cyan">
        <div className="flex items-center gap-2 mb-3">
          <Landmark className="h-5 w-5 text-cyan-400" />
          <p className="text-sm font-bold text-bright">Community treasury</p>
        </div>
        <p className="text-3xl font-extrabold text-gradient-neon tabular-nums">
          ₹{(g.treasuryBalance / 100000).toFixed(1)}L
        </p>
        <p className="text-xs text-foreground/60 mt-1">{g.profitSharePct}% profit share to worker members</p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4 text-center text-[11px]">
        <div className="pod-card p-2">
          <p className="font-bold text-bright">{g.communityStats.votersThisMonth}</p>
          <p className="text-foreground/50">Voters/mo</p>
        </div>
        <div className="pod-card p-2">
          <p className="font-bold text-bright">{g.communityStats.proposalsSubmitted}</p>
          <p className="text-foreground/50">Proposals</p>
        </div>
        <div className="pod-card p-2">
          <p className="font-bold text-emerald-300">+{g.communityStats.treasuryGrowthPct}%</p>
          <p className="text-foreground/50">Growth</p>
        </div>
      </div>

      <div className="space-y-2">
        {g.proposals.map((p) => (
          <div key={p.id} className="pod-card p-3.5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-bright leading-snug">{p.title}</p>
              <span className={`shrink-0 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${p.status === "Passed" ? "bg-emerald-400/15 text-emerald-300" : "bg-cyan-400/15 text-cyan-200"}`}>
                {p.status}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-foreground/55">
              <Vote className="h-3 w-3" /> {p.votes} votes {p.ends !== "—" && `· ends ${p.ends}`}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export function GigAiCreditSection() {
  const c = GIGAI_CREDIT;

  return (
    <SectionShell
      tag="10 · GigAI Credit System"
      title="Banks ignore gig workers — we don't"
      subtitle="Earning-based credit · AI trust scoring · micro-loans · insurance"
    >
      <div className="pod-card p-5 mb-4 text-center fintech-glow-green">
        <p className="text-[10px] font-mono uppercase text-foreground/50">Gig Credit Score</p>
        <p className="text-5xl font-extrabold text-gradient-neon tabular-nums mt-1">{c.score}</p>
        <p className="text-xs text-emerald-300 mt-2">Pre-approved up to ₹{c.preApproved.toLocaleString("en-IN")}</p>
      </div>

      <div className="space-y-2 mb-4">
        {c.factors.map((f) => (
          <div key={f.label} className="pod-card p-3">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-bright">{f.label}</span>
              <span className="text-emerald-300 tabular-nums">{f.score}/{f.max}</span>
            </div>
            <div className="h-1.5 rounded-full bg-black/40 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${(f.score / f.max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 mb-4">
        {c.products.map((p) => (
          <div key={p.name} className="pod-card p-3.5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-bright">{p.name}</p>
              <p className="text-[11px] text-foreground/55">Up to ₹{p.limit.toLocaleString("en-IN")} · {p.rate}</p>
            </div>
            <Wallet className="h-4 w-4 text-emerald-400" />
          </div>
        ))}
      </div>

      <Link to="/credit" className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-300">
        <TrendingUp className="h-3.5 w-3.5" /> Full credit dashboard →
      </Link>
    </SectionShell>
  );
}

export function FounderVisionSection() {
  return (
    <section className="investor-vision rounded-3xl p-5 sm:p-6 animate-fade-in">
      <p className="text-[10px] font-mono-tech uppercase tracking-[0.3em] text-violet-300/90 mb-3">
        Founder positioning
      </p>
      <p className="text-lg font-bold text-foreground/50 line-through decoration-red-400/50 mb-2">Uber clone</p>
      <p className="text-xl sm:text-2xl font-extrabold text-bright leading-snug">
        Digital public infrastructure for the workforce economy.
      </p>
      <p className="mt-4 text-sm text-foreground/75 leading-relaxed">
        India's worker super-app ecosystem — GigPay · GigEV · GigPods · ShramSetu · Gurukul · FleetOS · Worker Identity · AI Copilot · Health · Credit.
      </p>
      <p className="mt-3 text-xs font-mono text-cyan-300/80">Very few founders think this deeply.</p>
    </section>
  );
}
