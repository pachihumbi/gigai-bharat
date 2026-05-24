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
  GraduationCap,
  LogOut,
  Map,
  Shield,
  ShieldAlert,
  TrendingUp,
  Zap,
  Cpu,
  Battery,
  Navigation,
  Globe,
  RefreshCw,
  Sun,
  Activity
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { exitDemoWorkspace, isDemoWorkspace } from "@/lib/demo-session";

const FatigueDial = ({ hours }: { hours: number }) => {
  const max = 12;
  const pct = Math.min(hours / max, 1);
  const r = 48;
  const c = 2 * Math.PI * r;
  const offset = c - pct * c;
  const color = hours >= 10 ? "hsl(var(--destructive))" : hours >= 8 ? "#ff7a00" : "#00d9ff";
  return (
    <div className="relative h-24 w-24 flex-none">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="6" />
        <circle
          cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 4px ${color})`, transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold tabular-nums text-white">{hours.toFixed(1)}h</span>
        <span className="text-[7px] font-mono tracking-wider text-muted-foreground">/ 12h</span>
      </div>
    </div>
  );
};

// ==========================================
// GLOWING HEARTBEAT SVG GRAPH
// ==========================================
function EarningsPulseGraph() {
  return (
    <div className="relative h-12 w-full overflow-hidden mt-3 border-t border-white/5 pt-3">
      <svg className="w-full h-full" viewBox="0 0 300 40" preserveAspectRatio="none">
        {/* Ambient glow backdrop line */}
        <path
          d="M0,20 Q30,20 40,5 T45,35 T50,20 Q100,20 120,20 Q140,20 150,5 T155,35 T160,20 Q220,20 300,20"
          fill="none"
          stroke="rgba(0, 217, 255, 0.15)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Animated pulsing trace */}
        <path
          d="M0,20 Q30,20 40,5 T45,35 T50,20 Q100,20 120,20 Q140,20 150,5 T155,35 T160,20 Q220,20 300,20"
          fill="none"
          stroke="#00d9ff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="300"
          className="animate-pulse"
        />
      </svg>
    </div>
  );
}

const Dashboard = () => {
  const nav = useNavigate();
  const { locale, setLocale, t } = useI18n();
  const { worker, wallet, welfare, todayEarnings, tripsToday, loading, os, isDemo } = useWorkerOs();
  const { signOut } = useAuth();
  const [online, setOnline] = useState(true);
  const [driveHours, setDriveHours] = useState(7.4);
  const { locked, complete } = useRestLock(driveHours);

  // Dynamic Route Telematics state
  const [activeRoute, setActiveRoute] = useState<"koramangala" | "airport" | "electronic">("koramangala");
  const [simSpeed, setSimSpeed] = useState(42);
  const [simSoc, setSimSoc] = useState(78);
  const [simOdometer, setSimOdometer] = useState(1420.5);
  const [shiftState, setShiftState] = useState<"idle" | "active">("active");

  useEffect(() => {
    if (!online || locked) return;
    const i = setInterval(() => setDriveHours((h) => Math.min(h + 0.1, 12)), 8000);
    return () => clearInterval(i);
  }, [online, locked]);

  // Telematics dynamic simulation loop
  useEffect(() => {
    if (!online || shiftState !== "active") {
      if (shiftState === "idle") {
        setSimSpeed(0);
      }
      return;
    }
    const interval = setInterval(() => {
      setSimSpeed((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(30, Math.min(85, prev + delta));
      });
      setSimSoc((prev) => {
        if (prev <= 10) return 95; // charge back up simulation
        return Math.round((prev - 0.03) * 100) / 100;
      });
      setSimOdometer((prev) => prev + 0.015);
    }, 4000);
    return () => clearInterval(interval);
  }, [online, shiftState]);

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-4">
          <Skeleton className="h-20 w-full bg-white/5 rounded-3xl" />
          <Skeleton className="h-44 w-full bg-white/5 rounded-3xl" />
          <Skeleton className="h-64 w-full bg-white/5 rounded-3xl" />
        </div>
      </AppShell>
    );
  }

  const firstName = worker?.name?.split(" ")[0] || "Worker";
  const initial = firstName[0]?.toUpperCase() || "G";
  const score = wallet?.gig_credit_score ?? 300;
  const tip = coachingTips[0];
  const weekDelta = os.weekTotal > 0 && todayEarnings > 0 ? Math.round((todayEarnings / os.weekTotal) * 100) : null;

  const routeDetails = {
    koramangala: {
      name: "Koramangala Hub → Whitefield Node",
      eta: "14 mins",
      distance: "16.8 km",
      surge: "2.4x Surge Active",
      desc: "Coordinated green corridor. Optimized for fast chargers at VinFast Whitefield Hub."
    },
    airport: {
      name: "Airport EV Corridor",
      eta: "28 mins",
      distance: "34.2 km",
      surge: "1.8x Surge Active",
      desc: "High-speed highway routing. Dynamic battery thermal intelligence monitoring enabled."
    },
    electronic: {
      name: "Electronic City Smart Hub",
      eta: "18 mins",
      distance: "21.5 km",
      surge: "2.1x Surge Active",
      desc: "Urban distribution route. Solar carport parking spots open in worker housing yard."
    }
  };

  return (
    <AppShell>
      <RestLockModal open={locked} onComplete={complete} />

      {/* ==========================================
          INVESTOR DEMO MODE INDICATOR BANNER
          ========================================== */}
      {isDemo && (
        <div className="mb-4 rounded-xl border border-[#ff7a00]/30 bg-[#ff7a00]/5 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff7a00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff4500]"></span>
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#ff7a00] font-bold">
              Demo Workspace · Simulated Intelligence
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[8px] border border-[#ff7a00]/25 px-1.5 py-0.5 rounded text-white bg-black/40">
              PROTOTYPE TELEMETRY
            </span>
            {isDemoWorkspace() && (
              <button
                type="button"
                onClick={() => {
                  exitDemoWorkspace();
                  toast.message("Exited demo workspace");
                  nav("/auth");
                }}
                className="font-mono text-[8px] uppercase tracking-wider border border-white/15 px-2 py-0.5 rounded text-muted-foreground hover:text-white hover:border-white/30 transition-colors"
              >
                Exit demo
              </button>
            )}
            <Link
              to="/auth"
              onClick={() => exitDemoWorkspace()}
              className="font-mono text-[8px] uppercase tracking-wider border border-emerald-400/30 px-2 py-0.5 rounded text-emerald-300 hover:bg-emerald-400/10 transition-colors"
            >
              Create account
            </Link>
          </div>
        </div>
      )}

      {/* ==========================================
          1. GLASSMORPHIC WORKER HUD HEADER
          ========================================== */}
      <div className="mb-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-5 shadow-[0_0_30px_rgba(0,150,255,0.06)] flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-r from-[#ff4500] to-[#ff7a00] text-lg font-bold text-black border border-white/20 select-none shadow-[0_0_15px_rgba(255,122,0,0.3)]">
            {initial}
          </div>
          <div>
            <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-muted-foreground block">
              {t.home.tagline}
            </span>
            <p className="text-lg font-bold text-white mt-0.5">
              {t.home.greeting}, {firstName}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 border-t border-white/5 pt-3 sm:border-0 sm:pt-0">
          {/* Multilingual Selector - Switches Instantly */}
          <div className="flex gap-1 border border-white/10 bg-black/55 p-1 rounded-lg">
            {[
              { code: "en", label: "EN" },
              { code: "kn", label: "ಕನ್ನಡ" },
              { code: "hi", label: "हिन्दी" }
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLocale(l.code as any);
                  toast.success(`Language updated: ${l.label}`);
                }}
                className={`px-2.5 py-1 font-mono text-[9px] rounded uppercase transition-all duration-200 ${
                  locale === l.code
                    ? "bg-[#ff7a00] text-black font-bold"
                    : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <label className="flex cursor-pointer flex-col items-end gap-1 select-none">
              <Switch
                checked={online}
                onCheckedChange={(v) => {
                  setOnline(v);
                  toast.success(v ? t.home.online : t.home.offline);
                }}
                className="scale-90"
              />
              <span className={`text-[9px] font-mono tracking-wider ${online ? "text-[#00d9ff]" : "text-muted-foreground"}`}>
                {online ? `● ${t.home.online}` : `○ ${t.home.offline}`}
              </span>
            </label>
            <button
              onClick={() => {
                toast.success("Signing out...");
                signOut();
              }}
              aria-label="Sign out"
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================
          2. LIVE EARNINGS PULSE (Heartbeat Card)
          ========================================== */}
      <div className="mb-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 shadow-[0_0_40px_rgba(0,150,255,0.08)]">
        <div className="flex items-start justify-between">
          <div>
            <span className="font-mono text-[8px] uppercase tracking-wider text-[#00d9ff] font-bold">
              {t.home.todayEarnings}
            </span>
            <p className="text-4xl font-serif font-extrabold text-white mt-1 tabular-nums">
              ₹{todayEarnings.toLocaleString()}
            </p>
            <p className="text-[10px] text-emerald-400 mt-1 font-mono">
              ✓ {t.home.kept}
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground block">
              Trips & Hours
            </span>
            <p className="text-lg font-bold text-white mt-1">
              {tripsToday} {t.home.trips}
            </p>
            <p className="text-xs text-muted-foreground">
              {driveHours.toFixed(1)} hrs active
            </p>
          </div>
        </div>

        {/* Animated ECG Pulse graph */}
        <EarningsPulseGraph />

        {/* Real-time Ledger Ingestion Feed */}
        <div className="mt-3.5 space-y-1.5 border-t border-white/5 pt-3">
          <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground block">
            Real-time Ledger Ingestion Feed (OCR Active)
          </span>
          <div className="space-y-1.5 max-h-[85px] overflow-hidden select-none">
            {[
              { id: 1, app: "Swiggy Delivery", amt: "₹142.50", time: "4m ago", status: "VERIFIED" },
              { id: 2, app: "Uber Moto Ride", amt: "₹96.00", time: "11m ago", status: "VERIFIED" },
              { id: 3, app: "Zomato Express", amt: "₹118.00", time: "24m ago", status: "VERIFIED" }
            ].map((tx) => (
              <div key={tx.id} className="flex items-center justify-between bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg text-[10px] hover:border-white/10 transition-all">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-white/90">{tx.app}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-white/80">{tx.amt}</span>
                  <span className="font-mono text-[7px] text-emerald-400 border border-emerald-500/35 px-1 bg-emerald-500/5 rounded">
                    {tx.status}
                  </span>
                  <span className="font-mono text-muted-foreground text-[8px]">{tx.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-[#00d9ff]/20 bg-[#0052ff]/5 px-3 py-2.5">
          <div className="flex items-center gap-2 text-xs">
            <TrendingUp className="h-3.5 w-3.5 text-[#00d9ff] animate-pulse" />
            <span className="text-muted-foreground font-mono text-[10px] uppercase tracking-wider">
              Weekly Yield Forecast
            </span>
          </div>
          <span className="font-bold tabular-nums text-[#00d9ff] font-mono text-sm">
            ₹{os.projection.todayPredicted}
          </span>
        </div>

        <div className="mt-4 flex justify-between items-center border-t border-white/5 pt-3">
          <span className="text-[10px] text-muted-foreground">Commission Rate: 0%</span>
          <Link to="/ledger" className="inline-flex items-center gap-1 text-xs font-semibold text-[#00d9ff] hover:underline">
            {t.home.viewLedger} <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* ==========================================
          3. LIVE TRIP TELEMETRICS (Interactive Simulator)
          ========================================== */}
      <div className="mb-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-5 shadow-[0_0_30px_rgba(0,150,255,0.06)] space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#ff7a00]" />
            <span className="font-mono text-xs uppercase tracking-wider text-white">Live Route Telematics</span>
          </div>
          <span className="font-mono text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
            GPS LINKED
          </span>
        </div>

        {/* Simulation route controls */}
        <div className="flex flex-wrap gap-2">
          {(["koramangala", "airport", "electronic"] as const).map((r) => (
            <button
              key={r}
              onClick={() => {
                setActiveRoute(r);
                toast.success(`Switched to Corridor Route: ${routeDetails[r].name}`);
              }}
              className={`font-mono text-[9px] uppercase tracking-wider py-1.5 px-3 border transition-all duration-200 rounded ${
                activeRoute === r
                  ? "border-[#ff7a00] bg-[#ff7a00]/10 text-white"
                  : "border-white/5 bg-white/5 text-[#a1a1aa] hover:border-white/10"
              }`}
            >
              {r === "koramangala" ? "Hub Corridor" : r === "airport" ? "Airport corridor" : "Electronic City"}
            </button>
          ))}
        </div>

        {/* Selected route telemetry stats */}
        <div className="bg-black/60 border border-white/5 p-4 rounded-lg space-y-3">
          <p className="font-serif text-lg text-white font-semibold flex items-center gap-2">
            <Navigation className="h-4 w-4 text-[#ff7a00] animate-pulse" />
            {routeDetails[activeRoute].name}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {routeDetails[activeRoute].desc}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/5 pt-3 mt-3">
            <div>
              <span className="font-mono text-[8px] text-muted-foreground uppercase block">Velocity</span>
              <span className="font-mono text-xs font-bold text-white tabular-nums">{simSpeed} km/h</span>
            </div>
            <div>
              <span className="font-mono text-[8px] text-muted-foreground uppercase block">VinFast Battery</span>
              <span className="font-mono text-xs font-bold text-[#00d9ff] tabular-nums">{simSoc.toFixed(1)}% SOC</span>
            </div>
            <div>
              <span className="font-mono text-[8px] text-muted-foreground uppercase block">ETA corridor</span>
              <span className="font-mono text-xs font-bold text-white">{routeDetails[activeRoute].eta}</span>
            </div>
            <div>
              <span className="font-mono text-[8px] text-muted-foreground uppercase block">Distance</span>
              <span className="font-mono text-xs font-bold text-[#ff7a00]">{routeDetails[activeRoute].distance}</span>
            </div>
          </div>
        </div>

        {/* Dispatch control button */}
        <div className="pt-3.5 border-t border-white/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${shiftState === "active" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              Status: {shiftState === "active" ? "DRIVING SHIFT CORRIDOR" : "SHIFT SUSPENDED / STANDBY"}
            </span>
          </div>
          <button
            onClick={() => {
              const newState = shiftState === "active" ? "idle" : "active";
              setShiftState(newState);
              if (newState === "active") {
                toast.success("AI Dispatch Active! Speedometer linked to live telemetry.", {
                  description: "VinFast fleet MPV7 online."
                });
              } else {
                toast.warning("Shift Suspended. Speedometer zeroed, telemetry idling.");
              }
            }}
            className={`font-mono text-[10px] uppercase tracking-wider py-2 px-4 border transition-all duration-300 rounded ${
              shiftState === "active"
                ? "border-amber-500/40 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-black"
                : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black"
            }`}
          >
            {shiftState === "active" ? "Pause Shift" : "Resume Shift"}
          </button>
        </div>
      </div>

      {/* ==========================================
          4. AI SHIFT RECOMMENDER
          ========================================== */}
      <div className="mb-4">
        <AiInsightCard
          live
          title="AI Shift Recommender"
          body={`Shift Advice: Peak surge detected at ${os.topZone.name} — projected income ₹${os.topZone.estEarnings}/hr. Optimized weather & charging slots allocated.`}
          impact={`+₹${os.topZone.estEarnings} ${t.dispatch.est}`}
          href="/dispatch"
          icon={Zap}
        />
      </div>

      {/* ==========================================
          5. TELEMETRICS DIAL & GIG CREDIT WIDGETS
          ========================================== */}
      <div className="my-4 grid grid-cols-2 gap-3">
        {/* Fatigue dial rest-lock */}
        <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-5 shadow-[0_0_20px_rgba(0,150,255,0.04)] flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[#ff7a00]" />
            <HudLabel>{t.home.fatigue}</HudLabel>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <FatigueDial hours={driveHours} />
            <p className="text-[10px] leading-relaxed text-muted-foreground">{t.home.fatigueSub}</p>
          </div>
        </div>

        {/* Credit Identity */}
        <Link to="/credit" className="block">
          <div className="h-full rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-5 shadow-[0_0_20px_rgba(0,150,255,0.04)] hover:border-[#00d9ff]/30 transition-all duration-200 flex flex-col justify-between">
            <div>
              <Shield className="h-5 w-5 text-[#00d9ff] mb-2" />
              <HudLabel>{t.home.creditSnippet}</HudLabel>
              <p className="mt-1 text-3xl font-extrabold tabular-nums bg-gradient-to-r from-[#00d9ff] to-[#0052ff] bg-clip-text text-transparent">
                {score}
              </p>
            </div>
            <p className="text-[9px] text-muted-foreground mt-4">{os.lending.label}</p>
          </div>
        </Link>

        {/* Welfare tracker */}
        <Link to="/welfare" className="block">
          <div className="h-full rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-5 shadow-[0_0_20px_rgba(0,150,255,0.04)] hover:border-[#ff4500]/30 transition-all duration-200 flex flex-col justify-between">
            <div>
              <Sun className="h-5 w-5 text-[#ff7a00] mb-2 animate-spin-slow" />
              <HudLabel>{t.home.welfareSnippet}</HudLabel>
              <p className="mt-1 text-3xl font-extrabold tabular-nums text-white">
                {welfare?.active_working_days ?? 0}<span className="text-sm text-muted-foreground">/90</span>
              </p>
            </div>
            <p className="text-[9px] text-muted-foreground mt-4">Social Security Code Tracker</p>
          </div>
        </Link>

        {/* VinFast Fleet Specs */}
        <Link to="/ev-command" className="block">
          <div className="h-full rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-5 shadow-[0_0_20px_rgba(0,150,255,0.04)] hover:border-[#00d9ff]/30 transition-all duration-200 flex flex-col justify-between">
            <div>
              <Map className="h-5 w-5 text-[#00d9ff] mb-2" />
              <HudLabel className="text-[#00d9ff]">{t.home.vinfastFleet}</HudLabel>
              <p className="text-xs font-semibold text-white mt-1">SOC {simSoc.toFixed(0)}% · ₹1.2/km</p>
            </div>
            <p className="text-[9px] text-muted-foreground mt-4">VinFast MPV7 Integration active</p>
          </div>
        </Link>
      </div>

      {/* ==========================================
          6. GURUKUL AI ECONOMIC UPGRADE
          ========================================== */}
      <Link to="/gurukul" className="mb-4 block">
        <div className="rounded-2xl border border-[#00d9ff]/25 bg-[#0052ff]/5 backdrop-blur-xl p-5 shadow-[0_0_30px_rgba(0,82,255,0.08)] hover:border-[#00d9ff]/50 transition-all duration-300 flex items-center gap-4">
          <GraduationCap className="h-10 w-10 text-[#00d9ff] shrink-0 animate-bounce-slow" />
          <div>
            <HudLabel className="text-[#00d9ff]">{t.gurukul.title}</HudLabel>
            <p className="text-sm font-semibold text-white mt-0.5">{t.gurukul.tagline}</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Active certifications: EV Mobility Specialist (Level 2 verified)
            </p>
          </div>
        </div>
      </Link>

      <SystemGrid />

      <p className="mt-6 text-center text-[10px] font-mono tracking-[0.25em] text-muted-foreground uppercase">
        {t.common.powered}
      </p>
    </AppShell>
  );
};

export default Dashboard;
