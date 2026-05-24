import { AppShell } from "@/components/AppShell";
import { EMERGENCY_SAFETY } from "@/lib/dignity-demo";
import { useI18n } from "@/i18n/context";
import { AlertTriangle, MapPin, Phone, Radio, Shield, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const SecurityMobility = () => {
  const { t } = useI18n();
  const s = EMERGENCY_SAFETY;

  const triggerSos = () => {
    toast.error("SOS activated", {
      description: "Live location shared · 108 & Police notified · Safety desk connecting…",
    });
  };

  return (
    <AppShell title={t.security.title} kn={t.security.subtitle}>
      <div className="pod-card p-4 mb-4 border-red-400/25 animate-scale-in">
        <button
          type="button"
          onClick={triggerSos}
          className="w-full rounded-2xl bg-gradient-to-r from-red-600/35 to-red-500/25 border-2 border-red-400/55 py-6 font-extrabold text-xl text-red-50 active:scale-[0.98] transition shadow-[0_0_48px_rgba(239,68,68,0.25)]"
        >
          <AlertTriangle className="inline h-7 w-7 mr-2" />
          {t.security.sosButton}
        </button>
        <p className="mt-3 text-center text-[11px] text-foreground/60">{t.security.sosBody}</p>
      </div>

      <div className="pod-card p-4 mb-4 fintech-glow-green animate-fade-in">
        <div className="flex items-center gap-2 mb-3">
          <Radio className="h-5 w-5 animate-pulse text-emerald-400" />
          <p className="text-[10px] font-mono-tech uppercase tracking-widest text-emerald-300/90">{t.security.socLive}</p>
        </div>
        <div className="space-y-2 font-mono text-[11px]">
          {[
            "VinFast MPV7 · Verified · SOC 81%",
            "Route risk · MG Rd · LOW",
            "SOS standby · 0 active",
            "Women-safe corridor · ACTIVE",
            s.womenSafety.lastCheckIn,
          ].map((line) => (
            <p key={line} className="rounded-xl border border-emerald-400/15 bg-emerald-400/5 px-3 py-2 text-foreground/85">
              ▸ {line}
            </p>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {[
          { icon: MapPin, label: "Live location", on: s.liveLocationSharing },
          { icon: ShieldCheck, label: "Accident AI", on: s.accidentDetection },
        ].map(({ icon: Icon, label, on }) => (
          <div key={label} className={`pod-card p-3 text-center ${on ? "border-emerald-400/25" : ""}`}>
            <Icon className={`h-4 w-4 mx-auto mb-1 ${on ? "text-emerald-400" : "text-foreground/40"}`} />
            <p className="text-[10px] font-mono uppercase text-foreground/50">{label}</p>
            <p className={`text-sm font-bold ${on ? "text-emerald-300" : "text-foreground/40"}`}>{on ? "ON" : "OFF"}</p>
          </div>
        ))}
      </div>

      <div className="pod-card p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Phone className="h-4 w-4 text-cyan-300" />
          <p className="text-sm font-bold text-bright">Emergency contact</p>
        </div>
        <p className="text-sm text-bright">{s.emergencyContact.name}</p>
        <p className="text-xs font-mono text-foreground/60">{s.emergencyContact.phone}</p>
      </div>

      <p className="text-[10px] font-mono uppercase tracking-wider text-foreground/50 mb-2">Integrations</p>
      <div className="space-y-2 mb-4">
        {s.integrations.map((i) => (
          <div key={i.name} className="pod-card p-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-bright">{i.name}</span>
            <span className="text-[10px] font-bold text-emerald-300">{i.status} · ~{i.responseMin} min</span>
          </div>
        ))}
      </div>

      <div className="pod-card p-4 mb-4 fintech-glow-cyan">
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-5 w-5 text-violet-300" />
          <p className="text-sm font-bold text-bright">Women safety · Night mode</p>
          <span className="ml-auto text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-violet-400/20 text-violet-200 border border-violet-400/30">
            {t.security.active}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="rounded-xl bg-black/25 p-2.5 border border-white/[0.06]">
            <p className="text-foreground/50">Trusted zones</p>
            <p className="font-bold text-violet-200 text-lg">{s.womenSafety.trustedZones}</p>
          </div>
          <div className="rounded-xl bg-black/25 p-2.5 border border-white/[0.06]">
            <p className="text-foreground/50">AI risk alerts today</p>
            <p className="font-bold text-emerald-300 text-lg">{s.womenSafety.riskAlertsToday}</p>
          </div>
        </div>
      </div>

      <div className="pod-card p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-4 w-4 text-cyan-400" />
          <p className="text-[10px] font-mono uppercase text-foreground/50">Safety log</p>
        </div>
        {s.recentEvents.map((e) => (
          <div key={e.time} className="flex justify-between py-2 border-b border-white/[0.06] last:border-0 text-[11px]">
            <div>
              <p className="font-mono text-foreground/50">{e.time}</p>
              <p className="font-medium text-bright">{e.event}</p>
            </div>
            <span className={e.status === "OK" ? "text-emerald-400" : "text-foreground/50"}>{e.status}</span>
          </div>
        ))}
      </div>

      <Link to="/dignity" className="block pod-card py-3.5 text-center text-sm font-bold text-cyan-200 border-cyan-400/25">
        Full dignity infrastructure →
      </Link>
    </AppShell>
  );
};

export default SecurityMobility;
