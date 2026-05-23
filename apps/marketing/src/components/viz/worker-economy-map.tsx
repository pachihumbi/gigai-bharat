import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/cn";

export type CityNode = {
  id: string;
  x: number;
  y: number;
  label: string;
  workers: number;
  demand: "low" | "med" | "high";
};

const NODES: CityNode[] = [
  { id: "DEL", x: 320, y: 150, label: "Delhi", workers: 890000, demand: "high" },
  { id: "MUM", x: 220, y: 360, label: "Mumbai", workers: 1240000, demand: "high" },
  { id: "BLR", x: 320, y: 510, label: "Bengaluru", workers: 680000, demand: "high" },
  { id: "HYD", x: 360, y: 420, label: "Hyderabad", workers: 420000, demand: "med" },
  { id: "KOL", x: 520, y: 290, label: "Kolkata", workers: 510000, demand: "med" },
  { id: "CHE", x: 380, y: 560, label: "Chennai", workers: 380000, demand: "med" },
  { id: "AMD", x: 230, y: 270, label: "Ahmedabad", workers: 290000, demand: "low" },
  { id: "LKO", x: 400, y: 220, label: "Lucknow", workers: 180000, demand: "low" },
  { id: "PUN", x: 250, y: 390, label: "Pune", workers: 340000, demand: "med" },
  { id: "JAI", x: 290, y: 220, label: "Jaipur", workers: 120000, demand: "low" },
  { id: "SRT", x: 230, y: 320, label: "Surat", workers: 95000, demand: "low" },
  { id: "KOC", x: 320, y: 600, label: "Kochi", workers: 78000, demand: "low" },
];

const EDGES: Array<[string, string]> = [
  ["DEL", "JAI"], ["DEL", "LKO"], ["LKO", "KOL"], ["DEL", "AMD"], ["AMD", "MUM"],
  ["AMD", "SRT"], ["MUM", "PUN"], ["PUN", "BLR"], ["MUM", "HYD"], ["HYD", "BLR"],
  ["BLR", "CHE"], ["BLR", "KOC"], ["CHE", "KOC"], ["HYD", "KOL"], ["JAI", "AMD"],
];

const demandColor = {
  low: "var(--foreground)",
  med: "var(--saffron)",
  high: "var(--neon)",
} as const;

const demandOpacity = { low: 0.35, med: 0.65, high: 1 } as const;

type WorkerEconomyMapProps = {
  className?: string;
  /** Unique prefix when multiple maps render on one page (prevents SVG ID collisions). */
  idPrefix?: string;
  /** Disable animated transit lines on low-end devices. */
  animate?: boolean;
};

export function WorkerEconomyMap({
  className,
  idPrefix = "we",
  animate = true,
}: WorkerEconomyMapProps) {
  const reduced = useReducedMotion();
  const showMotion = animate && !reduced;
  const byId = (id: string) => NODES.find((n) => n.id === id)!;

  const gid = (name: string) => `${idPrefix}-${name}`;

  return (
    <svg
      viewBox="100 80 500 560"
      className={cn("select-none", className)}
      role="img"
      aria-label="GigAI Bharat worker economy map across India"
    >
      <defs>
        <radialGradient id={gid("glow-high")}>
          <stop offset="0%" stopColor="var(--neon)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--neon)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={gid("glow-med")}>
          <stop offset="0%" stopColor="var(--saffron)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--saffron)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={gid("pulse")}>
          <stop offset="0%" stopColor="var(--neon)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--neon)" stopOpacity="0" />
        </radialGradient>
        <pattern id={gid("grid")} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="0.5" />
        </pattern>
      </defs>

      <rect x="100" y="80" width="500" height="560" fill={`url(#${gid("grid")})`} />

      <path
        d="M 280 100 Q 380 95 460 130 Q 540 165 545 240 Q 555 320 510 380 Q 470 460 410 540 Q 360 615 320 615 Q 290 615 270 575 Q 240 530 215 470 Q 175 400 165 320 Q 160 240 200 175 Q 235 115 280 100 Z"
        fill="color-mix(in oklch, var(--neon) 3%, transparent)"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="1"
      />

      {NODES.filter((n) => n.demand === "high").map((n, i) => (
        <circle
          key={`heat-${n.id}`}
          cx={n.x}
          cy={n.y}
          r="28"
          fill={`url(#${gid("pulse")})`}
          opacity={showMotion ? 0.35 : 0.2}
          className={showMotion ? "animate-pulse-dot" : ""}
          style={{ animationDelay: `${i * 0.4}s` }}
        />
      ))}

      {EDGES.map(([a, b], i) => {
        const A = byId(a);
        const B = byId(b);
        return (
          <g key={`${a}-${b}`}>
            <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="var(--neon)" strokeOpacity="0.12" strokeWidth="1" />
            {showMotion && (
              <line
                x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                stroke="var(--neon)"
                strokeOpacity="0.55"
                strokeWidth="1.2"
                strokeDasharray="3 12"
                className="animate-transit-flow"
                style={{ animationDelay: `${i * 0.25}s` }}
              />
            )}
          </g>
        );
      })}

      {NODES.map((n, i) => (
        <g key={n.id}>
          <circle
            cx={n.x}
            cy={n.y}
            r={n.demand === "high" ? 16 : 12}
            fill={n.demand === "high" ? `url(#${gid("glow-high")})` : n.demand === "med" ? `url(#${gid("glow-med")})` : "none"}
            opacity={demandOpacity[n.demand]}
          />
          <circle
            cx={n.x}
            cy={n.y}
            r="3.5"
            fill={demandColor[n.demand]}
            className={showMotion ? "animate-pulse-dot" : ""}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
          <text x={n.x + 12} y={n.y - 6} fontSize="8" fontFamily="var(--font-mono)" fill="currentColor" opacity="0.7">
            {n.label}
          </text>
          <text x={n.x + 12} y={n.y + 6} fontSize="7" fontFamily="var(--font-mono)" fill="var(--neon)" opacity="0.5">
            {(n.workers / 1000).toFixed(0)}K
          </text>
        </g>
      ))}
    </svg>
  );
}

export { NODES as economyNodes };
