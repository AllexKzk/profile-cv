<template>
  <section id="hero">
    <h1>{{ $t('hero.name') }}</h1>
    <div class="status">
      <p>{{ $t('hero.role') }}</p>
      <Badge variant="glass" class="token-light">
        <span class="dot" />
        {{ $t('hero.available') }}
      </Badge>
    </div>
    <span class="short-stack">
      {{ $t('hero.stack') }}
    </span>
    <div class="links">
      <Button variant="glass" size="sm" as="a" href="https://t.me/allexkzk" target="_blank">
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
import { Button } from '@/components/ui/button'
</script>
<style>
@reference "./assets/css/tailwind.css";

#hero {
  @apply flex flex-col gap-5 pt-20 pb-16;
  h1 {
    @apply text-5xl font-bold;
  }
  .status {
    @apply flex gap-x-3 text-lg text-neutral-400;
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
      animation: hero-dot-pulse 2.2s ease-in-out infinite;
    }
    .dot::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: rgb(34 197 94 / 0.45);
      animation: hero-dot-ping 2.8s cubic-bezier(0, 0, 0.2, 1) infinite;
      pointer-events: none;
    }
  }
  .short-stack {
    @apply text-sm text-neutral-700;
  }
  .links {
    @apply flex gap-x-2;
  }
}

@keyframes hero-dot-pulse {
  0%, 100% { opacity: 0.85; transform: scale(1); }
  50%      { opacity: 1;    transform: scale(1.15); }
}

@keyframes hero-dot-ping {
  0%        { transform: scale(1);   opacity: 0.55; }
  80%, 100% { transform: scale(2.8); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  #hero .status .dot,
  #hero .status .dot::after {
    animation: none !important;
  }
}
</style>
