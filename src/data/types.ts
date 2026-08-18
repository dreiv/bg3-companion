export type TodoCategory = "quest" | "companion" | "loot" | "lore" | "other";

export interface AreaTodo {
  id: string;
  text: string;
  category: TodoCategory;
  timed: boolean; // missable if you leave the area or progress the main plot
  note?: string;
}

export interface CompanionSuggestion {
  name: string;
  reason?: string; // why bring them: approval check, banter, class dialogue, quest trigger
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
  entryWarning?: string; // irreversible consequence of entering (vs. timed: leaving too early)
  todos: AreaTodo[];
  suggestedCompanions: CompanionSuggestion[];
  partyRecommendation?: PartyRecommendation;
}

export interface Act {
  id: string;
  name: string;
}
