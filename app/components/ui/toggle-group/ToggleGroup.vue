<template>
  <div class="toggle-group">
    <slot :current="modelValue"/>
  </div>
</template>
<script setup lang="ts">
const modelValue = defineModel<string | undefined>();

provide('toggleGroup', modelValue);
</script>
<style scoped>
@reference "@/assets/css/tailwind.css";

.toggle-group {
  @apply w-fit overflow-hidden flex gap-1 h-[32px] items-center border border-white/20 rounded-md;
}
</style>