import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { authCallbackUrl, formatAuthError } from "@/lib/auth";
import { enterDemoWorkspace, exitDemoWorkspace } from "@/lib/demo-session";
import { resolvePostAuthPath } from "@/lib/worker-profile";
import { isLocalDevHost, marketingSiteUrl, workerAppUrl, workerAuthUrl } from "@/lib/site";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  Car,
  Package,
  Building2,
  IndianRupee,
  Wallet,
  Cpu,
  Flag,
  Globe,
  ExternalLink,
  UserCircle,
  Presentation,
  Copy,
  Sparkles,
  Zap,
  Users,
} from "lucide-react";

type WorkerRole = "driver" | "delivery" | "fleet";
type AuthMode = "signin" | "signup";

const DEMO_CREDENTIALS = {
  email: "demo.driver@bharatgig.live",
  password: "GigAI2026!",
} as const;

const WORKFORCE_STATS = [
  { value: "23.5M+", label: "Gig workers" },
  { value: "₹0", label: "Commission" },
  { value: "100%", label: "Earnings" },
] as const;

const VALUE_PILLARS = [
  { icon: IndianRupee, label: "₹0 Commission" },
  { icon: Wallet, label: "100% Earnings" },
  { icon: Cpu, label: "AI Fleet Intel" },
  { icon: Flag, label: "India First" },
] as const;

const ROLES: { id: WorkerRole; label: string; sub: string; icon: typeof Car }[] = [
  { id: "driver", label: "Gig Driver", sub: "Ride & mobility", icon: Car },
  { id: "delivery", label: "Delivery", sub: "Last-mile ops", icon: Package },
  { id: "fleet", label: "Fleet Partner", sub: "Multi-vehicle", icon: Building2 },
];

function CyberCorner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`pointer-events-none absolute h-4 w-4 border-cyan-400/50 ${className}`}
      aria-hidden
    />
  );
}

function AuthLoading({ label = "Loading workspace…" }: { label?: string }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#010508] px-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-90" />
      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-9 w-9 animate-spin text-cyan-400" aria-hidden />
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-300/70">{label}</p>
      </div>
    </div>
  );
}

