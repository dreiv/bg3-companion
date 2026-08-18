<script setup lang="ts">
import { computed } from 'vue'
import { useContentStore } from '@/stores/content'
import { useProgressStore } from '@/stores/progress'
import type { Area } from '@/data/types'

const props = defineProps<{
  actId: string
}>()

const content = useContentStore()
const progress = useProgressStore()

const act = computed(() => content.getAct(props.actId))
const areaList = computed(() => content.getAreasForAct(props.actId))

function completion(area: Area) {
  const total = area.todos.length
  const done = area.todos.filter((t) => progress.isDone(t.id)).length
  return { done, total }
}
</script>

<template>
  <div class="view">
    <RouterLink :to="{ name: 'act-list' }" class="back-link">← All acts</RouterLink>

    <header class="view-header">
      <h1>{{ act?.name ?? 'Unknown act' }}</h1>
    </header>

    <p v-if="!areaList.length" class="empty">
      No areas yet — add some in <code>src/data/areas.ts</code>.
    </p>

    <nav v-else class="area-list">
      <RouterLink
        v-for="area in areaList"
        :key="area.id"
        :to="{ name: 'area-detail', params: { actId: actId, areaId: area.id } }"
        class="area-card"
      >
        <span class="area-name">{{ area.name }}</span>
        <span class="area-progress">
          {{ completion(area).done }}/{{ completion(area).total }} done
        </span>
      </RouterLink>
    </nav>
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

.empty {
  color: var(--text-muted);
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
}

.area-progress {
  color: var(--text-muted);
  font-size: 0.85rem;
  white-space: nowrap;
}
</style>
