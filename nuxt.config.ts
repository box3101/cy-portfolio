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
      // sitemap.xml은 절대 URL을 요구한다. NUXT_PUBLIC_SITE_URL 로 덮어쓸 수 있다.
      siteUrl: 'https://cy-portfolio-eight.vercel.app',
    },
  },

  app: {
    // 라우트 이동 시 페이드. out-in 이라 두 페이지가 겹치지 않는다.
    pageTransition: { name: 'page', mode: 'out-in' },

    head: {
      htmlAttrs: { lang: 'ko' },
      link: [
        // 웹폰트는 Pretendard 하나뿐이다. Google Fonts 는 더 이상 쓰지 않으므로
        // 스타일시트와 preconnect 2개를 함께 걷어냈다.
        { rel: 'preconnect', href: 'https://cdn.jsdelivr.net', crossorigin: '' },
        // dynamic-subset은 실제로 쓰인 한글 글리프 구간만 내려받는다.
        // Google Fonts에 없는 서체라 jsDelivr로 받는다.
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css',
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
    /*
      스모크 페이지는 ispark-ui SSR 검증용이라 공개 사이트의 일부가 아니다.
      라우트는 살려둔다(테스트가 실제로 요청한다). 대신 색인만 막는다.
      캐시하지 않는 이유: 검증 대상이라 항상 갓 렌더된 HTML이어야 한다.
    */
    '/smoke/**': {
      ssr: true,
      headers: { 'x-robots-tag': 'noindex, nofollow' },
    },
  },
})
