<script setup lang="ts">
import { UiBadge, UiButton, UiTab } from '@leechanyong/ispark-ui'
import type { TabItem } from '@leechanyong/ispark-ui'
import { workStories } from '~/data/workStories'
import { workScreens } from '~/data/workScreens'
definePageMeta({ layout: 'studio', key: route => route.params.slug as string })
const route = useRoute()
const router = useRouter()
const story = workStories.find(item => item.slug === route.params.slug)
if (!story) throw createError({ statusCode: 404, statusMessage: '프로젝트를 찾을 수 없습니다.' })
const screens = workScreens[story.slug] ?? []
const heroScreen = screens[0]
const tabs: TabItem[] = [
  { label: '프로젝트 소개', value: 'overview' },
  { label: '구현 포인트', value: 'implementation' },
  ...(story.slug === 'proposal-agent' ? [{ label: '기획·디자인', value: 'case' }] : []),
]
const tabFromQuery = () => {
  const value = String(route.query.tab ?? '')
  if (['approach', 'process'].includes(value)) return 'implementation'
  return tabs.some(tab => tab.value === value) ? value : 'overview'
}
const activeTab = ref(tabFromQuery())
watch(() => route.query.tab, () => { activeTab.value = tabFromQuery() })
function changeTab(value: string) { activeTab.value = value; void router.replace({ query: value === 'overview' ? {} : { tab: value } }) }
const nextStory = workStories[(workStories.findIndex(item => item.slug === story.slug) + 1) % workStories.length]!
useSeoMeta({ title: `${story.name} — 이찬용`, description: story.intro })
</script>
<template>
  <StudioWorkShell :active="story.slug">
    <header class="story-heading">
      <h1>{{ story.slug === 'proposal-agent' ? '제안서 AI 에이전트' : story.name }}</h1>
      <p>{{ story.slug === 'proposal-agent' ? 'RFP 분석부터 제안의 스토리까지, 복잡한 업무를 하나의 흐름으로.' : story.subtitle }}</p>
    </header>
    <dl class="article-meta">
      <div><dt>{{ story.slug === 'proposal-agent' ? 'ROLE' : 'TYPE' }}</dt><dd>{{ story.slug === 'proposal-agent' ? '기획 · UI/UX · 프론트엔드' : story.kind }}</dd></div>
      <div><dt>STACK</dt><dd>{{ story.stack.join(' · ') }}</dd></div>
      <div><dt>{{ story.slug === 'proposal-agent' ? 'STATUS' : 'PROJECT' }}</dt><dd>{{ story.slug === 'proposal-agent' ? '개발 중' : story.name }}</dd></div>
    </dl>
    <StudioScreenCapture v-if="heroScreen" :screen="heroScreen" eager class="entry-screen" />
    <UiTab class="article-index" :model-value="activeTab" :tabs="tabs" align="left" aria-label="프로젝트 소개" @update:model-value="changeTab" />
    <section class="tab-content" :aria-label="tabs.find(tab => tab.value === activeTab)?.label">
      <template v-if="activeTab === 'overview'">
        <div class="overview">
          <article>
            <h2>{{ story.slug === 'proposal-agent' ? '많은 자료보다, 중요한 판단을 돕는 도구' : story.subtitle }}</h2>
            <p v-for="paragraph in story.why" :key="paragraph">{{ paragraph }}</p>
            <blockquote>{{ story.slug === 'proposal-agent' ? 'AI의 제안과 사용자의 판단이 함께 남도록.' : story.decision }}</blockquote>
            <button class="article-more" type="button" @click="changeTab('implementation')">구현 과정 읽기 →</button>
          </article>
          <aside class="article-notes">
            <h2>PROJECT NOTES</h2>
            <section><h3>담당 범위</h3><p>{{ story.role }}</p><p class="scope">{{ story.scope }}</p></section>
            <section v-if="heroScreen"><h3>핵심 기능</h3><ul><li v-for="point in heroScreen.points" :key="point">{{ point }}</li></ul></section>
            <section v-if="story.link"><h3>관련 링크</h3><a :href="story.link.url" target="_blank" rel="noopener noreferrer">{{ story.link.label }} ↗</a></section>
          </aside>
        </div>
      </template>
      <template v-else-if="activeTab === 'implementation'">
        <h2>구현 방식</h2><p class="lead">{{ story.approach }}</p>
        <div class="features"><article v-for="screen in screens" :key="screen.src"><StudioScreenCapture :screen="screen" hide-title /><div class="feature-copy"><h3>{{ screen.title }}</h3><p>{{ screen.description }}</p><ul><li v-for="point in screen.points" :key="point">{{ point }}</li></ul></div></article></div>
        <div class="implementation-notes"><article v-for="step in story.steps" :key="step.title"><h3>{{ step.title }}</h3><p>{{ step.body }}</p></article></div>
      </template>
      <StudioProposalCase v-else-if="activeTab === 'case'" />
    </section>
    <nav class="story-end" aria-label="다른 프로젝트"><NuxtLink to="/agents">전체 도구 보기</NuxtLink><NuxtLink :to="`/work/${nextStory.slug}`"><span class="next-label">다음 프로젝트</span>{{ nextStory.name }} →</NuxtLink></nav>
  </StudioWorkShell>
