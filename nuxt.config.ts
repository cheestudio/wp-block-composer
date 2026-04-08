// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],
	debug: true,

  runtimeConfig: {
    // Server-only — never exposed to client
    anthropicApiKey: '',
    claudeModel: 'claude-sonnet-4-20250514',
    claudeMaxTokens: 8000,
    bundleDir: './.bundles',
    bundleTtlMs: 3600000,
    public: {}
  },

  typescript: {
    strict: true
  },

  compatibilityDate: '2025-01-15',

})
