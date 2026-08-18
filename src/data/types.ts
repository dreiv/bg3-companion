export type TodoCategory = "quest" | "companion" | "loot" | "lore" | "other";

export interface AreaTodo {
  id: string;
  text: string;
  category: TodoCategory;
  timed: boolean; // Missable if leaving area or advancing major plot triggers
  note?: string;
}

export interface CompanionSuggestion {
  name: string;
  reason?: string;
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
  entryWarning?: string; // Point of no return warning
  todos: AreaTodo[];
  suggestedCompanions: CompanionSuggestion[];
  partyRecommendation?: PartyRecommendation;
}

export interface Act {
  id: string;
  name: string;
}
