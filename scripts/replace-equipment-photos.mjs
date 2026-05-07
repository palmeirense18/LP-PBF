import sharp from "sharp";

await sharp("IMG-tratada/1carrosselnovo.png")
  .jpeg({ quality: 88 })
  .toFile("public/machines/01-vm04-vertical-machining-center.jpg");

await sharp("IMG-tratada/5carrosselnovo.png")
  .jpeg({ quality: 88 })
  .toFile("public/machines/05-tc02-compact-turning-center.jpg");

console.log("✓ Replaced equipment photos at positions 1 and 5");
