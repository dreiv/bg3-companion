<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <p class="empty-state">{{ message }}</p>
</template>

<style scoped>
.empty-state {
  color: var(--text-muted);
}
</style>
