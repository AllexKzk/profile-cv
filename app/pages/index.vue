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
    </main>
    <Sidebar />
  </Layout>
</template>
<script setup lang="ts">
import { Separator } from '@/components/ui/separator';
import Education from '@/components/Education/index.vue';
import Sidebar from '@/components/Sidebar/index.vue';
import Welcome from '@/components/Welcome/index.vue';
</script>
<style scoped>
@reference "./assets/css/tailwind.css";

main {
  @apply max-w-3xl mx-auto flex flex-col items-start justify-center relative;
}
</style>