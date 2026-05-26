#!/usr/bin/env node
/**
 * Verify DNS + TLS for bharatgig.live (Spaceship migration).
 * Usage: npm run verify:domain-ssl
 */
import { execSync } from "node:child_process";
import tls from "node:tls";

const APEX = "bharatgig.live";
const WWW = `www.${APEX}`;
const APP = `app.${APEX}`;

function dig(short, name) {
  try {
    return execSync(`dig +short ${name} ${short}`, { encoding: "utf8" })
      .trim()
      .split("\n")
      .filter(Boolean);
  } catch {
    return [];
  }
}

function checkTls(host) {
  return new Promise((resolve) => {
    const socket = tls.connect(
      { host, port: 443, servername: host, rejectUnauthorized: false },
      () => {
        const cert = socket.getPeerCertificate();
        socket.end();
        const sans = cert.subjectaltname
          ? cert.subjectaltname.split(", ").map((s) => s.replace(/^DNS:/, ""))
          : [];
        resolve({
          host,
          subject: cert.subject?.CN ?? JSON.stringify(cert.subject),
          validTo: cert.valid_to,
          sans,
        });
      },
    );
    socket.on("error", (err) => resolve({ host, error: err.message }));
    socket.setTimeout(8000, () => {
      socket.destroy();
      resolve({ host, error: "timeout" });
    });
  });
}

const ok = (m) => console.log(`  ✓ ${m}`);
const warn = (m) => console.log(`  ⚠ ${m}`);
const fail = (m) => console.log(`  ✗ ${m}`);

console.log(`\n=== DNS: ${APEX} ===`);
const apexA = dig("A", APEX);
const wwwA = dig("A", WWW);
const wwwCname = dig("CNAME", WWW);

if (apexA.length) ok(`A @ → ${apexA.join(", ")}`);
else fail("No A record for apex");

if (wwwA.length) ok(`A www → ${wwwA.join(", ")}`);
else if (wwwCname.length) ok(`CNAME www → ${wwwCname.join(", ")}`);
else fail("www has no A or CNAME");

const appCname = dig("CNAME", APP);
if (appCname.some((c) => c.includes("vercel"))) {
  warn(`app still on Vercel: ${appCname.join(", ")}`);
}

const vercelMarketing = [...dig("CNAME", APEX), ...dig("CNAME", WWW)].filter((c) =>
  c.includes("vercel"),
);
if (vercelMarketing.length) fail(`Marketing still on Vercel DNS: ${vercelMarketing.join(", ")}`);
else ok("Marketing apex/www not using vercel-dns CNAME");

console.log(`\n=== TLS ===`);
for (const host of [APEX, WWW]) {
  const r = await checkTls(host);
  if (r.error) {
    fail(`${host}: ${r.error}`);
    continue;
  }
  console.log(`\n  ${host}: subject=${r.subject}`);
  console.log(`    SANs: ${r.sans.join(", ") || "(none)"}`);
  const matches =
    r.sans.includes(host) ||
    (host === WWW && r.sans.includes(WWW)) ||
    (host === APEX && r.sans.includes(APEX));
  const sharedOnly = r.sans.length > 0 && r.sans.every((s) => s.includes("spaceship.host"));
  if (matches && !sharedOnly) ok(`${host}: certificate matches domain`);
  else
    fail(
      `${host}: wrong certificate — enable AutoSSL in Spaceship SSL/TLS Status for ${APEX} + www`,
    );
}

console.log(`\n=== HTTP ===`);
try {
  const res = await fetch(`http://${APEX}/`, { redirect: "manual" });
  if (res.status >= 301 && res.status <= 308) ok(`http://${APEX} redirects → ${res.headers.get("location")}`);
  else warn(`http://${APEX} returns ${res.status} (upload .htaccess for HTTPS + www)`);
} catch (e) {
  fail(`http://${APEX}: ${e.message}`);
}

console.log("\nDone.\n");
