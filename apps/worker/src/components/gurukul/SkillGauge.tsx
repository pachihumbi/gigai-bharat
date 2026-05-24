import { HudLabel } from "@/os/OsCard";

export function SkillGauge({
  label,
  value,
  max = 100,
  color = "primary",
}: {
  label: string;
  value: number;
  max?: number;
  color?: "primary" | "secondary" | "accent";
}) {
  const pct = Math.min(100, (value / max) * 100);
  const stroke =
    color === "secondary" ? "hsl(var(--secondary))" : color === "accent" ? "hsl(var(--accent))" : "hsl(var(--primary))";

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-20 w-20">
        <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
          <circle cx="40" cy="40" r="32" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
          <circle
            cx="40"
            cy="40"
            r="32"
            fill="none"
            stroke={stroke}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 32}
            strokeDashoffset={2 * Math.PI * 32 * (1 - pct / 100)}
            style={{ filter: `drop-shadow(0 0 6px ${stroke})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-extrabold tabular-nums">{value}</span>
        </div>
      </div>
      <HudLabel className="mt-2 text-center">{label}</HudLabel>
    </div>
  );
}
