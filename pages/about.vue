<script setup lang="ts">
import { UiButton, UiBadge } from '@leechanyong/ispark-ui'

const { profile, careerList, careerWithProjects, handleSelectAbout } = useProfileStore()

await useAsyncData('about', async () => {
  await handleSelectAbout()
  return true
}, { getCachedData: () => undefined })

useSeoMeta({
  title: '소개·경력 — 이찬용',
  description: () => profile.value?.headline ?? '이찬용 프론트엔드 개발자 소개',
})

const { archiveList, handleSelectArchiveList } = useArchiveStore()
await useAsyncData('about/credentials', async () => { await handleSelectArchiveList(); return true })

const { categoryCounts, handleSelectCategoryCounts } = useProjectStore()
await useAsyncData('about/project-counts', async () => { await handleSelectCategoryCounts(); return true })
const featuredDocuments = computed(() => [...archiveList.value].sort((a, b) => Number(b.doc_type === '증명서') - Number(a.doc_type === '증명서')).slice(0, 3))
const resumeUrl = computed(() => publicFileUrl('profile', profile.value?.resume_path))

// 스탯 계산
const totalProjects = computed(() =>
  Object.values(categoryCounts.value).reduce((sum, n) => sum + n, 0)
)
const yearsOfExp = computed(() => {
  if (!careerList.value.length) return null
  const earliest = careerList.value.reduce((min, c) => {
    const d = new Date(c.period_start)
    return d < min ? d : min
  }, new Date())
  return new Date().getFullYear() - earliest.getFullYear()
})

</script>

<template>
  <div>
    <div class="about-intro">
    <LayoutPageHeader
      eyebrow="Who I am"
      title="소개·경력"
      description="웹 퍼블리싱으로 시작해 프론트엔드와 업무 도구를 개발하고 있습니다."
    />

    <figure class="studio-note">
      <img src="/images/studio-study/architecture.webp" alt="바다가 보이는 밝은 석재 스튜디오" width="1536" height="1024" />
      <figcaption><span>STUDIO NOTES</span> 생각이 화면이 되는 공간</figcaption>
    </figure>
    </div>

    <div class="page">

      <!-- ── Chapter 01: Story ── -->
      <section class="chapter" aria-label="성장 여정">
        <div class="chapter-label"><span>01 — Story</span></div>
        <h2 class="chapter-title">웹 화면부터 업무 도구까지</h2>
        <div class="journey">
          <article>
            <span class="journey__num">01 / PUBLISHING</span>
            <h3>웹 퍼블리싱</h3>
            <p>퍼블리싱으로 시작해 공공기관과 기업의 웹 화면을 구현했습니다.</p>
          </article>
          <article>
            <span class="journey__num">02 / FRONTEND</span>
            <h3>프론트엔드 개발</h3>
            <p>프론트엔드 개발과 디자인 시스템으로 재사용 가능한 UI와 제품을 만듭니다.</p>
          </article>
          <article>
            <span class="journey__num">03 / AI BUILDER</span>
            <h3>AI 업무 도구</h3>
            <p>모델과 지식을 연결하는 에이전트, 제안 업무를 돕는 도구로 영역을 넓히고 있습니다.</p>
          </article>
        </div>
      </section>

      <!-- ── Chapter 02: Career ── -->
      <section id="career" v-if="careerList.length" v-reveal class="chapter">
        <div class="chapter-label"><span>02 — Career</span></div>
        <h2 class="chapter-title">주요 경력</h2>
        <ul class="career">
          <li v-for="c in careerWithProjects" :key="c.id">
            <div class="career__period">{{ formatPeriod(c.period_start, c.period_end) }}</div>
            <div class="career__body">
              <h3>{{ c.company }}</h3>
              <p class="career__role">{{ c.position }}</p>
              <p v-if="c.description" class="career__desc">{{ c.description }}</p>

              <ol v-if="c.projects.length" class="proj">
                <li v-for="p in c.projects" :key="p.id" class="proj__item">
                  <h4 class="proj__title">{{ p.title }}</h4>
                  <p v-if="p.outcome" class="proj__outcome">{{ p.outcome }}</p>
                  <ul v-if="p.tech_stack.length" class="proj__stack">
                    <li v-for="t in p.tech_stack" :key="t">{{ t }}</li>
                  </ul>
                  <ul v-if="p.highlights.length" class="proj__points">
                    <li v-for="(h, i) in p.highlights" :key="i">{{ h }}</li>
                  </ul>
                </li>
              </ol>
            </div>
          </li>
        </ul>
      </section>

      <!-- ── Chapter 04: Credentials + CTA ── -->
      <section id="credentials" class="chapter chapter--cta" aria-labelledby="cta-title">
        <div class="chapter-label"><span>03 — Documents</span></div>
        <h2 id="cta-title" class="chapter-title">이력서와 관련 자료</h2>
        <div class="career-kit__grid">
          <article class="kit-card kit-card--resume">
            <span class="kit-icon" aria-hidden="true">↗</span>
            <UiBadge variant="primary" size="sm">RESUME</UiBadge>
            <h3>이력서</h3>
            <p>주요 경력과 프로젝트를<br />한 문서로 확인하세요.</p>
            <UiButton v-if="resumeUrl" as="a" :href="resumeUrl" target="_blank" variant="primary" size="xlg">이력서 PDF 열기 ↗</UiButton>
            <p v-else class="kit-note">공개 이력서를 준비하고 있습니다.</p>
          </article>
          <article class="kit-card">
            <span class="kit-icon" aria-hidden="true">01</span>
            <p class="credentials__label">CAREER</p>
            <h3>경력 요약</h3>
            <p>{{ careerList.length ? `등록된 ${careerList.length}개 경력과 담당 프로젝트를 살펴보세요.` : '경력과 담당 프로젝트를 위에서 살펴보세요.' }}</p>
            <UiButton v-if="careerList.length" as="a" href="#career" variant="secondary" size="xlg">경력 살펴보기 ↑</UiButton>
          </article>
          <article class="kit-card">
            <span class="kit-icon" aria-hidden="true">02</span>
            <p class="credentials__label">CREDENTIALS</p>
            <h3>인증·심사 자료</h3>
            <p>웹 접근성 인증서와 심사 결과 등<br />프로젝트 관련 자료입니다.</p>
            <UiButton as="a" href="/archive" variant="secondary" size="xlg">{{ archiveList.length ? `공개 자료 ${archiveList.length}건 보기 →` : '자료실 보기 →' }}</UiButton>
          </article>
        </div>
        <div v-if="featuredDocuments.length" class="document-previews">
          <NuxtLink v-for="doc in featuredDocuments" :key="doc.id" :to="{ path: '/archive', query: { document: doc.id } }" class="document-preview">
            <div class="document-preview__image">
              <img v-if="doc.thumbnail_path" :src="publicFileUrl('thumbnails', doc.thumbnail_path)!" :alt="`${doc.title} 미리보기`" loading="lazy" />
              <span v-else aria-hidden="true">PDF</span>
            </div>
            <div>
              <UiBadge size="xs">{{ doc.doc_type }}</UiBadge>
              <h3>{{ doc.title }}</h3>
              <p v-if="doc.issuer">{{ doc.issuer }}</p>
              <span class="document-open">자료 열기 ↗</span>
            </div>
          </NuxtLink>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
