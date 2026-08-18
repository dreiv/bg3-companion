import type { Act } from "./types";

export const acts: Act[] = [
  {
    id: "act-1",
    name: "Act 1 — Wilderness & Underdark",
    areaIds: [
      "ravaged-beach",
      "emerald-grove",
      "blighted-village",
      "goblin-camp",
      "grymforge",
      "act-1-placeholder",
    ],
  },
  {
    id: "act-2",
    name: "Act 2 — Shadow-Cursed Lands",
    areaIds: ["last-light-inn", "reithwin-town", "moonrise-towers", "act-2-placeholder"],
  },
  {
    id: "act-3",
    name: "Act 3 — Baldur's Gate",
    areaIds: ["rivington", "wyrms-crossing", "lower-city", "act-3-placeholder"],
  },
];
