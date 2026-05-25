import { AppShell } from "@/components/AppShell";
import {
  TodayEarningsCard,
  TransactionHistory,
  UpiActionGrid,
  WalletBalanceCard,
  WeeklyEarningsChart,
  WithdrawButton,
} from "@/components/gigpay";
import { useSmartBills } from "@/hooks/useSmartBills";
import { useLedger } from "@/hooks/useLedger";
import {
  DEMO_TODAY_EARNINGS,
  DEMO_TRANSACTIONS,
  DEMO_WEEKLY_CHART,
  DEMO_WEEKLY_EARNINGS,
  DEMO_WEEKLY_GROWTH_PCT,
} from "@/lib/gigpay-demo";
import {
  computeTodayEarnings,
  computeWeeklyEarnings,
  earningsToWeeklyChart,
  mergeTransactions,
  workerUpiId,
} from "@/lib/gigpay-utils";
import { DEMO_WALLET, DEMO_WORKER } from "@/lib/demo-data";
import { Award, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { walletRpc, WalletAuthError } from "@/lib/walletAuth";
import { useMemo, useState } from "react";

const GigPay = () => {
  const { worker, wallet, earnings, reload, isDemo, todayEarnings, tripsToday } = useLedger();
  const { bills, reload: reloadBills, markPaidLocal } = useSmartBills(worker?.id, isDemo);
  const [busy, setBusy] = useState<string | null>(null);

  const displayWallet = isDemo ? (wallet ?? DEMO_WALLET) : wallet;
  const displayWorker = isDemo ? (worker ?? DEMO_WORKER) : worker;
  const balance = Number(displayWallet?.wallet_balance ?? 0);
  const score = displayWallet?.gig_credit_score ?? 300;

  const todayAmount = isDemo
    ? todayEarnings || computeTodayEarnings(earnings) || DEMO_TODAY_EARNINGS
    : todayEarnings || computeTodayEarnings(earnings);
  const weeklyAmount = isDemo
    ? computeWeeklyEarnings(earnings) || DEMO_WEEKLY_EARNINGS
    : computeWeeklyEarnings(earnings);

  const chartData = useMemo(() => {
    const live = earningsToWeeklyChart(earnings);
    if (live.some((d) => d.total > 0)) return live;
    if (isDemo) return DEMO_WEEKLY_CHART.map((d) => ({ ...d }));
    return live;
  }, [earnings, isDemo]);

  const transactions = useMemo(
    () => mergeTransactions(DEMO_TRANSACTIONS, earnings, isDemo),
    [earnings, isDemo],
  );

  const pay = async (bill: (typeof bills)[number]) => {
    if (bill.paid) return;
    if (balance < bill.amount) {
      toast.error("Insufficient balance");
      return;
    }
    setBusy(bill.id);
    try {
      if (isDemo || !worker) {
        markPaidLocal(bill.id);
        toast.success(`${bill.label} paid`, { description: `-₹${bill.amount} · UPI` });
        return;
      }
      await walletRpc.paySmartBill(worker.id, bill.id);
      await Promise.all([reload(), reloadBills()]);
      toast.success(`${bill.label} paid`, { description: `-₹${bill.amount} • Credit +5` });
    } catch (e) {
      const msg = e instanceof WalletAuthError ? `${e.status} • ${e.message}` : (e as Error).message;
      toast.error(msg);
    } finally {
      setBusy(null);
    }
  };

  const acceptLoan = async () => {
    setBusy("loan");
    try {
      if (isDemo || !worker) {
        toast.success("₹5,000 credited to GigPay wallet");
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
      toast.success("Withdrawal initiated", {
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

  const hasLoan = Number(displayWallet?.active_loan_amount ?? 0) > 0;

  const upiId = isDemo
    ? "preview@gigpay.bharatgig.live"
    : workerUpiId(displayWorker?.name, displayWorker?.phone_number);

  return (
    <AppShell title="GigPay" kn="ಗಿಗ್‌ಪೇ · Worker wallet super-app">
      <p className="text-xs text-foreground/75 -mt-2 mb-4 leading-relaxed">
        PhonePe-grade UPI · Cred-style credit · ₹0 platform commission
      </p>

      <div className="space-y-4 sm:space-y-5">
        <WalletBalanceCard
          balance={balance}
          creditScore={score}
          workerName={displayWorker?.name ?? "Worker"}
          upiId={upiId}
          isDemo={isDemo}
        />

        <TodayEarningsCard
          todayAmount={todayAmount}
          weeklyAmount={weeklyAmount}
          weeklyGrowthPct={isDemo ? DEMO_WEEKLY_GROWTH_PCT : undefined}
          tripCount={tripsToday}
        />

        <UpiActionGrid />

        <WithdrawButton balance={balance} onWithdraw={handleWithdraw} isDemo={isDemo} />

        <WeeklyEarningsChart data={chartData} />

        <TransactionHistory transactions={transactions} />

        <div
          className="fintech-card relative overflow-hidden p-4 animate-fade-in"
          style={{
            background: "linear-gradient(135deg, hsl(33 100% 50% / 0.12), hsl(150 100% 50% / 0.08))",
          }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,hsl(0_0%_100%/0.08)_50%,transparent_70%)] bg-[length:200%_100%] animate-shimmer pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-saffron grid place-items-center glow-saffron shrink-0">
              <Sparkles className="h-5 w-5 text-accent-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-mono uppercase tracking-widest text-orange-300">Gig Credit Advance</p>
              <p className="font-bold text-lg text-bright leading-tight">₹5,000 Instant Advance</p>
              <p className="text-[11px] text-foreground/65">0% interest · 7 days · ತ್ವರಿತ ಸಾಲ</p>
            </div>
            <button
              disabled={hasLoan || busy === "loan"}
              onClick={acceptLoan}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-emerald-500 text-black text-sm font-bold disabled:opacity-50 active:scale-95 transition flex items-center justify-center gap-1.5 min-h-[2.75rem]"
            >
              {busy === "loan" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : hasLoan ? "Accepted" : "Accept"}
            </button>
          </div>
        </div>

        <div id="gigpay-smart-bills" className="fintech-card p-4 scroll-mt-24 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-400" />
              <p className="text-sm font-semibold text-bright">Smart Bills</p>
            </div>
            <p className="text-[10px] font-kannada text-foreground/60">UPI autopay</p>
          </div>
          <div className="space-y-2">
            {bills.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-black/30 border border-white/[0.06]"
              >
                <div className="w-10 h-10 rounded-xl bg-black/40 grid place-items-center text-lg shrink-0 border border-white/[0.06]">
                  {b.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-bright leading-tight">{b.label}</p>
                  <p className="text-[11px] font-kannada text-foreground/60">{b.kn}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold tabular-nums text-bright">₹{b.amount}</p>
                  {b.paid ? (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold justify-end">
                      <CheckCircle2 className="h-3 w-3" /> Paid
                    </span>
                  ) : (
                    <button
                      disabled={busy === b.id}
                      onClick={() => pay(b)}
                      className="text-[10px] font-bold text-black bg-emerald-400 px-2.5 py-1 rounded-md mt-0.5 active:scale-95 transition disabled:opacity-50 inline-flex items-center gap-1"
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

      <p className="text-center text-[10px] font-mono-tech tracking-[0.25em] text-foreground/45 mt-8 pb-2">
        POWERED BY <span className="text-gradient-neon font-bold">GIGAI BHARAT</span>
      </p>
    </AppShell>
  );
};

export default GigPay;
