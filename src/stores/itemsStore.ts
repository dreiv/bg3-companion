import { computed, ref } from "vue";
import { defineStore } from "pinia";

import itemsData from "@/data/items.json";
import type { Item, ItemFilterState, ItemRarity } from "@/types/item";

export type ViewTab = "list" | "quests" | "items";

const items = itemsData as unknown as Item[];

function defaultFilter(): ItemFilterState {
  return {
    search: "",
    rarities: [],
    priceRange: [null, null],
    sortBy: null,
    sortDirection: "asc",
  };
}

export const useItemsStore = defineStore("items", () => {
  const activeTab = ref<ViewTab>("list");
  const currentAct = ref<number>(1);
  const filter = ref<ItemFilterState>(defaultFilter());

  /**
   * Items for the current act, with the full filter pipeline applied:
   * act → search → rarity → price range → sort.
   */
  const filteredItems = computed<Item[]>(() => {
    const f = filter.value;
    const q = f.search.trim().toLowerCase();
    const [minPrice, maxPrice] = f.priceRange;

    const result = items.filter((item) => {
      if (item.act !== currentAct.value) return false;
      if (q && !item.name.toLowerCase().includes(q)) return false;
      if (f.rarities.length > 0 && !f.rarities.includes(item.rarity)) return false;
      if (minPrice !== null && item.price < minPrice) return false;
      if (maxPrice !== null && item.price > maxPrice) return false;
      return true;
    });

    const sortBy = f.sortBy;
    if (sortBy) {
      const dir = f.sortDirection === "asc" ? 1 : -1;
      result.sort((a, b) => {
        const av = a[sortBy];
        const bv = b[sortBy];
        if (typeof av === "number" && typeof bv === "number") {
          return (av - bv) * dir;
        }
        return String(av).localeCompare(String(bv)) * dir;
      });
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

  function toggleSort(key: keyof Item) {
    if (filter.value.sortBy === key) {
      filter.value.sortDirection = filter.value.sortDirection === "asc" ? "desc" : "asc";
    } else {
      filter.value.sortBy = key;
      filter.value.sortDirection = "asc";
    }
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
    toggleSort,
    resetSearchAndFilters,
  };
});
