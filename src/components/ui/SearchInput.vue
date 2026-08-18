<script setup lang="ts">
import { ref } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    label: string;
    showHotkeyHint?: boolean;
  }>(),
  {
    placeholder: "Search…",
    showHotkeyHint: false,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const input = ref<HTMLInputElement | null>(null);

function onInput(e: Event) {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
}

// Expose the raw element so a parent can focus it (e.g. from a hotkey).
defineExpose({
  el: () => input.value,
});
</script>

<template>
  <input ref="input" type="text" class="search-input" :value="props.modelValue"
    :placeholder="showHotkeyHint ? `${props.placeholder} (Ctrl+K)` : props.placeholder" :aria-label="props.label"
    @input="onInput" />
</template>

<style scoped>
.search-input {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 0.75rem;
  padding: 0.55rem 0.75rem;
  font-size: 0.9rem;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.search-input:focus {
  border-color: var(--accent);
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}
</style>