</template>
<style scoped>
.story-heading { margin-bottom:26px; }.story-heading h1 { margin:14px 0 16px; font-size:clamp(30px,4vw,48px); letter-spacing:-.05em; line-height:1.2; }.story-heading p { max-width:760px; color:#53657a; font-size:15px; line-height:1.8; margin:0; }.entry-screen { margin-bottom:32px; }.tab-content { padding:32px 0; }h2 { font-size:clamp(23px,2.5vw,30px); line-height:1.4; margin:0 0 18px; letter-spacing:-.04em; }h3 { font-size:18px; margin:0 0 13px; line-height:1.5; }p { color:#53657a; line-height:1.85; font-size:14px; }.overview { display:grid; grid-template-columns:minmax(0,1.3fr) minmax(0,1fr); gap:40px; align-items:start; }.overview p { margin:0 0 12px; max-width:64ch; }.overview aside ul { margin:0; list-style:disc; }.overview li::marker { color:#7188a5; }.overview aside { padding:25px; border:1px solid #dce4ee; border-radius:12px; background:#f0f4f9; }.overview :deep(button) { margin-top:14px; }ul { padding-left:18px; color:#53657a; line-height:1.9; font-size:13px; }li+li { margin-top:8px; }.stack { display:flex; flex-wrap:wrap; gap:8px; margin:20px 0 30px; }.features { display:grid; gap:35px; }.features>article { display:grid; grid-template-columns:minmax(0,1.5fr) minmax(0,1fr); gap:28px; align-items:start; }.step-number { color:#3572be; font-size:12px; display:block; margin-bottom:13px; }.implementation-notes { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:20px; margin-top:35px; padding-top:30px; border-top:1px solid #dde5ef; }.implementation-notes h3 { font-size:15px; }.implementation-notes p { font-size:13px; }.role { font-size:19px; max-width:800px; }.scope { font-size:13px; }.story-end { border-top:1px solid #dde5ef; padding-top:24px; display:flex; justify-content:space-between; gap:20px; }.story-end a { display:flex; align-items:center; gap:12px; min-height:44px; color:#285ba5; text-decoration:none; font-size:14px; }.story-end a:hover { text-decoration:underline; text-underline-offset:4px; }.next-label { color:#66778d; font-size:12px; }
.project-facts { display:grid; grid-template-columns:minmax(0,1.3fr) minmax(0,1fr); gap:32px; margin-top:28px; padding-top:24px; border-top:1px solid #dde5ef; }
.project-facts h3 { font-size:15px; margin-bottom:8px; }
.project-facts p { margin:0 0 8px; }
.project-facts .stack { margin:0 0 16px; }
.features { margin-top:24px; gap:24px; }
.features>article { align-items:center; gap:24px; }
.feature-copy { padding:20px; border:1px solid #e2e8ef; border-radius:10px; background:#f8fafc; }
.feature-copy p { margin:0 0 12px; }
.feature-copy ul { list-style:disc; margin:0; padding-left:18px; }
.feature-copy li+li { margin-top:4px; }
.lead { margin:0; max-width:80ch; }
.implementation-notes { margin-top:24px; padding-top:24px; }
@media(max-width:740px) { .overview,.features>article,.implementation-notes,.project-facts { grid-template-columns:1fr; }.story-end { flex-wrap:wrap; }.tab-content { padding-top:24px; }.overview,.project-facts { gap:20px; }.feature-copy { padding:16px; }.next-label { display:none; } }

/* Newspaper feature article. Product screenshots retain their original colors. */
.story-heading { margin:0 0 24px; }
.story-heading h1 { font-family:var(--journal-heading); font-size:clamp(38px,5.7vw,82px); font-weight:800; line-height:1.3; margin:0 0 12px; letter-spacing:-.055em; }
.story-heading p { max-width:none; font-family:var(--journal-heading); font-size:clamp(17px,1.9vw,26px); font-weight:500; color:var(--brand-ink); line-height:1.65; }
.article-meta { display:flex; flex-wrap:wrap; gap:16px 28px; justify-content:space-between; padding:18px 4px; margin:0 0 24px; border-block:1px solid var(--journal-rule); }
.article-meta > div { display:flex; align-items:baseline; gap:14px; }
.article-meta dt { font:700 16px var(--journal-serif); }
.article-meta dd { margin:0; font-size:14px; }
.entry-screen { margin:0 0 26px; }
.entry-screen :deep(.screen-link),.features :deep(.screen-link) { border-radius:0; box-shadow:none; border-color:var(--journal-rule); }
.article-index :deep(.ui-tab-inner) { display:flex; justify-content:center; width:100%; }
.article-index :deep(.ui-tab-item) { flex:1; max-width:280px; padding:20px 12px; background:transparent; font-size:17px; color:var(--brand-ink); }
.article-index :deep(.ui-tab-item.is-active) { color:var(--brand-accent); }
.article-index :deep(.ui-tab-item-label) { white-space:nowrap; }
@media(max-width:740px) { .article-index :deep(.ui-tab-item) { font-size:12px; padding:16px 4px; } }
:deep(.screen-link) { border:1px solid var(--journal-rule); border-radius:0; box-shadow:none; }
:deep(.screen-capture figcaption) { justify-content:flex-start; flex-wrap:wrap; gap:8px 16px; color:var(--brand-ink); line-height:1.6; }
.entry-screen :deep(figcaption)::before { content:'FIG. 01 —'; font-family:var(--journal-serif); font-weight:700; }
:deep(.screen-capture small) { color:var(--brand-ink-muted); white-space:normal; }
:deep(.expand) { border-radius:0; }
:deep(.ui-tab) { border-top:1px solid var(--journal-rule); }
:deep([role='tablist']) { display:flex; justify-content:center; }
:deep([role='tab']) { font-size:16px; padding:18px 28px; }
.tab-content { border-top:4px double var(--brand-ink); padding:30px 0; }
h2,h3 { font-family:var(--journal-heading); color:var(--brand-ink); }
h2 { font-weight:800; }
p,ul { color:var(--brand-ink); }
.overview { grid-template-columns:minmax(0,2.2fr) minmax(240px,1fr); gap:32px; }
.overview > article { min-width:0; }
.overview h2 { font-size:clamp(24px,2.2vw,32px); line-height:1.55; }
.overview p { font-size:16px; line-height:1.95; margin:0 0 16px; }
.overview blockquote { margin:24px 0; padding:0 0 0 20px; border-left:3px solid var(--brand-accent); color:var(--brand-accent); font-family:var(--journal-heading); font-size:clamp(19px,2vw,26px); font-weight:600; line-height:1.7; }
.overview .article-notes { padding:0 0 0 28px; border:0; border-left:1px solid var(--journal-rule); border-radius:0; background:transparent; }
.article-notes > h2 { font-family:var(--journal-serif); font-size:22px; letter-spacing:.02em; margin:0; padding-bottom:12px; }
.article-notes section { border-top:1px solid var(--journal-rule); padding:20px 0; }
.article-notes h3 { font-size:21px; font-weight:700; }
.article-notes p { font-size:14px; line-height:1.85; }
.article-notes .scope { color:var(--brand-ink-muted); font-size:12px; }
.article-notes ul { padding-left:18px; font-size:14px; }
.article-notes li::marker { color:var(--brand-accent); }
.article-notes a,.article-more { color:var(--brand-accent); font-size:14px; text-decoration:none; }
.article-more { padding:8px 0; min-height:44px; border:0; background:transparent; cursor:pointer; }
.feature-copy { background:transparent; border:0; border-left:1px solid var(--brand-line); border-radius:0; }
.story-end { border-top:1px solid var(--journal-rule); }
.story-end a { color:var(--brand-accent); }
@media(max-width:740px) { .story-heading h1 { font-size:clamp(30px,8vw,48px); }.story-heading p { font-size:17px; }.article-meta { gap:12px; }.article-meta > div { width:100%; }.article-meta dt { min-width:58px; font-size:13px; }.article-meta dd { font-size:12px; }.overview { grid-template-columns:1fr; gap:24px; }.overview .article-notes { border-left:0; border-top:3px double var(--journal-rule); padding:20px 0 0; }.overview p { font-size:15px; }:deep([role='tab']) { font-size:12px; padding:16px 10px; }.tab-content { padding-top:24px; }.feature-copy { padding:16px 0 0; border-left:0; border-top:1px solid var(--brand-line); } }
</style>
