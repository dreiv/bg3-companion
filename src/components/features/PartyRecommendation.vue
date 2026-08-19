<script setup lang="ts">
import type { PartyRecommendation } from "@/data/types";

defineProps<{
  /** The party recommendation to display. */
  recommendation: PartyRecommendation;
}>();
</script>

<template>
  <div class="party-rec glass">
    <h3 class="party-rec-quest" v-html="recommendation.quest"></h3>
    <p class="party-rec-reason" v-html="recommendation.reason"></p>
    <ul class="party-rec-list">
      <li v-for="(comp, i) in recommendation.recommendedComp" :key="i" v-html="comp"></li>
    </ul>
    <p class="party-rec-confidence">
      Confidence:
      <span class="confidence-badge" :data-confidence="recommendation.confidence">
        {{ recommendation.confidence }}
      </span>
    </p>
  </div>
</template>

<style scoped>
.party-rec {
  padding: 1rem;
  border-radius: 12px;
}

.party-rec-quest {
  margin: 0 0 0.5rem;
  font-size: 1.05rem;
}

.party-rec-reason {
  margin: 0 0 0.75rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.party-rec-list {
  margin: 0 0 0.75rem;
  padding-left: 1.25rem;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.party-rec-confidence {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.confidence-badge {
  display: inline-block;
  margin-left: 0.25rem;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  border: 1px solid var(--border);
}

.confidence-badge[data-confidence="high"] {
  color: var(--conf-high);
  background: var(--conf-high-surface);
  border-color: var(--conf-high);
}

.confidence-badge[data-confidence="medium"] {
  color: var(--conf-medium);
  background: var(--conf-medium-surface);
  border-color: var(--conf-medium);
}

.confidence-badge[data-confidence="low"] {
  color: var(--conf-low);
  background: var(--conf-low-surface);
  border-color: var(--conf-low);
}

/* v-html content: links + emphasis injected into the recommendation. */
.party-rec-quest :deep(a),
.party-rec-reason :deep(a) {
  color: var(--accent);
  text-decoration: underline;
}

.party-rec-quest :deep(b),
.party-rec-quest :deep(strong),
.party-rec-reason :deep(b),
.party-rec-reason :deep(strong) {
  font-weight: 600;
}

.party-rec-quest :deep(i),
.party-rec-quest :deep(em),
.party-rec-reason :deep(i),
.party-rec-reason :deep(em) {
  font-style: italic;
}
</style>
