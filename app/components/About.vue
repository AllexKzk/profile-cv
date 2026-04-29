<template>
  <section id="about">
    <h2>{{ $t('about.title') }}</h2>
    <span>{{ $t('about.description') }}</span>
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
