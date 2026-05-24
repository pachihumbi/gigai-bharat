import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";
import { getWorkerEnv, isSupabaseConfigured } from "@/lib/env";

const env = getWorkerEnv();

const SUPABASE_URL = isSupabaseConfigured() ? env.supabaseUrl : "https://placeholder.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = isSupabaseConfigured()
  ? env.supabaseAnonKey
  : "placeholder-anon-key";

export const supabase = createBrowserClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
