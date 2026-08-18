<script setup lang="ts">
import type { Vendor } from '@/data/types'

defineProps<{
  vendor: Vendor
}>()
</script>

<template>
  <article class="vendor-card">
    <h3 class="vendor-name">{{ vendor.name }}</h3>

    <p v-if="vendor.items.length === 0" class="vendor-empty">
      No entries yet — add some in <code>src/data/areas.ts</code>.
    </p>

    <ul v-else class="vendor-items">
      <li v-for="(item, i) in vendor.items" :key="i" class="vendor-item">
        <span class="item-name">{{ item.name }}</span>
        <span v-if="item.price" class="item-price">{{ item.price }}</span>
        <span v-if="item.note" class="item-note">{{ item.note }}</span>
      </li>
    </ul>
  </article>
</template>

<style scoped>
.vendor-card {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  padding: 0.75rem 1rem;
}

.vendor-name {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}

.vendor-empty {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.vendor-items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.vendor-item {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem 0.6rem;
  font-size: 0.92rem;
}

.item-price {
  color: var(--accent);
  font-weight: 600;
  white-space: nowrap;
}

.item-note {
  color: var(--text-muted);
  font-size: 0.85rem;
}
</style>
