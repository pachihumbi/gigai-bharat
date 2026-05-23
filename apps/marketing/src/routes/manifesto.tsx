import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChapterFooter, DataTable, PageHero, Prose, PullQuote, Section, StatRow } from "@/components/editorial";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/manifesto")({
  head: () =>
    routeHead(
      "/manifesto",
      "The Manifesto",
      "Why the people who move India deserve an operating system of their own. AI as public infrastructure, worker-owned intelligence, and a mobility commons for Bharat.",
      "The GigAI Bharat Manifesto",
    ),
  component: ManifestoPage,
});

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

function Tenet({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="grid gap-6 border-t border-border py-12 md:grid-cols-12"
    >
      <div className="md:col-span-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--neon)]">Tenet {n}</p>
        <h3 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">{title}</h3>
      </div>
      <div className="md:col-span-8 md:col-start-5">
        <div className="space-y-5 text-base leading-relaxed text-foreground/80 md:text-lg">
          {children}
        </div>
      </div>
    </motion.article>
  );
}

function ManifestoPage() {
  return (
    <main className="page-main">
      <PageHero
        chapter="01"
        kicker="Chapter 01 // Manifesto"
        title={
          <>
            A nervous system for{" "}
            <span className="italic text-[color:var(--neon)]">Bharat's</span> mobility.
          </>
        }
        standfirst="Twelve million Indians earn their living moving people, food, and goods across cities that were never designed for them. This is the document that explains why we are building their operating system — and why it must be public, intelligent, and theirs."
      />

      {/* The dignity crisis */}
      <Section label="§ 1.0" title="The dignity crisis">
        <Prose>
          <p>
            India runs on the labour of its drivers, riders, and couriers. They are the human throughput of every food order, every airport pickup, every late-night hospital run. And yet the platforms they work for treat their data as proprietary, their earnings as opaque, and their welfare as someone else's regulatory problem.
          </p>
          <p>
            The contemporary gig worker is asked to bear three asymmetries simultaneously: <strong className="text-foreground">capital asymmetry</strong> (they own the vehicle, the platform owns the rent), <strong className="text-foreground">information asymmetry</strong> (the algorithm sees demand; the driver sees only the next ride), and <strong className="text-foreground">algorithmic asymmetry</strong> (rating, suspension, and deactivation occur without recourse).
          </p>
          <p>
            These are not bugs. They are the architecture. And architecture can be rewritten.
          </p>
        </Prose>
      </Section>

      <PullQuote attribution="GigAI Bharat — Founding Statement, 2026">
        We do not believe extractive platforms are the natural form of digital coordination. They are a transient stage — a 2010s artefact we will look back on with the same discomfort with which we now read about company towns.
      </PullQuote>

      {/* Crisis stats */}
      <section className="mx-auto max-w-7xl px-6 md:px-12">
        <StatRow
          stats={[
            { value: "62 hrs", label: "Avg. weekly hours per driver", sub: "Tier-1 metros, 2025" },
            { value: "₹17,400", label: "Median monthly take-home", sub: "After fuel, EMI, commission" },
            { value: "31%", label: "Of trips dispatched at a loss", sub: "When fuel is correctly priced" },
          ]}
        />
      </section>

      {/* The five tenets */}
      <Section label="§ 2.0" title="Five tenets of a worker-owned mobility commons">
        <div className="text-foreground/70 mb-2 text-base md:text-lg">
          Each is non-negotiable. Each maps to an architectural decision in the GigAI Bharat platform.
        </div>
      </Section>

      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Tenet n="01" title="AI must be public infrastructure, not extractive surveillance.">
          <p>
            The model that decides which driver gets which ride is a piece of public infrastructure. It allocates income. It shapes cities. It deserves the same scrutiny as the road itself.
          </p>
          <p>
            GigAI Bharat publishes its dispatch model's objective function, fairness constraints, and historical fairness audits. The black box era ends when the algorithm becomes a public utility.
          </p>
        </Tenet>

        <Tenet n="02" title="Workers own the data they generate.">
          <p>
            Every kilometre driven, every battery cycle, every customer interaction is data created <em>by</em> the worker. They retain ownership, portability, and a share of the economic surplus their data produces.
          </p>
          <p>
            Concretely: workers can export their full earnings and route history, transfer reputation across platforms, and collectively license aggregated mobility data to municipalities — with revenue flowing back to the cohort that generated it.
          </p>
        </Tenet>

        <Tenet n="03" title="Earnings are settled in seconds, not after seven days of float.">
          <p>
            The capital float that platforms extract by holding earnings is one of the largest hidden taxes on Indian gig work. UPI and instant settlement rails have made T+0 a solved problem; the only reason it isn't standard is because it isn't profitable for the incumbent.
          </p>
          <p>
            GigAI Bharat settles every completed trip to the worker's UPI handle within 10 seconds of drop-off, transparently, with the per-trip economics published to them in plain Hindi, Tamil, Bangla, or English.
          </p>
        </Tenet>

        <Tenet n="04" title="The EV transition is a coordination problem, not a moral one.">
          <p>
            India will not electrify mobility through individual choice. It will electrify through coordinated infrastructure: shared charging, predictive state-of-charge routing, fleet financing, and battery-swap networks that match charge cycles to demand cycles.
          </p>
          <p>
            GigAI Bharat treats EV adoption as an optimization problem the platform must solve <em>for</em> the worker — not a cost the worker must absorb to be eligible for fewer rides.
          </p>
        </Tenet>

        <Tenet n="05" title="Bharat scale, Bharat languages, Bharat economics.">
          <p>
            A platform built for Bandra cannot serve Bareilly. Tier-2 and Tier-3 India has different vehicle mixes, different fuel economics, different connectivity, and different trust networks.
          </p>
          <p>
            We design for the smallest screen, the slowest connection, the most expensive megabyte. We localize in eleven languages at launch. We architect dispatch for autorickshaws as a first-class citizen, not an afterthought.
          </p>
        </Tenet>
      </div>

      {/* AI as public infrastructure */}
      <Section label="§ 3.0" title="AI as public infrastructure">
        <Prose>
          <p>
            For most of the last decade, "AI" in mobility meant one thing: a surge-pricing function in a private repository. The rest of the so-called intelligence was customer-facing UX over a fairly conventional dispatch graph.
          </p>
          <p>
            GigAI Bharat's bet is that the next decade is different. Foundation models, geospatial transformers, and on-device inference make it possible to run a national-scale dispatch nervous system that is genuinely intelligent — and to run it as a commons.
          </p>
        </Prose>
      </Section>

      <Section label="Table 3.1" title="The model graph">
        <DataTable
          columns={[
            { key: "m", label: "Model" },
            { key: "p", label: "Purpose" },
            { key: "o", label: "Owned by" },
          ]}
          rows={[
            { m: "Demand transformer (city-scale)", p: "15-min demand forecast per H3 hex", o: "Public — open weights" },
            { m: "Dispatch policy (multi-agent RL)", p: "Match drivers to riders fairly", o: "Public — fairness audited" },
            { m: "EV state-of-charge router", p: "Battery-aware route + charge planning", o: "Public — open weights" },
            { m: "Earnings transparency model", p: "Per-trip P&L for each driver", o: "Worker-owned" },
            { m: "Fraud / safety classifier", p: "Anomaly detection on trips", o: "Co-managed (worker council)" },
            { m: "Conversational support agent", p: "11-language voice + text support", o: "Worker-owned reputation" },
          ]}
        />
      </Section>

      {/* Bharat scale */}
      <Section label="§ 4.0" title="Bharat scale, by 2030">
        <Prose>
          <p>
            The Bharat opportunity is not a translated version of the Western platform thesis. It is a different problem with a different shape:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>~12.4 million workers in mobility-adjacent gig roles, growing ~9% YoY.</li>
            <li>An EV transition that will move from 4.7% to a target of 30% of new fleet additions by 2030.</li>
            <li>Tier-2 and Tier-3 demand growing 2.4× faster than Tier-1 metros.</li>
            <li>UPI as a settlement primitive — already at 14B+ monthly transactions — making T+0 economically free.</li>
            <li>The DPDP Act, 2023, requiring data-principal consent flows that align cleanly with worker-owned data.</li>
          </ul>
          <p>
            The infrastructure that wins this decade will not be a louder app. It will be the most trusted, most coordinated, and most worker-aligned coordination layer.
          </p>
        </Prose>
      </Section>

      <PullQuote attribution="GigAI Bharat — Manifesto, § 5.0">
        The autonomous future is not a replacement for drivers. It is the network they coordinate. We are building so that when autonomy arrives, the people who built the routes own the rails.
      </PullQuote>

      {/* Closing */}
      <Section label="§ 6.0" title="What we are committing to">
        <Prose>
          <p>
            This document is a contract before it is a pitch. We are committing to:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Open dispatch model weights and quarterly fairness audits — published, third-party verified.</li>
            <li>Worker-owned data with full export, portability, and licensing rights.</li>
            <li>T+0 settlement on every completed trip, in every city we operate.</li>
            <li>A worker council with binding governance authority over policy changes that affect earnings.</li>
            <li>EV financing programs underwritten by aggregated platform performance, not individual credit scores.</li>
            <li>Eleven languages on day one. Voice-first interfaces by year two.</li>
          </ul>
          <p>
            None of this is generous. It is, simply, correct. It is what the architecture should have looked like the first time.
          </p>
        </Prose>
      </Section>

      <ChapterFooter
        prev={{ to: "/", label: "The masthead" }}
        next={{ to: "/workers", label: "The Worker Layer" }}
      />
    </main>
  );
}
