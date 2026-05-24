import { DEMO_FLEET_ANALYTICS } from "@/lib/ev-demo";
import { formatInrCompact } from "@/lib/ev-utils";
import { cn } from "@/lib/utils";
import { Activity, Battery, Leaf, TrendingUp, Truck, Zap } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function FleetAnalyticsDashboard() {
  const a = DEMO_FLEET_ANALYTICS;

  return (
    <div className="ev-card p-4 sm:p-5 animate-fade-in fintech-glow-cyan">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-mono-tech uppercase tracking-[0.28em] text-cyan-300/90">
            Fleet analytics
          </p>
          <p className="text-lg font-bold text-bright mt-0.5">GigEV Command Center</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10">
          <Activity className="h-5 w-5 text-cyan-300" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {[
          { icon: Truck, label: "Active fleet", value: `${a.activeToday}/${a.totalVehicles}`, color: "text-cyan-300" },
          { icon: Battery, label: "Avg SOC", value: `${a.avgSoc}%`, color: "text-emerald-300" },
          { icon: TrendingUp, label: "Revenue today", value: formatInrCompact(a.revenueToday), color: "text-emerald-300" },
          { icon: Leaf, label: "CO₂ saved", value: `${(a.carbonSavedKg / 1000).toFixed(1)}t`, color: "text-orange-300" },
        ].map((m) => (
          <div key={m.label} className="rounded-2xl border border-white/[0.06] bg-black/30 p-3">
            <m.icon className={cn("h-4 w-4 mb-1.5", m.color)} />
            <p className="text-[9px] font-mono uppercase tracking-wider text-foreground/50">{m.label}</p>
            <p className={cn("text-lg font-bold tabular-nums", m.color)}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        {[
          { label: "Uptime", value: `${a.uptimePct}%` },
          { label: "Utilization", value: `${a.fleetUtilizationPct}%` },
          { label: "Growth", value: `+${a.revenueGrowthPct}%` },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-black/25 py-2 border border-white/[0.05]">
            <p className="text-[9px] font-mono uppercase text-foreground/50">{s.label}</p>
            <p className="text-sm font-bold text-bright">{s.value}</p>
          </div>
        ))}
      </div>

      <p className="text-[10px] font-mono uppercase tracking-wider text-foreground/50 mb-2">Weekly revenue</p>
      <div className="h-36 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={a.weeklyRevenue}>
            <CartesianGrid strokeDasharray="3 6" stroke="hsl(200 60% 18% / 0.4)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: "hsl(200 30% 75%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "hsl(200 30% 75%)" }} axisLine={false} tickLine={false} width={32} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip
              contentStyle={{
                background: "hsl(215 60% 6%)",
                border: "1px solid hsl(200 100% 50% / 0.25)",
                borderRadius: 12,
                fontSize: 11,
              }}
              formatter={(v: number) => [formatInrCompact(v), "Revenue"]}
            />
            <Bar dataKey="revenue" fill="hsl(200 100% 50%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[10px] font-mono uppercase tracking-wider text-foreground/50 mb-2 flex items-center gap-1">
        <Zap className="h-3 w-3" /> Fleet SOC trend
      </p>
      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={a.socTrend}>
            <XAxis dataKey="t" tick={{ fontSize: 9, fill: "hsl(200 30% 75%)" }} axisLine={false} tickLine={false} />
            <YAxis domain={[40, 100]} tick={{ fontSize: 9, fill: "hsl(200 30% 75%)" }} width={24} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(215 60% 6%)",
                border: "1px solid hsl(200 100% 50% / 0.25)",
                borderRadius: 12,
                fontSize: 11,
              }}
            />
            <Area
              type="monotone"
              dataKey="v"
              stroke="hsl(200 100% 50%)"
              fill="hsl(200 100% 50% / 0.15)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}