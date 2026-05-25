import { createFileRoute, Link } from "@tanstack/react-router";
import { FadeIn } from "@/components/motion/fade-in";
import { EmailLink } from "@/components/contact/email-link";
import { InquiryForm } from "@/components/contact/inquiry-form";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { businessEmails, publicEmailSurfaces } from "@/data/emails";
import { mediaAssets } from "@/data/media";
import { routeHead } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/button-link";

export const Route = createFileRoute("/press")({
  head: () =>
    routeHead(
      "/press",
      "Press — GigAI Bharat",
      "Media kit, founder story, and press inquiries for GigAI Bharat — India's worker-owned AI infrastructure.",
      "GigAI Bharat press room",
    ),
  component: PressPage,
});

function PressPage() {
  return (
    <main className="page-main pt-20">
      <SectionShell>
        <FadeIn>
          <SectionLabel>Press room</SectionLabel>
          <SectionTitle className="mt-4 max-w-3xl">
            Media assets & <span className="italic text-[color:var(--neon)]">founder access</span>
          </SectionTitle>
          <p className="mt-4 max-w-2xl text-foreground/75">
            GigAI Bharat is building digital public infrastructure for 23.5M gig workers — worker-owned ledger, EV
            fleet intelligence, and AI dispatch at nation scale.
          </p>
          <EmailLink email={businessEmails.press} className="mt-8" />
        </FadeIn>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {mediaAssets.slice(0, 2).map((asset) => (
            <article
              key={asset.id}
              className="border border-border bg-card/30 p-6 transition-colors hover:border-[color:var(--neon)]/30"
            >
              <p className="font-mono text-label uppercase tracking-[0.2em] text-[color:var(--saffron)]">
                {asset.type}
              </p>
              <h3 className="mt-3 font-serif text-2xl">{asset.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{asset.description}</p>
              <ButtonLink to="/contact/press" variant="ghost" className="mt-6 px-0">
                Request via press desk →
              </ButtonLink>
            </article>
          ))}
        </div>

        <InquiryForm type="press" className="mt-14 max-w-2xl" />

        <p className="mt-8 text-sm text-muted-foreground">
          Legal & brand usage:{" "}
          <Link to="/privacy" className="text-[color:var(--neon)] hover:underline">
            Privacy & legal
          </Link>{" "}
          · Direct:{" "}
          <a href={`mailto:${publicEmailSurfaces.press[0]}`} className="text-[color:var(--neon)] hover:underline">
            {publicEmailSurfaces.press[0]}
          </a>
        </p>
      </SectionShell>
    </main>
  );
}
