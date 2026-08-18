<script setup lang="ts">
import { computed, ref } from 'vue'
import { useContentStore } from '@/stores/content'
import { useProgressStore } from '@/stores/progress'
import { useSearch } from '@/composables/useSearch'
import AreaTodoItem from '@/components/AreaTodoItem.vue'
import SearchInput from '@/components/ui/SearchInput.vue'
import type { Area } from '@/data/types'

const props = defineProps<{
  actId: string
}>()

const content = useContentStore()
const progress = useProgressStore()

const act = computed(() => content.getAct(props.actId))
const areaList = computed(() => content.getAreasForAct(props.actId))
const quests = computed(() => content.getQuestsForAct(props.actId))

// One shared search instance drives both tabs; the query persists across them.
const searchInput = ref<InstanceType<typeof SearchInput> | null>(null)
const search = useSearch({
  hotkey: true,
  // Getter so the template ref is resolved when the hotkey fires, not at setup.
  input: () => searchInput.value?.el() ?? null,
})

const filteredAreas = computed(() => search.filter(areaList.value, (a) => a.name))
const filteredQuests = computed(() => search.filter(quests.value, (q) => q.text))

type ViewMode = 'list' | 'quests'
const activeView = ref<ViewMode>('list')

const tabs: { id: ViewMode; label: string }[] = [
  { id: 'list', label: 'List' },
  { id: 'quests', label: 'Quests' },
]

function onTabKeydown(e: KeyboardEvent) {
  const i = tabs.findIndex((t) => t.id === activeView.value)
  let next = -1
  if (e.key === 'ArrowRight') next = (i + 1) % tabs.length
  else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length
  else if (e.key === 'Home') next = 0
  else if (e.key === 'End') next = tabs.length - 1
  if (next < 0) return
  const tab = tabs[next]
  if (!tab) return
  e.preventDefault()
  activeView.value = tab.id
  document.getElementById(`tab-${tab.id}`)?.focus()
}

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

    <header class="view-header" v-reveal>
      <h1>{{ act?.name ?? 'Unknown act' }}</h1>
    </header>

    <div class="tabs" role="tablist" aria-label="Area views" v-reveal="60">
      <button v-for="tab in tabs" :key="tab.id" :id="`tab-${tab.id}`" type="button" role="tab"
        :aria-selected="activeView === tab.id" :aria-controls="`panel-${tab.id}`"
        :tabindex="activeView === tab.id ? 0 : -1" class="tab" :class="{ active: activeView === tab.id }"
        @click="activeView = tab.id" @keydown="onTabKeydown">
        {{ tab.label }}
      </button>
    </div>

    <section v-if="activeView === 'list'" id="panel-list" role="tabpanel" aria-labelledby="tab-list" class="tab-panel">
      <template v-if="areaList.length">
        <SearchInput v-if="areaList.length >= 10" v-model="search.query.value" ref="searchInput"
          placeholder="Filter areas by name…" label="Filter areas by name" :show-hotkey-hint="true" />

        <p v-if="!filteredAreas.length" class="empty">
          No areas match “{{ search.query.value }}”.
        </p>

        <TransitionGroup v-else name="list" tag="nav" class="area-list">
          <RouterLink v-for="area in filteredAreas" :key="area.id"
            :to="{ name: 'area-detail', params: { actId: actId, areaId: area.id } }" class="area-card">
            <span class="area-name">
              <span class="area-name-text">
                <template v-for="(seg, i) in search.highlight(area.name)" :key="i">
                  <mark v-if="seg.match" class="search-highlight">{{ seg.text }}</mark>
                  <template v-else>{{ seg.text }}</template>
                </template>
              </span>
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
        </TransitionGroup>
      </template>
    </section>

    <section v-else-if="activeView === 'quests'" id="panel-quests" role="tabpanel" aria-labelledby="tab-quests"
      class="tab-panel">
      <template v-if="quests.length">
        <SearchInput v-if="quests.length >= 10" v-model="search.query.value" ref="searchInput"
          placeholder="Filter quests…" label="Filter quests" :show-hotkey-hint="true" />

        <p v-if="!filteredQuests.length" class="empty">
          No quests match “{{ search.query.value }}”.
        </p>

        <TransitionGroup v-else name="list" tag="ul" class="flat-list">
          <li v-for="item in filteredQuests" :key="item.id" class="flat-item">
            <RouterLink :to="areaRoute(item.areaId)" class="flat-area">
              {{ item.areaName }}
            </RouterLink>
            <AreaTodoItem :todo="item" :highlight="search.highlight" />
          </li>
        </TransitionGroup>
      </template>
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
  position: relative;
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
  position: relative;
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
  transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}

.area-card:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px -10px rgba(0, 0, 0, 0.3);
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

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.list-leave-active {
  position: absolute;
  width: 100%;
}

@media (prefers-reduced-motion: reduce) {

  .list-move,
  .list-enter-active,
  .list-leave-active {
    transition: none;
  }
}
</style>
