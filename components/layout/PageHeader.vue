<script setup lang="ts">
/**
 * 내부 페이지 공용 헤더.
 * 히어로와 같은 격자·광원 모티프를 축소해 얹어 톤을 잇는다.
 */
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    description?: string
    /** 본문 콘텐츠 폭에 맞춘다. 좌측 정렬이 어긋나지 않게 하기 위함이다. */
    width?: 'wide' | 'narrow'
  }>(),
  { width: 'wide' },
)
</script>

<template>
  <header class="ph">
    <div class="ph__bg" aria-hidden="true"></div>

    <div class="ph__inner" :class="`ph__inner--${width}`">
      <p v-if="eyebrow" class="ph__eyebrow">{{ eyebrow }}</p>
      <h1 class="ph__title">{{ title }}</h1>
      <p v-if="description" class="ph__desc">{{ description }}</p>
      <slot />
    </div>
  </header>
</template>

<style scoped>
.ph {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--brand-line);
}

/* 히어로와 동일한 격자. 크기만 절반으로 줄여 부차적으로 보이게 한다. */
.ph__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: linear-gradient(
      color-mix(in oklab, var(--brand-line) 70%, transparent) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, color-mix(in oklab, var(--brand-line) 70%, transparent) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(120% 140% at 85% 10%, #000 0%, transparent 65%);
  -webkit-mask-image: radial-gradient(120% 140% at 85% 10%, #000 0%, transparent 65%);
}

.ph__bg::after {
  content: '';
  position: absolute;
  top: -60%;
  right: -5%;
  width: 34vw;
  height: 34vw;
  max-width: 460px;
  max-height: 460px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    color-mix(in oklab, var(--brand-accent) 16%, transparent) 0%,
    transparent 62%
  );
  filter: blur(18px);
}

.ph__inner {
  position: relative;
  margin: 0 auto;
  padding: 64px 24px 40px;
}

.ph__inner--wide {
  max-width: 1180px;
}

.ph__inner--narrow {
  max-width: 800px;
}

.ph__eyebrow {
  margin: 0 0 14px;
  font-family: var(--font-mono);
  font-size: var(--step--1);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--brand-ink-muted);
}

.ph__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 5vw, 3.5rem);
  font-weight: 900;
  letter-spacing: -0.035em;
  line-height: 1;
}

.ph__desc {
  margin: 16px 0 0;
  max-width: 52ch;
  color: var(--brand-ink-muted);
  font-size: var(--step-1);
  line-height: 1.6;
}

@media (max-width: 640px) {
  .ph__inner {
    padding: 44px 20px 32px;
  }
}
</style>
