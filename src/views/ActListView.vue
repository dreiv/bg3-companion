<script setup lang="ts">
import { useContentStore } from '@/stores/content'

const content = useContentStore()
</script>

<template>
  <div class="view">
    <header class="view-header" v-reveal>
      <h1>BG3 Companion</h1>
      <p class="subtitle">Pick an act to see its areas.</p>
    </header>

    <nav class="act-list">
      <RouterLink v-for="(act, i) in content.acts" :key="act.id" :to="{ name: 'area-list', params: { actId: act.id } }"
        class="act-card glass" v-reveal="i * 60">
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
  border-radius: 12px;
  color: var(--text);
  text-decoration: none;
  transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}

.act-card:hover {
  border-color: color-mix(in srgb, var(--accent) 60%, var(--glass-border));
  transform: translateY(-2px);
  box-shadow: 0 10px 28px -10px rgba(0, 0, 0, 0.3);
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
