import { createServerClient } from "@supabase/ssr";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type RequestLike = {
  headers: Headers;
  cookies: {
    getAll(): { name: string; value: string }[];
    set(name: string, value: string): void;
  };
};

type ResponseLike = {
  headers: Headers;
  cookies: {
    set(name: string, value: string, options?: Record<string, unknown>): void;
  };
};

/**
 * Refresh Supabase auth cookies on edge/server requests.
 * Wire this into your SSR entry (TanStack Start / Nitro) — not Next.js middleware.
 */
export function updateSession(request: RequestLike, response: ResponseLike) {
  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  return supabase.auth.getUser();
}
