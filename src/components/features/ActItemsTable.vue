<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useItemsStore } from "@/stores/itemsStore";
import { RARITY_COLORS } from "@/utils/rarityColors";
import type { ItemRarity } from "@/types/item";

const props = defineProps<{
  /** Act number (1, 2, 3…) whose items should be displayed. */
  act: number;
}>();

const store = useItemsStore();

// Keep the store's active act in sync with the prop.
watch(
  () => props.act,
  (act) => store.setAct(act),
  { immediate: true },
);

const items = computed(() => store.filteredItems);

const ALL_RARITIES: ItemRarity[] = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
];

/* ------------------------------------------------------------------ */
/* Popover state                                                       */
/* ------------------------------------------------------------------ */

type PopoverColumn = "name" | "rarity" | "price";
const openPopover = ref<PopoverColumn | null>(null);

function togglePopover(column: PopoverColumn) {
  openPopover.value = openPopover.value === column ? null : column;
  if (column === "price") {
    priceMin.value = store.filter.priceRange[0];
    priceMax.value = store.filter.priceRange[1];
  }
}

function closePopover() {
  openPopover.value = null;
}

function onDocumentClick(e: MouseEvent) {
  if (openPopover.value && !(e.target as HTMLElement).closest(".th-cell")) {
    closePopover();
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") closePopover();
}

onMounted(() => {
  document.addEventListener("click", onDocumentClick);
  document.addEventListener("keydown", onKeydown);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", onDocumentClick);
  document.removeEventListener("keydown", onKeydown);
});

/* ------------------------------------------------------------------ */
/* Price popover local state                                           */
/* ------------------------------------------------------------------ */

const priceMin = ref<number | null>(null);
const priceMax = ref<number | null>(null);

function applyPrice() {
  store.setPriceRange(priceMin.value, priceMax.value);
}

function clearPrice() {
  priceMin.value = null;
  priceMax.value = null;
  store.clearPriceRange();
}

/* ------------------------------------------------------------------ */
/* Name popover (search) — proxies straight to the store               */
/* ------------------------------------------------------------------ */

const nameSearch = computed({
  get: () => store.filter.search,
  set: (v: string) => store.setSearch(v),
});

/* ------------------------------------------------------------------ */
/* Sorting helpers                                                     */
/* ------------------------------------------------------------------ */

function sortIndicator(key: "name" | "rarity" | "price"): string {
  if (store.filter.sortBy !== key) return "";
  return store.filter.sortDirection === "asc" ? "↑" : "↓";
}

function onSortClick(key: "name" | "rarity" | "price") {
  store.toggleSort(key);
}

function rarityColor(rarity: ItemRarity) {
  return RARITY_COLORS[rarity];
}
</script>

<template>
  <div class="items-table-wrap">
    <table class="items-table">
      <thead>
        <tr>
          <!-- Name -->
          <th class="th-cell" :class="{ open: openPopover === 'name' }">
            <div class="th-inner">
              <button type="button" class="th-sort" @click="onSortClick('name')">
                <span>Name</span>
                <span class="sort-arrow" :class="{ active: store.filter.sortBy === 'name' }">
                  {{ sortIndicator("name") }}
                </span>
              </button>
              <button type="button" class="th-filter" :aria-expanded="openPopover === 'name'"
                aria-label="Filter by name" @click="togglePopover('name')">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              </button>

              <div v-if="openPopover === 'name'" class="popover" @click.stop>
                <label class="popover-label" for="filter-name">Search name</label>
                <input id="filter-name" v-model="nameSearch" type="text" class="popover-input"
                  placeholder="Filter by name…" />
              </div>
            </div>
          </th>

          <!-- Rarity -->
          <th class="th-cell" :class="{ open: openPopover === 'rarity' }">
            <div class="th-inner">
              <button type="button" class="th-sort" @click="onSortClick('rarity')">
                <span>Rarity</span>
                <span class="sort-arrow" :class="{ active: store.filter.sortBy === 'rarity' }">
                  {{ sortIndicator("rarity") }}
                </span>
              </button>
              <button type="button" class="th-filter" :aria-expanded="openPopover === 'rarity'"
                aria-label="Filter by rarity" @click="togglePopover('rarity')">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              </button>

              <div v-if="openPopover === 'rarity'" class="popover" @click.stop>
                <p class="popover-label">Rarity</p>
                <div class="rarity-checks">
                  <label v-for="r in ALL_RARITIES" :key="r" class="rarity-check">
                    <input type="checkbox" :checked="store.filter.rarities.includes(r)"
                      @change="store.toggleRarity(r)" />
                    <span class="rarity-dot" :style="{ background: rarityColor(r).text }"></span>
                    <span class="rarity-check-label">{{ r }}</span>
                  </label>
                </div>
              </div>
            </div>
          </th>

          <!-- Price -->
          <th class="th-cell" :class="{ open: openPopover === 'price' }">
            <div class="th-inner">
              <button type="button" class="th-sort" @click="onSortClick('price')">
                <span>Price</span>
                <span class="sort-arrow" :class="{ active: store.filter.sortBy === 'price' }">
                  {{ sortIndicator("price") }}
                </span>
              </button>
              <button type="button" class="th-filter" :aria-expanded="openPopover === 'price'"
                aria-label="Filter by price" @click="togglePopover('price')">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              </button>

              <div v-if="openPopover === 'price'" class="popover" @click.stop>
                <p class="popover-label">Price range</p>
                <div class="price-range">
                  <label class="price-field">
                    <span>Min</span>
                    <input v-model.number="priceMin" type="number" min="0" class="popover-input" placeholder="0" />
                  </label>
                  <label class="price-field">
                    <span>Max</span>
                    <input v-model.number="priceMax" type="number" min="0" class="popover-input" placeholder="∞" />
                  </label>
                </div>
                <div class="popover-actions">
                  <button type="button" class="btn-clear" @click="clearPrice">Clear</button>
                  <button type="button" class="btn-apply" @click="applyPrice">Apply</button>
                </div>
              </div>
            </div>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="!items.length">
          <td colspan="3" class="empty-row">No items match the current filters.</td>
        </tr>
        <tr v-for="item in items" :key="item.id" class="item-row">
          <td class="cell-name">
            <span class="item-name" :style="{ color: rarityColor(item.rarity).text }">
              {{ item.name }}
            </span>
            <span v-if="item.category" class="item-category">{{ item.category }}</span>
          </td>
          <td>
            <span class="rarity-badge" :style="{
              color: rarityColor(item.rarity).text,
              background: rarityColor(item.rarity).bg,
              borderColor: rarityColor(item.rarity).border,
            }">
              {{ item.rarity }}
            </span>
          </td>
          <td class="cell-price">{{ item.price }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.items-table-wrap {
  width: 100%;
  overflow-x: auto;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.th-cell {
  position: relative;
  text-align: left;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--border);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--text-muted);
}

