<template>
  <Section id="skills" :title="$t('skills.title')">
    <div class="list">
      <template v-for="[group, section] in groups" :key="group">
        <h3>{{ $t(group) }}</h3>
        <div class="gap-y-3">
          <Badge
            v-for="item in section.items"
            :key="item.label"
            v-spotlight
            variant="glass"
            class="spotlight--skills"
            :class="{
              'sr-only': (isHR && item.onlyDev) || (isDev && item.onlyHR),
              'is-highlighted': isHighlighted(item.aliases),
              'is-disabled': isDisabled(item.aliases),
            }"
          >
            <Icon v-if="item.icon" :name="item.icon" />
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

const { isHighlighted, isDisabled, isHR, isDev } = useTuning()
const groups = computed(() => Object.entries(SKILLS_CATALOG).filter(([_, section]) => !isHR || !section.onlyDev))
</script>
<style scoped>
@reference "@/assets/css/tailwind.css";

.list {
  @apply grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-y-2 md:gap-y-5 gap-x-1.5 w-full;
  h3 {
    @apply text-neutral-400 text-sm md:my-auto mt-3 md:mt-0 first:mt-0;
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
    0 0 10px 1px rgb(34 197 94 / 0.55);
}
.is-disabled {
  opacity: 0.5;
  cursor: default;
}

/* Larger spotlight on small badges (v-spotlight is on Badge root). */
:deep(.spotlight--skills.spotlight) {
  --spot-scale: 1.65;
}
</style>
