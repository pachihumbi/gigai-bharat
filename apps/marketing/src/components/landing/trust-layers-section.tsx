import { Brain, Lock, Scale, Users } from "lucide-react";
import { trustLayers } from "@/data/landing";
import { StaggerChildren, StaggerItem } from "@/components/motion/cinematic-reveal";
import { GlassPanel } from "@/components/ui/glass-panel";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";

const icons = {
  security: Lock,
  compliance: Scale,
  ownership: Users,
  ai: Brain,
} as const;

export function TrustLayersSection() {
  return (
    <SectionShell id="trust-layers" bleed className="border-y border-border bg-graphite/50">
      <div className="mx-auto max-w-7xl px-5 py-section md:px-12">
        <StaggerChildren>
          <StaggerItem className="max-w-2xl">
            <SectionLabel>§ Trust architecture</SectionLabel>
            <SectionTitle className="mt-3">
              Infrastructure investors and workers can both believe in.
            </SectionTitle>
          </StaggerItem>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustLayers.map((layer) => {
              const Icon = icons[layer.id];
              return (
                <StaggerItem key={layer.id}>
                  <GlassPanel className="h-full p-5 md:p-6">
                    <Icon className="h-5 w-5 text-[color:var(--neon)]" strokeWidth={1.5} />
                    <h3 className="mt-4 font-serif text-xl">{layer.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/70">{layer.body}</p>
                    <ul className="mt-4 space-y-1.5 border-t border-border pt-4">
                      {layer.proofs.map((p) => (
                        <li key={p} className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          ✓ {p}
                        </li>
                      ))}
                    </ul>
                  </GlassPanel>
                </StaggerItem>
              );
            })}
          </div>
        </StaggerChildren>
      </div>
    </SectionShell>
  );
}
