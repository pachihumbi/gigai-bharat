import { cn } from "@/lib/utils";

type ArchitectureVisualProps = {
  variant: "hub" | "pods" | "gurukul" | "community" | "hero";
  className?: string;
};

export function ArchitectureVisual({ variant, className }: ArchitectureVisualProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.08] aspect-[16/10] bg-black/50",
        className,
      )}
    >
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

      {variant === "hero" && <HeroVisual />}
      {variant === "hub" && <HubVisual />}
      {variant === "pods" && <PodsVisual />}
      {variant === "gurukul" && <GurukulVisual />}
      {variant === "community" && <CommunityVisual />}

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,hsl(0_0%_100%/0.04)_50%,transparent_70%)] bg-[length:200%_100%] animate-shimmer" />
    </div>
  );
}

function HeroVisual() {
  return (
    <>
      <div className="absolute inset-0 flex items-end justify-center gap-1 px-6 pb-8">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="rounded-t-lg border border-cyan-400/20 bg-gradient-to-t from-cyan-500/20 to-transparent"
            style={{ width: `${8 + i * 2}%`, height: `${30 + i * 8}%`, opacity: 0.4 + i * 0.08 }}
          />
        ))}
      </div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border border-cyan-400/30 bg-cyan-400/5 blur-sm animate-pulse-glow" />
      <div className="absolute top-6 left-6 right-6 flex justify-between">
        <span className="h-2 w-16 rounded-full bg-emerald-400/40 animate-pulse" />
        <span className="h-2 w-10 rounded-full bg-cyan-400/40" />
      </div>
      <div className="absolute bottom-4 left-4 text-[9px] font-mono-tech text-cyan-300/70 uppercase tracking-widest">
        GigAI Campus · Render
      </div>
    </>
  );
}

function HubVisual() {
  return (
    <>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex flex-col items-center gap-1">
            <div className="h-16 w-8 rounded-t-full border border-emerald-400/40 bg-emerald-400/10 relative">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="h-1 w-10 rounded bg-emerald-400/30" />
          </div>
        ))}
      </div>
      <div className="absolute top-8 left-8 right-8 h-20 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm flex items-center px-4 gap-3">
        <div className="h-10 w-10 rounded-lg bg-cyan-400/20 border border-cyan-400/30" />
        <div className="flex-1 space-y-1.5">
          <div className="h-2 w-3/4 rounded bg-white/20" />
          <div className="h-1.5 w-1/2 rounded bg-white/10" />
        </div>
      </div>
      <div className="absolute top-36 right-6 w-20 h-20 rounded-2xl border border-violet-400/25 bg-violet-400/5 grid place-items-center">
        <div className="text-[8px] font-mono text-violet-300 text-center">AI<br />Dispatch</div>
      </div>
    </>
  );
}

function PodsVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-2 px-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "relative rounded-3xl border backdrop-blur-sm transition-all",
            i === 1
              ? "h-[70%] w-[28%] border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_40px_rgba(0,170,255,0.2)] z-10"
              : "h-[55%] w-[24%] border-white/10 bg-white/[0.03] opacity-70",
          )}
        >
          <div className="absolute inset-x-3 top-3 h-8 rounded-xl bg-black/40 border border-white/10" />
          <div className="absolute inset-x-4 top-14 bottom-8 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.06] to-transparent" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 h-1 w-8 rounded-full bg-cyan-400/50" />
          {i === 1 && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-[7px] font-bold text-cyan-200 uppercase">
              Active
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function GurukulVisual() {
  return (
    <>
      <div className="absolute inset-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4">
        <div className="flex gap-2 mb-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-400/20 border border-emerald-400/30" />
          <div className="flex-1 space-y-1">
            <div className="h-2 w-full rounded bg-emerald-400/30" />
            <div className="h-1.5 w-2/3 rounded bg-white/10" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="aspect-square rounded-lg border border-white/[0.06] bg-black/30" />
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 right-4 px-2 py-1 rounded-lg bg-violet-400/15 border border-violet-400/30 text-[8px] font-mono text-violet-200">
        AI LIVE
      </div>
    </>
  );
}

function CommunityVisual() {
  return (
    <div className="absolute inset-0 grid grid-cols-2 gap-2 p-4">
      {["🍛", "🛋️", "🏥", "🛡️"].map((emoji, i) => (
        <div
          key={emoji}
          className="rounded-xl border border-white/[0.08] bg-black/30 flex flex-col items-center justify-center gap-1 animate-fade-in"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <span className="text-2xl">{emoji}</span>
          <div className="h-1 w-8 rounded bg-white/15" />
        </div>
      ))}
    </div>
  );
}
