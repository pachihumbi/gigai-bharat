import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { allowInvestorDemo } from "@/lib/app-config";
import { enterDemoWorkspace } from "@/lib/demo-session";

/** Sets demo session and redirects into the worker OS command center. */
export function DemoWorkspaceEntry() {
  useEffect(() => {
    enterDemoWorkspace();
  }, []);

  if (!allowInvestorDemo()) return <Navigate to="/auth" replace />;
  return <Navigate to="/dashboard" replace />;
}
