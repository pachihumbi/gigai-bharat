import { createFileRoute, Link } from "@tanstack/react-router";
import { FadeIn } from "@/components/motion/fade-in";
import { InquiryForm } from "@/components/contact/inquiry-form";
import { EmailChipRow } from "@/components/contact/email-link";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { publicEmailSurfaces } from "@/data/emails";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/contact/press")({
  head: () =>
    routeHead(
      "/contact/press",
      "Press Inquiry — GigAI Bharat",
      "Media inquiries, founder interviews, and press assets for GigAI Bharat.",
      "Press — GigAI Bharat",
    ),
  component: PressContactPage,
});

const tabs = [
  { label: "General", path: "/contact" },
  { label: "Investors", path: "/contact/investors" },
  { label: "Partnerships", path: "/contact/partnerships" },
  { label: "Careers", path: "/contact/careers" },
  { label: "Press", path: "/contact/press" },
];

function PressContactPage() {
  return (
    <main className="page-main pt-20">
      <SectionShell>
        <FadeIn>
          <SectionLabel>Press & media</SectionLabel>
          <SectionTitle className="mt-4 max-w-3xl">
            Cover the <span className="italic text-[color:var(--neon)]">infrastructure story</span>
          </SectionTitle>
          <p className="mt-4 max-w-2xl text-foreground/75">
            India's worker-owned AI OS — mobility, embedded finance, and nation-scale dispatch. Request assets, founder
            availability, or briefing materials.
          </p>
          <EmailChipRow emails={publicEmailSurfaces.press} className="mt-8" />
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

        <InquiryForm type="press" className="mt-10 max-w-2xl" />
      </SectionShell>
    </main>
  );
}
