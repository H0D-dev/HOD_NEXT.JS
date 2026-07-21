// ============================================================
// importer.ts — Pipeline orchestrator
//
// Executes the full import pipeline:
// 1. Parse file → RawProduct[]
// 2. Validate → separate valid / invalid
// 3. Normalize → NormalizedProduct[]
// 4. Map → WCProductPayload + WCVariationPayload[]
// 5. Deduplicate → lookup existing by SKU / slug
// 6. Create or Update parent product
// 7. Sync variations
// 8. Sync tags
// 9. Generate report
// ============================================================

import { parseProductFile } from './csv.parser';
import { validateAll } from './validator';
import { rawToNormalized, normalizedToWCPayload, buildVariationPayloads } from './mapper';
import type { WooCommerceService } from './wc.service';
import type { VariationService } from './variation.service';
import type { Logger } from './logger';
import type { ImportResult, NormalizedProduct, WCProduct, ApiError } from './types';

export interface ImportOptions {
  filePath: string;
  dryRun: boolean;
}

export class Importer {
  constructor(
    private wc: WooCommerceService,
    private variationService: VariationService,
    private logger: Logger
  ) {}

  async run(options: ImportOptions): Promise<ImportResult> {
    this.logger.resetTimer();
    this.logger.header('PRODUCT IMPORTER');

    // ── Step 1: Parse ────────────────────────────────────
    this.logger.info(`Reading ${options.filePath}...`);
    const rawProducts = parseProductFile(options.filePath);
    this.logger.success(`Extracted ${rawProducts.length} products`);

    // ── Step 2: Validate ─────────────────────────────────
    this.logger.info('Validating...');
    const { valid, errors: validationErrors } = validateAll(rawProducts);
    this.logger.addValidationErrors(validationErrors);

    if (validationErrors.length > 0) {
      this.logger.warn(`${validationErrors.length} validation error(s) — those products will be skipped`);
    }
    this.logger.success(`${valid.length} products passed validation`);

    if (options.dryRun) {
      this.logger.header('DRY RUN — No API calls will be made');
    }

    // ── Step 3–8: Process each product ───────────────────
    for (let i = 0; i < valid.length; i++) {
      const raw = valid[i];
      const normalized = rawToNormalized(raw);

      this.logger.progress(i + 1, valid.length, normalized.name);

      try {
        await this.processProduct(normalized, options.dryRun);
      } catch (err: any) {
        const apiError: ApiError = {
          productName: normalized.name,
          endpoint: 'products',
          statusCode: err.statusCode,
          message: err.message || String(err),
        };
        this.logger.addApiError(apiError);
        this.logger.error(`Failed: ${err.message}`);
      }
    }

    this.logger.header('FINISHED');
    return this.logger.getResults();
  }

  private async processProduct(
    product: NormalizedProduct,
    dryRun: boolean
  ): Promise<void> {
    // ── Resolve tags ───────────────────────────────────
    let tagIds: number[] = [];
    if (!dryRun && product.tags.length > 0) {
      this.logger.info(`Resolving ${product.tags.length} tags...`);
      tagIds = await this.wc.findOrCreateTags(product.tags);
    }

    // ── Build payloads ─────────────────────────────────
    const productPayload = normalizedToWCPayload(product, tagIds);
    const variationPayloads = buildVariationPayloads(product, product.sku);

    if (dryRun) {
      this.logger.info(`[DRY RUN] Would create/update: ${product.name}`);
      this.logger.info(`  SKU: ${product.sku}`);
      this.logger.info(`  Design ID: ${product.designId}`);
      this.logger.info(`  Sizes: ${product.sizes.map(s => s.size).join(', ')}`);
      this.logger.info(`  Variations: ${variationPayloads.length}`);
      this.logger.info(`  Tags: ${product.tags.length}`);
      this.logger.addCreated('product', 0, product.name);
      for (const vp of variationPayloads) {
        this.logger.addCreated('variation', 0, `${product.name} - ${vp.attributes[0]?.option}`);
      }
      return;
    }

    // ── Deduplicate: Find existing product ─────────────
    const existing = await this.findExistingProduct(product);

    let parentId: number;

    if (existing) {
      // ── Update existing product ────────────────────
      // If the product was trashed, the update will re-publish it (status is set in payload)
      const statusNote = existing.status === 'trash' ? ' (restoring from trash)' : '';
      this.logger.info(`Updating existing product (ID: ${existing.id})${statusNote}...`);
      const updated = await this.wc.updateProduct(existing.id, productPayload);
      parentId = updated.id;
      this.logger.addUpdated('product', updated.id, product.name);
      this.logger.success(`Updated product (ID: ${parentId})`);
    } else {
      // ── Create new product ─────────────────────────
      this.logger.info('Creating variable product...');
      try {
        const created = await this.wc.createProduct(productPayload);
        parentId = created.id;
        this.logger.addCreated('product', created.id, product.name);
        this.logger.success(`Created product (ID: ${parentId})`);
      } catch (createErr: any) {
        // Handle WC SKU lookup table collision — product may be in trash
        if (createErr.message?.includes('lookup table') || createErr.message?.includes('product_invalid_sku')) {
          this.logger.warn(`SKU collision detected — searching deeper...`);
          // Try broader search by name
          const searchResults = await this.wc.searchProducts(product.name);
          const match = searchResults.find(p => p.sku === product.sku);
          if (match) {
            this.logger.info(`Found existing product (ID: ${match.id}), updating instead...`);
            const updated = await this.wc.updateProduct(match.id, productPayload);
            parentId = updated.id;
            this.logger.addUpdated('product', updated.id, product.name);
            this.logger.success(`Updated product (ID: ${parentId})`);
          } else {
            throw createErr; // Re-throw if we can't recover
          }
        } else {
          throw createErr;
        }
      }
    }

    // ── Sync variations ──────────────────────────────
    this.logger.info(`Syncing ${variationPayloads.length} variation(s)...`);
    await this.variationService.syncVariations(
      parentId,
      product.name,
      variationPayloads
    );
  }

  /**
   * Find existing product using the deduplication priority:
   * 1. SKU (exact match)
   * 2. Slug (generated from name)
   */
  private async findExistingProduct(
    product: NormalizedProduct
  ): Promise<WCProduct | null> {
    // Priority 1: SKU lookup
    try {
      const bySku = await this.wc.getProductBySku(product.sku);
      if (bySku) return bySku;
    } catch {
      // SKU search failed, try next method
    }

    // Priority 2: Slug lookup
    try {
      const slug = this.generateSlug(product.name);
      const bySlug = await this.wc.getProductBySlug(slug);
      if (bySlug) return bySlug;
    } catch {
      // Slug search failed
    }

    return null;
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
