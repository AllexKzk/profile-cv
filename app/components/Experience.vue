<template>
  <section id="experience">
    <div class="title-row">
      <h2>{{ $t('experience.title') }}</h2>
      <div class="years">
        <span class="num">{{ years }}</span>
        <span class="label">{{ yearsLabel }}</span>
      </div>
    </div>
    <div class="flex flex-col gap-12">
      <Block
        v-for="(item, i) in items"
        :key="i"
        :header="item.role"
        :subheader="item.period"
        :caption="item.company"
        :description="item.description"
        :company-url="item.companyUrl"
      />
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { Block } from '@/components/ui/block'

const { tm, rt, t, te, locale } = useI18n()

const items = computed(() =>
  (tm('experience.items') as any[]).map(item => ({
    role: rt(item.role),
    period: rt(item.period),
    company: rt(item.company),
    description: rt(item.description),
    companyUrl: item.companyUrl ? rt(item.companyUrl) : undefined,
  })),
)

const startYear = computed(() => {
  let min = Infinity
  for (const item of items.value) {
    const m = item.period.match(/\d{4}/)
    if (m) min = Math.min(min, Number(m[0]))
  }
  return Number.isFinite(min) ? min : new Date().getFullYear()
})

const years = computed(() => Math.max(0, new Date().getFullYear() - startYear.value))

const yearsLabel = computed(() => {
  const cat = new Intl.PluralRules(locale.value).select(years.value)
  const key = `experience.years_label_${cat}`
  return te(key) ? t(key) : t('experience.years_label_other')
})
</script>
<style>
@reference "@/assets/css/tailwind.css";

#experience {
  @apply gap-7;

  .title-row {
    @apply flex w-full justify-between items-baseline;
  }
  .years {
    @apply flex items-baseline gap-1.5;
    .num {
      @apply text-base font-semibold text-neutral-300 tabular-nums;
    }
    .label {
      @apply text-xs text-neutral-700;
    }
  }
}
</style>
