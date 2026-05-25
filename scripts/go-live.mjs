#!/usr/bin/env node
/**
 * GigAI Bharat — one-shot production go-live
 * Requires: VERCEL_TOKEN, optional RESEND_API_KEY for email verify
 *
 * Usage:
 *   $env:VERCEL_TOKEN = "..."   # vercel.com/account/tokens
 *   node scripts/go-live.mjs
 */
import { execSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const MARKETING = path.join(ROOT, "apps", "marketing");

const TOKEN = process.env.VERCEL_TOKEN?.trim();
const ORG_ID = process.env.VERCEL_ORG_ID?.trim() || "team_0Q6j1X2oG34Z3NezDpdkr4A9";
const MARKETING_PROJECT = process.env.VERCEL_MARKETING_PROJECT_ID?.trim() || "prj_8pk8D5inKD9wCnvmYG7bWklO6b55";
const WORKER_PROJECT = process.env.VERCEL_WORKER_PROJECT_ID?.trim() || "prj_td8bpmue2FlTHOqrZ1RkAfU7PAUY";

const MARKETING_DOMAINS = ["www.bharatgig.live", "bharatgig.live"];
const WORKER_DOMAINS = ["app.bharatgig.live"];
const STRAY_ON_WORKER = ["www.bharatgig.live", "bharatgig.live"];

function log(step, msg) {
  console.log(`\n[${step}] ${msg}`);
}

function fail(msg) {
  console.error(`\nGO-LIVE FAILED: ${msg}`);
  process.exit(1);
}

async function vercelApi(method, apiPath, body) {
  if (!TOKEN) fail("VERCEL_TOKEN not set — create at https://vercel.com/account/tokens");
  const url = `https://api.vercel.com${apiPath}${apiPath.includes("?") ? "&" : "?"}teamId=${ORG_ID}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  return { ok: res.ok, status: res.status, json };
}

async function listDomains(projectId) {
  const { ok, json, status } = await vercelApi("GET", `/v9/projects/${projectId}/domains`);
  if (!ok) return { error: status, domains: [] };
  return { domains: (json.domains || []).map((d) => d.name) };
}

async function removeDomain(projectId, domain) {
  const { ok, status, json } = await vercelApi("DELETE", `/v9/projects/${projectId}/domains/${domain}`);
  if (ok || status === 404) return true;
  console.warn(`  warn: could not remove ${domain} from ${projectId}: ${status}`, json.error?.message || "");
  return false;
}

async function addDomain(projectId, domain) {
  const { ok, status, json } = await vercelApi("POST", `/v9/projects/${projectId}/domains`, { name: domain });
  if (ok || json.error?.code === "domain_already_in_use") return true;
  if (status === 409) return true;
  console.warn(`  warn: could not add ${domain} to ${projectId}: ${status}`, json.error?.message || "");
  return false;
}

function run(cmd, opts = {}) {
  console.log(`  $ ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: opts.cwd || ROOT, env: { ...process.env, ...opts.env } });
}

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  GigAI Bharat — PRODUCTION GO-LIVE");
  console.log("  www.bharatgig.live → marketing");
  console.log("  app.bharatgig.live → worker");
  console.log("═══════════════════════════════════════════════════");

  if (!TOKEN) {
    fail("Set VERCEL_TOKEN first:\n  $env:VERCEL_TOKEN = \"your_token\"\n  node scripts/go-live.mjs");
  }

  // ── 1. Fix domain mapping ──
  log("1/6", "Fix Vercel domain mapping");

  const workerDomains = await listDomains(WORKER_PROJECT);
  console.log("  Worker domains:", workerDomains.domains.join(", ") || "(none)");

  for (const d of STRAY_ON_WORKER) {
    if (workerDomains.domains.includes(d)) {
      console.log(`  Removing ${d} from worker project...`);
      await removeDomain(WORKER_PROJECT, d);
    }
  }

  const marketingDomains = await listDomains(MARKETING_PROJECT);
  console.log("  Marketing domains:", marketingDomains.domains.join(", ") || "(none)");

  for (const d of MARKETING_DOMAINS) {
    if (!marketingDomains.domains.includes(d)) {
      console.log(`  Adding ${d} to marketing project...`);
      await addDomain(MARKETING_PROJECT, d);
    }
  }

  for (const d of WORKER_DOMAINS) {
    const md = await listDomains(WORKER_PROJECT);
    if (!md.domains.includes(d)) {
      console.log(`  Adding ${d} to worker project...`);
      await addDomain(WORKER_PROJECT, d);
    }
  }

  // ── 2. Build marketing ──
  log("2/6", "Build marketing (Nitro SSR, no cache)");
  run("npm run build -w @gigai/marketing", {
    env: { VERCEL: "1", VITE_SITE_URL: "https://www.bharatgig.live", DEPLOY_TARGET: "vercel" },
  });

  if (!fs.existsSync(path.join(MARKETING, ".vercel", "output"))) {
    fail("Build did not produce .vercel/output — check Nitro preset");
  }

  // ── 3. Deploy marketing ──
  log("3/6", "Deploy marketing → production (prebuilt, force)");
  run(`npx vercel deploy --prebuilt --prod --force --token ${TOKEN}`, { cwd: MARKETING });

  // ── 4. Wait for propagation ──
  log("4/6", "Wait 30s for edge propagation...");
  await new Promise((r) => setTimeout(r, 30_000));

  // ── 5. Validation ──
  log("5/6", "Run production validation");

  const health = spawnSync("node", ["scripts/health-check-production.mjs"], { cwd: ROOT, stdio: "inherit" });
  const emailDns = spawnSync("node", ["scripts/verify-email-dns.mjs"], {
    cwd: ROOT,
    stdio: "inherit",
    env: process.env,
  });
  const contactApi = spawnSync("node", ["scripts/test-contact-api.mjs"], { cwd: ROOT, stdio: "inherit" });

  // ── 6. Summary ──
  log("6/6", "Go-live summary");
  const healthOk = health.status === 0;
  const dnsOk = emailDns.status === 0;
  const apiOk = contactApi.status === 0;

  console.log("\n┌─────────────────────────────────────────────┐");
  console.log(`│ Health checks     ${healthOk ? "✓ GREEN" : "✗ RED"}                       │`);
  console.log(`│ Email DNS         ${dnsOk ? "✓ GREEN" : "✗ RED (manual DNS)"}               │`);
  console.log(`│ Contact API       ${apiOk ? "✓ GREEN" : "✗ RED"}                       │`);
  console.log("└─────────────────────────────────────────────┘");

  if (!dnsOk) {
    console.log("\nManual DNS (Cloudflare/Google Admin):");
    console.log("  TXT @  v=spf1 include:_spf.google.com include:amazonses.com ~all");
    console.log("  TXT _dmarc  v=DMARC1; p=quarantine; rua=mailto:legal@bharatgig.live; pct=100; adkim=s; aspf=s");
    console.log("  TXT resend2._domainkey + resend3._domainkey  (from Resend dashboard)");
    console.log("\nVercel env (if not set):");
    console.log("  RESEND_API_KEY, EMAIL_FROM, TURNSTILE_SECRET_KEY, VITE_TURNSTILE_SITE_KEY");
  }

  if (!healthOk || !apiOk) {
    console.log("\nIf www still shows worker app: Vercel Dashboard → redeploy without cache.");
    process.exit(1);
  }

  console.log("\n✓ GO-LIVE COMPLETE — https://www.bharatgig.live\n");
}

main().catch((e) => fail(e.message));
