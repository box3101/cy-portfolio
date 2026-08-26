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
    '~/assets/css/motion.css',
  ],

  // Nuxt는 composables/ 최상위만 자동 임포트한다.
  // api/ · store/ 하위 폴더까지 스캔하도록 명시한다.
  imports: {
    dirs: ['composables/**'],
  },

  runtimeConfig: {
    public: {
      supabaseUrl: '',
      supabaseAnonKey: '',
    },
  },

  app: {
    // 라우트 이동 시 페이드. out-in 이라 두 페이지가 겹치지 않는다.
    pageTransition: { name: 'page', mode: 'out-in' },

    head: {
      htmlAttrs: { lang: 'ko' },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700;900&family=Instrument+Serif:ital@0;1&family=IBM+Plex+Sans+KR:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap',
        },
      ],
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
