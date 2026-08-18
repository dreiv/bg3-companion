// Resolves bare image filenames (as stored in `areas.ts` / `acts.ts`) to their
// Vite asset URLs. All map images live in `src/assets/images/`.
//
// `import.meta.glob` is evaluated at build time, so a filename that doesn't
// exist simply resolves to `undefined` — callers treat that as "no image".

const modules = import.meta.glob("../assets/images/*.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const byName = new Map<string, string>();
for (const [path, url] of Object.entries(modules)) {
  const name = path.split("/").pop()!;
  byName.set(name, url);
}

/**
 * Resolve a bare filename (e.g. `"arcane-tower-map.webp"`) to its asset URL.
 * Returns `undefined` when the file isn't present in `src/assets/images/`.
 */
export function resolveImage(name: string): string | undefined {
  return byName.get(name);
}
