<script setup lang="ts">
import { workStories } from '~/data/workStories'
defineProps<{ active?: string }>()
</script>
<template>
  <div class="work-shell">
    <aside class="work-sidebar">
      <NuxtLink to="/" class="work-brand"><b>CY.</b><span>이찬용<small>FRONTEND DEVELOPER</small></span></NuxtLink>
      <NuxtLink to="/" class="back-link">← 골목으로</NuxtLink>
      <div class="sidebar-heading">AI 에이전트 & 업무 도구</div>
      <nav aria-label="프로젝트 선택">
        <NuxtLink to="/agents" :aria-current="!active ? 'page' : undefined" :class="{ active: !active }">전체 이야기 <span>03</span></NuxtLink>
        <NuxtLink v-for="(story, index) in workStories" :key="story.slug" :to="`/work/${story.slug}`" :aria-current="active === story.slug ? 'page' : undefined" :class="{ active: active === story.slug }"><span class="project-num">0{{ index + 1 }}</span>{{ story.name }}</NuxtLink>
      </nav>
      <div class="sidebar-scene" aria-hidden="true" />
      <div class="sidebar-bottom"><p>화면을 만들다 보니,<br /><span>그 너머</span>도 만들고 싶어졌습니다.</p><NuxtLink to="/about">나의 이야기 ↗</NuxtLink></div>
    </aside>
    <div class="work-body">
      <header class="work-top"><NuxtLink to="/agents">AI 에이전트 & 업무 도구</NuxtLink><nav aria-label="공통 메뉴"><NuxtLink to="/projects">전체 작업</NuxtLink><NuxtLink to="/contact">연락하기 ↗</NuxtLink></nav></header>
      <main id="studio-main" class="work-content"><slot /></main>
      <footer class="work-footer"><span>이찬용의 작업 기록</span><a href="https://github.com/box3101/ispark-ui" target="_blank" rel="noopener noreferrer">Built with ispark-ui ↗<span class="sr-only"> (새 창)</span></a></footer>
    </div>
  </div>
</template>
<style scoped>
.work-shell { min-height: 100dvh; display: grid; grid-template-columns: 260px minmax(0,1fr); }.work-sidebar { position: sticky; top: 0; height: 100dvh; background: #091b30; display: flex; flex-direction: column; overflow: hidden; }.work-brand { color: white; display: flex; gap: 14px; padding: 34px 27px 22px; text-decoration: none; align-items: center; }.work-brand b { font-size: 35px; letter-spacing: -2px; }.work-brand>span { font-size: 14px; }.work-brand small { display: block; font-size: 8px; letter-spacing: .1em; color: #a2b6cc; }.back-link { margin: 0 27px 30px; color: #c7d6e8; font-size: 12px; text-decoration: none; }.sidebar-heading { color: #a9bdd1; font-size: 11px; margin: 0 27px 12px; }.work-sidebar nav { display: grid; gap: 5px; padding: 0 14px; }.work-sidebar nav a { color: #c8d8e8; padding: 12px 14px; border-radius: 7px; display: flex; align-items: center; gap: 13px; text-decoration: none; font-size: 13px; border: 1px solid transparent; }.work-sidebar nav a:first-child span { margin-left: auto; font-size: 10px; }.work-sidebar nav a.active { background: #193d62; border-color: #5685b150; color: white; }.project-num { font-size: 10px; color: #80bce4; }.sidebar-scene { min-height: 100px; flex: 1; margin-top: 30px; background: linear-gradient(#091b3010,#091b30 98%),url('/images/studio-courtyard.webp') center / cover; }.sidebar-bottom { padding: 22px 27px 30px; font-size: 12px; color: #b3c6dc; }.sidebar-bottom p { margin: 0 0 18px; line-height: 1.9; }.sidebar-bottom p span { color: #8dd9f5; }.sidebar-bottom a { color: #dfeafa; text-decoration: none; font-size: 11px; }
.work-body { min-width: 0; display: flex; flex-direction: column; color: #142338; background: #f8f8f5; --color-primary:#2265df; --color-primary-hover:#174cb3; --color-primary-dark:#174cb3; --color-primary-rgb:34,101,223; --color-primary-bg:#edf3ff; --color-background:#f8f8f5; --color-surface:#fff; --color-text-heading:#142338; --color-text-primary:#41526a; --color-text-secondary:#5b6a7e; --color-border:#dce3eb; --color-border-light:#e8edf3; --color-bg-elevated:#fff; --color-text-muted:#66778d; }
.work-top { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e1e6eb; padding: 23px 4vw; font-size: 11px; gap: 20px; }.work-top a { color: #52647a; text-decoration: none; }.work-top nav { display: flex; gap: 25px; }.work-content { word-break: keep-all; overflow-wrap: anywhere; flex: 1; padding: 42px 4vw 60px; width: 100%; max-width: 1350px; margin: 0 auto; }.work-footer { border-top: 1px solid #e1e6eb; padding: 18px 4vw; display: flex; justify-content: space-between; color: #65748a; font-size: 10px; }.work-footer a { color: inherit; text-decoration: none; }.sr-only { position:absolute; width:1px; height:1px; overflow:hidden; clip-path:inset(50%); }
@media(max-width:1050px) { .work-shell { grid-template-columns: 215px minmax(0,1fr); }.work-brand { padding-left: 20px; }.work-content { padding: 32px 25px; } }
@media(max-width:740px) { .work-shell { display:block; }.work-sidebar { height:auto; position:relative; }.work-brand { padding:18px 22px 8px; }.work-brand b { font-size:28px; }.back-link { position:absolute; top:24px; right:22px; margin:0; }.sidebar-heading,.sidebar-scene,.sidebar-bottom { display:none; }.work-sidebar nav { display:flex; overflow-x:auto; padding:12px 15px 16px; }.work-sidebar nav a { flex-shrink:0; padding:9px 11px; font-size:12px; }.work-sidebar nav a:first-child span,.project-num { display:none; }.work-content { padding:30px 20px 45px; }.work-top { padding:16px 20px; font-size:10px; }.work-top nav { gap:15px; } }
</style>
