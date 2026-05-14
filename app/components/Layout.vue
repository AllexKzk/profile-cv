<template>
  <div :class="{ 'text-primary scroll-smooth relative isolate': true, 'dark': isDark }">
    <LiquidBackground :darkness="isDark ? 0.89 : 0.2" :speed="0.6" />
    <slot />
  </div>
</template>
<script setup lang="ts">
const { isDark } = useTheme()
</script>
<style>
@reference "./assets/css/tailwind.css";

html {
  @apply scroll-smooth bg-neutral-950;
}
body {
  @apply h-full w-screen bg-transparent;
}
</style>
