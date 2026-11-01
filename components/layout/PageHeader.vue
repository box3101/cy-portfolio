<script setup lang="ts">
/**
 * 내부 페이지 공용 헤더.
 * 메인 갤러리의 크림 배경(#f5f1e9)을 이어받아 같은 세계관으로 진입하는 느낌을 준다.
 */
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    description?: string
    /** 본문 콘텐츠 폭에 맞춘다. */
    width?: 'wide' | 'narrow'
  }>(),
  { width: 'wide' },
)
</script>

<template>
  <header class="ph">
    <!-- 우측 아치 장식 -->
    <div class="ph__bg" aria-hidden="true">
      <div class="ph__arch ph__arch--1"></div>
      <div class="ph__arch ph__arch--2"></div>
    </div>

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
  background: #f5f1e9;
}

/* 하단 페이드 — 크림에서 페이지 배경으로 자연스럽게 */
.ph::after {
  content: '';
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 120px;
  pointer-events: none;
  background: linear-gradient(to bottom, transparent, var(--brand-ground));
  z-index: 0;
}

/* 양 끝이 사라지는 헤어라인 */
.ph::before {
  content: '';
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 1px;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(150, 135, 115, 0.3) 16%,
    rgba(150, 135, 115, 0.3) 70%,
    transparent 100%
  );
}

/* 배경 장식 */
.ph__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* 반투명 아치 — 메인 갤러리 카드의 editorial-art 모티프 */
.ph__arch {
  position: absolute;
  border-radius: 50% 50% 0 0;
  border-style: solid;
  border-color: rgba(180, 160, 130, 0.18);
}

.ph__arch--1 {
  top: -60px; right: 80px;
  width: 200px; height: 290px;
  border-width: 24px;
  transform: rotate(10deg);
}

.ph__arch--2 {
  top: -30px; right: 40px;
  width: 120px; height: 175px;
  border-width: 15px;
  border-color: rgba(180, 160, 130, 0.1);
  transform: rotate(-6deg);
}

.ph__inner {
  position: relative;
  z-index: 1;
  margin: 0 auto;
  padding: 44px 24px 52px;
}

.ph__inner--wide  { max-width: 1180px; }
.ph__inner--narrow { max-width: 800px; }

/* eyebrow — 라인 + 레이블 */
.ph__eyebrow {
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-body);
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #8a7d6e;
}

.ph__eyebrow::before {
  content: '';
  display: inline-block;
  width: 18px;
  height: 1px;
  background: #8a7d6e;
  flex-shrink: 0;
}

.ph__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.875rem, 3.6vw, 2.75rem);
  font-weight: 900;
  letter-spacing: -0.055em;
  line-height: 1;
  color: #202734;
}

.ph__desc {
  margin: 14px 0 0;
  max-width: 52ch;
  color: #596575;
  font-size: var(--step-1);
  line-height: 1.75;
}

@media (max-width: 640px) {
  .ph__inner {
    padding: 32px 20px 28px;
  }

  .ph__arch--1 { right: 20px; width: 150px; height: 210px; }
  .ph__arch--2 { right: -10px; width: 90px; height: 130px; }
}
</style>
