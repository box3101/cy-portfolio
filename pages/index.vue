<script setup lang="ts">
definePageMeta({ layout: 'studio' })
useSeoMeta({ title: '이찬용 — 화면에서 그 너머로', description: '퍼블리싱에서 프론트엔드, 디자인 시스템과 AI 에이전트까지. 이찬용의 작업 세계를 둘러보세요.' })
useHead({ link: [{ rel: 'preload', as: 'image', href: '/images/studio-courtyard.webp' }] })
const activeRoom = ref('')
const backdrop = ref<HTMLElement | null>(null)
const rooms = [
  { id: 'design', number: '01', name: '디자인 시스템', subtitle: 'ispark-ui Storybook 둘러보기', detail: '일관된 화면을 만드는 기반', href: 'https://box3101.github.io/ispark-ui/', external: true },
  { id: 'agents', number: '02', name: 'AI 에이전트 & 업무 도구', subtitle: '무엇을, 왜, 어떻게 만들었는지', detail: 'TeamAgent · 제안서 에이전트 · TaskFlow', href: '/agents', external: false },
  { id: 'si', number: '03', name: 'SI 프로젝트', subtitle: '현장의 요구를 구현한 작업', detail: '공공 웹사이트 · 기업 업무시스템', href: '/projects?space=si', external: false },
]
function onPointerMove(event: PointerEvent) {
  if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (backdrop.value) backdrop.value.style.transform = `scale(1.025) translate(${(event.clientX / window.innerWidth - .5) * -8}px, ${(event.clientY / window.innerHeight - .5) * -5}px)`
}
function resetScene() { if (backdrop.value) backdrop.value.style.transform = '' }
</script>
<template>
  <main id="studio-main" class="courtyard" @pointermove="onPointerMove" @pointerleave="resetScene">
    <div ref="backdrop" class="courtyard__scene" aria-hidden="true"><img src="/images/studio-courtyard.webp" alt="" fetchpriority="high" width="1672" height="941" /></div>
    <div class="courtyard__shade" aria-hidden="true" />
    <header class="studio-header">
      <NuxtLink to="/" class="studio-brand" aria-label="이찬용 홈"><strong>CY.</strong><span>이찬용</span><small>프론트엔드 개발자 · AI 빌더</small></NuxtLink>
      <nav aria-label="주요 메뉴"><NuxtLink to="/projects">전체 작업</NuxtLink><NuxtLink to="/about">나의 이야기</NuxtLink><NuxtLink to="/contact">연락하기 ↗</NuxtLink></nav>
    </header>
    <div class="courtyard__intro">
      <p class="eyebrow">LEE CHANYONG / A WORLD OF WORK</p>
      <h1>화면을 만들다 보니,<br /><span>그 너머</span>도 만들고 싶어졌습니다.</h1>
      <p class="courtyard__description">프론트엔드 개발자 이찬용.<br class="mobile-break" /> 디자인 시스템과 AI 에이전트를 만듭니다.</p>
    </div>
    <NuxtLink class="story-door" to="/about">나의 이야기 <span>↗</span></NuxtLink>
    <nav class="room-grid" aria-label="작업 공간 선택">
      <NuxtLink v-for="room in rooms" :key="room.id" :to="room.href" :external="room.external" :target="room.external ? '_blank' : undefined" :rel="room.external ? 'noopener noreferrer' : undefined" class="room" :class="{ 'room--active': activeRoom === room.id }" @mouseenter="activeRoom = room.id" @mouseleave="activeRoom = ''" @focus="activeRoom = room.id" @blur="activeRoom = ''">
        <span class="room__sign"><small>{{ room.number }}</small>{{ room.name }}</span>
        <span class="room__card"><span class="room__number">{{ room.number }}</span><span class="room__copy"><strong>{{ room.name }}</strong><span>{{ room.subtitle }}<span v-if="room.external" class="sr-only"> (새 창)</span></span></span><span class="room__arrow" aria-hidden="true">{{ room.external ? '↗' : '→' }}</span></span>
        <span class="room__detail">{{ room.detail }}</span>
      </NuxtLink>
    </nav>
    <footer class="courtyard__footer"><p><span class="live-dot" /> 공간을 선택해 둘러보세요</p><span class="footer-caption">작은 디테일부터, 새로운 도구까지.</span><NuxtLink to="/projects">전체 작업 보기 ↗</NuxtLink></footer>
  </main>
