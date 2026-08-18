import type { Area } from "../types";
import { act0Areas } from "./act-0";
import { act1Areas } from "./act-1";
import { act2Areas } from "./act-2";
import { act3Areas } from "./act-3";

/** All areas in act order. Split per-act modules to keep files small. */
export const areas: Area[] = [...act0Areas, ...act1Areas, ...act2Areas, ...act3Areas];
