import {
  Banknote,
  Brain,
  Map,
  Shield,
  Smartphone,
  Wallet,
} from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { coreModules } from "@/data/landing";
import { cn } from "@/lib/cn";

const icons = {
  ledger: Wallet,
  coach: Brain,
  pay: Banknote,
  safety: Shield,
  dpi: Smartphone,
  mesh: Map,
} as const;

const statusStyle = {
  Live: "border-[color:var(--neon)]/50 text-[color:var(--neon)] bg-[color:var(--neon)]/10",
  Prototype: "border-[color:var(--saffron)]/50 text-[color:var(--saffron)] bg-[color:var(--saffron)]/10",
  Roadmap: "border-border text-muted-foreground bg-muted/30",
} as const;

export function ModulesGrid() {
  return (
    <SectionShell id="modules">
      <FadeIn>
        <SectionLabel>§ 03 / Core infrastructure</SectionLabel>
        <SectionTitle className="mt-4">Six modules. One nervous system.</SectionTitle>
        <p className="mt-4 max-w-2xl text-body text-muted-foreground">
          Production modules ship incrementally — each one returns agency, earnings clarity, or safety
          to the worker who earns it.
        </p>
      </FadeIn>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {coreModules.map((m, i) => {
          const Icon = icons[m.icon];
          return (
            <FadeIn key={m.title} delay={i * 0.05}>
              <article className="flex h-full flex-col border border-border bg-background/40 p-6 transition-all hover:-translate-y-0.5 hover:border-[color:var(--neon)]/25 hover:shadow-[0_0_40px_-12px] hover:shadow-[color:var(--neon)]/20">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center border border-border bg-card">
                    <Icon className="h-5 w-5 text-[color:var(--neon)]" strokeWidth={1.5} />
                  </span>
                  <span
                    className={cn(
                      "rounded-sm border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em]",
                      statusStyle[m.status],
                    )}
                  >
                    {m.status}
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-xl md:text-2xl">{m.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/70">{m.body}</p>
              </article>
            </FadeIn>
          );
        })}
      </div>
    </SectionShell>
  );
}
