<template>
  <section
    :id="id"
    :class="cn('section-root', props.class)"
  >
    <div v-if="hasHead" class="section-head">
      <slot name="title">
        <h2 v-if="title">{{ title }}</h2>
      </slot>
      <slot v-if="$slots.aside" name="aside" />
    </div>
    <slot />
  </section>
</template>
<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, useSlots } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  id?: string
  title?: string
  class?: HTMLAttributes['class']
}>()

const slots = useSlots()
const hasHead = computed(
  () => Boolean(props.title) || Boolean(slots.title) || Boolean(slots.aside),
)
</script>
<style scoped>
@reference "@/assets/css/tailwind.css";

.section-head {
  @apply flex w-full justify-between items-baseline;
}

.section-root {
  @apply flex flex-col py-8 gap-4 font-normal w-full;
}

.section-root :deep(h2) {
  @apply text-xs text-neutral-700;
}
</style>
