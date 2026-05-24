import { Download } from "lucide-react";
import { usePwa } from "./PwaProvider";

export function InstallFloatingButton() {
  const { canInstall, isInstalling, install, isInstalled } = usePwa();

  if (!canInstall || isInstalled) return null;

  return (
    <button
      type="button"
      aria-label="Install GigAI App"
      disabled={isInstalling}
      onClick={() => install()}
      className="fixed bottom-6 right-4 z-[65] flex items-center gap-2 rounded-full border border-[#00F5D4]/50 bg-[#020810]/90 px-4 py-3 text-sm font-semibold text-[#00F5D4] shadow-[0_0_30px_rgba(0,245,212,0.25)] backdrop-blur-md transition-transform hover:scale-[1.02] active:scale-[0.98] md:bottom-8 md:right-8"
    >
      <Download className="h-4 w-4" />
      <span>{isInstalling ? "Installing…" : "Install GigAI App"}</span>
    </button>
  );
}
