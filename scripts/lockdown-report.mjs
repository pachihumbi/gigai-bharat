#!/usr/bin/env node
/**
 * Final production lockdown report — runs all validators and prints status.
 * Usage: npm run lockdown
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function run(script) {
  const r = spawnSync("node", [script], { cwd: root, stdio: "pipe", encoding: "utf8", env: process.env });
  return { ok: r.status === 0, out: (r.stdout || "") + (r.stderr || "") };
}

async function liveHealth() {
  try {
    const res = await fetch("https://www.bharatgig.live/api/health");
    return await res.json();
  } catch {
    return null;
  }
}

console.log("══════════════════════════════════════════");
console.log("  GigAI Bharat — LOCKDOWN REPORT");
console.log("══════════════════════════════════════════\n");

const health = run("scripts/health-check-production.mjs");
const dns = run("scripts/verify-email-dns.mjs");
const api = run("scripts/test-contact-api.mjs");
const live = await liveHealth();

console.log(health.out);
console.log(dns.out);
console.log(api.out);

console.log("\n── Live /api/health ──");
if (live) {
  console.log(JSON.stringify(live, null, 2));
} else {
  console.log("unreachable");
}

const report = {
  timestamp: new Date().toISOString(),
  health: health.ok,
  emailDns: dns.ok,
  contactApi: api.ok,
  resendConfigured: live?.email?.resend ?? false,
  turnstileConfigured: live?.email?.turnstile ?? false,
};

const outPath = path.join(root, "scripts", "lockdown-report.json");
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
console.log(`\nReport saved: ${outPath}`);

const allGreen = report.health && report.emailDns && report.contactApi && report.resendConfigured;
console.log(allGreen ? "\n✓ FULL GREEN\n" : "\n✗ Remaining items below\n");

if (!report.resendConfigured) {
  console.log("RESEND: Set RESEND_API_KEY in Vercel (all envs) then redeploy:");
  console.log('  $env:RESEND_API_KEY="re_..."; .\\scripts\\lockdown-production.ps1');
}
if (!report.emailDns) {
  console.log("DNS: Merge SPF + add resend2/resend3 DKIM + DMARC p=quarantine (see docs/GO_LIVE.md)");
}

process.exit(allGreen ? 0 : 1);
