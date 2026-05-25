#!/usr/bin/env node
/**
 * Local check: required env keys exist in .env.local (values not validated).
 * GitHub Actions secrets must be set manually in repo settings.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const files = [
  { file: ".env.local", keys: ["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"] },
  { file: path.join("apps", "worker", ".env.local"), keys: ["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"] },
];

const githubSecrets = [
  "VERCEL_TOKEN",
  "VERCEL_ORG_ID",
  "VERCEL_MARKETING_PROJECT_ID",
  "VERCEL_WORKER_PROJECT_ID",
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_PUBLISHABLE_KEY",
];

let ok = true;

console.log("Local .env.local checks:\n");
for (const { file, keys } of files) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) {
    console.log(`  MISSING  ${file}  (copy from .env.example)`);
    ok = false;
    continue;
  }
  const content = fs.readFileSync(full, "utf8");
  for (const key of keys) {
    const has = content.includes(`${key}=`) && !content.includes(`${key}=your_`) && !content.includes(`${key}=\n`);
    console.log(has ? `  OK       ${file} → ${key}` : `  MISSING  ${file} → ${key}`);
    if (!has) ok = false;
  }
}

console.log("\nGitHub Actions secrets (set in repo Settings → Secrets):\n");
for (const s of githubSecrets) {
  console.log(`  - ${s}`);
}

console.log(ok ? "\nLocal env looks ready." : "\nFix local env files before deploy.");
process.exit(ok ? 0 : 1);
