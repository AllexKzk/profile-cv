<template>
  <section id="hero">
    <h1>Alexandr Kozikov</h1>
    <div class="status">
      <p>Senior Frontend Engineer</p>
      <Badge variant="glass">
        <span class="dot" />
        Available
      </Badge>
    </div>
    <span class="short-stack">
      Vue · React · Nuxt · Next.js · TypeScript · SSR
    </span>
    <div class="links">
      <Button variant="glass" size="sm" as="a" href="mailto:allexkzkwork@gmail.com">
        <Icon name="iconoir:telegram" size="16" />
        telegram
      </Button>
      <Button variant="glass" size="sm" as="a" href="https://github.com/allexkzk" target="_blank">
        <Icon name="iconoir:github" size="16" />
        github
      </Button>
      <Button variant="glass" size="sm" as="a" href="https://www.linkedin.com/in/allexkzk/" target="_blank">
        <Icon name="iconoir:linkedin" size="16" />
        linkedin
      </Button>
      <Button variant="glass" size="sm" as="a" href="mailto:allexkzkwork@gmail.com">
        <Icon name="iconoir:mail" size="16" />
        allexkzkwork@gmail.com
      </Button>
    </div>
  </section>
</template>
<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button';

</script>
<style >
@reference "./assets/css/tailwind.css";

#hero {
  @apply flex flex-col gap-5 pt-20 pb-16;
  h1 {
    @apply text-5xl font-bold;
  }
  .status {
    @apply flex gap-x-3 text-lg text-neutral-400;
    .dot {
      @apply w-1.5 h-1.5 rounded-full bg-green-500;
    }
  }
  .short-stack {
    @apply text-sm text-neutral-700;
  }
  .links { 
    @apply flex gap-x-2;
  }
}
</style>