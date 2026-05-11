<template>
  <Section id="skills" :title="$t('skills.title')">
    <div class="list">
      <template v-for="group in groups" :key="group.titleKey">
        <h3>{{ $t(group.titleKey) }}</h3>
        <div>
          <Badge
            v-for="item in group.items"
            :key="item.label"
            v-spotlight
            variant="glass"
            :class="{ 'is-highlighted': isHighlighted(item.aliases) }"
          >
            <Icon :name="item.icon" />
            {{ item.label }}
          </Badge>
        </div>
      </template>
    </div>
  </Section>
</template>
<script setup lang="ts">
import { Section } from '@/components/ui/section'
import { SKILLS_CATALOG } from '~~/shared/skills-catalog'

const groups = SKILLS_CATALOG
const { isHighlighted } = useTuning()
</script>
<style scoped>
@reference "@/assets/css/tailwind.css";

.list {
  @apply grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-y-3 gap-x-1.5 w-full;
  h3 {
    @apply text-neutral-400 text-sm my-auto;
  }
  div {
    @apply flex flex-wrap gap-x-1.5 gap-y-2;
  }
}

.is-highlighted {
  --hl: rgb(34 197 94 / 0.85);
  border-color: var(--hl);
  box-shadow:
    0 0 0 1px var(--hl),
    0 0 14px -2px rgb(34 197 94 / 0.55);
}
</style>
