import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { authCallbackUrl, formatAuthError } from "@/lib/auth";
import { allowInvestorDemo } from "@/lib/app-config";
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
  Sparkles,
} from "lucide-react";

type WorkerRole = "driver" | "delivery" | "fleet";

const DEMO_CREDENTIALS = {
  email: "demo.driver@gigaibharat.in",
  password: "demo123456",
  label: "Demo Driver Account",
} as const;

const VALUE_PILLARS = [
  { icon: IndianRupee, label: "₹0 Platform Commission" },
  { icon: Wallet, label: "100% Worker Earnings" },
  { icon: Cpu, label: "AI Fleet Intelligence" },
  { icon: Flag, label: "India First" },
] as const;

const ROLES: { id: WorkerRole; label: string; sub: string; icon: typeof Car }[] = [
  { id: "driver", label: "Gig Driver", sub: "Ride & mobility", icon: Car },
  { id: "delivery", label: "Delivery", sub: "Last-mile ops", icon: Package },
  { id: "fleet", label: "Fleet Partner", sub: "Multi-vehicle", icon: Building2 },
];

const Auth = () => {
  const nav = useNavigate();
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

      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: authCallbackUrl(),
            data: { role },
          },
        });
        if (signUpError) throw signUpError;
        toast.success("Workspace created", { description: "Setting up your ledger..." });
        nav("/onboarding");
        return;
      }
      nav(await resolvePostAuthPath());
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
    toast.message("Demo credentials applied", { description: "Tap Enter Workspace to continue." });
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
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-90" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, hsl(200 100% 50%) 0px, transparent 1px, transparent 3px)",
        }}
      />
      <div className="pointer-events-none absolute -top-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-cyan-500/20 blur-[100px] animate-float-slow" />
      <div
        className="pointer-events-none absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-emerald-400/15 blur-[90px] animate-float"
        style={{ animationDelay: "1.5s" }}
      />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-cyan-400/10 blur-[120px] animate-pulse-soft" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-scan-line opacity-30" />

      <div className="relative z-10 mx-auto w-full max-w-md flex-1 flex flex-col justify-center px-5 sm:px-6 py-8 sm:py-12">
        {isLocalDevHost() && (
          <a
            href={workerAuthUrl}
            className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-cyan-500/25 bg-cyan-500/5 px-4 py-2.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10 transition-colors"
          >
            <Globe className="h-3.5 w-3.5" />
            Open live app on app.bharatgig.live
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
        )}

        {/* ── Auth card ── */}
        <div
          className="relative animate-scale-in overflow-hidden rounded-3xl border border-cyan-400/20 p-[1px] shadow-[0_0_0_1px_rgba(0,217,255,0.06)_inset,0_32px_100px_rgba(0,0,0,0.75),0_0_80px_rgba(0,217,255,0.08)]"
          style={{
            background:
              "linear-gradient(145deg, rgba(0,217,255,0.18) 0%, rgba(0,0,0,0.15) 40%, rgba(57,255,20,0.08) 100%)",
          }}
        >
          <div
            className="relative rounded-[calc(1.5rem-1px)] p-6 sm:p-8 backdrop-blur-2xl"
            style={{
              background:
                "linear-gradient(160deg, rgba(2,8,16,0.72) 0%, rgba(4,14,24,0.58) 50%, rgba(2,12,10,0.65) 100%)",
            }}
          >
            <div className="pointer-events-none absolute inset-0 rounded-[calc(1.5rem-1px)] bg-[radial-gradient(ellipse_at_top,rgba(0,217,255,0.12),transparent_55%)]" />
            <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative space-y-6">
              {/* Header */}
              <div className="text-center">
                <div className="flex justify-center mb-5">
                  <div
                    className="relative animate-float rounded-2xl p-1"
                    style={{ animationDuration: "5s" }}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/30 to-emerald-400/20 blur-md" />
                    <div className="relative rounded-xl bg-black/40 p-1 ring-1 ring-cyan-400/25">
                      <Logo size={68} />
                    </div>
                  </div>
                </div>

                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-400/70">
                  Worker Command Terminal
                </p>
                <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight leading-none">
                  <span className="text-gradient-neon">GigAI Bharat</span>
                </h1>
                <p className="mt-3 text-base sm:text-lg font-semibold leading-snug text-foreground/90">
                  India&apos;s Worker-Owned{" "}
                  <span className="text-gradient-neon">Mobility OS</span>
                </p>
                <p className="font-kannada text-sm text-muted-foreground mt-1.5">
                  ನಿಮ್ಮ ದುಡಿಮೆ ಈಗ AI ಜೊತೆ.
                </p>
              </div>

              {/* Value pillars */}
              <div className="grid grid-cols-2 gap-2">
                {VALUE_PILLARS.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-xl border border-cyan-500/12 bg-black/35 px-2.5 py-2 ring-1 ring-white/[0.03] transition-colors hover:border-emerald-400/25"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    <span className="text-[10px] font-semibold leading-tight text-foreground/85">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Demo credentials */}
              <div className="rounded-2xl border border-dashed border-cyan-400/25 bg-gradient-to-br from-cyan-500/[0.06] to-emerald-500/[0.04] p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10">
                      <Sparkles className="h-4 w-4 text-cyan-300" />
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-cyan-400/80">
                        Sandbox credentials
                      </p>
                      <p className="mt-1 text-xs font-semibold text-foreground/90 truncate">
                        {DEMO_CREDENTIALS.email}
                      </p>
                      <p className="text-[11px] font-mono text-emerald-300/90">
                        {DEMO_CREDENTIALS.password}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={copyDemoCredentials}
                    className="shrink-0 rounded-lg border border-white/10 bg-black/30 p-2 text-muted-foreground hover:text-cyan-300 hover:border-cyan-400/30 transition-colors"
                    aria-label="Copy demo credentials"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={applyDemoCredentials}
                  className="mt-3 w-full rounded-xl border border-cyan-400/20 bg-cyan-400/5 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-400/10 hover:border-cyan-400/35 transition-all"
                >
                  Auto-fill demo login
                </button>
              </div>

              <form onSubmit={submit} className="space-y-4">
                {/* Role selector */}
                <div>
                  <p className="mb-2.5 text-xs font-medium text-muted-foreground text-center">
                    Select your role
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
                            role === id ? "text-emerald-400" : "text-cyan-400/60"
                          }`}
                        />
                        <span className="text-[11px] sm:text-xs font-semibold leading-tight">
                          {label}
                        </span>
                        <span className="text-[9px] text-muted-foreground leading-tight hidden sm:block">
                          {sub}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400/50 group-focus-within:text-cyan-300 transition-colors" />
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
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400/50 group-focus-within:text-cyan-300 transition-colors" />
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
                  className="group relative w-full h-12 rounded-xl bg-gradient-neon text-primary-foreground font-bold flex items-center justify-center gap-2 overflow-hidden disabled:opacity-60 transition-transform active:scale-[0.98] shadow-[0_0_32px_rgba(0,217,255,0.25)]"
                >
                  <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,hsl(0_0%_100%/0.25)_50%,transparent_70%)] bg-[length:200%_100%] animate-shimmer" />
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin relative" />
                  ) : (
                    <>
                      <span className="relative">Enter Workspace</span>
                      <ArrowRight className="h-4 w-4 relative transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo shortcuts */}
              {allowInvestorDemo() && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                    <span className="text-[10px] font-mono text-muted-foreground tracking-[0.25em]">
                      INSTANT ACCESS
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={openDemoDriver}
                      className="group flex items-center justify-center gap-2 rounded-xl border border-emerald-400/35 bg-emerald-400/[0.07] px-4 py-3 text-sm font-semibold text-emerald-200 hover:bg-emerald-400/12 hover:border-emerald-400/55 hover:shadow-[0_0_24px_rgba(57,255,20,0.12)] transition-all active:scale-[0.98]"
                    >
                      <UserCircle className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                      Demo Driver
                    </button>
                    <button
                      type="button"
                      onClick={openInvestorPreview}
                      className="group flex items-center justify-center gap-2 rounded-xl border border-cyan-400/35 bg-cyan-400/[0.07] px-4 py-3 text-sm font-semibold text-cyan-200 hover:bg-cyan-400/12 hover:border-cyan-400/55 hover:shadow-[0_0_24px_rgba(0,217,255,0.12)] transition-all active:scale-[0.98]"
                    >
                      <Presentation className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                      Investor Preview
                    </button>
                  </div>
                </>
              )}

              <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
                Worker-owned · Platform-agnostic · Bengaluru-first
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
