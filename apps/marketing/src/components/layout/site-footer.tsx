import { Link } from "@tanstack/react-router";
import { primaryNav, contactLinks, founderQuote } from "@/data/landing";
import { ButtonLink } from "@/components/ui/button-link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-card/30 pb-24 sm:pb-8">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-12 md:px-12 md:py-20">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center border border-[color:var(--neon)]/50 bg-[color:var(--neon)]/5 font-mono text-xs text-[color:var(--neon)]">
              G/B
            </span>
            <p className="font-mono text-sm uppercase tracking-[0.28em]">GigAI Bharat</p>
          </div>
          <p className="mt-6 max-w-md font-serif text-2xl italic leading-snug md:text-3xl">
            {founderQuote}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Worker-owned intelligence. AI as public infrastructure. Built for Bharat scale — starting
            Bengaluru, designed for 23.5M gig workers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={`mailto:${contactLinks.email}`} variant="ghost" className="min-h-10 px-0">
              {contactLinks.email}
            </ButtonLink>
            <ButtonLink href={contactLinks.github} variant="ghost" external className="min-h-10">
              GitHub →
            </ButtonLink>
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="font-mono text-label uppercase tracking-[0.22em] text-[color:var(--neon)]">
            Platform
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            {primaryNav.slice(1).map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-muted-foreground transition-colors hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="font-mono text-label uppercase tracking-[0.22em] text-[color:var(--saffron)]">
            Trust & operations
          </p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>MIT open-source monorepo</li>
            <li>Supabase RLS · Edge Function AI</li>
            <li>DPDP-first data architecture</li>
            <li>Pilot: Bengaluru · Mumbai · Delhi · Hyderabad</li>
            <li>Tier-2: Lucknow · Surat · Coimbatore</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 font-mono text-label uppercase tracking-[0.2em] text-muted-foreground md:flex-row md:items-center md:justify-between md:px-12">
          <p>© 2026 GigAI Bharat · github.com/pachihumbi</p>
          <p className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-[color:var(--neon)]" />
            Network operational
          </p>
        </div>
      </div>
    </footer>
  );
}
