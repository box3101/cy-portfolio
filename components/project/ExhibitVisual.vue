<script setup lang="ts">
defineProps<{ kind: string }>()
</script>
<template>
  <div class="exhibit" :class="'exhibit--' + kind" aria-hidden="true">
    <div class="exhibit__plinth" />
    <div v-if="kind === 'ispark-ui'" class="design-sheet">
      <div class="design-sheet__brand">✦ ispark UI <span>COMPONENT LIBRARY</span></div>
      <div class="design-sheet__section"><small>01 / BUTTONS</small><div class="sample-buttons"><span>Primary</span><span>Secondary</span><span>Outline ↗</span></div></div>
      <div class="design-sheet__section"><small>02 / COLOR SYSTEM</small><div class="swatches"><i /><i /><i /><i /></div></div>
      <div class="design-sheet__type"><b>Aa</b><div>Pretendard<small>가나다라마바사<br />0123456789</small></div></div>
    </div>
    <img v-else class="exhibit__screen" :src="kind === 'proposal-agent' ? '/images/work/proposal-main.png' : '/images/work/team-main.png'" alt="" loading="lazy" />
    <span class="exhibit__label">{{ kind === 'ispark-ui' ? 'DESIGN IN EVERY DETAIL' : kind === 'proposal-agent' ? 'IDEAS INTO INTERFACES' : 'BUILT FOR THE WAY WE WORK' }}</span>
  </div>
</template>
<style scoped>
.exhibit { position:relative; isolation:isolate; display:grid; place-items:center; min-width:0; aspect-ratio:1.35; overflow:hidden; padding:12% 7% 16%; background:#e4e9e9 url('/images/gallery-reference-background.webp') center / cover; perspective:1200px; }
.exhibit::before { content:''; position:absolute; inset:0; z-index:-1; background:linear-gradient(135deg,#faf7f0a6,#e8f0ff20); }
.exhibit__screen { width:100%; max-height:100%; object-fit:contain; border:5px solid #ffffffd9; border-radius:8px; box-shadow:12px 22px 35px #23426933; transform:rotateY(-9deg) rotateZ(-2deg); transition:transform .45s ease; }
.exhibit__plinth { position:absolute; bottom:11%; left:6%; width:88%; height:13%; z-index:-1; transform:skewY(-3deg); border:1px solid #e7f9ff; background:linear-gradient(110deg,#9ec5e999,#f6ffffc9 35%,#82b5e399 70%,#d6f3ffcc); box-shadow:inset 0 9px 0 #effcff80,0 13px 0 #6d9ec94d,0 28px 30px #23426924; }
.exhibit__label { position:absolute; bottom:22px; left:24px; color:#32475d; font-size:8px; letter-spacing:.18em; }
a:hover .exhibit__screen,a:focus-visible .exhibit__screen { transform:rotateY(0) rotateZ(0) translateY(-5px); }
.exhibit--ispark-ui { background-position:70% center; padding:13% 10% 18%; }
.design-sheet { width:100%; padding:24px; background:#ffffffed; color:#182b48; border:1px solid white; box-shadow:10px 20px 35px #23426930; transform:rotateY(-10deg) rotateZ(3deg); border-radius:6px; }
.design-sheet__brand { display:flex; align-items:center; justify-content:space-between; gap:8px; font-size:17px; font-weight:750; }.design-sheet__brand span { font-size:6px; letter-spacing:.06em; color:#67758c; }
.design-sheet__section { margin-top:24px; }.design-sheet small { display:block; font-size:8px; color:#697b91; letter-spacing:.08em; }.sample-buttons { display:flex; gap:7px; margin-top:12px; }.sample-buttons span { border:1px solid #cdd8eb; border-radius:4px; padding:8px; font-size:8px; }.sample-buttons span:first-child { background:#294ccc; color:white; border-color:#294ccc; }.sample-buttons span:nth-child(2) { background:#e9efff; color:#294ccc; }
.swatches { display:flex; gap:8px; margin-top:12px; }.swatches i { width:25%; height:32px; background:#294ccc; border-radius:4px; }.swatches i:nth-child(2) { background:#92b8ef; }.swatches i:nth-child(3) { background:#dce8fa; }.swatches i:nth-child(4) { background:#17283f; }
.design-sheet__type { display:flex; align-items:center; gap:22px; margin-top:24px; padding-top:16px; border-top:1px solid #e2e8ef; }.design-sheet__type>b { font-size:50px; line-height:1; }.design-sheet__type>div { font-size:11px; }.design-sheet__type small { margin-top:6px; line-height:1.7; }
.exhibit--team-agent { aspect-ratio:2.6; padding:5% 12% 7%; background-position:center 65%; }.exhibit--team-agent .exhibit__screen { width:90%; transform:rotateY(5deg) rotateZ(1deg); }.exhibit--team-agent .exhibit__plinth { left:12%; width:76%; }
.exhibit { padding:7% 7% 12%; }
.exhibit--team-agent { padding:7% 7% 12%; }
.exhibit--team-agent .exhibit__screen { width:100%; }
.exhibit--ispark-ui { padding:6% 12% 12%; }
.design-sheet { padding:14px; }
.design-sheet__brand { font-size:13px; }
.design-sheet__section { margin-top:10px; }
.sample-buttons,.swatches { margin-top:7px; }
.sample-buttons span { padding:5px; font-size:7px; }
.swatches i { height:20px; }
.design-sheet__type { margin-top:10px; padding-top:8px; gap:14px; }
.design-sheet__type>b { font-size:30px; }
.design-sheet__type small { margin-top:2px; font-size:7px; }
.exhibit__label { font-size:7px; left:18px; bottom:12px; }
@media(max-width:360px) { .design-sheet__section:nth-child(3) { display:none; } }
</style>
