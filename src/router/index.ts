import { createRouter, createWebHistory } from "vue-router";

import ActListView from "@/views/ActListView.vue";
import AreaListView from "@/views/AreaListView.vue";
import AreaDetailView from "@/views/AreaDetailView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "act-list",
      component: ActListView,
    },
    {
      path: "/act/:actId",
      name: "area-list",
      component: AreaListView,
      props: true,
    },
    {
      path: "/act/:actId/:areaId",
      name: "area-detail",
      component: AreaDetailView,
      props: true,
    },
  ],
});

export default router;
