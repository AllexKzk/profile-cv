export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  experimental: {
    serverAppConfig: false,
  },

  typescript: {
    typeCheck: "build",
  },

  modules: ["@nuxt/eslint", "shadcn-nuxt", "@nuxtjs/tailwindcss", "@nuxt/icon", "@nuxtjs/i18n"],

  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },

  i18n: {
    strategy: "no_prefix",
    defaultLocale: "en",
    langDir: "locales/",
    locales: [
      { code: "en", language: "en-US", files: ["en/common.json", "en/cv.json"] },
      { code: "ru", language: "ru-RU", files: ["ru/common.json", "ru/cv.json"] },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_locale",
      fallbackLocale: "en",
    },
  },
});