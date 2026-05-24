import { EMERGENCY_SAFETY } from "@/lib/dignity-demo";
import { SectionShell } from "./DignityHero";
import { AlertTriangle, MapPin, Phone, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function EmergencySafetySection() {
  const s = EMERGENCY_SAFETY;

  const triggerSos = () => {
    toast.error("SOS activated", {
      description: "Live location shared · 108 & Police notified · Safety desk connecting…",
    });
  };

  return (
    <SectionShell
      tag="01 · Emergency Safety"
      title="One-tap protection"
      subtitle="SOS · live location · accident detection · police/hospital integration"
    >
      <div className="pod-card p-4 mb-3 border-red-400/20">
        <button
          type="button"
          onClick={triggerSos}
          className="w-full rounded-2xl bg-gradient-to-r from-red-600/30 to-red-500/20 border-2 border-red-400/50 py-5 font-extrabold text-lg text-red-100 active:scale-[0.98] transition shadow-[0_0_40px_rgba(239,68,68,0.2)]"
        >
          <AlertTriangle className="inline h-6 w-6 mr-2 mb-0.5" />
          SOS — Emergency
        </button>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
          {[
            { label: "Live location", on: s.liveLocationSharing },
            { label: "Accident AI", on: s.accidentDetection },
          ].map((f) => (
            <span
              key={f.label}
              className={`rounded-lg px-2 py-1.5 text-center border ${f.on ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : "border-white/10 text-foreground/50"}`}
            >
              {f.label} · {f.on ? "ON" : "OFF"}
            </span>
          ))}
        </div>
      </div>

      <div className="pod-card p-4 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Phone className="h-4 w-4 text-cyan-300" />
          <p className="text-sm font-bold text-bright">Emergency contact</p>
        </div>
        <p className="text-sm text-bright">{s.emergencyContact.name}</p>
        <p className="text-xs font-mono text-foreground/60">{s.emergencyContact.phone}</p>
      </div>

      <div className="space-y-2 mb-3">
        {s.integrations.map((i) => (
          <div key={i.name} className="pod-card p-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-bright">{i.name}</span>
            <span className="text-[10px] font-bold text-emerald-300">{i.status} · ~{i.responseMin} min</span>
          </div>
        ))}
      </div>

      <div className="pod-card p-4 fintech-glow-cyan mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4 text-violet-300" />
          <p className="text-sm font-bold text-bright">Women safety · Night mode</p>
          <span className="ml-auto text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-violet-400/20 text-violet-200 border border-violet-400/30">
            Active
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="rounded-xl bg-black/25 p-2 border border-white/[0.06]">
            <p className="text-foreground/50">Trusted zones</p>
            <p className="font-bold text-violet-200">{s.womenSafety.trustedZones}</p>
          </div>
          <div className="rounded-xl bg-black/25 p-2 border border-white/[0.06]">
            <p className="text-foreground/50">AI risk alerts</p>
            <p className="font-bold text-emerald-300">{s.womenSafety.riskAlertsToday} today</p>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-foreground/60 flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {s.womenSafety.lastCheckIn}
        </p>
      </div>

      <Link to="/security" className="block text-center text-xs font-bold text-cyan-300 hover:text-cyan-200">
        Full safety dashboard →
      </Link>
    </SectionShell>
  );
}
