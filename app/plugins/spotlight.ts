import type { ObjectDirective } from 'vue'
import { spotlight } from '@/directives/spotlight'

const noop: ObjectDirective = {}

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client && window.matchMedia('(hover: none)').matches) {
    nuxtApp.vueApp.directive('spotlight', noop)
    return
  }
  nuxtApp.vueApp.directive('spotlight', spotlight)
})
