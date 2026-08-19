import { ref, type Ref } from "vue";
import type { NumericRange } from "@/utils/tableHelpers";

export interface UseRangeFilterOptions {
  /** Read the currently-applied `[min, max]` range from the store. */
  getRange: () => NumericRange;
  /** Persist a `[min, max]` range to the store. */
  apply: (range: NumericRange) => void;
  /** Clear the stored range. */
  clear: () => void;
  /** Called after apply/clear so the caller can close the popover. */
  onClose: () => void;
}

export interface UseRangeFilterReturn {
  /** Local min bound (`null` = unbounded). */
  min: Ref<number | null>;
  /** Local max bound (`null` = unbounded). */
  max: Ref<number | null>;
  /** Hydrate local bounds from the store (call when the popover opens). */
  hydrate: () => void;
  /** Push local bounds to the store, then close. */
  applyRange: () => void;
  /** Reset local bounds, clear the store range, then close. */
  clearRange: () => void;
}

/**
 * Encapsulates the min/max numeric-range filter UX shared by the Price and
 * Weight columns: local draft state, hydration from the store on open, and
 * apply/clear round-trips. Keeps the two columns' logic identical and
 * independently testable.
 */
export function useRangeFilter(options: UseRangeFilterOptions): UseRangeFilterReturn {
  const { getRange, apply, clear, onClose } = options;

  const min = ref<number | null>(null);
  const max = ref<number | null>(null);

  function hydrate(): void {
    const [lo, hi] = getRange();
    min.value = lo;
    max.value = hi;
  }

  function applyRange(): void {
    apply([min.value, max.value]);
    onClose();
  }

  function clearRange(): void {
    min.value = null;
    max.value = null;
    clear();
    onClose();
  }

  return { min, max, hydrate, applyRange, clearRange };
}
