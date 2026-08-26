// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2026-08-26',
  devtools: { enabled: true },

  // 템플릿 타입체크. ispark-ui의 필수 prop 누락(예: UiFileList의 getUrl)을
  // SSR 500이 아니라 빌드 단계에서 잡는다.
  typescript: {
    typeCheck: true,
    strict: true,
  },

  // ispark-ui는 Vue SFC를 포함한 ESM 라이브러리 → 트랜스파일 필요
  build: {
    transpile: ['@leechanyong/ispark-ui'],
  },

  // 순서 중요: ispark-ui 기본 스타일 → 브랜드 토큰 오버라이드
  css: [
    '@leechanyong/ispark-ui/style.css',
    '~/assets/css/tokens.css',
  ],

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
