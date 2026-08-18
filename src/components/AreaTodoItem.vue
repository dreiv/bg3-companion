<script setup lang="ts">
import { computed } from 'vue'
import { useProgressStore } from '@/stores/progress'
import type { AreaTodo } from '@/data/types'

const props = defineProps<{
  todo: AreaTodo
}>()

const progress = useProgressStore()

const done = computed(() => progress.isDone(props.todo.id))

function onToggle() {
  progress.toggle(props.todo.id)
}
</script>

<template>
  <li class="todo-item" :class="{ done: done, timed: todo.timed }">
    <label class="todo-row">
      <input type="checkbox" class="todo-checkbox" :checked="done" @change="onToggle" />
      <span class="todo-text">{{ todo.text }}</span>
    </label>

    <span class="badge" :data-category="todo.category">{{ todo.category }}</span>

    <span v-if="todo.timed" class="timed-warning">
      <svg class="timed-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
      <span class="timed-label">Do before leaving area</span>
    </span>

    <p v-if="todo.note" class="todo-note" v-html="todo.note"></p>
  </li>
</template>

<style scoped>
.todo-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  transition: border-color 0.2s ease, background-color 0.2s ease, opacity 0.2s ease;
}

.todo-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1 1 auto;
  min-width: 0;
  cursor: pointer;
}

.todo-checkbox {
  width: 1.05rem;
  height: 1.05rem;
  accent-color: var(--accent);
  flex-shrink: 0;
  border-radius: 4px;
}

.todo-text {
  min-width: 0;
}

.todo-item.done {
  opacity: 0.75;
}

.todo-item.done .todo-text {
  text-decoration: line-through;
  color: var(--text-muted);
}

.badge {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  color: var(--text-muted);
  background: var(--surface-2);
}

.badge[data-category="quest"] {
  color: var(--cat-quest);
  background: var(--cat-quest-surface);
  border-color: var(--cat-quest);
}

.badge[data-category="companion"] {
  color: var(--cat-companion);
  background: var(--cat-companion-surface);
  border-color: var(--cat-companion);
}

.badge[data-category="loot"] {
  color: var(--cat-loot);
  background: var(--cat-loot-surface);
  border-color: var(--cat-loot);
}

.badge[data-category="lore"] {
  color: var(--cat-lore);
  background: var(--cat-lore-surface);
  border-color: var(--cat-lore);
}

.badge[data-category="other"] {
  color: var(--cat-other);
  background: var(--cat-other-surface);
  border-color: var(--cat-other);
}

.todo-item.timed {
  border-left: 4px solid var(--warning);
  background: var(--warning-surface);
}

.timed-warning {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--warning);
  font-size: 0.8rem;
  font-weight: 700;
}

.todo-note {
  flex-basis: 100%;
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.todo-note :deep(a) {
  color: var(--accent);
}
</style>
