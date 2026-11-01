<script setup lang="ts">
withDefaults(defineProps<{ eyebrow?: string; title: string; description?: string; width?: 'wide' | 'narrow' }>(), { width: 'wide' })
</script>
<template>
  <header class="ph">
    <div class="ph__inner" :class="'ph__inner--' + width">
      <p v-if="eyebrow" class="ph__eyebrow">{{ eyebrow }}</p>
      <h1 class="ph__title">{{ title }}</h1>
      <p v-if="description" class="ph__desc">{{ description }}</p>
      <slot />
    </div>
  </header>
</template>
<style scoped>
.ph { background:var(--brand-ground); }
.ph__inner { margin:0 auto; padding:48px 32px 24px; }
.ph__inner--wide { max-width:1400px; }.ph__inner--narrow { max-width:800px; }
.ph__eyebrow { margin:0 0 14px; font-size:10px; letter-spacing:.16em; text-transform:uppercase; color:var(--brand-ink-muted); }
.ph__title { margin:0; font-family:var(--font-display); font-size:clamp(36px,4.5vw,68px); font-weight:850; letter-spacing:-.06em; line-height:1.15; color:var(--brand-ink); word-break:keep-all; }
.ph__desc { margin:18px 0 0; max-width:60ch; font-size:var(--step-1); color:var(--brand-ink-muted); line-height:1.75; word-break:keep-all; }
@media(max-width:900px) { .ph__inner { padding:32px 24px 20px; } }
</style>
