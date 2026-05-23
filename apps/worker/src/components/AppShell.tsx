import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { useSunlight } from "@/hooks/useSunlight";
import { Sun, Moon } from "lucide-react";

export const AppShell = ({ children, title, kn }: { children: ReactNode; title?: string; kn?: string }) => {
  const { on, toggle } = useSunlight();
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-hero">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed -top-32 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 -right-32 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative mx-auto max-w-md px-5 pt-6 pb-32 animate-fade-in">
        {title && (
          <header className="mb-5 flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              {kn && <p className="text-sm font-kannada text-muted-foreground">{kn}</p>}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggle}
                aria-label="Toggle sunlight mode"
                className={`h-9 w-9 grid place-items-center rounded-lg border transition ${on ? "border-accent/60 bg-accent/15 text-accent" : "border-border/60 bg-muted/30 text-muted-foreground"}`}
              >
                {on ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <div className="font-mono-tech text-[10px] text-primary/80 px-2 py-1 rounded-md border border-primary/30 bg-primary/5">
                LIVE • BLR
              </div>
            </div>
          </header>
        )}
        {!title && (
          <button
            onClick={toggle}
            aria-label="Toggle sunlight mode"
            className={`fixed top-4 right-4 z-30 h-9 w-9 grid place-items-center rounded-lg border backdrop-blur-md transition ${on ? "border-accent/60 bg-accent/20 text-accent" : "border-border/60 bg-background/60 text-muted-foreground"}`}
          >
            {on ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        )}
        {children}
      </div>
      <BottomNav />
    </div>
  );
};