.about-intro { display:grid; grid-template-columns:minmax(0,1fr) minmax(240px,30%); align-items:center; gap:32px; padding-right:32px; margin:20px 0 32px; }
.studio-note { margin:0; }
.studio-note img { display:block; width:100%; height:180px; object-fit:cover; object-position:center 44%; filter:grayscale(1); opacity:.84; }
.studio-note figcaption { display:flex; flex-wrap:wrap; gap:6px 12px; padding-top:9px; font-size:10px; color:var(--brand-ink-muted); }
.studio-note figcaption span { letter-spacing:.12em; }
@media(max-width:1100px) { .about-intro { grid-template-columns:minmax(0,1fr) 240px; gap:16px; }.studio-note img { height:160px; } }
@media(max-width:740px) { .about-intro { grid-template-columns:1fr; padding:0; gap:12px; margin:8px 0 28px; }.studio-note { margin:0 24px; }.studio-note img { height:150px; object-position:center 40%; } }
/* ── 페이지 래퍼 ── */
.page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 24px 80px;
}

/* ── 챕터 공통 ── */
.chapter {
  margin-top: 80px;
}

/* 챕터 레이블: "01 — Story ————" */
.chapter-label {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.chapter-label span {
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--brand-accent);
  white-space: nowrap;
}

.chapter-label::after {
  content: '';
  flex: 1;
  max-width: 72px;
  height: 1px;
  background: var(--brand-line);
}

/* 챕터 제목 */
.chapter-title {
  margin: 0 0 24px;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.2;
}

/* ── 스탯 row ── */
.stats-row {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat__num {
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--brand-ink);
}

.stat__label {
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--brand-ink-muted);
}

.stat + .stat {
  padding-left: 32px;
  border-left: 1px solid var(--brand-line);
}

/* ── Chapter 01: Journey ── */
.journey {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
}

.journey article {
  padding: 28px 28px 28px 0;
  border-top: 2px solid var(--brand-accent);
}

.journey article:not(:last-child) {
  border-right: 1px solid var(--brand-line);
  margin-right: 28px;
}

.journey__num {
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--brand-accent);
}

.journey h3 {
  font-size: clamp(1rem, 1.6vw, 1.2rem);
  letter-spacing: -0.03em;
  margin: 16px 0 10px;
}

.journey p {
  color: var(--brand-ink-muted);
  line-height: 1.9;
  font-size: 14px;
  margin: 0 0 12px;
}

.journey a {
  color: var(--brand-accent);
  font-size: 12px;
  text-decoration: none;
}

