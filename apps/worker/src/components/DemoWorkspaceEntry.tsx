import { Navigate } from "react-router-dom";
import { allowInvestorDemo } from "@/lib/app-config";
import { enterDemoWorkspace } from "@/lib/demo-session";

/** Sets demo session and redirects into the worker OS command center. */
export function DemoWorkspaceEntry() {
  if (!allowInvestorDemo()) return <Navigate to="/auth" replace />;
  enterDemoWorkspace();
  return <Navigate to="/dashboard" replace />;
}
