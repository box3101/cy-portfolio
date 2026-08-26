/**
 * v-reveal — 스크롤 진입 시 나타나는 디렉티브.
 *
 * AOS 라이브러리를 쓰지 않는 이유:
 *   1) 초기 상태를 CSS로 숨기므로 JS가 실패하면 콘텐츠가 영영 안 보인다
 *   2) SSR HTML에도 숨김 상태가 실려 접근성·SEO에 불리하다
 *
 * 이 구현은 **클라이언트에서 마운트된 뒤에만** 숨김 클래스를 붙인다.
 * 서버 HTML과 JS 미동작 환경에서는 콘텐츠가 그대로 보인다.
 *
 * 사용:
 *   <div v-reveal>...</div>
 *   <div v-reveal="{ delay: 120 }">...</div>
 */
type RevealOptions = { delay?: number }

// .client 플러그인으로 두면 서버에 디렉티브가 등록되지 않아 SSR이
// "Failed to resolve directive: reveal" 로 500이 난다.
// 범용 플러그인으로 등록하고, DOM을 만지는 mounted 훅만 클라이언트에서 동작하게 둔다.
export default defineNuxtPlugin((nuxtApp) => {
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let observer: IntersectionObserver | null = null

  const getObserver = () => {
    if (observer) return observer
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          const delay = Number(el.dataset.revealDelay ?? 0)

          window.setTimeout(() => el.classList.add('is-revealed'), delay)
          observer?.unobserve(el)
        }
      },
      // 요소가 조금 보이기 시작할 때 실행한다. 화면 하단에 걸치자마자 튀지 않게 여유를 둔다.
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    return observer
  }

  nuxtApp.vueApp.directive('reveal', {
    mounted(el: HTMLElement, binding) {
      if (reduceMotion()) return

      const opts = (binding.value ?? {}) as RevealOptions
      if (opts.delay) el.dataset.revealDelay = String(opts.delay)

      // 마운트 이후에 숨긴다 → SSR HTML은 항상 보이는 상태로 나간다.
      el.classList.add('reveal')
      getObserver().observe(el)
    },
    unmounted(el: HTMLElement) {
      observer?.unobserve(el)
    },
    // SSR에서는 아무 속성도 추가하지 않는다 → HTML은 항상 보이는 상태로 나간다.
    getSSRProps: () => ({}),
  })
})
