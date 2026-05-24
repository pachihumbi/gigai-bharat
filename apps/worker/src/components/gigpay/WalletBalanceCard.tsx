import { Wallet, ShieldCheck } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { formatInr } from "@/lib/gigpay-utils";
import { DEMO_UPI_ID } from "@/lib/gigpay-demo";

type WalletBalanceCardProps = {
  balance: number;
  creditScore: number;
  workerName?: string;
  isDemo?: boolean;
};

export function WalletBalanceCard({
  balance,
  creditScore,
  workerName = "Worker",
  isDemo,
}: WalletBalanceCardProps) {
  const animated = useCountUp(balance, 1400);

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-emerald-400/25 p-5 sm:p-6 animate-scale-in"
      style={{
        background:
          "linear-gradient(145deg, rgba(2,12,20,0.95) 0%, rgba(4,20,16,0.88) 55%, rgba(2,16,24,0.92) 100%)",
        boxShadow:
          "0 0 0 1px rgba(57,255,20,0.08) inset, 0 24px 60px rgba(0,0,0,0.45), 0 0 48px rgba(0,217,255,0.12)",
      }}
    >
      <div className="pointer-events-none absolute -top-16 -right-12 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-36 w-36 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-emerald-400/80">
              GigPay Wallet
            </span>
            {isDemo && (
              <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-cyan-300">
                Demo
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">{workerName}</p>
          <p className="text-[10px] font-mono text-cyan-300/70 truncate">{DEMO_UPI_ID}</p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10">
          <Wallet className="h-5 w-5 text-emerald-400" />
        </div>
      </div>

      <div className="relative mt-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono-tech">
          Available balance
        </p>
        <p className="mt-1 text-4xl sm:text-[2.75rem] font-extrabold tabular-nums tracking-tight text-gradient-neon leading-none">
          {formatInr(Math.round(animated))}
        </p>
        <p className="mt-2 font-kannada text-xs text-muted-foreground">
          ಶೂನ್ಯ ಕಮಿಷನ್ · ತಕ್ಷಣ UPI ಪಾವತಿ
        </p>
      </div>

      <div className="relative mt-5 flex items-center justify-between rounded-2xl border border-white/[0.06] bg-black/30 px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-cyan-400" />
          <span className="text-[11px] font-medium text-foreground/85">Gig Credit Score</span>
        </div>
        <span className="text-lg font-bold tabular-nums text-emerald-400">{creditScore}</span>
      </div>
    </div>
  );
}
