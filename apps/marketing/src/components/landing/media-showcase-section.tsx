import { Play, FileText, Headphones } from "lucide-react";
import { GlassPanel, HudLabel } from "@/components/ui/glass-panel";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { FadeIn } from "@/components/motion/fade-in";
import { ButtonLink } from "@/components/ui/button-link";
import { mediaAssets } from "@/data/media";

const icons = {
  presentation: FileText,
  video: Play,
  audio: Headphones,
} as const;

export function MediaShowcaseSection({ compact = false }: { compact?: boolean }) {
  return (
    <SectionShell id="media" className={compact ? "border-t border-border/60" : "border-y border-border/60 bg-midnight/20"}>
      {!compact && (
        <FadeIn>
          <SectionLabel>§ Media & assets</SectionLabel>
          <SectionTitle className="mt-4 max-w-3xl">Founder vision. Investor-ready collateral.</SectionTitle>
        </FadeIn>
      )}

      <div className={`grid gap-6 sm:grid-cols-2 ${compact ? "mt-0" : "mt-12"} lg:grid-cols-4`}>
        {mediaAssets.map((asset, i) => {
          const Icon = icons[asset.type];
          const external = asset.href.startsWith("http");
          const internal = asset.href.startsWith("/");
          return (
            <FadeIn key={asset.id} delay={i * 0.05}>
              <GlassPanel className="group flex h-full flex-col overflow-hidden transition-colors hover:border-[color:var(--neon)]/40">
                <div className="relative aspect-video overflow-hidden bg-midnight">
                  <img
                    src={asset.thumbnail}
                    alt=""
                    className="h-full w-full object-cover opacity-60 transition-opacity group-hover:opacity-80"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-background/40">
                    <Icon className="h-10 w-10 text-[color:var(--neon)] opacity-80" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <HudLabel>{asset.type}</HudLabel>
                  <h3 className="mt-2 font-serif text-lg">{asset.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{asset.description}</p>
                  <ButtonLink
                    href={internal || external ? asset.href : undefined}
                    to={internal ? asset.href : undefined}
                    variant="ghost"
                    external={external}
                    className="mt-4 w-fit px-0"
                  >
                    {asset.cta} →
                  </ButtonLink>
                </div>
              </GlassPanel>
            </FadeIn>
          );
        })}
      </div>
    </SectionShell>
  );
}
