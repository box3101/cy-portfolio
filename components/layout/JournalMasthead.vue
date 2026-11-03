<script setup lang="ts">
import '~/assets/css/journal.css'

const route = useRoute()
const edition = computed(() => {
  if (route.path.startsWith('/about')) return { number: '02', label: '인물 · 소개와 경력' }
  if (route.path.startsWith('/archive')) return { number: '03', label: '기록 · 인증과 자료' }
  if (route.path.startsWith('/contact')) return { number: '04', label: '서신 · 협업 문의' }
  if (route.path.startsWith('/work/') || /^\/projects\/.+/.test(route.path)) return { number: '01', label: '작업 특집 · 프로젝트 이야기' }
  return { number: '01', label: '작업 · 프로젝트' }
})
</script>

<template>
  <div class="journal-masthead">
    <div class="journal-masthead__edition">
      <span>이찬용의 작업신문</span>
      <span>DESIGN · FRONTEND · AI</span>
      <NuxtLink to="/">전시관으로 ↗</NuxtLink>
    </div>
    <div class="journal-masthead__banner">
      <NuxtLink class="journal-masthead__title" to="/projects" aria-label="THE CY JOURNAL — 프로젝트 지면">
        <span class="journal-masthead__the">THE</span> CY JOURNAL<span class="journal-masthead__dot">.</span>
      </NuxtLink>
      <p class="journal-masthead__note">생각을 설계하고, 화면으로 만드는 사람의 기록</p>
    </div>
    <div class="journal-masthead__folio">
      <span>화면에서 시작해, 일하는 방식까지.</span>
      <span>{{ edition.label }} <b> / {{ edition.number }}</b></span>
    </div>
  </div>
</template>

<style scoped>
.journal-masthead { width:100%; min-width:0; margin:0; padding:18px 32px 0; color:var(--brand-ink); }
.journal-masthead__edition,.journal-masthead__folio { display:flex; justify-content:space-between; align-items:center; gap:16px; font-size:10px; letter-spacing:.06em; }
.journal-masthead__edition { padding:0 0 12px; border-bottom:1px solid var(--journal-rule); }
.journal-masthead__edition>span:nth-child(2) { letter-spacing:.2em; color:var(--brand-ink-muted); }
.journal-masthead__edition a { color:inherit; text-decoration:none; min-height:24px; display:flex; align-items:center; }
.journal-masthead__banner { position:relative; isolation:isolate; overflow:hidden; padding:20px 12px 16px; }
.journal-masthead__banner::before { content:''; position:absolute; inset:0; z-index:-1; background:url('/images/journal-background.webp') center 72% / cover no-repeat; opacity:.32; }
.journal-masthead__title { display:block; padding:0; font-family:var(--journal-serif); font-size:clamp(36px,6.4vw,100px); font-weight:700; line-height:1.05; letter-spacing:-.065em; text-align:center; color:inherit; text-decoration:none; white-space:nowrap; }
.journal-masthead__note { margin:10px 0 0; text-align:center; font-size:11px; letter-spacing:.08em; color:var(--brand-ink-muted); }
:global([data-theme='dark']) .journal-masthead__banner::before { opacity:.13; }
.journal-masthead__the { font-size:.35em; letter-spacing:-.025em; vertical-align:middle; }
.journal-masthead__dot { color:var(--brand-accent); }
.journal-masthead__folio { padding:9px 0; border-top:3px double var(--journal-rule); border-bottom:1px solid var(--journal-rule); }
.journal-masthead__folio b { color:var(--brand-accent); font-weight:600; }
@media(max-width:900px) { .journal-masthead { padding:20px 24px 0; }.journal-masthead__title { font-size:clamp(36px,8.6vw,76px); } }
@media(max-width:600px) { .journal-masthead__edition>span:nth-child(2) { display:none; }.journal-masthead__folio { font-size:9px; gap:8px; flex-wrap:wrap; }.journal-masthead__banner { padding:20px 0 16px; }.journal-masthead__title { font-size:clamp(28px,8.6vw,50px); }.journal-masthead__note { font-size:9px; letter-spacing:0; } }
</style>
