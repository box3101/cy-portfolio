<script setup lang="ts">
const { profile } = useProfileStore()

useSeoMeta({
  title: "Cy's Code Canvas",
  description: () =>
    profile.value?.headline ?? 'Chanyong Lee — Frontend & Web Publishing',
  ogTitle: "Cy's Code Canvas",
  ogDescription: () =>
    profile.value?.headline ?? 'Chanyong Lee — Frontend & Web Publishing',
  ogType: 'website',
})

// 히어로는 뷰포트를 통째로 쓴다. 레이아웃의 헤더·푸터를 숨긴다.
definePageMeta({ layout: 'hero' })
</script>

<template>
  <section class="hero">
    <!-- 배경 영상. 원본 사이트와 동일한 소스를 쓴다. -->
    <video class="hero__video" autoplay loop muted playsinline preload="metadata" aria-hidden="true">
      <source src="/video/main.mp4" type="video/mp4" />
    </video>

    <!-- 좌우 세로 링크. 원본의 슬라이드 전환 대신 실제 라우트로 이동한다. -->
    <NuxtLink to="/about" class="side side--left enter-fade enter-d3" aria-label="소개 보기">About</NuxtLink>
    <NuxtLink to="/contact" class="side side--right enter-fade enter-d3" aria-label="연락처 보기">Contact</NuxtLink>

    <div class="hero__center">
      <!--
        소유격 "Cy's"를 한 덩어리로 강조한다. Cy 만 칠하면 뒤따르는
        아포스트로피가 흰색으로 남아 글자가 잘린 것처럼 보인다.
      -->
      <h1 class="hero__title enter-drop"><span class="hero__title-me">Cy's</span> Code Canvas</h1>

      <!--
        좁은 화면에서 두 줄이 될 때 이름 중간이 끊기지 않도록 각 덩어리는
        &nbsp;로 묶는다. 줄바꿈은 대시 뒤의 일반 공백에서만 일어난다.
      -->
      <p class="hero__script enter-rise enter-d1">Chanyong&nbsp;Lee&nbsp;&mdash; Frontend&nbsp;&amp;&nbsp;Web&nbsp;Publishing</p>

      <!--
        주된 행동은 Portfolio 하나다. Skills 는 about 의 기술 섹션 앵커로
        보내 About 사이드 링크와 목적지가 겹치지 않게 한다.
      -->
      <div class="hero__actions enter-rise enter-d2">
        <NuxtLink to="/projects" class="hero__cta">Portfolio</NuxtLink>
        <NuxtLink to="/about#skills" class="hero__link">Skills</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ============================================================
   히어로 — 원본 사이트 재현
   ============================================================ */
.hero {
  position: relative;
  width: 100%;
  min-height: 100dvh;
  /*
    중앙정렬을 transform 이 아니라 레이아웃(flex)으로 한다.
    전에는 .hero__center 가 top:50% + translateY(-50%) 였는데,
    콘텐츠 높이가 소수(223.09px)라 -50% 가 -111.547px 이 되어
    하위 요소 전체가 픽셀 경계에 걸쳤다. DPR 1 에서 CTA 의 1px
    테두리가 곡선 구간부터 갉히던 원인이다.
    transform 은 픽셀 스냅을 받지 않지만 레이아웃 위치는 받는다.
  */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-size: cover;
  background-position: center;
}

.hero__video {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translateX(-50%) translateY(-50%);
  object-fit: cover;
  z-index: 0;
}

/* 영상 위 검은 오버레이 — 텍스트 대비 확보 */
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

/*
  주의: `.hero > *` 같은 넓은 규칙으로 position을 주면
  명시도(0,2,0)가 .hero__center(0,1,0)를 이겨 absolute 중앙정렬이 깨진다.
  요소별로 명시한다.
*/

/* ===== 중앙 콘텐츠 ===== */
.hero__center {
  position: relative;
  width: 100%;
  text-align: center;
  padding: 0 24px;
  z-index: 2;
}

