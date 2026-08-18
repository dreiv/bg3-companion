export interface VendorItem {
  name: string;
  price?: string; // e.g. "150 gp" — optional, prices can vary by charisma/rep
  note?: string;
}

export interface Vendor {
  id: string;
  name: string;
  items: VendorItem[];
}

export type TodoCategory = "quest" | "companion" | "loot" | "lore" | "other";

export interface AreaTodo {
  id: string;
  text: string;
  category: TodoCategory;
  timed: boolean; // true = missable if you leave the area / progress the main plot
  note?: string;
}

export interface CompanionSuggestion {
  name: string;
  reason?: string; // why bring them here: approval check, unique banter/reaction,
  // class-specific dialogue option, companion quest trigger, etc.
}

export interface MapHotspot {
  x: number; // 0–100, percentage position on the act's map image
  y: number; // 0–100
}

export interface ActMap {
  image?: string; // path under /public/maps/, e.g. "/maps/act-1.png" — user-supplied,
  // do not fabricate or reference an image that doesn't exist yet
}

export interface Area {
  id: string;
  name: string;
  actId: string;
  summary?: string;
  todos: AreaTodo[];
  vendors: Vendor[];
  suggestedCompanions: CompanionSuggestion[];
  mapHotspot?: MapHotspot;
}

export interface Act {
  id: string;
  name: string;
  areaIds: string[];
  map?: ActMap;
}
