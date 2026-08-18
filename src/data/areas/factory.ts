import type { Area, AreaMapImage, AreaTodo, PartyRecommendation } from "../types";

/**
 * Build an `Area` from its core fields, filling in the optional collections
 * (`todos`, `suggestedCompanions`, `mapImages`) with sensible defaults so
 * callers can omit anything they don't need.
 */
export const template = (
  id: string,
  name: string,
  actId: string,
  summary?: string,
  mapImages: AreaMapImage[] = [],
  mapHotspot?: { x: number; y: number },
  partyRecommendation?: PartyRecommendation,
  todos: AreaTodo[] = [],
): Area => ({
  id,
  name,
  actId,
  ...(summary ? { summary } : {}),
  todos,
  suggestedCompanions: [],
  mapImages,
  ...(mapHotspot ? { mapHotspot } : {}),
  ...(partyRecommendation ? { partyRecommendation } : {}),
});
