import { AppShell } from "@/components/AppShell";
import { BatteryCharging, MapPin, Mic, Navigation, Volume2, Square } from "lucide-react";
import { useEffect, useState } from "react";

type Color = "accent" | "primary" | "secondary";
const colorMap: Record<Color, { dot: string; bg: string; text: string; halo: string }> = {
  accent: { dot: "bg-accent", bg: "bg-accent/15", text: "text-accent", halo: "bg-accent/30" },
  primary: { dot: "bg-primary", bg: "bg-primary/15", text: "text-primary", halo: "bg-primary/30" },
  secondary: { dot: "bg-secondary", bg: "bg-secondary/15", text: "text-secondary", halo: "bg-secondary/30" },
};
const surgeZones: { name: string; kn: string; x: number; y: number; level: string; color: Color }[] = [
  { name: "Indiranagar", kn: "ಇಂದಿರಾನಗರ", x: 62, y: 38, level: "HIGH", color: "accent" },
  { name: "Koramangala", kn: "ಕೋರಮಂಗಲ", x: 55, y: 60, level: "HIGH", color: "accent" },
  { name: "Whitefield", kn: "ವೈಟ್‌ಫೀಲ್ಡ್", x: 85, y: 32, level: "MED", color: "primary" },
  { name: "HSR Layout", kn: "ಎಚ್‌ಎಸ್‌ಆರ್", x: 70, y: 72, level: "LOW", color: "secondary" },
];

const evHubs = [
  { x: 48, y: 50 }, { x: 72, y: 55 }, { x: 60, y: 30 }, { x: 80, y: 65 },
];

const VOICE_KN =
  "ನಮಸ್ಕಾರ! ಇಂದಿರಾನಗರದಲ್ಲಿ ಹೆಚ್ಚಿನ ಬೇಡಿಕೆ ಇದೆ. ಬ್ಯಾಟರಿ ಶೇಕಡಾ ೧೫ ಮಾತ್ರ ಇದೆ. ಹತ್ತಿರದ GigAI ಸ್ಮಾರ್ಟ್ ಹಬ್‌ಗೆ ಹೋಗಿ ಸ್ವಾಪ್ ಮಾಡಿ. ಸುರಕ್ಷಿತವಾಗಿ ಓಡಿಸಿ.";

