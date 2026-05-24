import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { authCallbackUrl, formatAuthError } from "@/lib/auth";
import { enterDemoWorkspace, exitDemoWorkspace } from "@/lib/demo-session";
import { PostAuthRedirect } from "@/components/PostAuthRedirect";
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
  Terminal,
  Zap,
} from "lucide-react";

type WorkerRole = "driver" | "delivery" | "fleet";
type AuthMode = "signin" | "signup";

const DEMO_CREDENTIALS = {
  email: "demo.driver@gigaibharat.in",
  password: "demo123456",
  label: "Demo Driver Account",
} as const;

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

const Auth = () => {
  const nav = useNavigate();
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [role, setRole] = useState<WorkerRole>("driver");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setHasSession(!!s));
    supabase.auth.getSession().then(({ data }) => setHasSession(!!data.session));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (hasSession) return <PostAuthRedirect />;

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
        nav("/onboarding");
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      nav(await resolvePostAuthPath());
    } catch (err: any) {
      toast.error(formatAuthError(err.message || "Authentication failed"));
    } finally {
      setBusy(false);
    }
  };

  const applyDemoCredentials = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setRole("driver");
    toast.message("Demo credentials applied", {
      description: "Switch to Sign In, then continue.",
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
    nav("/dashboard");
  };

  const openInvestorPreview = () => {
    enterDemoWorkspace();
    nav("/pitch");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#010508] flex flex-col">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-90" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-35" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, hsl(180 100% 50%) 0px, transparent 1px, transparent 4px)",
        }}
      />
      <div className="pointer-events-none absolute -top-48 -left-40 h-[32rem] w-[32rem] rounded-full bg-cyan-500/25 blur-[120px] animate-float-slow" />
      <div
        className="pointer-events-none absolute top-1/4 -right-32 h-96 w-96 rounded-full bg-emerald-400/20 blur-[100px] animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[28rem] w-[28rem] rounded-full bg-cyan-400/12 blur-[140px] animate-pulse-soft" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-scan-line opacity-40" />

      <div className="relative z-10 mx-auto w-full max-w-md flex-1 flex flex-col justify-center px-5 sm:px-6 py-8 sm:py-12">
        {isLocalDevHost() && (
          <a
            href={workerAuthUrl}
            className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/[0.07] px-4 py-2.5 text-xs font-semibold text-cyan-300 backdrop-blur-md hover:bg-cyan-500/12 hover:border-cyan-400/45 transition-all"
          >
            <Globe className="h-3.5 w-3.5" />
            Open live app on app.bharatgig.live
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
        )}

        {/* Auth card — glassmorphism shell */}
        <div className="relative animate-scale-in">
          <div className="absolute -inset-[1px] rounded-[1.75rem] bg-gradient-to-br from-cyan-400/40 via-cyan-500/10 to-emerald-400/35 opacity-80 blur-sm" />
          <div className="absolute -inset-px rounded-[1.75rem] bg-gradient-to-br from-cyan-400/25 via-transparent to-emerald-400/20" />

          <div
            className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] shadow-[0_40px_120px_rgba(0,0,0,0.8),0_0_100px_rgba(0,217,255,0.06),inset_0_1px_0_rgba(255,255,255,0.06)]"
            style={{
              background:
                "linear-gradient(165deg, rgba(3,12,22,0.82) 0%, rgba(2,8,14,0.68) 45%, rgba(4,16,12,0.74) 100%)",
              backdropFilter: "blur(40px)",
            }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(0,217,255,0.14),transparent_50%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_100%,rgba(57,255,20,0.08),transparent_45%)]" />
            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />

            <CyberCorner className="left-4 top-4 border-l-2 border-t-2" />
            <CyberCorner className="right-4 top-4 border-r-2 border-t-2" />
            <CyberCorner className="bottom-4 left-4 border-b-2 border-l-2" />
            <CyberCorner className="bottom-4 right-4 border-b-2 border-r-2 border-emerald-400/40" />

            <div className="relative p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative animate-float" style={{ animationDuration: "5s" }}>
                    <div className="absolute -inset-3 rounded-2xl bg-cyan-400/20 blur-xl animate-pulse-soft" />
                    <div className="relative rounded-2xl border border-cyan-400/30 bg-black/50 p-1.5 shadow-[0_0_40px_rgba(0,217,255,0.15)] backdrop-blur-sm">
                      <Logo size={64} />
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-1 mb-3">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-cyan-300/80">
                    Secure Terminal
                  </span>
                </div>

                <h1 className="text-3xl sm:text-[2.15rem] font-extrabold tracking-tight leading-none">
                  <span className="text-gradient-neon">GigAI Bharat</span>
                </h1>
                <p className="mt-2.5 text-sm sm:text-base font-semibold text-foreground/85">
                  India&apos;s Worker-Owned{" "}
                  <span className="text-emerald-400/90">Mobility OS</span>
                </p>
                <p className="font-kannada text-xs sm:text-sm text-muted-foreground mt-1">
                  ನಿಮ್ಮ ದುಡಿಮೆ ಈಗ AI ಜೊತೆ.
                </p>
              </div>

              {/* Value strip */}
              <div className="flex flex-wrap justify-center gap-1.5">
                {VALUE_PILLARS.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1 rounded-full border border-white/[0.06] bg-black/30 px-2 py-1 text-[9px] font-semibold text-foreground/75 backdrop-blur-sm"
                  >
                    <Icon className="h-3 w-3 text-emerald-400/90" />
                    {label}
                  </span>
                ))}
              </div>

              {/* Demo credentials — terminal panel */}
              <div className="relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-black/40 backdrop-blur-md">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,217,255,0.06),rgba(57,255,20,0.04))]" />
                <div className="relative border-b border-white/[0.06] px-3.5 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-300/70">
                      Demo Access
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-emerald-400/60">sandbox://auth</span>
                </div>
                <div className="relative p-3.5 space-y-2 font-mono text-left">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 space-y-1">
                      <p className="text-[10px] text-cyan-400/50">$ email</p>
                      <p className="text-xs text-cyan-100 truncate">{DEMO_CREDENTIALS.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={copyDemoCredentials}
                      className="shrink-0 rounded-lg border border-white/10 bg-white/[0.04] p-2 text-muted-foreground hover:text-cyan-300 hover:border-cyan-400/35 transition-colors"
                      aria-label="Copy demo credentials"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div>
                    <p className="text-[10px] text-emerald-400/50">$ password</p>
                    <p className="text-xs text-emerald-300">{DEMO_CREDENTIALS.password}</p>
                  </div>
                  <button
                    type="button"
                    onClick={applyDemoCredentials}
                    className="mt-1 w-full rounded-lg border border-cyan-400/25 bg-cyan-400/[0.08] py-2 text-[11px] font-semibold text-cyan-200 hover:bg-cyan-400/15 hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(0,217,255,0.12)] transition-all"
                  >
                    Auto-fill credentials
                  </button>
                </div>
              </div>

              <form onSubmit={submit} className="space-y-4">
                {/* Sign in / Create account */}
                <div>
                  <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-black/40 border border-white/[0.06]">
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
                        className={`h-10 rounded-lg text-xs font-semibold transition-all duration-300 ${
                          authMode === id
                            ? "bg-gradient-neon text-primary-foreground shadow-[0_0_20px_rgba(0,217,255,0.25)]"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-center text-[10px] text-muted-foreground leading-relaxed">
                    {authMode === "signup"
                      ? "New worker? Create an account, then set up your vehicle on onboarding."
                      : "Already registered? Sign in to your workspace."}
                  </p>
                </div>

                {/* Role selector — signup only */}
                {authMode === "signup" && (
                <div>
                  <p className="mb-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground text-center">
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

                {/* Email */}
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400/45 group-focus-within:text-cyan-300 transition-colors" />
                  <input
                    type="email"
                    required
                    placeholder="Work email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input auth-input-with-icon"
                  />
                </div>

                {/* Password */}
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400/45 group-focus-within:text-cyan-300 transition-colors" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Password (min 6)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input auth-input-with-icon"
                  />
                </div>

                {/* Enter Workspace */}
                <button
                  type="submit"
                  disabled={busy}
                  className="group relative w-full h-12 rounded-xl bg-gradient-neon text-primary-foreground font-bold flex items-center justify-center gap-2 overflow-hidden disabled:opacity-60 transition-transform active:scale-[0.98] shadow-[0_0_40px_rgba(0,217,255,0.3),0_0_20px_rgba(57,255,20,0.15)]"
                >
                  <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,hsl(0_0%_100%/0.28)_50%,transparent_70%)] bg-[length:200%_100%] animate-shimmer" />
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin relative" />
                  ) : (
                    <>
                      <Zap className="h-4 w-4 relative text-primary-foreground/90" />
                      <span className="relative">
                        {authMode === "signup" ? "Create Account" : "Sign In"}
                      </span>
                      <ArrowRight className="h-4 w-4 relative transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo shortcuts — always visible on auth card */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent" />
                <span className="text-[9px] font-mono text-muted-foreground tracking-[0.28em]">
                  SKIP LOGIN
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-400/35 to-transparent" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={openDemoDriver}
                  className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-emerald-400/40 bg-emerald-400/[0.08] px-4 py-3.5 text-sm font-semibold text-emerald-100 hover:bg-emerald-400/14 hover:border-emerald-400/60 hover:shadow-[0_0_32px_rgba(57,255,20,0.18)] transition-all active:scale-[0.98]"
                >
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(57,255,20,0.12),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <UserCircle className="h-4 w-4 text-emerald-400 relative group-hover:scale-110 transition-transform" />
                  <span className="relative">Demo Driver</span>
                </button>
                <button
                  type="button"
                  onClick={openInvestorPreview}
                  className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-cyan-400/40 bg-cyan-400/[0.08] px-4 py-3.5 text-sm font-semibold text-cyan-100 hover:bg-cyan-400/14 hover:border-cyan-400/60 hover:shadow-[0_0_32px_rgba(0,217,255,0.18)] transition-all active:scale-[0.98]"
                >
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,217,255,0.12),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Presentation className="h-4 w-4 text-cyan-400 relative group-hover:scale-110 transition-transform" />
                  <span className="relative">Investor Preview</span>
                </button>
              </div>

              <p className="text-[10px] text-center text-muted-foreground/80 leading-relaxed font-mono tracking-wide">
                worker-owned · platform-agnostic · bengaluru-first
              </p>
            </div>
          </div>
        </div>

        <footer className="text-center mt-6 space-y-3 animate-fade-in">
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
          <p className="text-[10px] font-mono-tech tracking-[0.3em] text-muted-foreground">
            POWERED BY{" "}
            <span className="text-gradient-neon font-bold tracking-[0.2em]">GIGAI BHARAT</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Auth;
