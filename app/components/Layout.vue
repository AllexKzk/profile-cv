<template>
  <div class="dark text-primary scroll-smooth"> 
    <slot />
  </div>
</template>
<script setup lang="ts">
import glass from '@/assets/png/glass.png';
</script>
<style>
@reference "./assets/css/tailwind.css";

.glass {
  @apply fixed z-[-5] top-[10%] left-[5%] w-[440px] pointer-events-none opacity-50;
}
html {
  @apply scroll-smooth;
}
body {
  @apply h-full w-screen bg-neutral-950;
}
</style>