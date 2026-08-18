<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { AreaMapImage, MapItem } from '@/data/types'
import { resolveImage } from '@/data/images'

const props = defineProps<{
  images: AreaMapImage[]
}>()

const index = ref(0)
const selectedItemId = ref<string | null>(null)

const total = computed(() => props.images.length)
const current = computed<AreaMapImage | undefined>(() => props.images[index.value])
const currentUrl = computed(() => (current.value ? resolveImage(current.value.src) : undefined))
const currentItems = computed<MapItem[]>(() => current.value?.items ?? [])
const currentLabel = computed(() => {
  const img = current.value
  if (!img) return ''
  return img.label ?? `Map ${index.value + 1} of ${total.value}`
})

// Clamp the index if the image list shrinks (e.g. data edited at runtime).
watch(total, (n) => {
  if (index.value >= n) index.value = 0
})

function select(id: string | null) {
  selectedItemId.value = id
}

function toggleSelect(id: string) {
  selectedItemId.value = selectedItemId.value === id ? null : id
}

function prev() {
  index.value = (index.value - 1 + total.value) % total.value
  selectedItemId.value = null
}

function next() {
  index.value = (index.value + 1) % total.value
  selectedItemId.value = null
}
</script>

<template>
  <div class="area-map-carousel">
    <p v-if="total === 0" class="empty">
      No map yet — add one in <code>src/data/areas.ts</code>.
    </p>

    <template v-else>
      <div class="carousel">
        <div class="carousel-body">
          <div class="map-frame">
            <img v-if="currentUrl" class="map-image" :src="currentUrl" :alt="currentLabel" />

            <button v-for="item in currentItems" :key="item.id" type="button" class="map-pin"
              :class="{ selected: selectedItemId === item.id }" :title="item.label" :aria-label="item.label"
              :style="{ left: `${item.x}%`, top: `${item.y}%` }" @click="toggleSelect(item.id)">
              <span class="map-pin-emoji" aria-hidden="true">{{ item.emoji }}</span>
            </button>
          </div>

          <aside v-if="currentItems.length" class="legend">
            <p class="legend-title">Legend</p>
            <ul class="legend-list">
              <li v-for="item in currentItems" :key="item.id">
                <button type="button" class="legend-row" :class="{ selected: selectedItemId === item.id }"
                  @click="toggleSelect(item.id)">
                  <span class="legend-emoji" aria-hidden="true">{{ item.emoji }}</span>
                  <span class="legend-label">{{ item.label }}</span>
                </button>
              </li>
            </ul>
          </aside>
        </div>

        <div v-if="total > 1" class="carousel-controls">
          <button type="button" class="carousel-btn" aria-label="Previous map" @click="prev">
            ←
          </button>
          <span class="carousel-label">{{ currentLabel }}</span>
          <button type="button" class="carousel-btn" aria-label="Next map" @click="next">
            →
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.area-map-carousel {
  width: 100%;
}

.empty {
  color: var(--text-muted);
  border: 1px dashed var(--border);
  border-radius: 10px;
  background: var(--surface);
  padding: 1.5rem;
  text-align: center;
}

.carousel {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.carousel-body {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.map-frame {
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  background: var(--surface);
}

.map-image {
  display: block;
  width: 100%;
  height: auto;
}

.map-pin {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 1.7rem;
  height: 1.7rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--surface);
  border: 2px solid var(--accent);
  box-shadow: 0 0 0 1px var(--border);
  cursor: pointer;
  padding: 0;
  transition:
    transform 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.map-pin:hover {
  transform: translate(-50%, -50%) scale(1.15);
}

.map-pin.selected {
  border-color: var(--warning);
  box-shadow:
    0 0 0 2px var(--warning),
    0 0 0 4px var(--surface);
  transform: translate(-50%, -50%) scale(1.2);
}

.map-pin-emoji {
  font-size: 1rem;
  line-height: 1;
  pointer-events: none;
}

.legend {
  flex: 0 0 auto;
  width: 15rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  padding: 0.75rem;
}

.legend-title {
  margin: 0 0 0.5rem;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--text-muted);
}

.legend-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  text-align: left;
  appearance: none;
  border: 1px solid transparent;
  border-radius: 8px;
  background: none;
  padding: 0.4rem 0.5rem;
  cursor: pointer;
  color: var(--text);
  font-size: 0.9rem;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.legend-row:hover {
  background: var(--surface-2);
}

.legend-row.selected {
  border-color: var(--warning);
  background: var(--warning-surface);
}

.legend-emoji {
  font-size: 1.1rem;
  line-height: 1;
}

.legend-label {
  min-width: 0;
}

.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.carousel-btn {
  appearance: none;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  width: 2.25rem;
  height: 2.25rem;
  font-size: 1rem;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.carousel-btn:hover {
  background: var(--surface-2);
  border-color: var(--accent);
}

.carousel-label {
  min-width: 10rem;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
}

@media (max-width: 640px) {
  .carousel-body {
    flex-direction: column;
  }

  .legend {
    width: 100%;
  }
}
</style>
