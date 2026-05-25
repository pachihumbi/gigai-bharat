import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { primaryNav, contactLinks } from "@/data/landing";
import { ButtonLink } from "@/components/ui/button-link";

const tickerItems = [
  "India's Worker-Owned Mobility Operating System",
  "GigPay · Instant UPI payouts · Worker wallet",
  "GigEV · VinFast · Tata · Mahindra fleet intelligence",
  "GigPods · Smart pods · EV hubs · Gurukul AI",
  "FleetOS · Real-time dispatch · Demand heatmaps",
  "ShramSetu · Welfare · Insurance · Pension eligibility",
  "23.5M gig workers · DPDP-aligned by design",
];

export function Ticker() {
  const loop = [...tickerItems, ...tickerItems];
  return (
    <div className="overflow-hidden border-b border-border bg-graphite motion-reduce:overflow-x-auto">
      <div
        className="flex animate-ticker whitespace-nowrap py-2.5 font-mono text-label uppercase tracking-[0.22em] text-muted-foreground motion-reduce:animate-none"
        aria-hidden
      >
        {loop.map((t, i) => (
          <span key={i} className="flex items-center px-5">
            <span className="mr-2.5 inline-block h-1 w-1 rounded-full bg-[color:var(--saffron)]" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="glass-nav sticky top-0 z-50 border-b border-border">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-12">
        <Link to="/" className="group flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center border border-[color:var(--neon)]/50 bg-[color:var(--neon)]/5">
            <span className="absolute inset-0 grid-backdrop-fine opacity-50" aria-hidden />
            <span className="font-mono text-xs font-medium text-[color:var(--neon)]">G/B</span>
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate font-mono text-sm font-medium uppercase tracking-[0.28em] transition-colors group-hover:text-[color:var(--neon)]">
              GigAI Bharat
            </p>
            <p className="font-mono text-label uppercase tracking-[0.22em] text-muted-foreground">
              Mobility OS
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {primaryNav.map((l) => (
            <a
              key={l.to}
              href={l.to}
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="rounded-sm px-3 py-2 font-mono text-label uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-[color:var(--neon)]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink
            href={contactLinks.github}
            variant="ghost"
            external
            className="hidden min-h-9 px-3 sm:inline-flex"
          >
            GitHub
          </ButtonLink>
          <ButtonLink href={contactLinks.app} variant="primary" className="hidden min-h-9 px-4 sm:inline-flex">
            Worker app →
          </ButtonLink>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-border lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t border-border bg-background px-5 py-4 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="space-y-1">
            {primaryNav.map((l) => (
              <li key={l.to}>
                <a
                  href={l.to}
                  {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="block rounded-sm py-3 font-mono text-sm uppercase tracking-[0.2em] text-foreground/80"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/manifesto"
                className="block rounded-sm py-3 font-mono text-sm uppercase tracking-[0.2em] text-foreground/80"
                onClick={() => setOpen(false)}
              >
                Manifesto
              </a>
            </li>
          </ul>
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            <ButtonLink href={contactLinks.investors} variant="primary" className="w-full">
              Investor intro →
            </ButtonLink>
            <ButtonLink to="/join" variant="secondary" className="w-full">
              Join as worker →
            </ButtonLink>
            <ButtonLink to="/hiring" variant="ghost" className="w-full">
              We're hiring →
            </ButtonLink>
            <ButtonLink href={contactLinks.github} variant="ghost" external className="w-full">
              View on GitHub
            </ButtonLink>
          </div>
        </nav>
      )}

      <Ticker />
    </header>
  );
}

export function MobileStickyCTA() {
  return (
    <div className="glass-nav fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--neon)]/30 p-3 sm:hidden">
      <div className="mx-auto flex max-w-lg gap-2">
        <ButtonLink href={contactLinks.investors} variant="primary" className="flex-1 min-h-11 text-label">
          Investors →
        </ButtonLink>
        <ButtonLink to="/join" variant="secondary" className="flex-1 min-h-11 text-label">
          Join →
        </ButtonLink>
      </div>
    </div>
  );
}
