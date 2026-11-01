<script setup lang="ts">
import { UiButton } from '@leechanyong/ispark-ui'
import { portfolioNavigation } from '~/data/navigation'
const activeExhibit = ref('')
const sceneReady = ref(false)
definePageMeta({ layout: 'studio' })
useSeoMeta({ title: '이찬용 — 생각을 설계하고, 화면으로 만듭니다.', description: '프론트엔드 개발자 이찬용의 디자인 시스템, 제안서 AI 에이전트, SI 프로젝트.' })
useHead({ link: [{ rel: 'preload', as: 'image', href: '/images/gallery-hero.webp' }] })
</script>
<template>
  <main id="studio-main" class="gallery" :class="{ 'gallery--ready': sceneReady }">
    <img class="gallery-scene" src="/images/gallery-hero.webp" alt="햇살이 비치는 밝은 갤러리의 푸른 유리 전시대" fetchpriority="high" />
    <ClientOnly><StudioGalleryWorld :active="activeExhibit" @ready="sceneReady = $event" /></ClientOnly>
    <header class="gallery-header">
      <NuxtLink to="/" class="brand" aria-label="이찬용 홈"><b>CY.</b><span>이찬용</span></NuxtLink>
      <nav aria-label="주요 메뉴"><NuxtLink v-for="item in portfolioNavigation" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink></nav>
    </header>
    <section class="gallery-intro">
      <p class="eyebrow">FRONTEND DEVELOPER & AI BUILDER</p>
      <h1>생각을 설계하고,<br />화면으로 만듭니다.</h1>
      <p class="description">기획부터 디자인, 개발까지.<br />직접 만든 제품과 그 과정을 소개합니다.</p>
      <UiButton as="a" href="/work/proposal-agent" variant="primary" size="xlg" class="gallery-cta">제안서 에이전트 보기 ↗</UiButton>
    </section>
    <nav class="exhibits" aria-label="갤러리 작업 선택">
      <a class="exhibit exhibit--design" @mouseenter="activeExhibit = 'design'" @mouseleave="activeExhibit = ''" @focus="activeExhibit = 'design'" @blur="activeExhibit = ''" href="https://box3101.github.io/ispark-ui/" target="_blank" rel="noopener noreferrer"><span class="number">01</span><div><strong>디자인 시스템</strong><small>ispark-ui · Storybook</small></div><span>↗</span></a>
      <NuxtLink class="exhibit exhibit--proposal" @mouseenter="activeExhibit = 'proposal'" @mouseleave="activeExhibit = ''" @focus="activeExhibit = 'proposal'" @blur="activeExhibit = ''" to="/work/proposal-agent"><span class="number">02</span><div><strong>제안서 AI 에이전트</strong><small>기획 · 디자인 · 개발 이야기</small></div><span>↗</span></NuxtLink>
      <NuxtLink class="exhibit exhibit--si" @mouseenter="activeExhibit = 'si'" @mouseleave="activeExhibit = ''" @focus="activeExhibit = 'si'" @blur="activeExhibit = ''" to="/projects?space=si"><span class="number">03</span><div><strong>SI 프로젝트</strong><small>현장에서 만든 제품들</small></div><span>↗</span></NuxtLink>
    </nav>
    <p v-if="sceneReady" class="gallery-hint">드래그로 둘러보고, 전시대를 가리켜 보세요</p>
    <footer class="gallery-footer"><span>01 / THE WORK GALLERY</span><NuxtLink to="/work/team-agent">TeamAgent 둘러보기 ↗</NuxtLink><NuxtLink to="/projects">프로젝트 보기 ↗</NuxtLink></footer>
  </main>
