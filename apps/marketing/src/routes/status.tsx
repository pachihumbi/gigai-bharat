import { createFileRoute } from "@tanstack/react-router";
import { GlassPanel, LiveDot, HudLabel, HudValue } from "@/components/ui/glass-panel";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { FadeIn } from "@/components/motion/fade-in";
import { infraStatus } from "@/data/media";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/status")({
  head: () =>
    routeHead(
      "/status",
      "Infrastructure Status — GigAI Bharat",
      "Live operational status for marketing site, worker app, Supabase, OCR pipeline, and Smart Hub nodes.",
      "GigAI Bharat — System Status",
    ),
  component: StatusPage,
});

function StatusPage() {
  const operational = infraStatus.filter((s) => s.status === "operational").length;

  return (
    <main className="page-main pt-20">
      <SectionShell>
        <FadeIn>
          <div className="flex flex-wrap items-center gap-3">
            <LiveDot />
            <SectionLabel>§ Infrastructure status</SectionLabel>
          </div>
          <SectionTitle className="mt-4 max-w-3xl">
            All systems{" "}
            <span className="italic text-[color:var(--neon)]">operational.</span>
          </SectionTitle>
          <p className="mt-4 text-muted-foreground">
            {operational} of {infraStatus.length} core services live · Updated in real time on deploy
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {infraStatus.map((svc, i) => (
            <FadeIn key={svc.service} delay={i * 0.04}>
              <GlassPanel className="flex items-center justify-between p-5">
                <div>
                  <HudLabel>{svc.service}</HudLabel>
                  <p
                    className={`mt-1 font-mono text-sm uppercase tracking-wider ${
                      svc.status === "operational"
                        ? "text-[color:var(--neon)]"
                        : svc.status === "beta"
                          ? "text-[color:var(--saffron)]"
                          : "text-muted-foreground"
                    }`}
                  >
                    {svc.status}
                  </p>
                </div>
                {svc.uptime !== "—" && <HudValue className="text-lg">{svc.uptime}</HudValue>}
              </GlassPanel>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-10">
          <GlassPanel glow className="p-6 text-center">
            <p className="font-mono text-label uppercase tracking-widest text-muted-foreground">Production domains</p>
            <p className="mt-2 font-serif text-xl text-[color:var(--neon)]">www.bharatgig.live · app.bharatgig.live</p>
          </GlassPanel>
        </FadeIn>
      </SectionShell>
    </main>
  );
}
