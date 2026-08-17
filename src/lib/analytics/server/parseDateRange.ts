/**
 * Helper to parse date range query parameters (?from=YYYY-MM-DD&to=YYYY-MM-DD)
 * Defaults to the last 30 days if parameters are omitted or invalid.
 */
export function parseDateRange(request: Request): { from: string; to: string } {
  try {
    const { searchParams } = new URL(request.url);
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    const from = fromParam && /^\d{4}-\d{2}-\d{2}$/.test(fromParam)
      ? fromParam
      : thirtyDaysAgo.toISOString().split("T")[0];

    const to = toParam && /^\d{4}-\d{2}-\d{2}$/.test(toParam)
      ? toParam
      : now.toISOString().split("T")[0];

    return { from, to };
  } catch {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return {
      from: thirtyDaysAgo.toISOString().split("T")[0],
      to: now.toISOString().split("T")[0],
    };
  }
}
