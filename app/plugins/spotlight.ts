import { spotlight } from '@/directives/spotlight'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('spotlight', spotlight)
})
