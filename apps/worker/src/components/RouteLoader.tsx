import { Loader2 } from "lucide-react";

export function RouteLoader() {
  return (
    <div className="min-h-screen grid place-items-center bg-gradient-hero">
      <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Loading" />
    </div>
  );
}
