<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useItemsStore } from "@/stores/itemsStore";
import { RARITY_COLORS } from "@/utils/rarityColors";
import { hasActiveRange } from "@/utils/tableHelpers";
import Pill from "@/components/ui/Pill.vue";
import type { Item, ItemRarity } from "@/types/item";

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

type PopoverColumn = "name" | "rarity" | "price" | "weight";
const openPopover = ref<PopoverColumn | null>(null);

/** Ref to the name-search input so we can auto-focus it when the popover opens. */
const nameSearchInput = ref<HTMLInputElement | null>(null);

async function togglePopover(column: PopoverColumn) {
  const opening = openPopover.value !== column;
  openPopover.value = opening ? column : null;
  // Hydrate the local min/max inputs from the store when a range popover opens.
  if (opening) {
    if (column === "price") {
      priceMin.value = store.filter.priceRange[0];
      priceMax.value = store.filter.priceRange[1];
    } else if (column === "weight") {
      weightMin.value = store.filter.weightRange[0];
      weightMax.value = store.filter.weightRange[1];
    }
  }
  // Auto-focus the name search field as soon as its popover opens.
  if (column === "name" && opening) {
    await nextTick();
    nameSearchInput.value?.focus();
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
  closePopover();
}

function clearPrice() {
  priceMin.value = null;
  priceMax.value = null;
  store.clearPriceRange();
  closePopover();
}

/* ------------------------------------------------------------------ */
/* Weight popover local state (same numeric-range UX as Price)         */
/* ------------------------------------------------------------------ */

const weightMin = ref<number | null>(null);
const weightMax = ref<number | null>(null);

function applyWeight() {
  store.setWeightRange(weightMin.value, weightMax.value);
  closePopover();
}

function clearWeight() {
  weightMin.value = null;
  weightMax.value = null;
  store.clearWeightRange();
  closePopover();
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

function sortIndicator(key: keyof Item): string {
  if (store.filter.sortBy !== key) return "";
  return store.filter.sortDirection === "asc" ? "↑" : "↓";
}

function onSortClick(key: keyof Item) {
  store.toggleSort(key);
}

function rarityColor(rarity: ItemRarity) {
  return RARITY_COLORS[rarity];
}

/**
 * Whether a column currently has an active filter. Drives the amber
 * "filter active" highlight on the column's filter button.
 */
function isFilterActive(column: PopoverColumn): boolean {
  const f = store.filter;
  switch (column) {
    case "name":
      return f.search.trim().length > 0;
    case "rarity":
      return f.rarities.length > 0;
    case "price":
      return hasActiveRange(f.priceRange);
    case "weight":
      return hasActiveRange(f.weightRange);
  }
}

/** Combined hover text for the Properties/Effects cell (effect + description). */
function hoverInfo(item: Item): string {
  const parts = [item.effect, item.description].filter(Boolean);
  return parts.join("\n\n");
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
              <button type="button" class="th-filter" :class="{ active: isFilterActive('name') }"
                :aria-expanded="openPopover === 'name'" aria-label="Filter by name" @click="togglePopover('name')">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              </button>

              <div v-if="openPopover === 'name'" class="popover" @click.stop>
                <label class="popover-label" for="filter-name">Search name</label>
                <input id="filter-name" ref="nameSearchInput" v-model="nameSearch" type="text" class="popover-input"
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
              <button type="button" class="th-filter" :class="{ active: isFilterActive('rarity') }"
                :aria-expanded="openPopover === 'rarity'" aria-label="Filter by rarity"
                @click="togglePopover('rarity')">
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

          <!-- Category (display only) -->
          <th class="th-cell th-static">
            <span>Category</span>
          </th>

          <!-- Properties / Special Effects (display only) -->
          <th class="th-cell th-static">
            <span>Properties</span>
          </th>

          <!-- Weight (sort + numeric range filter) -->
          <th class="th-cell" :class="{ open: openPopover === 'weight' }">
            <div class="th-inner">
              <button type="button" class="th-sort" @click="onSortClick('weight')">
                <span>Weight</span>
                <span class="sort-arrow" :class="{ active: store.filter.sortBy === 'weight' }">
                  {{ sortIndicator("weight") }}
                </span>
              </button>
              <button type="button" class="th-filter" :class="{ active: isFilterActive('weight') }"
                :aria-expanded="openPopover === 'weight'" aria-label="Filter by weight"
                @click="togglePopover('weight')">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              </button>

              <div v-if="openPopover === 'weight'" class="popover" @click.stop>
                <p class="popover-label">Weight range (lb)</p>
                <div class="price-range">
                  <label class="price-field">
                    <span>Min</span>
                    <input v-model.number="weightMin" type="number" min="0" step="0.1" class="popover-input"
                      placeholder="0" />
                  </label>
                  <label class="price-field">
                    <span>Max</span>
                    <input v-model.number="weightMax" type="number" min="0" step="0.1" class="popover-input"
                      placeholder="∞" />
                  </label>
                </div>
                <div class="popover-actions">
                  <button type="button" class="btn-clear" @click="clearWeight">Clear</button>
                  <button type="button" class="btn-apply" @click="applyWeight">Apply</button>
                </div>
              </div>
            </div>
          </th>

          <!-- Price (sort + numeric range filter) -->
          <th class="th-cell" :class="{ open: openPopover === 'price' }">
            <div class="th-inner">
              <button type="button" class="th-sort" @click="onSortClick('price')">
                <span>Price</span>
                <span class="sort-arrow" :class="{ active: store.filter.sortBy === 'price' }">
                  {{ sortIndicator("price") }}
                </span>
              </button>
              <button type="button" class="th-filter" :class="{ active: isFilterActive('price') }"
                :aria-expanded="openPopover === 'price'" aria-label="Filter by price" @click="togglePopover('price')">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              </button>

              <div v-if="openPopover === 'price'" class="popover popover-right" @click.stop>
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

          <!-- Location (display + navigation) -->
          <th class="th-cell th-static">
            <span>Location</span>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="!items.length">
          <td colspan="7" class="empty-row">No items match the current filters.</td>
        </tr>
        <tr v-for="item in items" :key="item.id" class="item-row">
          <td class="cell-name">
            <a v-if="item.url" :href="item.url" target="_blank" rel="noopener noreferrer" class="item-name"
              :style="{ color: rarityColor(item.rarity).text }">
              {{ item.name }}
            </a>
            <span v-else class="item-name" :style="{ color: rarityColor(item.rarity).text }">
              {{ item.name }}
            </span>
          </td>
          <td>
            <Pill :label="item.rarity" :color-scheme="item.rarity" />
          </td>
          <td class="cell-category">{{ item.category ?? "—" }}</td>
          <td class="cell-props" :title="hoverInfo(item)">
            <span v-if="item.effect" class="props-effect">{{ item.effect }}</span>
            <span v-else-if="item.description" class="props-desc">{{ item.description }}</span>
            <span v-else class="props-empty">—</span>
          </td>
          <td class="cell-weight">{{ item.weight ?? "—" }}</td>
          <td class="cell-price">{{ item.price }}</td>
          <td class="cell-location">
            <button v-if="item.locationAreaId" type="button" class="location-link"
              @click="store.navigateToActArea(item.locationAreaId!, item.act)">
              {{ item.location ?? "View area" }}
            </button>
            <span v-else class="location-plain">{{ item.location ?? "—" }}</span>
          </td>
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
  letter-spacing: 0.02em;
  color: var(--text-muted);
  white-space: nowrap;
}

.th-static {
  cursor: default;
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

/* Active filter indicator — amber highlight so the user sees a filter is on. */
.th-filter.active {
  color: var(--filter-active);
}

.th-filter.active:hover {
  color: var(--filter-active);
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

.popover-right {
  left: auto;
  right: 0;
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
  min-width: 160px;
}

.item-name {
  font-weight: 600;
  text-decoration: none;
}

a.item-name:hover {
  text-decoration: underline;
}

.cell-category {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.cell-props {
  max-width: 320px;
}

.props-effect {
  display: block;
  font-size: 0.82rem;
  color: var(--text);
}

.props-desc {
  display: block;
  font-size: 0.82rem;
  color: var(--text-muted);
}

.props-empty {
  color: var(--text-muted);
}

.cell-price {
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
  white-space: nowrap;
}

.cell-weight {
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
  white-space: nowrap;
}

.cell-location {
  white-space: nowrap;
}

.location-link {
  appearance: none;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
  color: var(--accent);
  text-align: left;
}

.location-link:hover {
  text-decoration: underline;
}

.location-plain {
  color: var(--text-muted);
}

.empty-row {
  text-align: center;
  color: var(--text-muted);
  padding: 1.5rem 0.75rem;
}
</style>
