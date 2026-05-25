#!/usr/bin/env node
/**
 * Verify bharatgig.live email DNS — SPF, DKIM, DMARC, MX
 * Run: node scripts/verify-email-dns.mjs
 */
import dns from "node:dns/promises";

const DOMAIN = "bharatgig.live";

const checks = [];

function pass(name, detail) {
  checks.push({ name, ok: true, detail });
  console.log(`OK   ${name}  ${detail}`);
}

function fail(name, detail) {
  checks.push({ name, ok: false, detail });
  console.log(`FAIL ${name}  ${detail}`);
}

async function txtRecords(name) {
  try {
    return await dns.resolveTxt(name);
  } catch {
    return [];
  }
}

async function main() {
  console.log(`\nEmail DNS verification — ${DOMAIN}\n`);

  // SPF on apex
  const apexTxt = await txtRecords(DOMAIN);
  const flat = apexTxt.map((r) => r.join(""));
  const spf = flat.find((t) => t.startsWith("v=spf1"));
  if (spf) {
    const hasResend = spf.includes("amazonses.com");
    const hasCloudflare = spf.includes("_spf.mx.cloudflare.net");
    const hasGoogle = spf.includes("_spf.google.com");
    if (hasResend && (hasCloudflare || hasGoogle)) {
      pass("SPF", spf);
    } else if (hasGoogle && !hasResend) {
      fail("SPF", `${spf} — add include:amazonses.com for Resend outbound`);
    } else if (hasResend) {
      pass("SPF (Resend only)", `${spf} — add include:_spf.google.com if using Google Workspace`);
    } else {
      fail("SPF", `Missing Resend: ${spf}`);
    }
  } else {
    fail("SPF", "No v=spf1 TXT on apex");
  }

  // DMARC
  const dmarcTxt = await txtRecords(`_dmarc.${DOMAIN}`);
  const dmarc = dmarcTxt.flat().join("");
  if (dmarc.includes("v=DMARC1")) {
    pass("DMARC", dmarc);
  } else {
    fail("DMARC", "Missing _dmarc TXT record");
  }

  // DKIM (Resend uses resend._domainkey or CNAME targets)
  for (const selector of ["resend._domainkey", "resend2._domainkey", "resend3._domainkey"]) {
    const dkimTxt = await txtRecords(`${selector}.${DOMAIN}`);
    if (dkimTxt.length) {
      pass(`DKIM ${selector}`, "TXT present");
      continue;
    }
    try {
      await dns.resolveCname(`${selector}.${DOMAIN}`);
      pass(`DKIM ${selector}`, "CNAME present");
    } catch {
      fail(`DKIM ${selector}`, "Not found — copy from Resend dashboard");
    }
  }

  // MX — Google Workspace OR Cloudflare Email Routing
  try {
    const mx = await dns.resolveMx(DOMAIN);
    const cloudflareMx = mx.filter((r) => r.exchange.includes("cloudflare.net"));
    const googleMx = mx.filter((r) => r.exchange.includes("google.com"));
    if (cloudflareMx.length >= 1) {
      pass("MX (Cloudflare)", cloudflareMx.map((m) => `${m.priority} ${m.exchange}`).join(", "));
    } else if (googleMx.length >= 1) {
      pass("MX (Google Workspace)", googleMx.map((m) => `${m.priority} ${m.exchange}`).join(", "));
    } else {
      fail("MX", `Unexpected: ${mx.map((m) => m.exchange).join(", ") || "none"}`);
    }
  } catch {
    fail("MX", "No MX records");
  }

  // Resend API domain status (optional)
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/domains", {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (res.ok) {
        const body = await res.json();
        const domain = body.data?.find((d) => d.name === DOMAIN);
        if (domain?.status === "verified") {
          pass("Resend API", `Domain ${DOMAIN} verified`);
        } else if (domain) {
          fail("Resend API", `Domain status: ${domain.status}`);
        } else {
          fail("Resend API", `Domain ${DOMAIN} not found in account`);
        }
      } else {
        fail("Resend API", `HTTP ${res.status}`);
      }
    } catch (err) {
      fail("Resend API", String(err));
    }
  } else {
    console.log("SKIP Resend API  (set RESEND_API_KEY to verify domain status)");
  }

  const allPassed = checks.every((c) => c.ok);
  console.log(allPassed ? "\nAll email DNS checks passed.\n" : "\nSome checks failed — see docs/PRODUCTION_RUNBOOK.md\n");
  process.exit(allPassed ? 0 : 1);
}

main();
