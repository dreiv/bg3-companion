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

/**
 * bg3.wiki link helpers. bg3.wiki uses `/wiki/Page_Title` slugs matching
 * in-game names (spaces → underscores). Used inline in `note`/`reason`/
 * `summary` strings so named items, spells, NPCs, and locations become
 * clickable. Pass an explicit `slug` when the display name differs from the
 * article title.
 */
const WIKI_BASE = "https://bg3.wiki/wiki/";

const wikiHref = (label: string, slug?: string): string =>
  `${WIKI_BASE}${encodeURIComponent((slug ?? label).replace(/ /g, "_"))}`;

/** Plain wiki-linked text — use for NPCs, companions, locations, generic terms. */
export const wiki = (label: string, slug?: string): string =>
  `<a href="${wikiHref(label, slug)}" target="_blank" rel="noopener noreferrer">${label}</a>`;

/** Bold, wiki-linked item name — mirrors the prior <b>Item</b> convention. */
export const wikiItem = (label: string, slug?: string): string => `<b>${wiki(label, slug)}</b>`;

/** Italic, wiki-linked spell/action name — mirrors the prior <i>Spell</i> convention. */
export const wikiSpell = (label: string, slug?: string): string => `<i>${wiki(label, slug)}</i>`;
