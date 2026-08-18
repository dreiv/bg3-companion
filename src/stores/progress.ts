import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export const useProgressStore = defineStore("progress", () => {
  const completed = useLocalStorage<Record<string, boolean>>("bg3-progress", {});

  function toggle(todoId: string) {
    completed.value[todoId] = !completed.value[todoId];
  }
  function isDone(todoId: string) {
    return !!completed.value[todoId];
  }

  return { completed, toggle, isDone };
});
