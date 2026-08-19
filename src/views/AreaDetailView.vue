<script setup lang="ts">
import { computed } from 'vue'
import { useContentStore } from '@/stores/content'
import AreaTodoItem from '@/components/AreaTodoItem.vue'
import EntryWarning from '@/components/features/EntryWarning.vue'
import PartyRecommendation from '@/components/features/PartyRecommendation.vue'

const props = defineProps<{
  actId: string
  areaId: string
}>()

const content = useContentStore()
const area = computed(() => content.getArea(props.areaId))
const act = computed(() => content.getAct(props.actId))
</script>

<template>
  <div class="view">
    <RouterLink :to="{ name: 'area-list', params: { actId: actId } }" class="back-link">
      ← {{ act?.name ?? 'Back' }}
    </RouterLink>

    <header class="view-header" v-reveal>
      <h1>{{ area?.name ?? 'Unknown area' }}</h1>
    </header>

    <template v-if="area">
      <p v-if="area.summary" class="summary" v-reveal="60" v-html="area.summary"></p>

      <EntryWarning v-if="area.entryWarning" :message="area.entryWarning" v-reveal="100" />

      <section class="section" v-reveal="140">
        <h2 class="section-title">Todos</h2>
        <TransitionGroup v-if="area.todos.length" name="list" tag="ul" class="todo-list">
          <AreaTodoItem v-for="todo in area.todos" :key="todo.id" :todo="todo" />
        </TransitionGroup>
      </section>

      <section v-if="area.suggestedCompanions.length" class="section" v-reveal="180">
        <h2 class="section-title">Companions</h2>
        <div class="companion-suggestions">
          <TransitionGroup name="list" tag="ul" class="companion-list">
            <li v-for="companion in area.suggestedCompanions" :key="companion.name" class="companion">
              <span class="companion-name">{{ companion.name }}</span>
              <p v-if="companion.reason" class="companion-reason" v-html="companion.reason"></p>
            </li>
          </TransitionGroup>
        </div>
      </section>

      <section v-if="area.partyRecommendation" class="section" v-reveal="220">
        <h2 class="section-title">Party</h2>
        <PartyRecommendation :recommendation="area.partyRecommendation" />
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
  margin: 0 0 1.25rem;
  font-size: 1.6rem;
}

.summary {
  margin: 0 0 1.25rem;
  color: var(--text-muted);
}

.section {
  margin-top: 1.75rem;
}

.section-title {
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
}

.todo-list {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.companion-list {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.companion {
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
}

.companion-name {
  font-weight: 600;
}

.companion-reason {
  margin: 0.25rem 0 0;
  font-size: 0.88rem;
  color: var(--text-muted);
}

/* v-html content: links + emphasis injected into summaries and companion reasons. */
.summary :deep(a),
.companion-reason :deep(a) {
  color: var(--accent);
  text-decoration: underline;
}

.summary :deep(b),
.summary :deep(strong),
.companion-reason :deep(b),
.companion-reason :deep(strong) {
  font-weight: 600;
}

.summary :deep(i),
.summary :deep(em),
.companion-reason :deep(i),
.companion-reason :deep(em) {
  font-style: italic;
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
