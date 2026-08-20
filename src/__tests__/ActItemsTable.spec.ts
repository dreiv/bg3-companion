import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";

import ActItemsTable from "@/components/features/ActItemsTable.vue";
import { useItemsStore } from "@/stores/itemsStore";

/**
 * The items store calls `useRouter()` at setup, so mount with a real
 * (memory-history) router. Pinia is NOT mocked — the full filter pipeline
 * runs for real.
 */
function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/:pathMatch(.*)*", name: "area-detail", component: { template: "<div />" } }],
  });
}

async function mountTable(act = 1) {
  const pinia = createPinia();
  setActivePinia(pinia);
  const router = createTestRouter();
  await router.push(`/act-${act}/some-area`);
  await router.isReady();

  const wrapper = mount(ActItemsTable, {
    props: { act },
    global: { plugins: [pinia, router] },
  });

  return { wrapper, store: useItemsStore() };
}

describe("ActItemsTable", () => {
  it("renders act items and filters them by name", async () => {
    const { wrapper, store } = await mountTable(1);

    expect(wrapper.text()).toContain("Bracers of Defence");
    expect(wrapper.text()).toContain("Uncovered Mysteries");

    // Open the name filter popover and type a query.
    await wrapper.find('button[aria-label="Filter by name"]').trigger("click");
    await wrapper.find("#filter-name").setValue("Bracers");

    expect(store.filter.search).toBe("Bracers");
    expect(wrapper.text()).toContain("Bracers of Defence");
    expect(wrapper.text()).not.toContain("Uncovered Mysteries");
  });

  it("filters by price range via the price popover", async () => {
    const { wrapper, store } = await mountTable(1);

    expect(wrapper.text()).toContain("Bracers of Defence");
    expect(wrapper.text()).toContain("Uncovered Mysteries");

    // Open the price popover, set a minimum, and apply.
    await wrapper.find('button[aria-label="Filter by price"]').trigger("click");
    await wrapper.find('.popover-right input[placeholder="0"]').setValue("130");
    await wrapper.find(".popover-right button.btn-apply").trigger("click");

    expect(store.filter.priceRange).toEqual([130, null]);
    // Bracers of Defence (160) passes; Uncovered Mysteries (125) is excluded.
    expect(wrapper.text()).toContain("Bracers of Defence");
    expect(wrapper.text()).not.toContain("Uncovered Mysteries");
  });
});
