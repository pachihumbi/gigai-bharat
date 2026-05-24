import { Link } from "react-router-dom";
import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Offline() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-hero px-6 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#00F5D4]/30 bg-[#00F5D4]/10">
        <WifiOff className="h-8 w-8 text-[#00F5D4]" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">You're offline</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Cached pages are still available. Reconnect to sync earnings, dispatch, and wallet data.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={() => window.location.reload()}>Try again</Button>
        <Button variant="outline" asChild>
          <Link to="/dashboard">Open dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
