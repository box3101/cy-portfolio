<script setup lang="ts">
import type { WorkScreen } from '~/data/workScreens'
defineProps<{ screen: WorkScreen; eager?: boolean; hideTitle?: boolean }>()
</script>
<template>
  <figure class="screen-capture">
    <a :href="screen.src" target="_blank" rel="noopener noreferrer" :aria-label="`${screen.title} 원본 크게 보기 (새 창)`" class="screen-link">
      <img :src="screen.src" :alt="screen.alt" :loading="eager ? 'eager' : 'lazy'" decoding="async" />
      <span class="expand">원본 크게 보기 ↗</span>
    </a>
    <figcaption><span v-if="!hideTitle">{{ screen.title }}</span><small>{{ screen.caption || '실제 개발 화면 캡처' }}</small></figcaption>
  </figure>
</template>
<style scoped>
.screen-capture { margin:0; min-width:0; }.screen-link { position:relative; display:block; border:1px solid #dce4ee; border-radius:10px; background:white; overflow:hidden; box-shadow:0 16px 45px #14233808; }.screen-link img { display:block; width:100%; height:auto; }.expand { position:absolute; right:12px; bottom:12px; padding:8px 12px; color:white; background:#142338e8; border-radius:6px; font-size:11px; }.screen-link:hover .expand { background:#2265df; }figcaption { display:flex; justify-content:space-between; gap:15px; margin-top:12px; font-size:12px; color:#4d617b; }small { color:#7c8b9e; font-size:10px; white-space:nowrap; }
@media(max-width:600px) { figcaption { flex-direction:column; gap:4px; }.expand { font-size:10px; padding:6px 9px; } }
</style>
