import type { SearchSegment } from "@/types/search";

/** Trimmed, lower-cased query, or `null` when empty. */
export function normalizeQuery(query: string): string | null {
  const q = query.trim().toLowerCase();
  return q.length > 0 ? q : null;
}

export function matchesQuery(text: string, query: string): boolean {
  const q = normalizeQuery(query);
  return q === null || text.toLowerCase().includes(q);
}

export function splitByQuery(text: string, query: string): SearchSegment[] {
  const q = normalizeQuery(query);
  if (q === null) return [{ text, match: false }];

  const lower = text.toLowerCase();
  const segments: SearchSegment[] = [];
  let last = 0;
  let idx = lower.indexOf(q, last);

  while (idx !== -1) {
    if (idx > last) segments.push({ text: text.slice(last, idx), match: false });
    segments.push({ text: text.slice(idx, idx + q.length), match: true });
    last = idx + q.length;
    idx = lower.indexOf(q, last);
  }
  if (last < text.length) segments.push({ text: text.slice(last), match: false });
  return segments;
}
