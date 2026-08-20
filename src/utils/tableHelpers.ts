import type { Item } from "@/types/item";

/** A `[min, max]` numeric range. `null` bounds are treated as unbounded. */
export type NumericRange = [number | null, number | null];

export type SortDirection = "asc" | "desc";

/** Case-insensitive substring match; an empty query matches everything. */
export function matchesText(value: string | undefined, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (value ?? "").toLowerCase().includes(q);
}

/** Multi-select membership check; an empty selection matches everything. */
export function matchesMultiSelect<T extends string>(value: T, selected: readonly T[]): boolean {
  if (selected.length === 0) return true;
  return selected.includes(value);
}

/** Inclusive numeric range check; `null` bounds are unbounded. */
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
 * Weight range check. No bound set → every item passes; otherwise items
 * without weight data are excluded.
 */
export function matchesWeightRange(weight: string | undefined, range: NumericRange): boolean {
  if (!hasActiveRange(range)) return true;
  const lbs = parseWeightLbs(weight);
  if (lbs === null) return false;
  return inNumericRange(lbs, range);
}

/** Parse a weight string (e.g. `"4.5 lb"`) into pounds; `null` if absent/unparseable. */
export function parseWeightLbs(weight: string | undefined): number | null {
  if (!weight) return null;
  const m = weight.match(/[\d.]+/);
  if (!m) return null;
  const n = Number(m[0]);
  return Number.isFinite(n) ? n : null;
}

/** Numeric rank for each rarity tier (higher = rarer). */
const RARITY_RANK: Record<string, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
};

/**
 * Comparable value for a sort key. Weight → numeric pounds (missing sorts
 * last); rarity → tier rank (common → legendary); otherwise the raw value.
 */
export function sortValue(item: Item, key: keyof Item): number | string {
  if (key === "weight") {
    return parseWeightLbs(item.weight) ?? Number.POSITIVE_INFINITY;
  }
  if (key === "rarity") {
    return RARITY_RANK[item.rarity] ?? 0;
  }
  const v = item[key];
  if (typeof v === "number") return v;
  return String(v ?? "");
}

/** Build a comparator for the given sort key + direction. */
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
