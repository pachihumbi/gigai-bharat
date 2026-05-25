import { useMemo } from "react";
import { motion } from "framer-motion";
import { useSafeMotion } from "@/hooks/use-safe-motion";

type Particle = { id: number; x: number; y: number; size: number; delay: number; duration: number };

export function FloatingParticles({ count = 24, className = "" }: { count?: number; className?: string }) {
  const skipMotion = useSafeMotion();
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 4,
        duration: 6 + Math.random() * 8,
      })),
    [count],
  );

  if (skipMotion) return null;

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-[color:var(--neon)]/40 shadow-[0_0_12px_var(--neon)]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
