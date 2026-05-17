<template>
  <Section id="experience" :title="$t('experience.title')" class="gap-7">
    <template #aside>
      <div class="years">
        <span class="num">{{ years }}</span>
        <span class="label">{{ yearsLabel }}</span>
      </div>
    </template>
    <div class="flex flex-col gap-12">
      <Block
        v-for="(item, i) in items"
        :key="i"
        :header="item.role"
        :subheader="item.period"
        :caption="item.company"
        :description="item.description"
        :tech="item.tech"
        :company-url="item.companyUrl"
        :projects="item.projects"
      />
    </div>
  </Section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { Block } from '@/components/ui/block'
import { Section } from '@/components/ui/section'

const { tm, rt, t, te, locale } = useI18n()

const items = computed(() =>
  (tm('experience.items') as any[]).map(item => ({
    role: rt(item.role),
    period: rt(item.period),
    company: rt(item.company),
    description: rt(item.description),
    tech: item.tech ? rt(item.tech) : undefined,
    companyUrl: item.companyUrl ? rt(item.companyUrl) : undefined,
    projects: Array.isArray(item.projects)
      ? (item.projects as any[]).map((p: any) => ({
          projectName: rt(p.projectName),
          shortDescription: rt(p.shortDescription),
          stack: rt(p.stack),
          url: p.url ? rt(p.url) : undefined,
        }))
      : undefined,
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
<style scoped>
@reference "@/assets/css/tailwind.css";

.years {
  @apply flex items-baseline gap-1.5;
  .num {
    @apply text-base font-semibold text-neutral-400 tabular-nums;
  }
  .label {
    @apply text-xs text-neutral-700;
  }
}
</style>
