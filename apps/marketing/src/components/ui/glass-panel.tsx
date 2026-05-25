import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function GlassPanel({
  children,
  className,
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass-panel relative overflow-hidden transition-shadow duration-300",
        glow && "glass-card-premium glow-card-hover",
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--neon)]/50 to-transparent" />
      {children}
    </div>
  );
}

export function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex h-2 w-2", className)}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--neon)] opacity-40 motion-reduce:animate-none" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--neon)]" />
    </span>
  );
}

export function HudLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-label uppercase tracking-[0.22em] text-muted-foreground">{children}</p>
  );
}

export function HudValue({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-serif text-2xl tabular-nums text-[color:var(--neon)] md:text-3xl", className)}>
      {children}
    </p>
  );
}
