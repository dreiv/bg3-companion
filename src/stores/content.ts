import { defineStore } from "pinia";
import { acts } from "@/data/acts";
import { areas } from "@/data/areas";
import type { Act, Area, AreaTodo } from "@/data/types";

type AreaTodoWithArea = AreaTodo & { areaName: string; areaId: string };

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

  function getAreaCountForAct(actId: string): number {
    return getAreasForAct(actId).length;
  }

  function getQuestsForAct(actId: string): AreaTodoWithArea[] {
    return getAreasForAct(actId).flatMap((area) =>
      area.todos
        .filter((t) => t.category === "quest")
        .map((t) => ({ ...t, areaName: area.name, areaId: area.id })),
    );
  }

  return {
    acts,
    areas,
    getArea,
    getAct,
    getAreasForAct,
    getAreaCountForAct,
    getQuestsForAct,
  };
});
