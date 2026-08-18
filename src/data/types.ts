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

export interface PartyRecommendation {
  quest: string;
  recommendedComp: string[];
  reason: string;
  confidence: "high" | "medium" | "low";
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
  partyRecommendation?: PartyRecommendation;
}

export interface Act {
  id: string;
  name: string;
  areaIds: string[];
}
