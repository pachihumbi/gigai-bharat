import { useI18n } from "@/i18n/context";

export function CreditGauge({ score }: { score: number }) {
  const { t } = useI18n();
  const max = 850;
  const min = 300;
  const pct = Math.max(0, Math.min(1, (score - min) / (max - min)));
  const r = 64;
  const c = 2 * Math.PI * r;
  const offset = c - pct * c;
  const tier =
    score >= 750 ? t.credit.excellent : score >= 650 ? t.credit.good : score >= 500 ? t.credit.fair : t.credit.building;

  return (
    <div className="relative mx-auto h-44 w-44">
      <div className="pointer-events-none absolute inset-2 animate-pulse-glow rounded-full bg-secondary/10 blur-2xl" />
      <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id="creditGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--secondary))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
        <circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke="url(#creditGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ filter: "drop-shadow(0 0 10px hsl(var(--secondary)))", transition: "stroke-dashoffset 1.2s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-mono-tech tracking-widest text-muted-foreground">{t.credit.gigCredit}</span>
        <span className="text-5xl font-extrabold tabular-nums text-gradient-neon">{score}</span>
        <span className="text-xs font-semibold text-secondary">{tier}</span>
      </div>
    </div>
  );
}
