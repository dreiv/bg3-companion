import type { Area } from "../types";
import { template } from "./factory";

export const act0Areas: Area[] = [
  template(
    "nautiloid",
    "Nautiloid",
    "act-0",
    "The illithid ship you wake up on — the game's tutorial section. Becomes inaccessible once you leave it.",
    [
      { src: "prologue-01.webp" },
      { src: "prologue-02.webp" },
      { src: "prologue-03.webp" },
      { src: "prologue-04.webp" },
      { src: "prologue-05.webp" },
      { src: "prologue-06.webp" },
      { src: "prologue-07.webp" },
      { src: "prologue-08.webp" },
      { src: "prologue-09.webp" },
    ],
    { x: 50, y: 50 },
  ),
];
