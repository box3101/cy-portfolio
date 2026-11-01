<script setup lang="ts">
definePageMeta({layout:'studio'})
useSeoMeta({title:'CY — 3D 스튜디오 디자인 검토',robots:'noindex,nofollow'})
</script>
<template>
  <main id="studio-main" class="studio-study">
    <ClientOnly><StudioStoryStudio /></ClientOnly>
    <header><NuxtLink to="/" class="brand">CY.</NuxtLink><nav><NuxtLink to="/projects">작업</NuxtLink><NuxtLink to="/about">소개·경력</NuxtLink><NuxtLink to="/contact">연락</NuxtLink></nav></header>
    <section class="intro"><p class="eyebrow">FRONTEND DEVELOPER · AI BUILDER</p><h1>생각을 설계하고,<br>화면으로 만듭니다.</h1><p>기획부터 디자인, 개발까지</p><NuxtLink to="/work/proposal-agent" class="cta">작업 이야기 보기 <span>↗</span></NuxtLink></section>
    <footer><span>01 / 나의 스튜디오</span><span>첫 장면 디자인 검토 · 정지 화면</span></footer>
  </main>
</template>
<style scoped>
.studio-study{position:relative;isolation:isolate;height:100svh;min-height:740px;overflow:hidden;background:#e9e4da;color:#20354b;font-family:Pretendard,sans-serif}
header,footer{position:absolute;z-index:2;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:32px 4.5vw}header{top:0}a{text-decoration:none;color:inherit}.brand{font-size:30px;font-weight:750;letter-spacing:-2px}nav{display:flex;gap:30px;font-size:13px}.intro{position:absolute;z-index:2;left:5.5%;top:24%;pointer-events:none}.intro a{pointer-events:auto}.eyebrow{font-size:9px;letter-spacing:.15em;color:#5f7385;margin-bottom:25px}h1{font-size:clamp(32px,3.3vw,56px);font-weight:650;letter-spacing:-.065em;line-height:1.38;margin:0 0 22px}.intro>p:not(.eyebrow){font-size:16px;color:#4c6479}.cta{display:inline-flex;align-items:center;gap:24px;border:1px solid #73839780;background:#ffffff50;border-radius:28px;padding:14px 23px;font-size:13px;margin-top:20px;backdrop-filter:blur(8px)}.cta:hover{background:#ffffffa0}footer{bottom:0;font-size:10px;color:#486077}footer span:last-child{font-size:10px;opacity:.7}
@media(max-width:740px){.studio-study{min-height:900px}header{padding:25px}nav{gap:18px}.intro{left:7%;top:15%}h1{font-size:36px}.eyebrow{font-size:8px}.intro>p:not(.eyebrow){font-size:14px}footer{padding:24px;font-size:9px}}
</style>
