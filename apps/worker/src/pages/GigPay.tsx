import { AppShell } from "@/components/AppShell";
import { useBills, billsStore } from "@/lib/walletStore";
import { useLedger } from "@/hooks/useLedger";
import { useCountUp } from "@/hooks/useCountUp";
import { Award, CheckCircle2, FileBadge, Loader2, Sparkles, Wallet } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { walletRpc, WalletAuthError } from "@/lib/walletAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const CreditDial = ({ score }: { score: number }) => {
  const max = 850;
  const min = 300;
  const pct = Math.max(0, Math.min(1, (score - min) / (max - min)));
  const r = 64;
  const c = 2 * Math.PI * r;
  const offset = c - pct * c;
  const label = score >= 750 ? "Excellent" : score >= 650 ? "Good" : score >= 500 ? "Fair" : "Building";
  const kn = score >= 750 ? "ಅತ್ಯುತ್ತಮ" : score >= 650 ? "ಉತ್ತಮ" : "ಸಾಧಾರಣ";
  return (
    <div className="relative w-44 h-44">
      <div className="absolute inset-2 rounded-full bg-secondary/10 blur-2xl animate-pulse-glow pointer-events-none" />
      <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
        <defs>
          <linearGradient id="dialGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--secondary))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
        <circle
          cx="80" cy="80" r={r} fill="none" stroke="url(#dialGrad)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ filter: "drop-shadow(0 0 10px hsl(var(--secondary)))", transition: "stroke-dashoffset 1.2s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-mono-tech tracking-widest text-muted-foreground">GIG CREDIT</span>
        <span className="text-5xl font-extrabold text-gradient-neon tabular-nums">{score}</span>
        <span className="text-xs font-semibold text-secondary">{label}</span>
        <span className="text-[10px] font-kannada text-muted-foreground">{kn}</span>
      </div>
    </div>
  );
};

