import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { authCallbackUrl } from "@/lib/auth";
import { allowInvestorDemo } from "@/lib/app-config";
import { enterDemoWorkspace, exitDemoWorkspace } from "@/lib/demo-session";
import { PostAuthRedirect } from "@/components/PostAuthRedirect";
import { resolvePostAuthPath } from "@/lib/worker-profile";
import { Logo } from "@/components/Logo";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  Car,
  Package,
  Building2,
  KeyRound,
  LayoutGrid,
} from "lucide-react";

type WorkerRole = "driver" | "delivery" | "fleet";
type AuthMethod = "password" | "otp";

const ROLES: { id: WorkerRole; label: string; sub: string; icon: typeof Car }[] = [
  { id: "driver", label: "Gig Driver", sub: "Ride & mobility", icon: Car },
  { id: "delivery", label: "Delivery", sub: "Last-mile ops", icon: Package },
  { id: "fleet", label: "Fleet Partner", sub: "Multi-vehicle", icon: Building2 },
];

const Auth = () => {
  const nav = useNavigate();
  const [role, setRole] = useState<WorkerRole>("driver");
  const [authMethod, setAuthMethod] = useState<AuthMethod>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setHasSession(!!s));
    supabase.auth.getSession().then(({ data }) => setHasSession(!!data.session));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (hasSession) return <PostAuthRedirect />;

  const switchAuthMethod = (method: AuthMethod) => {
    setAuthMethod(method);
    setOtpSent(false);
    setOtpCode("");
    setPassword("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      exitDemoWorkspace();

      if (authMethod === "password") {
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
        return;
      }

      if (!otpSent) {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
            emailRedirectTo: authCallbackUrl(),
            data: { role },
          },
        });
        if (error) throw error;
        setOtpSent(true);
        toast.success("OTP sent", { description: "Check your email for the 6-digit code." });
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: "email",
      });
      if (error) throw error;
      toast.success("Welcome to GigAI Bharat");
      nav(await resolvePostAuthPath());
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
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
        <div className="auth-glass-card p-6 sm:p-8 animate-scale-in">
          {/* 1. LOGO */}
          <div className="flex justify-center mb-6">
            <div className="animate-float" style={{ animationDuration: "5s" }}>
              <Logo size={72} />
            </div>
          </div>

          {/* 2. Headline */}
          <h1 className="text-center text-3xl sm:text-4xl font-extrabold tracking-tight leading-none">
            <span className="text-gradient-neon">GigAI Bharat</span>
          </h1>

          {/* 3. Subheadline */}
          <p className="mt-3 text-center text-base sm:text-lg font-semibold leading-snug text-foreground/90">
            India&apos;s Worker-Owned{" "}
            <span className="text-gradient-neon">Mobility OS</span>
          </p>
          <p className="font-kannada text-center text-sm text-muted-foreground mt-1.5">
            ನಿಮ್ಮ ದುಡಿಮೆ ಈಗ AI ಜೊತೆ.
          </p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            {/* 4. Role Selector */}
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

            {/* 5. Email Input */}
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

            {/* 6. Password / OTP */}
            <div>
              <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-black/30 border border-white/5 mb-3">
                {(["password", "otp"] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => switchAuthMethod(method)}
                    className={`h-9 rounded-lg text-xs font-semibold transition-all duration-300 ${
                      authMethod === method
                        ? "bg-gradient-neon text-primary-foreground shadow-[0_0_18px_hsl(200_100%_50%/0.4)]"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {method === "password" ? "Password" : "OTP"}
                  </button>
                ))}
              </div>

              {authMethod === "password" ? (
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
              ) : otpSent ? (
                <div className="space-y-2">
                  <p className="text-[11px] text-center text-muted-foreground">
                    Enter the 6-digit code sent to <span className="text-cyan-300">{email}</span>
                  </p>
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                      <InputOTPGroup className="gap-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="h-11 w-10 rounded-lg border-cyan-500/25 bg-black/40 text-foreground first:rounded-lg last:rounded-lg"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={async () => {
                      setOtpSent(false);
                      setOtpCode("");
                      setBusy(true);
                      try {
                        const { error } = await supabase.auth.signInWithOtp({
                          email,
                          options: {
                            shouldCreateUser: true,
                            emailRedirectTo: authCallbackUrl(),
                            data: { role },
                          },
                        });
                        if (error) throw error;
                        setOtpSent(true);
                        toast.success("OTP resent");
                      } catch (err: any) {
                        toast.error(err.message || "Could not resend OTP");
                      } finally {
                        setBusy(false);
                      }
                    }}
                    className="w-full text-[10px] font-mono-tech text-cyan-400/70 hover:text-cyan-300 transition-colors disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </div>
              ) : (
                <div className="relative flex items-center gap-3 rounded-xl border border-cyan-500/15 bg-black/25 px-4 py-3">
                  <KeyRound className="h-4 w-4 text-emerald-400 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We&apos;ll email a one-time code — no password needed.
                  </p>
                </div>
              )}
            </div>

            {/* 7. Enter Workspace Button */}
            <button
              type="submit"
              disabled={busy || (authMethod === "otp" && otpSent && otpCode.length < 6)}
              className="group relative w-full h-12 rounded-xl bg-gradient-neon text-primary-foreground font-bold flex items-center justify-center gap-2 overflow-hidden disabled:opacity-60 transition-transform active:scale-[0.98]"
            >
              <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,hsl(0_0%_100%/0.25)_50%,transparent_70%)] bg-[length:200%_100%] animate-shimmer" />
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin relative" />
              ) : (
                <>
                  <span className="relative">
                    {authMethod === "otp" && !otpSent
                      ? "Send OTP"
                      : authMethod === "otp" && otpSent
                        ? "Verify & Enter Workspace"
                        : "Enter Workspace"}
                  </span>
                  <ArrowRight className="h-4 w-4 relative transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* 8. Demo Access */}
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
            ₹0 commission · 100% worker earnings · India-first
          </p>
        </div>

        <footer className="text-center mt-6 animate-fade-in">
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
