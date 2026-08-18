export type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface Item {
  id: string;
  name: string;
  act: number; // e.g., 1, 2, 3...
  rarity: ItemRarity;
  price: number;
  category?: string;
}

export interface ItemFilterState {
  search: string;
  rarities: ItemRarity[];
  priceRange: [number | null, number | null];
  sortBy: keyof Item | null;
  sortDirection: "asc" | "desc";
}
