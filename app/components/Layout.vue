<template>
  <div class='text-primary scroll-smooth relative isolate dark'>
    <LiquidBackground :darkness="0.89" :speed="0.6" />
    <slot />
  </div>
</template>
<style>
@reference "./assets/css/tailwind.css";

html {
  @apply scroll-smooth bg-neutral-950;
}
body {
  @apply h-full w-screen bg-transparent;
}
</style>
