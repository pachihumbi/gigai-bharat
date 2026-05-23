import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.warn(
    "[@gigai/admin] Missing VITE_SUPABASE_* — copy .env.example to apps/admin/.env.local",
  );
}

export const supabase = createClient(url ?? "", key ?? "");
