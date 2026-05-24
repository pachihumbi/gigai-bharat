/**
 * Build Output API v3 layout for the worker SPA.
 * Run from monorepo root: node scripts/prepare-worker-vercel-output.cjs
 */
const { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

const root = process.env.GIGAI_ROOT || process.cwd();
const dist = join(root, "apps/worker/dist");
const output = join(root, ".vercel/output");
const outputStatic = join(output, "static");

if (!existsSync(dist)) {
  console.error("Missing apps/worker/dist — run: npm run build -w @gigai/worker");
  process.exit(1);
}

rmSync(output, { recursive: true, force: true });
mkdirSync(outputStatic, { recursive: true });
cpSync(dist, outputStatic, { recursive: true });

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
