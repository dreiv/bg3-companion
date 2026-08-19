import type { SearchSegment } from "@/types/search";

/** Trimmed, lower-cased query, or `null` when empty. */
export function normalizeQuery(query: string): string | null {
  const q = query.trim().toLowerCase();
  return q.length > 0 ? q : null;
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

/**
 * Highlight query matches inside an HTML string, wrapping each match in
 * `<mark class="search-highlight">`. Only plain-text runs (outside tags) are
 * searched, so embedded markup such as `<a>`, `<b>`, `<i>` is preserved intact.
 * Returns the original string unchanged when there is no active query.
 */
export function highlightHtml(html: string, query: string): string {
  const q = normalizeQuery(query);
  if (q === null) return html;

  // Split into markup chunks (`<...>`) and text chunks; only the text chunks
  // are searched so we never highlight across or inside a tag.
  return html
    .split(/(<[^>]*>)/g)
    .map((part) => (part.startsWith("<") ? part : highlightText(part, q)))
    .join("");
}

function highlightText(text: string, q: string): string {
  const lower = text.toLowerCase();
  let result = "";
  let last = 0;
  let idx = lower.indexOf(q, last);

  while (idx !== -1) {
    if (idx > last) result += text.slice(last, idx);
    result += `<mark class="search-highlight">${text.slice(idx, idx + q.length)}</mark>`;
    last = idx + q.length;
    idx = lower.indexOf(q, last);
  }
  if (last < text.length) result += text.slice(last);
  return result;
}
