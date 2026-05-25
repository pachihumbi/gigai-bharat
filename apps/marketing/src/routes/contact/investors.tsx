import { createFileRoute, Link } from "@tanstack/react-router";
import { FadeIn } from "@/components/motion/fade-in";
import { InquiryForm } from "@/components/contact/inquiry-form";
import { EmailChipRow } from "@/components/contact/email-link";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { publicEmailSurfaces } from "@/data/emails";
import { routeHead } from "@/lib/seo";
import { cn } from "@/lib/cn";

const siblingTabs = [
  { label: "General", path: "/contact" },
  { label: "Investors", path: "/contact/investors", active: true },
  { label: "Partnerships", path: "/contact/partnerships" },
  { label: "Careers", path: "/contact/careers" },
  { label: "Press", path: "/contact/press" },
] as const;

export const Route = createFileRoute("/contact/investors")({
  head: () =>
    routeHead(
      "/contact/investors",
      "Investor Inquiry — GigAI Bharat",
      "Request data room access, founder briefing, or investor deck for India's worker-owned AI OS.",
      "Investor relations — GigAI Bharat",
    ),
  component: InvestorContactPage,
});

function InvestorContactPage() {
  return (
    <main className="page-main pt-20">
      <SectionShell>
        <FadeIn>
          <SectionLabel>Investor relations</SectionLabel>
          <SectionTitle className="mt-4 max-w-3xl">
            Request <span className="italic text-[color:var(--neon)]">data room access</span>
          </SectionTitle>
          <p className="mt-4 max-w-2xl text-foreground/75">
            Sovereign financial identity for 23.5M workers — embedded finance, EV infrastructure, and AI dispatch at
            Bharat scale.
          </p>
          <EmailChipRow emails={publicEmailSurfaces.investors} className="mt-8" />
        </FadeIn>

        <nav className="mt-10 flex flex-wrap gap-2" aria-label="Contact categories">
          {siblingTabs.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                "border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors",
                "active" in tab && tab.active
                  ? "border-[color:var(--neon)]/50 bg-[color:var(--neon)]/10 text-[color:var(--neon)]"
                  : "border-white/10 text-muted-foreground hover:border-white/25 hover:text-foreground",
              )}
              activeProps={{
                className:
                  "border-[color:var(--neon)]/50 bg-[color:var(--neon)]/10 text-[color:var(--neon)]",
              }}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        <InquiryForm type="investor" className="mt-10 max-w-2xl" />
      </SectionShell>
    </main>
  );
}
