import type { Area } from "../types";
import { act0Areas } from "./act-0";
import { act1Areas } from "./act-1";
import { act2Areas } from "./act-2";
import { act3Areas } from "./act-3";

/**
 * All areas, in act order. Each act's data lives in its own module
 * (`act-0.ts` … `act-3.ts`) to keep individual files small and focused.
 */
export const areas: Area[] = [...act0Areas, ...act1Areas, ...act2Areas, ...act3Areas];
