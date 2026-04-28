<template>
  <Button variant="outline" class="book" as="a" :href="url" target="_blank">
    <div class="flex flex-col gap-1 items-start">
      <h4>{{ title }}</h4>
      <p>{{ author }}</p>
    </div>
    <Badge variant="outline" :class="cn('status', status)">
      <div class="dot"></div>
      {{ status }}
    </Badge>
  </Button>
</template>
<script setup lang="ts">
import { cn } from '~/lib/utils';

const {
  title,
  author,
  status,
  url,
} = defineProps<{
  title: string;
  author: string;
  status: 'in-progress' | 'completed' | 'planned';
  url: string;
}>();
</script>
<style>
@reference "@/assets/css/tailwind.css";

.book {
  @apply flex justify-between w-full py-2 h-fit;

  h4 {
    @apply text-sm font-medium text-primary;
  }
  p {
    @apply text-xs text-neutral-700;
  }
  .status {
    @apply duration-300 transition-all;
    .dot {
      @apply w-2 h-2 rounded-full;
    }
    &.in-progress {
      @apply border-yellow-500/20;
      .dot {
        @apply bg-yellow-500;
      }
    }
    &.completed {
      @apply border-green-500/20;
      .dot {
        @apply bg-green-500;
      }
    }
  }
  &:hover {
    .in-progress {
      @apply ring-yellow-500/50 ring-1;
    }
    .completed {
      @apply ring-green-500/50 ring-1;
    }
  }
}
</style>