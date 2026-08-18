<script setup lang="ts">
import { computed, ref } from 'vue'
import { useContentStore } from '@/stores/content'
import AreaTodoItem from '@/components/AreaTodoItem.vue'
import CompanionSuggestions from '@/components/CompanionSuggestions.vue'

const props = defineProps<{
  actId: string
  areaId: string
}>()

const content = useContentStore()
const area = computed(() => content.getArea(props.areaId))
const act = computed(() => content.getAct(props.actId))

const activeTab = ref<'todos' | 'companions'>('todos')
</script>

<template>
  <div class="view">
    <RouterLink :to="{ name: 'area-list', params: { actId: actId } }" class="back-link">
      ← {{ act?.name ?? 'Back' }}
    </RouterLink>

    <header class="view-header">
      <h1>{{ area?.name ?? 'Unknown area' }}</h1>
      <p v-if="area?.summary" class="summary">{{ area.summary }}</p>
    </header>

    <template v-if="area">
      <div v-if="area.entryWarning" class="entry-warning">
        <svg class="entry-warning-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <div class="entry-warning-body">
          <span class="entry-warning-label">Warning</span>
          <p class="entry-warning-text">{{ area.entryWarning }}</p>
        </div>
      </div>

      <div class="tabs" role="tablist">
        <button role="tab" :aria-selected="activeTab === 'todos'" class="tab" :class="{ active: activeTab === 'todos' }"
          @click="activeTab = 'todos'">
          Todos
        </button>
        <button role="tab" :aria-selected="activeTab === 'companions'" class="tab"
          :class="{ active: activeTab === 'companions' }" @click="activeTab = 'companions'">
          Companions
        </button>
      </div>

      <section v-if="activeTab === 'todos'" class="tab-panel">
        <p v-if="area.todos.length === 0" class="empty">
          No entries yet — add some in <code>src/data/areas.ts</code>.
        </p>
        <ul v-else class="todo-list">
          <AreaTodoItem v-for="todo in area.todos" :key="todo.id" :todo="todo" />
        </ul>
      </section>

      <section v-else class="tab-panel">
        <CompanionSuggestions :companions="area.suggestedCompanions" />
      </section>
    </template>
  </div>
</template>

<style scoped>
.view {
  max-width: 720px;
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
  margin: 0 0 0.25rem;
  font-size: 1.6rem;
}

.summary {
  margin: 0 0 1.25rem;
  color: var(--text-muted);
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

.todo-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.entry-warning {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  margin-bottom: 1.25rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--warning);
  border-left: 4px solid var(--warning);
  border-radius: 8px;
  background: var(--warning-surface);
  color: var(--warning);
}

.entry-warning-icon {
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.entry-warning-body {
  min-width: 0;
}

.entry-warning-label {
  display: block;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.entry-warning-text {
  margin: 0.15rem 0 0;
  font-size: 0.9rem;
  color: var(--text);
}
</style>
