import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return {};
  const env = {};
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const env = {
  ...loadEnvFile(resolve(repoRoot, ".env")),
  ...loadEnvFile(resolve(repoRoot, ".env.local")),
  ...loadEnvFile(resolve(repoRoot, "apps/worker/.env.local")),
};

const url = env.VITE_SUPABASE_URL?.trim();
const key = env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

if (!url || !key) {
  console.error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY.\n" +
      "Copy .env.example to .env.local at the repo root (or apps/worker/.env.local).",
  );
  process.exit(1);
}

const supabase = createClient(url, key);
const { error } = await supabase.from("worker_profiles").select("id").limit(1);

if (error?.message?.includes("Invalid API key")) {
  console.error("Supabase connection failed:", error.message);
  process.exit(1);
}

if (error && !["PGRST116", "42501"].includes(error.code ?? "")) {
  console.error("Supabase query failed:", error.code ?? "unknown", error.message);
  process.exit(1);
}

console.log(`Supabase connected: ${url}`);
