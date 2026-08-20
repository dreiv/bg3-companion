import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";

import AreaListView from "@/views/AreaListView.vue";
import { useItemsStore } from "@/stores/itemsStore";

/**
 * Mount with a real Pinia + memory router (the items store calls `useRouter()`
 * at setup). Pinia is NOT mocked — the reset-on-tab-switch flow runs end to end.
 */
function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", name: "act-list", component: { template: "<div />" } },
      { path: "/act/:actId", name: "area-list", component: { template: "<div />" } },
      { path: "/act/:actId/:areaId", name: "area-detail", component: { template: "<div />" } },
    ],
  });
}

async function mountView(actId = "act-1") {
  const pinia = createPinia();
  setActivePinia(pinia);
  const router = createTestRouter();
  await router.push(`/act/${actId}`);
  await router.isReady();

  const wrapper = mount(AreaListView, {
    props: { actId },
    global: { plugins: [pinia, router] },
  });

  return { wrapper, store: useItemsStore() };
}

describe("AreaListView", () => {
  it("renders the three view tabs", async () => {
    const { wrapper } = await mountView();

    const tabs = wrapper.findAll('[role="tab"]');
    expect(tabs.map((t) => t.text())).toEqual(["List", "Quests", "Items"]);
  });

  it("resets item filters when switching tabs", async () => {
    const { wrapper, store } = await mountView();

    // Simulate a filter the user set while on the Items tab.
    store.setPriceRange(100, null);
    store.setSearch("sword");

    // Switch to the Items tab — the switch must clear the filters.
    await wrapper
      .findAll('[role="tab"]')
      .find((t) => t.text() === "Items")!
      .trigger("click");

    expect(store.filter.priceRange).toEqual([null, null]);
    expect(store.filter.search).toBe("");
  });

  it("moves selection with the arrow keys", async () => {
    const { wrapper } = await mountView();

    const listTab = wrapper.findAll('[role="tab"]').find((t) => t.text() === "List")!;
    await listTab.trigger("keydown", { key: "ArrowRight" });

    // ArrowRight from List lands on Quests.
    const questsTab = wrapper.findAll('[role="tab"]').find((t) => t.text() === "Quests")!;
    expect(questsTab.attributes("aria-selected")).toBe("true");
  });

  it("filters areas by the search input and highlights matches", async () => {
    const { wrapper } = await mountView();

    const search = wrapper.find('input[aria-label="Filter areas by name"]');
    expect(search.exists()).toBe(true);

    // Type a query that matches exactly one area.
    await search.setValue("Emerald");

    expect(wrapper.text()).toContain("Emerald Grove");
    expect(wrapper.text()).not.toContain("Ravaged Beach");

    // The matched substring is wrapped in a <mark> highlight.
    expect(wrapper.find("mark.search-highlight").exists()).toBe(true);
    expect(wrapper.find("mark.search-highlight").text()).toBe("Emerald");
  });
});
