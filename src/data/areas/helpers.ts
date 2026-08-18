import type { Area } from "../types";

/**
 * Domain helpers for reasoning about an area's content.
 */

/** True when the area has at least one timed (missable) todo. */
export const hasTimedTodos = (area: Area): boolean => area.todos.some((todo) => todo.timed);
