<script setup lang="ts">
defineProps<{
  /** Warning HTML (may contain wiki links / emphasis). */
  message: string;
}>();
</script>

<template>
  <div class="entry-warning">
    <svg class="entry-warning-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
    <div class="entry-warning-body">
      <span class="entry-warning-label">Warning</span>
      <p class="entry-warning-text" v-html="message"></p>
    </div>
  </div>
</template>

<style scoped>
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

/* v-html content: links + emphasis injected into the warning text. */
.entry-warning-text :deep(a) {
  color: var(--accent);
  text-decoration: underline;
}

.entry-warning-text :deep(b),
.entry-warning-text :deep(strong) {
  font-weight: 600;
}

.entry-warning-text :deep(i),
.entry-warning-text :deep(em) {
  font-style: italic;
}
</style>
