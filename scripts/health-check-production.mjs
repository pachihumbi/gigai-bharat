#!/usr/bin/env node
/**
 * Production smoke test — run: npm run health:production
 */
const checks = [
  { name: "marketing-home", url: "https://www.bharatgig.live", expect: 200 },
  { name: "marketing-manifesto", url: "https://www.bharatgig.live/manifesto", expect: 200 },
  { name: "marketing-workers", url: "https://www.bharatgig.live/workers", expect: 200 },
  { name: "marketing-investors", url: "https://www.bharatgig.live/investors", expect: 200 },
  { name: "marketing-gurukul", url: "https://www.bharatgig.live/gurukul", expect: 200 },
  { name: "marketing-driver-app-redirect", url: "https://www.bharatgig.live/driver-app", expect: [200, 307, 308] },
  { name: "worker-home", url: "https://app.bharatgig.live", expect: 200 },
  { name: "worker-demo", url: "https://app.bharatgig.live/demo", expect: 200 },
  { name: "worker-auth", url: "https://app.bharatgig.live/auth", expect: 200 },
];

const results = [];
let allPassed = true;

for (const { name, url, expect } of checks) {
  const allowed = Array.isArray(expect) ? expect : [expect];
  let status = 0;
  let ok = false;
  try {
    const res = await fetch(url, { redirect: "manual" });
    status = res.status;
    ok = allowed.includes(status);
  } catch (err) {
    status = 0;
    ok = false;
    results.push({ name, url, status, ok, error: String(err) });
    allPassed = false;
    continue;
  }
  results.push({ name, url, status, ok, expect: allowed });
  if (!ok) allPassed = false;
  const mark = ok ? "OK" : "FAIL";
  console.log(`${mark}  ${name}  ${url}  → ${status}`);
}

const report = {
  timestamp: new Date().toISOString(),
  allPassed,
  results,
};

const fs = await import("node:fs");
const path = await import("node:path");
const { fileURLToPath } = await import("node:url");
const dir = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(dir, "production-health-report.json");
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
console.log(`\nReport: ${outPath}`);
console.log(allPassed ? "\nAll checks passed." : "\nSome checks failed.");
process.exit(allPassed ? 0 : 1);
