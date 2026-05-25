import { FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { signInAdmin } from "@/lib/auth";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export function LoginPage() {
  const nav = useNavigate();
  const location = useLocation();
  const { session, loading, isAdmin } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: string } | null)?.from ?? "/";

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#020810]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-saffron" />
      </div>
    );
  }

  if (session && isAdmin) {
    return <Navigate to={from} replace />;
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signInAdmin(email, password);
      nav(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[#020810] px-6">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-xl font-semibold">Admin sign-in</h1>
        <p className="mt-2 text-sm text-slate-400">
          Requires Supabase user with{" "}
          <code className="text-brand-saffron">app_metadata.role = admin</code>.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs text-slate-400">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-brand-saffron/50"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-brand-saffron/50"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-saffron px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
