import { Navigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useWorkerOs } from "@/hooks/useWorkerOs";
import { useAuth } from "@/hooks/useAuth";
import { useRestLock } from "@/hooks/useRestLock";
import { RestLockModal } from "@/components/RestLockModal";
import { useI18n } from "@/i18n/context";
import { AiInsightCard } from "@/os/AiInsightCard";
import { MetricHero } from "@/os/MetricHero";
import { OsCard, HudLabel } from "@/os/OsCard";
import { SystemGrid } from "@/os/SystemGrid";
import { coachingTips } from "@/data/worker-os";
import { vinfastFleet } from "@/data/ev-fleet";
import {
  ArrowUpRight,
  LogOut,
  Map,
  Shield,
  ShieldAlert,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const FatigueDial = ({ hours }: { hours: number }) => {
  const max = 12;
  const pct = Math.min(hours / max, 1);
  const r = 48;
  const c = 2 * Math.PI * r;
  const offset = c - pct * c;
  const color = hours >= 10 ? "hsl(var(--destructive))" : hours >= 8 ? "hsl(var(--accent))" : "hsl(var(--secondary))";
  return (
    <div className="relative h-28 w-28 flex-none">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="7" />
        <circle
          cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-extrabold tabular-nums">{hours.toFixed(1)}h</span>
        <span className="text-[8px] font-mono-tech text-muted-foreground">/ 12h</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { t } = useI18n();
  const { worker, wallet, welfare, todayEarnings, tripsToday, loading, os } = useWorkerOs();
  const { signOut } = useAuth();
  const [online, setOnline] = useState(true);
  const [driveHours, setDriveHours] = useState(7.4);
  const { locked, complete } = useRestLock(driveHours);

  useEffect(() => {
    if (!online || locked) return;
    const i = setInterval(() => setDriveHours((h) => Math.min(h + 0.1, 12)), 8000);
    return () => clearInterval(i);
  }, [online, locked]);

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-4">
          <Skeleton className="h-20 w-full rounded-3xl" />
          <Skeleton className="h-44 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      </AppShell>
    );
  }

  const firstName = worker?.name?.split(" ")[0] || "Worker";
  const initial = firstName[0]?.toUpperCase() || "G";
  const score = wallet?.gig_credit_score ?? 300;
  const tip = coachingTips[0];
  const weekDelta = os.weekTotal > 0 && todayEarnings > 0 ? Math.round((todayEarnings / os.weekTotal) * 100) : null;

  return (
    <AppShell>
      <RestLockModal open={locked} onComplete={complete} />

      {/* Command header */}
      <OsCard className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-saffron text-lg font-bold text-accent-foreground">
            {initial}
          </div>
          <div>
            <HudLabel>{t.home.tagline}</HudLabel>
            <p className="font-semibold">{t.home.greeting}, {firstName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex cursor-pointer flex-col items-end gap-1">
            <Switch
              checked={online}
              onCheckedChange={(v) => {
                setOnline(v);
                toast.success(v ? t.home.online : t.home.offline);
              }}
            />
            <span className={`text-[10px] font-mono-tech ${online ? "text-secondary" : "text-muted-foreground"}`}>
              {online ? `● ${t.home.online}` : `○ ${t.home.offline}`}
            </span>
          </label>
          <button
            onClick={() => signOut()}
            aria-label="Sign out"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border/60 bg-muted/30 text-muted-foreground"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </OsCard>

      {/* Earnings intelligence */}
      <OsCard glow="green" className="mb-4 overflow-hidden">
        <MetricHero
          label={t.home.todayEarnings}
          value={todayEarnings}
          delta={weekDelta}
          deltaLabel={weekDelta ? `${weekDelta}% of week` : undefined}
          sub={t.home.kept}
        />
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
          <span>{tripsToday} {t.home.trips}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground" />
          <span>{driveHours.toFixed(1)}{t.home.driving}</span>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-xl border border-secondary/20 bg-secondary/5 px-3 py-2">
          <div className="flex items-center gap-2 text-xs">
            <TrendingUp className="h-3.5 w-3.5 text-secondary" />
            <span className="text-muted-foreground">{t.home.predicted}</span>
          </div>
          <span className="font-bold tabular-nums text-secondary">₹{os.projection.todayPredicted}</span>
        </div>
        <Link to="/ledger" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
          {t.home.viewLedger} <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </OsCard>

      {/* AI dispatch recommendation */}
      <AiInsightCard
        live
        title={t.home.coaching}
        body={`${t.dispatch.moveTo} ${os.topZone.name} — surge in ${os.topZone.etaMin} mins.`}
        impact={`+₹${os.topZone.estEarnings} ${t.dispatch.est}`}
        href="/dispatch"
        icon={Zap}
      />

      {/* Fatigue + quick stats */}
      <div className="my-4 grid grid-cols-2 gap-3">
        <OsCard className={driveHours >= 10 ? "border-destructive/50" : ""}>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-secondary" />
            <HudLabel>{t.home.fatigue}</HudLabel>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <FatigueDial hours={driveHours} />
            <p className="text-[11px] leading-snug text-muted-foreground">{t.home.fatigueSub}</p>
          </div>
        </OsCard>
        <Link to="/credit">
          <OsCard className="h-full hover:border-secondary/40">
            <Shield className="mb-2 h-5 w-5 text-secondary" />
            <HudLabel>{t.home.creditSnippet}</HudLabel>
            <p className="mt-1 text-3xl font-extrabold tabular-nums text-gradient-neon">{score}</p>
            <p className="text-[10px] text-muted-foreground">{os.lending.label}</p>
          </OsCard>
        </Link>
        <Link to="/welfare">
          <OsCard className="h-full hover:border-primary/40">
            <HudLabel>{t.home.welfareSnippet}</HudLabel>
            <p className="mt-1 text-3xl font-extrabold tabular-nums">{welfare?.active_working_days ?? 0}<span className="text-lg text-muted-foreground">/90</span></p>
            <p className="text-[10px] text-muted-foreground">SSC tracker</p>
          </OsCard>
        </Link>
        <Link to="/ev-command">
          <OsCard className="h-full hover:border-accent/40">
            <Map className="mb-2 h-5 w-5 text-accent" />
            <HudLabel className="text-accent">{t.home.vinfastFleet}</HudLabel>
            <p className="text-sm font-semibold">SOC {vinfastFleet.soc}% · ₹{vinfastFleet.operatingCostPerKm}/km</p>
            <p className="text-[10px] text-muted-foreground">{vinfastFleet.rangeKm} km range</p>
          </OsCard>
        </Link>
        <Link to="/security">
          <OsCard className="h-full hover:border-primary/40">
            <Shield className="mb-2 h-5 w-5 text-primary" />
            <HudLabel>{t.systems.security}</HudLabel>
            <p className="text-sm font-semibold">SOC live</p>
            <p className="text-[10px] text-muted-foreground">AI-verified shift</p>
          </OsCard>
        </Link>
      </div>

      {/* Coaching insight */}
      <OsCard glow="neon" className="mb-4">
        <HudLabel className="text-primary">GigAI Coach</HudLabel>
        <p className="mt-2 text-sm leading-relaxed">{tip.body}</p>
        <span className="mt-2 inline-block rounded-full bg-accent/15 px-2 py-1 text-[10px] font-semibold text-accent">
          {tip.impact}
        </span>
      </OsCard>

      <SystemGrid />

      <p className="mt-6 text-center text-[10px] font-mono-tech tracking-[0.25em] text-muted-foreground">
        {t.common.powered}
      </p>
    </AppShell>
  );
};

export default Dashboard;
