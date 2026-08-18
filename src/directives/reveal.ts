import type { Directive, DirectiveBinding } from "vue";

/**
 * `v-reveal` — fades/slides an element in the first time it scrolls into view.
 *
 * Performance notes:
 * - A single shared IntersectionObserver is reused for every element, so there
 *   is no per-element observer overhead.
 * - Elements are unobserved as soon as they reveal (one-shot), so there is no
 *   ongoing observation cost.
 * - The actual animation is a CSS keyframe on `opacity`/`transform` only
 *   (compositor-friendly) and is disabled under `prefers-reduced-motion`.
 *
 * Usage:
 *   <div v-reveal>…</div>
 *   <div v-reveal="index * 40">…</div>   // staggered entrance
 */

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let sharedObserver: IntersectionObserver | null = null;

if (typeof IntersectionObserver !== "undefined" && !prefersReducedMotion()) {
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.classList.add("reveal-visible");
          sharedObserver?.unobserve(el);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -4% 0px" },
  );
}

export const vReveal: Directive<HTMLElement, string | number | undefined> = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    if (prefersReducedMotion() || !sharedObserver) {
      el.classList.add("reveal-visible");
      return;
    }

    el.classList.add("reveal");

    const delay = binding.value;
    if (typeof delay === "number" && delay > 0) {
      el.style.animationDelay = `${delay}ms`;
    }

    sharedObserver.observe(el);
  },
  unmounted(el: HTMLElement) {
    sharedObserver?.unobserve(el);
  },
};
