<script setup lang="ts">
import { portfolioNavigation } from '~/data/navigation'

definePageMeta({ layout: 'studio' })
useSeoMeta({ title: 'THE CY JOURNAL — AI 빌더 이찬용의 작업신문', description: '기획·디자인부터 프론트엔드·백엔드 개발과 배포까지 직접 만드는 AI 빌더 이찬용. UI 디자인 시스템, 제안서 AI 에이전트, 웹 프로젝트를 펼쳐보세요.' })
useHead({ link: [{ rel: 'preload', as: 'image', href: '/images/journal-home/newspaper-ai-builder.webp' }] })
const articles = [
  { name: 'UI 디자인 시스템', to: '/projects/ispark-ui', x: 16, polygon: '4.7% 16%, 29.4% 14%, 29.4% 88.5%, 3% 87.8%' },
  { name: '제안서 AI 에이전트', to: '/work/proposal-agent', x: 51, polygon: '29.4% 14%, 71.1% 15.4%, 72.2% 88.5%, 29.4% 88.5%' },
  { name: '웹 프로젝트', to: '/projects', x: 84, polygon: '71.1% 15.4%, 96.2% 19.1%, 97.2% 88.1%, 72.2% 88.5%' },
]
const viewport = ref<HTMLElement>()
const scene = ref<HTMLElement>()
const artwork = ref<HTMLImageElement>()
const menu = ref<HTMLDetailsElement>()
const selected = ref(1)
const leaving = ref(false)
const failed = ref(false)
const reduced = ref(false)
const router = useRouter()
let timer: ReturnType<typeof setTimeout> | undefined
let cleanup = () => {}
let motionFrame = 0
let pointer: { x: number; y: number } | null = null

function resetMotion() {
  cancelAnimationFrame(motionFrame)
  motionFrame = 0
  pointer = null
  scene.value?.style.setProperty('--view-x', '0px')
  scene.value?.style.setProperty('--view-y', '0px')
}
function moveView(event: PointerEvent) {
  if (event.pointerType !== 'mouse' || reduced.value || leaving.value || innerWidth <= 760) return
  pointer = { x: event.clientX, y: event.clientY }
  if (motionFrame) return
  motionFrame = requestAnimationFrame(() => {
    motionFrame = 0
    const el = scene.value
    if (!el || !pointer) return
    const bounds = el.getBoundingClientRect()
    el.style.setProperty('--view-x', `${(pointer.x / innerWidth - .5) * -12}px`)
    el.style.setProperty('--view-y', `${(pointer.y / innerHeight - .5) * -8}px`)
    el.style.setProperty('--light-x', `${(pointer.x - bounds.left) / bounds.width * 100}%`)
    el.style.setProperty('--light-y', `${(pointer.y - bounds.top) / bounds.height * 100}%`)
  })
}

function select(index: number, smooth = true) {
  selected.value = index
  if (!viewport.value || !scene.value) return
  if (innerWidth > 760) { viewport.value.scrollLeft = 0; return }
  viewport.value.scrollTo({ left: scene.value.clientWidth * articles[index]!.x / 100 - viewport.value.clientWidth / 2, behavior: smooth && !reduced.value ? 'smooth' : 'instant' })
}
function enter(event: MouseEvent, index: number) {
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  if (leaving.value) return
  resetMotion()
  if (scene.value) scene.value.style.transformOrigin = `${articles[index]!.x}% 52%`
  leaving.value = true
  timer = setTimeout(async () => {
    try { await router.push(articles[index]!.to) } finally { leaving.value = false }
  }, reduced.value ? 0 : 350)
}
function escapeMenu(event: KeyboardEvent) {
  if (event.key === 'Escape' && menu.value?.open) {
    menu.value.open = false
    menu.value.querySelector('summary')?.focus()
  }
}
onMounted(() => {
  if (artwork.value?.complete && !artwork.value.naturalWidth) failed.value = true
  const media = matchMedia('(prefers-reduced-motion: reduce)')
  const update = () => { reduced.value = media.matches; resetMotion() }
  update(); media.addEventListener('change', update)
  const resize = new ResizeObserver(() => { resetMotion(); select(selected.value, false) })
  if (viewport.value) resize.observe(viewport.value)
  select(1, false)
  cleanup = () => { resize.disconnect(); media.removeEventListener('change', update) }
})
onBeforeUnmount(() => { cleanup(); clearTimeout(timer); cancelAnimationFrame(motionFrame) })
</script>

