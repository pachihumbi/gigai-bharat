import { TrendingUp, Zap } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { formatInr } from "@/lib/gigpay-utils";

type TodayEarningsCardProps = {
  todayAmount: number;
  weeklyAmount: number;
  weeklyGrowthPct: number;
  tripCount?: number;
};

export function TodayEarningsCard({
  todayAmount,
  weeklyAmount,
  weeklyGrowthPct,
  tripCount = 0,
}: TodayEarningsCardProps) {
  const animatedToday = useCountUp(todayAmount, 1000);
  const animatedWeek = useCountUp(weeklyAmount, 1200);
  const animatedGrowth = useCountUp(weeklyGrowthPct, 900, 0);

  return (
    <div className="grid grid-cols-2 gap-3 animate-fade-in">
      <div className="fintech-card relative overflow-hidden p-4 fintech-glow-cyan">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,217,255,0.14),transparent_65%)]" />
        <div className="relative">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-cyan-300/90">Today&apos;s earnings</p>
          <p className="mt-2 text-2xl sm:text-[1.65rem] font-extrabold tabular-nums text-bright leading-none">
            {formatInr(Math.round(animatedToday))}
          </p>
          <p className="mt-2 text-[11px] text-foreground/75">
            {tripCount > 0 ? `${tripCount} trips · live ledger` : "T+0 settlement ready"}
          </p>
          <Zap className="absolute top-0 right-0 h-4 w-4 text-cyan-400" />
        </div>
      </div>

      <div className="fintech-card relative overflow-hidden p-4 fintech-glow-green">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(57,255,20,0.12),transparent_65%)]" />
        <div className="relative">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-emerald-300/90">This week</p>
          <p className="mt-2 text-2xl sm:text-[1.65rem] font-extrabold tabular-nums text-emerald-200 leading-none">
            {formatInr(Math.round(animatedWeek))}
          </p>
          <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
            <TrendingUp className="h-3 w-3" />+{animatedGrowth.toFixed(1)}% growth
          </p>
        </div>
      </div>
    </div>
  );
}
