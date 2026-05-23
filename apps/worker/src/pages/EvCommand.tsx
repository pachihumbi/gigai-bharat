import { AppShell } from "@/components/AppShell";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useI18n } from "@/i18n/context";
import { fleetHealth, vinfastChargeHubs, vinfastFleet } from "@/data/ev-fleet";
import { OsCard, HudLabel } from "@/os/OsCard";
import { Battery, Leaf, Wrench, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const socData = [
  { t: "6a", v: 92 },
  { t: "9a", v: 78 },
  { t: "12p", v: 65 },
  { t: "3p", v: 58 },
  { t: "6p", v: 74 },
  { t: "9p", v: 88 },
];

const EvCommand = () => {
  const { t } = useI18n();

  return (
    <AppShell title={t.ev.commandTitle} kn={t.ev.commandSub}>
      <OsCard glow="neon" className="mb-4">
        <HudLabel className="text-primary">VinFast fleet</HudLabel>
        <h2 className="mt-1 text-2xl font-bold">{vinfastFleet.name}</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">{t.ev.range}</p>
            <p className="font-bold text-secondary">{vinfastFleet.rangeKm} km</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t.ev.soc}</p>
            <p className="font-bold text-primary">{vinfastFleet.soc}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t.ev.operatingCost}</p>
            <p className="font-bold">₹{vinfastFleet.operatingCostPerKm}/km</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t.ev.uptime}</p>
            <p className="font-bold text-secondary">{fleetHealth.uptime}%</p>
          </div>
        </div>
      </OsCard>

      <div className="mb-4 grid grid-cols-2 gap-3">
        {[
          { icon: Battery, label: t.ev.fleetSoc, value: `${fleetHealth.socAvg}%` },
          { icon: Zap, label: t.ev.efficiency, value: `${fleetHealth.efficiency} km/kWh` },
          { icon: Leaf, label: t.ev.carbon, value: `${(fleetHealth.carbonSavedKg / 1000).toFixed(1)}t` },
          { icon: Wrench, label: t.ev.maintenance, value: `${fleetHealth.maintenanceAlerts} alerts` },
        ].map(({ icon: Icon, label, value }) => (
          <OsCard key={label}>
            <Icon className="mb-2 h-5 w-5 text-accent" />
            <HudLabel>{label}</HudLabel>
            <p className="mt-1 text-xl font-bold tabular-nums">{value}</p>
          </OsCard>
        ))}
      </div>

      <OsCard className="mb-4">
        <HudLabel className="mb-3 block">{t.ev.socChart}</HudLabel>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={socData}>
              <XAxis dataKey="t" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 100]} tick={{ fontSize: 10 }} width={24} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
              <Area type="monotone" dataKey="v" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </OsCard>

      <HudLabel className="mb-3 block">{t.ev.chargingMap}</HudLabel>
      <div className="space-y-2 mb-4">
        {vinfastChargeHubs.map((h) => (
          <OsCard key={h.name} className="py-3">
            <p className="text-sm font-semibold">{h.name}</p>
            <p className="text-[11px] text-muted-foreground">
              {h.slots} slots · ~{h.waitMin} min {h.solar ? "· ☀ solar" : ""}
            </p>
          </OsCard>
        ))}
      </div>

      <Link to="/dispatch" className="block rounded-2xl border border-primary/40 bg-primary/10 py-4 text-center font-semibold text-primary">
        {t.ev.openDispatch} →
      </Link>
    </AppShell>
  );
};

export default EvCommand;