const Auth = () => {
  const nav = useNavigate();
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [role, setRole] = useState<WorkerRole>("driver");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setHasSession(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (mounted) setHasSession(!!s);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!hasSession || redirecting) return;

    let cancelled = false;
    setRedirecting(true);

    const fallbackTimer = window.setTimeout(() => {
      if (!cancelled) nav("/dashboard", { replace: true });
    }, 8000);

    resolvePostAuthPath()
      .then((path) => {
        if (!cancelled) nav(path, { replace: true });
      })
      .catch(() => {
        if (!cancelled) nav("/dashboard", { replace: true });
      })
      .finally(() => {
        window.clearTimeout(fallbackTimer);
      });

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
    };
  }, [hasSession, nav, redirecting]);

  if (hasSession === null) {
    return <AuthLoading label="Checking session…" />;
  }

  if (hasSession) {
    return <AuthLoading label="Entering workspace…" />;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      exitDemoWorkspace();

      if (authMode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: authCallbackUrl(),
            data: { role },
          },
        });
        if (signUpError) throw signUpError;
        toast.success("Account created", {
          description: "Next: add your vehicle and platform details.",
        });
        nav("/onboarding", { replace: true });
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      const path = await resolvePostAuthPath();
      nav(path, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      toast.error(formatAuthError(message));
    } finally {
      setBusy(false);
    }
  };

  const applyDemoCredentials = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setRole("driver");
    setAuthMode("signin");
    toast.message("Investor demo credentials applied", {
      description: "Tap Sign In to continue.",
    });
  };

  const copyDemoCredentials = async () => {
    const text = `${DEMO_CREDENTIALS.email} / ${DEMO_CREDENTIALS.password}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied demo credentials");
    } catch {
      toast.message("Demo login", { description: text });
    }
  };

  const openDemoDriver = () => {
    enterDemoWorkspace();
    nav("/dashboard", { replace: true });
  };

  const openInvestorPreview = () => {
    enterDemoWorkspace();
    nav("/pitch", { replace: true });
  };

  return (
    <div className="relative min-h-screen min-h-[100dvh] overflow-x-hidden bg-[#010508] flex flex-col">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-90" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, hsl(180 100% 50%) 0px, transparent 1px, transparent 4px)",
        }}
      />
      <div className="pointer-events-none absolute -top-48 -left-40 h-[32rem] w-[32rem] rounded-full bg-cyan-500/20 blur-[120px] animate-float-slow" />
      <div
        className="pointer-events-none absolute top-1/4 -right-32 h-96 w-96 rounded-full bg-emerald-400/15 blur-[100px] animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[28rem] w-[28rem] rounded-full bg-cyan-400/10 blur-[140px] animate-pulse-soft" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/45 to-transparent animate-scan-line opacity-40" />

      <div className="relative z-10 mx-auto w-full max-w-md flex-1 flex flex-col justify-center px-4 sm:px-6 py-6 sm:py-10">
        {isLocalDevHost() && (
          <a
            href={workerAuthUrl}
            className="mb-5 flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/[0.07] px-4 py-2.5 text-xs font-semibold text-cyan-300 backdrop-blur-md hover:bg-cyan-500/12 hover:border-cyan-400/45 transition-all"
          >
            <Globe className="h-3.5 w-3.5 shrink-0" />
            Open live app on app.bharatgig.live
            <ExternalLink className="h-3 w-3 opacity-70 shrink-0" />
          </a>
        )}

        <div className="relative animate-scale-in">
          <div className="absolute -inset-[1px] rounded-[1.75rem] bg-gradient-to-br from-cyan-400/35 via-cyan-500/10 to-emerald-400/30 opacity-80 blur-sm" />
          <div className="absolute -inset-px rounded-[1.75rem] bg-gradient-to-br from-cyan-400/20 via-transparent to-emerald-400/15" />

          <div
            className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] shadow-[0_40px_120px_rgba(0,0,0,0.8),0_0_100px_rgba(0,217,255,0.06),inset_0_1px_0_rgba(255,255,255,0.06)]"
            style={{
              background:
                "linear-gradient(165deg, rgba(3,12,22,0.88) 0%, rgba(2,8,14,0.72) 45%, rgba(4,16,12,0.78) 100%)",
              backdropFilter: "blur(40px)",
            }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(0,217,255,0.12),transparent_50%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_100%,rgba(57,255,20,0.07),transparent_45%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-orange-500/20 via-white/10 to-emerald-400/25" />

            <CyberCorner className="left-4 top-4 border-l-2 border-t-2" />
            <CyberCorner className="right-4 top-4 border-r-2 border-t-2" />
            <CyberCorner className="bottom-4 left-4 border-b-2 border-l-2" />
            <CyberCorner className="bottom-4 right-4 border-b-2 border-r-2 border-emerald-400/40" />

            <div className="relative p-5 sm:p-8 space-y-5 sm:space-y-7">
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="relative animate-float" style={{ animationDuration: "5s" }}>
                    <div className="absolute -inset-3 rounded-2xl bg-cyan-400/20 blur-xl animate-pulse-soft" />
                    <div className="relative rounded-2xl border border-cyan-400/30 bg-black/50 p-1.5 shadow-[0_0_40px_rgba(0,217,255,0.15)] backdrop-blur-sm">
                      <Logo size={60} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/25 bg-cyan-400/[0.08] px-3 py-1">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-cyan-300/85">
                      Investor Demo
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-black/30 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                    <Users className="h-3 w-3 text-emerald-400/80" />
                    Bengaluru · 2026
                  </span>
                </div>

                <div className="space-y-2">
                  <h1 className="text-[1.75rem] sm:text-[2.25rem] font-extrabold tracking-tight leading-[1.05]">
                    <span className="text-gradient-neon">GigAI Bharat</span>
                  </h1>
                  <p className="text-sm sm:text-base font-semibold text-foreground/90 leading-snug">
                    India&apos;s Worker-Owned{" "}
                    <span className="text-emerald-400/90">Mobility OS</span>
                  </p>
                  <p className="font-kannada text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    ನಿಮ್ಮ ದುಡಿಮೆ ಈಗ AI ಜೊತೆ · Worker-owned infrastructure
                  </p>
                </div>
              </div>

              {/* Workforce stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {WORKFORCE_STATS.map(({ value, label }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/[0.06] bg-black/35 px-2 py-2.5 sm:py-3 text-center backdrop-blur-sm"
                  >
                    <p className="text-sm sm:text-base font-bold text-cyan-300 tabular-nums">{value}</p>
                    <p className="mt-0.5 text-[9px] sm:text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                {VALUE_PILLARS.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1 rounded-full border border-white/[0.06] bg-black/30 px-2.5 py-1 text-[9px] sm:text-[10px] font-semibold text-foreground/80 backdrop-blur-sm"
                  >
                    <Icon className="h-3 w-3 text-emerald-400/90 shrink-0" />
                    {label}
                  </span>
                ))}
              </div>

              {/* Demo credentials */}
              <div className="rounded-2xl border border-dashed border-cyan-400/25 bg-gradient-to-br from-cyan-500/[0.07] to-emerald-500/[0.05] p-4 sm:p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-400/25 bg-cyan-400/10">
                      <Sparkles className="h-4 w-4 text-cyan-300" />
                    </div>
                    <div className="min-w-0 text-left space-y-1">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400/75">
                        Investor demo credentials
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-foreground/95 truncate">
                        {DEMO_CREDENTIALS.email}
                      </p>
                      <p className="font-mono text-xs sm:text-sm text-emerald-300/95">
                        {DEMO_CREDENTIALS.password}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={copyDemoCredentials}
                    className="shrink-0 rounded-lg border border-white/10 bg-black/30 p-2.5 text-muted-foreground hover:text-cyan-300 hover:border-cyan-400/35 transition-colors"
                    aria-label="Copy demo credentials"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={applyDemoCredentials}
                  className="mt-3 w-full rounded-xl border border-cyan-400/25 bg-cyan-400/[0.08] py-2.5 text-xs sm:text-sm font-semibold text-cyan-100 hover:bg-cyan-400/14 hover:border-cyan-400/40 transition-all"
                >
                  Auto-fill & sign in
                </button>
              </div>

              <form onSubmit={submit} className="space-y-4 sm:space-y-5">
                <div>
                  <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-black/45 border border-white/[0.06]">
                    {(
                      [
                        { id: "signin" as const, label: "Sign In" },
                        { id: "signup" as const, label: "Create Account" },
                      ] as const
                    ).map(({ id, label }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setAuthMode(id)}
                        className={`h-11 sm:h-10 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${
                          authMode === id
                            ? "bg-gradient-neon text-primary-foreground shadow-[0_0_20px_rgba(0,217,255,0.22)]"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2.5 text-center text-[11px] sm:text-xs text-muted-foreground leading-relaxed px-1">
                    {authMode === "signup"
                      ? "Email + password only. Vehicle setup follows onboarding."
                      : "Email + password only. No third-party login."}
                  </p>
                </div>

                {authMode === "signup" && (
                  <div>
                    <p className="mb-2.5 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground text-center">
                      Select role
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {ROLES.map(({ id, label, sub, icon: Icon }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setRole(id)}
                          className={`role-chip ${role === id ? "role-chip-active" : ""}`}
                        >
                          <Icon
                            className={`h-4 w-4 transition-colors ${
                              role === id ? "text-emerald-400" : "text-cyan-400/50"
                            }`}
                          />
                          <span className="text-[11px] sm:text-xs font-semibold leading-tight">{label}</span>
                          <span className="text-[9px] text-muted-foreground leading-tight hidden sm:block">
                            {sub}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3 sm:space-y-3.5">
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400/45 group-focus-within:text-cyan-300 transition-colors" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder={DEMO_CREDENTIALS.email}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="auth-input auth-input-with-icon text-sm sm:text-base"
                    />
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400/45 group-focus-within:text-cyan-300 transition-colors" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      autoComplete={authMode === "signup" ? "new-password" : "current-password"}
                      placeholder={DEMO_CREDENTIALS.password}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="auth-input auth-input-with-icon text-sm sm:text-base"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="group relative w-full h-12 sm:h-[3.25rem] rounded-xl bg-gradient-neon text-primary-foreground font-bold flex items-center justify-center gap-2 overflow-hidden disabled:opacity-60 transition-transform active:scale-[0.98] shadow-[0_0_40px_rgba(0,217,255,0.28),0_0_20px_rgba(57,255,20,0.12)]"
                >
                  <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,hsl(0_0%_100%/0.28)_50%,transparent_70%)] bg-[length:200%_100%] animate-shimmer" />
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin relative" />
                  ) : (
                    <>
                      <Zap className="h-4 w-4 relative text-primary-foreground/90" />
                      <span className="relative text-sm sm:text-base">
                        {authMode === "signup" ? "Create Account" : "Sign In"}
                      </span>
                      <ArrowRight className="h-4 w-4 relative transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent" />
                  <span className="text-[9px] font-mono text-muted-foreground tracking-[0.28em]">
                    INSTANT DEMO
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-400/35 to-transparent" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={openDemoDriver}
                    className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-emerald-400/40 bg-emerald-400/[0.08] px-4 py-3.5 min-h-[3rem] text-sm font-semibold text-emerald-100 hover:bg-emerald-400/14 hover:border-emerald-400/60 transition-all active:scale-[0.98]"
                  >
                    <UserCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    Demo Driver
                  </button>
                  <button
                    type="button"
                    onClick={openInvestorPreview}
                    className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-cyan-400/40 bg-cyan-400/[0.08] px-4 py-3.5 min-h-[3rem] text-sm font-semibold text-cyan-100 hover:bg-cyan-400/14 hover:border-cyan-400/60 transition-all active:scale-[0.98]"
                  >
                    <Presentation className="h-4 w-4 text-cyan-400 shrink-0" />
                    Investor Preview
                  </button>
                </div>
              </div>

              <p className="text-[10px] sm:text-[11px] text-center text-muted-foreground/85 leading-relaxed font-mono tracking-wide">
                worker-owned · platform-agnostic · india-first · bengaluru
              </p>
            </div>
          </div>
        </div>

        <footer className="text-center mt-6 sm:mt-8 space-y-3 animate-fade-in pb-2">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] font-mono-tech">
            <a
              href={marketingSiteUrl}
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-cyan-300 transition-colors"
            >
              www.bharatgig.live
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
            <span className="text-muted-foreground/40">·</span>
            <a
              href={workerAppUrl}
              className="inline-flex items-center gap-1 text-cyan-400/80 hover:text-cyan-300 transition-colors"
            >
              app.bharatgig.live
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
          <p className="text-[10px] font-mono-tech tracking-[0.28em] text-muted-foreground">
            POWERED BY{" "}
            <span className="text-gradient-neon font-bold tracking-[0.18em]">GIGAI BHARAT</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Auth;
