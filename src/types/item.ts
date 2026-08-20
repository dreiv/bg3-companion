export type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface Item {
  id: string;
  name: string;
  act: number;
  rarity: ItemRarity;
  price: number;
  category?: string;
  /** Wiki link for the item (opens in a new tab). */
  url?: string;
  /** Normalized weight, e.g. "4.5 lb". */
  weight?: string;
  /** Consolidated description (AC, weapon properties, where-found, …). */
  description?: string;
  /** Special effect / item power text. */
  effect?: string;
  /** Human-readable location, e.g. "Last Light Inn". */
  location?: string;
  /**
   * Slug id of the matching area in `src/data/areas` (e.g. "last-light-inn").
   * Present only when the location resolved to a known area; deep-links the
   * Location column to the area detail view.
   */
  locationAreaId?: string;
}

export interface ItemFilterState {
  search: string;
  rarities: ItemRarity[];
  priceRange: [number | null, number | null];
  weightRange: [number | null, number | null];
  sortBy: keyof Item | null;
  sortDirection: "asc" | "desc";
}
