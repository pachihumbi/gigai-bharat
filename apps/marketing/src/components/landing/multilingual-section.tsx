import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { FadeIn } from "@/components/motion/fade-in";
import { GlassPanel } from "@/components/ui/glass-panel";

const languages = [
  { code: "EN", name: "English", status: "Live", coverage: "100%" },
  { code: "KN", name: "Kannada", status: "Live", coverage: "Worker app" },
  { code: "HI", name: "Hindi", status: "Live", coverage: "Worker app" },
  { code: "TA", name: "Tamil", status: "Roadmap", coverage: "Q4 2026" },
  { code: "TE", name: "Telugu", status: "Roadmap", coverage: "Q4 2026" },
  { code: "MR", name: "Marathi", status: "Roadmap", coverage: "2027" },
] as const;

export function MultilingualSection() {
  return (
    <SectionShell id="languages" className="border-y border-border/50">
      <FadeIn>
        <SectionLabel>§ Vernacular-first</SectionLabel>
        <SectionTitle className="mt-4 max-w-2xl">
          Built for Bharat&apos;s <span className="italic text-[color:var(--neon)]">11 languages.</span>
        </SectionTitle>
        <p className="mt-4 max-w-xl text-foreground/70">
          Worker app ships EN · KN · HI today. Shift coach and welfare UX expand across South and North India through
          2027.
        </p>
      </FadeIn>
      <div className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {languages.map((lang, i) => (
          <FadeIn key={lang.code} delay={i * 0.04}>
            <GlassPanel className="p-4 text-center">
              <p className="font-mono text-2xl font-bold text-[color:var(--neon)]">{lang.code}</p>
              <p className="mt-1 text-sm font-semibold">{lang.name}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{lang.status}</p>
              <p className="text-[10px] text-muted-foreground">{lang.coverage}</p>
            </GlassPanel>
          </FadeIn>
        ))}
      </div>
    </SectionShell>
  );
}
