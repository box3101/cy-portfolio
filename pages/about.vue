<script setup lang="ts">
import { UiProgress, UiButton, UiBadge } from '@leechanyong/ispark-ui'

const { profile, careerList, careerWithProjects, skillList, handleSelectAbout } = useProfileStore()

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
const featuredDocuments = computed(() => [...archiveList.value].sort((a, b) => Number(b.doc_type === '증명서') - Number(a.doc_type === '증명서')).slice(0, 3))
const resumeUrl = computed(() => publicFileUrl('profile', profile.value?.resume_path))
const skillGroups = computed(() => {
  // 라벨은 영문이다. 히어로의 'Skills' 링크가 이 섹션으로 들어오므로
  // 상위 제목(Skills)과 목소리를 맞춘다. 기술 이름 자체도 대부분 영문이다.
  const labels: Record<string, string> = {
    language: '개발 언어',
    framework: '프레임워크',
    tool: '개발 도구',
    design: '디자인',
  }
  const groups: { key: string; label: string; items: typeof skillList.value }[] = []

  for (const key of ['language', 'framework', 'tool', 'design']) {
    const items = skillList.value.filter((s) => s.category === key)
    if (items.length) groups.push({ key, label: labels[key], items })
  }
  return groups
})
</script>

<template>
  <div>
    <LayoutPageHeader
      eyebrow="Who I am"
      title="소개·경력"
      description="화면을 만들다 보니, 그 너머도 만들고 싶어졌습니다."
    />

    <div class="page">
      <section id="credentials" class="career-kit" aria-labelledby="career-kit-title">
        <div class="kit-heading"><div><p class="credentials__label">경력 자료 모아보기</p><h2 id="career-kit-title">경력과 결과를 한눈에.</h2></div><UiButton as="a" href="/archive" variant="secondary" size="xlg">자료실 보기 →</UiButton></div>
        <div class="career-kit__grid">
          <article class="kit-card kit-card--resume"><span class="kit-icon" aria-hidden="true">↗</span><UiBadge variant="primary" size="sm">RESUME</UiBadge><h3>이력서</h3><p>주요 경력과 프로젝트를<br />한 문서로 확인하세요.</p><UiButton v-if="resumeUrl" as="a" :href="resumeUrl" target="_blank" variant="primary" size="xlg">이력서 PDF 열기 ↗</UiButton><p v-else class="kit-note">공개 이력서를 준비하고 있습니다.</p></article>
          <article class="kit-card"><span class="kit-icon" aria-hidden="true">01</span><p class="credentials__label">CAREER</p><h3>경력 요약</h3><p>{{ careerList.length ? `등록된 ${careerList.length}개 경력과 담당 프로젝트를 살펴보세요.` : '경력과 담당 프로젝트를 아래에서 살펴보세요.' }}</p><UiButton v-if="careerList.length" as="a" href="#career" variant="secondary" size="xlg">경력 살펴보기 ↓</UiButton></article>
          <article class="kit-card"><span class="kit-icon" aria-hidden="true">02</span><p class="credentials__label">CREDENTIALS</p><h3>인증·심사 자료</h3><p>웹 접근성 인증서와 심사 결과 등<br />프로젝트 관련 자료입니다.</p><UiButton as="a" href="/archive" variant="secondary" size="xlg">{{ archiveList.length ? `공개 자료 ${archiveList.length}건 보기 →` : '자료실 보기 →' }}</UiButton></article>
        </div>
        <div v-if="featuredDocuments.length" class="document-previews">
          <NuxtLink v-for="doc in featuredDocuments" :key="doc.id" :to="{ path: '/archive', query: { document: doc.id } }" class="document-preview">
            <div class="document-preview__image"><img v-if="doc.thumbnail_path" :src="publicFileUrl('thumbnails', doc.thumbnail_path)!" :alt="`${doc.title} 미리보기`" loading="lazy" /><span v-else aria-hidden="true">PDF</span></div>
            <div><UiBadge size="xs">{{ doc.doc_type }}</UiBadge><h3>{{ doc.title }}</h3><p v-if="doc.issuer">{{ doc.issuer }}</p><span class="document-open">자료 열기 ↗</span></div>
          </NuxtLink>
        </div>
      </section>
      <section class="journey" aria-label="만드는 영역의 확장">
        <article><span>01 / PUBLISHING</span><h2>화면의 디테일을 쌓다.</h2><p>퍼블리싱으로 시작해 공공기관과 기업의 웹 화면을 구현했습니다.</p></article>
        <article><span>02 / FRONTEND</span><h2>제품의 동작을 구현하다.</h2><p>프론트엔드 개발과 디자인 시스템으로 재사용 가능한 UI와 제품을 만듭니다.</p></article>
        <article><span>03 / AI BUILDER</span><h2>업무를 돕는 도구로 넓히다.</h2><p>모델과 지식을 연결하는 에이전트, 제안 업무를 돕는 도구로 영역을 넓히고 있습니다.</p><NuxtLink to="/agents">프로젝트 살펴보기 →</NuxtLink></article>
      </section>
      <p v-if="profile?.bio" v-reveal class="page__bio">{{ profile.bio }}</p>

      <section id="career" v-if="careerList.length" v-reveal class="block">
      <h2>주요 경력</h2>
      <ul class="career">
        <li v-for="c in careerWithProjects" :key="c.id">
          <div class="career__period">{{ formatPeriod(c.period_start, c.period_end) }}</div>
          <div class="career__body">
            <h3>{{ c.company }}</h3>
            <p class="career__role">{{ c.position }}</p>
            <p v-if="c.description" class="career__desc">{{ c.description }}</p>

            <!-- 회사 안의 프로젝트. 없으면 통째로 렌더하지 않는다. -->
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

    <!-- 히어로의 'Skills' 링크가 이 앵커로 들어온다 -->
    <section id="skills" v-if="skillGroups.length" v-reveal="{ delay: 80 }" class="block">
      <h2>사용 기술</h2>
      <div class="skills">
        <div v-for="g in skillGroups" :key="g.key" class="skills__group">
          <h3>{{ g.label }}</h3>
          <ul>
            <li v-for="s in g.items" :key="s.id">
              <span class="skills__name">{{ s.name }}</span>
              <!--
                label prop은 화면에 보이는 라벨이다. 이름은 왼쪽 칸에 이미 있으므로
                중복 노출을 피하고 스크린리더용 설명만 aria-label로 준다.
              -->
              <UiProgress
                class="skills__bar"
                :value="s.level"
                :max="5"
                size="sm"
                :aria-label="`${s.name} 숙련도 5점 만점에 ${s.level}점`"
              />
            </li>
          </ul>
        </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
