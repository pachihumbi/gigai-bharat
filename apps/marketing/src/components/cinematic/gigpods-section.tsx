import { useEffect, useRef } from "react";
import { Building2, Cpu, Moon, Zap } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { GlassPanel, HudLabel } from "@/components/ui/glass-panel";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { gigPodsFacilities } from "@/data/cinematic";

const icons = {
  sleep: Moon,
  charge: Zap,
  gurukul: Cpu,
  recovery: Building2,
  command: Building2,
};

function GigPodsBlueprint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame: number;
    let w = (canvas.width = canvas.parentElement?.clientWidth || 600);
    const h = (canvas.height = 280);
    let t = 0;

    const resize = () => {
      if (canvas.parentElement) w = canvas.width = canvas.parentElement.clientWidth;
    };
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      t += 0.008;

      // Ground grid
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, h * 0.7);
        ctx.lineTo(x + 80, h);
        ctx.stroke();
      }

      // Capsule pods (left cluster)
      for (let i = 0; i < 6; i++) {
        const px = 60 + i * 48;
        const py = 120 + Math.sin(t + i) * 3;
        ctx.strokeStyle = "rgba(0,217,255,0.4)";
        ctx.fillStyle = "rgba(0,82,255,0.08)";
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(px, py, 36, 80, 18);
        } else {
          ctx.rect(px, py, 36, 80);
        }
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = `rgba(0,217,255,${0.2 + Math.sin(t * 2 + i) * 0.1})`;
        ctx.fillRect(px + 8, py + 20, 20, 4);
      }

      // Charging tower (center)
      const cx = w * 0.45;
      ctx.strokeStyle = "rgba(255,122,0,0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, 200);
      ctx.lineTo(cx, 60);
      ctx.stroke();
      for (let r = 0; r < 3; r++) {
        const pulse = (t * 2 + r * 0.5) % 1;
        ctx.strokeStyle = `rgba(255,122,0,${0.4 - pulse * 0.3})`;
        ctx.beginPath();
        ctx.arc(cx, 60, 20 + pulse * 30, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Command center (right)
      const bx = w * 0.72;
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      for (let floor = 0; floor < 4; floor++) {
        const fy = 180 - floor * 35;
        ctx.strokeRect(bx - 50, fy, 100, 28);
        ctx.fillStyle = "rgba(0,217,255,0.15)";
        ctx.fillRect(bx - 40, fy + 8, 12, 12);
        ctx.fillRect(bx - 10, fy + 8, 12, 12);
        ctx.fillRect(bx + 20, fy + 8, 12, 12);
      }

      // EV particles
      for (let i = 0; i < 5; i++) {
        const ex = ((t * 80 + i * 120) % w);
        const ey = 200 + Math.sin(t + i) * 5;
        ctx.fillStyle = "rgba(0,217,255,0.9)";
        ctx.beginPath();
        ctx.arc(ex, ey, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      frame = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-[280px] w-full rounded-lg border border-white/5 bg-slate-950/60"
      aria-label="GigPods architectural blueprint visualization"
    />
  );
}

export function GigPodsSection() {
  return (
    <SectionShell
      id="gigpods"
      className="gpu-lite border-b border-white/5 bg-gradient-to-b from-slate-950/30 to-black"
    >
      <FadeIn>
        <SectionLabel>03 // GigPods Smart Infrastructure</SectionLabel>
        <SectionTitle className="mt-4 max-w-4xl">
          Cinematic <span className="italic text-[color:var(--saffron)]">worker infrastructure</span> for the EV age
        </SectionTitle>
        <p className="mt-4 max-w-2xl text-body text-muted-foreground">
          Smart sleeping pods, EV charging hubs, Gurukul AI learning centers, rest zones, and AI dispatch command
          centers — inspired by goSTOPS, capsule hotels, and Tesla-grade infrastructure.
        </p>
      </FadeIn>

      <FadeIn className="mt-10">
        <GlassPanel glow className="overflow-hidden p-4 md:p-6">
          <HudLabel>Architectural Command Blueprint · Bengaluru Pilot</HudLabel>
          <GigPodsBlueprint />
        </GlassPanel>
      </FadeIn>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gigPodsFacilities.map((f, i) => {
          const Icon = icons[f.id as keyof typeof icons] ?? Building2;
          return (
            <FadeIn key={f.id} delay={i * 0.05}>
              <GlassPanel
                className={`group h-full p-6 transition-colors ${
                  f.accent === "neon"
                    ? "hover:border-[color:var(--neon)]/30"
                    : "hover:border-[color:var(--saffron)]/30"
                }`}
              >
                <Icon
                  className={`h-6 w-6 ${f.accent === "neon" ? "text-[color:var(--neon)]" : "text-[color:var(--saffron)]"}`}
                />
                <h3 className="mt-4 font-serif text-xl text-white">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.subtitle}</p>
                <div className="mt-4 flex items-baseline justify-between border-y border-white/5 py-3">
                  <span className="font-mono text-[9px] uppercase text-muted-foreground">{f.capacity}</span>
                  <span className="font-serif text-lg text-[color:var(--neon)]">{f.metric}</span>
                </div>
                <ul className="mt-4 space-y-2">
                  {f.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-xs text-white/80">
                      <span className="h-1 w-1 rounded-full bg-[color:var(--neon)]" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </GlassPanel>
            </FadeIn>
          );
        })}
      </div>
    </SectionShell>
  );
}
