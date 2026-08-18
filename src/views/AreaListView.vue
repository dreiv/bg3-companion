<script setup lang="ts">
import { computed, ref } from 'vue'
import { useContentStore } from '@/stores/content'
import { useProgressStore } from '@/stores/progress'
import InteractiveMap from '@/components/InteractiveMap.vue'
import AreaTodoItem from '@/components/AreaTodoItem.vue'
import EmptyState from '@/components/EmptyState.vue'
import type { Area } from '@/data/types'

const props = defineProps<{
  actId: string
}>()

const content = useContentStore()
const progress = useProgressStore()

const act = computed(() => content.getAct(props.actId))
const areaList = computed(() => content.getAreasForAct(props.actId))
const quests = computed(() => content.getQuestsForAct(props.actId))

const filter = ref('')
const filteredAreas = computed(() => {
  const q = filter.value.trim().toLowerCase()
  if (!q) return areaList.value
  return areaList.value.filter((a) => a.name.toLowerCase().includes(q))
})

type ViewMode = 'list' | 'map' | 'quests'
const activeView = ref<ViewMode>('list')

function completion(area: Area) {
  const total = area.todos.length
  const done = area.todos.filter((t) => progress.isDone(t.id)).length
  return { done, total }
}

function areaRoute(areaId: string) {
  return { name: 'area-detail', params: { actId: props.actId, areaId } }
}
</script>

<template>
  <div class="view">
    <RouterLink :to="{ name: 'act-list' }" class="back-link">← All acts</RouterLink>

    <header class="view-header">
      <h1>{{ act?.name ?? 'Unknown act' }}</h1>
    </header>

    <div class="tabs" role="tablist">
      <button role="tab" :aria-selected="activeView === 'list'" class="tab" :class="{ active: activeView === 'list' }"
        @click="activeView = 'list'">
        List
      </button>
      <button role="tab" :aria-selected="activeView === 'map'" class="tab" :class="{ active: activeView === 'map' }"
        @click="activeView = 'map'">
        Map
      </button>
      <button role="tab" :aria-selected="activeView === 'quests'" class="tab"
        :class="{ active: activeView === 'quests' }" @click="activeView = 'quests'">
        Quests
      </button>
    </div>

    <section v-if="activeView === 'list'" class="tab-panel">
      <EmptyState v-if="!areaList.length" message="No areas yet — add some in src/data/areas.ts." />

      <template v-else>
        <input v-if="areaList.length >= 10" v-model="filter" type="text" class="area-filter"
          placeholder="Filter areas by name…" aria-label="Filter areas by name" />

        <p v-if="!filteredAreas.length" class="empty">
          No areas match “{{ filter }}”.
        </p>

        <nav v-else class="area-list">
          <RouterLink v-for="area in filteredAreas" :key="area.id"
            :to="{ name: 'area-detail', params: { actId: actId, areaId: area.id } }" class="area-card">
            <span class="area-name">
              {{ area.name }}
              <svg v-if="area.entryWarning" class="area-warning-icon" viewBox="0 0 24 24" width="14" height="14"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                aria-hidden="true">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </span>
            <span class="area-progress">
              {{ completion(area).done }}/{{ completion(area).total }} done
            </span>
          </RouterLink>
        </nav>
      </template>
    </section>

    <section v-else-if="activeView === 'map'" class="tab-panel">
      <a class="map-linkout" href="https://bg3.wiki/wiki/Interactive_Map" target="_blank" rel="noopener">
        Open full interactive map ↗
      </a>
      <p class="map-linkout-caption">
        For full item/NPC detail — this app's map only tracks your own progress.
      </p>
      <InteractiveMap :act="act!" :areas="areaList" />
    </section>

    <section v-else-if="activeView === 'quests'" class="tab-panel">
      <EmptyState v-if="quests.length === 0" message="No quests yet — add some in src/data/areas.ts." />
      <ul v-else class="flat-list">
        <li v-for="item in quests" :key="item.id" class="flat-item">
          <RouterLink :to="areaRoute(item.areaId)" class="flat-area">
            {{ item.areaName }}
          </RouterLink>
          <AreaTodoItem :todo="item" />
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.view {
  max-width: 640px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  color: var(--accent);
  text-decoration: none;
  font-size: 0.9rem;
}

.back-link:hover {
  text-decoration: underline;
}

.view-header h1 {
  margin: 0 0 1.5rem;
  font-size: 1.6rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid var(--border);
}

.tab {
  appearance: none;
  border: none;
  background: none;
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}

.tab.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

.empty {
  color: var(--text-muted);
}

.flat-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.flat-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.flat-area {
  align-self: flex-start;
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  text-decoration: none;
}

.flat-area:hover {
  color: var(--accent);
  text-decoration: underline;
}

.area-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.area-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1.1rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  color: var(--text);
  text-decoration: none;
  transition: border-color 0.15s ease;
}

.area-card:hover {
  border-color: var(--accent);
}

.area-name {
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.area-warning-icon {
  color: var(--warning);
  flex-shrink: 0;
}

.area-progress {
  color: var(--text-muted);
  font-size: 0.85rem;
  white-space: nowrap;
}

.area-filter {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 0.75rem;
  padding: 0.55rem 0.75rem;
  font-size: 0.9rem;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.area-filter:focus {
  outline: none;
  border-color: var(--accent);
}

.map-linkout {
  display: inline-block;
  margin-bottom: 0.25rem;
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
}

.map-linkout:hover {
  text-decoration: underline;
}

.map-linkout-caption {
  margin: 0 0 1rem;
  font-size: 0.82rem;
  color: var(--text-muted);
}
</style>
