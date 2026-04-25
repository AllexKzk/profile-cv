export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  experimental: {
    serverAppConfig: false,
  },

  typescript: {
    typeCheck: "build",
  },

  modules: ["@nuxt/eslint", "shadcn-nuxt", "@nuxtjs/tailwindcss", "@nuxt/icon"],
  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },
});