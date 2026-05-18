<template>
  <Layout>
    <main>
      <Welcome />
      <Hero />
      <Separator variant="glass" />
      <About />
      <Separator variant="glass" />
      <Skills />
      <Separator variant="glass" />
      <Experience />
      <Separator variant="glass" />
      <Education />
      <Tools />
    </main>
    <DesktopNav />
  </Layout>
</template>
<script setup lang="ts">
import { Separator } from '@/components/ui/separator';
import Education from '@/components/Education/index.vue';
import DesktopNav from '~/components/Nav/DesktopNav.vue';
import Tools from '~/components/Toolbar/Tools.vue';
import Welcome from '@/components/Welcome/index.vue';
</script>
<style scoped>
@reference "./assets/css/tailwind.css";

main {
  @apply max-w-3xl mx-auto mb-17 flex flex-col items-start justify-center relative px-4 md:px-0;
}
</style>