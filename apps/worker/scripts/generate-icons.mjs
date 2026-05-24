import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public", "icons");
const sourceSvg = join(publicDir, "icon.svg");

async function writePng(buffer, name, size) {
  const out = join(publicDir, name);
  await writeFile(out, await sharp(buffer).resize(size, size).png().toBuffer());
  console.log(`Created ${name}`);
}

async function main() {
  await mkdir(publicDir, { recursive: true });
  const sourceBuffer = await readFile(sourceSvg);

  await writePng(sourceBuffer, "icon-192.png", 192);
  await writePng(sourceBuffer, "icon-512.png", 512);
  await writePng(sourceBuffer, "apple-touch-icon.png", 180);

  const maskable = await sharp(sourceBuffer)
    .resize(384, 384, { fit: "contain", background: "#020810" })
    .extend({ top: 64, bottom: 64, left: 64, right: 64, background: "#020810" })
    .png()
    .toBuffer();
  await writeFile(join(publicDir, "icon-maskable-512.png"), maskable);
  console.log("Created icon-maskable-512.png");

  await writeFile(join(__dirname, "..", "public", "favicon.svg"), sourceBuffer);
  console.log("Created favicon.svg");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
