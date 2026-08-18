<script setup lang="ts">
defineProps<{
  title: string
  summary?: string
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <Teleport to="body">
    <div class="lightbox-overlay" @click.self="emit('close')" @keydown.esc="emit('close')">
      <div class="lightbox" role="dialog" :aria-label="title">
        <div class="lightbox-header">
          <h3 class="lightbox-title">{{ title }}</h3>
          <button type="button" class="lightbox-close" aria-label="Close" @click="emit('close')">
            ✕
          </button>
        </div>
        <p v-if="summary" class="lightbox-summary">{{ summary }}</p>
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.lightbox {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  padding: 1.5rem;
}

.lightbox-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.lightbox-title {
  margin: 0;
  font-size: 1.2rem;
}

.lightbox-close {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
}

.lightbox-close:hover {
  color: var(--text);
}

.lightbox-summary {
  color: var(--text-muted);
  margin: 0 0 1rem;
  font-size: 0.9rem;
}
</style>
