import { createFileRoute } from "@tanstack/react-router";
import { GlassPanel, LiveDot, HudLabel } from "@/components/ui/glass-panel";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { FadeIn } from "@/components/motion/fade-in";
import { ButtonLink } from "@/components/ui/button-link";
import { roadmapPhases } from "@/data/media";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/roadmap")({
  head: () =>
    routeHead(
      "/roadmap",
      "Public Roadmap — GigAI Bharat",
      "Bengaluru pilot to national Smart Hub network. Open roadmap for India's worker-owned AI labor operating system.",
      "GigAI Bharat — Public Roadmap",
    ),
  component: RoadmapPage,
});

function RoadmapPage() {
  return (
    <main className="page-main pt-20">
      <SectionShell>
        <FadeIn>
          <SectionLabel>§ Public roadmap</SectionLabel>
          <SectionTitle className="mt-4 max-w-3xl">
            From Bengaluru pilot to{" "}
            <span className="italic text-[color:var(--neon)]">national labor OS.</span>
          </SectionTitle>
        </FadeIn>

        <div className="mt-12 space-y-6">
          {roadmapPhases.map((phase, i) => (
            <FadeIn key={phase.phase} delay={i * 0.06}>
              <GlassPanel
                className={`p-6 md:p-8 ${phase.status === "live" ? "border-[color:var(--neon)]/40" : ""}`}
                glow={phase.status === "live"}
              >
                <div className="flex flex-wrap items-center gap-3">
                  {phase.status === "live" && <LiveDot />}
                  <HudLabel>{phase.phase}</HudLabel>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-wider ${
                      phase.status === "live"
                        ? "text-[color:var(--neon)]"
                        : phase.status === "active"
                          ? "text-[color:var(--saffron)]"
                          : "text-muted-foreground"
                    }`}
                  >
                    {phase.status}
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-2xl">{phase.title}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {phase.items.map((item) => (
                    <li
                      key={item}
                      className="border border-border bg-card/50 px-3 py-1.5 font-mono text-xs uppercase tracking-wider"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassPanel>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-10">
          <ButtonLink href="/future" variant="ghost">
            Read 2030 vision chapter →
          </ButtonLink>
        </FadeIn>
      </SectionShell>
    </main>
  );
}
