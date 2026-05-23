import { useDispatchSimulation } from "@/hooks/use-dispatch-simulation";
import { GlassPanel, HudLabel, LiveDot } from "@/components/ui/glass-panel";
import { cn } from "@/lib/cn";

const statusStyle = {
  routing: "text-[color:var(--saffron)] border-[color:var(--saffron)]/40",
  matched: "text-[color:var(--neon)] border-[color:var(--neon)]/40",
  complete: "text-muted-foreground border-border",
} as const;

export function DispatchVisualization({ className }: { className?: string }) {
  const events = useDispatchSimulation(5, 2600);

  return (
    <GlassPanel className={cn("flex h-full flex-col p-4 md:p-5", className)}>
      <div className="mb-4 flex items-center gap-2">
        <LiveDot />
        <HudLabel>AI dispatch engine</HudLabel>
      </div>

      {/* Schematic routing lanes */}
      <div className="relative mb-4 h-24 overflow-hidden border border-border/50 bg-background/30 md:h-28">
        <svg viewBox="0 0 400 80" className="h-full w-full" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="route-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--saffron)" stopOpacity="0.2" />
              <stop offset="50%" stopColor="var(--neon)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--neon)" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {[20, 40, 60].map((y, i) => (
            <g key={y}>
              <line x1="0" y1={y} x2="400" y2={y} stroke="var(--foreground)" strokeOpacity="0.06" strokeWidth="1" />
              <circle r="3" fill="var(--neon)" className="animate-transit-flow">
                <animateMotion dur={`${3 + i}s`} repeatCount="indefinite" path={`M0,${y} L400,${y}`} />
              </circle>
            </g>
          ))}
          <path d="M 0 40 Q 100 20 200 40 T 400 40" fill="none" stroke="url(#route-grad)" strokeWidth="1.5" strokeDasharray="4 8" className="animate-transit-flow" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background pointer-events-none" />
      </div>

      <ul className="flex-1 space-y-2 overflow-hidden">
        {events.map((e, i) => (
          <li
            key={e.id}
            className={cn(
              "flex items-center justify-between gap-2 border px-3 py-2 text-xs transition-all md:text-sm",
              statusStyle[e.status],
              i === 0 && "bg-card/50",
            )}
            style={{ opacity: 1 - i * 0.12 }}
          >
            <span className="min-w-0 truncate font-mono uppercase tracking-wider">
              {e.from} → {e.to}
            </span>
            <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{e.platform}</span>
            <span className="shrink-0 font-mono tabular-nums text-[color:var(--neon)]">{e.eta}</span>
          </li>
        ))}
      </ul>
    </GlassPanel>
  );
}
