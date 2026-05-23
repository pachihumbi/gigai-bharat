import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

const styles: Record<Variant, string> = {
  primary:
    "border border-[color:var(--neon)] bg-[color:var(--neon)] text-[color:var(--accent-foreground)] hover:bg-transparent hover:text-[color:var(--neon)]",
  secondary:
    "border border-foreground bg-foreground text-background hover:bg-transparent hover:text-foreground",
  ghost: "border border-transparent text-muted-foreground hover:text-[color:var(--neon)]",
};

export function ButtonLink({
  to,
  href,
  children,
  variant = "primary",
  className,
  external,
}: {
  to?: string;
  href?: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
}) {
  const base = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors",
    styles[variant],
    className,
  );

  if (href) {
    return (
      <a
        href={href}
        className={base}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={to ?? "/"} className={base}>
      {children}
    </Link>
  );
}
