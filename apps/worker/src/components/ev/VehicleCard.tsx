import type { EvVehicle } from "@/lib/ev-demo";
import {
  accentBorder,
  accentGlow,
  accentGradient,
  accentText,
  formatInr,
  formatInrCompact,
  socBarColor,
  socColor,
} from "@/lib/ev-utils";
import { Battery, Car, Clock, MapPin, Sparkles, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type VehicleCardProps = {
  vehicle: EvVehicle;
  selected?: boolean;
  onSelect?: (vehicle: EvVehicle) => void;
};

const iconMap = {
  car: Car,
  suv: Car,
  mpv: Car,
  scooter: Zap,
};

export function VehicleCard({ vehicle, selected, onSelect }: VehicleCardProps) {
  const Icon = iconMap[vehicle.icon];

  return (
    <button
      type="button"
      onClick={() => onSelect?.(vehicle)}
      className={cn(
        "ev-card group relative w-full text-left transition-all duration-300 active:scale-[0.98]",
        selected && accentGlow(vehicle.accent),
        selected && accentBorder(vehicle.accent),
        selected && "border-2",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br opacity-60",
          accentGradient(vehicle.accent),
        )}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative p-4 sm:p-5">
        {/* Image placeholder + badges */}
        <div className="relative mb-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-black/40 aspect-[16/10]">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent",
            )}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={cn(
                "flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-black/50 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110",
                accentBorder(vehicle.accent),
              )}
            >
              <Icon className={cn("h-10 w-10", accentText(vehicle.accent))} strokeWidth={1.25} />
            </div>
          </div>
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {vehicle.aiRecommended && (
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/40 bg-cyan-400/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-200">
                <Sparkles className="h-2.5 w-2.5" /> AI Pick
              </span>
            )}
            {vehicle.aiBadge && (
              <span className="rounded-full border border-white/15 bg-black/50 px-2 py-0.5 text-[9px] font-semibold text-foreground/80">
                {vehicle.aiBadge}
              </span>
            )}
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-foreground/55">{vehicle.brand}</p>
              <p className="text-lg font-bold text-bright leading-tight">{vehicle.name}</p>
            </div>
            <span className={cn("text-2xl font-bold tabular-nums", socColor(vehicle.batteryPct))}>
              {vehicle.batteryPct}%
            </span>
          </div>
        </div>

        {/* Battery bar */}
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between text-[10px] font-mono-tech uppercase tracking-wider text-foreground/55">
            <span className="flex items-center gap-1">
              <Battery className="h-3 w-3" /> Battery
            </span>
            <span>{vehicle.rangeKm} km range</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-black/50 border border-white/[0.06]">
            <div
              className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700", socBarColor(vehicle.batteryPct))}
              style={{ width: `${vehicle.batteryPct}%` }}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {vehicle.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg border border-white/[0.08] bg-black/30 px-2 py-0.5 text-[10px] font-medium text-foreground/70"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Metric icon={Clock} label="Charge time" value={`${vehicle.chargingTimeMin} min`} />
          <Metric icon={TrendingUp} label="Daily earnings" value={formatInrCompact(vehicle.dailyEarnings)} highlight />
          <Metric icon={Zap} label="Fuel savings/mo" value={formatInrCompact(vehicle.monthlyFuelSavings)} />
          <Metric icon={Car} label="EMI estimate" value={formatInrCompact(vehicle.emiEstimate)} />
        </div>

        {/* Best for + charging */}
        <div className="space-y-2 rounded-2xl border border-white/[0.06] bg-black/25 p-3">
          <p className="text-[10px] font-mono uppercase tracking-wider text-foreground/50">Best for</p>
          <p className="text-xs font-semibold text-bright leading-snug">{vehicle.bestFor}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-300/90">
            <MapPin className="h-3 w-3 shrink-0" />
            <span>
              {vehicle.nearbyChargingStations} charging stations nearby · {vehicle.useCase}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-black/20 px-2.5 py-2">
      <div className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-foreground/50">
        <Icon className="h-2.5 w-2.5" />
        {label}
      </div>
      <p className={cn("mt-0.5 text-sm font-bold tabular-nums", highlight ? "text-emerald-300" : "text-bright")}>
        {value}
      </p>
    </div>
  );
}