#career,#credentials,#skills { scroll-margin-top:110px; }
.career-kit { margin-bottom:48px; }.kit-heading { display:flex; align-items:center; justify-content:space-between; gap:20px; margin-bottom:24px; }.kit-heading h2 { font-size:clamp(24px,3vw,32px); letter-spacing:-.04em; margin:0; }.kit-heading .credentials__label { margin:0 0 8px; }
.career-kit__grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:16px; }.kit-card { position:relative; padding:28px; background:var(--brand-surface); border:1px solid var(--brand-line); border-radius:16px; display:flex; flex-direction:column; align-items:flex-start; min-height:260px; }.kit-card--resume { background:color-mix(in srgb,var(--brand-accent) 7%,var(--brand-surface)); border-color:color-mix(in srgb,var(--brand-accent) 25%,var(--brand-line)); }.kit-icon { position:absolute; right:24px; top:22px; font-size:24px; color:var(--brand-accent); opacity:.6; }.kit-card h3 { font-size:23px; letter-spacing:-.04em; margin:22px 0 9px; }.kit-card p { font-size:14px; line-height:1.8; color:var(--brand-ink-muted); margin:0 0 24px; }.kit-card :deep(.ui-button),.kit-card :deep(.ui-btn) { margin-top:auto; }.kit-card .credentials__label { font-size:10px; margin:0; }.kit-note { font-size:12px!important; }
.document-previews { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:16px; margin-top:20px; }.document-preview { display:grid; grid-template-columns:90px minmax(0,1fr); gap:16px; padding:16px; border:1px solid var(--brand-line); border-radius:12px; background:var(--brand-surface); color:var(--brand-ink); text-decoration:none; transition:border-color .2s; }.document-preview:hover { border-color:var(--brand-accent); }.document-preview__image { display:grid; place-items:center; height:126px; background:var(--brand-ground); border:1px solid var(--brand-line); border-radius:5px; overflow:hidden; }.document-preview img { width:100%; height:100%; object-fit:contain; }.document-preview h3 { font-size:14px; line-height:1.5; margin:8px 0; word-break:keep-all; }.document-preview p { font-size:11px; color:var(--brand-ink-muted); margin:0 0 8px; }.document-open { font-size:11px; color:var(--brand-accent); }
@media(max-width:960px) { .document-previews { grid-template-columns:1fr; }.career-kit__grid { gap:12px; }.kit-card { padding:22px; } }
@media(max-width:640px) { .career-kit__grid { grid-template-columns:1fr; }.kit-card { min-height:0; }.kit-heading { align-items:flex-start; flex-direction:column; } }

