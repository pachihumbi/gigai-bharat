import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, MessageSquare, Sparkles } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { GlassPanel, HudLabel } from "@/components/ui/glass-panel";
import { SectionLabel, SectionTitle } from "@/components/ui/kicker";
import { SectionShell } from "@/components/ui/section-shell";
import { aiCopilotRoles } from "@/data/cinematic";

export function AiCopilotSection() {
  const [activeRole, setActiveRole] = useState(0);
  const [typedText, setTypedText] = useState("");
  const role = aiCopilotRoles[activeRole];

  useEffect(() => {
    setTypedText("");
    let i = 0;
    const interval = setInterval(() => {
      if (i <= role.sample.length) {
        setTypedText(role.sample.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [activeRole, role.sample]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRole((prev) => (prev + 1) % aiCopilotRoles.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SectionShell id="copilot" className="gpu-lite border-b border-white/5">
      <FadeIn>
        <SectionLabel>06 // AI Copilot Layer</SectionLabel>
        <SectionTitle className="mt-4 max-w-4xl">
          Futuristic <span className="italic text-[color:var(--neon)]">AI copilots</span> for every stakeholder
        </SectionTitle>
        <p className="mt-4 max-w-2xl text-body text-muted-foreground">
          Conversational AI dashboards helping drivers, operators, fleet owners, and investors — vernacular-first,
          infrastructure-grade intelligence.
        </p>
      </FadeIn>

      <div className="mt-12 grid gap-8 lg:grid-cols-12">
        <FadeIn className="lg:col-span-4">
          <div className="flex flex-wrap gap-2 lg:flex-col">
            {aiCopilotRoles.map((r, i) => (
              <button
                key={r.role}
                type="button"
                onClick={() => setActiveRole(i)}
                className={`rounded border px-4 py-3 text-left transition-all ${
                  activeRole === i
                    ? "border-[color:var(--neon)] bg-[color:var(--neon)]/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{r.role}</p>
                <p className="mt-1 font-serif text-lg text-white">{r.persona}</p>
              </button>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="lg:col-span-8">
          <GlassPanel glow className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-5 py-3">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-[color:var(--neon)]" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-white">
                  {role.persona} · Conversational Dashboard
                </span>
              </div>
              <span className="flex items-center gap-1.5 font-mono text-[9px] text-[color:var(--neon)]">
                <Sparkles className="h-3 w-3" /> AI Live
              </span>
            </div>

            <div className="space-y-4 p-6">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--neon)]/30 bg-[color:var(--neon)]/10">
                  <Bot className="h-4 w-4 text-[color:var(--neon)]" />
                </div>
                <div className="flex-1 rounded-lg border border-white/10 bg-black/50 p-4">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={activeRole}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-mono text-sm leading-relaxed text-white/90"
                    >
                      {typedText}
                      <span className="animate-pulse text-[color:var(--neon)]">|</span>
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <div className="max-w-[70%] rounded-lg border border-[color:var(--saffron)]/20 bg-[color:var(--saffron)]/5 p-3">
                  <p className="font-mono text-xs text-white/80">
                    Show me earnings optimization for tonight's shift.
                  </p>
                </div>
                <MessageSquare className="h-5 w-5 shrink-0 text-[color:var(--saffron)]" />
              </div>

              <div className="grid gap-3 border-t border-white/5 pt-4 sm:grid-cols-3">
                {role.metrics.map((m) => (
                  <div key={m} className="rounded border border-white/5 bg-white/5 px-3 py-2">
                    <HudLabel>{m}</HudLabel>
                    <p className="mt-1 font-mono text-[10px] text-emerald-400">Active</p>
                  </div>
                ))}
              </div>
            </div>
          </GlassPanel>
        </FadeIn>
      </div>
    </SectionShell>
  );
}
