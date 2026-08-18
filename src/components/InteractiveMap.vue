<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Act, Area } from '@/data/types'
import { resolveImage } from '@/data/images'
import AreaMapCarousel from './AreaMapCarousel.vue'

const props = defineProps<{
  act: Act
  areas: Area[]
}>()

const pinnedAreas = computed(() =>
  props.areas.filter((area) => area.mapHotspot),
)

const hasTimedTodos = (area: Area) =>
  area.todos.some((todo) => todo.timed)

const mapUrl = computed(() =>
  props.act.map?.image ? resolveImage(props.act.map.image) : undefined,
)

const lightboxArea = ref<Area | null>(null)

function openLightbox(area: Area) {
  lightboxArea.value = area
}

function closeLightbox() {
  lightboxArea.value = null
}
</script>

<template>
  <div class="interactive-map">
    <p v-if="!mapUrl" class="map-placeholder">
      No overview map set for this act yet.
    </p>

    <template v-else>
      <div class="map-frame">
        <img class="map-image" :src="mapUrl" :alt="`${act.name} map`" />

        <button v-for="area in pinnedAreas" :key="area.id" type="button" class="map-pin"
          :class="{ warning: area.entryWarning, timed: hasTimedTodos(area) }" :title="area.name" :aria-label="area.name"
          :style="{ left: `${area.mapHotspot!.x}%`, top: `${area.mapHotspot!.y}%` }" @click="openLightbox(area)">
          {{ area.name }}
        </button>
      </div>

      <div class="map-legend">
        <span class="legend-item"><span class="legend-dot" /> Area</span>
        <span class="legend-item"><span class="legend-dot warning" /> Entry warning</span>
        <span class="legend-item"><span class="legend-dot timed" /> Timed content</span>
      </div>
    </template>

    <Teleport to="body">
      <div v-if="lightboxArea" class="lightbox-overlay" @click.self="closeLightbox">
        <div class="lightbox">
          <div class="lightbox-header">
            <h3 class="lightbox-title">{{ lightboxArea.name }}</h3>
            <button type="button" class="lightbox-close" aria-label="Close" @click="closeLightbox">
              ✕
            </button>
          </div>
          <p v-if="lightboxArea.summary" class="lightbox-summary">{{ lightboxArea.summary }}</p>
          <AreaMapCarousel :images="lightboxArea.mapImages" />
          <RouterLink :to="{ name: 'area-detail', params: { actId: act.id, areaId: lightboxArea.id } }"
            class="lightbox-link" @click="closeLightbox">
            View full area details →
          </RouterLink>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.interactive-map {
  width: 100%;
}

.map-placeholder {
  color: var(--text-muted);
  border: 1px dashed var(--border);
  border-radius: 10px;
  background: var(--surface);
  padding: 1.5rem;
  text-align: center;
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
}

.map-pin {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 999px;
  background: var(--accent);
  border: 2px solid var(--surface);
  box-shadow: 0 0 0 1px var(--border);
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.15s ease;
}

.map-pin:hover {
  transform: translate(-50%, -50%) scale(1.2);
}

.map-pin.warning {
  background: var(--warning);
}

.map-pin.timed {
  background: var(--accent);
  box-shadow: 0 0 0 2px var(--warning), 0 0 8px var(--warning);
}

.map-legend {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.legend-dot {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 999px;
  background: var(--accent);
  display: inline-block;
}

.legend-dot.warning {
  background: var(--warning);
}

.legend-dot.timed {
  background: var(--accent);
  box-shadow: 0 0 0 2px var(--warning);
}

.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.lightbox {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  padding: 1.5rem;
}

.lightbox-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.lightbox-title {
  margin: 0;
  font-size: 1.2rem;
}

.lightbox-close {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
}

.lightbox-close:hover {
  color: var(--text);
}

.lightbox-summary {
  color: var(--text-muted);
  margin: 0 0 1rem;
  font-size: 0.9rem;
}

.lightbox-link {
  display: inline-block;
  margin-top: 1rem;
  color: var(--accent);
  text-decoration: none;
}

.lightbox-link:hover {
  text-decoration: underline;
}
</style>
