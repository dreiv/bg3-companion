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

export interface Area {
  id: string;
  name: string;
  actId: string;
  summary?: string;
  todos: AreaTodo[];
  vendors: Vendor[];
}

export interface Act {
  id: string;
  name: string;
  areaIds: string[];
}
