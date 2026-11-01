<script setup lang="ts">
import { portfolioNavigation } from '~/data/navigation'
withDefaults(defineProps<{ review?: boolean }>(), { review: false })
useHead({ link: [
  { rel: 'preload', as: 'image', href: '/images/studio-study/architecture.webp' },
  ...['noto-sans-kr'].map(name => ({ rel: 'preload', as: 'font' as const, type: 'font/woff2', crossorigin: '' as const, href: `/fonts/studio-study/${name}.woff2` })),
] })
</script>

<template>
  <main id="studio-main" class="studio-study">
    <img class="architecture" src="/images/studio-study/architecture.webp" alt="" fetchpriority="high" />
    <ClientOnly><StudioStoryStudio /></ClientOnly>
    <header class="studio-header">
      <NuxtLink to="/" class="brand" aria-label="CY 홈">CY.</NuxtLink>
      <nav aria-label="주요 메뉴"><NuxtLink v-for="item in portfolioNavigation" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink></nav>
    </header>
    <section class="intro" aria-labelledby="studio-title">
      <h1 id="studio-title">작은 불편에서 시작해,<br /><strong class="emphasis">더 나은 경험</strong>을 만듭니다.</h1>
      <p>반복되는 일 속에서 문제를 발견하고,<br />기획과 디자인, 코드로 해결합니다.</p>
      <NuxtLink to="/work/proposal-agent" class="cta">작업 이야기 보기 <span aria-hidden="true">↗</span></NuxtLink>
    </section>
    <footer class="studio-footer"><span><span class="chapter-number">01</span> 나의 스튜디오</span><span v-if="review" class="review-label">첫 화면 디자인 검토</span></footer>
  </main>
</template>

<style>
@font-face{font-family:'Studio Noto Serif';src:url('/fonts/studio-study/noto-serif-kr.woff2') format('woff2');font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'Studio Noto Sans';src:url('/fonts/studio-study/noto-sans-kr.woff2') format('woff2');font-weight:400;font-style:normal;font-display:swap}
</style>

<style scoped>
.studio-study{--studio-font-sans:'Studio Noto Sans','Noto Sans KR',sans-serif;position:relative;isolation:isolate;height:100svh;min-height:540px;overflow:hidden;background:#ece7dd;color:#101a32;font-family:var(--studio-font-sans)}
.architecture{position:absolute;inset:0;width:100%;height:105.263%;object-fit:fill;pointer-events:none}
.studio-header{position:absolute;z-index:3;inset:0 0 auto;display:flex;align-items:center;justify-content:space-between;padding:52px 5.4% 0 6.5%}
a{text-decoration:none;color:inherit}.brand{font:25px Georgia,'Times New Roman',serif;letter-spacing:-1.3px}.studio-header nav{display:flex;gap:30px;font-size:13px}.studio-header nav a{padding:8px 0}.studio-header nav a:hover{text-decoration:underline;text-underline-offset:5px}
.intro{position:absolute;z-index:3;left:8.2%;top:29%;max-width:31%;text-shadow:none}.intro h1{font-family:var(--studio-font-sans);font-size:clamp(28px,2.3vw,45px);font-weight:400;letter-spacing:-.035em;line-height:1.5;margin:0 0 22px;word-break:keep-all}.intro>p{font-family:var(--studio-font-sans);font-size:clamp(14px,1.1vw,18px);letter-spacing:-.015em;margin:0;color:#36465b;line-height:1.8}
.intro .emphasis{color:#245bb9;font-weight:inherit}
.cta{display:inline-flex;align-items:center;justify-content:center;gap:13px;min-height:44px;margin-top:32px;padding:10px 28px;border:1px solid #797d8170;border-radius:25px;background:#fffcf780;font-size:12px;font-weight:500;backdrop-filter:blur(8px);text-shadow:none}.cta:hover{background:#fffdf3d9;border-color:#293b55}.cta span{font-size:15px}.studio-footer{position:absolute;z-index:3;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:space-between;padding:15px 2%;color:#27384a;font-size:10px}.chapter-number{font-family:Georgia,serif;text-decoration:underline;margin-right:12px}.review-label{font-size:9px;letter-spacing:.06em;color:#3a4855}
@media(min-aspect-ratio:2/1){.studio-header{padding-top:49px}.studio-footer{padding:9px 14px;background:#fcfaf4c4}.intro{top:29.5%}}
@media(max-width:759px){.studio-study{min-height:720px;max-height:1100px}.architecture{object-fit:cover;object-position:65%}.studio-header{padding:28px 6% 0}.brand{font-size:25px}.studio-header nav{font-size:12px;gap:20px}.intro{top:17%;left:8%;max-width:85%}.intro h1{font-size:30px;line-height:1.5;margin-bottom:18px}.intro>p{font-size:15px}.cta{margin-top:28px;font-size:12px;min-height:44px}.studio-footer{padding:18px 6%;font-size:10px}.review-label{font-size:8px}}
</style>
