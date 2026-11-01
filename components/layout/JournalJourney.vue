<template>
  <aside class="journal-journey" aria-label="작업을 이어 온 세 가지 이야기">
    <NuxtLink to="/projects?space=si" class="journal-journey__chapter">
      <span class="journal-journey__number">01</span>
      <div><span class="journal-journey__label">시작 / PUBLISHING</span><strong>화면의 디테일을 쌓다</strong><p>공공기관과 기업의 웹 화면을 만들며.</p></div>
      <span class="journal-journey__arrow" aria-hidden="true">↗</span>
    </NuxtLink>
    <a href="https://box3101.github.io/ispark-ui/" target="_blank" rel="noopener noreferrer" class="journal-journey__chapter">
      <span class="journal-journey__number">02</span>
      <div><span class="journal-journey__label">확장 / FRONTEND</span><strong>반복을 하나의 시스템으로</strong><p>재사용할 수 있는 UI와 제품을 만들며.</p></div>
      <span class="journal-journey__arrow" aria-hidden="true">↗</span>
    </a>
    <NuxtLink to="/work/proposal-agent" class="journal-journey__chapter">
      <span class="journal-journey__number">03</span>
      <div><span class="journal-journey__label">다음 / AI BUILDER</span><strong>일하는 방식을 설계하다</strong><p>기획부터 개발까지, 업무를 돕는 도구로.</p></div>
      <span class="journal-journey__arrow" aria-hidden="true">↗</span>
    </NuxtLink>
  </aside>
</template>

<style scoped>
.journal-journey { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); border-block:1px solid var(--journal-rule); margin:0 0 30px; padding:18px 0; }
.journal-journey__chapter { display:flex; align-items:flex-start; gap:12px; color:var(--brand-ink); text-decoration:none; padding:0 18px; min-width:0; }
.journal-journey__chapter:first-child { padding-left:0; }.journal-journey__chapter:last-child { padding-right:0; }.journal-journey__chapter+.journal-journey__chapter { border-left:1px solid var(--brand-line); }
.journal-journey__number { font-family:var(--journal-serif); font-size:30px; line-height:1; color:var(--brand-accent); }
.journal-journey__label { display:block; font-size:8px; letter-spacing:.1em; color:var(--brand-ink-muted); margin-bottom:6px; }
.journal-journey strong { display:block; font-size:15px; letter-spacing:-.035em; word-break:keep-all; }
.journal-journey p { margin:6px 0 0; font-size:11px; color:var(--brand-ink-muted); word-break:keep-all; }
.journal-journey__arrow { margin-left:auto; font-size:14px; }.journal-journey__chapter:hover strong { color:var(--brand-accent); }
@media(max-width:1100px) { .journal-journey__number { display:none; }.journal-journey__chapter { padding-inline:12px; }.journal-journey strong { font-size:13px; } }
@media(max-width:600px) { .journal-journey { grid-template-columns:1fr; padding:0; margin-bottom:24px; }.journal-journey__chapter,.journal-journey__chapter:first-child,.journal-journey__chapter:last-child { padding:14px 0; }.journal-journey__chapter+.journal-journey__chapter { border-left:0; border-top:1px solid var(--brand-line); }.journal-journey__number { display:block; font-size:26px; }.journal-journey p { margin-top:3px; } }
</style>
