import type { ItemRarity } from "@/types/item";

/**
 * Rarity → color tokens. Values are CSS custom-property references (defined in
 * `assets/styles.css`) so the palette adapts to light/dark mode.
 */
export const RARITY_COLORS: Record<ItemRarity, { text: string; bg: string; border: string }> = {
  common: {
    text: "var(--rarity-common-text)",
    bg: "var(--rarity-common-bg)",
    border: "var(--rarity-common-border)",
  },
  uncommon: {
    text: "var(--rarity-uncommon-text)",
    bg: "var(--rarity-uncommon-bg)",
    border: "var(--rarity-uncommon-border)",
  },
  rare: {
    text: "var(--rarity-rare-text)",
    bg: "var(--rarity-rare-bg)",
    border: "var(--rarity-rare-border)",
  },
  epic: {
    text: "var(--rarity-epic-text)",
    bg: "var(--rarity-epic-bg)",
    border: "var(--rarity-epic-border)",
  },
  legendary: {
    text: "var(--rarity-legendary-text)",
    bg: "var(--rarity-legendary-bg)",
    border: "var(--rarity-legendary-border)",
  },
};
