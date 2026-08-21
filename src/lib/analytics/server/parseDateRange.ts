/**
 * HOD Analytics Date Range Parser
 *
 * Supports:
 *  - Preset periods: today, yesterday, last7, last30, this_month, prev_month
 *  - Custom date ranges via start/end, startDate/endDate, or from/to params
 *  - Comparison period calculation (prior equivalent period)
 *
 * The UI (DateRangePicker) sends: ?period=last30&compare=true
 * For custom ranges: ?period=custom&start=YYYY-MM-DD&end=YYYY-MM-DD&compare=false
 */

export interface ParsedDateRange {
  from: string;
  to: string;
  compareFrom?: string;
  compareTo?: string;
}

/** Format a Date to YYYY-MM-DD string (UTC). */
function fmt(d: Date): string {
  return d.toISOString().split("T")[0];
}

/** Compute { from, to } for a named preset period. */
function resolvePreset(period: string): { from: string; to: string } {
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  switch (period) {
    case "today":
      return { from: fmt(today), to: fmt(today) };

    case "yesterday": {
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      return { from: fmt(yesterday), to: fmt(yesterday) };
    }

    case "last7": {
      const sevenAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return { from: fmt(sevenAgo), to: fmt(today) };
    }

    case "last30": {
      const thirtyAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      return { from: fmt(thirtyAgo), to: fmt(today) };
    }

    case "this_month": {
      const firstOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
      return { from: fmt(firstOfMonth), to: fmt(today) };
    }

    case "prev_month": {
      const firstOfPrev = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
      const lastOfPrev = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0));
      return { from: fmt(firstOfPrev), to: fmt(lastOfPrev) };
    }

    default: {
      // Unknown preset — fall back to last 30 days
      const thirtyAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      return { from: fmt(thirtyAgo), to: fmt(today) };
    }
  }
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function parseDateRange(request: Request): ParsedDateRange {
  try {
    const { searchParams } = new URL(request.url);

    const period = searchParams.get("period") || "";
    const compare = searchParams.get("compare") === "true";

    let from: string;
    let to: string;

    if (period && period !== "custom") {
      // Resolve named preset
      const resolved = resolvePreset(period);
      from = resolved.from;
      to = resolved.to;
    } else {
      // Custom range or direct from/to params
      const startRaw =
        searchParams.get("start") ||
        searchParams.get("startDate") ||
        searchParams.get("from") ||
        "";
      const endRaw =
        searchParams.get("end") ||
        searchParams.get("endDate") ||
        searchParams.get("to") ||
        "";

      const now = new Date();
      const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      const thirtyAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      from = DATE_RE.test(startRaw) ? startRaw : fmt(thirtyAgo);
      to = DATE_RE.test(endRaw) ? endRaw : fmt(today);
    }

    // Compute comparison period (equivalent length immediately prior)
    let compareFrom: string | undefined;
    let compareTo: string | undefined;

    if (compare) {
      const fromDate = new Date(from + "T00:00:00Z");
      const toDate = new Date(to + "T00:00:00Z");
      const spanMs = toDate.getTime() - fromDate.getTime() + 24 * 60 * 60 * 1000; // inclusive
      const priorEnd = new Date(fromDate.getTime() - 24 * 60 * 60 * 1000); // day before from
      const priorStart = new Date(priorEnd.getTime() - spanMs + 24 * 60 * 60 * 1000);
      compareFrom = fmt(priorStart);
      compareTo = fmt(priorEnd);
    }

    return { from, to, compareFrom, compareTo };
  } catch {
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const thirtyAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    return {
      from: fmt(thirtyAgo),
      to: fmt(today),
    };
  }
}
