<script setup lang="ts">
import type { CompanionSuggestion } from '@/data/types'

defineProps<{
  companions: CompanionSuggestion[]
}>()
</script>

<template>
  <div class="companion-suggestions">
    <ul v-if="companions.length" class="companion-list">
      <li v-for="companion in companions" :key="companion.name" class="companion">
        <span class="companion-name">{{ companion.name }}</span>
        <p v-if="companion.reason" class="companion-reason">{{ companion.reason }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.companion-list {
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
</style>
