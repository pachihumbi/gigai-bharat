import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { getWorkerEnv, isSupabaseConfigured } from "@/lib/env";

const env = getWorkerEnv();

// Placeholder values prevent runtime crash during build; ConfigGuard blocks UI if misconfigured.
const SUPABASE_URL = isSupabaseConfigured() ? env.supabaseUrl : "https://placeholder.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = isSupabaseConfigured()
  ? env.supabaseAnonKey
  : "placeholder-anon-key";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});
