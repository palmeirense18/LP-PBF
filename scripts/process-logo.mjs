import sharp from "sharp";

const SRC = "LOGO.jpeg";
const OUT_ICON = "public/brand/logo-icon.png";

const meta = await sharp(SRC).metadata();
const iconHeight = Math.round(meta.height * 0.67); // top 67% safely captures full gear + buffer above wordmark

// Crop the top icon region, then chroma-key the off-white background to transparent.
// The off-white in this logo is approximately rgb(238, 238, 238)..rgb(248, 248, 248).
// We use ensureAlpha + a custom raw-pixel mask: any pixel with R>=235 && G>=235 && B>=235 → alpha 0.

const raw = await sharp(SRC)
  .extract({ left: 0, top: 0, width: meta.width, height: iconHeight })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { data, info } = raw;
const { width, height, channels } = info;
for (let i = 0; i < data.length; i += channels) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  if (r >= 235 && g >= 235 && b >= 235) {
    data[i + 3] = 0; // make transparent
  } else if (r >= 215 && g >= 215 && b >= 215) {
    // soft fade for edge pixels (anti-alias band)
    const lum = (r + g + b) / 3;
    const t = (lum - 215) / 20; // 0 at 215, 1 at 235
    data[i + 3] = Math.round(255 * (1 - t));
  }
}

await sharp(data, { raw: { width, height, channels } })
  .trim({
    background: { r: 0, g: 0, b: 0, alpha: 0 },
    threshold: 5,
  })
  .png({ compressionLevel: 9 })
  .toFile(OUT_ICON);

const finalMeta = await sharp(OUT_ICON).metadata();
console.log(`✓ Wrote ${OUT_ICON} (${finalMeta.width}×${finalMeta.height}, trimmed)`);
