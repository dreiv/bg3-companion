<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { AreaMapImage, MapItem } from '@/data/types'
import { resolveImage } from '@/data/images'
import EmptyState from './EmptyState.vue'
import ImageLightbox from './ImageLightbox.vue'

const props = defineProps<{
  images: AreaMapImage[]
}>()

const index = ref(0)
const hiddenItemIds = ref<Set<string>>(new Set())
const lightboxOpen = ref(false)

const total = computed(() => props.images.length)
const current = computed<AreaMapImage | undefined>(() => props.images[index.value])
const currentUrl = computed(() => (current.value ? resolveImage(current.value.src) : undefined))
const currentItems = computed<MapItem[]>(() => current.value?.items ?? [])
const currentLabel = computed(() => {
  const img = current.value
  if (!img) return ''
  return img.label ?? `Map ${index.value + 1} of ${total.value}`
})

// Pins currently visible (those not toggled off via the legend filters).
const visibleItems = computed(() =>
  currentItems.value.filter((item) => !hiddenItemIds.value.has(item.id)),
)

// Clamp the index if the image list shrinks (e.g. data edited at runtime).
watch(total, (n) => {
  if (index.value >= n) index.value = 0
})

function isHidden(id: string) {
  return hiddenItemIds.value.has(id)
}

function toggleItem(id: string) {
  const next = new Set(hiddenItemIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  hiddenItemIds.value = next
}

function prev() {
  index.value = (index.value - 1 + total.value) % total.value
}

function next() {
  index.value = (index.value + 1) % total.value
}
</script>

<template>
  <div class="area-map-carousel">
    <EmptyState v-if="total === 0" message="No map yet — add one in src/data/areas.ts." />

    <template v-else>
      <div class="carousel">
        <div v-if="total > 1" class="carousel-controls">
          <button type="button" class="carousel-btn" aria-label="Previous map" @click="prev">
            ←
          </button>
          <span class="carousel-label">{{ currentLabel }}</span>
          <button type="button" class="carousel-btn" aria-label="Next map" @click="next">
            →
          </button>
        </div>

        <div class="map-frame">
          <img v-if="currentUrl" class="map-image" :src="currentUrl" :alt="currentLabel" @click="lightboxOpen = true" />

          <button v-for="item in visibleItems" :key="item.id" type="button" class="map-pin" :title="item.label"
            :aria-label="item.label" :style="{ left: `${item.x}%`, top: `${item.y}%` }"
            @click.stop="lightboxOpen = true">
            <span class="map-pin-emoji" aria-hidden="true">{{ item.emoji }}</span>
          </button>
        </div>

        <div v-if="currentItems.length" class="legend-filters">
          <label v-for="item in currentItems" :key="item.id" class="legend-filter">
            <input type="checkbox" class="legend-checkbox" :checked="!isHidden(item.id)"
              @change="toggleItem(item.id)" />
            <span class="legend-emoji" aria-hidden="true">{{ item.emoji }}</span>
            <span class="legend-label">{{ item.label }}</span>
          </label>
        </div>
      </div>

      <ImageLightbox v-if="lightboxOpen" :title="currentLabel" @close="lightboxOpen = false">
        <img v-if="currentUrl" class="lightbox-image" :src="currentUrl" :alt="currentLabel" />
      </ImageLightbox>
    </template>
  </div>
</template>

<style scoped>
.area-map-carousel {
  width: 100%;
}

.carousel {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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

.map-frame {
  position: relative;
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  background: var(--surface);
}

.map-image {
  display: block;
  width: 100%;
  height: auto;
  cursor: zoom-in;
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

.map-pin-emoji {
  font-size: 1rem;
  line-height: 1;
  pointer-events: none;
}

.legend-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.legend-filter {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  cursor: pointer;
  font-size: 0.85rem;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.legend-filter:hover {
  background: var(--surface-2);
}

.legend-checkbox {
  width: 0.95rem;
  height: 0.95rem;
  accent-color: var(--accent);
}

.legend-emoji {
  font-size: 1rem;
  line-height: 1;
}

.lightbox-image {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 8px;
}
</style>