const Heatmap = () => {
  const [tick, setTick] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 1200);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(VOICE_KN);
    u.lang = "kn-IN";
    u.rate = 0.95;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  };

  return (
    <AppShell title="Shift Coach" kn="AI ಮಾರ್ಗದರ್ಶಿ">
      {/* Map */}
      <div className="relative glass-card p-3 mb-4 overflow-hidden h-[440px] animate-fade-in">
        <div className="absolute inset-0 grid-bg opacity-50" />
        {/* river lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,60 Q20,55 35,65 T70,60 T100,55" stroke="hsl(var(--primary) / 0.25)" strokeWidth="0.6" fill="none" />
          <path d="M10,20 Q30,30 50,25 T90,35" stroke="hsl(var(--primary) / 0.18)" strokeWidth="0.5" fill="none" />
          <path d="M20,90 Q40,80 60,85 T95,80" stroke="hsl(var(--primary) / 0.18)" strokeWidth="0.5" fill="none" />
        </svg>

        {/* Surge zones */}
        {surgeZones.map((z) => {
          const cm = colorMap[z.color];
          return (
            <div key={z.name} className="absolute" style={{ left: `${z.x}%`, top: `${z.y}%`, transform: "translate(-50%, -50%)" }}>
              <div className={`absolute -inset-8 rounded-full ${cm.halo} blur-2xl`} />
              <div className={`relative w-3 h-3 rounded-full ${cm.dot} animate-ping`} />
              <div className={`absolute top-0 left-0 w-3 h-3 rounded-full ${cm.dot}`} />
              <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <p className="text-[10px] font-bold text-foreground">{z.name}</p>
                <p className={`text-[9px] font-mono-tech ${cm.text}`}>{z.level}</p>
              </div>
            </div>
          );
        })}

        {/* EV hubs */}
        {evHubs.map((h, i) => (
          <div key={i} className="absolute" style={{ left: `${h.x}%`, top: `${h.y}%`, transform: "translate(-50%, -50%)" }}>
            <div className="w-5 h-5 rounded-md bg-secondary/20 border border-secondary grid place-items-center glow-green">
              <BatteryCharging className="h-3 w-3 text-secondary" />
            </div>
          </div>
        ))}

        {/* Driver location */}
        <div className="absolute" style={{ left: "50%", top: "55%", transform: "translate(-50%, -50%)" }}>
          <div className="w-4 h-4 rounded-full bg-primary border-2 border-background animate-pulse-glow" />
          <div className="absolute top-0 left-0 w-4 h-4 rounded-full bg-primary/40 animate-ping-slow" />
        </div>

        {/* HUD */}
        <div className="absolute top-3 left-3 right-3 flex justify-between">
          <div className="font-mono-tech text-[10px] px-2 py-1 rounded-md border border-primary/30 bg-background/40 backdrop-blur-md">
            BLR • 12.97°N 77.59°E
          </div>
          <div className="font-mono-tech text-[10px] px-2 py-1 rounded-md border border-secondary/30 bg-background/40 backdrop-blur-md text-secondary">
            LIVE {tick}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between glass-card !rounded-xl px-3 py-2">
          <div className="flex items-center gap-1.5 text-[10px]"><span className="w-2 h-2 rounded-full bg-accent" /> Surge</div>
          <div className="flex items-center gap-1.5 text-[10px]"><span className="w-2 h-2 rounded-sm bg-secondary" /> EV Swap</div>
          <div className="flex items-center gap-1.5 text-[10px]"><span className="w-2 h-2 rounded-full bg-primary" /> You</div>
        </div>
      </div>

      {/* Surge list */}
      <div className="space-y-2 mb-4">
        {surgeZones.slice(0, 3).map((z, i) => {
          const cm = colorMap[z.color];
          return (
            <div key={z.name} className="glass-card p-3 flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className={`w-9 h-9 rounded-xl ${cm.bg} grid place-items-center`}>
                <MapPin className={`h-4 w-4 ${cm.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight">{z.name}</p>
                <p className="text-[11px] font-kannada text-muted-foreground">{z.kn}</p>
              </div>
              <div className="text-right">
                <p className={`text-[10px] font-mono-tech ${cm.text}`}>{z.level} DEMAND</p>
                <p className="text-[11px] text-secondary font-semibold">+₹{220 + i * 120}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Voice coach widget */}
      <div className="glass-card p-4 border-accent/40 relative overflow-hidden animate-fade-in">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 blur-3xl rounded-full" />
        <div className="relative flex items-start gap-3">
          <div className="flex-none w-12 h-12 rounded-2xl bg-gradient-saffron grid place-items-center glow-saffron animate-pulse-glow">
            <Mic className="h-5 w-5 text-accent-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-tech uppercase tracking-widest text-accent">Vernacular Voice Coach</span>
              <div className="flex gap-0.5 items-end">
                {[0.5, 1, 0.7, 1.2, 0.6].map((d, i) => (
                  <span key={i} className="w-0.5 h-3 bg-accent rounded-full animate-wave" style={{ animationDelay: `${i * 0.1}s`, transform: `scaleY(${d})` }} />
                ))}
              </div>
            </div>
            <p className="font-kannada text-base font-semibold mt-2 leading-snug">
              {VOICE_KN}
            </p>
            <p className="text-xs text-muted-foreground italic mt-1">
              "High demand in Indiranagar. Battery at 15% — swap at the nearest GigAI Hub. Drive safe."
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={toggleSpeak}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-accent/15 text-accent border border-accent/40 active:scale-95 transition"
              >
                {speaking ? <Square className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                {speaking ? "Stop" : "Play (ಕನ್ನಡ)"}
              </button>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-accent">
                <Navigation className="h-3.5 w-3.5" /> Navigate
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] font-mono-tech tracking-[0.25em] text-muted-foreground mt-6">
        POWERED BY <span className="text-gradient-neon font-bold">GIGAI BHARAT</span>
      </p>
    </AppShell>
  );
};

export default Heatmap;
