<template>
  <section id="about">
    <h2> ABOUT </h2>
    <span>
      6+ years building web interfaces across fintech, SaaS, and media. I’ve led frontend teams, designed shared component libraries, and taken products from zero to production. Strong opinions about architecture, weak opinions about tabs vs spaces.
    </span>
  </section>
</template>
<style>
@reference "./assets/css/tailwind.css";

section {
  @apply flex flex-col py-12 gap-4 font-normal w-full;
  h2 {
    @apply text-xs text-neutral-700;
  }
  span {
    @apply text-sm leading-6 text-neutral-400;
  }
}
</style>