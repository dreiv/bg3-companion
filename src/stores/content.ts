import { defineStore } from "pinia";
import { acts } from "@/data/acts";
import { areas } from "@/data/areas";
import type { Act, Area } from "@/data/types";

export const useContentStore = defineStore("content", () => {
  function getArea(id: string): Area | undefined {
    return areas.find((a) => a.id === id);
  }

  function getAct(id: string): Act | undefined {
    return acts.find((a) => a.id === id);
  }

  function getAreasForAct(actId: string): Area[] {
    return areas.filter((a) => a.actId === actId);
  }

  return { acts, areas, getArea, getAct, getAreasForAct };
});
