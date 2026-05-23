/**
 * Animated India transit network — abstract, schematic.
 * Lightweight SVG with pulsing nodes + flowing transit lines.
 */
export function IndiaNetwork({ className = "" }: { className?: string }) {
  const nodes = [
    { id: "DEL", x: 320, y: 150, label: "Delhi" },
    { id: "MUM", x: 220, y: 360, label: "Mumbai" },
    { id: "BLR", x: 320, y: 510, label: "Bengaluru" },
    { id: "HYD", x: 360, y: 420, label: "Hyderabad" },
    { id: "KOL", x: 520, y: 290, label: "Kolkata" },
    { id: "CHE", x: 380, y: 560, label: "Chennai" },
    { id: "AMD", x: 230, y: 270, label: "Ahmedabad" },
    { id: "LKO", x: 400, y: 220, label: "Lucknow" },
    { id: "PUN", x: 250, y: 390, label: "Pune" },
    { id: "JAI", x: 290, y: 220, label: "Jaipur" },
    { id: "SRT", x: 230, y: 320, label: "Surat" },
    { id: "KOC", x: 320, y: 600, label: "Kochi" },
  ];
  const edges: Array<[string, string]> = [
    ["DEL", "JAI"], ["DEL", "LKO"], ["LKO", "KOL"],
    ["DEL", "AMD"], ["AMD", "MUM"], ["AMD", "SRT"],
    ["MUM", "PUN"], ["PUN", "BLR"], ["MUM", "HYD"],
    ["HYD", "BLR"], ["BLR", "CHE"], ["BLR", "KOC"],
    ["CHE", "KOC"], ["HYD", "KOL"], ["JAI", "AMD"],
  ];
  const byId = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <svg
      viewBox="100 80 500 560"
      className={className}
      role="img"
      aria-label="GigAI Bharat — India mobility network"
    >
      <defs>
        <radialGradient id="node-glow">
          <stop offset="0%" stopColor="var(--neon)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--neon)" stopOpacity="0" />
        </radialGradient>
        <pattern id="grid-fine" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect x="100" y="80" width="500" height="560" fill="url(#grid-fine)" />

      {/* Schematic India outline */}
      <path
        d="M 280 100 Q 380 95 460 130 Q 540 165 545 240 Q 555 320 510 380 Q 470 460 410 540 Q 360 615 320 615 Q 290 615 270 575 Q 240 530 215 470 Q 175 400 165 320 Q 160 240 200 175 Q 235 115 280 100 Z"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeWidth="1"
      />

      {/* Transit edges */}
      {edges.map(([a, b], i) => {
        const A = byId(a);
        const B = byId(b);
        return (
          <g key={`${a}-${b}`}>
            <line
              x1={A.x} y1={A.y} x2={B.x} y2={B.y}
              stroke="var(--neon)"
              strokeOpacity="0.18"
              strokeWidth="1"
            />
            <line
              x1={A.x} y1={A.y} x2={B.x} y2={B.y}
              stroke="var(--neon)"
              strokeOpacity="0.7"
              strokeWidth="1.4"
              strokeDasharray="4 14"
              className="animate-transit-flow"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map((n, i) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r="14" fill="url(#node-glow)" opacity="0.7" />
          <circle
            cx={n.x} cy={n.y} r="3"
            fill="var(--neon)"
            className="animate-pulse-dot"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
          <text
            x={n.x + 10}
            y={n.y - 8}
            fontSize="9"
            fontFamily="var(--font-mono)"
            fill="currentColor"
            opacity="0.55"
            letterSpacing="0.1em"
          >
            {n.id}
          </text>
        </g>
      ))}
    </svg>
  );
}
