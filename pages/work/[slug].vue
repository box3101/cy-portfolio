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
  { label: '화면 소개', value: 'overview' },
  { label: '구현 포인트', value: 'implementation' },
  ...(story.slug === 'proposal-agent' ? [{ label: '기획·디자인', value: 'case' }] : []),
  { label: '담당 업무', value: 'role' },
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
    <StudioScreenCapture v-if="heroScreen && activeTab === 'overview'" :screen="heroScreen" eager class="entry-screen" />
    <UiTab :model-value="activeTab" :tabs="tabs" align="left" aria-label="프로젝트 소개" @update:model-value="changeTab" />
    <section class="tab-content" :aria-label="tabs.find(tab => tab.value === activeTab)?.label">
      <template v-if="activeTab === 'overview'">
        <div class="overview"><div><h2>이런 일을 돕습니다.</h2><p>{{ story.why[1] }}</p><p>{{ story.decision }}</p><UiButton variant="primary" size="xlg" @click="changeTab('implementation')">구현 포인트 보기 →</UiButton></div><aside v-if="heroScreen"><h3>첫 화면에서 할 수 있는 일</h3><ul><li v-for="point in heroScreen.points" :key="point">{{ point }}</li></ul></aside></div>
      </template>
      <template v-else-if="activeTab === 'implementation'">
        <h2>이렇게 구현했습니다.</h2><p class="lead">{{ story.approach }}</p>
        <div class="stack"><UiBadge v-for="item in story.stack" :key="item" size="sm">{{ item }}</UiBadge></div>
        <div class="features"><article v-for="(screen,index) in screens" :key="screen.src"><StudioScreenCapture :screen="screen" /><div><span class="step-number">0{{ index + 1 }}</span><h3>{{ screen.title }}</h3><p>{{ screen.description }}</p><ul><li v-for="point in screen.points" :key="point">{{ point }}</li></ul></div></article></div>
        <div class="implementation-notes"><article v-for="step in story.steps" :key="step.title"><h3>{{ step.title }}</h3><p>{{ step.body }}</p></article></div>
      </template>
      <StudioProposalCase v-else-if="activeTab === 'case'" />
      <template v-else><h2>직접 맡은 일</h2><p class="role">{{ story.role }}</p><div class="stack"><UiBadge v-for="item in story.stack" :key="item" size="sm">{{ item }}</UiBadge></div><p class="scope">{{ story.scope }}</p><UiButton v-if="story.link" as="a" :href="story.link.url" target="_blank" variant="secondary" size="xlg">{{ story.link.label }} ↗</UiButton></template>
    </section>
    <footer class="story-end"><NuxtLink to="/agents">AI 도구 모아보기</NuxtLink><NuxtLink :to="`/work/${nextStory.slug}`">{{ nextStory.name }} 살펴보기 →</NuxtLink></footer>
  </StudioWorkShell>
</template>
<style scoped>
.story-heading { margin-bottom:26px; }.story-heading h1 { margin:14px 0 16px; font-size:clamp(30px,4vw,48px); letter-spacing:-.05em; line-height:1.2; }.story-heading p { max-width:760px; color:#53657a; font-size:15px; line-height:1.8; margin:0; }.entry-screen { margin-bottom:32px; }.tab-content { padding:32px 0; }h2 { font-size:clamp(23px,2.5vw,30px); line-height:1.4; margin:0 0 18px; letter-spacing:-.04em; }h3 { font-size:18px; margin:0 0 13px; line-height:1.5; }p { color:#53657a; line-height:1.85; font-size:14px; }.overview { display:grid; grid-template-columns:1.2fr 1fr; gap:36px; }.overview aside { padding:25px; border:1px solid #dce4ee; border-radius:12px; background:#f0f4f9; }.overview :deep(button) { margin-top:14px; }ul { padding-left:18px; color:#53657a; line-height:1.9; font-size:13px; }li+li { margin-top:8px; }.stack { display:flex; flex-wrap:wrap; gap:8px; margin:20px 0 30px; }.features { display:grid; gap:35px; }.features>article { display:grid; grid-template-columns:minmax(0,1.5fr) minmax(0,1fr); gap:28px; align-items:start; }.step-number { color:#3572be; font-size:12px; display:block; margin-bottom:13px; }.implementation-notes { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:20px; margin-top:35px; padding-top:30px; border-top:1px solid #dde5ef; }.implementation-notes h3 { font-size:15px; }.implementation-notes p { font-size:13px; }.role { font-size:19px; max-width:800px; }.scope { font-size:13px; }.story-end { border-top:1px solid #dde5ef; padding-top:24px; display:flex; justify-content:space-between; gap:20px; }.story-end a { color:#285ba5; text-decoration:none; font-size:13px; }
@media(max-width:740px) { .overview,.features>article,.implementation-notes { grid-template-columns:1fr; }.story-end { flex-wrap:wrap; }.tab-content { padding-top:26px; } }
</style>
