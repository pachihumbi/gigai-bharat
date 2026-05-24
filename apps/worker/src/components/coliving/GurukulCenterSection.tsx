import { GURUKUL_CENTER } from "@/lib/coliving-demo";
import { ArchitectureVisual } from "./ArchitectureVisual";
import { SectionHeader } from "./EvSmartHubSection";
import { Battery, Cpu, GraduationCap, Mic, Radio, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

const iconMap = {
  battery: Battery,
  mic: Mic,
  wallet: Wallet,
  cpu: Cpu,
};

export function GurukulCenterSection() {
  const g = GURUKUL_CENTER;

  return (
    <section className="animate-fade-in">
      <SectionHeader
        icon={GraduationCap}
        tag="03 · Gurukul AI Center"
        title="Skill training at the hub"
        subtitle="EV maintenance · English · financial literacy"
      />

      <ArchitectureVisual variant="gurukul" className="mb-4" />

      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {[
          { label: "Active learners", value: g.activeLearners },
          { label: "Live courses", value: g.coursesLive },
          { label: "Completion rate", value: `${g.completionRate}%` },
          { label: "Certifications", value: g.certificationsIssued },
        ].map((s) => (
          <div key={s.label} className="pod-card p-3 text-center">
            <p className="text-lg font-bold text-emerald-300 tabular-nums">{s.value}</p>
            <p className="text-[9px] font-mono uppercase text-foreground/50">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="pod-card p-4 mb-4 fintech-glow-green">
        <div className="flex items-center gap-2 mb-2">
          <Radio className="h-4 w-4 text-red-400 animate-pulse" />
          <span className="text-[10px] font-mono uppercase text-red-300/90">Live in {g.liveSession.startsIn}</span>
        </div>
        <p className="text-sm font-bold text-bright">{g.liveSession.title}</p>
        <p className="text-[11px] text-foreground/60 mt-0.5">{g.liveSession.instructor} · {g.liveSession.seats} seats left</p>
      </div>

      <div className="space-y-2.5 mb-4">
        {g.programs.map((p) => {
          const Icon = iconMap[p.icon];
          return (
            <div key={p.id} className="pod-card p-3.5 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-400/10">
                <Icon className="h-4 w-4 text-emerald-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-bright truncate">{p.title}</p>
                <p className="text-[11px] text-foreground/55">
                  {p.duration} · {p.level} · {p.enrolled} enrolled
                </p>
              </div>
              {p.aiPowered && (
                <span className="shrink-0 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border border-violet-400/35 bg-violet-400/10 text-violet-200">
                  AI
                </span>
              )}
            </div>
          );
        })}
      </div>

      <Link
        to="/gurukul"
        className="block pod-card py-3.5 text-center text-sm font-bold text-emerald-200 border-emerald-400/25 hover:bg-emerald-400/5 transition active:scale-[0.99]"
      >
        Open full Gurukul →
      </Link>
    </section>
  );
}
