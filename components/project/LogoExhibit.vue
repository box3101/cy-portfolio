<script setup lang="ts">
defineProps<{ src: string; title: string; slug: string }>()

const palettes: Record<string, string> = {
  'sgate-okr-solution': '#a3b8cd',
  'incheon-city': '#8ab6d8',
  'samsung-sdi-gsop': '#98b4e7',
  'korean-bank-evaluation': '#a9b9cb',
  'yeonsu-library-website': '#a1c4b8',
  'incheon-jung-gu-edu': '#9ebfc5',
  'g4b-business-support': '#9ebcdb',
  'ict-ksa-system': '#9eabc9',
}
const logoScales: Record<string, number> = {
  'korean-bank-evaluation': 1.9,
  'incheon-jung-gu-edu': 1.25,
  'incheon-city': 1.15,
  'samsung-sdi-gsop': 1.1,
}
</script>

<template>
  <div class="logo-exhibit" :class="{ 'logo-exhibit--screen': slug === 'taskflow' }" :style="{ '--glass-tint': palettes[slug] || '#a5bce0', '--logo-scale': logoScales[slug] || 1 }">
    <div class="logo-exhibit__arch" aria-hidden="true" />
    <div class="logo-exhibit__floor" aria-hidden="true" />
    <div class="logo-exhibit__plinth" aria-hidden="true" />
    <div class="logo-exhibit__plaque">
      <img :src="src" :alt="title" loading="lazy" />
    </div>
    <span class="logo-exhibit__label" aria-hidden="true">SELECTED WORK / PROJECT ARCHIVE</span>
    <span class="logo-exhibit__arrow" aria-hidden="true">↗</span>
  </div>
</template>

<style scoped>
.logo-exhibit {
  position:absolute; inset:0; isolation:isolate; overflow:hidden;
  background:radial-gradient(ellipse at 18% 0%,#fffdf9 0%,transparent 58%),linear-gradient(125deg,#eae6df,#f8f6f1 53%,#e4e9ec);
  perspective:1000px;
}
.logo-exhibit::before {
  content:''; position:absolute; inset:0;
  background:linear-gradient(118deg,transparent 22%,#ffffffb3 22.5%,#ffffffb3 35%,transparent 35.5%,transparent 42%,#ffffff80 42.5%,#ffffff80 47%,transparent 47.5%);
}
.logo-exhibit__arch {
  position:absolute; width:58%; height:145%; top:-30%; right:-12%;
  border:24px solid #ffffff6b; border-radius:50% 50% 0 0;
  box-shadow:inset 8px 7px 22px #a9a69e14,10px 12px 30px #b7b1a018;
  transform:rotate(-12deg);
}
.logo-exhibit__floor {
  position:absolute; inset:73% 0 0;
  border-top:1px solid #ffffffcf;
  background:linear-gradient(175deg,#e6e3dd55,#fcfbf899);
}
.logo-exhibit__plinth {
  position:absolute; left:13%; bottom:17%; width:74%; height:12%;
  background:linear-gradient(110deg,color-mix(in srgb,var(--glass-tint) 65%,transparent),#effaffcc 47%,color-mix(in srgb,var(--glass-tint) 80%,transparent));
  border:1px solid #f6fdff; transform:skewY(-2deg);
  box-shadow:inset 0 5px 0 #f9ffff8c,0 7px 0 color-mix(in srgb,var(--glass-tint) 48%,transparent),0 20px 22px #30465b21;
}
.logo-exhibit__plaque {
  position:absolute; inset:17% 19% 27%; display:grid; place-items:center;
  overflow:hidden; background:#fff; border:1px solid #fffffff2; border-radius:5px;
  box-shadow:7px 14px 24px #3548581f,inset 0 0 0 4px #f8fafb;
  transform:rotateY(-9deg) rotateZ(-2deg);
  transition:transform .3s ease;
}
.logo-exhibit__plaque img { position:absolute; top:50%; left:50%; width:76%; height:66%; object-fit:contain; transform:translate(-50%,-50%) scale(var(--logo-scale)); }
.logo-exhibit--screen .logo-exhibit__plaque { inset:12% 9% 25%; }
.logo-exhibit--screen .logo-exhibit__plaque img { width:100%; height:100%; object-fit:contain; }
.logo-exhibit__label { position:absolute; bottom:7%; left:6%; font-size:7px; letter-spacing:.14em; color:#536574; }
.logo-exhibit__arrow { position:absolute; bottom:5%; right:6%; color:#536574; font-size:17px; }
@media(hover:hover) { .logo-exhibit:hover .logo-exhibit__plaque { transform:rotateY(0) rotateZ(0) translateY(-3px); } }
@media(prefers-reduced-motion:reduce) { .logo-exhibit__plaque { transition:none; } }
</style>
