import { createFileRoute, Link } from "@tanstack/react-router";
import { FadeIn } from "@/components/motion/fade-in";
import { InquiryForm } from "@/components/contact/inquiry-form";
import { EmailChipRow } from "@/components/contact/email-link";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { businessEmails, publicEmailSurfaces, type InquiryType } from "@/data/emails";
import { routeHead } from "@/lib/seo";
import { cn } from "@/lib/cn";

const tabs: { type: InquiryType; label: string; path: string }[] = [
  { type: "contact", label: "General", path: "/contact" },
  { type: "investor", label: "Investors", path: "/contact/investors" },
  { type: "partnership", label: "Partnerships", path: "/contact/partnerships" },
  { type: "careers", label: "Careers", path: "/contact/careers" },
  { type: "press", label: "Press", path: "/contact/press" },
];

export const Route = createFileRoute("/contact/")({
  head: () =>
    routeHead(
      "/contact",
      "Contact — GigAI Bharat",
      "Reach GigAI Bharat — support, investor relations, partnerships, careers, and press.",
      "Contact GigAI Bharat command center",
    ),
  component: ContactPage,
});

function ContactPage() {
  return (
    <main className="page-main pt-20">
      <SectionShell>
        <FadeIn>
          <SectionLabel>Command center</SectionLabel>
          <SectionTitle className="mt-4 max-w-3xl">
            Direct line to <span className="italic text-[color:var(--neon)]">GigAI Bharat</span>
          </SectionTitle>
          <p className="mt-4 max-w-2xl text-foreground/75">
            Investor-ready infrastructure deserves investor-grade communication. Choose your channel — we route every
            message to the right desk.
          </p>
          <EmailChipRow emails={publicEmailSurfaces.footer} className="mt-8" />
        </FadeIn>

        <nav className="mt-10 flex flex-wrap gap-2" aria-label="Contact categories">
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                "border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors",
                tab.type === "contact"
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

        <InquiryForm type="contact" className="mt-10 max-w-2xl" />

        <p className="mt-8 max-w-xl text-sm text-muted-foreground">
          Prefer email? Write to{" "}
          <a href={`mailto:${businessEmails.hello}`} className="text-[color:var(--neon)] hover:underline">
            {businessEmails.hello}
          </a>{" "}
          or{" "}
          <a href={`mailto:${businessEmails.support}`} className="text-[color:var(--neon)] hover:underline">
            {businessEmails.support}
          </a>
          .
        </p>
      </SectionShell>
    </main>
  );
}
