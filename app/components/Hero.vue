<template>
  <Section id="hero" class="gap-5 pt-16 pb-12 md:pt-20 md:pb-16">
    <h1>{{ $t('hero.name') }}</h1>
    <div class="status">
      <p>{{ $t('hero.role') }}</p>
    </div>
    <span class="short-stack">
      {{ $t('hero.stack') }}
    </span>
    <div class="links">
      <Button
        v-spotlight
        variant="glass"
        size="sm"
        as="a"
        href="https://t.me/allexkzk"
        target="_blank"
        aria-label="telegram"
      >
        <Icon name="iconoir:telegram" size="16" />
        <span class="link-label">telegram</span>
      </Button>
      <Button
        v-spotlight
        variant="glass"
        size="sm"
        as="a"
        href="https://github.com/allexkzk"
        target="_blank"
        aria-label="github"
      >
        <Icon name="iconoir:github" size="16" />
        <span class="link-label">github</span>
      </Button>
      <Button
        v-spotlight
        variant="glass"
        size="sm"
        as="a"
        href="https://www.linkedin.com/in/allexkzk/"
        target="_blank"
        aria-label="linkedin"
      >
        <Icon name="iconoir:linkedin" size="16" />
        <span class="link-label">linkedin</span>
      </Button>
      <Button
        v-spotlight
        variant="glass"
        size="sm"
        as="a"
        href="mailto:allexkzkwork@gmail.com"
        aria-label="allexkzkwork@gmail.com"
      >
        <Icon name="iconoir:mail" size="16" />
        <span class="link-label email-label">allexkzkwork@gmail.com</span>
      </Button>
    </div>
  </Section>
</template>
<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/section'

const { isHR } = useTuning()
</script>
<style>
@reference "./assets/css/tailwind.css";

#hero {
  h1 {
    @apply text-3xl md:text-5xl font-bold leading-tight;
  }
  .status {
    @apply flex gap-x-3 text-lg dark:text-neutral-400;
    .token-light {
      /* Anchor of the green glow on the badge border, ~over the dot's center. */
      --token-color: rgb(34 197 94 / 0.65);
      --token-x: 16px;
      --token-y: 50%;
      --token-rx: 110px;
      --token-ry: 38px;
    }
    .dot {
      @apply relative w-1.5 h-1.5 rounded-full bg-green-500;
      box-shadow: 0 0 6px rgb(34 197 94 / 0.7);
    }
    .dot::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: rgb(34 197 94 / 0.45);
      pointer-events: none;
    }
  }
  .short-stack {
    @apply text-sm dark:text-neutral-700;
  }
  .links {
    @apply flex flex-wrap gap-2;
  }
  .link-label {
    @apply max-[376px]:hidden;
  }
  .email-label {
    @apply hidden sm:inline;
  }
}
</style>
