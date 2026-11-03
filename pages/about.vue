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
  <div class="about-newspaper">
    <div class="about-intro">
    <LayoutPageHeader
      eyebrow="Who I am"
      title="소개·경력"
      description="웹 퍼블리싱에서 출발해, 기획·디자인부터 프론트엔드·백엔드 개발과 배포까지 직접 만드는 AI 빌더입니다."
    />

    <figure class="profile-note">
      <img src="/images/profile/chanyong.jpg" alt="이찬용의 프로필 사진" width="460" height="460" />
      <figcaption><span>BEHIND THE WORK</span> 이찬용 · 프론트엔드 개발자</figcaption>
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
      <section id="career" class="chapter career-section">
        <div class="career-main">
        <div class="chapter-label"><span>02 — Career</span></div>
        <h2 class="chapter-title">주요 경력</h2>
        <ul v-if="careerList.length" class="career">
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
        <p v-else class="career-empty">경력 정보를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.</p>
        </div>
        <aside class="project-notes" aria-labelledby="project-notes-title">
          <h2 id="project-notes-title">PROJECT NOTES</h2>
          <NuxtLink to="/work/proposal-agent" class="project-note">
            <h3>제안서 AI 에이전트 <span aria-hidden="true">↗</span></h3>
            <div class="project-note__art"><img src="/images/work/proposal-main.png" alt="제안서 AI 에이전트 작업 화면" loading="lazy" width="640" height="360" /></div>
            <p>RFP 분석부터 스토리·목차 작성까지, 제안 업무의 흐름을 연결하는 AI 도구를 만들고 있습니다.</p>
          </NuxtLink>
          <NuxtLink to="/projects/ispark-ui" class="project-note">
            <h3>ispark-ui 디자인 시스템 <span aria-hidden="true">↗</span></h3>
            <div class="project-note__art project-note__art--system" aria-hidden="true"><span class="type-specimen">Aa<span>가나다</span></span><span class="component-specimen"><i></i><i></i><i></i><i></i><b>Button ↗</b><em>＋</em></span></div>
            <p>사내 제품 전반에서 사용하는 UI를 설계하고 배포합니다. 일관된 화면과 재사용 가능한 컴포넌트를 만듭니다.</p>
          </NuxtLink>
        </aside>
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
.about-intro { display:grid; grid-template-columns:minmax(0,1fr) 240px; align-items:center; gap:32px; padding-right:32px; margin:28px 0 36px; }
.profile-note { margin:0; }
.profile-note img { display:block; width:100%; height:auto; aspect-ratio:1; object-fit:contain; border:1px solid var(--brand-line); padding:6px; background:var(--brand-surface); }
.profile-note figcaption { display:flex; flex-wrap:wrap; gap:6px 12px; padding-top:10px; font-size:10px; color:var(--brand-ink-muted); }
.profile-note figcaption span { letter-spacing:.12em; }
@media(max-width:1100px) { .about-intro { grid-template-columns:minmax(0,1fr) 200px; gap:16px; } }
@media(max-width:740px) { .about-intro { grid-template-columns:1fr; padding:0; gap:12px; margin:8px 0 28px; }.profile-note { width:200px; margin:0 24px; } }
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

