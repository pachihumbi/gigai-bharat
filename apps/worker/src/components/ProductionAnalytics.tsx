import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

export function ProductionAnalytics() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
