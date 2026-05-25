import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Prose, Section } from "@/components/editorial";
import { InquiryForm } from "@/components/contact/inquiry-form";
import { EmailChipRow } from "@/components/contact/email-link";
import { ButtonLink } from "@/components/ui/button-link";
import { contactLinks } from "@/data/landing";
import { publicEmailSurfaces } from "@/data/emails";
import { routeHead } from "@/lib/seo";

const roles = [
  {
    title: "Full-stack engineer",
    team: "Product",
    location: "Bengaluru / Remote India",
    body: "React, TypeScript, Supabase, Edge Functions. Build the worker OS — ledger, wallet, OCR pipeline.",
  },
  {
    title: "AI / ML engineer",
    team: "Intelligence",
    location: "Bengaluru / Remote India",
    body: "Vision OCR, RAG shift coach, vernacular models. Gemini + structured outputs at Bharat scale.",
  },
  {
    title: "City operator",
    team: "Field",
    location: "Bengaluru → Tier-2",
    body: "On-ground worker onboarding, fleet partnerships, pilot city expansion. Hindi/Kannada fluency a plus.",
  },
  {
    title: "Founding designer",
    team: "Brand",
    location: "Remote India",
    body: "Dark-mode product UI for low-end Android. Stripe × Palantir sensibility. Motion with restraint.",
  },
] as const;

export const Route = createFileRoute("/hiring")({
  head: () =>
    routeHead(
      "/hiring",
      "Careers — GigAI Bharat",
      "Join the team building India's worker-owned mobility OS. Engineers, AI, city operators, designers.",
      "GigAI Bharat is hiring — build the OS for India's working class",
    ),
  component: HiringPage,
});

function HiringPage() {
  return (
    <main className="page-main">
      <PageHero
        chapter="H"
        kicker="We're hiring"
        title={
          <>
            Build the OS for
            <br />
            <span className="italic text-[color:var(--neon)]">India's working class.</span>
          </>
        }
        standfirst="Engineers, organizers, and city operators who believe mobility belongs to the people who provide it — not the platforms that rent their labour."
      />

      <Section label="Open roles" title="Founding team positions">
        <EmailChipRow emails={publicEmailSurfaces.careers} className="mb-8" />
        <div className="grid gap-4 md:grid-cols-2">
          {roles.map((role) => (
            <article
              key={role.title}
              className="flex flex-col border border-border bg-card/30 p-6 transition-colors hover:border-[color:var(--neon)]/30"
            >
              <p className="font-mono text-label uppercase tracking-[0.2em] text-[color:var(--saffron)]">
                {role.team} · {role.location}
              </p>
              <h3 className="mt-3 font-serif text-2xl">{role.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/70">{role.body}</p>
              <ButtonLink to={contactLinks.careers} variant="ghost" className="mt-6 w-fit px-0">
                Apply →
              </ButtonLink>
            </article>
          ))}
        </div>
      </Section>

      <Section label="How we work">
        <Prose>
          <p>
            GigAI Bharat is an MIT-licensed monorepo building worker-owned infrastructure — not another
            extractive gig app. We ship weekly, default to open source, and design for Jio-speed Android
            before Silicon Valley MacBooks.
          </p>
          <p>
            If you've built at a startup before and care about labour dignity at Bharat scale, we want to
            hear from you — even if no role above fits exactly.
          </p>
        </Prose>
        <InquiryForm type="careers" className="mt-10 max-w-2xl" />
      </Section>
    </main>
  );
}
