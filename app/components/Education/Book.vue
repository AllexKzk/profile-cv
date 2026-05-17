<template>
  <div class="book">
    <div class="flex flex-col gap-1 items-start">
      <h4>{{ title }}</h4>
      <p>{{ author }}</p>
    </div>
    <Badge v-spotlight variant="glass" :class="cn('status', status)">
      <div class="dot"></div>
      {{ $t(`book_status.${status}`) }}
    </Badge>
  </div>
</template>
<script setup lang="ts">
import { cn } from '~/lib/utils'

const {
  title,
  author,
  status,
} = defineProps<{
  title: string
  author: string
  status: 'in-progress' | 'completed' | 'planned'
}>()
</script>
<style scoped>
@reference "@/assets/css/tailwind.css";

.book {
  @apply flex justify-between w-full py-2 h-fit bg-white/5 border border-white/10 rounded-xl p-3;

  h4 {
    @apply text-sm font-medium text-primary;
  }
  p {
    @apply text-xs text-neutral-700;
  }
  .status {
    @apply duration-300 transition-all h-fit my-auto;
    .dot {
      @apply w-2 h-2 rounded-full;
    }
    &.in-progress {
      .dot {
        @apply bg-yellow-500;
      }
    }
    &.completed {
      .dot {
        @apply bg-green-500;
      }
    }
  }

}
</style>
