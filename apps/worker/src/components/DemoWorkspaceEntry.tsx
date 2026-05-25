import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { enterDemoWorkspace } from "@/lib/demo-session";

/** Sets demo session and redirects into the worker OS command center. */
export function DemoWorkspaceEntry() {
  useEffect(() => {
    enterDemoWorkspace();
  }, []);

  return <Navigate to="/dashboard" replace />;
}
