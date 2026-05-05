<template>
  <Section id="about" :title="$t('about.title')">
    <div class="paragraphs">
      <p v-for="(line, i) in paragraphs" :key="i">{{ line }}</p>
    </div>
  </Section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { Section } from '@/components/ui/section'

const { t } = useI18n()

const paragraphs = computed(() =>
  t('about.description')
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(Boolean),
)
</script>
<style scoped>
@reference "@/assets/css/tailwind.css";

.paragraphs {
  @apply flex flex-col gap-3 text-sm leading-relaxed text-neutral-400;
}
</style>
