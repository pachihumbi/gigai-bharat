import { supabase } from "@/integrations/supabase/client";

/** Canonical OAuth callback — must be allowlisted in Supabase Auth → URL Configuration. */
export const AUTH_CALLBACK_PATH = "/auth/callback";

export const authCallbackUrl = () =>
  `${window.location.origin}${AUTH_CALLBACK_PATH}`;

/** @deprecated Use resolvePostAuthPath() for session-aware routing */
export const postAuthPath = "/dashboard";

/** Strip OAuth tokens from the URL after session is established. */
export function clearAuthParamsFromUrl() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("code") && !url.hash.includes("access_token")) return;
  url.searchParams.delete("code");
  url.searchParams.delete("error");
  url.searchParams.delete("error_description");
  window.history.replaceState({}, document.title, `${url.pathname}${url.search}`);
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: authCallbackUrl(),
      queryParams: { access_type: "offline", prompt: "consent" },
    },
  });
  if (error) throw error;
  return data;
}

export type EmailSignInMetadata = Record<string, string | undefined>;

/** Sends a passwordless sign-in email (magic link by default; 6-digit code if template uses {{ .Token }}). */
export async function sendEmailSignInLink(email: string, metadata?: EmailSignInMetadata) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email.trim(),
    options: {
      shouldCreateUser: true,
      emailRedirectTo: authCallbackUrl(),
      data: metadata,
    },
  });
  if (error) throw error;
  return data;
}

export async function verifyEmailSignInCode(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email: email.trim(),
    token: token.trim(),
    type: "email",
  });
  if (error) throw error;
  return data;
}

export function formatAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("rate limit") || lower.includes("too many")) {
    return "Too many attempts — wait 60 seconds, then try again.";
  }
  if (lower.includes("invalid login credentials") || lower.includes("invalid email or password")) {
    return "Invalid email or password.";
  }
  if (lower.includes("email not confirmed")) {
    return "Confirm your email first, or use the sign-in link we sent.";
  }
  if (lower.includes("signup") && lower.includes("disabled")) {
    return "New signups are paused. Try Demo Access or contact support.";
  }
  if (lower.includes("otp") && lower.includes("expired")) {
    return "That code expired. Request a new sign-in email.";
  }
  return message;
}

/** Wait for Supabase to finish processing OAuth / magic-link tokens in the URL. */
export async function resolveAuthFromUrl(timeoutMs = 15_000) {
  const started = Date.now();

  // Robustly extract tokens from URL hash or query string
  const getUrlParams = () => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const searchParams = new URLSearchParams(window.location.search);

    const accessToken = hashParams.get("access_token") || searchParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token") || searchParams.get("refresh_token");
    const code = searchParams.get("code") || hashParams.get("code");

    return { accessToken, refreshToken, code };
  };

  while (Date.now() - started < timeoutMs) {
    const { accessToken, refreshToken, code } = getUrlParams();

    // 1. If we have implicit tokens, manually establish the session to prevent router-level hash stripping
    if (accessToken && refreshToken) {
      try {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });
        if (!error && data.session) return data.session;
      } catch (e) {
        console.warn("Manual setSession failed:", e);
      }
    }

    // 2. If we have an authorization code, exchange it for a session
    if (code) {
      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error && data.session) return data.session;
      } catch (e) {
        console.warn("exchangeCodeForSession failed:", e);
      }
    }

    // 3. Fallback to getting the current active session
    const { data, error } = await supabase.auth.getSession();
    if (!error && data.session) return data.session;

    await new Promise((r) => setTimeout(r, 200));
  }

  throw new Error("Authentication timed out. Please try again.");
}
