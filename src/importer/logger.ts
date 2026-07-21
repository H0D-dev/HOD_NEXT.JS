// ============================================================
// logger.ts — Console output + structured event collection
// ============================================================

import type {
  ImportResult,
  ValidationError,
  ApiError,
  SkippedProduct,
} from './types';

interface CreatedEntry {
  type: 'product' | 'variation';
  id: number;
  name: string;
}

interface UpdatedEntry {
  type: 'product' | 'variation';
  id: number;
  name: string;
}

export class Logger {
  private validationErrors: ValidationError[] = [];
  private apiErrors: ApiError[] = [];
  private created: CreatedEntry[] = [];
  private updated: UpdatedEntry[] = [];
  private skipped: SkippedProduct[] = [];
  private startTime: number = Date.now();

  info(message: string): void {
    console.log(`  ${message}`);
  }

  success(message: string): void {
    console.log(`  ✅ ${message}`);
  }

  warn(message: string): void {
    console.warn(`  ⚠️  ${message}`);
  }

  error(message: string): void {
    console.error(`  ❌ ${message}`);
  }

  progress(current: number, total: number, label: string): void {
    console.log(`\n  [${current}/${total}] ${label}`);
  }

  header(message: string): void {
    console.log(`\n${'═'.repeat(52)}`);
    console.log(`  ${message}`);
    console.log(`${'═'.repeat(52)}`);
  }

  // --- Structured collection ---

  addValidationError(err: ValidationError): void {
    this.validationErrors.push(err);
  }

  addValidationErrors(errs: ValidationError[]): void {
    this.validationErrors.push(...errs);
  }

  addApiError(err: ApiError): void {
    this.apiErrors.push(err);
  }

  addCreated(type: 'product' | 'variation', id: number, name: string): void {
    this.created.push({ type, id, name });
  }

  addUpdated(type: 'product' | 'variation', id: number, name: string): void {
    this.updated.push({ type, id, name });
  }

  addSkipped(name: string, reason: string): void {
    this.skipped.push({ name, reason });
  }

  resetTimer(): void {
    this.startTime = Date.now();
  }

  getResults(): ImportResult {
    return {
      productsCreated: this.created.filter(e => e.type === 'product').length,
      productsUpdated: this.updated.filter(e => e.type === 'product').length,
      variationsCreated: this.created.filter(e => e.type === 'variation').length,
      variationsUpdated: this.updated.filter(e => e.type === 'variation').length,
      skipped: [...this.skipped],
      validationErrors: [...this.validationErrors],
      apiErrors: [...this.apiErrors],
      executionTimeMs: Date.now() - this.startTime,
    };
  }
}
