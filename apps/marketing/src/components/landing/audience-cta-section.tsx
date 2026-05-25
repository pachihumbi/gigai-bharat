import { Bike, Building2, TrendingUp } from "lucide-react";
import { audienceCTAs } from "@/data/landing";
import { StaggerChildren, StaggerItem } from "@/components/motion/cinematic-reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { cn } from "@/lib/cn";

const icons = {
  workers: Bike,
  fleet: Building2,
  investors: TrendingUp,
} as const;

export function AudienceCTASection() {
  return (
    <SectionShell id="audience" className="border-t border-border">
      <StaggerChildren>
        <StaggerItem>
          <SectionLabel>§ Choose your lane</SectionLabel>
          <SectionTitle className="mt-3">Built for the entire mobility stack.</SectionTitle>
        </StaggerItem>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {audienceCTAs.map((cta) => {
            const Icon = icons[cta.audience];
            return (
              <StaggerItem key={cta.audience}>
                <article
                  className={cn(
                    "group flex h-full flex-col border border-border bg-card/30 p-6 transition-all duration-500",
                    "hover:-translate-y-1 hover:border-[color:var(--neon)]/35 hover:shadow-[0_0_50px_-15px] hover:shadow-[color:var(--neon)]/20",
                  )}
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center border border-border bg-background">
                    <Icon className="h-5 w-5 text-[color:var(--neon)]" strokeWidth={1.5} />
                  </span>
                  <p className="mt-5 font-mono text-label uppercase tracking-[0.2em] text-[color:var(--saffron)]">
                    {cta.kicker}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl md:text-3xl">{cta.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/70">{cta.body}</p>
                  <ul className="mt-4 space-y-2">
                    {cta.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs text-muted-foreground md:text-sm">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[color:var(--neon)]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <ButtonLink
                      href={cta.href.startsWith("http") ? cta.href : undefined}
                      to={cta.href.startsWith("/") ? cta.href : undefined}
                      variant={cta.primary ? "primary" : "ghost"}
                      external={cta.href.startsWith("http")}
                      className="w-full justify-center sm:w-auto"
                    >
                      {cta.ctaLabel} →
                    </ButtonLink>
                    {cta.audience === "fleet" && (
                      <p className="mt-4 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                        Or email{" "}
                        <a
                          href="mailto:partnerships@bharatgig.live"
                          className="text-[color:var(--neon)] hover:underline"
                        >
                          partnerships@bharatgig.live
                        </a>
                      </p>
                    )}
                    {cta.audience === "investors" && (
                      <p className="mt-4 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                        investors@ · founder@bharatgig.live
                      </p>
                    )}
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </div>
      </StaggerChildren>
    </SectionShell>
  );
}
