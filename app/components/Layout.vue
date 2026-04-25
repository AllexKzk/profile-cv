<template>
  <div class="dark text-primary"> 
    <slot />
  </div>
</template>
<style>
@reference "./assets/css/tailwind.css";

body {
  @apply h-full w-screen bg-neutral-950;
}
</style>