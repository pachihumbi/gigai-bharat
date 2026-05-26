import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

/** Vercel Analytics only runs on Vercel — skip on Spaceship static hosting. */
const isVercelHost =
  typeof window !== "undefined" &&
  (window.location.hostname.endsWith(".vercel.app") ||
    import.meta.env.VITE_DEPLOY_PLATFORM === "vercel");

/**
 * Vercel Analytics + Speed Insights (Vercel deployments only).
 * On Spaceship, use Plausible/UptimeRobot — see deployment/MONITORING.md.
 */
export function ProductionAnalytics() {
  if (!isVercelHost) {
    return null;
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
