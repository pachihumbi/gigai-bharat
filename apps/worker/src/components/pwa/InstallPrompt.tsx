import { Download, Smartphone, X } from "lucide-react";
import { usePwa } from "./PwaProvider";
import { Button } from "@/components/ui/button";

export function InstallPrompt() {
  const { canInstall, isInstalling, install, dismissInstall } = usePwa();

  if (!canInstall) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="install-prompt-title"
      className="fixed inset-x-4 bottom-24 z-[70] mx-auto max-w-md animate-in slide-in-from-bottom-4 fade-in duration-300"
    >
      <div className="rounded-2xl border border-primary/30 bg-card/95 p-4 shadow-[0_0_40px_hsl(174_100%_48%/0.15)] backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#00F5D4]/40 bg-[#00F5D4]/10">
            <Smartphone className="h-5 w-5 text-[#00F5D4]" />
          </div>
          <div className="min-w-0 flex-1">
            <p id="install-prompt-title" className="font-semibold text-foreground">
              Install GigAI Bharat
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add to your home screen for offline access, faster launch, and a native super-app experience.
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-[#00F5D4] text-[#020810] hover:bg-[#00F5D4]/90"
                disabled={isInstalling}
                onClick={() => install()}
              >
                <Download className="mr-2 h-4 w-4" />
                {isInstalling ? "Installing…" : "Install app"}
              </Button>
              <Button size="sm" variant="ghost" onClick={dismissInstall}>
                Later
              </Button>
            </div>
          </div>
          <button
            type="button"
            aria-label="Dismiss install prompt"
            className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
            onClick={dismissInstall}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
