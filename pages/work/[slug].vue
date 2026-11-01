<script setup lang="ts">
import { UiBadge, UiButton, UiTab } from '@leechanyong/ispark-ui'
import type { TabItem } from '@leechanyong/ispark-ui'
import { workStories } from '~/data/workStories'
definePageMeta({ layout: 'studio', key: route => route.params.slug as string })
const route = useRoute()
const story = workStories.find(item => item.slug === route.params.slug)
if (!story) throw createError({ statusCode: 404, statusMessage: '프로젝트를 찾을 수 없습니다.' })
const tabs: TabItem[] = [{ label:'만든 이유',value:'why' },{ label:'구현 방식',value:'approach' },{ label:'구현 과정',value:'process' },{ label:'내 역할',value:'role' }]
const tabFromQuery = () => tabs.some(tab => tab.value === route.query.tab) ? String(route.query.tab) : 'why'
const activeTab = ref(tabFromQuery())
watch(() => route.query.tab, () => { activeTab.value = tabFromQuery() })
const router = useRouter()
function changeTab(value: string) { activeTab.value = value; router.replace({ query: value === 'why' ? {} : { tab: value } }) }
const nextStory = workStories[(workStories.findIndex(item => item.slug === story.slug) + 1) % workStories.length]!
useSeoMeta({ title: `${story.name} — 만든 이야기 | 이찬용`, description: story.intro })
</script>
<template>
  <StudioWorkShell :active="story.slug">
    <div class="story-heading"><div><p class="eyebrow">PROJECT STORY / {{ story.kind }}</p><h1>{{ story.name }}</h1><p class="subtitle">{{ story.subtitle }}</p></div><UiBadge variant="primary" size="sm">{{ story.kind }}</UiBadge></div>
    <UiTab :model-value="activeTab" :tabs="tabs" align="left" aria-label="프로젝트 이야기" @update:model-value="changeTab" />
    <section class="tab-content" :aria-label="tabs.find(t => t.value === activeTab)?.label">
      <template v-if="activeTab === 'why'">
        <div class="why-grid"><div class="prose"><p class="section-label">WHY I BUILT IT</p><h2>{{ story.decision }}</h2><p v-for="paragraph in story.why" :key="paragraph">{{ paragraph }}</p><UiButton variant="primary" size="lg" @click="changeTab('approach')">구현 방식 살펴보기 →</UiButton></div><div class="preview-wrap"><StudioProjectVisual :slug="story.slug" /><p>프로젝트 구성 미리보기 · 설명용 화면</p></div></div>
      </template>
      <template v-else-if="activeTab === 'approach'">
        <p class="section-label">HOW IT WORKS</p><h2>어떻게 구성했는지.</h2><p class="approach-description">{{ story.approach }}</p><div class="stack"><UiBadge v-for="item in story.stack" :key="item" size="sm">{{ item }}</UiBadge></div>
        <div class="approach-grid"><StudioProjectVisual :slug="story.slug" /><div class="approach-points"><div v-for="(step,i) in story.steps" :key="step.title"><span>0{{ i+1 }}</span><div><h3>{{ step.title }}</h3><p>{{ step.body }}</p></div></div></div></div>
        <UiButton variant="primary" size="lg" @click="changeTab('process')">구현 과정 읽기 →</UiButton>
      </template>
      <template v-else-if="activeTab === 'process'">
        <p class="section-label">FROM IDEA TO IMPLEMENTATION</p><h2>{{ story.slug === 'team-agent' ? '복잡한 설정을 하나의 흐름으로.' : story.slug === 'proposal-agent' ? '분석 결과를 근거와 함께 검토하도록.' : '컴포넌트를 실제 제품으로 연결.' }}</h2>
        <p class="process-intro">화면과 기능을 구성한 과정을 세 가지 관점으로 정리했습니다.</p>
        <ol class="process-grid"><li v-for="(step,i) in story.steps" :key="step.title"><span class="step-number">0{{ i+1 }}</span><h3>{{ step.title }}</h3><p>{{ step.body }}</p><ul class="evidence-list"><li v-for="item in step.evidence" :key="item"><span aria-hidden="true">✓</span>{{ item }}</li></ul></li></ol>
        <aside class="decision"><span>구현에서 중요하게 본 점</span><p>{{ story.decision }}</p></aside>
      </template>
      <template v-else>
        <p class="section-label">MY CONTRIBUTION</p><h2>이 작업에서 맡은 일.</h2><p class="role">{{ story.role }}</p><div class="stack"><UiBadge v-for="item in story.stack" :key="item" size="sm">{{ item }}</UiBadge></div><aside class="decision"><span>소개 범위</span><p>{{ story.scope }}</p></aside>
        <UiButton v-if="story.link" as="a" :href="story.link.url" target="_blank" rel="noopener noreferrer" variant="primary" size="lg">{{ story.link.label }} ↗</UiButton>
      </template>
    </section>
    <div class="story-end"><p>{{ story.scope }}</p><NuxtLink :to="`/work/${nextStory.slug}`"><small>다음 이야기</small>{{ nextStory.name }} →</NuxtLink></div>
  </StudioWorkShell>
