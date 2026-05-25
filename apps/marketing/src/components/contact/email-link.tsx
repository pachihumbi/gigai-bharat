import { Mail } from "lucide-react";
import { cn } from "@/lib/cn";

export function EmailLink({
  email,
  className,
  label,
}: {
  email: string;
  className?: string;
  label?: string;
}) {
  return (
    <a
      href={`mailto:${email}`}
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-[color:var(--neon)]",
        className,
      )}
    >
      <Mail className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
      <span>{label ?? email}</span>
    </a>
  );
}

export function EmailChipRow({
  emails,
  className,
}: {
  emails: readonly string[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-x-6 gap-y-3", className)}>
      {emails.map((email) => (
        <EmailLink key={email} email={email} />
      ))}
    </div>
  );
}
