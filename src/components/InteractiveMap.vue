<script setup lang="ts">
import { computed } from 'vue'
import type { Act, Area } from '@/data/types'

const props = defineProps<{
  act: Act
  areas: Area[]
}>()

const pinnedAreas = computed(() =>
  props.areas.filter((area) => area.mapHotspot),
)
</script>

<template>
  <div class="interactive-map">
    <p v-if="!act.map?.image" class="map-placeholder">
      No map image yet — add one to <code>public/maps/</code> and set
      <code>map.image</code> on this act in <code>acts.ts</code>.
    </p>

    <div v-else class="map-frame">
      <img class="map-image" :src="act.map.image" :alt="`${act.name} map`" />

      <RouterLink v-for="area in pinnedAreas" :key="area.id"
        :to="{ name: 'area-detail', params: { actId: act.id, areaId: area.id } }" class="map-pin"
        :class="{ warning: area.entryWarning }" :title="area.name"
        :style="{ left: `${area.mapHotspot!.x}%`, top: `${area.mapHotspot!.y}%` }">
        {{ area.name }}
      </RouterLink>
    </div>
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
</style>
