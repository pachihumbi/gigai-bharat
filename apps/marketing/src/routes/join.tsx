import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { contactLinks } from "@/data/landing";
import { routeHead } from "@/lib/seo";

const steps = [
  {
    num: "01",
    title: "Create your worker profile",
    body: "Sign up with phone or Google. Add vehicle type, platforms you drive for, and home city.",
    detail: "~3 minutes on any Android phone",
  },
  {
    num: "02",
    title: "Upload earnings screenshots",
    body: "OCR parses Swiggy, Uber, Rapido, Zomato screenshots into your unified ledger — T+0.",
    detail: "AI vision · human review queue",
  },
  {
    num: "03",
    title: "Build your Gig Credit Score",
    body: "Verified earnings unlock GigPay wallet, micro-loans, and vernacular shift coaching.",
    detail: "Your data · your score · portable",
  },
] as const;

export const Route = createFileRoute("/join")({
  head: () =>
    routeHead(
      "/join",
      "Join GigAI Bharat — Worker onboarding",
      "Three steps to own your earnings: profile, OCR ledger, Gig Credit Score. Built for India's gig workers on low-end Android.",
      "Join GigAI Bharat — Own your earnings",
    ),
  component: JoinPage,
});

function JoinPage() {
  return (
    <main className="page-main">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-backdrop opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-12 md:py-28">
          <SectionLabel>Worker onboarding</SectionLabel>
          <SectionTitle className="mt-4 max-w-3xl text-4xl md:text-6xl">
            Own your earnings.
            <span className="block italic text-[color:var(--neon)]">Own your future.</span>
          </SectionTitle>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/75 md:text-lg">
            GigAI Bharat is the worker-owned layer above delivery apps — a portable ledger, credit
            score, and AI coach that travels with you across platforms.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={contactLinks.app} variant="primary">
              Open worker app →
            </ButtonLink>
            <ButtonLink to="/manifesto" variant="ghost">
              Read the manifesto
            </ButtonLink>
          </div>
        </div>
      </section>

      <SectionShell>
        <SectionLabel>§ Onboarding flow</SectionLabel>
        <SectionTitle className="mt-3">Three steps to bankable identity.</SectionTitle>
        <ol className="mt-12 space-y-6">
          {steps.map((step) => (
            <li
              key={step.num}
              className="grid gap-4 border border-border bg-card/30 p-6 md:grid-cols-12 md:gap-8 md:p-8"
            >
              <p className="font-serif text-4xl text-[color:var(--neon)] md:col-span-1">{step.num}</p>
              <div className="md:col-span-11">
                <h2 className="font-serif text-2xl md:text-3xl">{step.title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/75 md:text-base">
                  {step.body}
                </p>
                <p className="mt-3 font-mono text-label uppercase tracking-[0.18em] text-[color:var(--saffron)]">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </SectionShell>

      <SectionShell className="border-t border-border bg-card/20">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <SectionLabel>What you get</SectionLabel>
            <ul className="mt-6 space-y-4">
              {[
                "Multi-platform earnings OCR",
                "GigPay wallet & credit score",
                "Vernacular shift coach (Kannada / Hindi)",
                "Rest-Lock safety & welfare tracking",
                "Export-ready ledger for loans & tax",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm md:text-base">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--neon)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-[color:var(--neon)]/30 bg-background p-8">
            <p className="font-mono text-label uppercase tracking-[0.2em] text-muted-foreground">
              Ready to start
            </p>
            <p className="mt-4 font-serif text-2xl italic">
              "Your ledger. Your score. Not the platform's."
            </p>
            <ButtonLink href={contactLinks.app} variant="primary" className="mt-8 w-full justify-center">
              Begin onboarding →
            </ButtonLink>
          </div>
        </div>
      </SectionShell>
    </main>
  );
}
