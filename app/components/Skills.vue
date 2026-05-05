<template>
  <Section id="skills" :title="$t('skills.title')">
    <div class="list">
      <h3>{{ $t('skills.frontend') }}</h3>
      <div>
        <Badge v-spotlight variant="glass">
          <Icon name="vscode-icons:file-type-vue" />
          Vue 3
        </Badge>
        <Badge v-spotlight variant="glass">
          <Icon name="vscode-icons:file-type-reactjs" />
          React 18
        </Badge>
        <Badge v-spotlight variant="glass">
          <Icon name="vscode-icons:file-type-nuxt" />
          Nuxt 3
        </Badge>
        <Badge v-spotlight variant="glass">
          <Icon name="vscode-icons:file-type-light-next" />
          Next.js
        </Badge>
        <Badge v-spotlight variant="glass">
          <Icon name="vscode-icons:file-type-typescript" />
          TypeScript
        </Badge>
      </div>
      <h3>{{ $t('skills.styling') }}</h3>
      <div>
        <Badge v-spotlight variant="glass">
          <Icon name="vscode-icons:file-type-tailwind" />
          Tailwind CSS
        </Badge>
        <Badge v-spotlight variant="glass">
          <Icon name="vscode-icons:file-type-css" />
          CSS Modules
        </Badge>
        <Badge v-spotlight variant="glass">
          <Icon name="vscode-icons:file-type-sass" />
          SASS
        </Badge>
      </div>
      <h3>{{ $t('skills.tooling') }}</h3>
      <div>
        <Badge v-spotlight variant="glass">
          <Icon name="vscode-icons:file-type-vite" />
          Vite
        </Badge>
        <Badge v-spotlight variant="glass">
          <Icon name="vscode-icons:file-type-webpack" />
          Webpack
        </Badge>
        <Badge v-spotlight variant="glass">
          <Icon name="vscode-icons:file-type-eslint" />
          ESLint
        </Badge>
        <Badge v-spotlight variant="glass">
          <Icon name="vscode-icons:file-type-cypress" />
          Cypress
        </Badge>
        <Badge v-spotlight variant="glass">
          <Icon name="vscode-icons:file-type-git" />
          Git
        </Badge>
        <Badge v-spotlight variant="glass">
          <Icon name="vscode-icons:file-type-docker2" />
          Docker
        </Badge>
      </div>
    </div>
  </Section>
</template>
<script setup lang="ts">
import { Section } from '@/components/ui/section'
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
</style>
