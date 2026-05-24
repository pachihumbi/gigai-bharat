import { Mic, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { OsCard, HudLabel } from "@/os/OsCard";

export function OnboardingAssistant({ message }: { message: string }) {
  const { t } = useI18n();
  return (
    <OsCard glow="neon" className="mb-4 flex gap-3">
      <div className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-primary/20">
        <Sparkles className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <HudLabel className="text-primary">{t.gurukul.mentorName}</HudLabel>
        <p className="mt-1 text-sm leading-relaxed">{message}</p>
        <button
          type="button"
          className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-secondary"
          onClick={() => {
            if ("speechSynthesis" in window) {
              const u = new SpeechSynthesisUtterance(message);
              u.lang = "en-IN";
              window.speechSynthesis.speak(u);
            }
          }}
        >
          <Mic className="h-3 w-3" /> {t.gurukul.listen}
        </button>
      </div>
    </OsCard>
  );
}
