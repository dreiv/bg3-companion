import type { Area, AreaTodo, PartyRecommendation } from "../types";

/**
 * Build an `Area` from its core fields, filling in the optional collections
 * (`todos`, `suggestedCompanions`) with sensible defaults so callers can omit
 * anything they don't need.
 */
export const template = (
  id: string,
  name: string,
  actId: string,
  summary?: string,
  partyRecommendation?: PartyRecommendation,
  todos: AreaTodo[] = [],
): Area => ({
  id,
  name,
  actId,
  ...(summary ? { summary } : {}),
  todos,
  suggestedCompanions: [],
  ...(partyRecommendation ? { partyRecommendation } : {}),
});
