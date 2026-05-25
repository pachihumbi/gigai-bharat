import { getWorkerEnv } from "@/lib/env";
import { workerAppUrl } from "@/lib/site";

const PRODUCTION_HOSTS = new Set([
  "app.bharatgig.live",
  "www.bharatgig.live",
  "bharatgig.live",
  new URL(workerAppUrl).hostname,
]);

export function isProductionHost(): boolean {
  if (typeof window === "undefined") return import.meta.env.PROD;
  return PRODUCTION_HOSTS.has(window.location.hostname);
}

/** Investor demo telemetry — opt-in only via env or /demo session. */
export function allowInvestorDemo(): boolean {
  if (getWorkerEnv().allowInvestorDemo) return true;
  if (typeof window !== "undefined") {
    try {
      return sessionStorage.getItem("gigai:demo-workspace") === "1";
    } catch {
      return false;
    }
  }
  return false;
}
