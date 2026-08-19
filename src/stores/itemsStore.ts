import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";

import itemsData from "@/data/items.json";
import type { Item, ItemFilterState, ItemRarity } from "@/types/item";
import {
  compareBy,
  inNumericRange,
  matchesMultiSelect,
  matchesText,
  matchesWeightRange,
} from "@/utils/tableHelpers";

export type ViewTab = "list" | "quests" | "items";

const items = itemsData as unknown as Item[];

function defaultFilter(): ItemFilterState {
  return {
    search: "",
    rarities: [],
    priceRange: [null, null],
    weightRange: [null, null],
    sortBy: null,
    sortDirection: "asc",
  };
}

export const useItemsStore = defineStore("items", () => {
  const router = useRouter();

  const activeTab = ref<ViewTab>("list");
  const currentAct = ref<number>(1);
  const filter = ref<ItemFilterState>(defaultFilter());

  /**
   * Items for the current act, with the full filter pipeline applied:
   * act → name search → rarity → price range → weight range → sort.
   *
   * Each predicate is a small, reusable helper from `tableHelpers.ts`:
   *  - `matchesText`        → case-insensitive name search
   *  - `matchesMultiSelect` → strict rarity gate (empty selection = show all)
   *  - `inNumericRange`     → price min/max bounds
   *  - `matchesWeightRange` → weight min/max bounds (numeric, in lbs)
   *
   * Rarity filtering is strict: when the `rarities` selection is non-empty,
   * an item is kept ONLY if its rarity is one of the selected rarities.
   */
  const filteredItems = computed<Item[]>(() => {
    const f = filter.value;

    const result = items.filter((item) => {
      if (item.act !== currentAct.value) return false;
      if (!matchesText(item.name, f.search)) return false;
      if (!matchesMultiSelect(item.rarity, f.rarities)) return false;
      if (!inNumericRange(item.price, f.priceRange)) return false;
      if (!matchesWeightRange(item.weight, f.weightRange)) return false;
      return true;
    });

    const sortBy = f.sortBy;
    if (sortBy) {
      result.sort(compareBy(sortBy, f.sortDirection));
    }

    return result;
  });

  /** Switch the active view tab and reset all item filters as a side effect. */
  function setActiveTab(tab: ViewTab) {
    if (activeTab.value === tab) return;
    activeTab.value = tab;
    resetSearchAndFilters();
  }

  function setAct(act: number) {
    currentAct.value = act;
  }

  function setSearch(value: string) {
    filter.value.search = value;
  }

  function toggleRarity(rarity: ItemRarity) {
    const idx = filter.value.rarities.indexOf(rarity);
    if (idx === -1) filter.value.rarities.push(rarity);
    else filter.value.rarities.splice(idx, 1);
  }

  function setPriceRange(min: number | null, max: number | null) {
    filter.value.priceRange = [min, max];
  }

  function clearPriceRange() {
    filter.value.priceRange = [null, null];
  }

  function setWeightRange(min: number | null, max: number | null) {
    filter.value.weightRange = [min, max];
  }

  function clearWeightRange() {
    filter.value.weightRange = [null, null];
  }

  function toggleSort(key: keyof Item) {
    if (filter.value.sortBy === key) {
      filter.value.sortDirection = filter.value.sortDirection === "asc" ? "desc" : "asc";
    } else {
      filter.value.sortBy = key;
      filter.value.sortDirection = "asc";
    }
  }

  /**
   * Navigate to the area detail view for a given area id. The act id is
   * derived from the item's act number (e.g. act 1 → "act-1").
   */
  function navigateToActArea(areaId: string, act: number) {
    router.push({ name: "area-detail", params: { actId: `act-${act}`, areaId } });
  }

  /** Clear the query + all filters. Called on tab switch. */
  function resetSearchAndFilters() {
    filter.value = defaultFilter();
  }

  return {
    items,
    activeTab,
    currentAct,
    filter,
    filteredItems,
    setActiveTab,
    setAct,
    setSearch,
    toggleRarity,
    setPriceRange,
    clearPriceRange,
    setWeightRange,
    clearWeightRange,
    toggleSort,
    navigateToActArea,
    resetSearchAndFilters,
  };
});
