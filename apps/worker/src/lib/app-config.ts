import { getWorkerEnv } from "@/lib/env";

const PRODUCTION_HOSTS = new Set(["app.bharatgig.live", "www.bharatgig.live", "bharatgig.live"]);

export function isProductionHost(): boolean {
  if (typeof window === "undefined") return import.meta.env.PROD;
  return PRODUCTION_HOSTS.has(window.location.hostname);
}

/** Investor demo telemetry — off on production unless explicitly enabled. */
export function allowInvestorDemo(): boolean {
  if (getWorkerEnv().allowInvestorDemo) return true;
  if (import.meta.env.DEV) return true;
  return !isProductionHost();
}
