import { createFileRoute } from "@tanstack/react-router";
import { ChapterFooter, DataTable, PageHero, Prose, PullQuote, Section } from "@/components/editorial";
import { IndiaNetwork } from "@/components/india-network";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/infrastructure")({
  head: () =>
    routeHead(
      "/infrastructure",
      "The AI Command Center",
      "Real-time dispatch, EV state-of-charge optimization, fraud detection, and instant settlement — the model graph powering GigAI Bharat.",
      "The AI Command Center — dispatch, prediction, settlement",
    ),
  component: InfraPage,
});

function InfraPage() {
  return (
    <main className="page-main">
      <PageHero
        chapter="04"
        kicker="Chapter 04 // Command Center"
        title={<>The model graph behind <span className="italic text-[color:var(--neon)]">every match</span>.</>}
        standfirst="Six models, one shared substrate. The GigAI Bharat command center is the public, audited intelligence layer routing 12 million workers across 14 cities — designed to run on intermittent networks and explain itself in plain language."
      />

      <section className="relative mx-auto max-w-7xl overflow-hidden border-y border-border md:px-12">
        <div className="absolute inset-0 grid-backdrop opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/0 to-background" aria-hidden />
        <div className="relative grid items-center gap-8 px-6 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber">// Live network</p>
            <h3 className="mt-3 font-serif text-4xl italic md:text-5xl">14 cities. One graph.</h3>
            <p className="mt-6 max-w-md text-base leading-relaxed text-foreground/75">
              Every node is a city dispatch cell. Every edge is a coordination link — model weights, demand telemetry, settlement reconciliation. The mesh is the product.
            </p>
          </div>
          <div className="md:col-span-7">
            <IndiaNetwork className="h-[460px] w-full text-foreground" />
          </div>
        </div>
      </section>

      <Section label="Table 4.1" title="The model graph">
        <DataTable
          columns={[
            { key: "m", label: "Model" },
            { key: "f", label: "Function" },
            { key: "l", label: "p50 latency" },
            { key: "o", label: "Ownership" },
          ]}
          rows={[
            { m: "Demand transformer", f: "15-min forecast / H3 hex", l: "180 ms", o: "Public weights" },
            { m: "Dispatch policy", f: "Multi-agent fair matching", l: "1.8 s", o: "Public + audited" },
            { m: "EV SoC router", f: "Battery-aware routing", l: "240 ms", o: "Public weights" },
            { m: "Earnings transparency", f: "Per-trip P&L generation", l: "60 ms", o: "Worker-owned" },
            { m: "Fraud / safety", f: "Trip anomaly detection", l: "90 ms", o: "Co-managed" },
            { m: "Voice support agent", f: "11-lang conversational", l: "0.9 s", o: "Worker reputation" },
          ]}
        />
      </Section>

      <PullQuote attribution="GigAI Bharat — Engineering Charter">
        We optimize for the 4G connection on a five-year-old phone in a tunnel between Borivali and Andheri. Everything else is a rounding error.
      </PullQuote>

      <Section label="§ 4.2" title="Settlement & trust rails">
        <Prose>
          <p>
            Every completed trip writes to a UPI settlement queue and a public reconciliation log. The worker sees their earning before they finish parking; the city operator sees the aggregate; the auditor sees the chain.
          </p>
          <p>
            Full architectural deep-dive — including the offline-first dispatch protocol, the federated demand model, and the DPDP-aligned consent flows — published in Edition 02.
          </p>
        </Prose>
      </Section>

      <ChapterFooter prev={{ to: "/cities", label: "The City Layer" }} next={{ to: "/future", label: "Future India" }} />
    </main>
  );
}
