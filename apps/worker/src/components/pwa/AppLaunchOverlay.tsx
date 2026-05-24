import { Logo } from "@/components/Logo";
import { usePwa } from "./PwaProvider";

export function AppLaunchOverlay() {
  const { showLaunchOverlay, completeLaunch } = usePwa();

  if (!showLaunchOverlay) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020810] animate-in fade-in duration-300"
      onAnimationEnd={completeLaunch}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(0,245,212,0.18),transparent_55%)]" />
      <div className="relative flex flex-col items-center gap-4 animate-in zoom-in-95 fade-in duration-500">
        <div className="animate-float">
          <Logo size={96} />
        </div>
        <div className="text-center">
          <p className="text-3xl font-extrabold tracking-tight text-gradient-neon">GigAI</p>
          <p className="text-xl font-bold tracking-[0.25em] text-gradient-saffron">BHARAT</p>
        </div>
        <div className="h-1 w-28 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full bg-[#00F5D4]" />
        </div>
      </div>
    </div>
  );
}
