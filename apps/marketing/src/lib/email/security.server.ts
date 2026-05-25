import { getSiteOrigin, getTurnstileSecret, isTurnstileRequired } from "./config.server";

const MIN_FORM_MS = 3000;

export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = getTurnstileSecret();
  if (!secret) return true;

  if (!token) return false;

  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: ip,
  });

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return Boolean(data.success);
}

export function verifyOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const allowed = new Set([getSiteOrigin(), "http://localhost:5173", "http://127.0.0.1:5173"]);

  if (origin && allowed.has(origin)) return true;
  if (referer) {
    try {
      const refOrigin = new URL(referer).origin;
      return allowed.has(refOrigin);
    } catch {
      return false;
    }
  }

  // Server-to-server or missing headers in dev
  return process.env.NODE_ENV !== "production";
}

export function verifyHoneypot(website: string | undefined): boolean {
  return !website || website.length === 0;
}

export function verifyFormTiming(ts: number): boolean {
  const elapsed = Date.now() - ts;
  return elapsed >= MIN_FORM_MS && elapsed < 60 * 60 * 1000;
}

export async function runSecurityChecks(
  request: Request,
  payload: { _website?: string; _ts: number; turnstileToken?: string },
  ip: string,
): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  if (!verifyOrigin(request)) {
    return { ok: false, status: 403, message: "Invalid origin" };
  }

  if (!verifyHoneypot(payload._website)) {
    return { ok: false, status: 400, message: "Submission rejected" };
  }

  if (!verifyFormTiming(payload._ts)) {
    return { ok: false, status: 400, message: "Please wait a moment and try again" };
  }

  if (isTurnstileRequired()) {
    const valid = await verifyTurnstile(payload.turnstileToken, ip);
    if (!valid) {
      return { ok: false, status: 400, message: "Bot verification failed. Please retry." };
    }
  }

  return { ok: true };
}
