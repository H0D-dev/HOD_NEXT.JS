// ============================================================
// report.ts — Final import summary
// ============================================================

import fs from 'fs';
import path from 'path';
import type { ImportResult } from './types';

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
}

export function generateReport(result: ImportResult): void {
  const border = '═'.repeat(52);

  console.log(`\n${border}`);
  console.log('           IMPORT SUMMARY');
  console.log(border);
  console.log(`  Products Created:     ${result.productsCreated}`);
  console.log(`  Products Updated:     ${result.productsUpdated}`);
  console.log(`  Variations Created:   ${result.variationsCreated}`);
  console.log(`  Variations Updated:   ${result.variationsUpdated}`);
  console.log(`  Skipped Products:     ${result.skipped.length}`);
  console.log(`  Validation Errors:    ${result.validationErrors.length}`);
  console.log(`  API Errors:           ${result.apiErrors.length}`);
  console.log(`  Execution Time:       ${formatDuration(result.executionTimeMs)}`);
  console.log(border);

  // Log skipped products if any
  if (result.skipped.length > 0) {
    console.log('\n  Skipped Products:');
    for (const s of result.skipped) {
      console.log(`    - ${s.name}: ${s.reason}`);
    }
  }

  // Log validation errors if any
  if (result.validationErrors.length > 0) {
    console.log('\n  Validation Errors:');
    for (const e of result.validationErrors) {
      console.log(`    - [Product #${e.productIndex + 1}] ${e.productName || 'Unknown'}: ${e.message}`);
    }
  }

  // Log API errors if any
  if (result.apiErrors.length > 0) {
    console.log('\n  API Errors:');
    for (const e of result.apiErrors) {
      console.log(`    - ${e.productName} [${e.endpoint}]: ${e.message}`);
    }
  }

  console.log('');

  // Write structured report to file
  try {
    const reportDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const reportPath = path.join(reportDir, 'import-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`  📄 Full report saved to: ${reportPath}\n`);
  } catch {
    // Non-critical — don't fail the import if report can't be written
  }
}
