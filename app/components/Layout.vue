<template>
  <div class="dark text-primary scroll-smooth relative isolate">
    <LiquidBackground :darkness="0.89" :speed="0.6" :scroll-response="1.1" />
    <slot />
  </div>
</template>
<script setup lang="ts">
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
