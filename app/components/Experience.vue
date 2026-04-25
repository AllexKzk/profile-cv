<template>
  <section id="experience">
    <h2> EXPERIENCE </h2>
    <div class="flex flex-col gap-12">
      <Block
        header="Senior Frontend Engineer"
        subheader="2024 - Present"
        caption="Acme Corp · Remote"
        description="Led frontend architecture for a SaaS platform serving 50k+ users. Built a shared design system in Vue 3 + Nuxt 3. Drove migration from Webpack to Vite, cutting build times by 60%."
      />
      <Block
        header="Middle Frontend Engineer"
        subheader="2020 - 2024"
        caption="StartupXYZ · Minsk"
        description="Developed React + Next.js apps with SSR and ISR for e-commerce clients. Implemented a design system from scratch, reducing design-to-code time by 40%."
      />
      <Block
        header="Senior Frontend Engineer"
        subheader="2018 - 2020"
        caption="Agency Foo · SPb"
        description="Built responsive Vue 2 SPAs for fintech and education clients. Introduced component testing practices with Jest and Vue Test Utils."
      />
    </div>
  </section>
</template>
<script setup lang="ts">
import { Block } from '@/components/ui/block';

</script>
<style>
@reference "@/assets/css/tailwind.css";

#experience {
  @apply gap-7;
}
</style>