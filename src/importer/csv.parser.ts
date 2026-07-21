// ============================================================
// csv.parser.ts — CSV Parser
//
// Reads a CSV exported from Google Sheets and groups multi-row
// product blocks into RawProduct objects. The rest of the
// pipeline never knows the source format.
// ============================================================

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import type { RawCsvRow, RawProduct, SizePriceEntry } from './types';

/**
 * Parse a CSV file exported from Google Sheets.
 *
 * The CSV format uses multi-row product blocks:
 * - Row with Sr. No. + Product Name = new product (first size inline)
 * - Subsequent rows with only Size + Prices = additional sizes for same product
 * - Rows with Sr. No. but no Product Name = empty placeholders (skipped)
 */
export function parseProductFile(filePath: string): RawProduct[] {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }

  const fileContent = fs.readFileSync(absolutePath, 'utf-8');
  const extension = path.extname(absolutePath).toLowerCase();

  if (extension === '.csv') {
    return parseCsv(fileContent);
  }

  // Future: add .docx support here
  throw new Error(`Unsupported file format: ${extension}. Supported: .csv`);
}

function parseCsv(content: string): RawProduct[] {
  const rows: RawCsvRow[] = parse(content, {
    columns: true,
    skip_empty_lines: false, // We need empty rows for multi-row detection
    relax_column_count: true,
    trim: true,
    bom: true,
  });

  const products: RawProduct[] = [];
  let currentProduct: RawProduct | null = null;

  for (const row of rows) {
    const hasProductName = !!row['Product Name']?.trim();
    const hasSize = !!row['Size']?.trim();
    const hasPriceAED = !!row['Price (AED)']?.trim();

    if (hasProductName) {
      // This is a new product row — save previous if exists
      if (currentProduct) {
        products.push(currentProduct);
      }

      const sizeEntry = buildSizeEntry(row);

      currentProduct = {
        serialNumber: row['Sr. No.']?.trim() || '',
        name: row['Product Name']!.trim(),
        description: row['Description']?.trim() || '',
        weavingTechnique: row['Weaving Technique']?.trim() || '',
        material: row['Material']?.trim() || '',
        colourAttributes: row['Colour Attributes']?.trim() || '',
        shape: row['Shape']?.trim() || '',
        designId: row['Design ID']?.trim() || '',
        sku: row['Item Number (SKU)']?.trim() || '',
        pattern: row['Pattern']?.trim() || '',
        altText: row['alt Text']?.trim() || '',
        imageCaption: row['Image Title / Caption']?.trim() || '',
        imageDescription: row['Image description']?.trim() || '',
        tags: row['tags']?.trim() || '',
        sizes: sizeEntry ? [sizeEntry] : [],
      };
    } else if (hasSize && hasPriceAED && currentProduct) {
      // Continuation row — additional size for current product
      const sizeEntry = buildSizeEntry(row);
      if (sizeEntry) {
        currentProduct.sizes.push(sizeEntry);
      }
    }
    // Rows with only Sr. No. (empty placeholders at end of file) are skipped
  }

  // Don't forget the last product
  if (currentProduct) {
    products.push(currentProduct);
  }

  return products;
}

function buildSizeEntry(row: RawCsvRow): SizePriceEntry | null {
  const size = row['Size']?.trim();
  const priceAED = row['Price (AED)']?.trim();

  if (!size || !priceAED) return null;

  const aed = parseFloat(priceAED);
  if (isNaN(aed)) return null;

  const usd = row['Price (USD)']?.trim();
  const eur = row['Price (EUR)']?.trim();

  return {
    size,
    priceAED: aed,
    priceUSD: usd ? parseFloat(usd) || undefined : undefined,
    priceEUR: eur ? parseFloat(eur) || undefined : undefined,
  };
}
