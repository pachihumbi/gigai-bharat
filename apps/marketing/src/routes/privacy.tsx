import { createFileRoute } from "@tanstack/react-router";
import { FadeIn } from "@/components/motion/fade-in";
import { EmailLink } from "@/components/contact/email-link";
import { Prose, Section } from "@/components/editorial";
import { businessEmails, publicEmailSurfaces } from "@/data/emails";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () =>
    routeHead(
      "/privacy",
      "Privacy & Legal — GigAI Bharat",
      "Privacy policy, data handling, and legal contact for GigAI Bharat.",
      "GigAI Bharat privacy and legal",
    ),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="page-main">
      <Section label="Legal" title="Privacy & data handling">
        <FadeIn>
          <Prose>
            <p>
              GigAI Bharat is designed DPDP-first — data minimization, purpose-bound processing, and worker ownership of
              earnings data. This marketing site collects contact form submissions only when you choose to send them.
            </p>
            <p>
              Form data is transmitted over TLS, processed by our email infrastructure, and routed to the appropriate
              business inbox. We do not sell contact data. Automated confirmation emails are sent from{" "}
              <strong>no-reply@bharatgig.live</strong>.
            </p>
            <p>
              The worker application at app.bharatgig.live has separate terms governed by authenticated Supabase RLS
              policies. For legal requests, data subject access, or compliance questions:
            </p>
          </Prose>
          <EmailLink email={businessEmails.legal} className="mt-8" />
        </FadeIn>
      </Section>

      <Section label="Contact routing">
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            General & support: {publicEmailSurfaces.footer.join(", ")}
          </li>
          <li>Investor relations: {publicEmailSurfaces.investors.join(", ")}</li>
          <li>Partnerships: {publicEmailSurfaces.partnership[0]}</li>
          <li>Careers: {publicEmailSurfaces.careers[0]}</li>
          <li>Press: {publicEmailSurfaces.press[0]}</li>
        </ul>
        <p className="mt-6 text-xs text-muted-foreground">
          © 2026 GigAI Bharat · Bengaluru, India · MIT open-source core
        </p>
      </Section>
    </main>
  );
}
