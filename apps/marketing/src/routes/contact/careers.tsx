import { createFileRoute, Link } from "@tanstack/react-router";
import { FadeIn } from "@/components/motion/fade-in";
import { InquiryForm } from "@/components/contact/inquiry-form";
import { EmailChipRow } from "@/components/contact/email-link";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { publicEmailSurfaces } from "@/data/emails";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/contact/careers")({
  head: () =>
    routeHead(
      "/contact/careers",
      "Careers Application — GigAI Bharat",
      "Apply to build India's worker-owned AI operating system. Engineers, AI, operators, designers.",
      "Careers at GigAI Bharat",
    ),
  component: CareersContactPage,
});

const tabs = [
  { label: "General", path: "/contact" },
  { label: "Investors", path: "/contact/investors" },
  { label: "Partnerships", path: "/contact/partnerships" },
  { label: "Careers", path: "/contact/careers" },
  { label: "Press", path: "/contact/press" },
];

function CareersContactPage() {
  return (
    <main className="page-main pt-20">
      <SectionShell>
        <FadeIn>
          <SectionLabel>Careers</SectionLabel>
          <SectionTitle className="mt-4 max-w-3xl">
            Join the <span className="italic text-[color:var(--neon)]">founding team</span>
          </SectionTitle>
          <p className="mt-4 max-w-2xl text-foreground/75">
            We ship weekly, default to open source, and design for Jio-speed Android before Silicon Valley MacBooks.
          </p>
          <EmailChipRow emails={publicEmailSurfaces.careers} className="mt-8" />
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

        <InquiryForm type="careers" className="mt-10 max-w-2xl" />
      </SectionShell>
    </main>
  );
}
