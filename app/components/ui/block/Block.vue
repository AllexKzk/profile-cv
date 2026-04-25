<template>
  <div class="block">
    <div class="header">
      <h3>{{ header }}</h3>
      <p>{{ subheader }}</p>
    </div>
    <span class="caption">
      {{ caption }}
    </span>
    <div class="description">
      {{ description }}
    </div>
  </div>
</template>
<script setup lang="ts">
const {
  header,
  caption,
  description,
  subheader,
} = defineProps<{
  header: string;
  caption: string;
  description: string;
  subheader: string;
}>();
</script>
<style>
@reference "@/assets/css/tailwind.css";

.block {
  @apply flex flex-col gap-1.5 w-full;
  .header {
    @apply flex justify-between w-full items-baseline;
    h3 {
      @apply font-semibold text-xl;
    }
    p {
      @apply text-neutral-700 text-xs;
    }
  }
  .caption {
    @apply text-neutral-700 text-sm;
  }
  .description {
    @apply text-neutral-400 text-sm;
  }
}
</style>