import { toast } from "sonner";
import { ArrowDownToLine, Loader2 } from "lucide-react";
import { useState } from "react";
import { formatInr } from "@/lib/gigpay-utils";

type WithdrawButtonProps = {
  balance: number;
  onWithdraw?: (amount: number) => Promise<void>;
  isDemo?: boolean;
};

export function WithdrawButton({ balance, onWithdraw, isDemo }: WithdrawButtonProps) {
  const [busy, setBusy] = useState(false);
  const withdrawAmount = Math.min(balance, Math.max(Math.floor(balance * 0.5), 500));

  const handleWithdraw = async () => {
    if (balance < 100) {
      toast.error("Minimum ₹100 required to withdraw");
      return;
    }
    setBusy(true);
    try {
      if (onWithdraw) {
        await onWithdraw(withdrawAmount);
      } else {
        await new Promise((r) => setTimeout(r, 900));
        toast.success("Withdrawal initiated", {
          description: `${formatInr(withdrawAmount)} → HDFC ****4821 · IMPS 30 sec`,
        });
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Withdrawal failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      disabled={busy || balance < 100}
      onClick={handleWithdraw}
      className="group relative w-full overflow-hidden rounded-2xl border border-emerald-400/35 bg-gradient-to-r from-emerald-500/15 to-cyan-500/10 px-4 py-4 min-h-[3.5rem] flex items-center justify-center gap-2.5 font-bold text-sm sm:text-base text-emerald-100 transition-all active:scale-[0.98] disabled:opacity-50 animate-fade-in hover:border-emerald-400/55 hover:shadow-[0_0_32px_rgba(57,255,20,0.15)]"
    >
      <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,hsl(0_0%_100%/0.12)_50%,transparent_70%)] bg-[length:200%_100%] animate-shimmer pointer-events-none" />
      {busy ? (
        <Loader2 className="h-5 w-5 animate-spin relative" />
      ) : (
        <>
          <ArrowDownToLine className="h-5 w-5 text-emerald-400 relative group-hover:translate-y-0.5 transition-transform" />
          <span className="relative">
            Withdraw {formatInr(withdrawAmount)}
            {isDemo ? " · Demo" : ""}
          </span>
        </>
      )}
    </button>
  );
}
