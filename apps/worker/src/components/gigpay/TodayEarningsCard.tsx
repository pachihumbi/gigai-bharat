import { TrendingUp, Zap } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { formatInr } from "@/lib/gigpay-utils";

type TodayEarningsCardProps = {
  todayAmount: number;
  weeklyAmount: number;
  tripCount?: number;
};

export function TodayEarningsCard({ todayAmount, weeklyAmount, tripCount = 0 }: TodayEarningsCardProps) {
  const animatedToday = useCountUp(todayAmount, 1000);
  const animatedWeek = useCountUp(weeklyAmount, 1200);

  return (
    <div className="grid grid-cols-2 gap-3 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-black/35 p-4 backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,217,255,0.1),transparent_65%)]" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-cyan-400/75">Today</p>
            <p className="mt-1.5 text-2xl font-extrabold tabular-nums text-foreground">
              {formatInr(Math.round(animatedToday))}
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              {tripCount > 0 ? `${tripCount} trips logged` : "Live from ledger"}
            </p>
          </div>
          <Zap className="h-4 w-4 text-cyan-400 shrink-0" />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-black/35 p-4 backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(57,255,20,0.08),transparent_65%)]" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-400/75">This week</p>
            <p className="mt-1.5 text-2xl font-extrabold tabular-nums text-emerald-300">
              {formatInr(Math.round(animatedWeek))}
            </p>
            <p className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400/80">
              <TrendingUp className="h-3 w-3" />
              +12% vs last week
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
