import { useMemo, useState } from "react";
import type { EvVehicle } from "@/lib/ev-demo";
import { calculateEvProfit, formatInr, formatInrCompact } from "@/lib/ev-utils";
import { cn } from "@/lib/utils";
import { Calculator, IndianRupee, TrendingUp } from "lucide-react";

type EvProfitCalculatorProps = {
  vehicle: EvVehicle | null;
};

export function EvProfitCalculator({ vehicle }: EvProfitCalculatorProps) {
  const [dailyKm, setDailyKm] = useState(120);
  const [shiftDays, setShiftDays] = useState(26);
  const [petrolCost, setPetrolCost] = useState(6.2);

  const result = useMemo(() => {
    if (!vehicle) return null;
    return calculateEvProfit({
      dailyKm,
      shiftDays,
      petrolCostPerKm: petrolCost,
      evCostPerKm: 1.2,
      dailyEarnings: vehicle.dailyEarnings,
      emiEstimate: vehicle.emiEstimate,
    });
  }, [vehicle, dailyKm, shiftDays, petrolCost]);

  return (
    <div className="ev-card p-4 sm:p-5 animate-fade-in fintech-glow-green">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-5 w-5 text-emerald-400" />
        <div>
          <p className="text-[10px] font-mono-tech uppercase tracking-[0.28em] text-emerald-300/90">
            EV profit calculator
          </p>
          <p className="text-sm font-bold text-bright">
            {vehicle ? `${vehicle.brand} ${vehicle.name}` : "Select a vehicle"}
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-4">
        <SliderControl
          label="Daily km driven"
          value={dailyKm}
          min={40}
          max={250}
          step={5}
          unit="km"
          onChange={setDailyKm}
        />
        <SliderControl
          label="Working days / month"
          value={shiftDays}
          min={20}
          max={30}
          step={1}
          unit="days"
          onChange={setShiftDays}
        />
        <SliderControl
          label="Petrol cost / km"
          value={petrolCost}
          min={4}
          max={9}
          step={0.1}
          unit="₹"
          onChange={setPetrolCost}
        />
      </div>

      {result && (
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { icon: TrendingUp, label: "Monthly earnings", value: formatInrCompact(result.monthlyEarnings), color: "text-emerald-300" },
            { icon: IndianRupee, label: "Fuel savings", value: formatInrCompact(result.monthlyFuelSavings), color: "text-cyan-300" },
            { icon: Calculator, label: "Net profit / mo", value: formatInrCompact(result.netMonthlyProfit), color: result.netMonthlyProfit >= 0 ? "text-emerald-300" : "text-red-400" },
            { icon: TrendingUp, label: "Break-even", value: `${result.breakEvenMonths} mo`, color: "text-orange-300" },
          ].map((m) => (
            <div key={m.label} className="rounded-2xl border border-white/[0.06] bg-black/30 p-3">
              <m.icon className={cn("h-3.5 w-3.5 mb-1", m.color)} />
              <p className="text-[9px] font-mono uppercase text-foreground/50">{m.label}</p>
              <p className={cn("text-base font-bold tabular-nums", m.color)}>{m.value}</p>
            </div>
          ))}
        </div>
      )}

      {result && (
        <p className="mt-3 text-xs text-foreground/70 leading-relaxed">
          Annual fuel savings of{" "}
          <span className="font-bold text-emerald-300">{formatInr(result.annualSavings)}</span> vs petrol at current
          rates. EV operating cost assumed at ₹1.2/km.
        </p>
      )}
    </div>
  );
}

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-foreground/55 mb-1.5">
        <span>{label}</span>
        <span className="text-cyan-200 font-bold">
          {unit === "₹" ? `₹${value.toFixed(1)}` : `${value} ${unit}`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none bg-black/50 accent-emerald-400 cursor-pointer"
      />
    </div>
  );
}
