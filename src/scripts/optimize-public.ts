import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// By default, scan public/images unless a specific folder is passed as an argument
const targetPathArg = process.argv[2] || 'public/images';
const TARGET_DIR = path.resolve(process.cwd(), targetPathArg);

const isHighQuality = targetPathArg.includes('home') || targetPathArg === 'public';
const MAX_WIDTH = isHighQuality ? 3000 : 2000;
const JPG_QUALITY = isHighQuality ? 95 : 80;
const PNG_QUALITY = isHighQuality ? 95 : 80;

async function scanDirectory(dir: string): Promise<string[]> {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.resolve(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      const res = await scanDirectory(fullPath);
      results = results.concat(res);
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

async function optimizeImages() {
  console.log(`\n🖼️  Optimizing Images In-Place`);
  console.log(`📂 Target: ${targetPathArg}`);
  console.log(`========================================\n`);

  if (!fs.existsSync(TARGET_DIR)) {
    console.error(`❌ Directory not found: ${TARGET_DIR}`);
    process.exit(1);
  }

  const allFiles = await scanDirectory(TARGET_DIR);
  const images = allFiles.filter(f => /\.(png|jpg|jpeg)$/i.test(f));

  if (images.length === 0) {
    console.log(`ℹ️ No .png or .jpg images found.`);
    return;
  }

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let processedCount = 0;
  let skippedCount = 0;

  for (const filePath of images) {
    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);

    try {
      const stats = fs.statSync(filePath);
      const originalSize = stats.size;
      totalOriginalSize += originalSize;

      console.log(`⏳ Processing: ${fileName} (${(originalSize / 1024 / 1024).toFixed(2)} MB)`);

      // Read file entirely into memory first, so we can overwrite the same file
      const buffer = fs.readFileSync(filePath);

      let pipeline = sharp(buffer)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true, fit: 'inside' });

      if (ext === '.png') {
        pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9, effort: 7 });
      } else if (ext === '.jpg' || ext === '.jpeg') {
        pipeline = pipeline.jpeg({ quality: JPG_QUALITY, mozjpeg: true, chromaSubsampling: '4:4:4' });
      }

      const outBuffer = await pipeline.toBuffer();

      // Overwrite the original file
      fs.writeFileSync(filePath, outBuffer);

      const newSize = outBuffer.length;
      totalOptimizedSize += newSize;

      const savings = (((originalSize - newSize) / originalSize) * 100).toFixed(0);
      console.log(`  ✅ Done! New size: ${(newSize / 1024 / 1024).toFixed(2)} MB (Saved ${savings}%)`);

      processedCount++;
    } catch (err: any) {
      console.error(`  ❌ Failed to process ${fileName}:`, err.message);
      skippedCount++;
    }
  }

  console.log(`\n========================================`);
  console.log(`🎉 Finished!`);
  console.log(`   Images optimized:   ${processedCount}`);
  console.log(`   Skipped / Failed:   ${skippedCount}`);
  console.log(`   Total Before:       ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Total After:        ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`========================================\n`);
}

optimizeImages().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
