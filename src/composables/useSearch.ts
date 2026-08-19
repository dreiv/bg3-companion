import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  toValue,
  type MaybeRefOrGetter,
  type Ref,
} from "vue";
import { normalizeQuery, splitByQuery, highlightHtml } from "@/utils/search";
import type { SearchSegment } from "@/types/search";

export interface UseSearchOptions {
  /** Element to focus; a raw element, Ref, or getter (resolved via `toValue`). */
  input?: MaybeRefOrGetter<HTMLInputElement | null | undefined>;
  /** Register a global Ctrl/Cmd+K handler that focuses the input. */
  hotkey?: boolean;
}

export interface UseSearchReturn {
  query: Ref<string>;
  isActive: Ref<boolean>;
  /** Filter items by a key extractor; returns all items when no query is active. */
  filter: <T>(items: readonly T[], key: (item: T) => string) => T[];
  highlight: (text: string) => SearchSegment[];
  /**
   * Highlight query matches inside an HTML string, returning a new HTML string
   * with `<mark>` wrappers. Safe for content rendered via `v-html`.
   */
  highlightHtml: (html: string) => string;
  focus: () => void;
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const { input, hotkey = false } = options;

  const query = ref("");

  const isActive = computed(() => normalizeQuery(query.value) !== null);

  function filter<T>(items: readonly T[], key: (item: T) => string): T[] {
    const q = normalizeQuery(query.value);
    if (q === null) return [...items];
    return items.filter((item) => key(item).toLowerCase().includes(q));
  }

  function highlight(text: string): SearchSegment[] {
    return splitByQuery(text, query.value);
  }

  function highlightHtmlFn(html: string): string {
    return highlightHtml(html, query.value);
  }

  function focus(): void {
    const el = input ? toValue(input) : null;
    el?.focus();
    el?.select();
  }

  function onGlobalKeydown(e: KeyboardEvent): void {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      focus();
    }
  }

  if (hotkey) {
    onMounted(() => window.addEventListener("keydown", onGlobalKeydown));
    onBeforeUnmount(() => window.removeEventListener("keydown", onGlobalKeydown));
  }

  return { query, isActive, filter, highlight, highlightHtml: highlightHtmlFn, focus };
}
