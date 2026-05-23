import { AppShell } from "@/components/AppShell";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, BookOpen, Camera, LogOut, ShieldAlert, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCountUp } from "@/hooks/useCountUp";
import { useLedger } from "@/hooks/useLedger";
import { useAuth } from "@/hooks/useAuth";
import { useRestLock } from "@/hooks/useRestLock";
import { RestLockModal } from "@/components/RestLockModal";
import { useI18n } from "@/i18n/context";
import { weekTotal } from "@/lib/ledger-utils";

const DashboardSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-20 w-full rounded-3xl" />
    <Skeleton className="h-40 w-full rounded-3xl" />
    <Skeleton className="h-44 w-full rounded-3xl" />
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-3xl" />)}
    </div>
  </div>
);

const RestLockDial = ({ hours }: { hours: number }) => {
  const max = 12;
  const pct = Math.min(hours / max, 1);
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - pct * c;
  const danger = hours >= 10;
  const color = danger ? "hsl(var(--destructive))" : hours >= 8 ? "hsl(var(--accent))" : "hsl(var(--secondary))";
  return (
    <div className="relative w-32 h-32">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
        <circle
          cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold tabular-nums">{hours.toFixed(1)}h</span>
        <span className="text-[9px] font-mono-tech tracking-widest text-muted-foreground">/ {max}h MAX</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { t } = useI18n();
  const { worker, earnings, todayEarnings, tripsToday, loading } = useLedger();
  const { signOut } = useAuth();
  const [online, setOnline] = useState(true);
  const [driveHours, setDriveHours] = useState(7.4);
  const { locked, complete } = useRestLock(driveHours);

  useEffect(() => {
    if (!online || locked) return;
    const i = setInterval(() => setDriveHours((h) => Math.min(h + 0.1, 12)), 8000);
    return () => clearInterval(i);
  }, [online, locked]);

  // Demo helper: long-press hero to fast-forward to fatigue threshold
  const triggerFatigueDemo = () => setDriveHours(11.6);

  const earningsDisplay = useCountUp(Math.round(todayEarnings), 1600);
  const week = weekTotal(earnings);
  const weekDelta = week > 0 && todayEarnings > 0 ? Math.round((todayEarnings / week) * 100) : null;
  if (loading) return <AppShell><DashboardSkeleton /></AppShell>;

  const restLockActive = driveHours >= 12;
  const firstName = worker?.name?.split(" ")[0] || "Driver";
  const initial = firstName[0]?.toUpperCase() || "G";

  return (
    <AppShell>
      <RestLockModal open={locked} onComplete={complete} />
      {/* Greeting + Online toggle */}
      <div className="glass-card p-4 mb-4 flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-saffron grid place-items-center font-bold text-accent-foreground">{initial}</div>
          <div>
            <p className="text-xs font-mono-tech text-muted-foreground">{firstName.toUpperCase()} • BENGALURU</p>
            <p className="font-semibold leading-tight">{t.dashboard.greeting}, {firstName} 👋</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex flex-col items-end gap-1 cursor-pointer">
            <Switch
              checked={online}
              onCheckedChange={(v) => { setOnline(v); toast.success(v ? "You're Online" : "Shift Ended"); }}
            />
            <span className={`text-[10px] font-mono-tech ${online ? "text-secondary" : "text-muted-foreground"}`}>
              {online ? `● ${t.dashboard.online}` : `○ ${t.dashboard.offline}`}
            </span>
          </label>
          <button
            onClick={() => signOut()}
            aria-label="Sign out"
            className="h-9 w-9 grid place-items-center rounded-lg border border-border/60 bg-muted/30 text-muted-foreground"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Earnings hero */}
      <div
        onDoubleClick={triggerFatigueDemo}
        className="relative glass-card overflow-hidden p-5 mb-4 animate-scale-in" style={{ boxShadow: "0 0 0 1px hsl(var(--secondary)/0.4), 0 0 30px hsl(var(--secondary)/0.25)" }}>
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-secondary/30 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-[10px] uppercase tracking-[0.25em] text-secondary font-mono-tech">{t.dashboard.todayEarnings}</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-5xl font-extrabold tracking-tight text-gradient-neon tabular-nums">₹{Math.round(earningsDisplay)}</span>
            {weekDelta !== null && weekDelta > 0 && (
              <span className="mb-2 flex items-center text-xs font-semibold text-secondary">
                <ArrowUpRight className="h-3 w-3" />{weekDelta}% of week
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-secondary mt-1">{t.dashboard.kept}</p>
          <div className="flex items-center gap-4 mt-3 text-[11px] text-muted-foreground">
            <span>{tripsToday} {t.dashboard.trips}</span><span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>{driveHours.toFixed(1)}{t.dashboard.driving}</span>
          </div>
          <Link to="/ledger" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
            <BookOpen className="h-3.5 w-3.5" /> {t.dashboard.viewLedger} →
          </Link>
        </div>
      </div>

      {/* Rest-Lock System */}
      <div className={`glass-card p-4 mb-4 animate-fade-in ${restLockActive ? "border-destructive/60" : "border-secondary/30"}`}>
        <div className="flex items-center gap-4">
          <RestLockDial hours={driveHours} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <ShieldAlert className={`h-4 w-4 ${restLockActive ? "text-destructive" : "text-secondary"}`} />
              <p className="text-[10px] font-mono-tech tracking-widest text-muted-foreground">REST-LOCK SYSTEM</p>
            </div>
            <p className="font-semibold text-sm mt-1 leading-tight">
              {restLockActive ? "Safety lock active" : "Active driving time"}
            </p>
            <p className="text-[11px] font-kannada text-muted-foreground mt-0.5">
              ೧೨ ಗಂಟೆಗಳ ನಂತರ ಸುರಕ್ಷಾ ಲಾಕ್ ಸಕ್ರಿಯವಾಗುತ್ತದೆ
            </p>
            <p className="text-[11px] text-muted-foreground mt-2 leading-snug">
              We prevent fatigue. Take a break, eat a meal — your family is waiting.
            </p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Link
          to="/ocr"
          className="glass-card p-4 text-left active:scale-95 transition-transform animate-fade-in relative overflow-hidden"
        >
          <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_40%,hsl(var(--primary)/0.15)_50%,transparent_60%)] bg-[length:200%_100%] animate-shimmer pointer-events-none" />
          <Camera className="h-5 w-5 text-primary mb-2 relative" />
          <p className="text-sm font-semibold relative">{t.dashboard.uploadScreenshot}</p>
          <p className="text-[10px] text-muted-foreground relative">{t.dashboard.ocrParser}</p>
        </Link>
        <Link to="/heatmap" className="glass-card p-4 active:scale-95 transition-transform animate-fade-in" style={{ animationDelay: "0.05s" }}>
          <Sparkles className="h-5 w-5 text-accent mb-2" />
          <p className="text-sm font-semibold">Smart Routing</p>
          <p className="text-[10px] text-muted-foreground">3 surge zones nearby</p>
        </Link>
      </div>

      {/* Gig AI Recommendation */}
      <Link to="/heatmap" className="block glass-card p-4 mb-4 border-accent/40 animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-3xl rounded-full" />
        <div className="relative flex gap-3">
          <div className="flex-none w-11 h-11 rounded-xl bg-gradient-saffron grid place-items-center glow-saffron">
            <Zap className="h-5 w-5 text-accent-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-tech uppercase tracking-widest text-accent">Gig AI Recommendation • Live</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
            </div>
            <p className="font-semibold text-sm mt-1 leading-snug">
              Move to <span className="text-accent">Indiranagar</span> — surge in 8 mins.
            </p>
            <p className="text-[11px] font-kannada text-muted-foreground mt-1">ಇಂದಿರಾನಗರಕ್ಕೆ ಹೋಗಿ, ೮ ನಿಮಿಷದಲ್ಲಿ ಬೇಡಿಕೆ.</p>
            <div className="flex gap-2 mt-3">
              <span className="text-[10px] px-2 py-1 rounded-full bg-secondary/15 text-secondary font-semibold">+₹420 est.</span>
              <span className="text-[10px] px-2 py-1 rounded-full bg-primary/15 text-primary font-semibold">3.2 km</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Predictive engine */}
      <div className="glass-card p-4 border-secondary/30 relative overflow-hidden animate-fade-in">
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary/20 blur-3xl rounded-full" />
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-3.5 w-3.5 text-secondary" />
          <p className="text-[10px] font-mono-tech uppercase tracking-widest text-secondary">Gig AI Predictive Engine • ಒಳನೋಟ</p>
        </div>
        <p className="text-sm leading-relaxed">
          Drivers like you earned <span className="text-secondary font-semibold">₹680/week</span> more by switching to <span className="text-secondary font-semibold">Whitefield IT corridor</span> 7–9 PM.
        </p>
      </div>

      <p className="text-center text-[10px] font-mono-tech tracking-[0.25em] text-muted-foreground mt-6">
        {t.common.powered}
      </p>
    </AppShell>
  );
};

export default Dashboard;
