import { useEffect, useState } from "react";
import { ShieldAlert, Coffee, Volume2 } from "lucide-react";

const KN_ALERT =
  "ಎಚ್ಚರಿಕೆ! ನೀವು ೧೧.೫ ಗಂಟೆಗಳಿಗಿಂತ ಹೆಚ್ಚು ಓಡಿಸಿದ್ದೀರಿ. ೪೫ ನಿಮಿಷ ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ. ನಿಮ್ಮ ಕುಟುಂಬ ನಿಮಗಾಗಿ ಕಾಯುತ್ತಿದೆ.";

const speakKn = (text: string) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "kn-IN";
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
};

interface Props {
  open: boolean;
  onComplete: () => void;
}

const TOTAL = 45 * 60; // 45 min

export const RestLockModal = ({ open, onComplete }: Props) => {
  const [seconds, setSeconds] = useState(TOTAL);

  useEffect(() => {
    if (!open) return;
    setSeconds(TOTAL);
    speakKn(KN_ALERT);
    const i = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(i);
          onComplete();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const pct = ((TOTAL - seconds) / TOTAL) * 100;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-destructive/30 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative w-full max-w-sm text-center">
        <div className="mx-auto w-20 h-20 rounded-3xl bg-destructive/20 border border-destructive/40 grid place-items-center mb-4 animate-pulse-glow">
          <ShieldAlert className="h-9 w-9 text-destructive" />
        </div>

        <p className="text-[10px] font-mono-tech tracking-[0.3em] text-destructive">
          ESG REST-LOCK INITIATED
        </p>
        <h2 className="text-2xl font-extrabold mt-2 leading-tight">
          Mandatory Safety Break
        </h2>
        <p className="font-kannada text-base text-accent mt-1">
          ಕಡ್ಡಾಯ ವಿಶ್ರಾಂತಿ
        </p>

        <p className="text-xs text-muted-foreground mt-4 leading-relaxed px-4">
          You've exceeded 11.5 hours of driving. New gigs are paused for{" "}
          <span className="text-foreground font-semibold">45 minutes</span> for
          your safety. Your family is waiting.
        </p>

        <div className="my-6">
          <div className="text-7xl font-extrabold text-gradient-neon font-mono-tech tabular-nums tracking-tight">
            {mm}:{ss}
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-destructive via-accent to-secondary transition-[width] duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="glass-card p-3 flex items-center gap-3 text-left mb-3">
          <Coffee className="h-5 w-5 text-accent flex-none" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">Nearest rest stop</p>
            <p className="text-[11px] text-muted-foreground">
              GigAI Hub • Indiranagar — 1.2 km • free chai
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => speakKn(KN_ALERT)}
            className="flex-1 h-11 rounded-xl border border-accent/40 bg-accent/10 text-accent text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <Volume2 className="h-4 w-4" /> Replay (ಕನ್ನಡ)
          </button>
          <button
            disabled
            className="flex-1 h-11 rounded-xl bg-destructive/30 text-destructive-foreground/60 text-sm font-bold cursor-not-allowed"
          >
            Accept Gig
          </button>
        </div>

        <p className="text-[10px] font-mono-tech tracking-[0.25em] text-muted-foreground mt-5">
          POWERED BY <span className="text-gradient-neon font-bold">GIGAI BHARAT</span>
        </p>
      </div>
    </div>
  );
};
