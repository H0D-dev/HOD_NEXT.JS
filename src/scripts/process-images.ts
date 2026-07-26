import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Configuration
const RAW_DIR = path.resolve(process.cwd(), 'data/raw-images');
const PROCESSED_DIR = path.resolve(process.cwd(), 'data/processed-images');

// Ensure directories exist
if (!fs.existsSync(RAW_DIR)) {
  fs.mkdirSync(RAW_DIR, { recursive: true });
}
if (!fs.existsSync(PROCESSED_DIR)) {
  fs.mkdirSync(PROCESSED_DIR, { recursive: true });
}

// Supported input formats
const SUPPORTED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.heic', '.avif'];

async function processImages() {
  console.log(`\n🖼️  House of Decor — Bulk Image Converter`);
  console.log(`========================================\n`);

  const files = fs.readdirSync(RAW_DIR);
  let processedCount = 0;
  let skippedCount = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    
    // Skip unsupported files (like .DS_Store or zips)
    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
      continue;
    }

    const inputPath = path.join(RAW_DIR, file);
    const fileNameWithoutExt = path.basename(file, path.extname(file));
    const outputPath = path.join(PROCESSED_DIR, `${fileNameWithoutExt}.jpg`);

    try {
      console.log(`⏳ Converting: ${file} ...`);
      
      await sharp(inputPath)
        // Convert to JPEG with optimized quality
        .jpeg({ 
          quality: 85, // Good balance of quality and size
          mozjpeg: true, // Use mozjpeg to reduce file size further
          chromaSubsampling: '4:4:4'
        })
        // Resize if it's too large (e.g., larger than 2000px wide) 
        // without upscaling smaller images
        .resize({
          width: 2000,
          withoutEnlargement: true,
          fit: 'inside'
        })
        .toFile(outputPath);

      console.log(`  ✅ Saved as: ${fileNameWithoutExt}.jpg`);
      processedCount++;
    } catch (err: any) {
      console.error(`  ❌ Failed to process ${file}:`, err.message);
      skippedCount++;
    }
  }

  console.log(`\n========================================`);
  console.log(`🎉 Finished!`);
  console.log(`   Successfully converted: ${processedCount}`);
  console.log(`   Failed/Skipped:       ${skippedCount}`);
  console.log(`   Output folder:        data/processed-images/`);
  console.log(`========================================\n`);
}

processImages().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
