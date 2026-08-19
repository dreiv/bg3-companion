<script setup lang="ts">
import RitualScarBackground from './components/RitualScarBackground.vue'
</script>

<template>
  <RitualScarBackground />
  <div class="app-content">
    <RouterView />
  </div>
</template>

<style scoped>
.app-content {
  position: relative;
  z-index: 1;
}
</style>
