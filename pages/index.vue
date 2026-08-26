<script setup lang="ts">
const { profile } = useProfileStore()

useSeoMeta({
  title: "Cy's Code Canvas",
  description: () =>
    profile.value?.headline ?? 'Creative Web Publisher & FrontEnd — 이찬용 포트폴리오',
  ogTitle: "Cy's Code Canvas",
  ogDescription: () =>
    profile.value?.headline ?? 'Creative Web Publisher & FrontEnd — 이찬용 포트폴리오',
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
      <h1 class="hero__title enter-drop">Cy's Code Canvas</h1>

      <p class="hero__script enter-rise enter-d1">Creative Web Publisher &amp; FrontEnd</p>

      <!--
        주된 행동은 Portfolio 하나다. Skill Inventory 는 about 의 기술 섹션 앵커로
        보내 About 사이드 링크와 목적지가 겹치지 않게 한다.
      -->
      <div class="hero__actions enter-rise enter-d2">
        <NuxtLink to="/projects" class="hero__cta">Portfolio</NuxtLink>
        <NuxtLink to="/about#skills" class="hero__link">Skill Inventory</NuxtLink>
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
  display: block;
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
/*
  좌우 세로 링크는 50% 에 그대로 두고 중앙 블록만 44% 로 올린다.
  넷이 한 축에 모이면 완전 대칭이 되어 위계가 사라진다.
*/
.hero__center {
  position: absolute;
  width: 100%;
  left: 0;
  top: 44%;
  transform: translateY(-50%);
  text-align: center;
  padding: 0 24px;
  z-index: 2;
}

.hero__title {
  margin: 0 0 40px;
  font-family: 'Poppins', var(--font-body);
  color: #fff;
  font-size: clamp(2rem, 5vw, 5rem);
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.01em;
}

/*
  타이틀이 기하학 산세리프(Poppins 900)라 태그라인은 등폭으로 역할을 나눈다.
  제목이 주연이므로 이 줄은 작게 두고, 대문자에는 넓은 자간을 준다.
*/
.hero__script {
  margin: 0 0 44px;
  font-family: 'JetBrains Mono', var(--font-mono), monospace;
  font-weight: 500;
  font-size: 13px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
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
  padding: 13px 30px;
  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 999px;
  color: #fff;
  font-family: 'Poppins', var(--font-body);
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
  font-family: 'Poppins', var(--font-body);
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
  font-family: 'Poppins', var(--font-body);
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
    font-size: 11px;
    letter-spacing: 0.22em;
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
