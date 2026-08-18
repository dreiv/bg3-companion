import type { Area, AreaTodo, CompanionSuggestion, PartyRecommendation } from "../types";

/** Build an `Area`, defaulting optional collections so callers can omit them. */
export const template = (
  id: string,
  name: string,
  actId: string,
  summary?: string,
  partyRecommendation?: PartyRecommendation,
  suggestedCompanions: CompanionSuggestion[] = [],
  todos: AreaTodo[] = [],
): Area => ({
  id,
  name,
  actId,
  ...(summary ? { summary } : {}),
  todos,
  suggestedCompanions,
  ...(partyRecommendation ? { partyRecommendation } : {}),
});
