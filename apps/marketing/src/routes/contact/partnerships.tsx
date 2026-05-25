import { createFileRoute, Link } from "@tanstack/react-router";
import { FadeIn } from "@/components/motion/fade-in";
import { InquiryForm } from "@/components/contact/inquiry-form";
import { EmailChipRow } from "@/components/contact/email-link";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { publicEmailSurfaces } from "@/data/emails";
import { routeHead } from "@/lib/seo";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/contact/partnerships")({
  head: () =>
    routeHead(
      "/contact/partnerships",
      "Partnerships — GigAI Bharat",
      "Fleet, EV charging, city, and technology partnerships for India's worker mobility infrastructure.",
      "Partner with GigAI Bharat",
    ),
  component: PartnershipContactPage,
});

const tabs = [
  { label: "General", path: "/contact" },
  { label: "Investors", path: "/contact/investors" },
  { label: "Partnerships", path: "/contact/partnerships" },
  { label: "Careers", path: "/contact/careers" },
  { label: "Press", path: "/contact/press" },
];

function PartnershipContactPage() {
  return (
    <main className="page-main pt-20">
      <SectionShell>
        <FadeIn>
          <SectionLabel>Partnerships</SectionLabel>
          <SectionTitle className="mt-4 max-w-3xl">
            Build the <span className="italic text-[color:var(--neon)]">mobility mesh</span> with us
          </SectionTitle>
          <p className="mt-4 max-w-2xl text-foreground/75">
            VinFast fleet intelligence, smart charging hubs, and city-scale dispatch — partner at infrastructure layer,
            not app layer.
          </p>
          <EmailChipRow emails={publicEmailSurfaces.partnership} className="mt-8" />
        </FadeIn>

        <nav className="mt-10 flex flex-wrap gap-2" aria-label="Contact categories">
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className="border border-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-white/25 hover:text-foreground"
              activeProps={{
                className:
                  "border-[color:var(--neon)]/50 bg-[color:var(--neon)]/10 text-[color:var(--neon)]",
              }}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        <InquiryForm type="partnership" className="mt-10 max-w-2xl" />
      </SectionShell>
    </main>
  );
}
