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
}

/*
  헤더 바닥 처리.
  전에는 border-bottom 1px 실선이었다. 격자와 광원이 overflow:hidden 에
  그대로 잘려서 가로로 딱 끊긴 단면이 생겼고, 그 위에 실선까지 얹혀
  본문과의 경계가 필요 이상으로 딱딱했다.

  ::after 가 바탕색과 같은 색으로 아래로 갈수록 진해지며 배경 레이어만
  녹인다(본문은 .ph__inner 의 z-index 로 그 위에 남는다).
  ::before 는 양 끝이 사라지는 헤어라인이다 — 구획은 남기되 선이
  화면을 가로질러 끊는 느낌은 없앤다.
*/
.ph::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 96px;
  pointer-events: none;
  background: linear-gradient(to bottom, transparent, var(--brand-ground));
}

.ph::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--brand-line) 16%,
    var(--brand-line) 70%,
    transparent 100%
  );
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
  /* ::after 페이드보다 위. 없으면 DOM 순서상 페이드가 제목을 덮는다. */
  z-index: 1;
  margin: 0 auto;
  padding: 40px 24px 28px;
}

.ph__inner--wide {
  max-width: 1180px;
}

.ph__inner--narrow {
  max-width: 800px;
}

.ph__eyebrow {
  margin: 0 0 10px;
  font-family: var(--font-body);
  font-size: var(--step--1);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--brand-ink-muted);
}

.ph__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.875rem, 3.6vw, 2.75rem);
  font-weight: 900;
  letter-spacing: -0.035em;
  line-height: 1;
}

.ph__desc {
  margin: 12px 0 0;
  max-width: 52ch;
  color: var(--brand-ink-muted);
  font-size: var(--step-1);
  line-height: 1.6;
}

@media (max-width: 640px) {
  .ph__inner {
    padding: 32px 20px 24px;
  }
}
</style>