.hero__title {
  margin: 0 0 40px;
  font-family: var(--font-display);
  color: #fff;
  font-size: clamp(2rem, 5vw, 5rem);
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.03em;
}

/*
  히어로에서 브랜드 액센트가 등장하는 유일한 자리다.
  내부 페이지가 같은 핑크를 쓰므로 여기서 한 번 눌러줘야 톤이 이어진다.
  영상 위라 대비가 흔들릴 수 있어 옅은 그림자로 색을 붙잡는다.
*/
.hero__title-me {
  color: var(--brand-accent);
  text-shadow: 0 2px 24px rgba(var(--brand-accent-rgb), 0.35);
}

/*
  타이틀이 Pretendard 900이라 태그라인은 등폭으로 역할을 나눈다.
  제목이 주연이므로 이 줄은 작게 두고, 대문자에는 넓은 자간을 준다.
*/
.hero__script {
  margin: 0 0 44px;
  font-family: var(--font-body);
  font-weight: 500;
  /* 자간이 넓어 실제 폭은 크게 늘어난다. 자간을 조금 줄여 폭을 상쇄한다. */
  font-size: 15px;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.6;
  text-wrap: balance;
}

/* ===== 행동 =====
  아래 화살표(∨)를 쓰지 않는다. 히어로는 100dvh 라 스크롤할 것이 없는데
  ∨ 는 "아래로 더 있음"을 뜻해 실제 동작(라우트 이동)과 어긋난다.
  방향을 뜻하는 → 만 CTA 안에 둔다.
*/
.hero__actions {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px 28px;
}

.hero__cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  /* 세로 패딩 대신 정수 height. 위아래 테두리가 같은 픽셀 위상에 놓인다. */
  height: 52px;
  padding: 0 30px;
  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 999px;
  color: #fff;
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-decoration: none;
  transition: background-color 200ms ease-out, color 200ms ease-out;
}

.hero__cta::after {
  content: '→';
  transition: transform 200ms ease-out;
}

.hero__cta:hover {
  background-color: #fff;
  color: #14151c;
}

.hero__cta:hover::after {
  transform: translateX(4px);
}

.hero__link {
  color: rgba(255, 255, 255, 0.72);
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-decoration: none;
  padding-bottom: 2px;
  border-bottom: 1px solid transparent;
  transition: color 200ms ease-out, border-color 200ms ease-out;
}

.hero__link:hover {
  color: #fff;
  border-bottom-color: rgba(255, 255, 255, 0.6);
}

.hero__cta:focus-visible,
.hero__link:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 4px;
}

/* ===== 좌우 세로 링크 ===== */
.side {
  position: absolute;
  top: 50%;
  font-family: var(--font-display);
  font-size: 17px;
  line-height: 20px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2px;
  text-decoration: none;
  writing-mode: vertical-lr;
  transition: all 200ms linear;
  z-index: 3;
}

.side--left {
  left: 40px;
  transform: translateY(-50%) rotate(180deg);
}

.side--right {
  right: 40px;
  transform: translateY(-50%) rotate(180deg);
}

.side::before {
  position: absolute;
  content: '';
  top: 50%;
  height: 30px;
  width: 30px;
  margin-top: -15px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 30px 30px;
  opacity: 0.45;
  transition: all 200ms linear;
}

/* rotate(180deg)된 요소라 좌우가 뒤집힌다 */
.side--left::before {
  left: -25px;
  background-image: url('/icons/arrow-right.svg');
}

.side--right::before {
  right: -25px;
  background-image: url('/icons/arrow-left.svg');
}

.side:hover::before {
  opacity: 1;
}

.side--left:hover::before {
  left: -30px;
}

.side--right:hover::before {
  right: -30px;
}

@media (max-width: 640px) {
  .side {
    display: none;
  }
  /* 좁은 화면에서는 넓은 자간이 줄바꿈을 유발하므로 함께 줄인다 */
  .hero__script {
    font-size: 12.5px;
    letter-spacing: 0.14em;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__video {
    display: none;
  }
  .hero {
    background: #1f2029;
  }
}
</style>
