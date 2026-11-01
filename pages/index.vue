<script setup lang="ts">
import { UiButton } from '@leechanyong/ispark-ui'
import { portfolioNavigation } from '~/data/navigation'
definePageMeta({ layout: 'studio' })
useSeoMeta({ title: '이찬용 — 생각을 설계하고, 화면으로 만듭니다.', description: '프론트엔드 개발자 이찬용의 디자인 시스템, 제안서 AI 에이전트, SI 프로젝트.' })
useHead({ link: [{ rel: 'preload', as: 'image', href: '/images/gallery-reference-background.webp' }] })
</script>
<template>
  <main id="studio-main" class="gallery">
    <img class="gallery-scene" src="/images/gallery-reference-background.webp" alt="햇살이 비치는 밝은 갤러리의 푸른 유리 전시대" fetchpriority="high" />

    <header class="gallery-header">
      <NuxtLink to="/" class="brand" aria-label="이찬용 홈"><b>CY.</b><span>이찬용</span></NuxtLink>
      <nav aria-label="주요 메뉴"><NuxtLink v-for="item in portfolioNavigation" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink></nav>
    </header>
    <section class="gallery-intro">

      <h1>생각을 설계하고,<br />화면으로 만듭니다.</h1>
      <p class="description">프론트엔드 개발자 · AI 빌더</p>
      <UiButton as="a" href="/work/proposal-agent" variant="primary" size="xlg" class="gallery-cta">작업 둘러보기 ↗</UiButton>
    </section>
    <ClientOnly><StudioGalleryWorld /></ClientOnly>
    <footer class="gallery-footer"><span>01 / THE WORK GALLERY</span><NuxtLink to="/work/team-agent">TeamAgent 둘러보기 ↗</NuxtLink><NuxtLink to="/projects">프로젝트 보기 ↗</NuxtLink></footer>
  </main>
</template>
<style scoped>
.gallery { position:relative; isolation:isolate; min-height:760px; height:100svh; overflow:hidden; background:#f5f1e9; color:#202734; --color-primary:#294ccc; --color-primary-hover:#1836a6; --color-primary-dark:#1836a6; --color-primary-rgb:41,76,204; }
.gallery-scene { position:absolute; inset:0; z-index:-2; width:100%; height:100%; object-fit:cover; object-position:center; }
.gallery::before { content:''; position:absolute; inset:0; z-index:-1; background:linear-gradient(90deg,#f7f3ed30,transparent 44%); pointer-events:none; }
.gallery-header { position:relative; z-index:3; display:flex; justify-content:space-between; align-items:center; padding:30px 4vw; }
.brand { display:flex; gap:18px; align-items:center; }.brand b { font-size:32px; letter-spacing:-2px; }.brand span { font-size:14px; }a { color:inherit; text-decoration:none; }.gallery-header nav { display:flex; gap:30px; font-size:13px; }
.gallery-intro { position:relative; z-index:2; margin:9vh 0 0 4vw; width:38%; pointer-events:none; }.gallery-intro :deep(a) { pointer-events:auto; }.eyebrow { font-size:9px; letter-spacing:.16em; color:#647082; margin:0 0 24px; }
h1 { font-size:clamp(32px,3.35vw,60px); letter-spacing:-.06em; line-height:1.3; margin:0; word-break:keep-all; }.description { font-size:14px; line-height:1.85; color:#596575; margin:24px 0 30px; }.gallery-cta { min-height:44px; padding-inline:22px!important; border-radius:30px!important; }
.gallery-footer { position:absolute; z-index:3; bottom:0; left:0; right:0; display:flex; gap:30px; align-items:center; padding:24px 4vw; font-size:11px; background:linear-gradient(transparent,#f5f1e9a0); }.gallery-footer>span { margin-right:auto; font-size:9px; letter-spacing:.15em; color:#647082; }
@media(max-width:740px) { .gallery { height:auto; min-height:100svh; }.gallery-scene { object-position:66% center; }.gallery::before { background:linear-gradient(#f7f3edeb 0%,#f7f3ed99 37%,transparent 70%); }.gallery-header { padding:22px; flex-wrap:wrap; gap:20px; }.brand b { font-size:27px; }.brand span { font-size:12px; }.gallery-header nav { width:100%; gap:16px; justify-content:space-between; font-size:12px; }.gallery-intro { width:auto; margin:28px 24px 0; }h1 { font-size:clamp(31px,8vw,44px); }.eyebrow { font-size:8px; margin-bottom:17px; }.description { font-size:13px; margin:17px 0 20px; }.gallery-footer { position:relative; flex-wrap:wrap; gap:16px; padding:25px 24px; }.gallery-footer>span { flex-basis:100%; } }
</style>
