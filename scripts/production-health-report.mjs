#!/usr/bin/env node
/**
 * Production health report for GigAI Bharat Supabase + live URLs.
 * Usage: node scripts/production-health-report.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PRODUCTION_PROJECT = "jsdmmskzwnqhmxboergf";

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

function readConfigTomlProjectId() {
  const path = resolve(repoRoot, "supabase/config.toml");
  if (!existsSync(path)) return null;
  const match = readFileSync(path, "utf8").match(/^project_id\s*=\s*"([^"]+)"/m);
  return match?.[1] ?? null;
}

const env = {
  ...loadEnvFile(resolve(repoRoot, ".env.local")),
  ...loadEnvFile(resolve(repoRoot, "apps/worker/.env.local")),
};

const url = env.VITE_SUPABASE_URL?.trim();
const key = env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
const projectId = env.VITE_SUPABASE_PROJECT_ID?.trim();
const configTomlId = readConfigTomlProjectId();

const checks = [];
function pass(name, detail) {
  checks.push({ name, ok: true, detail });
}
function fail(name, detail) {
  checks.push({ name, ok: false, detail });
}

const urls = [
  { name: "Marketing home", url: "https://www.bharatgig.live/" },
  { name: "Driver app (marketing)", url: "https://www.bharatgig.live/driver-app" },
  { name: "Worker app", url: "https://app.bharatgig.live/" },
  { name: "Worker auth", url: "https://app.bharatgig.live/auth" },
  { name: "Worker driver-app (SPA)", url: "https://app.bharatgig.live/driver-app" },
];

if (configTomlId === PRODUCTION_PROJECT) {
  pass("supabase/config.toml", configTomlId);
} else {
  fail("supabase/config.toml", `expected ${PRODUCTION_PROJECT}, got ${configTomlId}`);
}

if (projectId === PRODUCTION_PROJECT && url?.includes(PRODUCTION_PROJECT)) {
  pass("local env project", projectId);
} else {
  fail("local env project", `url=${url} id=${projectId}`);
}

if (!url || !key) {
  fail("supabase connection", "missing VITE_SUPABASE_* in .env.local");
} else {
  const supabase = createClient(url, key);
  const { error: dbError } = await supabase.from("worker_profiles").select("id").limit(1);
  if (dbError?.message?.includes("Invalid API key")) {
    fail("supabase connection", dbError.message);
  } else if (dbError && !["PGRST116", "42501"].includes(dbError.code ?? "")) {
    fail("supabase connection", `${dbError.code}: ${dbError.message}`);
  } else {
    pass("supabase connection", url);
  }

  const authRes = await fetch(`${url}/auth/v1/settings`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (authRes.ok) {
    pass("supabase auth API", `HTTP ${authRes.status}`);
  } else {
    fail("supabase auth API", `HTTP ${authRes.status}`);
  }
}

for (const target of urls) {
  try {
    const res = await fetch(target.url, { redirect: "follow" });
    const body = await res.text();
    const isSpa404 =
      body.includes("Oops! Page not found") ||
      body.includes("404 Error: User attempted to access non-existent route");
    const isConfigMissing = body.includes("Configuration required");

    if (!res.ok) {
      fail(target.name, `${target.url} → HTTP ${res.status}`);
    } else if (isConfigMissing) {
      fail(target.name, `${target.url} → missing Supabase env in bundle`);
    } else if (isSpa404) {
      fail(target.name, `${target.url} → SPA 404 (route not registered)`);
    } else {
      pass(target.name, `${target.url} → HTTP ${res.status}`);
    }
  } catch (err) {
    fail(target.name, `${target.url} → ${err instanceof Error ? err.message : String(err)}`);
  }
}

try {
  const html = await (await fetch("https://app.bharatgig.live/")).text();
  const jsMatch = html.match(/\/assets\/index-[^"]+\.js/);
  if (jsMatch) {
    const js = await (await fetch(`https://app.bharatgig.live${jsMatch[0]}`)).text();
    const liveRef = js.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];
    if (liveRef === PRODUCTION_PROJECT) {
      pass("live worker bundle", `uses ${liveRef}`);
    } else {
      fail("live worker bundle", `uses ${liveRef ?? "unknown"}, expected ${PRODUCTION_PROJECT}`);
    }
  } else {
    fail("live worker bundle", "could not find main JS chunk");
  }
} catch (err) {
  fail("live worker bundle", err instanceof Error ? err.message : String(err));
}

const report = {
  generatedAt: new Date().toISOString(),
  productionSupabaseProject: PRODUCTION_PROJECT,
  productionUrls: {
    marketing: "https://www.bharatgig.live",
    workerApp: "https://app.bharatgig.live",
    workerAuth: "https://app.bharatgig.live/auth",
    driverApp: "https://app.bharatgig.live/driver-app",
    driverAppMarketing: "https://www.bharatgig.live/driver-app",
    admin: "https://gigai-bharat-admin-pachihumbis-projects.vercel.app",
  },
  checks,
  allPassed: checks.every((c) => c.ok),
};

const outPath = resolve(repoRoot, "scripts/production-health-report.json");
writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);

console.log("\n# GigAI Bharat — Production Health Report\n");
console.log(`Supabase project: **${PRODUCTION_PROJECT}**`);
console.log(`Generated: ${report.generatedAt}\n`);
for (const c of checks) {
  console.log(`${c.ok ? "✅" : "❌"} ${c.name}: ${c.detail}`);
}
console.log(`\nOverall: ${report.allPassed ? "PASS" : "FAIL"}`);
console.log(`Report written to ${outPath}`);

process.exit(report.allPassed ? 0 : 1);
