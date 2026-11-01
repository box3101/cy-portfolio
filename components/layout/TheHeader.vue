<script setup lang="ts">
import { portfolioNavigation } from '~/data/navigation'
const { toggleTheme, restoreTheme } = useTheme()
const route = useRoute()
const isActive = (to: string) => to === '/projects'
  ? ['/projects', '/work', '/agents'].some(path => route.path === path || route.path.startsWith(path + '/'))
  : route.path === to || route.path.startsWith(to + '/')
onMounted(() => restoreTheme())
</script>

<template>
  <header class="header">
    <NuxtLink to="/" class="brand" aria-label="이찬용 홈으로">
      <span class="brand__name">이찬용</span>
      <span class="brand__accent" aria-hidden="true"></span>
    </NuxtLink>
    <p class="nav-caption">CONTENTS <span>지면 안내</span></p>
    <nav class="nav" aria-label="주요 메뉴">
      <NuxtLink v-for="(item, index) in portfolioNavigation" :key="item.to" :to="item.to"
        class="nav__link" :class="{ 'is-active': isActive(item.to) }"
        :aria-current="isActive(item.to) ? 'page' : undefined">
        <span class="nav__number" aria-hidden="true">0{{ index + 1 }}</span><span>{{ item.label }}</span>
      </NuxtLink>
    </nav>
    <div class="header__bottom">
      <a href="https://github.com/box3101" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
      <button type="button" class="theme-button" aria-label="테마 전환" @click="toggleTheme"><span aria-hidden="true">◐</span></button>
    </div>
  </header>
</template>

<style scoped>
.header { position:fixed; inset:0 auto 0 0; z-index:50; width:var(--portfolio-rail, 210px); padding:36px 28px 24px; display:flex; flex-direction:column; background:var(--brand-ground); border-right:1px solid var(--brand-line); }
.brand { display:inline-flex; align-items:baseline; gap:8px; align-self:flex-start; width:fit-content; color:var(--brand-ink); text-decoration:none; }
.brand__name { font-size:30px; font-weight:700; letter-spacing:-.045em; line-height:1.2; white-space:nowrap; }
.brand__accent { flex:none; width:7px; height:7px; background:var(--brand-accent); }
.brand:focus-visible { outline:2px solid var(--brand-accent); outline-offset:6px; border-radius:2px; }
.nav-caption { display:flex; justify-content:space-between; gap:8px; margin:60px 0 14px; padding-bottom:12px; border-bottom:1px solid var(--brand-line); font-size:9px; letter-spacing:.12em; color:var(--brand-ink-muted); }
.nav-caption span { letter-spacing:0; }
.nav { display:flex; flex-direction:column; gap:12px; }
.nav__link { position:relative; display:flex; gap:16px; align-items:center; min-height:44px; color:var(--brand-ink-muted); text-decoration:none; font-size:14px; white-space:nowrap; }
.nav__number { font-size:12px; font-variant-numeric:tabular-nums; opacity:.75; }
.nav__link:hover,.nav__link.is-active { color:var(--brand-accent); }
.nav__link.is-active { font-weight:650; }
.nav__link.is-active::before { content:''; position:absolute; left:-14px; width:5px; height:5px; border-radius:50%; background:currentColor; }
.header__bottom { margin-top:auto; padding-top:18px; border-top:1px solid var(--brand-line); display:flex; align-items:center; justify-content:space-between; gap:12px; }
.header__bottom a { font-size:12px; color:var(--brand-ink); text-decoration:none; }
.header__bottom a span { margin-left:8px; }
.theme-button { width:44px; height:44px; display:grid; place-items:center; border:0; border-radius:50%; background:transparent; color:var(--brand-ink); font-size:20px; cursor:pointer; }
.theme-button:hover { background:var(--brand-surface); }
@media(max-width:900px) {
  .header { position:relative; width:100%; padding:20px 24px 12px; display:grid; grid-template-columns:1fr auto; gap:18px; border-right:0; border-bottom:1px solid var(--brand-line); }
  .brand { align-self:center; gap:6px; }.brand__name { font-size:26px; }.brand__accent { width:6px; height:6px; }
  .header__bottom { margin:0; padding:0; border:0; }.header__bottom a { display:none; }
  .nav-caption { display:none; }
  .nav { grid-column:1 / -1; grid-row:2; flex-direction:row; justify-content:space-between; gap:12px; margin:0; overflow-x:auto; }
  .nav__link { font-size:12px; gap:6px; min-height:40px; }.nav__number { font-size:10px; }.nav__link.is-active::before { display:none; }.nav__link.is-active { box-shadow:inset 0 -2px currentColor; }
}
@media(max-height:580px) and (min-width:901px) { .header { overflow-y:auto; }.nav { margin-top:24px; }.header__bottom { margin-top:24px; } }
</style>
