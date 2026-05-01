<template>
  <section id="skills">
    <h2>{{ $t('skills.title') }}</h2>
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
          <Icon name="vscode-icons:file-type-vue" />
          Vue 3
        </Badge>
        <Badge v-spotlight variant="glass">
          <Icon name="vscode-icons:file-type-reactjs" />
          React 18
        </Badge>
      </div>
      <h3>{{ $t('skills.tooling') }}</h3>
      <div>
        <Badge v-spotlight variant="glass">
          <Icon name="vscode-icons:file-type-vue" />
          Vue 3
        </Badge>
        <Badge v-spotlight variant="glass">
          <Icon name="vscode-icons:file-type-typescript" />
          TypeScript
        </Badge>
      </div>
    </div>
  </section>
</template>
<style>
@reference "./assets/css/tailwind.css";

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
