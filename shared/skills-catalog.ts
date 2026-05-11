export interface CatalogSkill {
  label: string
  icon: string
  aliases: string[]
}

export interface CatalogGroup {
  titleKey: string
  items: CatalogSkill[]
}

export const SKILLS_CATALOG: CatalogGroup[] = [
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

export const CATALOG_LABELS: string[] = SKILLS_CATALOG.flatMap(g => g.items.map(i => i.label))
