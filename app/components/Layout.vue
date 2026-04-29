<template>
  <div class="dark text-primary scroll-smooth"> 
    <slot />
  </div>
</template>
<script setup lang="ts">
</script>
<style>
@reference "./assets/css/tailwind.css";

html {
  @apply scroll-smooth;
}
body {
  @apply h-full w-screen bg-neutral-950;
}
</style>