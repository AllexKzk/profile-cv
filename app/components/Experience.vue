<template>
  <section id="experience">
    <h2>{{ $t('experience.title') }}</h2>
    <div class="flex flex-col gap-12">
      <Block
        v-for="(item, i) in items"
        :key="i"
        :header="item.role"
        :subheader="item.period"
        :caption="item.company"
        :description="item.description"
      />
    </div>
  </section>
</template>
<script setup lang="ts">
import { Block } from '@/components/ui/block'

const { tm, rt } = useI18n()

const items = computed(() =>
  (tm('experience.items') as any[]).map(item => ({
    role: rt(item.role),
    period: rt(item.period),
    company: rt(item.company),
    description: rt(item.description),
  }))
)
</script>
<style>
@reference "@/assets/css/tailwind.css";

#experience {
  @apply gap-7;
}
</style>
