import { createFileRoute } from "@tanstack/react-router";
import { ChapterFooter, PageHero, Prose, PullQuote, Section, StatRow } from "@/components/editorial";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/workers")({
  head: () =>
    routeHead(
      "/workers",
      "The Worker Layer",
      "Earnings transparency, route intelligence, EV transition, and worker-owned data — the architecture of the GigAI Bharat worker layer.",
      "The Worker Layer — 12 million drivers, one nervous system",
    ),
  component: WorkersPage,
});

function WorkersPage() {
  return (
    <main className="page-main">
      <PageHero
        chapter="02"
        kicker="Chapter 02 // Workers"
        title={<>12 million drivers, <span className="italic text-[color:var(--neon)]">one nervous system</span>.</>}
        standfirst="The worker layer is where the platform earns its right to exist. Earnings transparency, route intelligence, EV financing, and data ownership — fully expanded in the next edition."
      />
      <Section label="§ 2.0" title="What the worker layer guarantees">
        <Prose>
          <p>
            A driver opening GigAI Bharat sees three things the incumbent platforms have refused to show them: the per-trip economics, the dispatch logic that produced this offer, and the cohort earnings band they sit inside.
          </p>
          <p>
            This chapter — fully published in Edition 02 — covers the worker mobile interface, the offline-first dispatch protocol, the 11-language voice support layer, and the EV financing rails.
          </p>
        </Prose>
      </Section>
      <section className="mx-auto max-w-7xl px-6 md:px-12">
        <StatRow
          stats={[
            { value: "T+0", label: "Settlement window", sub: "Every completed trip" },
            { value: "11", label: "Launch languages", sub: "Voice + text" },
            { value: "100%", label: "Earnings transparency", sub: "Per-trip P&L" },
          ]}
        />
      </section>
      <PullQuote>The worker is not the customer of this platform. They are the platform.</PullQuote>
      <ChapterFooter prev={{ to: "/manifesto", label: "The Manifesto" }} next={{ to: "/cities", label: "The City Layer" }} />
    </main>
  );
}
