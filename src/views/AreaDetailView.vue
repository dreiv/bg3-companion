<script setup lang="ts">
import { computed, ref } from 'vue'
import { useContentStore } from '@/stores/content'
import AreaTodoItem from '@/components/AreaTodoItem.vue'
import VendorCard from '@/components/VendorCard.vue'

const props = defineProps<{
  actId: string
  areaId: string
}>()

const content = useContentStore()
const area = computed(() => content.getArea(props.areaId))
const act = computed(() => content.getAct(props.actId))

const activeTab = ref<'todos' | 'vendors'>('todos')
</script>

<template>
  <div class="view">
    <RouterLink
      :to="{ name: 'area-list', params: { actId: actId } }"
      class="back-link"
    >
      ← {{ act?.name ?? 'Back' }}
    </RouterLink>

    <header class="view-header">
      <h1>{{ area?.name ?? 'Unknown area' }}</h1>
      <p v-if="area?.summary" class="summary">{{ area.summary }}</p>
    </header>

    <template v-if="area">
      <div class="tabs" role="tablist">
        <button
          role="tab"
          :aria-selected="activeTab === 'todos'"
          class="tab"
          :class="{ active: activeTab === 'todos' }"
          @click="activeTab = 'todos'"
        >
          Todos
        </button>
        <button
          role="tab"
          :aria-selected="activeTab === 'vendors'"
          class="tab"
          :class="{ active: activeTab === 'vendors' }"
          @click="activeTab = 'vendors'"
        >
          Vendors
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
        <p v-if="area.vendors.length === 0" class="empty">
          No entries yet — add some in <code>src/data/areas.ts</code>.
        </p>
        <div v-else class="vendor-grid">
          <VendorCard
            v-for="vendor in area.vendors"
            :key="vendor.id"
            :vendor="vendor"
          />
        </div>
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

.vendor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 0.75rem;
}
</style>
