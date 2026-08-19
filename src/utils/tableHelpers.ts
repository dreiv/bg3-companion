import type { Item } from "@/types/item";

/**
 * Pure, framework-agnostic filter/sort predicates for the item table.
 * Each function's doc comment documents its own semantics.
 */

/** A `[min, max]` numeric range. `null` bounds are treated as unbounded. */
export type NumericRange = [number | null, number | null];

export type SortDirection = "asc" | "desc";

/**
 * Case-insensitive substring match. An empty / whitespace-only query matches
 * everything, so the filter is a no-op until the user types something.
 */
export function matchesText(value: string | undefined, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (value ?? "").toLowerCase().includes(q);
}

/**
 * Multi-select membership check. An empty selection matches everything;
 * otherwise the item's value must be one of the selected options.
 */
export function matchesMultiSelect<T extends string>(value: T, selected: readonly T[]): boolean {
  if (selected.length === 0) return true;
  return selected.includes(value);
}

/**
 * Numeric range check (inclusive). `null` bounds are unbounded.
 */
export function inNumericRange(value: number, range: NumericRange): boolean {
  const [min, max] = range;
  if (min !== null && value < min) return false;
  if (max !== null && value > max) return false;
  return true;
}

/** True when at least one bound of the range is set (i.e. the filter is active). */
export function hasActiveRange(range: NumericRange): boolean {
  return range[0] !== null || range[1] !== null;
}

/**
 * Weight-specific range check. When no bound is set, every item passes. When a
 * bound is set, items without weight data are excluded (they cannot be
 * verified against the range).
 */
export function matchesWeightRange(weight: string | undefined, range: NumericRange): boolean {
  if (!hasActiveRange(range)) return true;
  const lbs = parseWeightLbs(weight);
  if (lbs === null) return false;
  return inNumericRange(lbs, range);
}

/**
 * Parse a normalized weight string (e.g. `"4.5 lb"`) into a number of pounds.
 * Returns `null` when the weight is absent or unparseable.
 */
export function parseWeightLbs(weight: string | undefined): number | null {
  if (!weight) return null;
  const m = weight.match(/[\d.]+/);
  if (!m) return null;
  const n = Number(m[0]);
  return Number.isFinite(n) ? n : null;
}

/**
 * Extract the comparable value for a sort key. Weight is normalized to its
 * numeric pound value so it sorts numerically (not lexicographically); items
 * without a weight sort last.
 */
export function sortValue(item: Item, key: keyof Item): number | string {
  if (key === "weight") {
    return parseWeightLbs(item.weight) ?? Number.POSITIVE_INFINITY;
  }
  const v = item[key];
  if (typeof v === "number") return v;
  return String(v ?? "");
}

/**
 * Build a comparator for the given sort key + direction.
 */
export function compareBy(key: keyof Item, direction: SortDirection): (a: Item, b: Item) => number {
  const dir = direction === "asc" ? 1 : -1;
  return (a, b) => {
    const av = sortValue(a, key);
    const bv = sortValue(b, key);
    if (typeof av === "number" && typeof bv === "number") {
      return (av - bv) * dir;
    }
    return String(av).localeCompare(String(bv)) * dir;
  };
}
