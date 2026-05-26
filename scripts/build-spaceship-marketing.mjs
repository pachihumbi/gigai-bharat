#!/usr/bin/env node
/**
 * Build marketing for Spaceship (SPA + prerender). Output: apps/marketing/dist-spaceship/
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const marketing = path.join(root, "apps/marketing");
const outDir = path.join(marketing, "dist-spaceship");
const htaccessSrc = path.join(root, "deploy/spaceship/marketing/.htaccess");

const env = {
  ...process.env,
  DEPLOY_TARGET: "spaceship",
  VITE_SITE_URL: process.env.VITE_SITE_URL || "https://www.bharatgig.live",
};

console.log("Building marketing (Spaceship SPA)…");
execSync("npm run build -w @gigai/marketing", { cwd: root, stdio: "inherit", env });

const candidates = [
  path.join(marketing, "dist", "client"),
  path.join(marketing, ".output", "public"),
  path.join(marketing, "dist"),
];

const built = candidates.find((p) => fs.existsSync(p) && fs.readdirSync(p).length > 0);
if (!built) {
  console.error("No build output. Checked:\n", candidates.join("\n"));
  process.exit(1);
}

if (fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true });
fs.cpSync(built, outDir, { recursive: true });
fs.copyFileSync(htaccessSrc, path.join(outDir, ".htaccess"));

if (process.env.INCLUDE_CONTACT_PHP === "1") {
  const phpSrc = path.join(root, "deploy/spaceship/api/contact.php");
  const phpDest = path.join(outDir, "api", "contact.php");
  fs.mkdirSync(path.dirname(phpDest), { recursive: true });
  fs.copyFileSync(phpSrc, phpDest);
}

console.log(`\nUpload: ${outDir}\n`);
