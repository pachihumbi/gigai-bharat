import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { postAuthPath, resolveAuthFromUrl } from "@/lib/auth";
import { toast } from "sonner";

const AuthCallback = () => {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await resolveAuthFromUrl();
        if (!cancelled) setTarget(postAuthPath);
      } catch (err) {
        console.error("OAuth callback failed:", err);
        toast.error("Sign-in could not be completed. Please try again.");
        if (!cancelled) setTarget("/auth");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (target) return <Navigate to={target} replace />;

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-hero">
      <div className="text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-sm text-muted-foreground">Completing secure sign-in…</p>
      </div>
    </div>
  );
};

export default AuthCallback;
