<script setup lang="ts">
import { computed } from "vue";
import { RARITY_COLORS } from "@/utils/rarityColors";
import type { ItemRarity } from "@/types/item";

/**
 * Reusable pill/badge. `colorScheme` is either an `ItemRarity` or a category
 * name ("quest" | "companion" | "loot" | "lore" | "other"), each mapping to a
 * shared color token set.
 */

export type PillScheme =
  | ItemRarity
  | "quest"
  | "companion"
  | "loot"
  | "lore"
  | "other";

interface PillColors {
  text: string;
  bg: string;
  border: string;
}

const CATEGORY_COLORS: Record<string, PillColors> = {
  quest: {
    text: "var(--cat-quest)",
    bg: "var(--cat-quest-surface)",
    border: "var(--cat-quest)",
  },
  companion: {
    text: "var(--cat-companion)",
    bg: "var(--cat-companion-surface)",
    border: "var(--cat-companion)",
  },
  loot: {
    text: "var(--cat-loot)",
    bg: "var(--cat-loot-surface)",
    border: "var(--cat-loot)",
  },
  lore: {
    text: "var(--cat-lore)",
    bg: "var(--cat-lore-surface)",
    border: "var(--cat-lore)",
  },
  other: {
    text: "var(--cat-other)",
    bg: "var(--cat-other-surface)",
    border: "var(--cat-other)",
  },
};

const props = withDefaults(
  defineProps<{
    label: string;
    colorScheme: PillScheme;
  }>(),
  { colorScheme: "other" },
);

const colors = computed<PillColors>(() => {
  const rarity = RARITY_COLORS[props.colorScheme as ItemRarity];
  if (rarity) return rarity;
  return CATEGORY_COLORS[props.colorScheme] ?? CATEGORY_COLORS.other!;
});
</script>

<template>
  <span class="pill" :style="{ color: colors.text, background: colors.bg, borderColor: colors.border }">
    <slot>{{ label }}</slot>
  </span>
</template>

<style scoped>
.pill {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  border: 1px solid;
  border-radius: 999px;
  line-height: 1.4;
  white-space: nowrap;
}
</style>
