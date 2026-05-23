import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, Battery, Leaf, Wrench } from "lucide-react";
import { GlassPanel, HudLabel, HudValue, LiveDot } from "@/components/ui/glass-panel";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { FadeIn } from "@/components/motion/fade-in";
import { chargingHubs, evCommandMetrics } from "@/data/ev-fleet";

const socSeries = [
  { t: "06:00", soc: 92 },
  { t: "09:00", soc: 78 },
  { t: "12:00", soc: 65 },
  { t: "15:00", soc: 58 },
  { t: "18:00", soc: 74 },
  { t: "21:00", soc: 88 },
];

export function EvCommandCenterSection() {
  return (
    <SectionShell id="ev-command" className="border-y border-border/60 bg-midnight/25">
      <FadeIn>
        <SectionLabel>§ EV command center</SectionLabel>
        <SectionTitle className="mt-4 max-w-3xl">
          AI fleet intelligence —{" "}
          <span className="italic text-[color:var(--neon)]">battery to behavior.</span>
        </SectionTitle>
      </FadeIn>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {evCommandMetrics.map((m) => (
          <GlassPanel key={m.label} glow className="p-5">
            <HudLabel>{m.label}</HudLabel>
            <HudValue className="mt-2">{m.value}</HudValue>
            <p className="mt-1 font-mono text-[10px] text-secondary">{m.trend}</p>
          </GlassPanel>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <GlassPanel className="p-6">
          <div className="flex items-center gap-2">
            <Battery className="h-5 w-5 text-[color:var(--neon)]" />
            <HudLabel>Fleet SOC · today</HudLabel>
            <LiveDot />
          </div>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={socSeries}>
                <defs>
                  <linearGradient id="socGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(200 100% 50%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(200 100% 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="soc" stroke="hsl(var(--primary))" fill="url(#socGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-secondary" />
            <HudLabel>Charging ecosystem map</HudLabel>
          </div>
          <ul className="mt-4 space-y-3">
            {chargingHubs.map((h) => (
              <li key={h.name} className="rounded-xl border border-border/60 bg-background/40 p-4">
                <p className="font-semibold text-sm">{h.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {h.slots} fast slots · ☀ {h.solarMw} MW solar
                  {h.windKw > 0 ? ` · 🌬 ${h.windKw} kW wind` : ""} · ~{h.waitMin} min wait
                </p>
              </li>
            ))}
          </ul>
        </GlassPanel>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Wrench, title: "Predictive maintenance", body: "AI flags battery thermal drift 72h before failure." },
          { icon: Leaf, title: "Carbon reduction", body: "2,840 tCO₂/yr avoided vs ICE fleet baseline." },
          { icon: Activity, title: "Driver behavior", body: "Efficiency scores feed Gig Credit and insurance rails." },
        ].map(({ icon: Icon, title, body }) => (
          <GlassPanel key={title} className="p-5">
            <Icon className="mb-2 h-6 w-6 text-[color:var(--saffron)]" />
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{body}</p>
          </GlassPanel>
        ))}
      </div>
    </SectionShell>
  );
}