</template>
<style scoped>
.story-heading { display:flex; justify-content:space-between; align-items:flex-start; gap:15px; margin-bottom:35px; }.eyebrow,.section-label { color:#74879e; font-size:10px; letter-spacing:.12em; margin:0 0 15px; }h1 { font-size:clamp(32px,3.7vw,55px); letter-spacing:-.05em; line-height:1.1; margin:0 0 16px; }.subtitle { font-size:16px; color:#506279; margin:0; }.tab-content { padding-top:36px; min-height:480px; }h2 { font-size:clamp(23px,2.2vw,32px); line-height:1.45; letter-spacing:-.04em; margin:0 0 23px; }h3 { font-size:16px; letter-spacing:-.025em; margin:0 0 10px; }.why-grid { display:grid; grid-template-columns:1.1fr 1fr; gap:38px; align-items:start; }.prose>p:not(.section-label) { color:#53657a; font-size:14px; line-height:1.95; margin:0 0 20px; }.prose :deep(button) { margin-top:8px; }.preview-wrap { margin-top:25px; }.preview-wrap>p { text-align:right; font-size:9px; color:#7d8fa5; }.approach-description { max-width:760px; font-size:15px; color:#53657a; line-height:1.9; }.stack { display:flex; gap:7px; flex-wrap:wrap; margin:23px 0 30px; }.approach-grid { display:grid; grid-template-columns:1fr 1fr; gap:30px; align-items:center; margin-bottom:30px; }.approach-points { display:grid; gap:22px; }.approach-points>div { display:flex; gap:16px; }.approach-points>div>span { color:#3f7bc9; font-size:12px; }.approach-points p { margin:0; color:#5c6c80; font-size:12px; line-height:1.8; }.approach-points h3 { font-size:14px; margin-bottom:5px; }.process-intro { color:#63758a; font-size:13px; margin-bottom:28px; }.process-grid { list-style:none; padding:0; margin:0; display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:18px; }.process-grid>li { background:white; border:1px solid #dfe6ee; border-radius:10px; padding:24px 20px; }.step-number { display:inline-block; padding:5px 9px; border-radius:6px; font-size:14px; color:#2166d7; background:#edf4ff; margin-bottom:20px; }.process-grid>li>p { font-size:12px; line-height:1.85; color:#5c6c80; min-height:90px; }.evidence-list { list-style:none; margin:20px 0 0; padding:14px; background:#f5f8fc; border-radius:7px; display:grid; gap:12px; font-size:11px; }.evidence-list span { color:#4d87ce; margin-right:9px; }.decision { padding:22px 25px; background:#eef4fc; border:1px solid #dce7f6; border-radius:8px; margin:30px 0; }.decision>span { color:#3167ad; font-size:11px; font-weight:600; }.decision p { margin:10px 0 0; color:#365370; font-size:14px; line-height:1.8; }.role { font-size:20px; line-height:1.8; max-width:700px; }.story-end { border-top:1px solid #dfe6ee; margin-top:35px; padding-top:25px; display:flex; justify-content:space-between; gap:40px; align-items:center; }.story-end>p { font-size:10px; color:#6c7e94; max-width:600px; line-height:1.8; }.story-end a { white-space:nowrap; text-decoration:none; color:#285ba5; font-size:14px; }.story-end small { display:block; color:#7a8da6; font-size:9px; margin-bottom:5px; }
@media(max-width:1150px) { .why-grid,.approach-grid { grid-template-columns:1fr; }.preview-wrap { margin-top:0; max-width:650px; }.process-grid { grid-template-columns:1fr; }.process-grid>li>p { min-height:0; }.evidence-list { grid-template-columns:repeat(3,1fr); }.tab-content { min-height:0; } }
@media(max-width:600px) { .story-heading { display:block; }.story-heading :deep(.ui-badge) { margin-top:15px; }.subtitle { font-size:14px; }.story-end { flex-direction:column; align-items:flex-start; gap:15px; }.evidence-list { grid-template-columns:1fr; }.decision { padding:20px; }.prose>p:not(.section-label) { font-size:13px; } }
</style>