</template>
<style scoped>
.gallery--ready .gallery-scene { opacity:0; }.gallery-scene { transition:opacity .5s; }.gallery-header,.gallery-intro,.exhibits,.gallery-footer { z-index:2; }.gallery-header { position:relative; }.gallery-intro { pointer-events:none; }.gallery-intro :deep(a) { pointer-events:auto; }.gallery-cta { min-height:44px; padding-inline:22px!important; }.gallery-hint { position:absolute; right:5%; bottom:85px; font-size:11px; color:#60718a; pointer-events:none; }.gallery { --color-primary:#294ccc; --color-primary-hover:#1836a6; --color-primary-dark:#1836a6; --color-primary-rgb:41,76,204; }
@media(max-width:740px) { .gallery-header { flex-wrap:wrap; gap:20px; }.gallery-header nav { width:100%; justify-content:space-between; }.gallery-hint { top:590px; bottom:auto; right:24px; }.exhibits { margin-top:220px; } }

.gallery { position:relative; isolation:isolate; min-height:850px; height:100svh; overflow:hidden; background:#f5f1e9; color:#202734; }
.gallery-scene { position:absolute; inset:0; z-index:-2; width:100%; height:100%; object-fit:cover; object-position:center; }
.gallery::before { content:''; position:absolute; inset:0; z-index:-1; background:linear-gradient(90deg,#f7f3edaa,transparent 56%); pointer-events:none; }
.gallery-header { display:flex; justify-content:space-between; align-items:center; padding:32px 4vw; }
.brand { display:flex; gap:20px; align-items:center; }.brand b { font-size:32px; letter-spacing:-2px; }.brand span { font-size:14px; }
a { color:inherit; text-decoration:none; }.gallery-header nav { display:flex; gap:32px; font-size:14px; }
.gallery-intro { position:relative; margin:9vh 0 0 4vw; width:46%; }.eyebrow { font-size:10px; letter-spacing:.16em; color:#647082; margin:0 0 23px; }
h1 { font-size:clamp(35px,3.7vw,66px); letter-spacing:-.065em; line-height:1.28; margin:0; word-break:keep-all; }
.description { font-size:15px; line-height:1.85; color:#596575; margin:26px 0 32px; }
.primary-link { display:inline-flex; align-items:center; gap:25px; border-radius:50px; background:#294ccc; color:white; padding:18px 25px; font-size:14px; box-shadow:0 8px 24px #294ccc22; transition:background .2s,transform .2s; }.primary-link:hover { background:#1836a6; transform:translateY(-3px); }
.exhibit { position:absolute; display:flex; gap:13px; align-items:center; padding:16px 19px; background:#ffffffdf; backdrop-filter:blur(18px); border:1px solid #ffffff; border-radius:13px; box-shadow:0 10px 35px #37496515; transition:transform .2s,box-shadow .2s; }
.exhibit:hover { transform:translateY(-5px); box-shadow:0 18px 36px #37496525; }.exhibit .number { color:#526697; font-size:10px; }.exhibit strong { font-size:14px; display:block; }.exhibit small { color:#657287; font-size:10px; display:block; margin-top:5px; }.exhibit>span:last-child { margin-left:8px; color:#294ccc; }
.exhibit--design { left:27%; bottom:19%; }.exhibit--proposal { left:55%; bottom:27%; border-color:#a5c2ff; background:#f5f9fff0; }.exhibit--si { right:3%; bottom:17%; }
.gallery-footer { position:absolute; bottom:0; left:0; right:0; display:flex; gap:30px; align-items:center; padding:26px 4vw; font-size:11px; background:linear-gradient(transparent,#f5f1e9dd); }.gallery-footer>span { margin-right:auto; font-size:9px; letter-spacing:.15em; color:#647082; }
@media(min-width:1800px) { .gallery { min-height:100svh; } }
@media(max-width:1000px) and (min-width:741px) { .gallery-intro { width:55%; } .exhibit--design { left:6%; }.exhibit--proposal { left:39%; }.exhibit--si { right:3%; }.exhibit { padding:14px 12px; gap:7px; } }
@media(max-width:740px) {
.gallery { min-height:100svh; height:auto; padding-bottom:0; }.gallery-scene { height:700px; object-position:63% center; opacity:.85; }.gallery::before { background:linear-gradient(#f7f3edf0 0%,#f7f3edcf 30%,transparent 55%,#f5f1e9 76%); }
.gallery-header { padding:24px; }.brand { gap:12px; }.brand b { font-size:28px; }.brand span { font-size:12px; }.gallery-header nav { gap:19px; font-size:12px; }
.gallery-intro { width:auto; margin:36px 24px 0; }.eyebrow { font-size:8px; margin-bottom:18px; }h1 { font-size:clamp(32px,8vw,48px); }.description { font-size:13px; margin:20px 0 24px; }.primary-link { font-size:13px; padding:16px 22px; }
.exhibits { position:relative; display:grid; gap:10px; margin:220px 20px 22px; }.exhibit { position:static; padding:17px 18px; }.exhibit>span:last-child { margin-left:auto; }.exhibit--proposal { order:-1; }.exhibit strong { font-size:15px; }.exhibit small { font-size:11px; }
.gallery-footer { position:relative; flex-wrap:wrap; gap:18px; padding:20px 24px 28px; }.gallery-footer>span { flex-basis:100%; }
}
@media(prefers-reduced-motion:reduce) { .exhibit,.primary-link { transition:none; }.exhibit:hover,.primary-link:hover { transform:none; } }
</style>
