import { AppShell } from "@/components/AppShell";
import {
  TodayEarningsCard,
  TransactionHistory,
  UpiActionGrid,
  WalletBalanceCard,
  WeeklyEarningsChart,
  WithdrawButton,
} from "@/components/gigpay";
import { useBills, billsStore } from "@/lib/walletStore";
import { useLedger } from "@/hooks/useLedger";
import { DEMO_TRANSACTIONS, DEMO_WEEKLY_CHART } from "@/lib/gigpay-demo";
import {
  computeTodayEarnings,
  computeWeeklyEarnings,
  earningsToWeeklyChart,
  mergeTransactions,
} from "@/lib/gigpay-utils";
import { Award, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { walletRpc, WalletAuthError } from "@/lib/walletAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useState } from "react";

const GigPay = () => {
  const { worker, wallet, earnings, loading, reload, isDemo, todayEarnings, tripsToday } =
    useLedger();
  const { bills } = useBills();
  const [busy, setBusy] = useState<string | null>(null);

  const balance = Number(wallet?.wallet_balance || 0);
  const score = wallet?.gig_credit_score || 300;

  const todayAmount = todayEarnings || computeTodayEarnings(earnings);
  const weeklyAmount = computeWeeklyEarnings(earnings);

  const chartData = useMemo(() => {
    const live = earningsToWeeklyChart(earnings);
    const hasData = live.some((d) => d.total > 0);
    if (hasData) return live;
    return DEMO_WEEKLY_CHART.map((d) => ({ ...d }));
  }, [earnings]);

  const transactions = useMemo(
    () => mergeTransactions(DEMO_TRANSACTIONS, earnings),
    [earnings],
  );

  const pay = async (bill: (typeof bills)[number]) => {
    if (!wallet || bill.paid) return;
    if (balance < bill.amount) {
      toast.error("Insufficient balance");
      return;
    }
    setBusy(bill.id);
    try {
      if (isDemo || !worker) {
        billsStore.markPaid(bill.id);
        toast.success(`${bill.label} paid (demo)`, { description: `-₹${bill.amount}` });
        return;
      }
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
    if (!wallet) return;
    setBusy("loan");
    try {
      if (isDemo || !worker) {
        toast.success("₹5,000 credited to GigPay wallet (demo)");
        return;
      }
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

  const handleWithdraw = async (amount: number) => {
    if (isDemo || !worker) {
      toast.success("Withdrawal initiated (demo)", {
        description: `₹${amount.toLocaleString("en-IN")} → HDFC ****4821 · IMPS`,
      });
      return;
    }
    await walletRpc.decrementBalance(worker.id, amount);
    await reload();
    toast.success("Withdrawal successful", {
      description: `₹${amount.toLocaleString("en-IN")} sent via IMPS`,
    });
  };

  if (loading || !wallet) {
    return (
      <AppShell title="GigPay" kn="ನಿಮ್ಮ ಹಣಕಾಸಿನ ಗುರುತು">
        <Skeleton className="h-44 w-full rounded-3xl mb-4" />
        <Skeleton className="h-24 w-full rounded-2xl mb-4" />
        <Skeleton className="h-52 w-full rounded-3xl mb-4" />
        <Skeleton className="h-40 w-full rounded-3xl" />
      </AppShell>
    );
  }

  const hasLoan = Number(wallet.active_loan_amount) > 0;

  return (
    <AppShell title="GigPay" kn="ನಿಮ್ಮ ಹಣಕಾಸಿನ ಗುರುತು">
      <p className="text-xs text-muted-foreground -mt-2 mb-4 leading-relaxed">
        Worker-owned wallet · Zero platform commission · Built for India&apos;s gig workforce
      </p>

      <div className="space-y-4 sm:space-y-5">
        <WalletBalanceCard
          balance={balance}
          creditScore={score}
          workerName={worker?.name ?? "Gig Worker"}
          isDemo={isDemo}
        />

        <TodayEarningsCard
          todayAmount={todayAmount || (isDemo ? 2850 : 0)}
          weeklyAmount={weeklyAmount || (isDemo ? 17200 : 0)}
          tripCount={tripsToday}
        />

        <UpiActionGrid />

        <WithdrawButton balance={balance} onWithdraw={handleWithdraw} isDemo={isDemo} />

        <WeeklyEarningsChart data={chartData} />

        <TransactionHistory transactions={transactions} />

        {/* Micro-loan */}
        <div
          className="relative glass-card overflow-hidden p-4 animate-fade-in"
          style={{
            background: "linear-gradient(135deg, hsl(var(--accent)/0.15), hsl(var(--secondary)/0.10))",
          }}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,hsl(0_0%_100%/0.06)_50%,transparent_70%)] bg-[length:200%_100%] animate-shimmer pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-saffron grid place-items-center glow-saffron shrink-0">
              <Sparkles className="h-5 w-5 text-accent-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-mono-tech uppercase tracking-widest text-accent">
                Gig Credit Advance
              </p>
              <p className="font-bold text-lg leading-tight">₹5,000 Instant Advance</p>
              <p className="text-[11px] text-muted-foreground">0% interest for 7 days · ತ್ವರಿತ ಸಾಲ</p>
            </div>
            <button
              disabled={hasLoan || busy === "loan"}
              onClick={acceptLoan}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-bold disabled:opacity-50 active:scale-95 transition flex items-center justify-center gap-1.5 min-h-[2.75rem]"
            >
              {busy === "loan" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : hasLoan ? "Accepted" : "Accept"}
            </button>
          </div>
        </div>

        {/* Smart Bills */}
        <div id="gigpay-smart-bills" className="glass-card p-4 scroll-mt-24 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-secondary" />
              <p className="text-sm font-semibold">Smart Bills</p>
            </div>
            <p className="text-[10px] font-kannada text-muted-foreground">UPI autopay</p>
          </div>
          <div className="space-y-2">
            {bills.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 border border-border/60"
              >
                <div className="w-10 h-10 rounded-xl bg-background grid place-items-center text-lg shrink-0">
                  {b.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight">{b.label}</p>
                  <p className="text-[11px] font-kannada text-muted-foreground">{b.kn}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold tabular-nums">₹{b.amount}</p>
                  {b.paid ? (
                    <span className="flex items-center gap-1 text-[10px] text-secondary font-semibold justify-end">
                      <CheckCircle2 className="h-3 w-3" /> Paid
                    </span>
                  ) : (
                    <button
                      disabled={busy === b.id}
                      onClick={() => pay(b)}
                      className="text-[10px] font-bold text-secondary-foreground bg-secondary px-2.5 py-1 rounded-md mt-0.5 active:scale-95 transition disabled:opacity-50 inline-flex items-center gap-1"
                    >
                      {busy === b.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Pay UPI"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] font-mono-tech tracking-[0.25em] text-muted-foreground mt-8 pb-2">
        POWERED BY <span className="text-gradient-neon font-bold">GIGAI BHARAT</span>
      </p>
    </AppShell>
  );
};

export default GigPay;