@media (max-width: 740px) {
  .journey {
    grid-template-columns: 1fr;
  }
  .journey article:not(:last-child) {
    border-right: none;
    margin-right: 0;
    border-bottom: 1px solid var(--brand-line);
    padding-bottom: 24px;
    margin-bottom: 0;
  }
}

/* ── Chapter 02: Career ── */
#career { scroll-margin-top: 110px; }

.career {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 24px;
}

.career > li {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 20px;
}

.career__period {
  font-family: var(--font-body);
  font-size: var(--step--1);
  color: var(--brand-ink-muted);
  font-variant-numeric: tabular-nums;
  padding-top: 3px;
}

.career__body h3 {
  margin: 0 0 3px;
  font-size: var(--step-1);
  font-weight: 600;
}

.career__role {
  margin: 0 0 8px;
  font-size: var(--step--1);
  color: var(--brand-accent);
}

.career__desc {
  margin: 0;
  max-width: 72ch;
  color: var(--brand-ink-muted);
  line-height: 1.7;
}

.proj {
  list-style: none;
  margin: 18px 0 0;
  padding: 0;
  display: grid;
  gap: 20px;
}

.proj__item {
  padding-left: 14px;
  border-left: 2px solid var(--brand-line);
}

.proj__title {
  margin: 0 0 6px;
  font-size: var(--step-0);
  font-weight: 600;
}

.proj__outcome {
  margin: 0 0 8px;
  font-size: var(--step--1);
  color: var(--brand-accent);
  font-weight: 500;
}

.proj__stack {
  list-style: none;
  margin: 0 0 10px;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.proj__stack li {
  padding: 2px 8px;
  border: 1px solid var(--brand-line);
  border-radius: 999px;
  font-size: var(--step--1);
  color: var(--brand-ink-muted);
  white-space: nowrap;
}

.proj__points {
  margin: 0;
  padding-left: 16px;
  max-width: 72ch;
  display: grid;
  gap: 4px;
  color: var(--brand-ink-muted);
  font-size: var(--step--1);
  line-height: 1.7;
}

.proj__points li::marker {
  color: var(--brand-line);
}

/* ── Chapter 04: Credentials ── */
#credentials { scroll-margin-top: 110px; }

.chapter--cta {
  padding-top: 60px;
  border-top: 1px solid var(--brand-line);
}

.credentials__label { font-size: 10px; letter-spacing: .15em; color: var(--brand-accent); }

.career-kit__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.kit-card {
  position: relative;
  padding: 28px;
  background: var(--brand-surface);
  border: 1px solid var(--brand-line);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 260px;
}

.kit-card--resume {
  background: color-mix(in srgb, var(--brand-accent) 7%, var(--brand-surface));
  border-color: color-mix(in srgb, var(--brand-accent) 25%, var(--brand-line));
}

.kit-icon {
  position: absolute;
  right: 24px;
  top: 22px;
  font-size: 24px;
  color: var(--brand-accent);
  opacity: .6;
}

.kit-card h3 {
  font-size: 23px;
  letter-spacing: -.04em;
  margin: 22px 0 9px;
}

.kit-card p {
  font-size: 14px;
  line-height: 1.8;
  color: var(--brand-ink-muted);
  margin: 0 0 24px;
}

.kit-card :deep(.ui-button),
.kit-card :deep(.ui-btn) {
  margin-top: auto;
}

.kit-card .credentials__label { font-size: 10px; margin: 0; }
.kit-note { font-size: 12px !important; }

.document-previews {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.document-preview {
  display: grid;
  grid-template-columns: 90px minmax(0, 1fr);
  gap: 16px;
  padding: 16px;
  border: 1px solid var(--brand-line);
  border-radius: 12px;
  background: var(--brand-surface);
  color: var(--brand-ink);
  text-decoration: none;
  transition: border-color .2s;
}

.document-preview:hover { border-color: var(--brand-accent); }

.document-preview__image {
  display: grid;
  place-items: center;
  height: 126px;
  background: var(--brand-ground);
  border: 1px solid var(--brand-line);
  border-radius: 5px;
  overflow: hidden;
}

.document-preview img { width: 100%; height: 100%; object-fit: contain; }
.document-preview h3 { font-size: 14px; line-height: 1.5; margin: 8px 0; word-break: keep-all; }
.document-preview p { font-size: 11px; color: var(--brand-ink-muted); margin: 0 0 8px; }
.document-open { font-size: 11px; color: var(--brand-accent); }

/* ── 반응형 ── */
@media (max-width: 960px) {
  .document-previews { grid-template-columns: 1fr; }
  .career-kit__grid { gap: 12px; }
  .kit-card { padding: 22px; }
}

@media (max-width: 640px) {
  .career-kit__grid { grid-template-columns: 1fr; }
  .kit-card { min-height: 0; }
  .career > li { grid-template-columns: 1fr; gap: 6px; }

  .journey { grid-template-columns: 1fr; }
  .journey article:not(:last-child) {
    border-right: none;
    margin-right: 0;
    border-bottom: 1px solid var(--brand-line);
  }
}
</style>
