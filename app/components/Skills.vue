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

interface SkillItem {
  label: string
  icon: string
  aliases: string[]
}

interface SkillGroup {
  titleKey: string
  items: SkillItem[]
}

const groups: SkillGroup[] = [
  {
    titleKey: 'skills.frontend',
    items: [
      { label: 'Vue 3', icon: 'vscode-icons:file-type-vue', aliases: ['vue', 'vue 3', 'vuejs', 'vue.js'] },
      { label: 'React 18', icon: 'vscode-icons:file-type-reactjs', aliases: ['react', 'react 18', 'reactjs', 'react.js'] },
      { label: 'Nuxt 3', icon: 'vscode-icons:file-type-nuxt', aliases: ['nuxt', 'nuxt 3', 'nuxtjs', 'nuxt.js'] },
      { label: 'Next.js', icon: 'vscode-icons:file-type-light-next', aliases: ['next', 'nextjs', 'next.js'] },
      { label: 'TypeScript', icon: 'vscode-icons:file-type-typescript', aliases: ['typescript', 'ts'] },
    ],
  },
  {
    titleKey: 'skills.styling',
    items: [
      { label: 'Tailwind CSS', icon: 'vscode-icons:file-type-tailwind', aliases: ['tailwind', 'tailwindcss', 'tailwind css'] },
      { label: 'CSS Modules', icon: 'vscode-icons:file-type-css', aliases: ['css', 'css modules', 'cssmodules'] },
      { label: 'SASS', icon: 'vscode-icons:file-type-sass', aliases: ['sass', 'scss'] },
    ],
  },
  {
    titleKey: 'skills.tooling',
    items: [
      { label: 'Vite', icon: 'vscode-icons:file-type-vite', aliases: ['vite'] },
      { label: 'Webpack', icon: 'vscode-icons:file-type-webpack', aliases: ['webpack'] },
      { label: 'ESLint', icon: 'vscode-icons:file-type-eslint', aliases: ['eslint'] },
      { label: 'Cypress', icon: 'vscode-icons:file-type-cypress', aliases: ['cypress'] },
      { label: 'Git', icon: 'vscode-icons:file-type-git', aliases: ['git'] },
      { label: 'Docker', icon: 'vscode-icons:file-type-docker2', aliases: ['docker'] },
    ],
  },
]

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
