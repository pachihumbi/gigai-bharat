#!/usr/bin/env node
/**
 * Production smoke test — run: npm run health:production
 * Validates HTTP status AND content fingerprints (catches wrong-app-on-domain bugs).
 */
const checks = [
  {
    name: "marketing-home",
    url: "https://www.bharatgig.live",
    expect: 200,
    bodyIncludes: ["site.webmanifest", "Worker-Owned Mobility"],
    bodyExcludes: ["manifest.webmanifest", "AI Co-Pilot for India"],
  },
  {
    name: "marketing-manifesto-ssr",
    url: "https://www.bharatgig.live/manifesto",
    expect: 200,
    bodyIncludes: ["The Manifesto", "GigAI Bharat"],
    bodyExcludes: ["manifest.webmanifest"],
  },
  {
    name: "marketing-workers",
    url: "https://www.bharatgig.live/workers",
    expect: 200,
    bodyIncludes: ["GigAI Bharat"],
    bodyExcludes: ["manifest.webmanifest"],
  },
  {
    name: "marketing-investors",
    url: "https://www.bharatgig.live/investors",
    expect: 200,
    bodyIncludes: ["GigAI Bharat"],
  },
  {
    name: "marketing-gurukul",
    url: "https://www.bharatgig.live/gurukul",
    expect: 200,
    bodyIncludes: ["GigAI Bharat"],
  },
  {
    name: "marketing-driver-app-redirect",
    url: "https://www.bharatgig.live/driver-app",
    expect: [200, 307, 308, 301, 302],
  },
  {
    name: "marketing-apex",
    url: "https://bharatgig.live",
    expect: [200, 301, 302, 307, 308],
    bodyIncludes: ["GigAI Bharat"],
    bodyExcludes: ["manifest.webmanifest"],
  },
  {
    name: "worker-home",
    url: "https://app.bharatgig.live",
    expect: 200,
    bodyIncludes: ["manifest.webmanifest"],
  },
  {
    name: "worker-demo",
    url: "https://app.bharatgig.live/demo",
    expect: 200,
  },
  {
    name: "worker-auth",
    url: "https://app.bharatgig.live/auth",
    expect: 200,
  },
  {
    name: "marketing-contact",
    url: "https://www.bharatgig.live/contact",
    expect: 200,
    bodyIncludes: ["GigAI Bharat"],
    skipIfWrongApp: true,
  },
  {
    name: "marketing-press",
    url: "https://www.bharatgig.live/press",
    expect: 200,
    bodyIncludes: ["GigAI Bharat"],
    skipIfWrongApp: true,
  },
  {
    name: "marketing-privacy",
    url: "https://www.bharatgig.live/privacy",
    expect: 200,
    bodyIncludes: ["GigAI Bharat"],
    skipIfWrongApp: true,
  },
  {
    name: "marketing-api-health",
    url: "https://www.bharatgig.live/api/health",
    expect: 200,
    bodyIncludes: ["ok"],
    skipIfWrongApp: true,
  },
  {
    name: "marketing-robots",
    url: "https://www.bharatgig.live/robots.txt",
    expect: 200,
    bodyIncludes: ["www.bharatgig.live"],
  },
  {
    name: "marketing-sitemap",
    url: "https://www.bharatgig.live/sitemap.xml",
    expect: 200,
    bodyIncludes: ["www.bharatgig.live", "/manifesto"],
  },
];

const results = [];
let allPassed = true;

/** Detect worker PWA served on marketing domain (common misconfiguration). */
async function detectWrongAppOnWww() {
  try {
    const res = await fetch("https://www.bharatgig.live", { redirect: "follow" });
    const body = await res.text();
    if (body.includes("manifest.webmanifest") && !body.includes("site.webmanifest")) {
      console.error("\n*** CRITICAL: www.bharatgig.live is serving the WORKER app, not marketing.");
      console.error("Fix: Vercel → gigai-bharat-marketing → Domains → attach www.bharatgig.live");
      console.error("     Remove www from gigai-bharat-worker. Redeploy marketing without cache.\n");
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

const wrongApp = await detectWrongAppOnWww();

for (const check of checks) {
  const {
    name,
    url,
    expect,
    bodyIncludes = [],
    bodyExcludes = [],
    followRedirect = true,
    skipIfWrongApp = false,
  } = check;

  if (wrongApp && skipIfWrongApp) {
    console.log(`SKIP ${name}  (www serves worker app — deploy marketing first)`);
    continue;
  }
  const allowed = Array.isArray(expect) ? expect : [expect];
  let status = 0;
  let ok = false;
  let body = "";
  let error = null;

  try {
    const res = await fetch(url, {
      redirect: followRedirect ? "follow" : "manual",
    });
    status = res.status;
    ok = allowed.includes(status);

    if (bodyIncludes.length || bodyExcludes.length) {
      body = await res.text();
      for (const needle of bodyIncludes) {
        if (!body.includes(needle)) {
          ok = false;
          error = `missing body fragment: ${needle}`;
          break;
        }
      }
      for (const needle of bodyExcludes) {
        if (body.includes(needle)) {
          ok = false;
          error = `unexpected body fragment (wrong app?): ${needle}`;
          break;
        }
      }
    }
  } catch (err) {
    status = 0;
    ok = false;
    error = String(err);
  }

  results.push({ name, url, status, ok, expect: allowed, error });
  if (!ok) allPassed = false;
  const mark = ok ? "OK" : "FAIL";
  const detail = error ? `  (${error})` : "";
  console.log(`${mark}  ${name}  ${url}  → ${status}${detail}`);
}

const fs = await import("node:fs");
const path = await import("node:path");
const { fileURLToPath } = await import("node:url");
const dir = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(dir, "production-health-report.json");
fs.writeFileSync(
  outPath,
  JSON.stringify({ timestamp: new Date().toISOString(), allPassed, results }, null, 2),
);
console.log(`\nReport: ${outPath}`);
console.log(allPassed ? "\nAll checks passed." : "\nSome checks failed.");
process.exit(allPassed ? 0 : 1);
