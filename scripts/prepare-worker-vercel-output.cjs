/**
 * Build Output API v3 layout for the worker SPA.
 * Run from monorepo root: node scripts/prepare-worker-vercel-output.cjs
 */
const { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

const root = process.env.GIGAI_ROOT || process.cwd();
const dist = join(root, "apps/worker/dist");
const output = join(root, ".vercel/output");
const outputStatic = join(output, "static");

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const from = join(src, entry.name);
    const to = join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else if (entry.isFile()) {
      copyFileSync(from, to);
    }
  }
}

if (!existsSync(dist)) {
  console.error("Missing apps/worker/dist — run: npm run build -w @gigai/worker");
  process.exit(1);
}

rmSync(output, { recursive: true, force: true });
mkdirSync(outputStatic, { recursive: true });
copyDir(dist, outputStatic);

writeFileSync(
  join(output, "config.json"),
  `${JSON.stringify(
    {
      version: 3,
      routes: [
        { handle: "filesystem" },
        { src: "/(.*)", dest: "/index.html" },
      ],
    },
    null,
    2,
  )}\n`,
);

console.log("Prepared .vercel/output for worker SPA deploy (filesystem + index.html fallback)");
