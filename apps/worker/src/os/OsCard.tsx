import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Glow = "none" | "neon" | "green" | "saffron";

const glowMap: Record<Glow, string> = {
  none: "",
  neon: "border-primary/40 shadow-[0_0_24px_hsl(var(--primary)/0.15)]",
  green: "border-secondary/40 shadow-[0_0_24px_hsl(var(--secondary)/0.15)]",
  saffron: "border-accent/40 shadow-[0_0_24px_hsl(var(--accent)/0.15)]",
};

export function OsCard({
  children,
  className,
  glow = "none",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  glow?: Glow;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "glass-card rounded-2xl p-4 transition-all",
        onClick && "active:scale-[0.98] text-left w-full",
        glowMap[glow],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function HudLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("text-[10px] font-mono-tech uppercase tracking-[0.2em] text-muted-foreground", className)}>
      {children}
    </span>
  );
}
