<template>
  <Dialog v-if="compatibility" v-model:open="open">
    <DialogTrigger as-child>
      <Button
        v-spotlight
        :variant="compact ? 'outline' : 'glass'"
        :size="compact ? 'icon-sm' : 'sm'"
        :class="[compact ? '' : 'gap-1.5', scoreClass]"
        :aria-label="$t('compatibility.title')"
      >
        <Icon name="iconoir:sparks" size="14" />
        <span v-if="!compact">{{ compatibility.score }}%</span>
      </Button>
    </DialogTrigger>
    <DialogContent class="dark px-0">
      <DialogHeader class="px-4">
        <DialogTitle class="text-primary font-bold">
          {{ $t('compatibility.title') }}
        </DialogTitle>
      </DialogHeader>
      <Separator />
      <div class="compat px-4">
        <div class="hero">
          <div class="score" :class="scoreClass">
            {{ compatibility.score }}<span class="pct">%</span>
          </div>
          <p v-if="compatibility.summary" class="summary">
            {{ compatibility.summary }}
          </p>
        </div>

        <section v-if="compatibility.matched.length" class="block green">
          <h4>
            <span class="dot" />
            {{ $t('compatibility.matched') }}
            <span class="count">{{ compatibility.matched.length }}</span>
          </h4>
          <div class="tags">
            <Badge v-for="tag in compatibility.matched" :key="tag" variant="glass">
              {{ tag }}
            </Badge>
          </div>
        </section>

        <section v-if="compatibility.adjacent.length" class="block yellow">
          <h4>
            <span class="dot" />
            {{ $t('compatibility.adjacent') }}
            <span class="count">{{ compatibility.adjacent.length }}</span>
          </h4>
          <p class="hint">
            {{ $t('compatibility.adjacent_hint') }}
          </p>
          <div class="tags">
            <Badge v-for="tag in compatibility.adjacent" :key="tag" variant="glass">
              {{ tag }}
            </Badge>
          </div>
        </section>

        <section v-if="compatibility.missing.length" class="block gray">
          <h4>
            <span class="dot" />
            {{ $t('compatibility.missing') }}
            <span class="count">{{ compatibility.missing.length }}</span>
          </h4>
          <p class="hint">
            {{ $t('compatibility.missing_hint') }}
          </p>
          <div class="tags">
            <Badge v-for="tag in compatibility.missing" :key="tag" variant="glass">
              {{ tag }}
            </Badge>
          </div>
        </section>

        <p
          v-if="!compatibility.matched.length && !compatibility.adjacent.length && !compatibility.missing.length"
          class="text-xs text-neutral-500"
        >
          {{ $t('compatibility.empty') }}
        </p>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const { tuning } = useTuning();
const compatibility = computed(() => tuning.value.compatibility);

withDefaults(defineProps<{ compact?: boolean }>(), { compact: false });

const open = ref(false);

const scoreClass = computed(() => {
  const s = compatibility.value?.score ?? 0;
  if (s >= 70) return 'is-strong';
  if (s >= 40) return 'is-mid';
  return 'is-low';
});
</script>

<style scoped>
@reference "@/assets/css/tailwind.css";

.compat {
  @apply mt-3 flex flex-col gap-5;
}

.hero {
  @apply flex flex-col items-center gap-2 text-center;
}

.score {
  @apply text-5xl font-bold tracking-tight leading-none;
}
.score .pct {
  @apply text-2xl font-semibold ml-0.5 opacity-70;
}
.score.is-strong {
  color: rgb(34 197 94);
}
.score.is-mid {
  color: rgb(234 179 8);
}
.score.is-low {
  color: rgb(115 115 115);
}

.summary {
  @apply text-sm text-neutral-300 text-left;
}

.block {
  @apply flex flex-col gap-2;
}

.block h4 {
  @apply text-sm font-medium text-neutral-300 flex items-center gap-2;
}

.block .count {
  @apply text-xs text-neutral-500 ml-auto;
}

.block .hint {
  @apply text-xs text-neutral-500 -mt-1;
}

.block .tags {
  @apply flex flex-wrap gap-1.5;
}

.dot {
  @apply inline-block w-2 h-2 rounded-full;
}
.block.green .dot {
  background: rgb(34 197 94);
  box-shadow: 0 0 8px rgb(34 197 94 / 0.6);
}
.block.yellow .dot {
  background: rgb(234 179 8);
  box-shadow: 0 0 8px rgb(234 179 8 / 0.5);
}
.block.gray .dot {
  background: rgb(115 115 115);
}

.block.green :deep([data-slot='badge']) {
  --hl: rgb(34 197 94 / 0.85);
  border-color: var(--hl);
  box-shadow:
    0 0 0 1px var(--hl),
    0 0 14px -2px rgb(34 197 94 / 0.45);
}
.block.yellow :deep([data-slot='badge']) {
  --hl: rgb(234 179 8 / 0.7);
  border-color: var(--hl);
  box-shadow:
    0 0 0 1px var(--hl),
    0 0 12px -2px rgb(234 179 8 / 0.35);
}
.block.gray :deep([data-slot='badge']) {
  color: rgb(163 163 163);
  border-color: rgb(82 82 82 / 0.6);
}

.is-strong {
  @apply text-green-500;
}
.is-mid {
  @apply text-yellow-500;
}
.is-low {
  @apply text-neutral-400;
}
</style>
