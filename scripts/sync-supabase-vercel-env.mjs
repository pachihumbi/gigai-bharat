#!/usr/bin/env node
/**
 * Sync production Supabase env vars to Vercel worker + admin projects.
 * Usage: node scripts/sync-supabase-vercel-env.mjs
 */
import { spawnSync } from "node:child_process";
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
  ...loadEnvFile(resolve(repoRoot, ".env.local")),
  ...loadEnvFile(resolve(repoRoot, "apps/worker/.env.local")),
};

const PRODUCTION_PROJECT = "jsdmmskzwnqhmxboergf";
const required = [
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_PUBLISHABLE_KEY",
  "VITE_SUPABASE_PROJECT_ID",
];

for (const key of required) {
  if (!env[key]?.trim()) {
    console.error(`Missing ${key} in .env.local`);
    process.exit(1);
  }
}

if (!env.VITE_SUPABASE_URL.includes(PRODUCTION_PROJECT)) {
  console.error(
    `Refusing to sync: VITE_SUPABASE_URL must point to ${PRODUCTION_PROJECT}`,
  );
  process.exit(1);
}

const workerExtras = [
  "VITE_MAP_STYLE_URL",
  "VITE_MAP_DEFAULT_LAT",
  "VITE_MAP_DEFAULT_LNG",
  "VITE_MAP_DEFAULT_ZOOM",
];

const adminExtras = [
  "VITE_MAP_STYLE_URL",
  "VITE_MAP_DEFAULT_LAT",
  "VITE_MAP_DEFAULT_LNG",
];

const projects = [
  { name: "gigai-bharat-worker", cwd: resolve(repoRoot, "apps/worker"), keys: [...required, ...workerExtras] },
  { name: "gigai-bharat-admin", cwd: resolve(repoRoot, "apps/admin"), keys: [...required, ...adminExtras] },
];

function vercelEnvAdd(cwd, name, value) {
  const result = spawnSync(
    "npx",
    ["vercel", "env", "add", name, "production", "--value", value, "--yes", "--force"],
    { cwd, stdio: "inherit", shell: true },
  );
  if (result.status !== 0) {
    console.error(`Failed to set ${name} on ${cwd}`);
    process.exit(result.status ?? 1);
  }
}

for (const project of projects) {
  console.log(`\n=== ${project.name} ===`);
  for (const key of project.keys) {
    const value = env[key];
    if (!value?.trim()) {
      console.warn(`Skipping ${key} (not set locally)`);
      continue;
    }
    console.log(`Setting ${key}...`);
    vercelEnvAdd(project.cwd, key, value);
  }
}

console.log("\nVercel env sync complete.");
