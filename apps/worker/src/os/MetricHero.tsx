import { useCountUp } from "@/hooks/useCountUp";
import { ArrowUpRight } from "lucide-react";
import { HudLabel } from "./OsCard";

export function MetricHero({
  label,
  value,
  suffix,
  delta,
  deltaLabel,
  sub,
}: {
  label: string;
  value: number;
  suffix?: string;
  delta?: number | null;
  deltaLabel?: string;
  sub?: string;
}) {
  const animated = useCountUp(Math.round(value), 1400);
  return (
    <div className="relative overflow-hidden">
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-secondary/25 blur-3xl" />
      <HudLabel className="text-secondary">{label}</HudLabel>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-5xl font-extrabold tabular-nums tracking-tight text-gradient-neon">
          ₹{Math.round(animated)}
          {suffix && <span className="text-lg text-muted-foreground">{suffix}</span>}
        </span>
        {delta != null && delta > 0 && (
          <span className="mb-2 flex items-center text-xs font-semibold text-secondary">
            <ArrowUpRight className="h-3 w-3" />
            {deltaLabel ?? `+${delta}%`}
          </span>
        )}
      </div>
      {sub && <p className="mt-2 text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}
