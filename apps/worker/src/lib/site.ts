export const marketingSiteUrl = "https://www.bharatgig.live";
export const workerAppUrl = "https://app.bharatgig.live";
export const workerAuthUrl = `${workerAppUrl}/auth`;
export const workerDemoUrl = `${workerAppUrl}/demo`;
export const contactEmail = "hello@bharatgig.live";

/** True when running on localhost or a non-production host. */
export function isLocalDevHost(): boolean {
  if (typeof window === "undefined") return import.meta.env.DEV;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1" || host.endsWith(".local");
}
