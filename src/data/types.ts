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

export interface MapItem {
  id: string;
  label: string;
  emoji: string; // single emoji used as the pin, e.g. "⚔️", "📖", "🧪", "🔑"
  x: number; // 0–100, percentage position on THIS specific map image
  y: number; // 0–100
}

export interface AreaMapImage {
  src: string;
  label?: string; // required when an area has more than one image, e.g. "Ground Floor",
  // "1st Floor", "Basement" — omit for single-image areas
  items?: MapItem[]; // defaults to [] — pins for this specific image only
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
  entryWarning?: string; // shown BEFORE the player commits — something irreversible
  // triggers on entry (a fight starts, a companion reacts,
  // another area/quest becomes unreachable). Distinct from
  // AreaTodo.timed, which is about not leaving too early.
  todos: AreaTodo[];
  suggestedCompanions: CompanionSuggestion[];
  mapHotspot?: MapHotspot;
  mapImages: AreaMapImage[]; // this area's own detailed map(s), separate from
  // the act-level overview map (`Act.map` + `mapHotspot`, unchanged)
}

export interface Act {
  id: string;
  name: string;
  areaIds: string[];
  map?: ActMap;
}
