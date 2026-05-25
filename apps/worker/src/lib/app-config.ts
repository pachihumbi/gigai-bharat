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

/** Public demo workspace — production hosts, env flag, or /demo session. */
export function allowInvestorDemo(): boolean {
  if (getWorkerEnv().allowInvestorDemo) return true;
  if (isProductionHost()) return true;
  if (typeof window !== "undefined") {
    try {
      return sessionStorage.getItem("gigai:demo-workspace") === "1";
    } catch {
      return false;
    }
  }
  return import.meta.env.DEV;
}
