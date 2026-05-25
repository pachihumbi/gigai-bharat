import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Cpu, Zap } from "lucide-react";
import { Kicker } from "@/components/ui/kicker";
import { LiveMetricsPanel } from "@/components/viz/live-metrics-panel";
import { FloatingParticles } from "@/components/motion/floating-particles";
import { AnimatedCounter } from "@/components/motion/animated-counter";
import { heroHeadline, heroSubheadline } from "@/data/cinematic";
import { useSafeMotion } from "@/hooks/use-safe-motion";

function HeroReveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const skipMotion = useSafeMotion();
  if (skipMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HeroSection() {
  const [logs, setLogs] = useState([
    "Bengaluru → Electronic City (Rapido) — Match 1.2s",
    "Delhi → Noida (Zomato) — Match 2.4s",
    "Mumbai → Bandra (Swiggy) — Match 1.8s",
    "Bengaluru → Whitefield (Uber) — Match 2.1s",
  ]);

  useEffect(() => {
    const logPool = [
      "Hyderabad → Secunderabad (Zomato) — Match 1.9s",
      "Kolkata → Salt Lake (Swiggy) — Match 2.5s",
      "Chennai → Adyar (Uber) — Match 2.0s",
      "Pune → Hinjewadi (Rapido) — Match 1.5s",
      "Bengaluru → Indiranagar (Swiggy) — Match 1.7s",
      "Delhi → Gurugram (Rapido) — Match 2.3s",
    ];
    const interval = setInterval(() => {
      const newLog = logPool[Math.floor(Math.random() * logPool.length)];
      setLogs((prev) => [newLog, ...prev.slice(0, 3)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative flex min-h-[92vh] items-center border-b border-white/5 overflow-hidden">
      <div className="hero-mesh hero-mesh-animated pointer-events-none absolute inset-0" aria-hidden />
      <FloatingParticles count={28} />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="orb orb-saffron absolute -left-32 top-1/4 h-96 w-96" />
        <div className="orb orb-neon absolute -right-24 bottom-1/4 h-80 w-80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(0,82,255,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(255,69,0,0.1),transparent_50%)]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-16 md:px-12 lg:grid-cols-12">
        <HeroReveal className="space-y-6 lg:col-span-7">
          <div className="flex flex-wrap items-center gap-3">
            <Kicker>AI · EV · Worker OS</Kicker>
            <span className="inline-flex items-center gap-2 border border-[color:var(--neon)]/30 bg-[color:var(--neon)]/5 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-[color:var(--neon)]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--neon)]" />
              Bengaluru pilot live
            </span>
          </div>
          <h1 className="font-serif text-[2.35rem] leading-[0.95] tracking-tight text-white sm:text-display-lg md:text-[4rem] lg:text-[4.75rem]">
            {heroHeadline.split("Gig Workers")[0]}
            <span className="bg-gradient-to-r from-[color:var(--saffron)] via-[color:var(--neon)] to-[color:var(--neon)] bg-clip-text font-medium italic text-transparent">
              Gig Workers
            </span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">{heroSubheadline}</p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <Cpu className="h-4 w-4 text-[color:var(--neon)]" />
              <AnimatedCounter value={23.5} suffix="M workers" />
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <Zap className="h-4 w-4 text-[color:var(--saffron)]" />
              <AnimatedCounter value={18840} suffix=" EV units" />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:flex-wrap">
            <a
              href="https://app.bharatgig.live/demo"
              className="cinematic-cta-primary flex items-center justify-center gap-2 rounded py-3.5 px-5 font-mono text-[11px] uppercase tracking-wider"
            >
              Live demo <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/contact/investors"
              className="cinematic-cta-secondary flex items-center justify-center rounded py-3.5 px-5 font-mono text-[11px] uppercase tracking-wider"
            >
              Investor intro
            </a>
            <a
              href="/join"
              className="cinematic-cta-ghost flex items-center justify-center rounded py-3.5 px-5 font-mono text-[11px] uppercase tracking-wider text-[color:var(--neon)]"
            >
              Join pilot
            </a>
          </div>
        </HeroReveal>

        <HeroReveal delay={0.15} className="lg:col-span-5">
          <div className="space-y-4">
            <LiveMetricsPanel compact />
            <div className="glass-panel overflow-hidden rounded-lg shadow-2xl shadow-[color:var(--neon)]/10 transition-shadow hover:shadow-[color:var(--neon)]/20">
              <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-3">
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                  AI + EV + Worker mesh
                </span>
                <span className="border border-[color:var(--neon)]/25 bg-[color:var(--neon)]/5 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[color:var(--neon)]">
                  Live
                </span>
              </div>
              <div className="p-4">
                <span className="mb-2 block font-mono text-[8px] uppercase tracking-wider text-muted-foreground">
                  Dispatch Log Stream
                </span>
                <div className="h-[100px] space-y-2 overflow-hidden rounded border border-white/5 bg-black/60 p-3 font-mono text-[10px]">
                  <AnimatePresence>
                    {logs.map((log, index) => (
                      <motion.div
                        key={log + index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-between border-b border-white/5 pb-1.5 text-muted-foreground last:border-0"
                      >
                        <span className="max-w-[220px] truncate text-white/90">{log.split(" — ")[0]}</span>
                        <span className="shrink-0 text-[color:var(--neon)]">{log.split(" — ")[1]}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </HeroReveal>
      </div>
    </section>
  );
}
