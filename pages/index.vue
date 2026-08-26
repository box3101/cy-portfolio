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
    <NuxtLink to="/about" class="side side--left" aria-label="소개 보기">About</NuxtLink>
    <NuxtLink to="/contact" class="side side--right" aria-label="연락처 보기">contact</NuxtLink>

    <div class="hero__center">
      <h1 class="hero__title">Cy's Code Canvas</h1>

      <p class="hero__script">Creative Web Publisher &amp; FrontEnd</p>

      <p class="hero__links">
        <NuxtLink to="/about"><span>Skill Inventory</span></NuxtLink>
        <NuxtLink to="/projects"><span>portfolio</span></NuxtLink>
      </p>
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
.hero__center {
  position: absolute;
  width: 100%;
  left: 0;
  top: 50%;
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

.hero__script {
  margin: 0 0 44px;
  font-family: 'Dancing Script', cursive;
  letter-spacing: 1px;
  color: #866baf;
  font-size: 26px;
  line-height: 1;
  font-weight: 700;
}

.hero__links {
  margin: 0;
  font-size: 15px;
  line-height: 20px;
  font-weight: 500;
  color: #fff;
  letter-spacing: 1px;
}

.hero__links a {
  color: #fff;
  text-decoration: none;
}

.hero__links span {
  margin: 0 15px;
  position: relative;
  display: inline-block;
  cursor: pointer;
  padding-bottom: 35px;
}

/* 아래 화살표 — 호버 시 나타난다 */
.hero__links span::before {
  position: absolute;
  content: '';
  bottom: 10px;
  left: 50%;
  height: 30px;
  width: 30px;
  margin-left: -15px;
  background: url('/icons/arrow-down.svg') no-repeat center / 30px 30px;
  opacity: 0.45;
  transition: all 200ms linear;
}

.hero__links span:hover::before {
  opacity: 1;
  bottom: 5px;
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
  .hero__script {
    font-size: 20px;
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
