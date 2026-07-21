// ============================================================
// validator.ts — Product validation
//
// Validates each RawProduct against required fields.
// Products that fail are logged and skipped.
// ============================================================

import type { RawProduct, ValidationError } from './types';

const REQUIRED_FIELDS: { field: keyof RawProduct; label: string }[] = [
  { field: 'name', label: 'Product Name' },
  { field: 'description', label: 'Description' },
  { field: 'sku', label: 'SKU (Item Number)' },
  { field: 'designId', label: 'Design ID' },
];

/**
 * Validate a single raw product.
 * Returns an array of validation errors (empty = valid).
 */
export function validate(product: RawProduct, index: number): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check required string fields
  for (const { field, label } of REQUIRED_FIELDS) {
    const value = product[field];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors.push({
        productIndex: index,
        productName: product.name || `Product #${index + 1}`,
        field: label,
        message: `Missing required field: ${label}`,
      });
    }
  }

  // Must have at least one size with a valid AED price
  if (!product.sizes || product.sizes.length === 0) {
    errors.push({
      productIndex: index,
      productName: product.name || `Product #${index + 1}`,
      field: 'Size / Price (AED)',
      message: 'Product must have at least one size with a valid AED price',
    });
  } else {
    // Validate each size entry
    for (let i = 0; i < product.sizes.length; i++) {
      const entry = product.sizes[i];
      if (!entry.size || entry.size.trim() === '') {
        errors.push({
          productIndex: index,
          productName: product.name,
          field: `Size[${i}]`,
          message: `Size entry ${i + 1} has an empty size value`,
        });
      }
      if (isNaN(entry.priceAED) || entry.priceAED <= 0) {
        errors.push({
          productIndex: index,
          productName: product.name,
          field: `Price (AED)[${i}]`,
          message: `Size entry ${i + 1} (${entry.size}) has an invalid AED price: ${entry.priceAED}`,
        });
      }
    }
  }

  return errors;
}

/**
 * Validate all products, separating valid from invalid.
 */
export function validateAll(products: RawProduct[]): {
  valid: RawProduct[];
  errors: ValidationError[];
} {
  const allErrors: ValidationError[] = [];
  const valid: RawProduct[] = [];

  for (let i = 0; i < products.length; i++) {
    const errors = validate(products[i], i);
    if (errors.length === 0) {
      valid.push(products[i]);
    } else {
      allErrors.push(...errors);
    }
  }

  return { valid, errors: allErrors };
}
