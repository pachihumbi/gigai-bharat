import { HEALTH_LAYER } from "@/lib/dignity-demo";
import { SectionShell } from "./DignityHero";
import { Activity, Heart, Moon, Shield, Stethoscope } from "lucide-react";

const icons = { stethoscope: Stethoscope, heart: Heart, moon: Moon, shield: Shield };

export function HealthLayerSection() {
  const h = HEALTH_LAYER;

  return (
    <SectionShell
      id="health"
      tag="02 · Worker Health Layer"
      title="Care for exhausted workers"
      subtitle="Telemedicine · mental health · sleep · stress · insurance dashboard"
    >
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {[
          { label: "Sleep score", value: h.sleepScore, color: "text-cyan-300" },
          { label: "Stress", value: h.stressLevel, color: "text-amber-300" },
          { label: "Mental sessions", value: h.mentalHealthSessions, color: "text-violet-300" },
          { label: "Insurance", value: h.insuranceActive ? "Active" : "—", color: "text-emerald-300" },
        ].map((s) => (
          <div key={s.label} className="pod-card p-3 text-center">
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[9px] font-mono uppercase text-foreground/50">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="pod-card p-4 mb-3 fintech-glow-green">
        <div className="flex items-center gap-2 mb-1">
          <Stethoscope className="h-4 w-4 text-emerald-400" />
          <p className="text-sm font-bold text-bright">Next telemedicine</p>
        </div>
        <p className="text-xs text-foreground/70">{h.nextAppointment}</p>
      </div>

      <div className="space-y-2 mb-4">
        {h.services.map((svc) => {
          const Icon = icons[svc.icon as keyof typeof icons];
          return (
            <div key={svc.id} className="pod-card p-3.5 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-400/25 bg-red-400/10">
                <Icon className="h-4 w-4 text-red-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-bright">{svc.name}</p>
                <p className="text-[11px] text-foreground/55">{svc.desc}</p>
              </div>
              <span className="text-[9px] font-bold text-emerald-300 uppercase">Live</span>
            </div>
          );
        })}
      </div>

      <div className="pod-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="h-4 w-4 text-amber-400" />
          <p className="text-[10px] font-mono uppercase text-foreground/50">Recovery vitals</p>
        </div>
        {h.vitals.map((v) => (
          <div key={v.label} className="flex justify-between py-2 border-b border-white/[0.06] last:border-0 text-sm">
            <span className="text-foreground/70">{v.label}</span>
            <span className={`font-bold ${v.status === "Alert" ? "text-amber-300" : v.status === "Low" ? "text-red-300" : "text-emerald-300"}`}>
              {v.value}
            </span>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
