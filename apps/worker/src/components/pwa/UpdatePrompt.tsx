import { RefreshCw } from "lucide-react";
import { usePwa } from "./PwaProvider";
import { Button } from "@/components/ui/button";

export function UpdatePrompt() {
  const { needRefresh, applyUpdate } = usePwa();

  if (!needRefresh) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[80] border-b border-primary/30 bg-card/95 px-4 py-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
        <p className="text-sm text-foreground">A new version of GigAI Bharat is ready.</p>
        <Button size="sm" onClick={applyUpdate}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Update now
        </Button>
      </div>
    </div>
  );
}