</template>
<style scoped>
.courtyard { position: relative; min-height: max(800px, 100svh); isolation: isolate; overflow: hidden; display: flex; flex-direction: column; }
.courtyard__scene, .courtyard__shade { position: absolute; inset: 0; z-index: -2; }
.courtyard__scene { transition: transform 700ms ease-out; transform: scale(1.025); }
.courtyard__scene img { width: 100%; height: 100%; object-fit: cover; object-position: center 62%; }
.courtyard__shade { z-index: -1; background: linear-gradient(180deg,rgba(3,14,29,.8) 0%,rgba(3,14,29,.65) 28%,transparent 51%,rgba(3,14,29,.16) 70%,rgba(3,14,29,.9) 100%); }
.studio-header { display: flex; align-items: center; justify-content: space-between; padding: 25px 3.5vw; gap: 24px; }
.studio-brand { display: flex; align-items: center; gap: 13px; color: #fff; text-decoration: none; white-space: nowrap; }
.studio-brand strong { font-size: 30px; letter-spacing: -2px; line-height: 1; }.studio-brand span { font-size: 15px; }.studio-brand small { border-left: 1px solid #ffffff30; padding-left: 16px; font-size: 12px; color: #c8d3e2; }
.studio-header nav { display: flex; gap: 28px; }.studio-header nav a { color: #e7edf5; text-decoration: none; font-size: 13px; }
.courtyard__intro { padding: 28px 3.5vw 10px; }.eyebrow { color: #b1c3d8; font-size: 10px; letter-spacing: .2em; margin: 0 0 16px; }
h1 { font-size: clamp(32px,3.65vw,61px); line-height: 1.29; letter-spacing: -.045em; font-weight: 700; margin: 0; text-wrap: balance; }h1 span { color: #8dd9f5; }
.courtyard__description { font-size: clamp(13px,1.1vw,17px); color: #d3dfec; margin: 20px 0 0; }.mobile-break { display: none; }
.story-door { position: absolute; top: 37%; right: 8%; color: #fff; text-decoration: none; font-size: 13px; border-bottom: 1px solid #ffffff50; padding: 9px 0; text-shadow: 0 2px 15px #000; }.story-door span { margin-left: 25px; }
.room-grid { margin-top: auto; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 3.5vw; padding: 120px 5vw 55px; }
.room { min-width: 0; text-decoration: none; color: #fff; position: relative; display: flex; flex-direction: column; justify-content: flex-end; min-height: 215px; }
.room__sign { font-size: clamp(15px,1.45vw,23px); font-weight: 650; letter-spacing: -.02em; text-align: center; padding-bottom: 90px; text-shadow: 0 2px 20px #000; }.room__sign small { color: #8dd9f5; margin-right: 12px; }
.room__card { display: flex; align-items: center; gap: 18px; padding: 21px 20px; border: 1px solid #b7cfdf65; background: linear-gradient(130deg,#0e1c30e8,#071322e0); backdrop-filter: blur(14px); border-radius: 12px; box-shadow: 0 15px 40px #0004; transition: transform .25s,border-color .25s,background .25s; }
.room--active .room__card { transform: translateY(-7px); border-color: #8dd9f5; background: #0e2945ee; }.room__number { color: #8dd9f5; font-size: 20px; font-weight: 650; }.room__copy { display: flex; flex-direction: column; gap: 5px; min-width: 0; }.room__copy strong { font-size: clamp(14px,1.3vw,19px); font-weight: 600; letter-spacing: -.025em; }.room__copy>span { color: #c1cbd7; font-size: 12px; }.room__arrow { font-size: 25px; margin-left: auto; }.room__detail { text-align: center; color: #bfccda; font-size: 11px; padding-top: 13px; text-shadow: 0 2px 5px #000; }
.courtyard__footer { display: flex; align-items: center; justify-content: space-between; padding: 19px 3.5vw; border-top: 1px solid #ffffff24; background: #06101ca8; gap: 20px; font-size: 12px; }.courtyard__footer p { margin: 0; color: #c3d0df; }.courtyard__footer a { color: white; text-decoration: none; border: 1px solid #ffffff50; border-radius: 30px; padding: 8px 20px; }.footer-caption { color: #a6b6c8; }.live-dot { display: inline-block; width: 5px; height: 5px; background: #8dd9f5; border-radius: 50%; margin-right: 10px; }.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
@media(min-width:1800px) { .courtyard { min-height: 100svh; }.room-grid { padding-bottom: 8vh; } }
@media(max-width:900px) { .studio-brand small { display: none; }.room-grid { gap: 15px; padding-left: 24px; padding-right: 24px; }.room__card { padding: 18px 14px; gap: 10px; }.room__number { display: none; }.room__sign { font-size: 15px; }.footer-caption { display: none; } }
@media(max-width:640px) { .courtyard { min-height: 100svh; }.courtyard__scene img { object-position: 48% center; }.courtyard__shade { background: linear-gradient(#061426b0,#06142655 30%,#061426a8 55%,#061426f5); }.studio-header { padding: 22px 22px; }.studio-brand strong { font-size: 26px; }.studio-header nav { gap: 16px; }.studio-header nav a { font-size: 12px; }.studio-header nav a:first-child { display: none; }.courtyard__intro { padding: 28px 22px 15px; }h1 { font-size: clamp(28px,6.8vw,40px); line-height: 1.42; letter-spacing: -.055em; }.eyebrow { font-size: 9px; letter-spacing: .12em; }.mobile-break { display: block; }.courtyard__description { font-size: 13px; line-height: 1.8; }.story-door { display: none; }.room-grid { display: flex; flex-direction: column; padding: 90px 22px 24px; gap: 12px; }.room { min-height: 0; }.room__sign,.room__detail { display: none; }.room__number { display: block; }.room__card { padding: 17px 18px; gap: 18px; }.room__copy strong { font-size: 16px; }.room__copy>span { font-size: 12px; }.courtyard__footer { padding: 16px 22px; font-size: 10px; }.courtyard__footer a { padding: 7px 13px; } }
@media(prefers-reduced-motion:reduce) { .courtyard__scene { transform: none!important; }.room--active .room__card { transform: none; } }
</style>
