export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  app: {
    head: {
      viewport:
        "width=device-width, initial-scale=1, viewport-fit=cover",
      meta: [
        { name: "theme-color", content: "#0a0a0a" },
      ],
    },
  },

  experimental: {
    serverAppConfig: false,
  },

  typescript: {
    typeCheck: "build",
  },

  runtimeConfig: {
    llmApiKey: "",
    llmModel: "openai/gpt-4o-mini",
    llmBaseUrl: "https://openrouter.ai/api/v1",
    llmReferer: "",
    llmTitle: "",
  },

  vite: {
    server: {
      // Allow ngrok / cloudflared / loca.lt tunnels to hit the dev server. Vite
      // 5+ blocks unknown Host headers by default as a DNS-rebinding mitigation;
      // for local-only dev with tunneled HTTPS this is just friction.
      allowedHosts: [".ngrok-free.app", ".ngrok.app", ".trycloudflare.com", ".loca.lt"],
    },
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