<script setup lang="ts">
import { computed } from 'vue'
import { useContentStore } from '@/stores/content'
import AreaTodoItem from '@/components/AreaTodoItem.vue'

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
      <p v-if="area.summary" class="summary" v-reveal="60">{{ area.summary }}</p>

      <div v-if="area.entryWarning" class="entry-warning" v-reveal="100">
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
              <p v-if="companion.reason" class="companion-reason">{{ companion.reason }}</p>
            </li>
          </TransitionGroup>
        </div>
      </section>

      <section v-if="area.partyRecommendation" class="section" v-reveal="220">
        <h2 class="section-title">Party</h2>
        <div class="party-rec">
          <h3 class="party-rec-quest">{{ area.partyRecommendation.quest }}</h3>
          <p class="party-rec-reason">{{ area.partyRecommendation.reason }}</p>
          <ul class="party-rec-list">
            <li v-for="(comp, i) in area.partyRecommendation.recommendedComp" :key="i" v-html="comp"></li>
          </ul>
          <p class="party-rec-confidence">
            Confidence: {{ area.partyRecommendation.confidence }}
          </p>
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

.party-rec {
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
}

.party-rec-quest {
  margin: 0 0 0.5rem;
  font-size: 1.05rem;
}

.party-rec-reason {
  margin: 0 0 0.75rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.party-rec-list {
  margin: 0 0 0.75rem;
  padding-left: 1.25rem;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.party-rec-confidence {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-muted);
  text-transform: capitalize;
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
