import { EV_SMART_HUB } from "@/lib/coliving-demo";
import { ArchitectureVisual } from "./ArchitectureVisual";
import { Activity, BatteryCharging, Car, Cpu, Sun, Zap } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function EvSmartHubSection() {
  const hub = EV_SMART_HUB;

  return (
    <section className="animate-fade-in">
      <SectionHeader
        icon={Zap}
        tag="01 · EV Smart Hub"
        title="Charging · Fleet · Dispatch"
        subtitle="Tesla-grade infrastructure for gig fleets"
      />

      <ArchitectureVisual variant="hub" className="mb-4" />

      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {hub.metrics.map((m) => (
          <div key={m.label} className="pod-card p-3.5">
            <p className="text-[9px] font-mono uppercase tracking-wider text-foreground/50">{m.label}</p>
            <p className="text-xl font-bold tabular-nums text-cyan-300">{m.value}</p>
            <p className="text-[10px] text-foreground/55">{m.unit}</p>
          </div>
        ))}
      </div>

      <div className="pod-card p-4 mb-4 fintech-glow-cyan">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-mono-tech uppercase tracking-widest text-cyan-300/90">
            Battery analytics · live
          </p>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400">
            <Sun className="h-3 w-3" /> {hub.solarPct}% solar
          </span>
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hub.batteryAnalytics}>
              <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "hsl(200 30% 75%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "hsl(200 30% 75%)" }} axisLine={false} tickLine={false} width={24} />
              <Tooltip
                contentStyle={{
                  background: "hsl(215 60% 6%)",
                  border: "1px solid hsl(200 100% 50% / 0.25)",
                  borderRadius: 12,
                  fontSize: 11,
                }}
              />
              <Area type="monotone" dataKey="soc" stroke="hsl(200 100% 50%)" fill="hsl(200 100% 50% / 0.12)" strokeWidth={2} name="SOC %" />
              <Area type="monotone" dataKey="load" stroke="hsl(150 100% 50%)" fill="hsl(150 100% 50% / 0.08)" strokeWidth={1.5} name="Load %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-[11px] text-foreground/60">{hub.sessionsToday} charging sessions today</p>
      </div>

      <div className="pod-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Cpu className="h-4 w-4 text-violet-300" />
          <p className="text-sm font-bold text-bright">AI Dispatch Center</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Car, label: "Active drivers", value: hub.dispatchStats.activeDrivers },
            { icon: Activity, label: "Trips today", value: hub.dispatchStats.tripsToday.toLocaleString("en-IN") },
            { icon: BatteryCharging, label: "Avg wait", value: `${hub.dispatchStats.avgWaitMin} min` },
            { icon: Cpu, label: "AI match rate", value: `${hub.dispatchStats.aiMatchRate}%` },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/[0.06] bg-black/25 p-2.5">
              <s.icon className="h-3.5 w-3.5 text-violet-300 mb-1" />
              <p className="text-[9px] font-mono uppercase text-foreground/50">{s.label}</p>
              <p className="text-sm font-bold text-bright tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  icon: Icon,
  tag,
  title,
  subtitle,
}: {
  icon: typeof Zap;
  tag: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4 text-cyan-400" />
        <span className="text-[10px] font-mono-tech uppercase tracking-[0.28em] text-cyan-300/80">{tag}</span>
      </div>
      <h2 className="text-xl font-bold text-bright">{title}</h2>
      <p className="text-xs text-foreground/65 mt-0.5">{subtitle}</p>
    </div>
  );
}

export { SectionHeader };