<template>
  <main id="studio-main" class="journal-cover" :class="{ 'is-leaving': leaving, 'image-failed': failed }" @keydown="escapeMenu">
    <h1 class="sr-only">THE CY JOURNAL — 이찬용 · AI 빌더 · 기획 · 디자인 · 프론트엔드 · 백엔드 · 배포</h1>
    <div ref="viewport" class="cover-viewport" @pointermove="moveView" @pointerleave="resetMotion">
      <div ref="scene" class="cover-scene">
        <img ref="artwork" class="cover-art" src="/images/journal-home/newspaper-ai-builder.webp" width="1672" height="941" fetchpriority="high" draggable="false" alt="AI 빌더 이찬용의 작업신문. 기획·디자인·프론트엔드·백엔드·배포. 왼쪽에는 UI 디자인 시스템, 중앙에는 제안서 AI 에이전트, 오른쪽에는 웹 프로젝트 기사가 실려 있습니다. 기사 속 이미지는 디자인 콘셉트 시안입니다." @error="failed = true" />
        <nav class="cover-articles" aria-label="신문 기사">
          <a v-for="(article, index) in articles" :key="article.to" :href="article.to" :aria-label="`${article.name} 읽기`" :style="{ clipPath: `polygon(${article.polygon})` }" class="article-link" @focus="select(index)" @click="enter($event, index)">
            <span class="sr-only">{{ article.name }} — 작업 이야기 읽기</span>
          </a>
        </nav>
      </div>
    </div>
    <details ref="menu" class="cover-menu">
      <summary aria-label="사이트 메뉴"><span></span><span></span></summary>
      <nav aria-label="주요 메뉴"><NuxtLink v-for="item in portfolioNavigation" :key="item.to" :to="item.to">{{ item.label }} <span aria-hidden="true">↗</span></NuxtLink></nav>
    </details>
    <nav class="mobile-sections" aria-label="신문 지면 이동">
      <button v-for="(article,index) in articles" :key="article.to" type="button" :aria-pressed="selected === index" @click="select(index)">{{ article.name }}</button>
    </nav>
    <aside v-if="failed" class="cover-fallback" role="status"><h2>THE CY JOURNAL</h2><p>이미지를 불러오지 못했어요. 읽고 싶은 기사를 선택해 주세요.</p><NuxtLink v-for="article in articles" :key="article.to" :to="article.to">{{ article.name }} ↗</NuxtLink></aside>
    <p class="sr-only" aria-live="polite">{{ leaving ? '선택한 작업 이야기로 이동합니다.' : '' }}</p>
  </main>
</template>

