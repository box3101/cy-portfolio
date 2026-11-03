<script setup lang="ts">
import '~/assets/css/journal.css'
import { workStories } from '~/data/workStories'
defineProps<{ active?: string }>()
</script>
<template>
  <div class="shell work-shell journal-shell">
    <LayoutTheHeader />
    <div class="journal-paper special-edition">
      <header class="special-masthead"><span>PROJECT SPECIAL</span><NuxtLink to="/projects" aria-label="프로젝트 목록으로">THE CY JOURNAL.</NuxtLink><span>01 / AI BUILDER</span></header>
      <nav class="project-doors" aria-label="프로젝트 선택"><NuxtLink v-for="story in workStories" :key="story.slug" :to="`/work/${story.slug}`" :aria-current="active === story.slug ? 'page' : undefined" :class="{ active: active === story.slug }">{{ story.name }}</NuxtLink></nav>
      <main id="studio-main" class="work-content"><slot /></main>
      <footer class="work-footer"><span>이찬용 · 프로젝트 기록</span><a href="https://box3101.github.io/ispark-ui/" target="_blank" rel="noopener noreferrer">UI 컴포넌트 · Storybook ↗</a></footer>
    </div>
  </div>
</template>
<style scoped>
.work-shell { min-height:100dvh; padding:1px 0 1px var(--portfolio-rail); color:var(--brand-ink); }
.special-edition { padding:40px 48px 0; }
.special-masthead { display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:24px; border-block:5px double var(--brand-ink); padding:20px 4px; }
.special-masthead > span { font:700 13px var(--journal-serif); white-space:nowrap; }
.special-masthead > span:last-child { text-align:right; }
.special-masthead > a { color:inherit; text-decoration:none; font:700 clamp(32px,4.2vw,68px)/1.1 var(--journal-serif); letter-spacing:-.055em; white-space:nowrap; }
.special-edition .project-doors { display:flex; justify-content:center; flex-wrap:wrap; gap:0; margin:0; padding:0; border-bottom:1px solid var(--journal-rule); }
.special-edition .project-doors a { position:relative; padding:22px 32px; border:0; border-radius:0; background:transparent; color:var(--brand-ink); font-family:var(--journal-heading); font-size:19px; font-weight:700; text-decoration:none; }
.special-edition .project-doors a + a::before { content:'/'; position:absolute; left:0; color:var(--brand-ink-muted); font-weight:400; }
.special-edition .project-doors a.active { color:var(--brand-accent); }
.special-edition .project-doors a.active::after { content:''; position:absolute; height:4px; bottom:0; left:24px; right:24px; background:var(--brand-accent); }
.work-content { padding:28px 0 32px; min-width:0; word-break:keep-all; overflow-wrap:anywhere; }
.work-footer { display:flex; justify-content:space-between; flex-wrap:wrap; gap:12px; padding:20px 0 28px; border-top:3px double var(--journal-rule); font-size:12px; color:var(--brand-ink-muted); }
.work-footer a { color:inherit; text-decoration:none; }
@media(max-width:1150px) { .special-masthead { gap:12px; }.special-masthead > span { font-size:10px; }.special-masthead > a { font-size:42px; }.special-edition { padding:28px 32px 0; } }
@media(max-width:900px) { .work-shell { padding:0 0 1px; } }
@media(max-width:740px) { .special-edition { padding:20px 20px 0; }.special-masthead { grid-template-columns:1fr 1fr; gap:12px; padding:14px 0; }.special-masthead > a { grid-column:1/-1; grid-row:1; text-align:center; font-size:clamp(25px,6.8vw,42px); }.special-masthead > span { font-size:9px; }.special-edition .project-doors { justify-content:space-between; }.special-edition .project-doors a { font-family:var(--font-body); font-size:12px; padding:18px 4px; }.special-edition .project-doors a + a::before { display:none; }.special-edition .project-doors a.active::after { left:0; right:0; }.work-content { padding-top:24px; } }
</style>