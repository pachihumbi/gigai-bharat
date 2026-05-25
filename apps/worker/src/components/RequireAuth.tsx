import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { isDemoWorkspace } from "@/lib/demo-session";
import { Loader2 } from "lucide-react";

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { session, loading } = useAuth();
  const location = useLocation();
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  const demoAccess = isDemoWorkspace();

  useEffect(() => {
    let cancelled = false;
    if (!session || !isSupabaseConfigured() || demoAccess) {
      setOnboarded(session || demoAccess ? true : null);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("worker_profiles")
        .select("onboarded")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (!cancelled) setOnboarded(data?.onboarded ?? false);
    })();
    return () => { cancelled = true; };
  }, [session, demoAccess]);

  if (loading || (session && onboarded === null && isSupabaseConfigured() && !demoAccess)) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-hero">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!session) {
    if (demoAccess) return <>{children}</>;
    return <Navigate to="/auth" replace />;
  }
  if (!onboarded && location.pathname !== "/onboarding" && !demoAccess) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
};
