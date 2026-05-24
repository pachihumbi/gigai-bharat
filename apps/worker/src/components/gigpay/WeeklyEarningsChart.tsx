import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatInr } from "@/lib/gigpay-utils";

export type WeeklyChartPoint = {
  date: string;
  total: number;
  label: string;
};

type WeeklyEarningsChartProps = {
  data: WeeklyChartPoint[];
};

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: WeeklyChartPoint }[];
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-xl border border-cyan-400/30 bg-[#020810]/95 px-3 py-2 shadow-lg backdrop-blur-md">
      <p className="text-[10px] font-mono text-cyan-300/80">{point.label}</p>
      <p className="text-sm font-bold tabular-nums text-emerald-300">{formatInr(point.total)}</p>
    </div>
  );
}

export function WeeklyEarningsChart({ data }: WeeklyEarningsChartProps) {
  const maxVal = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="fintech-card p-4 sm:p-5 animate-fade-in overflow-hidden">
      <div className="mb-4 flex items-end justify-between gap-2">
        <div>
          <p className="text-[10px] font-mono-tech uppercase tracking-[0.2em] text-muted-foreground">
            Weekly earnings
          </p>
          <p className="mt-0.5 text-sm font-semibold text-foreground/90">7-day payout trend</p>
        </div>
        <p className="font-kannada text-[10px] text-muted-foreground">ವಾರದ ಆದಾಯ</p>
      </div>

      <div className="h-44 sm:h-52 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gigpayArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(150 100% 50%)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="hsl(200 100% 50%)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gigpayStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(200 100% 50%)" />
                <stop offset="100%" stopColor="hsl(150 100% 50%)" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="hsl(200 60% 18% / 0.35)" strokeDasharray="3 6" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "hsl(210 25% 65%)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "hsl(210 25% 65%)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              domain={[0, maxVal * 1.15]}
              tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "hsl(200 100% 50% / 0.25)" }} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="url(#gigpayStroke)"
              strokeWidth={2.5}
              fill="url(#gigpayArea)"
              animationDuration={1200}
              dot={{ r: 3, fill: "hsl(150 100% 50%)", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "hsl(200 100% 50%)", stroke: "hsl(150 100% 50%)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
