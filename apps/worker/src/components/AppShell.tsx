import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { VoiceAssistantFab } from "@/os/VoiceAssistant";
import { useSunlight } from "@/hooks/useSunlight";
import { Sun, Moon } from "lucide-react";

export const AppShell = ({ children, title, kn }: { children: ReactNode; title?: string; kn?: string }) => {
  const { on, toggle } = useSunlight();
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-hero">
      <div className="pointer-events-none fixed -top-32 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 -right-32 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      <div className="relative mx-auto max-w-md animate-fade-in px-4 pb-36 pt-5 sm:px-5 sm:pt-6">
        <div className="mb-4 flex items-center justify-end gap-2">
          <LanguageSwitcher />
          <button
            onClick={toggle}
            aria-label="Toggle sunlight mode"
            className={`grid h-9 w-9 place-items-center rounded-lg border transition ${on ? "border-accent/60 bg-accent/15 text-accent" : "border-border/60 bg-muted/30 text-muted-foreground"}`}
          >
            {on ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
        {title && (
          <header className="mb-5">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {kn && <p className="mt-1 text-sm text-muted-foreground">{kn}</p>}
          </header>
        )}
        {children}
      </div>
      <VoiceAssistantFab />
      <BottomNav />
    </div>
  );
};