/* A compact editorial spread, with live career data in the main column. */
.about-intro { margin:24px 40px 28px; padding:28px 24px 32px; grid-template-columns:minmax(0,1fr) 128px; gap:40px; border-bottom:1px solid var(--brand-line); }
.about-intro :deep(.ph) { background:transparent; }
.about-intro :deep(.ph__inner) { padding:0; }
.profile-note img { filter:grayscale(1); mix-blend-mode:multiply; }
.profile-note figcaption { font-size:9px; }
.about-newspaper .page { padding:0 40px 48px; }
.chapter { margin-top:36px; }
.chapter-label { margin-bottom:12px; }
.chapter-title { font-family:var(--journal-heading); font-weight:800; font-size:clamp(30px,3.1vw,46px); line-height:1.4; margin-bottom:22px; }
.journey article { padding:14px 18px 12px 0; }
.journey article:not(:last-child) { margin-right:20px; }
.journey h3 { font-family:var(--journal-heading); font-size:24px; font-weight:800; margin:12px 0 8px; }
.journey p { font-size:14px; color:var(--brand-ink); line-height:1.75; margin-bottom:0; word-break:keep-all; }
.career-section { display:grid; grid-template-columns:minmax(0,2.25fr) minmax(240px,1fr); gap:28px; border-top:4px double var(--journal-rule) !important; padding-top:24px; }
.career-main { min-width:0; }
.career { gap:32px; }
.career > li { grid-template-columns:116px minmax(0,1fr); gap:20px; }
.career__body { border-left:1px solid var(--brand-line); padding-left:22px; }
.career__body h3 { font-family:var(--journal-heading); font-size:23px; font-weight:800; }
.career__desc { color:var(--brand-ink); font-size:14px; line-height:1.8; }
.proj__title { font-family:var(--journal-heading); font-size:17px; font-weight:700; line-height:1.6; }
.proj__item { position:relative; border-left:1px solid var(--brand-line); }
.proj__item::before { content:''; position:absolute; left:-2px; top:5px; width:3px; height:18px; background:var(--brand-accent); }
.proj__points { padding-left:0; list-style:none; color:var(--brand-ink); line-height:1.85; }
.project-notes { position:sticky; top:24px; align-self:start; border-left:1px solid var(--journal-rule); padding-left:24px; }
.project-notes > h2 { font-family:var(--journal-serif); font-size:18px; letter-spacing:.13em; margin:0; padding:0 0 10px; border-bottom:1px solid var(--journal-rule); }
.project-note { display:block; padding:18px 0; color:var(--brand-ink); text-decoration:none; border-bottom:1px solid var(--brand-line); }
.project-note:last-child { border-bottom:0; }
.project-note h3 { display:flex; justify-content:space-between; gap:8px; font-family:var(--journal-heading); font-size:22px; font-weight:800; line-height:1.5; margin:0 0 12px; }
.project-note h3 > span { font-family:var(--font-body); font-size:16px; }
.project-note:hover h3 { color:var(--brand-accent); }
.project-note:focus-visible { outline:2px solid var(--brand-accent); outline-offset:5px; }
.project-note p { font-size:14px; line-height:1.85; margin:10px 0 0; word-break:keep-all; }
.project-note__art { position:relative; overflow:hidden; aspect-ratio:1.85; background:color-mix(in srgb,var(--brand-ink) 8%,var(--brand-surface)); }
.project-note__art::after { content:''; position:absolute; inset:0; pointer-events:none; background-image:radial-gradient(var(--brand-ink) .5px,transparent .8px); background-size:3px 3px; opacity:.18; }
.project-note__art img { width:100%; height:100%; object-fit:cover; object-position:top; filter:grayscale(1) contrast(.9); mix-blend-mode:multiply; }
.project-note__art--system { display:flex; align-items:center; justify-content:center; gap:14px; padding:18px; }
.type-specimen { padding:12px; background:var(--brand-surface); border:1px solid var(--brand-line); font:italic 44px var(--journal-serif); transform:rotate(-6deg); box-shadow:3px 4px 0 #00000010; }
.type-specimen span { display:block; font:15px var(--journal-heading); text-align:center; }
.component-specimen { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; flex:1; max-width:126px; }
.component-specimen i { aspect-ratio:1; border-radius:50%; background:var(--brand-ink); opacity:.8; }
.component-specimen i:nth-child(2) { opacity:.5; }.component-specimen i:nth-child(3) { opacity:.3; }.component-specimen i:nth-child(4) { opacity:.1; }
.component-specimen b { grid-column:span 3; border:1px solid var(--brand-line); background:var(--brand-surface); padding:12px 4px; font:12px var(--font-body); text-align:center; }
.component-specimen em { border:1px dashed var(--journal-rule); display:grid; place-items:center; font-style:normal; }
.career-empty { color:var(--brand-ink-muted); line-height:1.8; }
@media(max-width:740px) { .about-intro { padding:20px 4px 24px; } }
@media(max-width:740px) { .project-notes { position:static; } }
.chapter--cta { padding-top:24px; }
.kit-card { min-height:230px; background:transparent; }
@media(max-width:1150px) { .career > li { grid-template-columns:1fr; gap:8px; }.career__body { padding-left:14px; }.career-section { gap:20px; }.project-notes { padding-left:20px; } }
@media(max-width:740px) { .about-intro { margin:20px 20px 24px; grid-template-columns:minmax(0,1fr) 80px; gap:14px; }.profile-note { width:auto; margin:0; }.profile-note figcaption { display:none; }.about-newspaper .page { padding:0 20px 32px; }.chapter-title { font-size:30px; }.journey article { padding:16px 0; }.journey h3 { font-size:22px; }.career-section { grid-template-columns:1fr; }.project-notes { border-left:0; border-top:3px double var(--journal-rule); padding:20px 0 0; }.project-note__art { max-height:240px; }.chapter { margin-top:28px; } }
</style>
