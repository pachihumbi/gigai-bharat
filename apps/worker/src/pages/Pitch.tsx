import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import Heatmap from "./Heatmap";
import GigPay from "./GigPay";
import Welfare from "./Welfare";
import OCR from "./OCR";
import { Pause, Play, X } from "lucide-react";

const SCREENS = [
  { name: "Home Dashboard", el: <Dashboard /> },
  { name: "Shift Coach", el: <Heatmap /> },
  { name: "Screenshot OCR", el: <OCR /> },
  { name: "GigPay & Credit", el: <GigPay /> },
  { name: "Welfare DPI", el: <Welfare /> },
];

const INTERVAL = 5000;

const Pitch = () => {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!playing) return;
    setProgress(0);
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / INTERVAL, 1);
      setProgress(p);
      if (p >= 1) setIdx((i) => (i + 1) % SCREENS.length);
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [idx, playing]);

  return (
    <div className="relative">
      {/* HUD overlay */}
      <div className="fixed top-0 inset-x-0 z-50 px-3 pt-3 pointer-events-none">
        <div className="mx-auto max-w-md pointer-events-auto">
          <div className="flex items-center gap-2 rounded-2xl border border-primary/40 bg-background/80 backdrop-blur-xl px-3 py-2 shadow-[0_0_30px_hsl(var(--primary)/0.35)]">
            <span className="font-mono-tech text-[10px] tracking-widest text-primary">PITCH MODE</span>
            <span className="flex-1 text-xs font-semibold truncate">{SCREENS[idx].name}</span>
            <span className="text-[10px] font-mono-tech text-muted-foreground tabular-nums">{idx + 1}/{SCREENS.length}</span>
            <button onClick={() => setPlaying((p) => !p)} className="h-7 w-7 grid place-items-center rounded-md bg-primary/15 text-primary">
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
            <Link to="/" className="h-7 w-7 grid place-items-center rounded-md bg-muted/40 text-muted-foreground">
              <X className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-1 h-0.5 mx-2 rounded-full bg-muted/40 overflow-hidden">
            <div className="h-full bg-gradient-neon" style={{ width: `${progress * 100}%`, transition: playing ? "none" : "width 0.2s" }} />
          </div>
        </div>
      </div>

      {/* Screen */}
      <div key={idx} className="animate-fade-in">{SCREENS[idx].el}</div>

      {/* Dot rail */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex gap-1.5">
        {SCREENS.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-primary shadow-[0_0_10px_hsl(var(--primary))]" : "w-1.5 bg-muted-foreground/40"}`} />
        ))}
      </div>
    </div>
  );
};

export default Pitch;
