import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 border border-[color:var(--neon)]/40 bg-[color:var(--neon)]/5 px-3 py-1.5",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-[color:var(--neon)]" aria-hidden />
      <span className="font-mono text-label uppercase tracking-[0.25em] text-[color:var(--neon)]">
        {children}
      </span>
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-label uppercase tracking-[0.25em] text-[color:var(--saffron)]">
      {children}
    </p>
  );
}

export function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn("font-serif text-display-md leading-tight md:text-display-lg", className)}>
      {children}
    </h2>
  );
}
