/** Build a query string from defined params (skips empty/null/undefined). */
export function toQueryString(
  params: Record<string, string | number | boolean | undefined | null>,
): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue
    search.set(key, String(value))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}
