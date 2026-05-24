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
    <div className="fintech-card relative overflow-hidden p-5 sm:p-6 animate-scale-in fintech-glow-green">
      <div className="pointer-events-none absolute -top-16 -right-12 h-44 w-44 rounded-full bg-emerald-400/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-cyan-400/50 via-emerald-400/60 to-cyan-400/50" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-300">
              GigPay Wallet
            </span>
            {isDemo && (
              <span className="rounded-full border border-cyan-400/40 bg-cyan-400/15 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-cyan-200">
                Live Demo
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-bright truncate">{workerName}</p>
          <p className="text-[11px] font-mono text-cyan-200/80 truncate">{DEMO_UPI_ID}</p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/35 bg-emerald-400/15 shadow-[0_0_24px_rgba(57,255,20,0.2)]">
          <Wallet className="h-5 w-5 text-emerald-300" />
        </div>
      </div>

      <div className="relative mt-6">
        <p className="text-[10px] uppercase tracking-[0.22em] text-foreground/60 font-mono-tech">
          Available balance
        </p>
        <p className="mt-1.5 text-[2.5rem] sm:text-[2.85rem] font-extrabold tabular-nums tracking-tight text-gradient-neon leading-none">
          {formatInr(Math.round(animated))}
        </p>
        <p className="mt-2 font-kannada text-xs text-foreground/70">ಶೂನ್ಯ ಕಮಿಷನ್ · Instant UPI</p>
      </div>

      <div className="relative mt-5 flex items-center justify-between rounded-2xl border border-white/[0.08] bg-black/35 px-4 py-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-cyan-300" />
          <span className="text-xs font-semibold text-bright">Gig Credit Score</span>
        </div>
        <span className="text-xl font-bold tabular-nums text-emerald-300">{creditScore}</span>
      </div>
    </div>
  );
}
