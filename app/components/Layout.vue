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
  /* `w-full` (= 100% of html) respects the scrollbar; `w-screen` resolves to
     `100vw`, which includes the scrollbar width and would push the body past
     the html viewport, creating a phantom horizontal scrollbar. */
  @apply h-full w-full bg-transparent;
}
</style>