<style scoped>
.journal-cover{position:relative;isolation:isolate;min-height:480px;height:100svh;overflow:hidden;background:#c9b493;color:#30281f;font-family:var(--font-body)}
.journal-cover::before{content:'';position:absolute;inset:-30px;z-index:-1;background:url('/images/journal-home/newspaper-ai-builder.webp') center / cover;filter:blur(25px);opacity:.65}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.cover-viewport{position:absolute;inset:0;display:grid;place-items:center;overflow:hidden;scrollbar-width:none;overscroll-behavior-x:contain;touch-action:pan-x pinch-zoom}
.cover-viewport::-webkit-scrollbar{display:none}
.cover-scene{position:relative;width:max(100vw,177.6833svh);aspect-ratio:1672 / 941;grid-area:1 / 1;flex:none;transform:translate3d(var(--view-x,0px),var(--view-y,0px),0) scale(1.018);transition:transform .85s cubic-bezier(.2,.65,.3,1),opacity .45s;will-change:transform}
.cover-art{display:block;width:100%;height:100%;user-select:none;pointer-events:none}
.cover-articles{position:absolute;inset:0}
.article-link{position:absolute;inset:0;display:block;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:background .2s}
.article-link::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 35% 48% at var(--light-x,50%) var(--light-y,50%),#fff9dd35,transparent 75%);opacity:0;transition:opacity .35s;pointer-events:none}
.article-link:hover::before{opacity:1}
.article-link:focus-visible{outline:none!important;background:#faf6e431;box-shadow:inset 0 0 0 6px #285cc9}
.article-link:focus-visible::after{content:'읽기 ↗';position:absolute;left:46%;top:50%;font-size:16px;padding:10px 18px;border:2px solid #285cc9;border-radius:4px;background:#fff6e7;color:#234b92}
.article-link:first-child:focus-visible::after{left:10%}.article-link:last-child:focus-visible::after{left:78%}
.cover-menu{position:absolute;z-index:3;right:18px;top:16px}.cover-menu summary{list-style:none;width:40px;height:40px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;border:1px solid #68513944;border-radius:50%;background:#f8edda75;backdrop-filter:blur(10px);cursor:pointer}.cover-menu summary::-webkit-details-marker{display:none}.cover-menu summary span{width:15px;height:1px;background:#493b2b}.cover-menu nav{position:absolute;right:0;top:50px;width:200px;padding:10px;background:#faf0dfee;border:1px solid #68513944;box-shadow:0 12px 28px #382a2330;border-radius:10px;backdrop-filter:blur(16px)}.cover-menu nav a{display:flex;justify-content:space-between;padding:13px 12px;color:#33291d;text-decoration:none;font-size:13px;border-radius:5px}.cover-menu nav a:hover{background:#a58c6520}
.mobile-sections{display:none}.is-leaving .cover-scene{transform:scale(1.12);opacity:.7}.is-leaving .cover-menu,.is-leaving .mobile-sections{opacity:0;pointer-events:none}
.cover-fallback{position:absolute;inset:15% 10%;display:flex;flex-direction:column;justify-content:center;gap:16px;text-align:center;background:#faf0df;padding:25px}.cover-fallback h2{font:clamp(23px,5vw,40px) Georgia,serif}.cover-fallback p{line-height:1.7}.cover-fallback a{color:#285cc9;padding:12px}.image-failed .cover-viewport{visibility:hidden}
@media(max-width:760px){.journal-cover{min-height:520px}.cover-viewport{bottom:64px;display:block}.cover-scene{height:100%;width:auto;min-width:100%;max-width:none;margin:0;aspect-ratio:1672 / 941}.cover-menu{right:14px;top:12px}.mobile-sections{position:absolute;inset:auto 0 0;display:flex;align-items:center;justify-content:center;gap:5px;min-height:64px;padding:8px 8px max(8px,env(safe-area-inset-bottom));background:#eaddc5;border-top:1px solid #826c4f55}.mobile-sections button{font-family:inherit;font-size:11px;padding:12px 10px;min-height:44px;border:1px solid transparent;background:transparent;color:#62513b;border-radius:6px;cursor:pointer}.mobile-sections button[aria-pressed=true]{border-color:#88724c55;background:#f8efdd;color:#244d9b}.article-link:focus-visible::after{font-size:13px}.cover-fallback{inset:15% 7%}}
@media(prefers-reduced-motion:reduce){.cover-scene,.is-leaving .cover-scene{transition:none;transform:none}.article-link{transition:none}}
@media(max-width:760px){.cover-viewport{overflow-x:auto;overflow-y:hidden;place-items:normal}.cover-scene{transform:none;will-change:auto;justify-self:start}}
@media(prefers-reduced-motion:reduce){.article-link::before{transition:none}}
</style>
