import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";

import App from "../App.vue";
import router from "../router";

describe("App", () => {
  it("renders the act list on the home route", async () => {
    const pinia = createPinia();

    await router.push("/");
    await router.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router],
      },
    });

    expect(wrapper.text()).toContain("BG3 Companion");
    expect(wrapper.text()).toContain("Act 1 — Wilderness & Underdark");
    expect(wrapper.text()).toContain("Act 3 — Baldur's Gate");
  });
});
