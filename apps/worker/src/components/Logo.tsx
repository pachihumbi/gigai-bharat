export const Logo = ({ size = 40 }: { size?: number }) => (
  <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
    <div className="absolute inset-0 rounded-2xl bg-gradient-neon blur-md opacity-70" />
    <div className="relative w-full h-full rounded-2xl bg-background border border-primary/40 flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 40 40" className="w-3/4 h-3/4">
        <defs>
          <linearGradient id="lg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(200 100% 60%)" />
            <stop offset="60%" stopColor="hsl(150 100% 50%)" />
            <stop offset="100%" stopColor="hsl(33 100% 55%)" />
          </linearGradient>
        </defs>
        <path d="M20 4 L34 12 V28 L20 36 L6 28 V12 Z" fill="none" stroke="url(#lg)" strokeWidth="2" />
        <text x="20" y="25" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="14" fill="url(#lg)">G</text>
      </svg>
    </div>
  </div>
);
