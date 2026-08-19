import { ref, type Ref } from "vue";

export interface Tab<T extends string> {
  id: T;
  label: string;
}

export interface UseTabsOptions<T extends string> {
  /** The ordered list of tabs. */
  tabs: readonly Tab<T>[];
  /** Initial active tab id. Defaults to the first tab. */
  initial?: T;
  /**
   * Called after the active tab *changes* (not on the initial value). Lets the
   * caller run side effects such as resetting filters without coupling the
   * composable to any specific store.
   */
  onSwitch?: (tab: T) => void;
}

export interface UseTabsReturn<T extends string> {
  /** The currently active tab id. */
  activeView: Ref<T>;
  /** Select a tab; no-op when it is already active. */
  selectTab: (tab: T) => void;
  /**
   * Roving-tablist keyboard handler. Arrow keys move selection (wrapping),
   * Home/End jump to the first/last tab. Focus follows the new selection.
   */
  onTabKeydown: (e: KeyboardEvent) => void;
}

/**
 * Encapsulates accessible tab-list state and keyboard navigation. The active
 * tab is a simple `Ref<T>`; side effects on switch are delegated to `onSwitch`
 * so the composable stays store-agnostic and independently testable.
 */
export function useTabs<T extends string>(options: UseTabsOptions<T>): UseTabsReturn<T> {
  const { tabs, initial, onSwitch } = options;

  // `tabs` is contractually non-empty; the first tab is the default selection.
  const activeView = ref<T>(initial ?? tabs[0]!.id) as Ref<T>;

  function selectTab(tab: T): void {
    if (activeView.value === tab) return;
    activeView.value = tab;
    onSwitch?.(tab);
  }

  function onTabKeydown(e: KeyboardEvent): void {
    const i = tabs.findIndex((t) => t.id === activeView.value);
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next < 0) return;
    const tab = tabs[next];
    if (!tab) return;
    e.preventDefault();
    selectTab(tab.id);
    document.getElementById(`tab-${tab.id}`)?.focus();
  }

  return { activeView, selectTab, onTabKeydown };
}
