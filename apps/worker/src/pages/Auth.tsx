import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { authCallbackUrl, signInWithGoogle } from "@/lib/auth";
import { PostAuthRedirect } from "@/components/PostAuthRedirect";
import { resolvePostAuthPath } from "@/lib/worker-profile";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";

const Auth = () => {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
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
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: authCallbackUrl(),
            data: { name: name || "Ravi" },
          },
        });
        if (error) throw error;
        toast.success("Welcome to GigAI Bharat", { description: "Setting up your ledger..." });
        nav("/onboarding");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        nav(await resolvePostAuthPath());
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch {
      toast.error("Google sign-in failed");
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-hero grid-bg flex flex-col">
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent/25 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-md flex-1 flex flex-col px-6 py-10">
        <div className="flex flex-col items-center text-center mb-6 animate-fade-in">
          <Logo size={56} />
          <h1 className="mt-3 text-3xl font-extrabold text-gradient-neon leading-none">GigAI Bharat</h1>
          <p className="font-kannada text-sm text-muted-foreground mt-1">ನಿಮ್ಮ ದುಡಿಮೆ ಈಗ AI ಜೊತೆ.</p>
        </div>

        <div className="glass-card p-5 animate-scale-in">
          <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-muted/40 mb-4">
            {(["signup", "signin"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`h-9 rounded-xl text-sm font-semibold transition ${mode === m ? "bg-primary text-primary-foreground shadow-[0_0_18px_hsl(var(--primary)/0.5)]" : "text-muted-foreground"}`}
              >
                {m === "signup" ? "Create Account" : "Sign In"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-background/60 border border-border focus:border-primary focus:outline-none text-sm"
              />
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-background/60 border border-border focus:border-primary focus:outline-none text-sm"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Password (min 6)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-background/60 border border-border focus:border-primary focus:outline-none text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="relative w-full h-12 rounded-xl bg-gradient-neon text-primary-foreground font-bold flex items-center justify-center gap-2 overflow-hidden disabled:opacity-60"
            >
              <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,hsl(0_0%_100%/0.3)_50%,transparent_70%)] bg-[length:200%_100%] animate-shimmer" />
              {busy ? <Loader2 className="h-4 w-4 animate-spin relative" /> : (
                <>
                  <span className="relative">{mode === "signup" ? "Create Account" : "Sign In"}</span>
                  <ArrowRight className="h-4 w-4 relative" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] font-mono-tech text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button
            onClick={google}
            disabled={busy}
            className="w-full h-12 rounded-xl bg-background/80 border border-border hover:border-primary/60 flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-60"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <p className="text-[10px] text-center text-muted-foreground mt-4">
            By continuing you agree to GigAI's transparent earnings policy.
          </p>
        </div>

        <p className="text-center text-[10px] font-mono-tech tracking-[0.25em] text-muted-foreground mt-6">
          POWERED BY <span className="text-gradient-neon font-bold">GIGAI BHARAT</span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
