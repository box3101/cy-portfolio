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
    <header class="story-heading"><UiBadge variant="primary" size="sm">{{ story.kind }}</UiBadge><h1>{{ story.name }}</h1><p>{{ story.intro }}</p></header>
    <UiTab :model-value="activeTab" :tabs="tabs" align="left" aria-label="프로젝트 소개" @update:model-value="changeTab" />
    <section class="tab-content" :aria-label="tabs.find(tab => tab.value === activeTab)?.label">
      <template v-if="activeTab === 'overview'">
        <StudioScreenCapture v-if="heroScreen" :screen="heroScreen" eager class="entry-screen" />
        <div class="overview"><div><h2>어떤 도구인가요?</h2><p>{{ story.why[1] }}</p><p>{{ story.decision }}</p><UiButton variant="primary" size="xlg" @click="changeTab('implementation')">구현 포인트 보기 →</UiButton></div><aside v-if="heroScreen"><h3>주요 기능</h3><ul><li v-for="point in heroScreen.points" :key="point">{{ point }}</li></ul></aside></div>
        <div class="project-facts">
          <div><h3>담당 업무</h3><p>{{ story.role }}</p><p class="scope">{{ story.scope }}</p></div>
          <div><h3>사용 기술</h3><div class="stack"><UiBadge v-for="item in story.stack" :key="item" size="sm">{{ item }}</UiBadge></div><UiButton v-if="story.link" as="a" :href="story.link.url" target="_blank" rel="noopener noreferrer" variant="secondary">{{ story.link.label }} ↗</UiButton></div>
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
</style>
