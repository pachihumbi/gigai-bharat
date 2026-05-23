import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { ArrowRight, Zap } from "lucide-react";

const Splash = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-hero grid-bg">
      {/* Traffic light orbs */}
      <div className="absolute top-1/4 left-10 w-2 h-2 rounded-full bg-secondary glow-green animate-pulse" />
      <div className="absolute top-1/3 right-12 w-2 h-2 rounded-full bg-accent glow-saffron animate-pulse" style={{ animationDelay: "0.4s" }} />
      <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-primary glow-blue animate-pulse" style={{ animationDelay: "0.8s" }} />

      {/* Skyline silhouette */}
      <svg className="absolute bottom-0 inset-x-0 w-full opacity-30" viewBox="0 0 400 120" preserveAspectRatio="none">
        <defs>
          <linearGradient id="city" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(200 100% 50%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(200 100% 50%)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0,120 L0,80 L20,80 L20,60 L40,60 L40,90 L60,90 L60,50 L80,50 L80,70 L110,70 L110,40 L130,40 L130,75 L160,75 L160,55 L180,55 L180,30 L200,30 L200,65 L230,65 L230,45 L260,45 L260,80 L290,80 L290,55 L320,55 L320,75 L350,75 L350,60 L380,60 L380,85 L400,85 L400,120 Z" fill="url(#city)" />
      </svg>

      {/* Scanline */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-60 animate-pulse" />

      <div className="relative z-10 mx-auto max-w-md min-h-screen flex flex-col items-center justify-between px-6 py-12 text-center">
        <div className="font-mono-tech text-[10px] tracking-[0.3em] text-primary/70 animate-fade-in-slow">
          WORKER OS • INDIA • 2026
        </div>

        <div className="flex flex-col items-center gap-6 animate-fade-in">
          <div className="animate-float">
            <Logo size={88} />
          </div>
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight text-gradient-neon leading-none">
              GigAI
            </h1>
            <h2 className="text-3xl font-bold tracking-[0.2em] text-gradient-saffron mt-1">BHARAT</h2>
          </div>

          <div className="space-y-3 max-w-xs">
            <p className="font-kannada text-2xl font-semibold text-foreground leading-snug">
              ನಿಮ್ಮ ದುಡಿಮೆ ಈಗ <span className="text-gradient-neon">AI</span> ಜೊತೆ.
            </p>
            <p className="text-sm text-muted-foreground">
              The economic operating system for India&apos;s <span className="text-secondary font-semibold">EV workforce</span> — VinFast fleet intelligence, security SOC, smart charging
            </p>
          </div>


          <div className="space-y-1 max-w-xs animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <p className="text-[11px] font-mono-tech tracking-[0.2em] text-primary/80 uppercase">
              The Operating System for
            </p>
            <p className="text-sm font-bold text-gradient-saffron tracking-wide">
              India's Working Class
            </p>
            <p className="text-[10px] text-muted-foreground italic mt-2">
              Direct Gigs · Certified Workers · Transparent Earnings
            </p>
          </div>
        </div>

        <div className="w-full space-y-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Link
            to="/auth"
            className="group relative flex items-center justify-center gap-2 w-full h-14 rounded-2xl bg-gradient-neon text-primary-foreground font-semibold text-base overflow-hidden animate-pulse-glow"
          >
            <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,hsl(0_0%_100%/0.35)_50%,transparent_70%)] bg-[length:200%_100%] animate-shimmer" />
            <Zap className="h-5 w-5 relative" />
            <span className="relative">Start Driving Smarter</span>
            <ArrowRight className="h-5 w-5 relative transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/pitch"
            className="flex items-center justify-center gap-2 w-full h-11 rounded-2xl border border-accent/50 bg-accent/10 text-accent font-semibold text-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Pitch Mode (Auto-Demo)
          </Link>
          <p className="font-kannada text-xs text-muted-foreground">
            ಬೆಂಗಳೂರಿನ ಗಿಗ್ ಕಾರ್ಮಿಕರಿಗಾಗಿ ಮಾಡಲಾಗಿದೆ • Made in Bengaluru
          </p>
        </div>
      </div>
    </div>
  );
};

export default Splash;
