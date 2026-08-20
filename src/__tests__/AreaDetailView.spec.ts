import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";

import AreaDetailView from "@/views/AreaDetailView.vue";
import { useProgressStore } from "@/stores/progress";

/**
 * Mount with a real Pinia + memory router. The `reveal` directive is left
 * unregistered (a no-op) since it depends on browser APIs jsdom lacks. Pinia
 * is NOT mocked — the todo toggle flow runs end to end.
 */
function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/act/:actId", name: "area-list", component: { template: "<div />" } },
      { path: "/act/:actId/:areaId", name: "area-detail", component: { template: "<div />" } },
    ],
  });
}

async function mountView(actId = "act-1", areaId = "ravaged-beach") {
  const pinia = createPinia();
  setActivePinia(pinia);
  const router = createTestRouter();
  await router.push(`/act/${actId}/${areaId}`);
  await router.isReady();

  const wrapper = mount(AreaDetailView, {
    props: { actId, areaId },
    global: {
      plugins: [pinia, router],
    },
  });

  return { wrapper, progress: useProgressStore() };
}

describe("AreaDetailView", () => {
  it("renders the party recommendation", async () => {
    const { wrapper } = await mountView();

    // The ravaged-beach area recommends a party for the "Find a Cure" quest.
    expect(wrapper.text()).toContain("Find a Cure");
    expect(wrapper.text()).toContain("Confidence:");
    expect(wrapper.find('[data-confidence="high"]').exists()).toBe(true);
  });

  it("persists a todo toggle to the progress store", async () => {
    const { wrapper, progress } = await mountView();

    const todoId = "ravaged-beach-recruit-shadowheart";
    expect(progress.isDone(todoId)).toBe(false);

    const checkbox = wrapper.find(".todo-checkbox");
    await checkbox.trigger("change");

    expect(progress.isDone(todoId)).toBe(true);
    await checkbox.trigger("change");
    expect(progress.isDone(todoId)).toBe(false);
  });
});
