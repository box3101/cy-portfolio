// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2026-08-26',
  devtools: { enabled: true },

  // ispark-ui는 Vue SFC를 포함한 ESM 라이브러리 → 트랜스파일 필요
  build: {
    transpile: ['@leechanyong/ispark-ui'],
  },

  css: ['~/assets/css/tokens.css'],

  runtimeConfig: {
    public: {
      supabaseUrl: '',
      supabaseAnonKey: '',
    },
  },

  routeRules: {
    '/': { isr: 3600 },
    '/projects': { isr: 3600 },
    '/projects/**': { isr: 3600 },
    '/archive': { isr: 3600 },
    '/about': { isr: 3600 },
    '/design-system': { ssr: true },
    '/admin/**': { ssr: false },
    // 스모크 페이지는 SSR 검증 대상이므로 캐시하지 않는다
    '/smoke/**': { ssr: true },
  },
})