.about-actions { display:flex; flex-wrap:wrap; gap:10px; margin-bottom:35px; }.about-actions a { border:1px solid var(--brand-line); border-radius:5px; padding:10px 16px; color:var(--brand-accent); font-size:13px; }.credentials__label { font-size:10px; letter-spacing:.15em; color:var(--brand-accent); }.credentials__grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:20px; margin-top:24px; }.credentials__grid>a { display:block; padding:28px; border:1px solid var(--brand-line); background:var(--brand-surface); border-radius:8px; text-decoration:none; }.credentials__grid span { font-size:10px; color:var(--brand-accent); }.credentials__grid h3 { margin:15px 0 10px; font-size:21px; }.credentials__grid p { color:var(--brand-ink-muted); font-size:14px; line-height:1.8; }.credentials__grid b { display:block; margin-top:22px; font-size:12px; color:var(--brand-accent); }

.journey { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:24px; margin:0 0 42px; }
.journey article { border-top:2px solid var(--brand-accent); padding:22px 0; }
.journey span { color:var(--brand-accent); font-size:10px; letter-spacing:.1em; }
.journey h2 { font-size:21px; letter-spacing:-.03em; margin:18px 0 12px; }
.journey p { color:var(--brand-ink-muted); line-height:1.9; font-size:14px; }
.journey a { color:var(--brand-accent); font-size:12px; text-decoration:none; }
@media(max-width:740px) { .journey { grid-template-columns:1fr; gap:8px; } }

/* 프로젝트 페이지와 같은 1180px. 페이지를 오갈 때 좌측 시작선이 어긋나지 않게 한다. */
.page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 28px 24px 20px;
}

.page__bio {
  margin: 0;
  max-width: 62ch;
  color: var(--brand-ink-muted);
  line-height: 1.8;
}

.block {
  margin-top: 52px;
}

.block h2 {
  margin: 0 0 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--brand-line);
  font-family: var(--font-display);
  font-size: var(--step-2);
  font-weight: 700;
  letter-spacing: -0.02em;
}

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

/* ===== 경력 안의 프로젝트 ===== */
.proj {
  list-style: none;
  margin: 18px 0 0;
  padding: 0;
  display: grid;
  gap: 20px;
}

/*
  회사와 프로젝트를 들여쓰기가 아니라 왼쪽 선으로 나눈다.
  들여쓰기만으로는 프로젝트가 3개 붙었을 때 어디까지가 한 덩어리인지
  눈으로 안 잡힌다.
*/
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

.skills {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 28px 32px;
}

.skills__group h3 {
  margin: 0 0 10px;
  font-family: var(--font-body);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--brand-ink-muted);
  font-weight: 500;
}

.skills__group ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}

.skills__group li {
  display: grid;
  grid-template-columns: 1fr 96px;
  align-items: center;
  gap: 14px;
  font-size: var(--step-0);
}

.skills__name {
  min-width: 0;
}

/* 막대 자체의 모양은 UiProgress가 갖는다. 여기서는 폭만 잡는다. */
.skills__bar {
  width: 96px;
}

@media (max-width: 640px) {
  .career > li {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  .skills {
    grid-template-columns: 1fr;
  }
}
</style>
