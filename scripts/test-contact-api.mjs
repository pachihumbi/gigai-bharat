#!/usr/bin/env node
/**
 * Smoke test POST /api/contact (validation path — does not send real email without valid payload timing)
 * Run: node scripts/test-contact-api.mjs
 * Run with live send: CONTACT_TEST_EMAIL=you@gmail.com node scripts/test-contact-api.mjs --send
 */
const BASE = process.env.PRODUCTION_URL || "https://www.bharatgig.live";
const SEND = process.argv.includes("--send");
const TEST_EMAIL = process.env.CONTACT_TEST_EMAIL;

async function req(path, init) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Origin: "https://www.bharatgig.live",
      ...(init?.headers || {}),
    },
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text.slice(0, 200) };
  }
  return { status: res.status, json, headers: res.headers };
}

let passed = 0;
let failed = 0;

function ok(name) {
  passed++;
  console.log(`OK   ${name}`);
}
function bad(name, detail) {
  failed++;
  console.log(`FAIL ${name}  ${detail}`);
}

// Health
const health = await req("/api/health");
if (health.status === 200 && health.json.ok) {
  ok(`GET /api/health (${health.json.email?.resend ? "resend configured" : "resend missing"})`);
} else {
  bad("GET /api/health", `${health.status} ${JSON.stringify(health.json)}`);
}

// Rate limit headers / validation — honeypot trip
const bot = await req("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "contact",
    name: "Bot",
    email: "bot@example.com",
    message: "This should be rejected by honeypot",
    _website: "http://spam.com",
    _ts: Date.now() - 5000,
  }),
});
if (bot.status === 400) {
  ok("POST /api/contact rejects honeypot");
} else if (bot.status === 429) {
  ok("POST /api/contact rate limited (prior test traffic)");
} else {
  bad("POST /api/contact honeypot", `expected 400, got ${bot.status}`);
}

// Timing trap
const fast = await req("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "contact",
    name: "Fast",
    email: "fast@example.com",
    message: "Too fast submission test message here",
    _website: "",
    _ts: Date.now(),
  }),
});
if (fast.status === 400) {
  ok("POST /api/contact rejects instant submit");
} else if (fast.status === 429) {
  ok("POST /api/contact rate limited (prior test traffic)");
} else {
  bad("POST /api/contact timing", `expected 400, got ${fast.status}`);
}

// Valid shape (may 503 if no RESEND on server, 400 if turnstile required)
if (SEND && TEST_EMAIL) {
  const live = await req("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "contact",
      name: "Production Test",
      email: TEST_EMAIL,
      subject: "Automated smoke test",
      message: "Automated production smoke test from test-contact-api.mjs — safe to ignore.",
      _website: "",
      _ts: Date.now() - 5000,
    }),
  });
  if (live.status === 200 && live.json.ok) {
    ok(`POST /api/contact live send → ${TEST_EMAIL}`);
  } else if (live.status === 503) {
    bad("POST /api/contact live send", "503 — RESEND_API_KEY not set on Vercel production");
  } else if (live.status === 400 && live.json.error?.includes("Bot")) {
    bad("POST /api/contact live send", "Turnstile required — set token or disable for CI");
  } else {
    bad("POST /api/contact live send", `${live.status} ${JSON.stringify(live.json)}`);
  }
} else {
  console.log("SKIP live send  (use CONTACT_TEST_EMAIL=... --send)");
}

// Security headers on homepage (also applied via SSR middleware)
const home = await fetch(`${BASE}/`);
const csp =
  home.headers.get("content-security-policy") ??
  home.headers.get("Content-Security-Policy");
const hsts =
  home.headers.get("strict-transport-security") ??
  home.headers.get("Strict-Transport-Security");
if (csp?.includes("default-src")) ok("CSP header present");
else bad("CSP header", csp ? "unexpected value" : "missing");
if (hsts?.includes("max-age")) ok("HSTS header present");
else bad("HSTS header", "missing");

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
