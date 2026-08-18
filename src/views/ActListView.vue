<script setup lang="ts">
import { useContentStore } from '@/stores/content'

const content = useContentStore()
</script>

<template>
  <div class="view">
    <header class="view-header">
      <h1>BG3 Companion</h1>
      <p class="subtitle">Pick an act to see its areas.</p>
    </header>

    <nav class="act-list">
      <RouterLink v-for="act in content.acts" :key="act.id" :to="{ name: 'area-list', params: { actId: act.id } }"
        class="act-card">
        <span class="act-name">{{ act.name }}</span>
        <span class="act-count">{{ content.getAreaCountForAct(act.id) }} areas</span>
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

.view-header h1 {
  margin: 0 0 0.25rem;
  font-size: 1.8rem;
}

.subtitle {
  margin: 0 0 1.5rem;
  color: var(--text-muted);
}

.act-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.act-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  color: var(--text);
  text-decoration: none;
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.act-card:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
}

.act-name {
  font-weight: 600;
}

.act-count {
  color: var(--text-muted);
  font-size: 0.85rem;
  white-space: nowrap;
}
</style>