const GigPay = () => {
  const { worker, wallet, earnings, loading, reload } = useLedger();
  const { bills } = useBills();
  const [busy, setBusy] = useState<string | null>(null);

  const balance = Number(wallet?.wallet_balance || 0);
  const score = wallet?.gig_credit_score || 300;
  const animated = useCountUp(balance, 1200);

  // Skill passport stats from real earnings
  const monthTotal = earnings.reduce((s, r) => s + Number(r.amount_earned), 0);
  const dayCount = new Set(earnings.map((r) => r.date)).size || 1;
  const avgDay = Math.round(monthTotal / dayCount);
  const platforms = Array.from(new Set(earnings.map((r) => r.source_platform)));

  const pay = async (bill: typeof bills[number]) => {
    if (!worker || !wallet || bill.paid) return;
    if (balance < bill.amount) { toast.error("Insufficient balance"); return; }
    setBusy(bill.id);
    try {
      await walletRpc.decrementBalance(worker.id, bill.amount);
      await walletRpc.incrementScore(worker.id, 5);
      billsStore.markPaid(bill.id);
      await reload();
      toast.success(`${bill.label} paid`, { description: `-₹${bill.amount} • Credit +5` });
    } catch (e) {
      const msg = e instanceof WalletAuthError ? `${e.status} • ${e.message}` : (e as Error).message;
      toast.error(msg);
    } finally {
      setBusy(null);
    }
  };

  const acceptLoan = async () => {
    if (!worker || !wallet) return;
    setBusy("loan");
    try {
      await walletRpc.acceptLoan(worker.id, 5000);
      await reload();
      toast.success("₹5,000 credited to GigPay wallet");
    } catch (e) {
      const msg = e instanceof WalletAuthError ? `${e.status} • ${e.message}` : (e as Error).message;
      toast.error(msg);
    } finally {
      setBusy(null);
    }
  };

  if (loading || !wallet) {
    return (
      <AppShell title="GigPay" kn="ನಿಮ್ಮ ಹಣಕಾಸಿನ ಗುರುತು">
        <Skeleton className="h-28 w-full rounded-3xl mb-4" />
        <Skeleton className="h-52 w-full rounded-3xl mb-4" />
        <Skeleton className="h-40 w-full rounded-3xl" />
      </AppShell>
    );
  }

  const hasLoan = Number(wallet.active_loan_amount) > 0;

  return (
    <AppShell title="GigPay" kn="ನಿಮ್ಮ ಹಣಕಾಸಿನ ಗುರುತು">
      {/* Wallet hero */}
      <div className="relative glass-card overflow-hidden p-5 mb-4 animate-scale-in" style={{ boxShadow: "0 0 0 1px hsl(var(--secondary)/0.4), 0 0 30px hsl(var(--secondary)/0.25)" }}>
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-secondary/30 rounded-full blur-3xl" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-secondary font-mono-tech">GigPay Wallet</p>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-4xl font-extrabold tracking-tight text-gradient-neon tabular-nums">
                ₹{Math.round(animated).toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-[11px] font-kannada text-muted-foreground mt-1">ಶೂನ್ಯ ಕಮಿಷನ್ • ತಕ್ಷಣದ ಪಾವತಿ</p>
          </div>
          <Wallet className="h-6 w-6 text-secondary" />
        </div>
      </div>

      {/* Credit Score */}
      <div className="glass-card p-5 mb-4 flex items-center gap-4 animate-fade-in">
        <CreditDial score={score} />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">AI-verified across {platforms.length || 4} platforms</p>
          <p className="text-sm font-semibold mt-1">{score >= 700 ? "You qualify for instant credit" : "Keep driving to unlock credit"}</p>
          <p className="text-[11px] font-kannada text-muted-foreground mt-1">ತಕ್ಷಣ ಸಾಲಕ್ಕೆ ಅರ್ಹರು</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/15 text-secondary">Top 8%</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary">{dayCount} days</span>
          </div>
        </div>
      </div>

      {/* Skill Passport */}
      <div className="glass-card p-4 mb-4 animate-fade-in">
        <div className="flex items-center gap-2 mb-3">
          <FileBadge className="h-4 w-4 text-primary" />
          <p className="text-[10px] font-mono-tech uppercase tracking-widest text-primary">Skill Passport • ಡಿಜಿಟಲ್ ಸ್ಯಾಲರಿ ಸ್ಲಿಪ್</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-[10px] text-muted-foreground">Last 30d</p>
            <p className="text-lg font-bold text-secondary tabular-nums">₹{Math.round(monthTotal).toLocaleString("en-IN")}</p>
          </div>
          <div className="border-x border-border/60">
            <p className="text-[10px] text-muted-foreground">Avg / Day</p>
            <p className="text-lg font-bold tabular-nums">₹{avgDay}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Platforms</p>
            <p className="text-lg font-bold text-primary tabular-nums">{platforms.length}</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {(platforms.length ? platforms : ["Swiggy", "Rapido", "Uber", "Zomato"]).slice(0, 4).map((p) => (
            <div key={p} className="text-[10px] text-center py-1.5 rounded-lg bg-muted/40 border border-border/60">{p}</div>
          ))}
        </div>
      </div>

      {/* Micro-loan */}
      <div className="relative glass-card overflow-hidden p-4 mb-4 animate-fade-in" style={{ background: "linear-gradient(135deg, hsl(var(--accent)/0.15), hsl(var(--secondary)/0.10))" }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 blur-3xl rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,hsl(0_0%_100%/0.06)_50%,transparent_70%)] bg-[length:200%_100%] animate-shimmer pointer-events-none" />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-saffron grid place-items-center glow-saffron">
            <Sparkles className="h-5 w-5 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-mono-tech uppercase tracking-widest text-accent">Unlocked Offer</p>
            <p className="font-bold text-lg leading-tight">₹5,000 Instant Advance</p>
            <p className="text-[11px] text-muted-foreground">0% interest for 7 days • ತ್ವರಿತ ಸಾಲ</p>
          </div>
          <button
            disabled={hasLoan || busy === "loan"}
            onClick={acceptLoan}
            className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-bold disabled:opacity-50 active:scale-95 transition flex items-center gap-1.5"
          >
            {busy === "loan" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : hasLoan ? "Accepted" : "Accept"}
          </button>
        </div>
      </div>

      {/* Smart Bills */}
      <div className="glass-card p-4 mb-4 animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-secondary" />
            <p className="text-sm font-semibold">Smart Bills</p>
          </div>
          <p className="text-[10px] font-kannada text-muted-foreground">ಸ್ಮಾರ್ಟ್ ಬಿಲ್‌ಗಳು</p>
        </div>
        <div className="space-y-2">
          {bills.map((b) => (
            <div key={b.id} className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 border border-border/60">
              <div className="w-9 h-9 rounded-xl bg-background grid place-items-center text-lg">{b.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight">{b.label}</p>
                <p className="text-[11px] font-kannada text-muted-foreground">{b.kn}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold tabular-nums">₹{b.amount}</p>
                {b.paid ? (
                  <span className="flex items-center gap-1 text-[10px] text-secondary font-semibold justify-end">
                    <CheckCircle2 className="h-3 w-3" /> Paid
                  </span>
                ) : (
                  <button
                    disabled={busy === b.id}
                    onClick={() => pay(b)}
                    className="text-[10px] font-bold text-secondary-foreground bg-secondary px-2 py-1 rounded-md mt-0.5 active:scale-95 transition disabled:opacity-50 inline-flex items-center gap-1"
                  >
                    {busy === b.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Pay UPI"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] font-mono-tech tracking-[0.25em] text-muted-foreground mt-6">
        POWERED BY <span className="text-gradient-neon font-bold">GIGAI BHARAT</span>
      </p>
    </AppShell>
  );
};

export default GigPay;
