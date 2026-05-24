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
  LayoutGrid,
  IndianRupee,
  Wallet,
  Cpu,
  Flag,
  Globe,
  ExternalLink,
} from "lucide-react";

type WorkerRole = "driver" | "delivery" | "fleet";

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
    } catch (err: any) {
      toast.error(formatAuthError(err.message || "Authentication failed"));
    } finally {
      setBusy(false);
    }
  };

  const exploreDemo = () => {
    enterDemoWorkspace();
    nav("/dashboard");
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

        <div className="auth-glass-card relative p-6 sm:p-8 animate-scale-in overflow-hidden">
          <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-b from-cyan-400/20 via-transparent to-emerald-400/15" />
          <div className="relative">
            <div className="flex justify-center mb-6">
              <div className="animate-float" style={{ animationDuration: "5s" }}>
                <Logo size={72} />
              </div>
            </div>

            <h1 className="text-center text-3xl sm:text-4xl font-extrabold tracking-tight leading-none">
              <span className="text-gradient-neon">GigAI Bharat</span>
            </h1>

            <p className="mt-3 text-center text-base sm:text-lg font-semibold leading-snug text-foreground/90">
              India&apos;s Worker-Owned{" "}
              <span className="text-gradient-neon">Mobility OS</span>
            </p>
            <p className="font-kannada text-center text-sm text-muted-foreground mt-1.5">
              ನಿಮ್ಮ ದುಡಿಮೆ ಈಗ AI ಜೊತೆ.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2">
              {VALUE_PILLARS.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-lg border border-cyan-500/15 bg-black/30 px-2.5 py-2"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  <span className="text-[10px] font-semibold leading-tight text-foreground/85">{label}</span>
                </div>
              ))}
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4">
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
                      <span className="text-[11px] sm:text-xs font-semibold leading-tight">{label}</span>
                      <span className="text-[9px] text-muted-foreground leading-tight hidden sm:block">{sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400/50" />
                <input
                  type="email"
                  required
                  placeholder="Work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input auth-input-with-icon"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400/50" />
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

              <button
                type="submit"
                disabled={busy}
                className="group relative w-full h-12 rounded-xl bg-gradient-neon text-primary-foreground font-bold flex items-center justify-center gap-2 overflow-hidden disabled:opacity-60 transition-transform active:scale-[0.98]"
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

            {allowInvestorDemo() && (
              <>
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />
                  <span className="text-[10px] font-mono-tech text-muted-foreground tracking-widest">OR</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />
                </div>

                <button
                  type="button"
                  onClick={exploreDemo}
                  className="group w-full h-11 rounded-xl border border-emerald-400/35 bg-emerald-400/5 hover:bg-emerald-400/10 hover:border-emerald-400/55 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-300 transition-all duration-300 active:scale-[0.98]"
                >
                  <LayoutGrid className="h-4 w-4 text-emerald-400 transition-transform group-hover:scale-110" />
                  Demo Access
                </button>
              </>
            )}

            <p className="text-[10px] text-center text-muted-foreground mt-5 leading-relaxed">
              Worker-owned · Platform-agnostic · Bengaluru-first
            </p>
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
