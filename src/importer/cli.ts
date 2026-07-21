// ============================================================
// cli.ts — Entry point for the Product Importer
//
// Usage:
//   npx tsx src/importer/cli.ts
//   npx tsx src/importer/cli.ts --dry-run
//   npx tsx src/importer/cli.ts --file data/my-products.csv
// ============================================================

import dotenv from 'dotenv';
import path from 'path';
import { CONFIG } from './config';
import { Logger } from './logger';
import { WooCommerceService } from './wc.service';
import { VariationService } from './variation.service';
import { Importer } from './importer';
import { generateReport } from './report';

interface CliArgs {
  file?: string;
  dryRun: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { dryRun: false };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--dry-run' || arg === '-d') {
      args.dryRun = true;
    } else if ((arg === '--file' || arg === '-f') && i + 1 < argv.length) {
      args.file = argv[++i];
    }
  }

  return args;
}

async function main(): Promise<void> {
  // Load environment variables
  dotenv.config({ path: '.env.production' });

  // Parse CLI arguments
  const args = parseArgs(process.argv.slice(2));

  // Resolve file path
  const filePath = args.file
    ? path.resolve(args.file)
    : path.resolve(CONFIG.DATA_DIR, CONFIG.DEFAULT_FILE);

  console.log('');
  console.log('  🏠 House of Decor — Product Importer');
  console.log('');

  // Initialize services
  const logger = new Logger();

  let wc: WooCommerceService;
  if (args.dryRun) {
    // In dry-run mode, we still need a WC service instance for type safety,
    // but the importer won't make API calls
    try {
      wc = new WooCommerceService();
    } catch {
      // If credentials are missing in dry-run, create a dummy
      console.log('  ⚠️  WC credentials not found — running parse-only dry run\n');
      wc = null as any;
    }
  } else {
    wc = new WooCommerceService();
  }

  const variationService = new VariationService(wc, logger);
  const importer = new Importer(wc, variationService, logger);

  // Run import
  const result = await importer.run({
    filePath,
    dryRun: args.dryRun,
  });

  // Generate report
  generateReport(result);

  // Exit with error code if there were failures
  const hasErrors = result.apiErrors.length > 0 || result.validationErrors.length > 0;
  process.exit(hasErrors ? 1 : 0);
}

main().catch(err => {
  console.error('\n  ❌ Fatal error:', err.message || err);
  process.exit(1);
});
