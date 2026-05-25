import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { session, loading, isAdmin } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#020810]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-saffron" />
      </div>
    );
  }

  if (!session || !isAdmin) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
