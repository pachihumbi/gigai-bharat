import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

/**
 * Vercel Analytics + Speed Insights. Enable in Vercel project dashboard.
 * No keys required — works automatically on Vercel deployments.
 */
export function ProductionAnalytics() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
