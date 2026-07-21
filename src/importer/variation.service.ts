// ============================================================
// variation.service.ts — Variation sync orchestrator
//
// Handles creating/updating variations for a parent product.
// Matches existing variations by SKU to avoid duplicates.
// ============================================================

import type { WooCommerceService } from './wc.service';
import type { Logger } from './logger';
import type { WCVariationPayload, WCVariation, ApiError } from './types';

export class VariationService {
  constructor(
    private wc: WooCommerceService,
    private logger: Logger
  ) {}

  /**
   * Sync variations for a parent product.
   * - Fetches existing variations
   * - Creates missing ones (by SKU)
   * - Updates existing ones (by SKU match)
   */
  async syncVariations(
    parentId: number,
    parentName: string,
    variationPayloads: WCVariationPayload[]
  ): Promise<{ created: number; updated: number; errors: ApiError[] }> {
    const errors: ApiError[] = [];
    let created = 0;
    let updated = 0;

    // Fetch existing variations for this product
    let existingVariations: WCVariation[] = [];
    try {
      existingVariations = await this.wc.getVariations(parentId);
    } catch (err: any) {
      this.logger.warn(`Could not fetch existing variations for ${parentName}: ${err.message}`);
    }

    // Build a map of existing variation SKUs → IDs
    const skuToVariation = new Map<string, WCVariation>();
    for (const v of existingVariations) {
      if (v.sku) {
        skuToVariation.set(v.sku, v);
      }
    }

    for (let i = 0; i < variationPayloads.length; i++) {
      const payload = variationPayloads[i];
      const sizeLabel = payload.attributes[0]?.option || `Var ${i + 1}`;

      try {
        const existing = skuToVariation.get(payload.sku);

        if (existing) {
          // Update existing variation
          await this.wc.updateVariation(parentId, existing.id, payload);
          this.logger.info(`  Updated Variation ${i + 1}/${variationPayloads.length}: ${sizeLabel} (ID: ${existing.id})`);
          this.logger.addUpdated('variation', existing.id, `${parentName} - ${sizeLabel}`);
          updated++;
        } else {
          // Create new variation
          const created_var = await this.wc.createVariation(parentId, payload);
          this.logger.info(`  Created Variation ${i + 1}/${variationPayloads.length}: ${sizeLabel} (ID: ${created_var.id})`);
          this.logger.addCreated('variation', created_var.id, `${parentName} - ${sizeLabel}`);
          created++;
        }
      } catch (err: any) {
        const apiError: ApiError = {
          productName: `${parentName} - ${sizeLabel}`,
          endpoint: `products/${parentId}/variations`,
          statusCode: err.statusCode,
          message: err.message,
        };
        errors.push(apiError);
        this.logger.addApiError(apiError);
        this.logger.error(`Variation ${sizeLabel}: ${err.message}`);
      }
    }

    return { created, updated, errors };
  }
}
