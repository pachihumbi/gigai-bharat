import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { resolvePostAuthPath } from "@/lib/worker-profile";

/** Routes authenticated users to onboarding or dashboard based on profile state. */
export function PostAuthRedirect() {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    resolvePostAuthPath().then((path) => {
      if (!cancelled) setTarget(path);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!target) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-hero">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <Navigate to={target} replace />;
}
