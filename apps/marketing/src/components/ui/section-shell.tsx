import { cn } from "@/lib/cn";

export function SectionShell({
  id,
  children,
  className,
  bleed = false,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  bleed?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        bleed ? "w-full" : "mx-auto max-w-7xl px-5 py-section md:px-12",
        className,
      )}
    >
      {children}
    </section>
  );
}
