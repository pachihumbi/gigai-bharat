import { createFileRoute } from "@tanstack/react-router";
import { ChapterFooter, DataTable, PageHero, Prose, Section } from "@/components/editorial";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/cities")({
  head: () =>
    routeHead(
      "/cities",
      "The City Layer",
      "Live mobility heatmaps and demand prediction as municipal infrastructure across Tier-1, Tier-2, and Tier-3 India.",
      "The City Layer — demand at Bharat scale",
    ),
  component: CitiesPage,
});

function CitiesPage() {
  return (
    <main className="page-main">
      <PageHero
        chapter="03"
        kicker="Chapter 03 // Cities"
        title={<>From Mumbai to <span className="italic text-[color:var(--neon)]">Bareilly</span>.</>}
        standfirst="A platform built for one Indian city is wrong about ten others. The city layer adapts dispatch, vehicle mix, and pricing to the local mobility economy — autorickshaws as a first-class citizen."
      />
      <Section label="Table 3.1" title="Active deployment matrix">
        <DataTable
          columns={[
            { key: "c", label: "City" },
            { key: "t", label: "Tier" },
            { key: "v", label: "Primary vehicle mix" },
            { key: "s", label: "Status" },
          ]}
          rows={[
            { c: "Mumbai", t: "1", v: "Cab + 2W + auto", s: "Live" },
            { c: "Bengaluru", t: "1", v: "Cab + 2W", s: "Live" },
            { c: "Delhi NCR", t: "1", v: "Cab + auto", s: "Live" },
            { c: "Hyderabad", t: "1", v: "Cab + auto", s: "Live" },
            { c: "Pune", t: "2", v: "Cab + 2W", s: "Pilot" },
            { c: "Lucknow", t: "2", v: "Auto + 2W", s: "Pilot" },
            { c: "Surat", t: "2", v: "Auto-first", s: "Q3 launch" },
            { c: "Coimbatore", t: "2", v: "Auto + 2W", s: "Q3 launch" },
            { c: "Bareilly", t: "3", v: "Auto-first", s: "Research" },
          ]}
        />
      </Section>
      <Section label="§ 3.1" title="Demand as municipal infrastructure">
        <Prose>
          <p>
            City-scale demand prediction is not just a dispatch optimization — it's a municipal planning input. GigAI Bharat publishes anonymized demand heatmaps to partner cities under the worker-controlled data licensing program.
          </p>
          <p>
            The full city layer treatment, including the H3 hex demand model and partnerships with municipal transport authorities, is published in Edition 02.
          </p>
        </Prose>
      </Section>
      <ChapterFooter prev={{ to: "/workers", label: "The Worker Layer" }} next={{ to: "/infrastructure", label: "The Command Center" }} />
    </main>
  );
}
