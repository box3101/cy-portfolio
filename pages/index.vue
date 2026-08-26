<script setup lang="ts">
const { profile } = useProfileStore()
const { featuredList, handleSelectFeatured } = useProjectStore()

await useAsyncData('home/featured', async () => {
  await handleSelectFeatured()
  return true
})

useSeoMeta({
  title: "Cy's Code Canvas — 이찬용 포트폴리오",
  description: () =>
    profile.value?.headline ?? '디자인 시스템을 만들고, 그 시스템으로 제품을 만듭니다.',
  ogTitle: "Cy's Code Canvas",
  ogDescription: () =>
    profile.value?.headline ?? '디자인 시스템을 만들고, 그 시스템으로 제품을 만듭니다.',
  ogType: 'website',
})

// ===== 검증 가능한 숫자 =====
// "열심히 합니다" 대신 면접관이 그 자리에서 확인할 수 있는 값만 둔다.
const proofs = [
  { n: '33', label: '배포한 UI 컴포넌트' },
  { n: '280+', label: 'Storybook 스토리' },
  { n: '3', label: '웹접근성 인증 획득' },
  { n: 'v0.6.12', label: 'npm 퍼블리시 버전' },
]
</script>

<template>
  <div>
    <!-- 화면을 꽉 채우되, 슬라이드 네비게이션이 아니라 일반 스크롤이다. -->
    <section class="hero">
      <div class="hero__bg" aria-hidden="true"></div>

      <div class="hero__inner">
        <p class="hero__eyebrow">Frontend Engineer — Design Systems</p>

        <h1 class="hero__title">
          <span>Cy's</span>
          <span>Code Canvas</span>
        </h1>

        <p class="hero__lead">
          {{ profile?.headline ?? '디자인 시스템을 만들고, 그 시스템으로 제품을 만듭니다.' }}
        </p>

        <div class="hero__cta">
          <NuxtLink to="/projects" class="btn btn--primary">프로젝트 보기</NuxtLink>
          <a
            href="https://box3101.github.io/ispark-ui/"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn--ghost"
          >
            ispark-ui 살펴보기
          </a>
        </div>
      </div>

      <div class="hero__foot">
        <p class="hero__self">
          <span class="hero__dot" aria-hidden="true"></span>
          이 사이트는 @leechanyong/ispark-ui 로 만들었습니다
        </p>
        <span class="hero__scroll" aria-hidden="true">SCROLL</span>
      </div>
    </section>

    <section class="proof-band" aria-label="검증 가능한 지표">
      <dl class="proof">
        <div v-for="p in proofs" :key="p.label" class="proof__item">
          <dt class="proof__n">{{ p.n }}</dt>
          <dd class="proof__l">{{ p.label }}</dd>
        </div>
      </dl>
    </section>

    <section class="featured">
      <div class="featured__head">
        <h2>대표 작업</h2>
        <NuxtLink to="/projects">전체 보기 →</NuxtLink>
      </div>

      <ul v-if="featuredList.length" class="grid">
        <li v-for="p in featuredList" :key="p.id">
          <ProjectCard :project="p" />
        </li>
      </ul>

      <p v-else class="featured__empty">아직 공개된 대표 작업이 없습니다.</p>
    </section>
  </div>
</template>

<style scoped>
/* ============================================================
   히어로 — 뷰포트를 꽉 채운다
   ============================================================ */
.hero {
  position: relative;
  /* 헤더 높이를 뺀 나머지 전부 */
  min-height: calc(100dvh - 61px);
  display: grid;
  grid-template-rows: 1fr auto;
  align-items: center;
  overflow: hidden;
}

.hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: linear-gradient(color-mix(in oklab, var(--brand-line) 70%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in oklab, var(--brand-line) 70%, transparent) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(130% 100% at 82% 18%, #000 5%, transparent 70%);
  -webkit-mask-image: radial-gradient(130% 100% at 82% 18%, #000 5%, transparent 70%);
}

/* accent 광원 — 배경 이미지 없이 깊이를 만든다 */
.hero__bg::after {
  content: '';
  position: absolute;
  top: -18%;
  right: -8%;
  width: 62vw;
  height: 62vw;
  max-width: 900px;
  max-height: 900px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    color-mix(in oklab, var(--brand-accent) 22%, transparent) 0%,
    transparent 62%
  );
  filter: blur(20px);
}

.hero__inner {
  position: relative;
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 40px 24px;
}

.hero__eyebrow {
  margin: 0 0 24px;
  font-family: var(--font-mono);
  font-size: var(--step--1);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--brand-ink-muted);
}

.hero__title {
  margin: 0 0 28px;
  display: grid;
  font-family: var(--font-display);
  /* 화면 폭을 실제로 채우는 크기 */
  font-size: clamp(3rem, 11.5vw, 9.5rem);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 0.86;
  text-wrap: balance;
}

.hero__lead {
  margin: 0 0 36px;
  max-width: 30ch;
  font-size: clamp(1.0625rem, 0.9rem + 0.9vw, 1.625rem);
  font-weight: 300;
  line-height: 1.45;
  color: var(--brand-ink-muted);
}

.hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 11px;
}

.btn {
  font-size: var(--step-0);
  font-weight: 600;
  padding: 13px 26px;
  border-radius: 10px;
  border: 1px solid transparent;
  text-decoration: none;
  transition: transform 0.12s ease, border-color 0.15s;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn--primary {
  background: var(--brand-accent);
  color: var(--brand-accent-ink);
}

.btn--ghost {
  color: var(--brand-ink);
  border-color: var(--brand-line);
  background: color-mix(in oklab, var(--brand-surface) 60%, transparent);
}

.btn--ghost:hover {
  border-color: var(--brand-accent);
}

/* 하단 고정 영역 — 도그푸딩 문구 + 스크롤 유도 */
.hero__foot {
  position: relative;
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.hero__self {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--brand-ink-muted);
  background: color-mix(in oklab, var(--brand-accent) 10%, transparent);
  border: 1px solid color-mix(in oklab, var(--brand-accent) 32%, transparent);
  padding: 6px 12px;
  border-radius: 999px;
}

.hero__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--brand-accent);
}

.hero__scroll {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--brand-ink-muted);
  writing-mode: vertical-rl;
  animation: drift 2.4s ease-in-out infinite;
}

@keyframes drift {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  50% {
    transform: translateY(8px);
    opacity: 1;
  }
}

/* ============================================================
   지표 밴드
   ============================================================ */
.proof-band {
  border-top: 1px solid var(--brand-line);
  border-bottom: 1px solid var(--brand-line);
  background: var(--brand-surface);
}

.proof {
  max-width: 1180px;
  margin: 0 auto;
  padding: 28px 24px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.proof__item {
  display: grid;
  gap: 4px;
}

.proof__n {
  font-family: var(--font-display);
  font-size: var(--step-2);
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.proof__l {
  margin: 0;
  font-size: var(--step--1);
  color: var(--brand-ink-muted);
  line-height: 1.4;
}

/* ============================================================
   대표 작업
   ============================================================ */
.featured {
  max-width: 1180px;
  margin: 0 auto;
  padding: 64px 24px 20px;
}

.featured__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.featured__head h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--step-2);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.featured__head a {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--brand-accent);
  text-decoration: none;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.featured__empty {
  color: var(--brand-ink-muted);
  font-size: var(--step-0);
  padding: 32px 0;
  border-top: 1px solid var(--brand-line);
}

@media (max-width: 860px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .proof {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px 8px;
  }
  .hero__scroll {
    display: none;
  }
}
</style>
