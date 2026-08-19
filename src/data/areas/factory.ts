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
 * bg3.wiki link helpers.
 *
 * bg3.wiki (the community-run MediaWiki, distinct from the Fandom/Fextralife
 * wikis) uses simple `/wiki/Page_Title` slugs that match in-game names with
 * spaces swapped for underscores. These helpers are used inline inside
 * `note`/`reason`/`summary` strings (which already render as HTML, per the
 * pre-existing <b>/<i> usage) so every named item, spell, NPC, or location
 * becomes a clickable reference.
 *
 * Pass an explicit `slug` for the rare cases where the display name doesn't
 * match the wiki's article title (disambiguation pages, apostrophes handled
 * differently, etc).
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