.th-inner {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.th-sort,
.th-filter {
  appearance: none;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  color: inherit;
  font: inherit;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.th-sort:hover,
.th-filter:hover {
  color: var(--accent);
}

.sort-arrow {
  display: inline-block;
  width: 0.9em;
  color: var(--accent);
  opacity: 0;
  transition: opacity 0.15s ease;
}

.sort-arrow.active {
  opacity: 1;
}

.th-filter {
  color: var(--text-muted);
}

.th-cell.open .th-filter {
  color: var(--accent);
}

/* Popover */
.popover {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 20;
  min-width: 180px;
  margin-top: 0.35rem;
  padding: 0.75rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: 0 10px 30px -12px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.popover-label {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
}

.popover-input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.4rem 0.55rem;
  font-size: 0.85rem;
  color: var(--text);
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 6px;
}

.popover-input:focus {
  border-color: var(--accent);
  outline: none;
}

.rarity-checks {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.rarity-check {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.85rem;
  cursor: pointer;
  text-transform: capitalize;
}

.rarity-dot {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 999px;
  flex-shrink: 0;
}

.price-range {
  display: flex;
  gap: 0.5rem;
}

.price-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.popover-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.4rem;
}

.btn-clear,
.btn-apply {
  appearance: none;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  padding: 0.3rem 0.6rem;
  font-size: 0.78rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
}

.btn-apply {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.btn-clear:hover,
.btn-apply:hover {
  opacity: 0.85;
}

/* Rows */
.item-row td {
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}

.cell-name {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.item-name {
  font-weight: 600;
}

.item-category {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.rarity-badge {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  border: 1px solid;
  border-radius: 999px;
}

.cell-price {
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
}

.empty-row {
  text-align: center;
  color: var(--text-muted);
  padding: 1.5rem 0.75rem;
}
</style>
