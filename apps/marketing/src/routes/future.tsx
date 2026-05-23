import { createFileRoute } from "@tanstack/react-router";
import { ChapterFooter, PageHero, Prose, PullQuote, Section, StatRow } from "@/components/editorial";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/future")({
  head: () =>
    routeHead(
      "/future",
      "Future India",
      "From assisted dispatch to autonomous fleets. Bharat's path to a worker-owned, AI-coordinated mobility commons.",
      "Future India — autonomy, sovereignty, scale",
    ),
  component: FuturePage,
});

function FuturePage() {
  return (
    <main className="page-main">
      <PageHero
        chapter="05"
        kicker="Chapter 05 // Future India"
        title={<>When autonomy arrives, the <span className="italic text-[color:var(--neon)]">drivers own the rails</span>.</>}
        standfirst="The autonomous transition is a coordination problem with a 15-year horizon. We are building the worker-owned coordination layer first, so when the vehicles change, the ownership doesn't."
      />

      <Section label="§ 5.0" title="Roadmap to 2040">
        <div className="grid gap-10 md:grid-cols-2">
          {[
            { y: "2026", t: "Launch", b: "14 cities. T+0 settlement. Public dispatch model. Worker council formed." },
            { y: "2028", t: "EV majority", b: "30% of new fleet additions are EV. National battery-swap interop." },
            { y: "2031", t: "Coordination commons", b: "Open dispatch APIs. Multi-platform driver portability live." },
            { y: "2035", t: "Assisted autonomy", b: "L4 autonomy on Tier-1 highway corridors. Drivers own the routing licenses." },
            { y: "2040", t: "Worker-owned autonomy", b: "Cooperative-owned autonomous fleets. Mobility GMV ₹14L Cr+." },
          ].map((m) => (
            <article key={m.y} className="border-l-2 border-[color:var(--neon)] pl-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber">{m.y}</p>
              <h3 className="mt-2 font-serif text-3xl italic">{m.t}</h3>
              <p className="mt-3 text-base leading-relaxed text-foreground/75">{m.b}</p>
            </article>
          ))}
        </div>
      </Section>

      <PullQuote>
        Every infrastructure decision we make in 2026 compounds for forty years. We are choosing the right defaults now, while it still costs nothing.
      </PullQuote>

      <section className="mx-auto max-w-7xl px-6 md:px-12">
        <StatRow
          stats={[
            { value: "₹14L Cr", label: "Mobility GMV by 2040", sub: "Bharat — base case" },
            { value: "21M", label: "Workers in coordinated mobility", sub: "Including L4-supervised roles" },
            { value: "100%", label: "Worker-owned data", sub: "Through cooperative governance" },
          ]}
        />
      </section>

      <Section label="§ 5.1" title="Sovereignty as design">
        <Prose>
          <p>
            India's last digital decade was defined by foreign-owned platforms extracting value from Indian labour. The next decade does not have to be.
          </p>
          <p>
            GigAI Bharat is built domestically, governed cooperatively, and architected so that ownership of the coordination layer cannot be re-concentrated. Sovereignty is not a slogan — it is a schema choice.
          </p>
        </Prose>
      </Section>

      <ChapterFooter prev={{ to: "/infrastructure", label: "The Command Center" }} next={{ to: "/", label: "Return to masthead" }} />
    </main>
  );
}
